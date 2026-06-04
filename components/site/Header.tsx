"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Header — Cabeçalho do site público
 *
 * Por que Client Component:
 * - Menu mobile precisa de estado (`isOpen`)
 * - Efeito de scroll (shrink ao rolar) precisa de useEffect
 * - Bundle JS é pequeno (~3kb) — vale a interatividade
 *
 * Decisões de UX:
 * - Logo grande e centralizado no mobile (loja de moda — branding importa)
 * - Sticky top com efeito de "encolher" ao rolar (chama atenção sem atrapalhar)
 * - Menu mobile fullscreen (padrão e-commerce de luxo)
 * - CTA "Fale Conosco" destacado em dourado
 */

const navigation = [
  { name: "Início", href: "/" },
  { name: "Produtos", href: "/produtos" },
  { name: "Categorias", href: "/categorias" },
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efeito de "encolher" o header ao rolar a página
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloqueia scroll do body quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`
          sticky top-0 z-40 w-full
          bg-noir/95 backdrop-blur-sm
          border-b border-gold/20
          transition-all duration-300
          ${isScrolled ? "py-2" : "py-4"}
        `}
      >
        <div className="container-padded">
          <div className="flex items-center justify-between">
            {/* ============ LOGO ============ */}
            <Link
              href="/"
              className="group flex flex-col items-start"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span
                className={`
                  font-serif text-gold tracking-wider
                  transition-all duration-300
                  ${isScrolled ? "text-2xl" : "text-3xl md:text-4xl"}
                `}
              >
                Val Quaresma
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-gold-light/70 -mt-1">
                Moda Feminina
              </span>
            </Link>

            {/* ============ NAVEGAÇÃO DESKTOP ============ */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    relative text-sm uppercase tracking-widest
                    text-white/80 hover:text-gold
                    transition-colors duration-300
                    after:content-[''] after:absolute after:left-0 after:-bottom-1
                    after:h-px after:w-0 after:bg-gold
                    after:transition-all after:duration-300
                    hover:after:w-full
                  "
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* ============ CTA WHATSAPP (DESKTOP) ============ */}
            <a
              href="https://wa.me/559191862273?text=Olá! Vim pelo site e gostaria de mais informações."
              target="_blank"
              rel="noopener noreferrer"
              className="
                hidden lg:inline-flex items-center gap-2
                px-5 py-2.5
                border border-gold text-gold
                text-xs uppercase tracking-widest
                hover:bg-gold hover:text-noir
                transition-colors duration-300
              "
            >
              Fale Conosco
            </a>

            {/* ============ BOTÃO MENU MOBILE ============ */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-gold p-2 -mr-2"
              aria-label="Abrir menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ============ MENU MOBILE — OVERLAY FULLSCREEN ============ */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden
          bg-noir
          transition-opacity duration-300
          ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header do menu mobile */}
          <div className="container-padded py-4 flex items-center justify-between border-b border-gold/20">
            <span className="font-serif text-2xl text-gold tracking-wider">
              Val Quaresma
            </span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gold p-2 -mr-2"
              aria-label="Fechar menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Links do menu mobile */}
          <nav className="flex-1 flex flex-col justify-center container-padded">
            <ul className="space-y-6 text-center">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="
                      block font-serif text-3xl text-white
                      hover:text-gold transition-colors duration-300
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA do menu mobile */}
          <div className="container-padded pb-8">
            <a
              href="https://wa.me/559191862273?text=Olá! Vim pelo site e gostaria de mais informações."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="
                flex items-center justify-center gap-2 w-full
                py-4 bg-gold text-noir
                text-sm uppercase tracking-widest font-medium
                hover:bg-gold-light transition-colors duration-300
              "
            >
              Fale Conosco no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
