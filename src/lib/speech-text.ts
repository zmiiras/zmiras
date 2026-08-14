/**
 * Normalizes financial abbreviations, currency symbols and number formats so
 * text-to-speech reads them naturally instead of spelling out strange letters
 * (e.g. "SAR" read as "س-ا-ر" or "ر.س" as "را نقطة سين").
 */

type Currency = { ar: string; en: string };

const CURRENCIES: Record<string, Currency> = {
  SAR: { ar: "ريال سعودي", en: "Saudi riyals" },
  SR: { ar: "ريال سعودي", en: "Saudi riyals" },
  AED: { ar: "درهم إماراتي", en: "UAE dirhams" },
  DHS: { ar: "درهم", en: "dirhams" },
  EGP: { ar: "جنيه مصري", en: "Egyptian pounds" },
  LE: { ar: "جنيه مصري", en: "Egyptian pounds" },
  KWD: { ar: "دينار كويتي", en: "Kuwaiti dinars" },
  BHD: { ar: "دينار بحريني", en: "Bahraini dinars" },
  QAR: { ar: "ريال قطري", en: "Qatari riyals" },
  OMR: { ar: "ريال عماني", en: "Omani riyals" },
  JOD: { ar: "دينار أردني", en: "Jordanian dinars" },
  IQD: { ar: "دينار عراقي", en: "Iraqi dinars" },
  MAD: { ar: "درهم مغربي", en: "Moroccan dirhams" },
  TND: { ar: "دينار تونسي", en: "Tunisian dinars" },
  USD: { ar: "دولار أمريكي", en: "US dollars" },
  EUR: { ar: "يورو", en: "euros" },
  GBP: { ar: "جنيه إسترليني", en: "British pounds" },
  TRY: { ar: "ليرة تركية", en: "Turkish lira" },
};

const SYMBOLS: Array<[RegExp, Currency]> = [
  [/\$/g, { ar: "دولار", en: "dollars" }],
  [/€/g, { ar: "يورو", en: "euros" }],
  [/£/g, { ar: "جنيه", en: "pounds" }],
  [/﷼|(?<![\p{L}])ر\.\s?س\.?(?![\p{L}])/gu, { ar: "ريال سعودي", en: "Saudi riyals" }],
  [/(?<![\p{L}])د\.\s?إ\.?(?![\p{L}])/gu, { ar: "درهم إماراتي", en: "UAE dirhams" }],
  [/(?<![\p{L}])ج\.\s?م\.?(?![\p{L}])/gu, { ar: "جنيه مصري", en: "Egyptian pounds" }],
  [/(?<![\p{L}])د\.\s?ك\.?(?![\p{L}])/gu, { ar: "دينار كويتي", en: "Kuwaiti dinars" }],
];

const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

/** Turns "1,500" into "1500" and "2.5k" / "2k" into full numbers. */
function expandNumbers(text: string, ar: boolean): string {
  return text
    .replace(/(\d)[,\u066C](?=\d{3}\b)/g, "$1")
    .replace(/\b(\d+(?:\.\d+)?)\s?[kK]\b/g, (_m, n: string) => String(Math.round(parseFloat(n) * 1000)))
    .replace(/\b(\d+(?:\.\d+)?)\s?[mM]\b/g, (_m, n: string) =>
      ar ? `${n} مليون` : `${n} million`,
    );
}

/** Rewrites currency codes, symbols and shorthand into spoken words. */
export function normalizeForSpeech(input: string): string {
  if (!input) return input;
  const ar = isArabic(input);
  let out = input.replace(/[*_`#>]/g, "");

  out = expandNumbers(out, ar);

  for (const [re, cur] of SYMBOLS) {
    out = out.replace(re, ` ${ar ? cur.ar : cur.en} `);
  }

  for (const [code, cur] of Object.entries(CURRENCIES)) {
    const word = ar ? cur.ar : cur.en;
    // "SAR 1500" -> "1500 <currency>"
    out = out.replace(new RegExp(`\\b${code}\\b\\s*(\\d[\\d.]*)`, "gi"), `$1 ${word}`);
    // "1500 SAR" / bare code
    out = out.replace(new RegExp(`\\b${code}\\b`, "g"), word);
  }

  out = out
    .replace(/(\d)\s*%/g, ar ? "$1 بالمئة" : "$1 percent")
    .replace(/\s{2,}/g, " ")
    .trim();

  return out;
}
