import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sobre Nós | Val Quaresma",
  description:
    "Conheça a história da Val Quaresma. Moda feminina com estilo, qualidade e atendimento personalizado em Belém do Pará.",
  openGraph: {
    title: "Sobre Nós | Val Quaresma",
    description: "Conheça a história da Val Quaresma.",
  },
};

/**
 * /sobre — Página institucional "Quem Somos"
 *
 * Objetivo de negócio:
 * - Transparecer confiança (loja física real, com história)
 * - Humanizar a marca (foto da equipe/loja, tom pessoal)
 * - SEO local (mencionar cidade, bairro)
 *
 * Conteúdo fixo no código (decisão do cliente).
 * Quando quiser editar, basta alterar os textos aqui.
 */
export default function SobrePage() {
  return (
    <section className="min-h-screen bg-white">
      {/* Hero do Sobre */}
      <div className="bg-neutral-900 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif">
            Nossa História
          </h1>
          <p className="mt-4 text-neutral-300 text-lg max-w-2xl mx-auto">
            Mais do que uma loja, somos um espaço onde cada mulher encontra
            o seu estilo.
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Bloco 1 — Quem somos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src="https://res.cloudinary.com/dytv4thpa/image/upload/v1/val-quaresma/sobre-loja.jpg"
              alt="Fachada da loja Val Quaresma"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif">
              Val Quaresma
            </h2>
            <div className="mt-4 space-y-4 text-neutral-700 leading-relaxed">
              <p>
                A Val Quaresma nasceu do sonho de oferecer moda feminina com
                qualidade, estilo e um atendimento que faz toda a diferença.
                Cada peça é escolhida a dedo, pensando na mulher real — que
                quer se sentir bonita no dia a dia, no trabalho e nas
                ocasiões especiais.
              </p>
              <p>
                Nossa loja física é um espaço acolhedor onde você pode
                experimentar, tocar os tecidos e receber consultoria de
                estilo personalizada. Aqui, você não é só uma cliente —
                é parte da nossa família.
              </p>
            </div>
          </div>
        </div>

        {/* Separador decorativo */}
        <div className="my-12 sm:my-16 flex items-center justify-center">
          <div className="h-px w-16 bg-amber-400" />
          <span className="mx-4 text-amber-500 text-2xl">✦</span>
          <div className="h-px w-16 bg-amber-400" />
        </div>

        {/* Bloco 2 — Valores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-14 h-14 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Carinho</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Cada peça é selecionada com amor e atenção aos detalhes.
            </p>
          </div>

          <div className="p-6">
            <div className="w-14 h-14 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Qualidade</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Tecidos premium e acabamento impecável em todas as peças.
            </p>
          </div>

          <div className="p-6">
            <div className="w-14 h-14 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Atendimento</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Consultoria de estilo personalizada para cada cliente.
            </p>
          </div>
        </div>

        {/* Separador decorativo */}
        <div className="my-12 sm:my-16 flex items-center justify-center">
          <div className="h-px w-16 bg-amber-400" />
          <span className="mx-4 text-amber-500 text-2xl">✦</span>
          <div className="h-px w-16 bg-amber-400" />
        </div>

        {/* CTA final */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif">
            Venha nos visitar
          </h2>
          <p className="mt-3 text-neutral-600 max-w-lg mx-auto">
            Nossa loja fica em Belém do Pará. Venha tomar um café,
            experimentar as peças e encontrar o look perfeito para você.
          </p>
          <a
            href="/contato"
            className="mt-6 inline-block px-8 py-3 bg-neutral-900 text-white font-semibold rounded-lg
                       hover:bg-neutral-800 transition-colors duration-200"
          >
            Como chegar →
          </a>
        </div>
      </div>
    </section>
  );
}
