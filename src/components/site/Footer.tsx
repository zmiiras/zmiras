import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { siteSettingsQuery } from "@/lib/content";
import { waLinkTo } from "@/lib/zmiras";
import { AdminLoginModal } from "./AdminLoginModal";
import { SocialIcons } from "./SocialIcons";

export function Footer() {
  const { data: s } = useQuery(siteSettingsQuery);
  const [adminOpen, setAdminOpen] = useState(false);
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onCopyrightClick() {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 800);
    if (clicks.current >= 4) {
      clicks.current = 0;
      if (timer.current) clearTimeout(timer.current);
      setAdminOpen(true);
    }
  }

  return (
    <footer className="relative mt-10 bg-navy-deep text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-0">
              <img
                  src={s?.logo_url || "/zmiras-mark.png"}
                  alt="شعار زميراس ZMiras"
                  className="shrink-0 object-contain -translate-x-3"
                  style={{ width: s?.logo_width ? `${s.logo_width}px` : '64px', height: s?.logo_height ? `${s.logo_height}px` : '64px' }}
                  loading="lazy"
                />
              <span className="text-2xl font-black tracking-tight sm:text-3xl">ZMiras</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              {s?.footer_about ??
                "زميراس — شريكك الرقمي الموثوق لبناء حضور رقمي فاخر يليق بعلامتك التجارية في السعودية والخليج."}
            </p>
          </div>

          <div>
            <h3 className="text-base font-black">روابط سريعة</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {[
                ["الرئيسية", "#home"],
                ["خدماتنا", "#services"],
                ["أعمالي", "#works"],
                ["شركاؤنا ومنصاتنا", "#partners"],
                ["آراء العملاء", "#testimonials"],
                ["تواصل معنا", "#contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-black">{s?.footer_contact_title ?? "تواصل مباشر"}</h3>
            <p className="mt-3 text-sm text-white/70">تابعنا وتواصل معنا على منصاتنا الرسمية</p>
            <div className="mt-4">
              <SocialIcons />
            </div>
            <a
              href={waLinkTo(s?.whatsapp_number, "مرحباً زميراس")}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              تحدث معنا الآن
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <p
            onClick={onCopyrightClick}
            className="inline-block cursor-default text-sm text-white/60 select-none"
          >
            {s?.footer_copyright ?? "جميع الحقوق محفوظة © 2026 ZMiras"}
          </p>
        </div>
      </div>

      <AdminLoginModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </footer>
  );
}