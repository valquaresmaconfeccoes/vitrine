import { prisma } from "@/lib/db";

/**
 * Tempo limite para pagamento de um pedido PENDING (em minutos).
 * Após esse prazo sem confirmação, o pedido é cancelado automaticamente.
 */
export const PENDING_ORDER_TIMEOUT_MINUTES = 30;

/**
 * Cancela pedidos que ficaram PENDING além do prazo de pagamento.
 *
 * Por que "lazy" (sob demanda) em vez de cron:
 * - O Mercado Pago NÃO envia webhook quando um Pix simplesmente expira sem
 *   pagamento. Logo, sem uma varredura nossa, o pedido fica PENDING para
 *   sempre — era exatamente o bug relatado (pedido não cancelava e não saía
 *   da tela do admin).
 * - O Railway não oferece cron confiável no plano padrão. Em vez de um worker
 *   separado, chamamos esta função nos pontos que já são acessados com
 *   frequência: o polling da tela de pagamento e o carregamento da lista de
 *   pedidos no admin. Assim a limpeza acontece naturalmente.
 *
 * Segurança quanto a estoque:
 * - O estoque só é decrementado quando o pagamento é APROVADO (no webhook).
 *   Um pedido PENDING nunca reservou estoque, então cancelá-lo NÃO exige
 *   devolver nada. Operação simples e sem efeitos colaterais.
 *
 * Idempotente: só afeta pedidos ainda PENDING e mais antigos que o limite.
 *
 * @returns quantidade de pedidos cancelados nesta varredura
 */
export async function expireStalePendingOrders(): Promise<number> {
  const cutoff = new Date(Date.now() - PENDING_ORDER_TIMEOUT_MINUTES * 60 * 1000);

  try {
    const result = await prisma.order.updateMany({
      where: {
        status: "PENDING",
        createdAt: { lt: cutoff },
      },
      data: {
        status: "CANCELLED",
        paymentStatus: "expired",
      },
    });

    if (result.count > 0) {
      console.log(`[ORDERS] ${result.count} pedido(s) pendente(s) cancelado(s) por expiração (>${PENDING_ORDER_TIMEOUT_MINUTES}min).`);
    }

    return result.count;
  } catch (error) {
    // Falha na limpeza nunca deve derrubar a página que a chamou.
    console.error("[ORDERS] Erro ao expirar pedidos pendentes:", error);
    return 0;
  }
}
