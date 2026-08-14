import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { siteSettingsQuery } from "@/lib/content";

export function StatsSection() {
  const { data: s } = useQuery(siteSettingsQuery);
  const stats = [
    { k: s?.stat1_value ?? "+120", v: s?.stat1_label ?? "مشروع منجز" },
    { k: s?.stat2_value ?? "+8", v: s?.stat2_label ?? "سنوات خبرة" },
    { k: s?.stat3_value ?? "98%", v: s?.stat3_label ?? "رضا العملاء" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 pt-10 pb-8 sm:px-6 sm:pt-16 sm:pb-12">
      <div className="flex flex-col items-center text-center">
        <div className="grid w-full grid-cols-3 gap-2 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.v} className="glass rounded-xl px-2 py-2.5 transition-transform duration-300 hover:-translate-y-1 sm:px-4 sm:py-4">
              <div className="text-base font-black text-primary sm:text-2xl">{stat.k}</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">{stat.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-[10px] text-muted-foreground sm:text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          {s?.hero_guarantee ?? "ضمان الجودة والدعم الفني المستمر"}
        </div>
      </div>
    </div>
  );
}
