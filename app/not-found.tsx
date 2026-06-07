import Link from "next/link";

/**
 * 404 — Página não encontrada
 *
 * Mantém a identidade visual da Val Quaresma (preto/dourado).
 * Redireciona para home ou produtos.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl sm:text-8xl font-serif text-gold mb-4">404</p>

        <h1 className="text-xl sm:text-2xl font-serif text-white mb-3">
          Página não encontrada
        </h1>

        <p className="text-sm sm:text-base text-white/60 mb-8 leading-relaxed">
          A página que você procura não existe ou foi movida.
          Que tal dar uma olhada nas nossas peças?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/produtos"
            className="px-6 py-3 bg-gold text-noir text-xs uppercase tracking-widest font-medium
                       hover:bg-gold-light transition-colors duration-300"
          >
            Ver Produtos
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-gold/40 text-gold text-xs uppercase tracking-widest
                       hover:bg-gold hover:text-noir transition-colors duration-300"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
