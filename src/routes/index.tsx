import { createFileRoute } from "@tanstack/react-router";

import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { HamzaChat } from "@/components/site/HamzaChat";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { StatsSection } from "@/components/site/StatsSection";
import { PartnersSection } from "@/components/site/PartnersSection";
import { PortfolioSection } from "@/components/site/PortfolioSection";
import { Reveal } from "@/components/site/Reveal";
import { ServicesSection } from "@/components/site/ServicesSection";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";

const title = "ZMiras زميراس | مواقع وتطبيقات وبطاقات NFC وخرائط جوجل";
const description =
  "زميراس: تصميم مواقع، تطبيقات جوال، حجز دومينات، بطاقات NFC ذكية، واسترجاع نشاط خرائط جوجل بجودة فاخرة في السعودية والخليج.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ZMiras زميراس",
          description,
          founder: {
            "@type": "Person",
            name: "حمادة أيوب",
            jobTitle: "مهندس ومؤسس زميراس",
            description:
              "مهندس مصري شاب، بسيط وشغّيل، بنى منصة زميراس من الصفر عشان يساعد الناس وأصحاب المشاريع على بناء حضورهم الرقمي.",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="surface-grid min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <StatsSection />
        <Reveal>
          <ServicesSection />
        </Reveal>
        <Reveal>
          <PortfolioSection />
        </Reveal>
        <PartnersSection />
        <Reveal>
          <TestimonialsSection />
        </Reveal>
        <Reveal>
          <ContactSection />
        </Reveal>
      </main>
      <Footer />
      <HamzaChat />
    </div>
  );
}
