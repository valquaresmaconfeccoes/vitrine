import { whatsappLink } from "@/lib/utils";

/**
 * LocationSection
 *
 * SEO LOCAL crítico — Google usa essa seção para:
 * - Ranquear no Google Maps
 * - Mostrar no painel lateral da busca
 * - "Próximo a mim" — quando alguém busca lojas de roupa na cidade
 *
 * Layout split:
 * - Esquerda: info textual (endereço, telefone, horários, CTAs)
 * - Direita: iframe do Google Maps
 *
 * Por que iframe e não imagem estática:
 * - Cliente pode clicar e abrir rotas direto no Google Maps
 * - Gratuito (sem chave de API)
 * - Interativo no mobile (cliente toca → vai pro app de mapas)
 *
 * IMPORTANTE: substitua a URL do iframe pela do endereço real da loja
 * 1. Vá no Google Maps, busque o endereço da loja
 * 2. Clique em "Compartilhar" → "Incorporar um mapa"
 * 3. Copie só a URL do `src`
 */
export default function LocationSection() {
  const whatsappMessage = "Olá! Gostaria de saber mais sobre a Val Quaresma.";

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="container-padded">
        {/* ============ CABEÇALHO ============ */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark mb-4">
            Visite-nos
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-noir mb-4">
            Nossa <span className="italic">loja física</span>
          </h2>
          <p className="max-w-xl mx-auto text-warm-gray">
            Venha conhecer pessoalmente nossas peças e ser atendida com a
            elegância que você merece.
          </p>
        </div>

        {/* ============ GRID INFO + MAPA ============ */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ===== INFO ===== */}
          <div className="bg-white p-8 lg:p-12 flex flex-col">
            <h3 className="font-serif text-2xl text-noir mb-6">
              Informações
            </h3>

            {/* Endereço */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-gold-dark mb-2">
                Endereço
              </p>
              <address className="not-italic text-noir leading-relaxed">
                Rua Exemplo, 123
                <br />
                Bairro — Sua Cidade, PA
                <br />
                CEP: 00000-000
              </address>
            </div>

            {/* Horários */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-gold-dark mb-2">
                Horário de Funcionamento
              </p>
              <ul className="text-noir space-y-1">
                <li>Segunda a Sexta: 9h às 18h</li>
                <li>Sábado: 9h às 13h</li>
                <li className="text-warm-gray">Domingo: Fechado</li>
              </ul>
            </div>

            {/* Telefone */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-gold-dark mb-2">
                Telefone
              </p>
              <a
                href="tel:+559191862273"
                className="text-noir hover:text-gold-dark transition-colors duration-300"
              >
                (91) 9186-2273
              </a>
            </div>

            {/* CTAs */}
            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappLink("559191862273", whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1"
              >
                WhatsApp
              </a>
              <a
                href="https://maps.google.com/?q=Val+Quaresma"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex-1 border-noir text-noir hover:bg-noir hover:text-white"
              >
                Como Chegar
              </a>
            </div>
          </div>

          {/* ===== MAPA ===== */}
          <div className="relative aspect-square lg:aspect-auto min-h-[400px] bg-noir/5">
            {/*
              SUBSTITUA O src ABAIXO:
              1. Abra google.com/maps
              2. Busque o endereço da loja
              3. Compartilhar → Incorporar mapa
              4. Cole só a URL do iframe aqui
            */}
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
