import type { NextConfig } from "next";

/**
 * Next.js Config — Val Quaresma
 *
 * `remotePatterns` é OBRIGATÓRIO para o componente <Image> aceitar
 * imagens de domínios externos. Sem isso, dá erro:
 * "hostname is not configured under images"
 *
 * Atualize esta lista conforme o cliente cadastra produtos com imagens
 * hospedadas em outros serviços (Cloudinary, S3, etc).
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Adicione aqui o host onde as imagens reais ficarão (S3, Cloudinary, Railway Volume...)
      // Exemplo:
      // {
      //   protocol: "https",
      //   hostname: "res.cloudinary.com",
      //   pathname: "/seu-cloud/**",
      // },
    ],
    // Formatos modernos: WebP e AVIF — menores e mais rápidos
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
