import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrder } from "@/lib/mercadopago";
import { createHmac } from "crypto";

/**
 * Valida a assinatura do webhook do Mercado Pago
 * Fórmula oficial: HMAC-SHA256("id:{data.id};request-id:{x-request-id};ts:{ts};", secret)
 */
function validateSignature(request: Request, body: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.log("[WEBHOOK] MP_WEBHOOK_SECRET não configurado — validação desabilitada");
    return true;
  }

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!xSignature || !xRequestId) {
    console.log("[WEBHOOK] Headers de assinatura ausentes");
    return false;
  }

  const parts: Record<string, string> = {};
  xSignature.split(",").forEach((part) => {
    const [key, value] = part.trim().split("=");
    if (key && value) parts[key] = value;
  });

  const ts = parts["ts"];
  const v1 = parts["v1"];

  if (!ts || !v1) {
    console.log("[WEBHOOK] ts ou v1 ausentes na assinatura");
    return false;
  }

  // Extrai data.id do body para montar o manifest correto
  let dataId = "";
  try {
    const parsed = JSON.parse(body);
    dataId = parsed.data?.id?.toString() || "";
  } catch {
    return false;
  }

  // Fórmula oficial do MP: id:{data.id};request-id:{x-request-id};ts:{ts};
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac = createHmac("sha256", secret).update(manifest).digest("hex");

  const valid = hmac === v1;
  if (!valid) {
    console.log("[WEBHOOK] Assinatura inválida. manifest:", manifest, "| calculado:", hmac, "| esperado:", v1);
  }
  return valid;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Valida assinatura (segurança)
    if (!validateSignature(request, rawBody)) {
      console.warn("[WEBHOOK] Assinatura inválida — ignorado");
      return NextResponse.json({ received: true });
    }

    const body = JSON.parse(rawBody);
    const resourceId = body.data?.id || body.resource;

    if (!resourceId) {
      return NextResponse.json({ received: true });
    }

    // Busca o pedido no Mercado Pago para confirmar o status real
    let mpOrder;
    try {
      mpOrder = await getOrder(resourceId.toString());
    } catch {
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

    // Atualiza o status
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

    console.log(`[WEBHOOK] Pedido ${order.orderNumber} → ${paymentStatus}`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return NextResponse.json({ received: true });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
