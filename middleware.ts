import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Middleware — Proteção de Rotas
 *
 * Roda ANTES de cada request atingir a página/API correspondente.
 *
 * Lógica:
 * 1. Verifica se a rota requisitada começa com /admin
 * 2. Se sim, exige sessão válida
 * 3. Se não houver sessão, redireciona para /login com o destino original
 * 4. Após o login, NextAuth redireciona de volta automaticamente
 *
 * Performance:
 * - Roda no Edge Runtime (rápido, próximo do usuário)
 * - Sem queries no banco (valida só o JWT do cookie)
 * - `config.matcher` limita quais rotas passam por aqui
 */
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/login";

  // Bloqueia acesso ao /admin sem login
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    // Salva o destino original para redirect após login
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se já está logado e tenta acessar /login, manda pro dashboard
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

/**
 * matcher: define quais rotas passam pelo middleware
 *
 * - Inclui /admin/* e /login
 * - EXCLUI _next, api, arquivos estáticos
 *   (performance crítica — sem isso o middleware roda em CADA requisição,
 *   inclusive em assets, CSS, imagens)
 */
export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
  ],
};
