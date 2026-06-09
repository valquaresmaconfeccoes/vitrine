/**
 * correios.ts — Cálculo de frete pelos Correios
 *
 * Usa o web service público dos Correios para calcular
 * preço e prazo de PAC e SEDEX.
 *
 * Fallback: se a API estiver fora, retorna preços estimados
 * baseados em tabela fixa por região.
 *
 * CEP de origem: 66079-720 (Belém, PA)
 */

const CEP_ORIGEM = "66079720";

// Códigos dos serviços dos Correios
const SERVICOS = {
  PAC: "04510",
  SEDEX: "04014",
};

export interface ShippingOption {
  service: string;     // "PAC", "SEDEX", "RETIRADA"
  name: string;        // Nome amigável
  price: number;       // em reais
  deadline: string;    // "5 a 8 dias úteis"
  deadlineDays: number;
}

interface CorreiosResponse {
  Codigo: string;
  Valor: string;
  PrazoEntrega: string;
  Erro: string;
  MsgErro: string;
}

// Consulta CEP via ViaCEP (gratuito)
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

// Calcula frete via web service dos Correios
export async function calcularFrete(
  cepDestino: string,
  peso: number,       // em gramas
  comprimento: number, // cm
  altura: number,      // cm
  largura: number      // cm
): Promise<ShippingOption[]> {
  const cleanCep = cepDestino.replace(/\D/g, "");
  const pesoKg = Math.max(peso / 1000, 0.3); // mínimo 300g

  // Garantir dimensões mínimas dos Correios
  const comp = Math.max(comprimento, 16);
  const alt = Math.max(altura, 2);
  const larg = Math.max(largura, 11);

  const options: ShippingOption[] = [];

  // Opção de retirada na loja (sempre disponível)
  options.push({
    service: "RETIRADA",
    name: "Retirada na loja",
    price: 0,
    deadline: "Disponível em 1 dia útil",
    deadlineDays: 1,
  });

  try {
    // Busca PAC e SEDEX em paralelo
    const promises = Object.entries(SERVICOS).map(async ([name, code]) => {
      const params = new URLSearchParams({
        nCdEmpresa: "",
        sDsSenha: "",
        nCdServico: code,
        sCepOrigem: CEP_ORIGEM,
        sCepDestino: cleanCep,
        nVlPeso: pesoKg.toString(),
        nCdFormato: "1", // caixa/pacote
        nVlComprimento: comp.toString(),
        nVlAltura: alt.toString(),
        nVlLargura: larg.toString(),
        nVlDiametro: "0",
        sCdMaoPropria: "N",
        nVlValorDeclarado: "0",
        sCdAvisoRecebimento: "N",
        StrRetorno: "xml",
      });

      const res = await fetch(
        `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?${params}`,
        { signal: AbortSignal.timeout(8000) } // timeout 8s
      );

      if (!res.ok) throw new Error(`Correios ${name}: ${res.status}`);

      const xml = await res.text();

      // Parse simples do XML
      const valor = xml.match(/<Valor>([\d.,]+)<\/Valor>/)?.[1];
      const prazo = xml.match(/<PrazoEntrega>(\d+)<\/PrazoEntrega>/)?.[1];
      const erro = xml.match(/<Erro>(\d+)<\/Erro>/)?.[1];

      if (erro && erro !== "0" && erro !== "010") {
        throw new Error(`Correios erro ${erro}`);
      }

      if (!valor || !prazo) throw new Error("Resposta inválida");

      const price = parseFloat(valor.replace(",", "."));
      const days = parseInt(prazo);

      return {
        service: name,
        name: name === "PAC" ? "PAC — Econômico" : "SEDEX — Expresso",
        price,
        deadline: `${days} a ${days + 2} dias úteis`,
        deadlineDays: days,
      };
    });

    const results = await Promise.allSettled(promises);

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        options.push(result.value);
      }
    });
  } catch (error) {
    console.error("[CORREIOS_ERROR]", error);

    // Fallback: preços estimados se a API falhar
    options.push(
      {
        service: "PAC",
        name: "PAC — Econômico (estimado)",
        price: 25.9,
        deadline: "8 a 12 dias úteis",
        deadlineDays: 10,
      },
      {
        service: "SEDEX",
        name: "SEDEX — Expresso (estimado)",
        price: 45.9,
        deadline: "3 a 5 dias úteis",
        deadlineDays: 4,
      }
    );
  }

  // Ordena: retirada primeiro, depois por preço
  return options.sort((a, b) => {
    if (a.service === "RETIRADA") return -1;
    if (b.service === "RETIRADA") return 1;
    return a.price - b.price;
  });
}
