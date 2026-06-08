import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";
import { createPixOrder, createCardOrder, getPublicKey } from "@/lib/mercadopago";

// GET — Retorna a public key do MP para o frontend
export async function GET() {
  return NextResponse.json({ publicKey: getPublicKey() });
}

// POST — Processa checkout
export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const {
      addressId,
      shippingMethod,
      shippingCost,
      shippingDeadline,
      paymentMethod,
      cardToken,
      installments = 1,
    } = await request.json();

    // Busca carrinho com itens
    const cart = await prisma.cart.findUnique({
      where: { customerId: session.id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
    }

    // Valida endereço (obrigatório se não for retirada)
    if (shippingMethod !== "RETIRADA" && !addressId) {
      return NextResponse.json({ error: "Endereço obrigatório para entrega." }, { status: 400 });
    }

    // Calcula subtotal
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant
        ? Number(item.variant.price)
        : Number(item.product.price);
      return sum + price * item.quantity;
    }, 0);

    const shipping = shippingMethod === "RETIRADA" ? 0 : Number(shippingCost) || 0;
    const total = subtotal + shipping;

    // Gera número do pedido: VQ-YYYYMMDD-XXX
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
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
        addressId: addressId || null,
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

    // Monta URL do webhook
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://valquaresma.up.railway.app";
    const notificationUrl = `${baseUrl}/api/webhooks/mercadopago`;

    // Busca cliente completo
    const customer = await prisma.customer.findUnique({
      where: { id: session.id },
    });

    // Processa pagamento no Mercado Pago
    let mpResponse;
    const mpItems = cart.items.map((item) => ({
      title: item.variant
        ? `${item.product.name} — ${item.variant.name}`
        : item.product.name,
      quantity: item.quantity,
      unitPrice: Number(item.variant ? item.variant.price : item.product.price),
      pictureUrl: item.product.mainImage,
    }));

    if (paymentMethod === "pix") {
      mpResponse = await createPixOrder({
        type: "pix",
        externalReference: order.id,
        items: mpItems,
        totalAmount: total,
        payerEmail: customer?.email || session.email,
        notificationUrl,
      });
    } else {
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
        payerEmail: customer?.email || session.email,
        notificationUrl,
      });
    }

    // Atualiza pedido com dados do MP
    const mpPayment = mpResponse.transactions?.payments?.[0];
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mpOrderId: mpResponse.id,
        mpPaymentId: mpPayment?.id || null,
        paymentStatus: mpPayment?.status || mpResponse.status,
        ...(mpPayment?.status === "approved" ? { status: "PAYMENT_APPROVED", paidAt: new Date() } : {}),
      },
    });

    // Limpa o carrinho
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Retorna dados relevantes para o frontend
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: mpResponse.status,
      paymentMethod,
      // Dados para Pix (QR code)
      pix: paymentMethod === "pix" ? {
        qrCode: mpPayment?.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: mpPayment?.point_of_interaction?.transaction_data?.qr_code_base64,
        ticketUrl: mpPayment?.point_of_interaction?.transaction_data?.ticket_url,
      } : null,
    });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json({ error: "Erro ao processar pagamento." }, { status: 500 });
  }
}
