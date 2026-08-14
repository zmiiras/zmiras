import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { portfolioQuery, siteSettingsQuery } from "@/lib/content";
import { Reveal } from "@/components/site/Reveal";
import type { PortfolioItem } from "@/lib/zmiras";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <a
      href={item.link_url || "#"}
      target="_blank"
      rel="noreferrer"
      className="glass hover:glow-ring group flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.99]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="surface-grid grid h-full w-full place-items-center text-3xl font-black text-primary/25">
            ZMiras
          </div>
        )}
        <span className="absolute top-3 right-3 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold text-primary-foreground">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-black">{item.title}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{item.description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent">
          زيارة المشروع <ExternalLink className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}

export function PortfolioSection() {
  const { data: items = [] } = useQuery(portfolioQuery);
  const { data: settings } = useQuery(siteSettingsQuery);
  const active = items.filter((i) => i.is_active);

  return (
    <section id="works" className="relative py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="mb-4 inline-flex items-center justify-center rounded-full bg-accent/15 border border-accent/30 px-5 py-2 text-sm sm:text-base font-black tracking-wide text-accent uppercase shadow-sm">{settings?.portfolio_kicker ?? "أعمالي"}</span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
            {settings?.portfolio_title ?? "مشاريع نفخر بتنفيذها"}
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.slice(0, 6).map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i, 5) * 80} className="grid">
              <PortfolioCard item={item} />
            </Reveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/works"
            className="glass inline-flex items-center justify-center rounded-2xl px-7 py-4 text-base font-bold text-primary"
          >
            عرض جميع الأعمال
          </Link>
        </div>
      </div>
    </section>
  );
}