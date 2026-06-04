import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/**
 * Fontes otimizadas via next/font/google
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
  metadataBase: new URL("https://valquaresma.com.br"),
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
    url: "https://valquaresma.com.br",
    siteName: "Val Quaresma",
    title: "Val Quaresma | Moda Feminina Autoral",
    description:
      "Moda feminina com peças exclusivas e atendimento personalizado. Visite nossa loja física ou compre pelo WhatsApp.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Val Quaresma — Moda Feminina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Val Quaresma | Moda Feminina Autoral",
    description: "Moda feminina com peças exclusivas e atendimento personalizado.",
    images: ["/og-image.jpg"],
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
  image: "https://valquaresma.com.br/og-image.jpg",
  "@id": "https://valquaresma.com.br",
  url: "https://valquaresma.com.br",
  telephone: "+559191862273",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Exemplo, 123",
    addressLocality: "Sua Cidade",
    addressRegion: "PA",
    postalCode: "00000-000",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.4558,
    longitude: -48.5039,
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
  sameAs: ["https://www.instagram.com/valquaresma"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-white text-noir antialiased">
        {children}
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
