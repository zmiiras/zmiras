import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { waLinkTo } from "@/lib/zmiras";
import { siteSettingsQuery } from "@/lib/content";

const NAV = [
  { label: "الرئيسية", hash: "#home" },
  { label: "خدماتنا", hash: "#services" },
  { label: "أعمالي", hash: "#works" },
  { label: "شركاؤنا ومنصاتنا", hash: "#partners" },
  { label: "آراء العملاء", hash: "#testimonials" },
  { label: "تواصل معنا", hash: "#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: settings } = useQuery(siteSettingsQuery);
  const waHref = waLinkTo(settings?.whatsapp_number, "مرحباً زميراس، أود الاستفسار عن خدماتكم");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-2 sm:py-3"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6">
        <div
          className={`glass flex items-center justify-between gap-3 rounded-2xl px-3 py-1.5 transition-all sm:px-4 sm:py-2 ${
            scrolled ? "glow-ring" : ""
          }`}
        >
          <Link to="/" className="flex shrink-0 items-center gap-0">
            <img
                src={settings?.logo_url || "/zmiras-mark.png"}
                alt="شعار زميراس ZMiras"
                className="shrink-0 object-contain -translate-x-3"
                style={{ width: settings?.logo_width ? `${settings.logo_width}px` : '64px', height: settings?.logo_height ? `${settings.logo_height}px` : '64px' }}
                loading="eager"
              />
            <span className="text-2xl font-black tracking-tight sm:text-3xl text-gradient">ZMiras</span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.hash}
                href={onHome ? item.hash : `/${item.hash}`}
                className="rounded-full px-4 py-2 text-sm font-bold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] sm:inline-flex"
            >
              اطلب الآن
            </a>
            <button
              type="button"
              aria-label="القائمة"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!open}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`glass mt-2 rounded-2xl p-2 transition-transform duration-300 ease-out ${
                open ? "translate-y-0" : "-translate-y-2"
              }`}
            >
            <nav className="flex flex-col">
              {NAV.map((item, i) => (
                <a
                  key={item.hash}
                  href={onHome ? item.hash : `/${item.hash}`}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  style={{ transitionDelay: open ? `${60 + i * 35}ms` : "0ms" }}
                  className={`rounded-xl px-4 py-3 text-base font-bold text-foreground/90 transition-all duration-300 active:bg-accent/10 ${
                    open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                className="mt-1 rounded-xl bg-primary px-4 py-3 text-center text-base font-bold text-primary-foreground"
              >
                اطلب الآن عبر واتساب
              </a>
            </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}