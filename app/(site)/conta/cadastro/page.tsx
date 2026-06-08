"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function CustomerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshSession } = useCart();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/customer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }

    await refreshSession();
    router.push("/produtos");
  }

  return (
    <section className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-neutral-900">Criar conta</h1>
          <p className="mt-2 text-neutral-500">Cadastre-se para comprar na Val Quaresma.</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutral-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm rounded-lg border border-red-200">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Nome completo</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">WhatsApp (opcional)</label>
              <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="(91) 99999-9999"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">Senha</label>
              <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50">
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Já tem conta?{" "}
            <Link href="/conta/login" className="text-amber-600 hover:text-amber-700 font-medium">Entrar</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
