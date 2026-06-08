import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createCustomerToken, setCustomerCookie } from "@/lib/customer-auth";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
    }

    const existing = await prisma.customer.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "Este email já está cadastrado." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        password: hashedPassword,
        cart: { create: {} },
      },
    });

    const token = await createCustomerToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    const cookie = setCustomerCookie(token);
    const response = NextResponse.json({
      success: true,
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });
    response.cookies.set(cookie.name, cookie.value, cookie.options as never);
    return response;
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
