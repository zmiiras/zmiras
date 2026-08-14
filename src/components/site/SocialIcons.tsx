import { useQuery } from "@tanstack/react-query";

import { siteSettingsQuery } from "@/lib/content";
import { SOCIALS } from "@/lib/zmiras";

const items = [
  {
    key: "whatsapp",
    label: "واتساب",
    bg: "linear-gradient(140deg,#25D366,#128C7E)",
    path: "M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91a9.85 9.85 0 0 0-2.9-7.02Zm-7.01 15.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z",
  },
  {
    key: "instagram",
    label: "انستقرام",
    bg: "linear-gradient(140deg,#FEDA75,#FA7E1E 35%,#D62976 65%,#962FBF)",
    path: "M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38Zm6.99-11.4a1.58 1.58 0 1 1-1.58-1.58 1.58 1.58 0 0 1 1.58 1.58Z",
  },
  {
    key: "x",
    label: "إكس",
    bg: "linear-gradient(140deg,#2b2b2b,#000000)",
    path: "M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.63-6.06L5.9 21H2.88l7.06-8.07L2.5 3h6.05l4.18 5.53L17.53 3Zm-1.06 16.18h1.67L7.6 4.73H5.81l10.66 14.45Z",
  },
  {
    key: "tiktok",
    label: "تيك توك",
    bg: "linear-gradient(140deg,#25F4EE,#000000 55%,#FE2C55)",
    path: "M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-3.1v12.2a2.53 2.53 0 1 1-1.8-2.42v-3.16a5.66 5.66 0 1 0 4.9 5.6V9.4a7.3 7.3 0 0 0 4.25 1.36V7.66a4.28 4.28 0 0 1-3.2-1.84Z",
  },
  {
    key: "facebook",
    label: "فيسبوك",
    bg: "linear-gradient(140deg,#1877F2,#0B4FA8)",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z",
  },
  {
    key: "linkedin",
    label: "لينكدإن",
    bg: "linear-gradient(140deg,#0A66C2,#004182)",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z",
  },
  {
    key: "youtube",
    label: "يوتيوب",
    bg: "linear-gradient(140deg,#FF4E45,#CC0000)",
    path: "M23.5 6.9a3.02 3.02 0 0 0-2.12-2.14C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.9C0 8.79 0 12 0 12s0 3.21.5 5.1a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.21 24 12 24 12s0-3.21-.5-5.1ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z",
  },
];

export function SocialIcons({ size = "md" }: { size?: "md" | "lg" }) {
  const { data: settings } = useQuery(siteSettingsQuery);
  const dim = size === "lg" ? "h-14 w-14" : "h-12 w-12";

  const hrefs: Record<string, string> = {
    whatsapp: settings?.whatsapp_number
      ? `https://wa.me/${settings.whatsapp_number.replace(/[^\d]/g, "")}`
      : SOCIALS.whatsapp,
    instagram: settings?.instagram_url ?? SOCIALS.instagram,
    x: settings?.x_url ?? SOCIALS.x,
    tiktok: settings?.tiktok_url ?? SOCIALS.tiktok,
    facebook: settings?.facebook_url ?? "",
    linkedin: settings?.linkedin_url ?? "",
    youtube: settings?.youtube_url ?? "",
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items
        .map((item) => ({ ...item, href: hrefs[item.key] ?? "" }))
        .filter((item) => item.href.trim().length > 0)
        .map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className={`${dim} grid shrink-0 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:scale-105`}
          style={{ backgroundImage: item.bg }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
            <path d={item.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}