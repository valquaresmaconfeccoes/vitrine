import { whatsappLink } from "@/lib/utils";

/**
 * LocationSection — Mobile-first
 *
 * Mobile: info acima, mapa abaixo (empilhado)
 * Desktop: lado a lado
 */
export default function LocationSection() {
  const whatsappMessage = "Olá! Gostaria de saber mais sobre a Val Quaresma.";

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-cream">
      <div className="container-padded">
        {/* Cabeçalho */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-14">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-dark mb-3">
            Visite-nos
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-noir mb-3">
            Nossa <span className="italic">loja física</span>
          </h2>
          <p className="text-sm sm:text-base text-warm-gray max-w-sm mx-auto">
            Venha conhecer pessoalmente nossas peças.
          </p>
        </div>

        {/* Grid info + mapa */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* Info */}
          <div className="bg-white p-6 sm:p-8 lg:p-12 flex flex-col">
            <h3 className="font-serif text-xl sm:text-2xl text-noir mb-5 sm:mb-6">
              Informações
            </h3>

            <div className="mb-5 sm:mb-6">
              <p className="text-[10px] uppercase tracking-widest text-gold-dark mb-2">
                Endereço
              </p>
              <address className="not-italic text-sm sm:text-base text-noir leading-relaxed">
                Rua Exemplo, 123<br />
                Bairro — Sua Cidade, PA<br />
                CEP: 00000-000
              </address>
            </div>

            <div className="mb-5 sm:mb-6">
              <p className="text-[10px] uppercase tracking-widest text-gold-dark mb-2">
                Horário
              </p>
              <ul className="text-sm sm:text-base text-noir space-y-1">
                <li>Segunda a Sexta: 9h às 18h</li>
                <li>Sábado: 9h às 13h</li>
                <li className="text-warm-gray">Domingo: Fechado</li>
              </ul>
            </div>

            <div className="mb-6 sm:mb-8">
              <p className="text-[10px] uppercase tracking-widest text-gold-dark mb-2">
                Telefone
              </p>
              <a
                href="tel:+559191862273"
                className="text-sm sm:text-base text-noir hover:text-gold-dark transition-colors"
              >
                (91) 9186-2273
              </a>
            </div>

            {/* CTAs */}
            <div className="mt-auto grid grid-cols-2 gap-3">
              <a
                href={whatsappLink("559191862273", whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-center text-xs py-3"
              >
                WhatsApp
              </a>
              <a
                href="https://maps.google.com/?q=Val+Quaresma"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-center text-xs py-3 border-noir text-noir hover:bg-noir hover:text-white"
              >
                Como Chegar
              </a>
            </div>
          </div>

          {/* Mapa */}
          <div className="relative min-h-[280px] sm:min-h-[350px] lg:min-h-[450px] bg-noir/5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.123!2d-48.504!3d-1.456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMjcnMTkuOSJTIDQ4wrAzMCcxNS4yIlc!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da loja Val Quaresma"
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
