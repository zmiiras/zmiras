import { useQuery } from "@tanstack/react-query";

import { offersQuery, siteSettingsQuery } from "@/lib/content";
import { bannerStyleOf, orderLink } from "@/lib/zmiras";
import { OffersBanner } from "./OffersBanner";

export function OffersTicker() {
  const { data: offers = [] } = useQuery(offersQuery);
  const { data: settings } = useQuery(siteSettingsQuery);
  const active = offers.filter((o) => o.is_active);
  if (active.length === 0) return null;

  const items = active.map((offer) => ({
    id: offer.id,
    title: offer.title,
    old_price: offer.old_price,
    new_price: offer.new_price,
    href:
      offer.whatsapp_url ||
      orderLink(settings?.whatsapp_number, {
        kind: "عرض",
        title: offer.title,
        price: offer.new_price,
        oldPrice: offer.old_price,
      }),
  }));

  return <OffersBanner items={items} style={bannerStyleOf(settings)} />;
}