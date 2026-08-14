import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { servicesQuery, siteSettingsQuery } from "@/lib/content";
import { Reveal } from "@/components/site/Reveal";
import { resolveIcon } from "@/components/site/DynamicIcon";

export function ServicesSection() {
  const { data: services = [] } = useQuery(servicesQuery);
  const { data: settings } = useQuery(siteSettingsQuery);
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    // For RTL layouts, scrollLeft is typically negative or decreases when moving "left" (visually right)
    // We multiply by -1 to align the visual direction with the buttons in RTL
    const scrollAmount = dir * Math.min(340, el.clientWidth * 0.85) * -1;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const active = services.filter((s) => s.is_active);

  return (
    <section id="services" className="relative py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
            {settings?.services_kicker ?? "خدماتنا"}
          </h2>
          <span className="mt-3 h-1 w-24 rounded-full bg-accent/70" />
          <p className="mt-4 max-w-2xl text-lg font-black tracking-tight text-balance text-muted-foreground sm:text-2xl">
            {settings?.services_title ?? "حلول رقمية متكاملة تحت سقف واحد"}
          </p>
        </div>

        <div className="relative mt-6 sm:mt-8">
          <button
            type="button"
            aria-label="السابق"
            onClick={() => scrollBy(-1)}
            className="glass absolute top-1/2 right-0 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full text-primary shadow-lg transition-transform hover:scale-105 lg:grid"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="التالي"
            onClick={() => scrollBy(1)}
            className="glass absolute top-1/2 left-0 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-primary shadow-lg transition-transform hover:scale-105 lg:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            ref={scroller}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
          >
          {active.map((service, i) => {
            const Icon = resolveIcon(service.icon);
            return (
              <Reveal
                key={service.id}
                delay={Math.min(i, 4) * 90}
                className="flex w-[80vw] max-w-[320px] shrink-0 snap-start sm:w-[320px]"
              >
              <article
                className="glass hover:glow-ring group flex w-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.99]"
              >
                <div className="relative h-44 w-full overflow-hidden bg-primary/5">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/10 to-accent/10">
                      <Icon className="h-14 w-14 text-primary/60" />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-2xl bg-primary/90 text-primary-foreground shadow-lg backdrop-blur">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-black">{service.title}</h3>
                  <p className="mt-1 text-sm font-bold text-accent">{service.subtitle}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.short_description}
                  </p>
                  <Link
                    to="/services/$slug"
                    params={{ slug: service.slug }}
                    className="mt-4 block rounded-full bg-primary px-4 py-2.5 text-center text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </article>
              </Reveal>
            );
          })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 lg:hidden">
            <button
              type="button"
              aria-label="السابق"
              onClick={() => scrollBy(-1)}
              className="glass grid h-11 w-11 place-items-center rounded-full text-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="التالي"
              onClick={() => scrollBy(1)}
              className="glass grid h-11 w-11 place-items-center rounded-full text-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}