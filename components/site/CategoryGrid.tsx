import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

/**
 * CategoryGrid
 *
 * Server Component com fetch direto do Prisma.
 *
 * Estratégia:
 * - Busca apenas categorias ativas, ordenadas pelo campo `order`
 * - Mostra apenas as 3-4 principais na Home (o resto fica em /categorias)
 * - Imagem fallback se a categoria não tiver imagem cadastrada ainda
 *
 * Performance:
 * - Query rodada em build/request — zero JS no cliente
 * - Imagens com `loading="lazy"` (não são LCP, podem esperar)
 */
export default async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: 4,
    include: {
      _count: { select: { products: { where: { active: true } } } },
    },
  });

  if (categories.length === 0) {
    return null; // se ainda não tem categorias cadastradas, não renderiza nada
  }

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="container-padded">
        {/* ============ CABEÇALHO ============ */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark mb-4">
            Coleção
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-noir mb-4">
            Explore por <span className="italic">categoria</span>
          </h2>
          <p className="max-w-xl mx-auto text-warm-gray">
            Descubra peças cuidadosamente selecionadas para cada momento.
          </p>
        </div>

        {/* ============ GRID DE CATEGORIAS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-noir"
            >
              {/* Imagem da categoria (com fallback) */}
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                // Placeholder elegante quando a categoria não tem imagem
                <div className="absolute inset-0 bg-gradient-to-br from-noir to-gold-dark/40" />
              )}

              {/* Overlay com gradiente para legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent" />

              {/* Texto sobreposto */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="font-serif text-2xl sm:text-3xl mb-1 group-hover:text-gold transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-xs uppercase tracking-widest text-gold-light">
                  {category._count.products}{" "}
                  {category._count.products === 1 ? "peça" : "peças"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
