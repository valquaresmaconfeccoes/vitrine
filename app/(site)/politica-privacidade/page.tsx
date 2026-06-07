import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Val Quaresma",
  description: "Saiba como a Val Quaresma coleta, usa e protege seus dados pessoais.",
};

/**
 * /politica-privacidade — Exigida pela LGPD
 *
 * Conteúdo fixo, alinhado com as práticas reais:
 * - Coleta de dados via WhatsApp e formulários
 * - Não há e-commerce (ainda), então é simples
 * - Quando virar e-commerce, precisará ser expandida
 */
export default function PoliticaPrivacidadePage() {
  return (
    <section className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-900 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-neutral-400 text-sm">
            Última atualização: Junho de 2026
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="prose prose-neutral prose-sm sm:prose-base max-w-none space-y-8">

          <div>
            <h2 className="text-xl font-bold text-neutral-900 font-serif mb-3">
              1. Quem somos
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              A Val Quaresma é uma loja de moda feminina localizada na Passagem
              Pinheiro, nº 323, Terra Firme, Belém — PA, CEP 66079-720. Esta
              política descreve como coletamos, usamos e protegemos suas
              informações pessoais.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900 font-serif mb-3">
              2. Dados que coletamos
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Podemos coletar os seguintes dados quando você interage conosco
              pelo site ou WhatsApp: nome, telefone, endereço de e-mail e
              endereço para entrega (quando aplicável). Também coletamos dados
              de navegação anônimos como páginas visitadas e tempo de
              permanência, através de ferramentas de análise.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900 font-serif mb-3">
              3. Como usamos seus dados
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Seus dados são utilizados exclusivamente para: atender seus
              pedidos e solicitações via WhatsApp, enviar informações sobre
              produtos quando solicitado, melhorar a experiência de navegação
              no site e cumprir obrigações legais.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900 font-serif mb-3">
              4. Compartilhamento de dados
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com
              terceiros para fins comerciais. Seus dados podem ser
              compartilhados apenas com prestadores de serviços essenciais
              (como plataformas de hospedagem) e quando exigido por lei.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900 font-serif mb-3">
              5. Seus direitos (LGPD)
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018),
              você tem direito a: acessar seus dados pessoais, solicitar correção
              de dados incompletos ou desatualizados, solicitar a exclusão dos seus
              dados e revogar o consentimento a qualquer momento. Para exercer
              esses direitos, entre em contato conosco pelo WhatsApp.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900 font-serif mb-3">
              6. Segurança
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Adotamos medidas técnicas e administrativas para proteger seus
              dados pessoais contra acessos não autorizados, perda ou
              alteração. Nosso site utiliza conexão segura (HTTPS).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900 font-serif mb-3">
              7. Contato
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Para dúvidas sobre esta política ou sobre o tratamento dos seus
              dados, entre em contato pelo WhatsApp:{" "}
              <a
                href="https://wa.me/559191862273"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 underline"
              >
                (91) 9186-2273
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
