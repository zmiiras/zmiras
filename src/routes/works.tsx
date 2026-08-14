import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Footer } from "@/components/site/Footer";
import { HamzaChat } from "@/components/site/HamzaChat";
import { Header } from "@/components/site/Header";
import { PortfolioCard } from "@/components/site/PortfolioSection";
import { portfolioQuery } from "@/lib/content";

const title = "معرض أعمال ZMiras | مشاريع مواقع وتطبيقات وهويات رقمية";
const description =
  "استعرض معرض أعمال زميراس الكامل: متاجر إلكترونية، تطبيقات جوال، مواقع شركات وهويات بصرية منفذة لعملائنا.";

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorksPage,
});

function WorksPage() {
  const { data: items = [] } = useQuery(portfolioQuery);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="surface-grid min-h-screen overflow-x-hidden">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
        <div className="text-center">
          <p className="text-sm font-bold text-accent">أعمالي</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">معرض الأعمال الكامل</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            نخبة من المشاريع التي نفذناها لعملائنا في السعودية والخليج.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items
            .filter((i) => i.is_active)
            .map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
        </div>
      </main>
      <Footer />
      <HamzaChat />

      {showTop && (
        <button
          type="button"
          aria-label="العودة للأعلى"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="glow-ring fixed right-4 bottom-4 z-[85] grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}