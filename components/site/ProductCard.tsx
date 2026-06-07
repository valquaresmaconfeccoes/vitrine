import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    mainImage: string;
    category: { name: string };
  };
  priority?: boolean;
}

/**
 * ProductCard — Mobile-first
 *
 * Aspect ratio 3/4 (padrão moda) em todos os tamanhos.
 * Texto compacto no mobile, mais espaçado no desktop.
 */
export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
      {/* Imagem */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream mb-2 sm:mb-3">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="space-y-0.5 sm:space-y-1">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gold-dark">
          {product.category.name}
        </p>
        <h3 className="font-serif text-sm sm:text-base lg:text-lg text-noir group-hover:text-gold-dark transition-colors duration-300 leading-tight">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-noir/80">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
