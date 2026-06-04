import Image from "next/image";
import Link from "next/link";

/**
 * AboutPreview
 *
 * Resumo da história da loja, ponte do físico para o digital.
 *
 * Por que existe na Home:
 * - Cliente novo precisa CONFIAR antes de comprar
 * - Comunicar que existe loja física aumenta a credibilidade
 * - "Quem está por trás da marca?" é uma pergunta natural no e-commerce de moda
 *
 * Layout split (imagem + texto):
 * - Mobile: empilha (imagem em cima, texto embaixo)
 * - Desktop: lado a lado (clássico editorial)
 *
 * IMPORTANTE: troque a imagem por uma FOTO REAL da loja ou da Val
 * (sorrindo, atendendo cliente, organizando peças — o que humanizar a marca).
 */
export default function AboutPreview() {
  return (
    <section className="py-20 lg:py-28 bg-noir text-white overflow-hidden">
      <div className="container-padded">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ============ IMAGEM ============ */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] order-1 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1000&q=80"
              alt="A loja Val Quaresma"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Moldura dourada decorativa */}
            <div
              className="absolute -inset-3 border border-gold/40 -z-10 hidden lg:block"
              aria-hidden="true"
            />
          </div>

          {/* ============ TEXTO ============ */}
          <div className="order-2 lg:order-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-6">
              Nossa História
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl mb-8 leading-tight">
              Mais do que roupas,
              <br />
              <span className="italic text-gold">uma história</span>.
            </h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                A Val Quaresma nasceu do desejo de oferecer mais do que peças
                bonitas — entregar experiência, identidade e cuidado em cada
                detalhe.
              </p>
              <p>
                Em nossa loja física, cada cliente é recebida com atenção
                personalizada. Agora, levamos essa mesma essência para o digital,
                mantendo a alma que sempre nos definiu.
              </p>
            </div>

            <Link
              href="/sobre"
              className="inline-block mt-10 text-sm uppercase tracking-widest text-gold border-b border-gold pb-1 hover:text-gold-light hover:border-gold-light transition-colors duration-300"
            >
              Conheça Nossa História →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
