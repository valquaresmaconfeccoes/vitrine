import { NextResponse } from "next/server";
import { calcularFrete, consultarCep } from "@/lib/correios";

export async function POST(request: Request) {
  try {
    const { cep, items } = await request.json();

    if (!cep) {
      return NextResponse.json({ error: "CEP é obrigatório." }, { status: 400 });
    }

    // Valida CEP e retorna endereço
    const address = await consultarCep(cep);

    // Calcula peso e dimensões totais do pacote
    let totalWeight = 0;
    let maxWidth = 11;
    let maxHeight = 2;
    let maxLength = 16;

    if (items && Array.isArray(items)) {
      for (const item of items) {
        totalWeight += (item.weight || 300) * (item.quantity || 1);
        maxWidth = Math.max(maxWidth, item.width || 15);
        maxHeight += (item.height || 5) * (item.quantity || 1);
        maxLength = Math.max(maxLength, item.length || 20);
      }
    } else {
      totalWeight = 500;
    }

    const options = await calcularFrete(cep, totalWeight, maxLength, maxHeight, maxWidth);

    return NextResponse.json({ address, options });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao calcular frete.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
