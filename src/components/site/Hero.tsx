import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Crown } from "lucide-react";

import heroBg from "@/assets/hero-bg.jpg";
import { siteSettingsQuery } from "@/lib/content";
import { waLinkTo } from "@/lib/zmiras";
import { OffersTicker } from "./OffersTicker";

export function Hero() {
  const { data: s } = useQuery(siteSettingsQuery);
  
  return (
    <section id="home" className="relative overflow-hidden pt-16 pb-2 sm:pt-20 sm:pb-4">
      <img
        src={heroBg}
        alt=""
        aria-hidden
        width={1920}
        height={1080}
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] w-full object-cover opacity-20"
      />
      <div className="surface-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-2 sm:px-6 sm:pt-4">
        <div className="flex flex-col items-center text-center">
          <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:mb-8 sm:text-sm font-black tracking-wide text-primary shadow-sm border border-primary/10">
            <Crown className="h-3.5 w-3.5 text-accent" />
            {s?.hero_badge ?? "شريكك الرقمي الموثوق في السعودية والخليج"}
          </span>

          <h1 
            className={`mt-0 flex flex-col items-center font-black leading-[1.1] tracking-tighter ${s?.hero_title_size && s.hero_title_size.startsWith('text-') ? s.hero_title_size : 'text-2xl sm:text-4xl lg:text-6xl'}`}
            style={s?.hero_title_size && !s.hero_title_size.startsWith('text-') ? { fontSize: s.hero_title_size } : {}}
          >
            {s?.hero_title ? (
              s.hero_title
            ) : (
              <>
                <span>احكم مجال عملك وتصدر Google مع</span>
                <span className="text-gradient mt-2 block">ZMiras</span>
              </>
            )}
          </h1>

          <p className="mt-4 max-w-2xl text-[13px] font-bold leading-relaxed text-navy-deep/90 sm:mt-6 sm:text-lg lg:text-xl">
            {s?.hero_subtitle ??
              "مواقع، تطبيقات، دومينات، بطاقات NFC ذكية، واسترجاع نشاطك على خرائط جوجل — بجودة عالمية وتنفيذ سريع يليق باسمك."}
          </p>

          <div className="mt-5 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row">
            <a
              href={waLinkTo(s?.whatsapp_number, "مرحباً زميراس، أرغب ببدء مشروعي")}
              target="_blank"
              rel="noreferrer"
              className="glow-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              {s?.hero_cta_primary ?? "ابدأ مشروعك الآن"}
              <ArrowLeft className="h-4.5 w-4.5" />
            </a>
            <a
              href="#services"
              className="glass inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold text-primary"
            >
              {s?.hero_cta_secondary ?? "استعرض خدماتنا"}
            </a>
          </div>

          <div className="mt-6 w-full">
            <OffersTicker />
          </div>
        </div>
      </div>
    </section>
  );
}
