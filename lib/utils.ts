/**
 * Utilitários gerais do projeto
 */

/**
 * Formata um valor numérico (ou Decimal do Prisma) em moeda BRL.
 *
 * Aceita number OU string (Prisma Decimal vem como string em JSON)
 * para evitar erros de tipagem ao serializar do Server Component.
 *
 * Exemplo: 289.9 → "R$ 289,90"
 */
export function formatPrice(value: number | string): string {
  const numeric = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
}

/**
 * Gera um link do WhatsApp com mensagem pré-preenchida.
 * Útil em CTAs de produtos: "quero saber mais sobre X".
 */
export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
