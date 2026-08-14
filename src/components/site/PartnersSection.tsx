import { useQuery } from "@tanstack/react-query";
import { ArrowUpLeft } from "lucide-react";

import { partnersQuery } from "@/lib/content";
import type { Partner } from "@/lib/zmiras";
import { Reveal } from "@/components/site/Reveal";

function PartnerCard({ p }: { p: Partner }) {
  return (
    <a
      href={p.link_url || "#"}
      target="_blank"
      rel="noreferrer"
      className="glass group relative flex w-44 shrink-0 flex-col items-center gap-2.5 rounded-2xl p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-52"
    >
      <div className="grid h-28 w-full place-items-center overflow-hidden rounded-xl bg-secondary/40">
        {p.logo_url ? (
          <img
            src={p.logo_url}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-xl font-black text-primary/60">{p.title.slice(0, 2)}</span>
        )}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="truncate text-xs font-black text-foreground sm:text-sm">{p.title}</span>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-primary-foreground group-hover:shadow-[0_0_18px_-4px_var(--color-accent,currentColor)]">
          <ArrowUpLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

export function PartnersSection() {
  const { data: partners = [] } = useQuery(partnersQuery);
  const active = partners.filter((p) => p.is_active);
  if (active.length === 0) return null;
  const slide = active.length > 2;

  return (
    <section id="partners" className="relative py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
            شركاؤنا ومنصاتنا
          </h2>
          <span className="mt-3 h-1 w-24 rounded-full bg-accent/70" />
          <p className="mt-4 max-w-2xl text-lg font-black tracking-tight text-balance text-muted-foreground sm:text-2xl">
            منصات ومشاريع نفخر بالعمل معها — اضغط للانتقال مباشرة
          </p>
        </div>

        {slide ? (
          <div className="zm-marquee-wrap no-scrollbar mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div
              className="zm-marquee gap-4 py-2"
              style={{ ["--zm-marquee-duration" as string]: `${Math.max(18, active.length * 6)}s` }}
            >
              {[...active, ...active].map((p, i) => (
                <PartnerCard key={`${p.id}-${i}`} p={p} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {active.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 6) * 70}>
                <PartnerCard p={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}