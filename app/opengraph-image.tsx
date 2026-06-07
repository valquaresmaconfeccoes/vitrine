import { ImageResponse } from "next/og";

/**
 * opengraph-image.tsx — Gera a imagem de preview automaticamente
 *
 * Quando alguém compartilha o link da Val Quaresma no WhatsApp,
 * Instagram ou Facebook, essa imagem aparece no preview.
 *
 * Acessível em: /opengraph-image
 * O Next.js detecta esse arquivo e usa automaticamente no metadata.
 *
 * Para trocar: substitua este arquivo por uma imagem estática
 * /public/opengraph-image.jpg (1200x630px) e delete este arquivo.
 */

export const runtime = "edge";
export const alt = "Val Quaresma — Moda Feminina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          position: "relative",
        }}
      >
        {/* Bordas decorativas douradas */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            bottom: "20px",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            right: "30px",
            bottom: "30px",
            border: "1px solid rgba(212, 175, 55, 0.15)",
            display: "flex",
          }}
        />

        {/* Conteúdo central */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Decoração superior */}
          <div
            style={{
              width: "60px",
              height: "1px",
              backgroundColor: "#d4af37",
              display: "flex",
            }}
          />

          {/* Nome da loja */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#d4af37",
              letterSpacing: "4px",
              display: "flex",
            }}
          >
            Val Quaresma
          </div>

          {/* Subtítulo */}
          <div
            style={{
              fontSize: "18px",
              color: "rgba(212, 175, 55, 0.7)",
              letterSpacing: "8px",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Moda Feminina
          </div>

          {/* Decoração inferior */}
          <div
            style={{
              width: "60px",
              height: "1px",
              backgroundColor: "#d4af37",
              marginTop: "8px",
              display: "flex",
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: "24px",
              display: "flex",
            }}
          >
            Belém — PA • Terra Firme
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
