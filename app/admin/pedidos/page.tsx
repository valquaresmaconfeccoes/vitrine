import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Aguardando pagamento", color: "bg-yellow-100 text-yellow-800" },
  PAYMENT_APPROVED: { label: "Pago", color: "bg-green-100 text-green-800" },
  PROCESSING: { label: "Em preparação", color: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Entregue", color: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Reembolsado", color: "bg-neutral-100 text-neutral-800" },
};

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
    take: 50,
  });

  const fmt = (v: number | unknown) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Pedidos</h1>
          <p className="mt-1 text-neutral-500">{orders.length} pedidos</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">Nenhum pedido ainda.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Pedido</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Data</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const s = statusLabels[order.status] || statusLabels.PENDING;
                  return (
                    <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-4 py-3 font-mono text-xs font-medium">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-neutral-900">{order.customer.name}</p>
                        <p className="text-xs text-neutral-500">{order.customer.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                      </td>
                      <td className="px-4 py-3 font-medium">{fmt(order.total)}</td>
                      <td className="px-4 py-3 text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/pedidos/${order.id}`} className="text-amber-600 hover:text-amber-700 text-xs font-medium">
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
