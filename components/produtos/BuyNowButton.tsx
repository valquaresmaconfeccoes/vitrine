"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

interface BuyNowButtonProps {
  productId: string;
  variantId?: string;
  stock?: number | null;
  hasVariants?: boolean;
}

/**
 * BuyNowButton — "Comprar agora"
 *
 * Fluxo de compra expressa: adiciona o item ao carrinho (um único POST,
 * via addToCart do contexto — a mesma fonte usada pelo AddToCartButton)
 * e leva o cliente direto para o checkout, pulando a etapa do carrinho.
 *
 * Posicionado entre "Adicionar ao carrinho" e "Quero esse produto"
 * (WhatsApp), é o caminho de menor atrito para quem já decidiu comprar.
 */
export default function BuyNowButton({
  productId,
  variantId,
  stock,
  hasVariants,
}: BuyNowButtonProps) {
  const { customer, addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isOutOfStock = !hasVariants && stock === 0;

  async function handleClick() {
    if (!customer) {
      router.push("/conta/login");
      return;
    }
    if (isOutOfStock) return;

    setLoading(true);
    setError("");
    try {
      const result = await addToCart(productId, variantId);
      if (!result.ok) {
        setError(result.error || "Erro ao processar");
        setLoading(false);
        setTimeout(() => setError(""), 4000);
        return;
      }
      // Compra expressa: vai direto para o pagamento.
      router.push("/checkout");
    } catch {
      setError("Erro de conexão");
      setLoading(false);
      setTimeout(() => setError(""), 4000);
    }
  }

  if (isOutOfStock) return null;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center gap-3 w-full px-6 py-4
                 font-semibold text-base sm:text-lg rounded-xl transition-all duration-300
                 shadow-lg hover:shadow-xl disabled:opacity-50
                 ${error
                   ? "bg-red-600 text-white"
                   : "bg-amber-500 hover:bg-amber-600 text-white"
                 }`}
    >
      {loading ? (
        "Processando..."
      ) : error ? (
        `⚠️ ${error}`
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Comprar agora
        </>
      )}
    </button>
  );
}
