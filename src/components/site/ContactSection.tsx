import { useQuery } from "@tanstack/react-query";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { siteSettingsQuery } from "@/lib/content";
import { WHATSAPP_NUMBER, waLinkTo } from "@/lib/zmiras";
import { SocialIcons } from "./SocialIcons";

export function ContactSection() {
  const { data: s } = useQuery(siteSettingsQuery);
  const number = (s?.whatsapp_number || WHATSAPP_NUMBER).replace(/[^\d]/g, "");
  const email = s?.contact_email || "zmiras.sa@gmail.com";
  return (
    <section id="contact" className="relative py-14 sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="glass glow-ring relative overflow-hidden rounded-3xl p-6 text-center sm:p-12">
          <span className="mb-4 inline-flex items-center justify-center rounded-full bg-accent/15 border border-accent/30 px-5 py-2 text-sm sm:text-base font-black tracking-wide text-accent uppercase shadow-sm">{s?.contact_kicker ?? "تواصل معنا"}</span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
            {s?.contact_title ?? "جاهزون لتحويل فكرتك إلى واقع رقمي فاخر"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            {s?.contact_description ??
              "تواصل معنا مباشرة عبر واتساب واحصل على استشارة مجانية وعرض سعر خلال دقائق."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={waLinkTo(number, "مرحباً زميراس، أرغب باستشارة مجانية")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              <MessageCircle className="h-5 w-5" />
              محادثة واتساب
            </a>
            <a
              href={`tel:+${number}`}
              className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-bold text-primary"
            >
              <Phone className="h-5 w-5" />
              اتصال مباشر
            </a>
            <a
              href={`mailto:${email}`}
              className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-bold text-primary"
            >
              <Mail className="h-5 w-5" />
              البريد الإلكتروني
            </a>
          </div>

          <div className="mt-8 flex justify-center">
            <SocialIcons />
          </div>
        </div>
      </div>
    </section>
  );
}