export const WHATSAPP_NUMBER = "966500000000";

export const SOCIALS = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  instagram: "https://instagram.com/zmiras.sa",
  x: "https://x.com/zmiras_sa",
  tiktok: "https://tiktok.com/@zmiras.sa",
};

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Build a WhatsApp deep link for any number (falls back to the default one). */
export function waLinkTo(number: string | undefined | null, message: string) {
  const n = (number || WHATSAPP_NUMBER).replace(/[^\d]/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export type OrderDetails = {
  kind: "خدمة" | "عرض";
  title: string;
  price?: string | undefined;
  oldPrice?: string | undefined;
  note?: string | undefined;
  url?: string | undefined;
};

/** Pre-filled WhatsApp order message with the exact product details and prices. */
export function orderMessage(d: OrderDetails) {
  const lines = [
    `السلام عليكم زميراس 👋`,
    `أرغب في طلب ${d.kind}: ${d.title}`,
  ];
  if (d.oldPrice) lines.push(`السعر قبل الخصم: ${d.oldPrice}`);
  if (d.price) lines.push(`السعر: ${d.price}`);
  if (d.note) lines.push(d.note);
  if (d.url) lines.push(`رابط ${d.kind}: ${d.url}`);
  lines.push("ممكن أعرف التفاصيل وطريقة البدء؟");
  return lines.join("\n");
}

export function orderLink(number: string | undefined | null, d: OrderDetails) {
  return waLinkTo(number, orderMessage(d));
}

export type FaqItem = { q: string; a: string };

export type Service = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  short_description: string;
  description: string;
  icon: string;
  image_url: string | null;
  gallery: string[];
  price_label: string;
  features: string[];
  faq: FaqItem[];
  whatsapp_message: string;
  sort_order: number;
  is_active: boolean;
};

export type Offer = {
  id: string;
  title: string;
  old_price: string;
  new_price: string;
  whatsapp_url: string;
  sort_order: number;
  is_active: boolean;
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  link_url: string;
  sort_order: number;
  is_active: boolean;
};

export type Partner = {
  id: string;
  title: string;
  logo_url: string | null;
  link_url: string;
  sort_order: number;
  is_active: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  is_approved: boolean;
  sort_order: number;
  created_at: string;
};

export type AdminAccount = {
  id: string;
  user_id: string | null;
  email: string;
  label: string;
  is_primary: boolean;
  is_enabled: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  whatsapp_number: string;
  whatsapp_float_enabled: boolean;
  whatsapp_float_message: string;
  chat_enabled: boolean;
  instagram_url: string;
  x_url: string;
  tiktok_url: string;
  facebook_url: string;
  linkedin_url: string;
  youtube_url: string;
  contact_email: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_guarantee: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  services_kicker: string;
  services_title: string;
  portfolio_kicker: string;
  portfolio_title: string;
  testimonials_kicker: string;
  testimonials_title: string;
  contact_kicker: string;
  contact_title: string;
  contact_description: string;
  footer_about: string;
  footer_contact_title: string;
  footer_copyright: string;
  banner_label: string;
  banner_style: string;
  banner_bg_color: string;
  banner_bg_color_2: string;
  banner_text_color: string;
  banner_price_bg: string;
  banner_price_color: string;
  banner_old_price_color: string;
  banner_btn_bg: string;
  banner_btn_text_color: string;
  banner_animated: boolean;
  banner_speed: number;
  logo_url?: string;
  logo_width?: number;
  logo_height?: number;
  hero_title_size?: string;
};

export type BannerStyle = Pick<
  SiteSettings,
  | "banner_label"
  | "banner_style"
  | "banner_bg_color"
  | "banner_bg_color_2"
  | "banner_text_color"
  | "banner_price_bg"
  | "banner_price_color"
  | "banner_old_price_color"
  | "banner_btn_bg"
  | "banner_btn_text_color"
  | "banner_animated"
  | "banner_speed"
>;

export const DEFAULT_BANNER: BannerStyle = {
  banner_label: "عروض خاصة",
  banner_style: "gradient",
  banner_bg_color: "#0B2545",
  banner_bg_color_2: "#123B6B",
  banner_text_color: "#FFFFFF",
  banner_price_bg: "#F0B429",
  banner_price_color: "#0B2545",
  banner_old_price_color: "#C9D6E5",
  banner_btn_bg: "#F0B429",
  banner_btn_text_color: "#0B2545",
  banner_animated: true,
  banner_speed: 30,
};

/** Merge saved settings over the defaults so the banner always has a full style. */
export function bannerStyleOf(s: Partial<BannerStyle> | null | undefined): BannerStyle {
  const out = { ...DEFAULT_BANNER };
  if (!s) return out;
  for (const key of Object.keys(DEFAULT_BANNER) as (keyof BannerStyle)[]) {
    const v = s[key];
    if (v !== undefined && v !== null && v !== "") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (out as any)[key] = v;
    }
  }
  return out;
}