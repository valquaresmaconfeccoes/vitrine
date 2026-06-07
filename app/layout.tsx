import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

/**
 * ROOT LAYOUT — app/layout.tsx
 *
 * Este é o layout raiz que envolve TODA a aplicação (site + admin + login).
 * Responsável por:
 * - Fontes otimizadas (Playfair + Inter)
 * - Metadata SEO global
 * - Schema.org LocalBusiness
 * - AuthProvider (contexto de sessão para Client Components)
 * - Tag <html> e <body>
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://valquaresma.up.railway.app"),
  title: {
    default: "Val Quaresma | Moda Feminina Autoral",
    template: "%s | Val Quaresma",
  },
  description:
    "Val Quaresma — moda feminina com peças exclusivas, atendimento personalizado e a elegância que você merece. Confira nossa coleção.",
  keywords: [
    "Val Quaresma",
    "moda feminina",
    "roupas femininas",
    "loja de roupas",
    "moda autoral",
    "vestidos",
    "looks femininos",
  ],
  authors: [{ name: "Val Quaresma" }],
  creator: "Val Quaresma",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://valquaresma.up.railway.app",
    siteName: "Val Quaresma",
    title: "Val Quaresma | Moda Feminina Autoral",
    description:
      "Moda feminina com peças exclusivas e atendimento personalizado. Visite nossa loja física ou compre pelo WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Val Quaresma | Moda Feminina Autoral",
    description: "Moda feminina com peças exclusivas e atendimento personalizado.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Val Quaresma",
  image: "https://valquaresma.up.railway.app/opengraph-image",
  "@id": "https://valquaresma.up.railway.app",
  url: "https://valquaresma.up.railway.app",
  telephone: "+559191862273",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Passagem Pinheiro, nº 323",
    addressLocality: "Belém",
    addressRegion: "PA",
    postalCode: "66079-720",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.4626843272657697,
    longitude: -48.45346344962605,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
  sameAs: ["https://www.instagram.com/valdilene_quaresma"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-white text-noir antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Script
          id="schema-local-business"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </body>
    </html>
  );
}
