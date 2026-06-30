"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface CustomerData {
  id: string;
  email: string;
  name: string;
}

interface AddToCartResult {
  ok: boolean;
  error?: string;
}

interface CartContextType {
  customer: CustomerData | null;
  cartCount: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
  refreshSession: () => Promise<void>;
  addToCart: (productId: string, variantId?: string) => Promise<AddToCartResult>;
  logout: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  customer: null,
  cartCount: 0,
  loading: true,
  refreshCart: async () => {},
  refreshSession: async () => {},
  addToCart: async () => ({ ok: false }),
  logout: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/session");
      const data = await res.json();
      setCustomer(data.customer || null);
      setCartCount(data.cartCount || 0);
    } catch {
      setCustomer(null);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (!customer) return;
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      const count = data.cart?.items?.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      ) || 0;
      setCartCount(count);
    } catch {
      // silencia
    }
  }, [customer]);

  const addToCart = useCallback(
    async (productId: string, variantId?: string): Promise<AddToCartResult> => {
      if (!customer) return { ok: false, error: "Não autenticado" };
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, variantId }),
        });
        if (res.ok) {
          setCartCount((c) => c + 1);
          return { ok: true };
        }
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data.error || "Erro ao adicionar" };
      } catch {
        return { ok: false, error: "Erro de conexão" };
      }
    },
    [customer]
  );

  const logout = useCallback(async () => {
    await fetch("/api/customer/logout", { method: "POST" });
    setCustomer(null);
    setCartCount(0);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return (
    <CartContext.Provider
      value={{ customer, cartCount, loading, refreshCart, refreshSession, addToCart, logout }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
