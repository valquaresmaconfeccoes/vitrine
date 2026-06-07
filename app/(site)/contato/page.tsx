import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Val Quaresma",
  description:
    "Entre em contato com a Val Quaresma. Endereço, horário de funcionamento e WhatsApp. Loja de moda feminina em Belém do Pará.",
  openGraph: {
    title: "Contato | Val Quaresma",
    description: "Endereço, horário e WhatsApp da Val Quaresma.",
  },
};

/**
 * /contato — Página de contato com mapa, horários e WhatsApp
 *
 * SEO Local essencial:
 * - Endereço completo (Google indexa e mostra no Maps)
 * - Horário de funcionamento
 * - Telefone/WhatsApp
 * - Schema.org LocalBusiness (structured data)
 * - Google Maps embed
 *
 * Conteúdo fixo (decisão do cliente).
 */
export default function ContatoPage() {
  const phoneNumber = "559191862273";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    "Olá! Gostaria de saber mais sobre os produtos da loja."
  )}`;

  // Schema.org LocalBusiness — ajuda o Google a entender que é um negócio local
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Val Quaresma",
    description: "Loja de moda feminina em Belém do Pará",
    url: "https://valquaresma.up.railway.app",
    telephone: "+55-91-91862273",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua a definir",
      addressLocality: "Belém",
      addressRegion: "PA",
      postalCode: "66000-000",
      addressCountry: "BR",
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
        closes: "14:00",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-neutral-900 text-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif">
              Fale Conosco
            </h1>
            <p className="mt-4 text-neutral-300 text-lg max-w-2xl mx-auto">
              Estamos prontos para te atender. Venha nos visitar ou
              mande uma mensagem pelo WhatsApp!
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Coluna esquerda — Informações */}
            <div className="space-y-10">
              {/* Endereço */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">Endereço</h2>
                </div>
                <p className="text-neutral-700 leading-relaxed ml-13">
                  Rua a definir<br />
                  Belém — PA<br />
                  CEP: 66000-000
                </p>
              </div>

              {/* Horário */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">Horário de Funcionamento</h2>
                </div>
                <div className="ml-13 space-y-1 text-neutral-700">
                  <p className="flex justify-between max-w-xs">
                    <span>Segunda a Sexta</span>
                    <span className="font-medium">09h — 18h</span>
                  </p>
                  <p className="flex justify-between max-w-xs">
                    <span>Sábado</span>
                    <span className="font-medium">09h — 14h</span>
                  </p>
                  <p className="flex justify-between max-w-xs">
                    <span>Domingo</span>
                    <span className="font-medium text-red-500">Fechado</span>
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">WhatsApp</h2>
                </div>
                <p className="text-neutral-700 ml-13 mb-4">
                  Atendimento rápido pelo WhatsApp. Tire dúvidas, reserve
                  peças ou peça fotos adicionais.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-13 inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700
                             text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chamar no WhatsApp
                </a>
              </div>
            </div>

            {/* Coluna direita — Mapa */}
            <div className="space-y-4">
              <div className="aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127487.63607917498!2d-48.5495!3d-1.4558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48c1281cf1d37%3A0xce5da40ea7b1370c!2sBel%C3%A9m%2C%20PA!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Val Quaresma"
                />
              </div>
              <p className="text-sm text-neutral-500 text-center">
                📍 Clique no mapa para abrir no Google Maps
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
