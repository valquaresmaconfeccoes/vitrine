import { Suspense } from "react";
import LoginForm from "./LoginForm";

/**
 * Página de Login — /login
 *
 * Server Component que renderiza o LoginForm (Client Component).
 *
 * Por que dividir em dois:
 * - A página em si pode ser estática (Server Component)
 * - O formulário precisa de useState + signIn (Client Component)
 * - Separação melhora performance e bundle size
 *
 * Suspense é necessário porque o LoginForm usa useSearchParams()
 * (Next 15 exige Suspense boundary para hooks de search params)
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-noir px-4">
      <div className="w-full max-w-md">
        {/* ============ LOGO ============ */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-gold tracking-wider">
            Val Quaresma
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-light/60 mt-2">
            Painel Administrativo
          </p>
        </div>

        {/* ============ FORMULÁRIO ============ */}
        <div className="bg-noir border border-gold/20 p-8 sm:p-10">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* ============ LINK PARA O SITE ============ */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-xs uppercase tracking-widest text-white/40 hover:text-gold transition-colors duration-300"
          >
            ← Voltar para o site
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Fallback simples enquanto o LoginForm carrega
 */
function LoginFormFallback() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-white/5 rounded" />
      <div className="h-10 bg-white/5 rounded" />
      <div className="h-12 bg-gold/30 rounded" />
    </div>
  );
}
