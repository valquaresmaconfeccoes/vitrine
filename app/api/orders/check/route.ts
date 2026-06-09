import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/orders/check?numero=VQ-XXXXX
 *
 * Usado pelo polling da página de sucesso.
 * Retorna { paid: true } quando o webhook do MP atualiza o status para PAYMENT_APPROVED.
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
    select: { customerId: true, status: true, paidAt: true },
  });

  if (!order || order.customerId !== session.id) {
    return NextResponse.json({ paid: false }, { status: 404 });
  }

  const paid = order.status === "PAYMENT_APPROVED" || !!order.paidAt;

  return NextResponse.json({ paid, status: order.status });
}
