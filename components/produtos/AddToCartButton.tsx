"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
}

export default function AddToCartButton({ productId, variantId }: AddToCartButtonProps) {
  const { customer, addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!customer) {
      router.push("/conta/login");
      return;
    }

    setLoading(true);
    const success = await addToCart(productId, variantId);
    setLoading(false);

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center gap-3 w-full px-6 py-4
                 font-semibold text-base sm:text-lg rounded-xl transition-all duration-300
                 shadow-lg hover:shadow-xl disabled:opacity-50
                 ${added
                   ? "bg-green-600 text-white"
                   : "bg-neutral-900 hover:bg-neutral-800 text-white"
                 }`}
    >
      {loading ? (
        "Adicionando..."
      ) : added ? (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Adicionado!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          Adicionar ao carrinho
        </>
      )}
    </button>
  );
}
