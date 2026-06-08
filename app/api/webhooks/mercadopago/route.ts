import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrder } from "@/lib/mercadopago";

/**
 * Webhook do Mercado Pago
 *
 * O MP envia um POST quando o status de um pagamento muda.
 * Verificamos o pedido no MP e atualizamos nosso banco.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // O webhook pode ter diferentes tipos de notificação
    const topic = body.type || body.topic;
    const resourceId = body.data?.id || body.resource;

    if (!resourceId) {
      return NextResponse.json({ received: true });
    }

    // Busca o pedido no Mercado Pago para confirmar o status
    let mpOrder;
    try {
      mpOrder = await getOrder(resourceId.toString());
    } catch {
      // Pode ser uma notificação de teste ou formato diferente
      console.log("[WEBHOOK] Não foi possível buscar order:", resourceId);
      return NextResponse.json({ received: true });
    }

    if (!mpOrder.external_reference) {
      return NextResponse.json({ received: true });
    }

    // Busca o pedido no nosso banco
    const order = await prisma.order.findUnique({
      where: { id: mpOrder.external_reference },
    });

    if (!order) {
      console.log("[WEBHOOK] Pedido não encontrado:", mpOrder.external_reference);
      return NextResponse.json({ received: true });
    }

    // Atualiza o status baseado na resposta do MP
    const mpPayment = mpOrder.transactions?.payments?.[0];
    const paymentStatus = mpPayment?.status || mpOrder.status;

    const updateData: Record<string, unknown> = {
      paymentStatus,
      mpPaymentId: mpPayment?.id || order.mpPaymentId,
    };

    if (paymentStatus === "approved") {
      updateData.status = "PAYMENT_APPROVED";
      updateData.paidAt = new Date();
    } else if (paymentStatus === "rejected" || paymentStatus === "cancelled") {
      updateData.status = "CANCELLED";
    }

    await prisma.order.update({
      where: { id: order.id },
      data: updateData,
    });

    console.log(`[WEBHOOK] Pedido ${order.orderNumber} atualizado: ${paymentStatus}`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return NextResponse.json({ received: true });
  }
}

// MP pode enviar GET para verificar se o endpoint existe
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
