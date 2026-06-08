"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

interface CartItemData {
  id: string; quantity: number;
  product: { id: string; name: string; price: string; mainImage: string; weight: number; width: number; height: number; length: number };
  variant: { id: string; name: string; price: string } | null;
}
interface ShippingOption { service: string; name: string; price: number; deadline: string }
interface AddressData { cep: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string }

export default function CheckoutPage() {
  const { customer, refreshCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Endereço
  const [address, setAddress] = useState<AddressData>({ cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" });
  const [cepLoading, setCepLoading] = useState(false);

  // Frete
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");

  const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  useEffect(() => {
    if (!customer) { router.push("/conta/login"); return; }
    fetch("/api/cart").then(r => r.json()).then(d => { setItems(d.cart?.items || []); setLoading(false); });
  }, [customer, router]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);
  const shippingCost = selectedShipping?.price || 0;
  const total = subtotal + shippingCost;

  // Busca CEP
  async function handleCepBlur() {
    const cep = address.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep,
          items: items.map(i => ({ weight: i.product.weight, width: i.product.width, height: i.product.height, length: i.product.length, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setAddress(prev => ({ ...prev, street: data.address.street || prev.street, neighborhood: data.address.neighborhood || prev.neighborhood, city: data.address.city, state: data.address.state }));
      setShippingOptions(data.options || []);
      setError("");
    } catch { setError("Erro ao consultar CEP"); }
    finally { setCepLoading(false); }
  }

  // Finaliza pedido
  async function handleCheckout() {
    setProcessing(true);
    setError("");
    try {
      // Primeiro salva o endereço
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingMethod: selectedShipping?.service || "RETIRADA",
          shippingCost: selectedShipping?.price || 0,
          shippingDeadline: selectedShipping?.deadline || "",
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setProcessing(false); return; }

      await refreshCart();
      // Redireciona para sucesso com dados
      const params = new URLSearchParams({
        pedido: data.orderNumber,
        metodo: paymentMethod,
        ...(data.pix?.qrCode ? { pixCode: data.pix.qrCode } : {}),
        ...(data.pix?.qrCodeBase64 ? { pixQr: data.pix.qrCodeBase64 } : {}),
      });
      router.push(`/checkout/sucesso?${params.toString()}`);
    } catch {
      setError("Erro ao processar. Tente novamente.");
      setProcessing(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-neutral-400">Carregando...</p></div>;
  if (items.length === 0) return <div className="min-h-screen flex items-center justify-center flex-col gap-4"><p className="text-neutral-400">Carrinho vazio.</p><a href="/produtos" className="text-amber-600 underline">Ver produtos</a></div>;

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900 mb-8">Checkout</h1>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm rounded-lg border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 1: Endereço */}
            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">1. Endereço de entrega</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">CEP</label>
                  <input type="text" maxLength={9} value={address.cep} onChange={e => setAddress(p => ({ ...p, cep: e.target.value }))}
                    onBlur={handleCepBlur} placeholder="66079-720"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  {cepLoading && <p className="text-xs text-amber-600 mt-1">Consultando CEP...</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Rua</label>
                  <input type="text" value={address.street} onChange={e => setAddress(p => ({ ...p, street: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Número</label>
                  <input type="text" value={address.number} onChange={e => setAddress(p => ({ ...p, number: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Complemento</label>
                  <input type="text" value={address.complement} onChange={e => setAddress(p => ({ ...p, complement: e.target.value }))} placeholder="Apto, bloco..."
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Bairro</label>
                  <input type="text" value={address.neighborhood} onChange={e => setAddress(p => ({ ...p, neighborhood: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Cidade / UF</label>
                  <input type="text" readOnly value={address.city ? `${address.city} — ${address.state}` : ""}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-600" />
                </div>
              </div>
            </div>

            {/* STEP 2: Frete */}
            {shippingOptions.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">2. Frete</h2>
                <div className="space-y-3">
                  {shippingOptions.map(opt => (
                    <label key={opt.service} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${selectedShipping?.service === opt.service ? "border-amber-500 bg-amber-50" : "border-neutral-200 hover:border-neutral-300"}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={selectedShipping?.service === opt.service}
                          onChange={() => { setSelectedShipping(opt); setStep(3); }}
                          className="w-4 h-4 text-amber-600" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{opt.name}</p>
                          <p className="text-xs text-neutral-500">{opt.deadline}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-neutral-900">{opt.price === 0 ? "Grátis" : fmt(opt.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Pagamento */}
            {selectedShipping && (
              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">3. Pagamento</h2>
                <div className="flex gap-3 mb-6">
                  <button onClick={() => setPaymentMethod("pix")}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-colors ${paymentMethod === "pix" ? "border-green-500 bg-green-50 text-green-700" : "border-neutral-200 text-neutral-600"}`}>
                    Pix
                  </button>
                  <button onClick={() => setPaymentMethod("credit_card")}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-colors ${paymentMethod === "credit_card" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-neutral-200 text-neutral-600"}`}>
                    Cartão de Crédito
                  </button>
                </div>

                {paymentMethod === "pix" && (
                  <div className="text-center py-4">
                    <p className="text-sm text-neutral-600 mb-4">Após confirmar, você receberá o QR Code do Pix para pagamento.</p>
                  </div>
                )}

                {paymentMethod === "credit_card" && (
                  <div className="text-center py-4">
                    <p className="text-sm text-neutral-600">O pagamento com cartão será processado pelo Mercado Pago de forma segura.</p>
                  </div>
                )}

                <button onClick={handleCheckout} disabled={processing}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-xl transition-colors disabled:opacity-50">
                  {processing ? "Processando..." : `Pagar ${fmt(total)}`}
                </button>
              </div>
            )}
          </div>

          {/* Resumo lateral */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 h-fit sticky top-24">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Resumo do pedido</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-14 rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image src={item.product.mainImage} alt={item.product.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-900 line-clamp-1">{item.product.name}</p>
                    {item.variant && <p className="text-[10px] text-neutral-500">{item.variant.name}</p>}
                    <p className="text-xs text-neutral-500">Qtd: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="mb-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">Frete</span><span>{selectedShipping ? (shippingCost === 0 ? "Grátis" : fmt(shippingCost)) : "—"}</span></div>
              <hr />
              <div className="flex justify-between text-base font-bold"><span>Total</span><span>{fmt(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
