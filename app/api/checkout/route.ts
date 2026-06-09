import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";
import { createPixOrder, createCardOrder, getPublicKey } from "@/lib/mercadopago";

export async function GET() {
  return NextResponse.json({ publicKey: getPublicKey() });
}

export async function POST(request: Request) {
  console.log("[CHECKOUT] Iniciado");

  const session = await getCustomerSession();
  if (!session) {
    console.log("[CHECKOUT] Sem sessão");
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("[CHECKOUT] Body recebido:", JSON.stringify({ ...body, cardToken: body.cardToken ? "***" : null }));

    const {
      address,
      shippingMethod,
      shippingCost,
      shippingDeadline,
      paymentMethod,
      cardToken,
      installments = 1,
    } = body;

    if (!paymentMethod) {
      return NextResponse.json({ error: "Método de pagamento obrigatório." }, { status: 400 });
    }

    // Busca carrinho
    const cart = await prisma.cart.findUnique({
      where: { customerId: session.id },
      include: {
        items: { include: { product: true, variant: true } },
      },
    });

    if (!cart || cart.items.length === 0) {
      console.log("[CHECKOUT] Carrinho vazio");
      return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
    }

    // Cria endereço se não for retirada
    let addressId: string | null = null;
    if (shippingMethod !== "RETIRADA") {
      if (!address || !address.cep || !address.street || !address.number) {
        return NextResponse.json({ error: "Endereço incompleto." }, { status: 400 });
      }

      const customer = await prisma.customer.findUnique({ where: { id: session.id } });
      if (!customer) {
        return NextResponse.json({ error: "Cliente não encontrado." }, { status: 404 });
      }

      const newAddress = await prisma.address.create({
        data: {
          customerId: session.id,
          recipientName: customer.name,
          cep: address.cep.replace(/\D/g, ""),
          street: address.street,
          number: address.number,
          complement: address.complement || null,
          neighborhood: address.neighborhood || "",
          city: address.city || "",
          state: address.state || "",
        },
      });
      addressId = newAddress.id;
      console.log("[CHECKOUT] Endereço criado:", addressId);
    }

    // Calcula totais
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
      return sum + price * item.quantity;
    }, 0);

    const shipping = shippingMethod === "RETIRADA" ? 0 : Number(shippingCost) || 0;
    const total = subtotal + shipping;
    console.log("[CHECKOUT] Totais — subtotal:", subtotal, "frete:", shipping, "total:", total);

    // Número do pedido
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count = await prisma.order.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    });
    const orderNumber = `VQ-${today}-${String(count + 1).padStart(3, "0")}`;

    // Cria pedido no banco
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        subtotal,
        shippingCost: shipping,
        total,
        shippingMethod: shippingMethod || null,
        shippingDeadline: shippingDeadline || null,
        paymentMethod,
        customerId: session.id,
        addressId,
        items: {
          create: cart.items.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.variant ? item.variant.price : item.product.price,
            productName: item.product.name,
            productImage: item.product.mainImage,
            variantName: item.variant?.name || null,
            productId: item.productId,
            variantId: item.variantId,
          })),
        },
      },
    });
    console.log("[CHECKOUT] Pedido criado:", order.orderNumber);

    // URL do webhook
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://valquaresma.up.railway.app";
    const notificationUrl = `${baseUrl}/api/webhooks/mercadopago`;

    const customer = await prisma.customer.findUnique({ where: { id: session.id } });
    const realEmail = customer?.email || session.email;

    // O sandbox do Mercado Pago exige email @testuser.com.
    // Em produção, troque MP_SANDBOX para "false" no Railway.
    const isSandbox = process.env.MP_SANDBOX !== "false";
    const payerEmail = isSandbox ? "test_user_valquaresma@testuser.com" : realEmail;
    console.log("[CHECKOUT] Sandbox:", isSandbox, "| Payer:", payerEmail);

    const mpItems = cart.items.map((item) => ({
      title: item.variant ? `${item.product.name} — ${item.variant.name}` : item.product.name,
      quantity: item.quantity,
      unitPrice: Number(item.variant ? item.variant.price : item.product.price),
      pictureUrl: item.product.mainImage,
    }));

    // Processa pagamento
    let mpResponse;
    try {
      console.log("[CHECKOUT] Chamando MP — método:", paymentMethod);
      if (paymentMethod === "pix") {
        mpResponse = await createPixOrder({
          type: "pix",
          externalReference: order.id,
          items: mpItems,
          totalAmount: total,
          payerEmail,
          notificationUrl,
        });
      } else if (paymentMethod === "credit_card") {
        if (!cardToken) {
          return NextResponse.json({ error: "Token do cartão obrigatório." }, { status: 400 });
        }
        mpResponse = await createCardOrder({
          type: "credit_card",
          externalReference: order.id,
          items: mpItems,
          totalAmount: total,
          token: cardToken,
          installments,
          payerEmail,
          notificationUrl,
        });
      } else {
        return NextResponse.json({ error: "Método de pagamento inválido." }, { status: 400 });
      }
      console.log("[CHECKOUT] MP respondeu:", mpResponse.status);
    } catch (mpError) {
      console.error("[CHECKOUT_MP_ERROR]", mpError);
      // Pedido foi criado mas pagamento falhou — marca como cancelado
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", paymentStatus: "error" },
      });
      const msg = mpError instanceof Error ? mpError.message : "Erro ao processar pagamento";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    // Atualiza pedido com dados do MP
    const mpPayment = mpResponse.transactions?.payments?.[0];
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mpOrderId: mpResponse.id,
        mpPaymentId: mpPayment?.id || null,
        paymentStatus: mpPayment?.status || mpResponse.status,
        ...(mpPayment?.status === "approved"
          ? { status: "PAYMENT_APPROVED", paidAt: new Date() }
          : {}),
      },
    });

    // Limpa carrinho só se pagamento foi processado
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: mpResponse.status,
      paymentMethod,
      pix:
        paymentMethod === "pix"
          ? {
              qrCode: mpPayment?.point_of_interaction?.transaction_data?.qr_code,
              qrCodeBase64: mpPayment?.point_of_interaction?.transaction_data?.qr_code_base64,
              ticketUrl: mpPayment?.point_of_interaction?.transaction_data?.ticket_url,
            }
          : null,
    });
  } catch (error) {
    console.error("[CHECKOUT_FATAL_ERROR]", error);
    const msg = error instanceof Error ? error.message : "Erro ao processar pedido.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
