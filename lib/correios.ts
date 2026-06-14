/**
 * correios.ts — Cálculo de frete via Melhor Envio
 *
 * Integração real com a API do Melhor Envio para cotação de frete.
 * Retorna preços e prazos reais de PAC, SEDEX, Jadlog e outras
 * transportadoras disponíveis para o CEP de destino.
 *
 * Fallback: se a API falhar, usa tabela por UF (estimativa).
 *
 * Origem: Belém, PA (CEP 66079-720)
 */

const CEP_ORIGEM = "66079720";

const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN || "";
const ME_SANDBOX = process.env.ME_SANDBOX !== "false"; // default sandbox
const ME_BASE_URL = ME_SANDBOX
  ? "https://sandbox.melhorenvio.com.br"
  : "https://melhorenvio.com.br";

export interface ShippingOption {
  service: string;
  name: string;
  price: number;
  deadline: string;
  deadlineDays: number;
}

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

export interface PackageItem {
  weight: number;   // gramas
  height: number;   // cm
  width: number;    // cm
  length: number;   // cm
  quantity: number;
}

/**
 * Calcula frete via Melhor Envio (API real).
 * Aceita array de pacotes — um por item do carrinho.
 * Se falhar, cai no fallback com tabela por UF.
 */
export async function calcularFrete(
  cepDestino: string,
  packages: PackageItem[]
): Promise<ShippingOption[]> {
  const cleanCep = cepDestino.replace(/\D/g, "");

  // Retirada na loja — sempre disponível
  const options: ShippingOption[] = [
    {
      service: "RETIRADA",
      name: "Retirada na loja",
      price: 0,
      deadline: "Disponível em 1 dia útil",
      deadlineDays: 1,
    },
  ];

  // Entrega local em Belém — motoboy
  if (cleanCep.startsWith("660") || cleanCep.startsWith("671") || cleanCep.startsWith("672")) {
    options.push({
      service: "LOCAL",
      name: "Entrega em Belém — Motoboy",
      price: 15.0,
      deadline: "1 a 2 dias úteis",
      deadlineDays: 2,
    });
  }

  // Tentar Melhor Envio
  if (MELHOR_ENVIO_TOKEN) {
    try {
      const meOptions = await calcularFreteViaMelhorEnvio(cleanCep, packages);
      options.push(...meOptions);
    } catch (err) {
      console.error("[MELHOR_ENVIO_ERROR]", err);
      const fallbackOptions = await calcularFretePorTabela(cleanCep, packages);
      options.push(...fallbackOptions);
    }
  } else {
    const fallbackOptions = await calcularFretePorTabela(cleanCep, packages);
    options.push(...fallbackOptions);
  }

  // Ordena: retirada primeiro, depois por preço
  return options.sort((a, b) => {
    if (a.service === "RETIRADA") return -1;
    if (b.service === "RETIRADA") return 1;
    return a.price - b.price;
  });
}

/**
 * Cotação real via API do Melhor Envio — múltiplos pacotes
 */
async function calcularFreteViaMelhorEnvio(
  cepDestino: string,
  packages: PackageItem[]
): Promise<ShippingOption[]> {
  // Montar array de pacotes para o Melhor Envio
  // Cada item do carrinho vira um pacote (quantidade expandida)
  const mePackages = packages.flatMap((pkg) => {
    const safeHeight = Math.max(pkg.height || 4, 4);
    const safeWidth = Math.max(pkg.width || 15, 11);
    const safeLength = Math.max(pkg.length || 20, 16);
    const safeWeight = Math.max((pkg.weight || 300) / 1000, 0.3);

    // Um pacote por unidade
    return Array.from({ length: pkg.quantity || 1 }, () => ({
      height: safeHeight,
      width: safeWidth,
      length: safeLength,
      weight: safeWeight,
    }));
  });

  const body = {
    from: { postal_code: CEP_ORIGEM },
    to: { postal_code: cepDestino },
    packages: mePackages,
  };

  const res = await fetch(`${ME_BASE_URL}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MELHOR_ENVIO_TOKEN}`,
      Accept: "application/json",
      "User-Agent": "ValQuaresma contato@valquaresma.com.br",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Melhor Envio HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Resposta inesperada do Melhor Envio");
  }

  const options: ShippingOption[] = [];

  for (const item of data) {
    // Pular serviços com erro ou sem preço
    if (item.error || !item.price) continue;

    const price = parseFloat(item.custom_price || item.price);
    if (isNaN(price) || price <= 0) continue;

    const deliveryDays = parseInt(item.delivery_time, 10) || 10;
    const companyName = item.company?.name || "";
    const serviceName = item.name || "";

    // Montar nome amigável
    let friendlyName = serviceName;
    if (companyName && !serviceName.includes(companyName)) {
      friendlyName = `${serviceName} — ${companyName}`;
    }

    // Service ID para identificação única
    const serviceId = item.id?.toString() || `ME_${serviceName.replace(/\s/g, "_")}`;

    options.push({
      service: serviceId,
      name: friendlyName,
      price: Math.round(price * 100) / 100, // arredondar centavos
      deadline: `${deliveryDays} a ${deliveryDays + 2} dias úteis`,
      deadlineDays: deliveryDays,
    });
  }

  if (options.length === 0) {
    throw new Error("Nenhuma opção de frete disponível pelo Melhor Envio");
  }

  return options;
}

// =====================================================
// FALLBACK — Tabela por UF (usado quando ME falha)
// =====================================================

const TABELA_FRETE: Record<string, { pac: number; pacDias: number; sedex: number; sedexDias: number }> = {
  AC: { pac: 28, pacDias: 10, sedex: 52, sedexDias: 6 },
  AM: { pac: 22, pacDias: 8,  sedex: 45, sedexDias: 5 },
  AP: { pac: 20, pacDias: 7,  sedex: 42, sedexDias: 4 },
  PA: { pac: 15, pacDias: 5,  sedex: 28, sedexDias: 2 },
  RO: { pac: 30, pacDias: 11, sedex: 55, sedexDias: 6 },
  RR: { pac: 32, pacDias: 12, sedex: 58, sedexDias: 7 },
  TO: { pac: 25, pacDias: 9,  sedex: 48, sedexDias: 5 },
  AL: { pac: 28, pacDias: 9,  sedex: 52, sedexDias: 5 },
  BA: { pac: 26, pacDias: 8,  sedex: 48, sedexDias: 4 },
  CE: { pac: 24, pacDias: 7,  sedex: 45, sedexDias: 4 },
  MA: { pac: 22, pacDias: 6,  sedex: 42, sedexDias: 3 },
  PB: { pac: 26, pacDias: 8,  sedex: 48, sedexDias: 4 },
  PE: { pac: 26, pacDias: 8,  sedex: 48, sedexDias: 4 },
  PI: { pac: 24, pacDias: 7,  sedex: 45, sedexDias: 4 },
  RN: { pac: 26, pacDias: 8,  sedex: 48, sedexDias: 4 },
  SE: { pac: 28, pacDias: 9,  sedex: 52, sedexDias: 5 },
  DF: { pac: 32, pacDias: 9,  sedex: 58, sedexDias: 5 },
  GO: { pac: 32, pacDias: 9,  sedex: 58, sedexDias: 5 },
  MT: { pac: 35, pacDias: 11, sedex: 62, sedexDias: 6 },
  MS: { pac: 38, pacDias: 12, sedex: 65, sedexDias: 7 },
  ES: { pac: 35, pacDias: 10, sedex: 62, sedexDias: 5 },
  MG: { pac: 35, pacDias: 10, sedex: 62, sedexDias: 5 },
  RJ: { pac: 38, pacDias: 11, sedex: 65, sedexDias: 6 },
  SP: { pac: 38, pacDias: 11, sedex: 65, sedexDias: 6 },
  PR: { pac: 42, pacDias: 12, sedex: 70, sedexDias: 7 },
  SC: { pac: 45, pacDias: 13, sedex: 72, sedexDias: 7 },
  RS: { pac: 48, pacDias: 14, sedex: 75, sedexDias: 8 },
};

const TABELA_PADRAO = { pac: 40, pacDias: 12, sedex: 68, sedexDias: 7 };

async function calcularFretePorTabela(
  cepDestino: string,
  packages: PackageItem[]
): Promise<ShippingOption[]> {
  let uf = "";
  try {
    const address = await consultarCep(cepDestino);
    uf = address.state;
  } catch { /* sem UF, usa padrão */ }

  const tabela = TABELA_FRETE[uf] || TABELA_PADRAO;

  // Soma peso total de todos os pacotes
  const totalWeight = packages.reduce((sum, p) => sum + (p.weight || 300) * (p.quantity || 1), 0);
  const pesoKg = Math.max(totalWeight / 1000, 0.3);
  const pesoExtra = Math.max(0, Math.ceil(pesoKg - 1));
  const adicionalPeso = pesoExtra * 5;

  return [
    {
      service: "PAC",
      name: "PAC — Econômico (estimativa)",
      price: tabela.pac + adicionalPeso,
      deadline: `${tabela.pacDias} a ${tabela.pacDias + 2} dias úteis`,
      deadlineDays: tabela.pacDias,
    },
    {
      service: "SEDEX",
      name: "SEDEX — Expresso (estimativa)",
      price: tabela.sedex + adicionalPeso,
      deadline: `${tabela.sedexDias} a ${tabela.sedexDias + 1} dias úteis`,
      deadlineDays: tabela.sedexDias,
    },
  ];
}
