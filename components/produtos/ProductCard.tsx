import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
    slug: string;
    name: string;
    price: string | number;
    mainImage: string;
    category?: {
      name: string;
    };
  };
}

/**
 * ProductCard — Card individual de produto
 *
 * Usado em:
 * - /produtos (listagem geral)
 * - Home (FeaturedProducts)
 *
 * Performance:
 * - Next/Image com sizes responsivo → carrega só o tamanho necessário
 * - Link prefetch → transição instantânea para a página de detalhe
 * - Hover com scale suave → feedback visual sem layout shift
 */
export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(product.price));

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Imagem com aspect ratio fixo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay sutil no hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      {/* Informações do produto */}
      <div className="p-3 sm:p-4">
        {product.category && (
          <span className="text-xs uppercase tracking-wider text-amber-600 font-medium">
            {product.category.name}
          </span>
        )}

        <h3 className="mt-1 text-sm sm:text-base font-medium text-neutral-900 line-clamp-2 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>

        <p className="mt-2 text-base sm:text-lg font-semibold text-neutral-900">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}
