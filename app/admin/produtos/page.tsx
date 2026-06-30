import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { PageHeader, Button } from "@/components/admin/FormFields";
import ProductActions from "@/components/admin/ProductActions";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const BADGE_LABELS: Record<string, string> = {
  NONE: "Sem badge",
  MAIS_VENDIDO: "Mais Vendido",
  NOVIDADE: "Novidade",
  PROMOCAO: "Promoção",
  EXCLUSIVO: "Exclusivo",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    status?: string;
    badge?: string;
    estoque?: string;
  }>;
}

/**
 * /admin/produtos
 *
 * Lista todos os produtos com filtros server-side (busca, categoria, status,
 * badge e estoque) e ações rápidas. Os filtros usam querystring + form GET,
 * o mesmo padrão da tela de pedidos: sem JS no cliente, recarrega via URL,
 * mantém o estado ao compartilhar/atualizar a página.
 */
export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const categoria = params.categoria || "";
  const status = params.status || "";
  const badge = params.badge || "";
  const estoque = params.estoque || "";

  // Monta o filtro do Prisma de forma incremental
  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }
  if (categoria) where.categoryId = categoria;
  if (status === "ativo") where.active = true;
  if (status === "inativo") where.active = false;
  if (badge) where.badge = badge;
  if (estoque === "esgotado") where.stock = { lte: 0 };
  if (estoque === "baixo") where.stock = { gt: 0, lte: 3 };

  const [products, categories, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.product.count(),
  ]);

  const hasFilters = !!(q || categoria || status || badge || estoque);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Produtos"
        description="Gerencie todos os produtos da loja."
        action={
          <Link href="/admin/produtos/novo">
            <Button>+ Novo Produto</Button>
          </Link>
        }
      />

      {/* ====== FILTROS ====== */}
      <div className="bg-white border border-gold/10 p-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs uppercase tracking-widest text-noir/70 mb-1">Buscar</label>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Nome ou slug do produto"
              className="w-full px-3 py-2 border border-noir/20 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-noir/70 mb-1">Categoria</label>
            <select name="categoria" defaultValue={categoria}
              className="px-3 py-2 border border-noir/20 text-sm focus:outline-none focus:border-gold">
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-noir/70 mb-1">Status</label>
            <select name="status" defaultValue={status}
              className="px-3 py-2 border border-noir/20 text-sm focus:outline-none focus:border-gold">
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-noir/70 mb-1">Badge</label>
            <select name="badge" defaultValue={badge}
              className="px-3 py-2 border border-noir/20 text-sm focus:outline-none focus:border-gold">
              <option value="">Todos</option>
              {Object.entries(BADGE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-noir/70 mb-1">Estoque</label>
            <select name="estoque" defaultValue={estoque}
              className="px-3 py-2 border border-noir/20 text-sm focus:outline-none focus:border-gold">
              <option value="">Todos</option>
              <option value="baixo">Baixo (1–3)</option>
              <option value="esgotado">Esgotado</option>
            </select>
          </div>

          <button type="submit" className="px-4 py-2 bg-noir text-white text-sm uppercase tracking-widest hover:bg-noir/80">
            Filtrar
          </button>
          {hasFilters && (
            <Link href="/admin/produtos" className="px-4 py-2 text-sm text-warm-gray hover:text-noir">
              Limpar
            </Link>
          )}
        </form>
      </div>

      {totalCount === 0 ? (
        <EmptyState />
      ) : products.length === 0 ? (
        <div className="bg-white border border-gold/10 p-12 text-center">
          <p className="font-serif text-xl text-noir mb-2">Nenhum produto encontrado</p>
          <p className="text-warm-gray mb-6">Tente ajustar ou limpar os filtros.</p>
          <Link href="/admin/produtos"><Button variant="outline">Limpar filtros</Button></Link>
        </div>
      ) : (
        <>
          <p className="text-xs text-warm-gray mb-3">
            Mostrando {products.length} de {totalCount} produtos
          </p>
          <div className="bg-white border border-gold/10 overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-noir text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Produto</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Preço</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Estoque</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Badge</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-xs uppercase tracking-widest font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noir/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-cream/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-noir/5 flex-shrink-0">
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-base text-noir truncate">
                            {product.name}
                            {product.featured && (
                              <span className="ml-2 text-xs text-gold-dark">★</span>
                            )}
                          </p>
                          <p className="text-xs text-warm-gray truncate">
                            /produtos/{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-noir">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-noir font-medium">
                      {formatPrice(product.price.toString())}
                    </td>
                    <td className="px-4 py-4 text-sm text-noir">
                      {product.stock ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      {product.badge !== "NONE" ? (
                        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest rounded ${
                          product.badge === "MAIS_VENDIDO" ? "bg-amber-100 text-amber-800" :
                          product.badge === "NOVIDADE" ? "bg-emerald-100 text-emerald-800" :
                          product.badge === "PROMOCAO" ? "bg-red-100 text-red-800" :
                          product.badge === "EXCLUSIVO" ? "bg-purple-100 text-purple-800" :
                          "bg-neutral-100 text-neutral-600"
                        }`}>
                          {product.badge === "MAIS_VENDIDO" ? "Mais Vendido" :
                           product.badge === "NOVIDADE" ? "Novidade" :
                           product.badge === "PROMOCAO" ? "Promoção" :
                           product.badge === "EXCLUSIVO" ? "Exclusivo" : "—"}
                        </span>
                      ) : (
                        <span className="text-xs text-warm-gray">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`
                          inline-block px-3 py-1 text-[10px] uppercase tracking-widest
                          ${
                            product.active
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }
                        `}
                      >
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <ProductActions
                        id={product.id}
                        active={product.active}
                        featured={product.featured}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-gold/10 p-12 text-center">
      <p className="font-serif text-2xl text-noir mb-2">
        Nenhum produto cadastrado
      </p>
      <p className="text-warm-gray mb-6">
        Comece adicionando os produtos que aparecerão na vitrine.
      </p>
      <Link href="/admin/produtos/novo">
        <Button>+ Criar Primeiro Produto</Button>
      </Link>
    </div>
  );
}
