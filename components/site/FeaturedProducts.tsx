import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "./ProductCard";

/**
 * FeaturedProducts
 *
 * Server Component que busca produtos marcados como `featured: true`.
 * O cliente controla essa flag pelo painel admin → vitrine sempre dinâmica.
 *
 * Estratégia:
 * - Apenas 4 produtos (Home não pode pesar muito)
 * - `include: { category }` carrega o nome da categoria (1 query, não N+1)
 * - Decimal do Prisma serializa como string → tratamos no ProductCard
 *
 * Fallback inteligente: se não tiver featured cadastrado,
 * pega os produtos mais recentes.
 */
export default async function FeaturedProducts() {
  let products = await prisma.product.findMany({
    where: { active: true, featured: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  // Fallback: se não tem nenhum featured, mostra os 4 mais recentes
  if (products.length === 0) {
    products = await prisma.product.findMany({
      where: { active: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true } } },
    });
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-padded">
        {/* ============ CABEÇALHO ============ */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-dark mb-4">
              Destaques
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-noir">
              Selecionados para <span className="italic">você</span>
            </h2>
          </div>
          <Link
            href="/produtos"
            className="text-sm uppercase tracking-widest text-noir border-b border-gold pb-1 hover:text-gold-dark transition-colors duration-300 self-start sm:self-auto"
          >
            Ver Todos →
          </Link>
        </div>

        {/* ============ GRID DE PRODUTOS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price.toString(),
                mainImage: product.mainImage,
                category: product.category,
              }}
              priority={index < 2} // 2 primeiros com priority
            />
          ))}
        </div>
      </div>
    </section>
  );
}
