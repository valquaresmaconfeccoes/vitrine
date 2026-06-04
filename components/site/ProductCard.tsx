import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string; // Prisma Decimal serializa como string
    mainImage: string;
    category: { name: string };
  };
  priority?: boolean; // para os primeiros cards (above the fold)
}

/**
 * ProductCard — Server Component reutilizável
 *
 * Por que separar em componente próprio:
 * - Reusado na Home (destaques), em /produtos (listagem), em /categoria/[slug]
 * - Manter consistência visual em todo o site
 * - Mudanças de design propagam automaticamente
 *
 * Decisões de UX:
 * - Aspect ratio 3/4 (vertical) — padrão de moda, valoriza o produto
 * - Hover sutil: imagem dá zoom suave (não muda layout, não causa CLS)
 * - Nome em sans (legibilidade) + preço em destaque (decisão de compra)
 * - Card inteiro é clicável (link envolvendo tudo)
 */
export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group block"
    >
      {/* ============ IMAGEM ============ */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream mb-4">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* ============ INFO ============ */}
      <div className="space-y-1">
        {/* Categoria */}
        <p className="text-[10px] uppercase tracking-widest text-gold-dark">
          {product.category.name}
        </p>

        {/* Nome */}
        <h3 className="font-serif text-lg text-noir group-hover:text-gold-dark transition-colors duration-300">
          {product.name}
        </h3>

        {/* Preço */}
        <p className="text-sm font-medium text-noir/80">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
