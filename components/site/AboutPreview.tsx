import Image from "next/image";
import Link from "next/link";

/**
 * AboutPreview — Mobile-first
 *
 * Mobile: empilhado (imagem topo, texto baixo)
 * Desktop: lado a lado
 */
export default function AboutPreview() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-noir text-white overflow-hidden">
      <div className="container-padded">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20 items-center">
          {/* Imagem */}
          <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[3/4] order-1">
            <Image
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1000&q=80"
              alt="A loja Val Quaresma"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute -inset-3 border border-gold/40 -z-10 hidden lg:block" aria-hidden="true" />
          </div>

          {/* Texto */}
          <div className="order-2">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold mb-4 sm:mb-6">
              Nossa História
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-5 sm:mb-8 leading-tight">
              Mais do que roupas,
              <br />
              <span className="italic text-gold">uma história</span>.
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white/70 leading-relaxed">
              <p>
                A Val Quaresma nasceu do desejo de oferecer mais do que peças
                bonitas — entregar experiência, identidade e cuidado em cada
                detalhe.
              </p>
              <p>
                Em nossa loja física, cada cliente é recebida com atenção
                personalizada. Agora, levamos essa essência para o digital.
              </p>
            </div>
            <Link
              href="/sobre"
              className="inline-block mt-8 sm:mt-10 text-xs uppercase tracking-widest text-gold border-b border-gold pb-1 hover:text-gold-light hover:border-gold-light transition-colors duration-300"
            >
              Conheça Nossa História →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
