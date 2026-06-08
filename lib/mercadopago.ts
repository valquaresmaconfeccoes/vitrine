/**
 * mercadopago.ts — Integração com a API de Orders do Mercado Pago
 *
 * Usa fetch() direto (sem SDK) porque a API de Orders é mais nova
 * e o SDK oficial nem sempre tem suporte completo.
 *
 * Fluxo:
 * 1. Frontend tokeniza o cartão com MercadoPago.js
 * 2. Backend cria uma Order com o token → pagamento processado
 * 3. MP envia webhook quando status muda
 *
 * Ambientes:
 * - Teste: usa Access Token de teste (APP_USR-...)
 * - Produção: troca o Access Token pelas credenciais produtivas
 */

const MP_BASE_URL = "https://api.mercadopago.com";
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";

interface OrderItem {
  title: string;
  quantity: number;
  unitPrice: number;
  pictureUrl?: string;
}

interface PixPaymentData {
  type: "pix";
  externalReference: string;
  items: OrderItem[];
  totalAmount: number;
  payerEmail: string;
  notificationUrl: string;
}

interface CardPaymentData {
  type: "credit_card";
  externalReference: string;
  items: OrderItem[];
  totalAmount: number;
  token: string;
  installments: number;
  payerEmail: string;
  notificationUrl: string;
}

export interface MpOrderResponse {
  id: string;
  status: string;
  status_detail: string;
  external_reference: string;
  transactions?: {
    payments?: Array<{
      id: string;
      status: string;
      status_detail: string;
      payment_method: {
        id: string;
        type: string;
      };
      amount: string;
      // Pix
      point_of_interaction?: {
        transaction_data?: {
          qr_code?: string;
          qr_code_base64?: string;
          ticket_url?: string;
        };
      };
    }>;
  };
}

// Cabeçalhos padrão
function headers() {
  return {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    "X-Idempotency-Key": crypto.randomUUID(),
  };
}

// Criar pedido com Pix
export async function createPixOrder(data: PixPaymentData): Promise<MpOrderResponse> {
  const body = {
    type: "online",
    processing_mode: "automatic",
    total_amount: data.totalAmount.toFixed(2),
    external_reference: data.externalReference,
    payer: {
      email: data.payerEmail,
    },
    transactions: {
      payments: [
        {
          amount: data.totalAmount.toFixed(2),
          payment_method: {
            id: "pix",
            type: "bank_transfer",
          },
        },
      ],
    },
    notification_url: data.notificationUrl,
  };

  const res = await fetch(`${MP_BASE_URL}/v1/orders`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("[MP_PIX_ERROR]", res.status, error);
    throw new Error(`Mercado Pago error: ${res.status}`);
  }

  return res.json();
}

// Criar pedido com Cartão de Crédito
export async function createCardOrder(data: CardPaymentData): Promise<MpOrderResponse> {
  const body = {
    type: "online",
    processing_mode: "automatic",
    total_amount: data.totalAmount.toFixed(2),
    external_reference: data.externalReference,
    payer: {
      email: data.payerEmail,
    },
    transactions: {
      payments: [
        {
          amount: data.totalAmount.toFixed(2),
          payment_method: {
            id: "master", // O MP detecta a bandeira pelo token
            type: "credit_card",
            token: data.token,
            installments: data.installments,
          },
        },
      ],
    },
    notification_url: data.notificationUrl,
  };

  const res = await fetch(`${MP_BASE_URL}/v1/orders`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("[MP_CARD_ERROR]", res.status, error);
    throw new Error(`Mercado Pago error: ${res.status}`);
  }

  return res.json();
}

// Buscar pedido pelo ID (para verificação no webhook)
export async function getOrder(orderId: string): Promise<MpOrderResponse> {
  const res = await fetch(`${MP_BASE_URL}/v1/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get order: ${res.status}`);
  }

  return res.json();
}

// Public Key para o frontend (não é segredo)
export function getPublicKey(): string {
  return process.env.MP_PUBLIC_KEY || "";
}
