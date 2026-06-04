import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/**
 * Layout do Site Público — app/(site)/layout.tsx
 *
 * AJUSTE: WhatsApp foi movido do root para cá.
 * Motivo: o admin (/admin/*) não precisa do botão flutuante,
 * que poderia até atrapalhar formulários do painel.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* WhatsApp flutuante — só no site público */}
      <WhatsAppButton
        phoneNumber="559191862273"
        message="Olá! Vim pelo site e gostaria de mais informações."
      />
    </div>
  );
}
