import Image from "next/image";
import Link from "next/link";

/**
 * Hero Section
 *
 * Server Component — zero JS no cliente para o LCP ficar instantâneo.
 *
 * Decisões críticas:
 * - `priority` na Image: imagem do hero é o LCP element → carrega ANTES de tudo
 * - `fill` + `object-cover`: imagem responsiva sem cortes feios
 * - `sizes="100vw"`: ajuda o Next a escolher a resolução certa por dispositivo
 * - Overlay preto: garante contraste do texto branco sobre qualquer imagem
 * - `min-h-[85vh]`: dá protagonismo sem ocupar tela inteira (deixa preview do que vem abaixo)
 *
 * IMPORTANTE: troque a URL `src` por uma imagem REAL da loja (de preferência
 * uma vitrine, modelo usando uma peça, ou flatlay editorial).
 */
export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* ============ IMAGEM DE FUNDO ============ */}
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
        alt="Val Quaresma — Moda feminina autoral"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* ============ OVERLAY ESCURO ============ */}
      <div
        className="absolute inset-0 bg-noir/60"
        aria-hidden="true"
      />

      {/* ============ DETALHE DOURADO DECORATIVO ============ */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* ============ CONTEÚDO ============ */}
      <div className="container-padded relative z-10 text-center text-white">
        {/* Tagline pequena acima do título */}
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold mb-6 animate-fade-in">
          Moda Feminina Autoral
        </p>

        {/* Headline principal */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight mb-6 animate-slide-up">
          Vista a sua
          <br />
          <span className="italic text-gold">elegância</span>
        </h1>

        {/* Subtítulo */}
        <p className="max-w-xl mx-auto text-base sm:text-lg text-white/80 leading-relaxed mb-10 animate-slide-up">
          Peças exclusivas, atendimento personalizado e a confiança de uma loja
          que entende de estilo há anos.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <Link
            href="/produtos"
            className="btn-primary w-full sm:w-auto min-w-[200px]"
          >
            Ver Coleção
          </Link>
          <a
            href="https://wa.me/559191862273?text=Olá! Vim pelo site e gostaria de mais informações."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full sm:w-auto min-w-[200px] text-white border-white hover:bg-white hover:text-noir"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>

      {/* ============ SCROLL HINT ============ */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/60 hidden sm:block"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </section>
  );
}
