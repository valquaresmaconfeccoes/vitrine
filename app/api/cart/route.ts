import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";

// GET — Retorna o carrinho do cliente
export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const cart = await prisma.cart.upsert({
    where: { customerId: session.id },
    update: {},
    create: { customerId: session.id },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, slug: true, price: true, mainImage: true, stock: true, weight: true, width: true, height: true, length: true } },
          variant: { select: { id: true, name: true, price: true, stock: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json({ cart });
}

// POST — Adiciona item ao carrinho
export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { productId, variantId, quantity = 1 } = await request.json();
  if (!productId) return NextResponse.json({ error: "Produto obrigatório." }, { status: 400 });

  const cart = await prisma.cart.upsert({
    where: { customerId: session.id },
    update: {},
    create: { customerId: session.id },
  });

  // Upsert: se já existe, incrementa quantidade
  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variantId || null },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId: variantId || null, quantity },
    });
  }

  return NextResponse.json({ success: true });
}

// PUT — Atualiza quantidade
export async function PUT(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { itemId, quantity } = await request.json();
  if (!itemId || quantity < 1) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  return NextResponse.json({ success: true });
}

// DELETE — Remove item do carrinho
export async function DELETE(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { itemId } = await request.json();
  if (!itemId) return NextResponse.json({ error: "Item obrigatório." }, { status: 400 });

  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ success: true });
}
