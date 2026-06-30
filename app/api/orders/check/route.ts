import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";
import { PENDING_ORDER_TIMEOUT_MINUTES } from "@/lib/orders";

/**
 * GET /api/orders/check?numero=VQ-XXXXX
 *
 * Retorna status do pedido + dados do Pix (qr_code, ticket_url)
 * Usado pelo polling da página de sucesso.
 */
export async function GET(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ paid: false }, { status: 401 });
  }

  const url = new URL(request.url);
  const numero = url.searchParams.get("numero");

  if (!numero) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: numero },
    select: { id: true, customerId: true, status: true, paidAt: true, notes: true, paymentMethod: true, createdAt: true },
  });

  if (!order || order.customerId !== session.id) {
    return NextResponse.json({ paid: false }, { status: 404 });
  }

  // Expiração sob demanda: se este pedido ainda está PENDING e já passou do
  // prazo de pagamento, cancela agora. O Mercado Pago não notifica quando um
  // Pix expira sem pagamento, então a varredura tem que ser nossa.
  let status = order.status;
  if (status === "PENDING") {
    const ageMs = Date.now() - new Date(order.createdAt).getTime();
    if (ageMs > PENDING_ORDER_TIMEOUT_MINUTES * 60 * 1000) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", paymentStatus: "expired" },
      });
      status = "CANCELLED";
    }
  }

  const paid = status === "PAYMENT_APPROVED" || !!order.paidAt;

  // Parse pix data do campo notes
  let pixData = null;
  if (order.paymentMethod === "pix" && order.notes) {
    try {
      pixData = JSON.parse(order.notes);
    } catch {
      pixData = null;
    }
  }

  return NextResponse.json({
    paid,
    status,
    pixData,
    expired: status === "CANCELLED" && !order.paidAt,
  });
}
