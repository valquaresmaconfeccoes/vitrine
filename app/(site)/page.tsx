import Hero from "@/components/site/Hero";
import CategoryGrid from "@/components/site/CategoryGrid";
import FeaturedProducts from "@/components/site/FeaturedProducts";
import AboutPreview from "@/components/site/AboutPreview";
import LocationSection from "@/components/site/LocationSection";

/**
 * Home Page — app/(site)/page.tsx
 *
 * Server Component puro. Cada seção busca seus próprios dados do banco
 * (CategoryGrid e FeaturedProducts são async).
 *
 * Ordem estratégica:
 * 1. Hero          → impacto visual + CTA imediato
 * 2. Categorias    → navegação rápida por interesse
 * 3. Destaques     → produtos selecionados (gera desejo)
 * 4. Sobre         → credibilidade (loja física, história)
 * 5. Localização   → SEO local + ponte físico/digital
 *
 * Cada bloco é independente — fácil de reordenar ou substituir no futuro.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <AboutPreview />
      <LocationSection />
    </>
  );
}
