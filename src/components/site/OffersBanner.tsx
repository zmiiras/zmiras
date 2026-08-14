import type { CSSProperties } from "react";
import type { BannerStyle, Offer } from "@/lib/zmiras";

type BannerItem = Pick<Offer, "id" | "title" | "old_price" | "new_price"> & { href: string };

/**
 * Presentational promo banner. 
 * Improved with a more robust marquee effect and RTL support.
 */
export function OffersBanner({ items, style }: { items: BannerItem[]; style: BannerStyle }) {
  if (items.length === 0) return null;

  // Repeat items to ensure a seamless loop and immediate visibility.
  const loop = [...items, ...items, ...items, ...items];

  const background =
    style.banner_style === "solid"
      ? style.banner_bg_color
      : `linear-gradient(90deg, ${style.banner_bg_color}, ${style.banner_bg_color_2})`;

  const duration = Math.max(5, style.banner_speed || 30);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex items-stretch overflow-hidden rounded-2xl border border-white/10"
        style={{ background }}
      >
        {/* Banner Label (Stays fixed) */}
        <div
          className="relative z-20 flex shrink-0 items-center px-4 text-xs font-black sm:px-6 sm:text-sm"
          style={{ background: style.banner_btn_bg, color: style.banner_btn_text_color }}
        >
          {style.banner_label}
          {/* Slanted edge for style */}
          <div 
            className="absolute -left-3 top-0 bottom-0 w-4 skew-x-[-15deg]"
            style={{ background: style.banner_btn_bg }}
          />
        </div>

        {/* Ticker Track Container */}
        <div className="no-scrollbar relative flex-1 overflow-hidden py-3">
          {/* Fade effects for smooth transitions at edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black/10 to-transparent" />

          <div
            className="flex w-max items-center gap-4 px-4 hover:[animation-play-state:paused]"
            style={{
              animation: `zm-ticker-rtl ${duration}s linear infinite`,
              willChange: "transform",
            }}
          >
            {loop.map((offer, i) => (
              <a
                key={`${offer.id}-${i}`}
                href={offer.href}
                target="_blank"
                rel="noreferrer"
                className="flex shrink-0 items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 transition-all hover:bg-white/15 hover:scale-[1.02]"
                style={{ color: style.banner_text_color }}
              >
                <span className="whitespace-nowrap text-xs font-bold sm:text-sm">{offer.title}</span>
                {offer.old_price && (
                  <span className="whitespace-nowrap text-[10px] line-through opacity-70 sm:text-xs" style={{ color: style.banner_old_price_color }}>
                    {offer.old_price}
                  </span>
                )}
                {offer.new_price && (
                  <span
                    className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-black sm:text-xs"
                    style={{ background: style.banner_price_bg, color: style.banner_price_color }}
                  >
                    {offer.new_price}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Optimized RTL Animation Logic */}
      <style>{`
        @keyframes zm-ticker-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .w-max { width: max-content; }
      `}</style>
    </div>
  );
}
