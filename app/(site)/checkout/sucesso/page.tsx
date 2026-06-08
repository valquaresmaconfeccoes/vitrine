"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const pedido = params.get("pedido") || "";
  const metodo = params.get("metodo") || "";
  const pixCode = params.get("pixCode") || "";

  return (
    <section className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900 mb-2">Pedido realizado!</h1>
        <p className="text-neutral-600 mb-2">Número do pedido: <strong className="text-neutral-900">{pedido}</strong></p>

        {metodo === "pix" && pixCode && (
          <div className="bg-white p-6 rounded-xl border border-neutral-200 mt-6 text-left">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Pague com Pix</h2>
            <p className="text-sm text-neutral-600 mb-4">Copie o código abaixo e cole no app do seu banco:</p>
            <div className="bg-neutral-100 p-3 rounded-lg break-all text-xs text-neutral-700 font-mono mb-3">{pixCode}</div>
            <button onClick={() => navigator.clipboard.writeText(pixCode)}
              className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Copiar código Pix
            </button>
            <p className="text-xs text-neutral-500 mt-3 text-center">O pagamento é confirmado automaticamente.</p>
          </div>
        )}

        {metodo === "credit_card" && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 mt-6">
            <p className="text-sm text-green-800">Pagamento aprovado! Você receberá a confirmação por email.</p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Link href="/produtos" className="block py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
            Continuar comprando
          </Link>
          <Link href="/" className="block py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors">
            Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>}><SuccessContent /></Suspense>;
}
