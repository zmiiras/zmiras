import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { siteSettingsQuery, testimonialsQuery } from "@/lib/content";
import type { Testimonial } from "@/lib/zmiras";

function TestimonialCard({ t, className = "" }: { t: Testimonial; className?: string }) {
  return (
    <figure
      className={`glass hover:glow-ring flex flex-col rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="flex gap-1">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
        ))}
      </div>
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
        {t.content}
      </blockquote>
      <figcaption className="mt-4 border-t border-border pt-3">
        <div className="text-sm font-black">{t.name}</div>
        <div className="text-xs text-muted-foreground">{t.role}</div>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  const { data: items = [] } = useQuery(testimonialsQuery);
  const { data: settings } = useQuery(siteSettingsQuery);
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: 5 });

  const submit = useMutation({
    mutationFn: async () => {
      const { submitTestimonial } = await import("@/lib/public.functions");
      const result = await submitTestimonial({
        data: {
          name: form.name,
          role: form.role,
          content: form.content,
          rating: form.rating,
        }
      });
      if (!result.ok) throw new Error(result.message);
    },
    onSuccess: () => {
      toast.success("شكراً لك! سيظهر رأيك بعد المراجعة.");
      setForm({ name: "", role: "", content: "", rating: 5 });
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (e: Error) => toast.error(e.message || "تعذر إرسال التقييم"),
  });

  return (
    <section id="testimonials" className="relative py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="mb-4 inline-flex items-center justify-center rounded-full bg-accent/15 border border-accent/30 px-5 py-2 text-sm sm:text-base font-black tracking-wide text-accent uppercase shadow-sm">
            {settings?.testimonials_kicker ?? "آراء العملاء"}
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
            {settings?.testimonials_title ?? "ثقة تُبنى بالنتائج"}
          </h2>
        </div>

        {/* Mobile: continuous sliding carousel */}
        {items.length > 0 && (
          <div className="zm-marquee-wrap no-scrollbar mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] sm:hidden">
            <div
              className="zm-marquee gap-4 py-1"
              style={{ ["--zm-marquee-duration" as string]: `${Math.max(24, items.length * 9)}s` }}
            >
              {[...items, ...items].map((t, i) => (
                <TestimonialCard key={`${t.id}-${i}`} t={t} className="w-[72vw] max-w-xs shrink-0" />
              ))}
            </div>
          </div>
        )}

        {/* Desktop / tablet grid */}
        <div className="mt-8 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim() || !form.content.trim()) return;
            submit.mutate();
          }}
          className="glass mx-auto mt-10 max-w-2xl rounded-3xl p-5 sm:p-6"
        >
          <h3 className="text-lg font-black">شاركنا رأيك</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="الاسم"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="الصفة / النشاط"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="رأيك في تجربتك مع زميراس"
            rows={3}
            className="mt-3 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`تقييم ${n}`}
                  onClick={() => setForm({ ...form, rating: n })}
                >
                  <Star
                    className={`h-6 w-6 ${n <= form.rating ? "fill-accent text-accent" : "text-border"}`}
                  />
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={submit.isPending}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              إرسال التقييم
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}