import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Footer } from "@/components/site/Footer";
import { HamzaChat } from "@/components/site/HamzaChat";
import { Header } from "@/components/site/Header";
import { servicesQuery, siteSettingsQuery } from "@/lib/content";
import { orderLink } from "@/lib/zmiras";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const title = `خدمة ${params.slug} | ZMiras زميراس`;
    const description = "تفاصيل الخدمة، المميزات، الأسئلة الشائعة وطلب الخدمة مباشرة من زميراس.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const { data: services = [], isLoading } = useQuery(servicesQuery);
  const { data: settings } = useQuery(siteSettingsQuery);
  const service = services.find((s) => s.slug === slug);
  const orderHref = service
    ? orderLink(settings?.whatsapp_number, {
        kind: "خدمة",
        title: service.title,
        price: service.price_label,
        note: service.whatsapp_message || undefined,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      })
    : "#";

  return (
    <div className="surface-grid min-h-screen overflow-x-hidden">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-accent">
          <ArrowRight className="h-4 w-4" /> العودة للرئيسية
        </Link>

        {!service ? (
          <p className="mt-10 text-center text-muted-foreground">
            {isLoading ? "جاري التحميل..." : "لم يتم العثور على هذه الخدمة."}
          </p>
        ) : (
          <>
            <header className="glass glow-ring mt-5 rounded-3xl p-6 sm:p-10">
              <p className="text-sm font-bold text-accent">{service.subtitle}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                {service.title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-lg">
                {service.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="text-xl font-black text-primary">{service.price_label}</span>
                <a
                  href={orderHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-bold text-primary-foreground"
                >
                  <MessageCircle className="h-5 w-5" />
                  اطلب الآن
                </a>
              </div>
            </header>

            {service.features.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-black sm:text-2xl">ماذا تشمل الخدمة؟</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="glass flex items-start gap-3 rounded-2xl p-4">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span className="text-sm font-bold">{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(service.image_url || service.gallery.length > 0) && (
              <section className="mt-8 grid gap-4 sm:grid-cols-2">
                {[service.image_url, ...service.gallery].filter(Boolean).map((src) => (
                  <img
                    key={src as string}
                    src={src as string}
                    alt={service.title}
                    loading="lazy"
                    className="w-full rounded-3xl border border-border object-cover"
                  />
                ))}
              </section>
            )}

            {service.faq.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-black sm:text-2xl">الأسئلة الشائعة</h2>
                <Accordion type="single" collapsible className="glass mt-4 rounded-3xl px-4">
                  {service.faq.map((item, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-right text-sm font-bold">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            <div className="glass glow-ring mt-10 rounded-3xl p-6 text-center">
              <h2 className="text-xl font-black">جاهز للبدء؟</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                أرسل لنا تفاصيل مشروعك وسنعود إليك بعرض مخصص خلال دقائق.
              </p>
              <a
                href={orderHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-bold text-primary-foreground"
              >
                <MessageCircle className="h-5 w-5" /> اطلب الآن عبر واتساب
              </a>
            </div>
          </>
        )}
      </main>
      <Footer />
      <HamzaChat />
    </div>
  );
}