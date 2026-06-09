import { NextResponse } from "next/server";
import { calcularFrete, consultarCep } from "@/lib/correios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cep, items } = body;

    if (!cep) {
      return NextResponse.json({ error: "CEP é obrigatório." }, { status: 400 });
    }

    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      return NextResponse.json({ error: "CEP inválido. Digite os 8 números." }, { status: 400 });
    }

    // Calcula peso e dimensões totais do pacote
    let totalWeight = 300;
    let maxWidth = 15;
    let maxHeight = 10;
    let maxLength = 20;

    if (items && Array.isArray(items) && items.length > 0) {
      totalWeight = 0;
      for (const item of items) {
        totalWeight += (item.weight || 300) * (item.quantity || 1);
        maxWidth = Math.max(maxWidth, item.width || 15);
        maxHeight = Math.max(maxHeight, item.height || 10);
        maxLength = Math.max(maxLength, item.length || 20);
      }
    }

    // Busca endereço e frete em paralelo — se ViaCEP falhar, ainda retorna o frete
    const [addressResult, freightOptions] = await Promise.allSettled([
      consultarCep(cleanCep),
      calcularFrete(cleanCep, totalWeight, maxLength, maxHeight, maxWidth),
    ]);

    const address =
      addressResult.status === "fulfilled"
        ? addressResult.value
        : { cep: cleanCep, street: "", neighborhood: "", city: "", state: "" };

    const options =
      freightOptions.status === "fulfilled"
        ? freightOptions.value
        : [
            { service: "RETIRADA", name: "Retirada na loja", price: 0, deadline: "Disponível em 1 dia útil", deadlineDays: 1 },
            { service: "PAC", name: "PAC — Econômico (estimado)", price: 25.9, deadline: "8 a 12 dias úteis", deadlineDays: 10 },
            { service: "SEDEX", name: "SEDEX — Expresso (estimado)", price: 45.9, deadline: "3 a 5 dias úteis", deadlineDays: 4 },
          ];

    return NextResponse.json({ address, options });
  } catch (error) {
    console.error("[SHIPPING_ERROR]", error);
    // Fallback final — sempre retorna algo útil para o cliente
    return NextResponse.json({
      address: { cep: "", street: "", neighborhood: "", city: "", state: "" },
      options: [
        { service: "RETIRADA", name: "Retirada na loja", price: 0, deadline: "Disponível em 1 dia útil", deadlineDays: 1 },
        { service: "PAC", name: "PAC — Econômico (estimado)", price: 25.9, deadline: "8 a 12 dias úteis", deadlineDays: 10 },
        { service: "SEDEX", name: "SEDEX — Expresso (estimado)", price: 45.9, deadline: "3 a 5 dias úteis", deadlineDays: 4 },
      ],
    });
  }
}
