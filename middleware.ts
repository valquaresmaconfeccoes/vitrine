import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware — Proteção de Rotas
 *
 * Usa getToken() em vez de auth() para evitar o problema do
 * bcryptjs com o Edge Runtime — getToken() só lê o cookie JWT,
 * sem executar nenhuma lógica de Node.js incompatível.
 *
 * Lógica:
 * 1. Verifica se a rota é /admin/*
 * 2. Tenta ler o token JWT do cookie
 * 3. Se não tiver token válido → redireciona para /login
 * 4. Se já logado e acessar /login → redireciona para /admin/dashboard
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login";

  // Só age em rotas admin e login
  if (!isAdminRoute && !isLoginPage) {
    return NextResponse.next();
  }

  // Lê o token JWT do cookie (Edge-compatible)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: "__Secure-authjs.session-token",
  });

  // Fallback para ambiente sem HTTPS (dev local)
  const tokenFallback = token ?? await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: "authjs.session-token",
  });

  const isLoggedIn = !!tokenFallback;

  // Bloqueia /admin/* sem login
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se já logado e tenta acessar /login → manda pro dashboard
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
  ],
};
