/**
 * correios.ts — Cálculo de frete por região
 *
 * O webservice antigo dos Correios (CalcPrecoPrazo.aspx) foi
 * descontinuado em 2024. A nova API exige contrato corporativo.
 *
 * Solução pragmática: tabela própria por região (UF) baseada
 * em preços médios de mercado dos Correios + retirada na loja.
 *
 * Origem: Belém, PA (CEP 66079-720)
 *
 * Para evoluir: integrar Melhor Envio (https://melhorenvio.com.br)
 * que oferece API gratuita até 100 cotações/mês com cadastro.
 */

const CEP_ORIGEM = "66079720";

export interface ShippingOption {
  service: string;
  name: string;
  price: number;
  deadline: string;
  deadlineDays: number;
}

// Tabela por região — baseado em peso médio até 1kg
// Norte é mais barato (origem), Sul/Sudeste mais caro
const TABELA_FRETE: Record<string, { pac: number; pacDias: number; sedex: number; sedexDias: number }> = {
  // Norte (mais próximo da origem)
  AC: { pac: 28, pacDias: 10, sedex: 52, sedexDias: 6 },
  AM: { pac: 22, pacDias: 8,  sedex: 45, sedexDias: 5 },
  AP: { pac: 20, pacDias: 7,  sedex: 42, sedexDias: 4 },
  PA: { pac: 15, pacDias: 5,  sedex: 28, sedexDias: 2 },
  RO: { pac: 30, pacDias: 11, sedex: 55, sedexDias: 6 },
  RR: { pac: 32, pacDias: 12, sedex: 58, sedexDias: 7 },
  TO: { pac: 25, pacDias: 9,  sedex: 48, sedexDias: 5 },

  // Nordeste
  AL: { pac: 28, pacDias: 9,  sedex: 52, sedexDias: 5 },
  BA: { pac: 26, pacDias: 8,  sedex: 48, sedexDias: 4 },
  CE: { pac: 24, pacDias: 7,  sedex: 45, sedexDias: 4 },
  MA: { pac: 22, pacDias: 6,  sedex: 42, sedexDias: 3 },
  PB: { pac: 26, pacDias: 8,  sedex: 48, sedexDias: 4 },
  PE: { pac: 26, pacDias: 8,  sedex: 48, sedexDias: 4 },
  PI: { pac: 24, pacDias: 7,  sedex: 45, sedexDias: 4 },
  RN: { pac: 26, pacDias: 8,  sedex: 48, sedexDias: 4 },
  SE: { pac: 28, pacDias: 9,  sedex: 52, sedexDias: 5 },

  // Centro-Oeste
  DF: { pac: 32, pacDias: 9,  sedex: 58, sedexDias: 5 },
  GO: { pac: 32, pacDias: 9,  sedex: 58, sedexDias: 5 },
  MT: { pac: 35, pacDias: 11, sedex: 62, sedexDias: 6 },
  MS: { pac: 38, pacDias: 12, sedex: 65, sedexDias: 7 },

  // Sudeste
  ES: { pac: 35, pacDias: 10, sedex: 62, sedexDias: 5 },
  MG: { pac: 35, pacDias: 10, sedex: 62, sedexDias: 5 },
  RJ: { pac: 38, pacDias: 11, sedex: 65, sedexDias: 6 },
  SP: { pac: 38, pacDias: 11, sedex: 65, sedexDias: 6 },

  // Sul (mais distante)
  PR: { pac: 42, pacDias: 12, sedex: 70, sedexDias: 7 },
  SC: { pac: 45, pacDias: 13, sedex: 72, sedexDias: 7 },
  RS: { pac: 48, pacDias: 14, sedex: 75, sedexDias: 8 },
};

// Padrão se UF não for identificada
const TABELA_PADRAO = { pac: 40, pacDias: 12, sedex: 68, sedexDias: 7 };

/**
 * Consulta CEP via ViaCEP (gratuito, sem autenticação)
 */
export async function consultarCep(cep: string) {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    throw new Error("CEP inválido");
  }

  const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error("Erro ao consultar CEP");
  }

  const data = await res.json();

  if (data.erro) {
    throw new Error("CEP não encontrado");
  }

  return {
    cep: data.cep,
    street: data.logradouro || "",
    neighborhood: data.bairro || "",
    city: data.localidade || "",
    state: data.uf || "",
  };
}

/**
 * Calcula frete por região baseado no UF do CEP de destino.
 * Para pacotes acima de 1kg, adiciona R$ 5 por kg extra.
 */
export async function calcularFrete(
  cepDestino: string,
  peso: number,        // gramas
  _comprimento: number, // não usado na tabela própria, mantido pela compatibilidade
  _altura: number,
  _largura: number
): Promise<ShippingOption[]> {
  const cleanCep = cepDestino.replace(/\D/g, "");

  // Sempre disponibiliza retirada na loja
  const options: ShippingOption[] = [
    {
      service: "RETIRADA",
      name: "Retirada na loja",
      price: 0,
      deadline: "Disponível em 1 dia útil",
      deadlineDays: 1,
    },
  ];

  // Descobre o UF a partir do CEP
  let uf = "";
  try {
    const address = await consultarCep(cleanCep);
    uf = address.state;
  } catch {
    // Sem UF, usa tabela padrão
  }

  const tabela = TABELA_FRETE[uf] || TABELA_PADRAO;

  // Calcula peso extra (acima de 1kg, R$ 5 por kg)
  const pesoKg = Math.max(peso / 1000, 0.3);
  const pesoExtra = Math.max(0, Math.ceil(pesoKg - 1));
  const adicionalPeso = pesoExtra * 5;

  // Mesmo CEP de origem = retirada gratuita destacada (sem PAC/SEDEX caro)
  // Para CEPs em Belém, oferece também entrega expressa local
  if (cleanCep.startsWith("660") || cleanCep.startsWith("671") || cleanCep.startsWith("672")) {
    options.push({
      service: "LOCAL",
      name: "Entrega em Belém — Motoboy",
      price: 15.0 + adicionalPeso,
      deadline: "1 a 2 dias úteis",
      deadlineDays: 2,
    });
  }

  // PAC
  options.push({
    service: "PAC",
    name: "PAC — Econômico",
    price: tabela.pac + adicionalPeso,
    deadline: `${tabela.pacDias} a ${tabela.pacDias + 2} dias úteis`,
    deadlineDays: tabela.pacDias,
  });

  // SEDEX
  options.push({
    service: "SEDEX",
    name: "SEDEX — Expresso",
    price: tabela.sedex + adicionalPeso,
    deadline: `${tabela.sedexDias} a ${tabela.sedexDias + 1} dias úteis`,
    deadlineDays: tabela.sedexDias,
  });

  // Ordena: retirada primeiro, depois por preço
  return options.sort((a, b) => {
    if (a.service === "RETIRADA") return -1;
    if (b.service === "RETIRADA") return 1;
    return a.price - b.price;
  });
}
