"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const pedido = params.get("pedido") || "";
  const metodo = params.get("metodo") || "";
  const pixCode = params.get("pixCode") || "";
  const pixQr = params.get("pixQr") || "";

  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  // Polling: a cada 5s, verifica se o pedido foi pago
  useEffect(() => {
    if (metodo !== "pix" || !pedido) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/check?numero=${pedido}`);
        if (res.ok) {
          const data = await res.json();
          if (data.paid) {
            setPaid(true);
            clearInterval(interval);
          }
        }
      } catch {
        // silencia
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [metodo, pedido]);

  function copyPix() {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ============ ESTADO: PAGAMENTO CONFIRMADO ============
  if (paid) {
    return (
      <section className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-green-700 mb-2">
            Pagamento confirmado!
          </h1>
          <p className="text-neutral-600 mb-6">
            Pedido <strong>{pedido}</strong> recebido. Em breve entraremos em contato
            para combinar a entrega.
          </p>
          <Link href="/produtos" className="block py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800">
            Continuar comprando
          </Link>
        </div>
      </section>
    );
  }

  // ============ ESTADO: PIX AGUARDANDO PAGAMENTO ============
  if (metodo === "pix") {
    return (
      <section className="min-h-screen bg-neutral-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          {/* Header com status amarelo, NÃO verde */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Aguardando pagamento
            </div>
            <h1 className="text-2xl font-bold font-serif text-neutral-900 mb-1">
              Pedido criado
            </h1>
            <p className="text-sm text-neutral-500">Número: <strong>{pedido}</strong></p>
          </div>

          {/* Alerta importante */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-900 font-medium mb-1">
              ⚠️ Seu pedido ainda não foi pago
            </p>
            <p className="text-xs text-amber-800">
              Conclua o pagamento via Pix abaixo. Sem o pagamento confirmado,
              seu pedido será cancelado em 30 minutos.
            </p>
          </div>

          {/* QR Code */}
          {pixQr ? (
            <div className="bg-white p-6 rounded-xl border border-neutral-200 mb-4 text-center">
              <h2 className="text-base font-semibold text-neutral-900 mb-3">
                Escaneie o QR Code
              </h2>
              <div className="relative w-48 h-48 mx-auto mb-3 bg-white p-2 rounded-lg border border-neutral-200">
                <Image
                  src={`data:image/png;base64,${pixQr}`}
                  alt="QR Code Pix"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
              <p className="text-xs text-neutral-500">
                Abra o app do seu banco → Pix → Pagar com QR Code
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-800 font-medium mb-1">
                ❌ Erro ao gerar QR Code
              </p>
              <p className="text-xs text-red-700">
                Use o código copia-e-cola abaixo, ou tente novamente.
              </p>
            </div>
          )}

          {/* Código copia-e-cola */}
          {pixCode && (
            <div className="bg-white p-4 rounded-xl border border-neutral-200 mb-6">
              <p className="text-sm font-medium text-neutral-700 mb-2">
                Ou use o código Pix:
              </p>
              <div className="bg-neutral-50 p-3 rounded-lg break-all text-xs text-neutral-700 font-mono mb-3 max-h-24 overflow-y-auto">
                {pixCode}
              </div>
              <button
                onClick={copyPix}
                className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                  copied ? "bg-green-600 text-white" : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                {copied ? "✓ Copiado!" : "Copiar código Pix"}
              </button>
            </div>
          )}

          {/* Status / polling */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-blue-800">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Aguardando confirmação automática...
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Esta página vai atualizar sozinha quando o pagamento for confirmado.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/produtos" className="text-sm text-neutral-500 underline">
              Voltar aos produtos
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ============ ESTADO: OUTRO MÉTODO (cartão futuro) ============
  return (
    <section className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-2xl font-bold font-serif text-neutral-900 mb-2">Pedido criado</h1>
        <p className="text-neutral-600 mb-6">
          Número: <strong>{pedido}</strong>
        </p>
        <Link href="/produtos" className="block py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800">
          Voltar aos produtos
        </Link>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
