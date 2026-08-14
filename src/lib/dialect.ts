/**
 * Multi-dialect voice engine helpers for Hamza.
 * Pure + client-safe: shared by the chat widget and the /api/tts route.
 */

export type DialectKey = "egyptian" | "khaleeji" | "levantine" | "yemeni" | "maghrebi" | "msa" | "english";

export type VoiceProfile = {
  key: DialectKey;
  label: string;
  /** Gemini prebuilt voice that best carries this region's timbre. */
  voiceName: string;
  /** Fallback OpenAI voice. */
  openaiVoice: string; elevenLabsVoice: string;
  /** BCP-47 tag for browser speech recognition + fallback synthesis. */
  sttLang: string;
  /** Natural-language steering handed to the TTS model. */
  direction: string;
};

const AR_STYLE =
  "ط§ظ‚ط±ط£ ط§ظ„ظ†طµ ظƒط£ظ†ظƒ ط¥ظ†ط³ط§ظ† ط­ظ‚ظٹظ‚ظٹ ط¨ظٹطھظƒظ„ظ… ط¹ظ„ظ‰ ط·ط¨ظٹط¹طھظ‡: ظ†ط¨ط±ط© ط¯ط§ظپط¦ط© ظˆظˆط§ط«ظ‚ط©طŒ ط¥ظٹظ‚ط§ط¹ ظ…طھطµظ„ ظˆط³ظ„ط³طŒ ظˆظ‚ظپط§طھ ط·ط¨ظٹط¹ظٹط© ط¹ظ†ط¯ ط§ظ„ظپظˆط§طµظ„طŒ ظ…ظ† ط؛ظٹط± طھظ‚ط·ظٹط¹ ظˆظ„ط§ طھظ‡ط¬ط¦ط© ط­ط±ظˆظپ ظˆظ„ط§ ظ†ط¨ط±ط© ط¢ظ„ظٹط©.";

export const VOICE_PROFILES: Record<DialectKey, VoiceProfile> = {
  egyptian: {
    key: "egyptian",
    label: "ظ…طµط±ظٹ",
    voiceName: "Puck",
    openaiVoice: "shimmer", elevenLabsVoice: "pNInz6obpgnuMvtmZiXy",
    sttLang: "ar-EG",
    direction: `طھظƒظ„ظ… ط¨ط§ظ„ظ„ظ‡ط¬ط© ط§ظ„ظ…طµط±ظٹط© ط§ظ„ط¹ط§ظ…ظٹط© ظƒط´ط§ط¨ ظ…طµط±ظٹ ظˆط¯ظˆط¯ ظ…ظ† ط§ظ„ظ‚ط§ظ‡ط±ط©. ${AR_STYLE}`,
  },
  khaleeji: {
    key: "khaleeji",
    label: "ط³ط¹ظˆط¯ظٹ/ط®ظ„ظٹط¬ظٹ",
    voiceName: "Orus",
    openaiVoice: "onyx", elevenLabsVoice: "pNInz6obpgnuMvtmZiXy",
    sttLang: "ar-SA",
    direction: `طھظƒظ„ظ… ط¨ط§ظ„ظ„ظ‡ط¬ط© ط§ظ„ط³ط¹ظˆط¯ظٹط© ط§ظ„ط®ظ„ظٹط¬ظٹط© ط¨ظ†ط¨ط±ط© ظ†ط¬ط¯ظٹط© ظ…ظ‡ط°ط¨ط© ظˆظˆط§ط«ظ‚ط©. ${AR_STYLE}`,
  },
  levantine: {
    key: "levantine",
    label: "ط´ط§ظ…ظٹ",
    voiceName: "Charon",
    openaiVoice: "echo", elevenLabsVoice: "pNInz6obpgnuMvtmZiXy",
    sttLang: "ar-SY",
    direction: `طھظƒظ„ظ… ط¨ط§ظ„ظ„ظ‡ط¬ط© ط§ظ„ط´ط§ظ…ظٹط© (ط³ظˆط±ظٹط©/ظ„ط¨ظ†ط§ظ†ظٹط©) ط¨ظ†ط¨ط±ط© ظ†ط§ط¹ظ…ط© ظˆظ„ط·ظٹظپط© ظˆط¥ظٹظ‚ط§ط¹ ط؛ظ†ط§ط¦ظٹ ط®ظپظٹظپ. ${AR_STYLE}`,
  },
  yemeni: {
    key: "yemeni",
    label: "ظٹظ…ظ†ظٹ",
    voiceName: "Fenrir",
    openaiVoice: "onyx", elevenLabsVoice: "pNInz6obpgnuMvtmZiXy",
    sttLang: "ar-YE",
    direction: `طھظƒظ„ظ… ط¨ط§ظ„ظ„ظ‡ط¬ط© ط§ظ„ظٹظ…ظ†ظٹط© ط¨ظ†ط¨ط±ط© ظ‡ط§ط¯ط¦ط© ط±ط²ظٹظ†ط© ظˆط¥ظٹظ‚ط§ط¹ ظ…طھط£ظ†ظچ. ${AR_STYLE}`,
  },
  maghrebi: {
    key: "maghrebi",
    label: "ظ…ط؛ط§ط±ط¨ظٹ",
    voiceName: "Zephyr",
    openaiVoice: "nova", elevenLabsVoice: "EXAVITQu4vr4xnSDxMaL",
    sttLang: "ar-MA",
    direction: `طھظƒظ„ظ… ط¨ط§ظ„ط¯ط§ط±ط¬ط© ط§ظ„ظ…ط؛ط§ط±ط¨ظٹط© (ظ…ط؛ط±ط¨ظٹط©/ط¬ط²ط§ط¦ط±ظٹط©/طھظˆظ†ط³ظٹط©) ط¨ظ†ط¨ط±ط© ط­ظٹظˆظٹط© ظˆط¯ظˆط¯ط©. ${AR_STYLE}`,
  },
  msa: {
    key: "msa",
    label: "ظپطµط­ظ‰",
    voiceName: "Kore",
    openaiVoice: "shimmer", elevenLabsVoice: "pNInz6obpgnuMvtmZiXy",
    sttLang: "ar",
    direction: `طھظƒظ„ظ… ط¨ط§ظ„ط¹ط±ط¨ظٹط© ط§ظ„ظپطµط­ظ‰ ط§ظ„ظ…ط¨ط³ظ‘ط·ط© ط¨ظ†ط¨ط±ط© ط±ط§ظ‚ظٹط© ظˆظˆط§ط¶ط­ط©. ${AR_STYLE}`,
  },
  english: {
    key: "english",
    label: "English",
    voiceName: "Aoede",
    openaiVoice: "shimmer", elevenLabsVoice: "pNInz6obpgnuMvtmZiXy",
    sttLang: "en-US",
    direction:
      "Read this in natural, fluent English with a warm, friendly, human tone, smooth pacing and no robotic artifacts.",
  },
};

export const DEFAULT_DIALECT: DialectKey = "egyptian";

export function getVoiceProfile(key: string | undefined | null): VoiceProfile {
  const profile = key ? VOICE_PROFILES[key as DialectKey] : undefined;
  return profile ?? VOICE_PROFILES[DEFAULT_DIALECT];
}

/** Explicit user requests: "ظƒظ„ظ…ظ†ظٹ ط³ط¹ظˆط¯ظٹ", "ط±ط¯ ط¹ظ„ظٹط§ ط¨ط§ظ„ظ…طµط±ظٹ", "speak to me in Moroccan". */
const EXPLICIT: Array<[RegExp, DialectKey]> = [
  [/(ظ…طµط±ظٹ|ظ…طµط±ظٹظ‡|ظ…طµط±ظٹط©|ط¨ط§ظ„ظ…طµط±ظٹ|egyptian)/i, "egyptian"],
  [/(ط³ط¹ظˆط¯ظٹ|ط³ط¹ظˆط¯ظٹظ‡|ط³ط¹ظˆط¯ظٹط©|ط®ظ„ظٹط¬ظٹ|ط®ظ„ظٹط¬ظٹظ‡|ظ†ط¬ط¯ظٹ|ظƒظˆظٹطھظٹ|ط¥ظ…ط§ط±ط§طھظٹ|ط§ظ…ط§ط±ط§طھظٹ|ظ‚ط·ط±ظٹ|ط¨ط­ط±ظٹظ†ظٹ|saudi|khaleeji|gulf)/i, "khaleeji"],
  [/(ط´ط§ظ…ظٹ|ط´ط§ظ…ظٹظ‡|ط´ط§ظ…ظٹط©|ط³ظˆط±ظٹ|ط³ظˆط±ظٹظ‡|ط³ظˆط±ظٹط©|ظ„ط¨ظ†ط§ظ†ظٹ|ظ„ط¨ظ†ط§ظ†ظٹظ‡|ظپظ„ط³ط·ظٹظ†ظٹ|ط£ط±ط¯ظ†ظٹ|ط§ط±ط¯ظ†ظٹ|levantine|syrian|lebanese)/i, "levantine"],
  [/(ظٹظ…ظ†ظٹ|ظٹظ…ظ†ظٹظ‡|ظٹظ…ظ†ظٹط©|طµظ†ط¹ط§ظ†ظٹ|yemeni)/i, "yemeni"],
  [/(ظ…ط؛ط±ط¨ظٹ|ظ…ط؛ط±ط¨ظٹظ‡|ظ…ط؛ط±ط¨ظٹط©|ظ…ط؛ط§ط±ط¨ظٹ|ط¯ط§ط±ط¬ط©|ط¯ط§ط±ط¬ظ‡|ط¬ط²ط§ط¦ط±ظٹ|طھظˆظ†ط³ظٹ|moroccan|maghrebi|algerian|tunisian)/i, "maghrebi"],
  [/(ظپطµط­ظ‰|ظپطµط­ظٹ|ط§ظ„ظپطµط­ظ‰|standard arabic|msa)/i, "msa"],
  [/(ط¥ظ†ط¬ظ„ظٹط²ظٹ|ط§ظ†ط¬ظ„ظٹط²ظٹ|ط¥ظ†ظ‚ظ„ظٹط²ظٹ|ط¨ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹ|english)/i, "english"],
];

const REQUEST_HINT =
  /(ظƒظ„ظ…ظ†ظٹ|ط§طھظƒظ„ظ…|طھظƒظ„ظ…|ط§ط­ظƒظٹ|ط§ط­ظƒظٹظ„ظٹ|ط±ط¯\s*(ط¹ظ„ظٹ|ط¹ظ„ظٹط§|ط¹ظ„ظٹظ‘)|ط¬ط§ظˆط¨ظ†ظٹ|ط¨ط§ظ„ظ„ظ‡?ط¬ط©|ط¨ط§ظ„ظ„ظ‡ط¬ظ‡|ظ„ظ‡ط¬ط©|ظ„ظ‡ط¬ظ‡|speak|talk|reply|answer)/i;

/** Lexical fingerprints for implicit dialect detection. */
const MARKERS: Array<[RegExp, DialectKey]> = [
  [/(ط¨ط²ط§ظپ|ظˆط§ط®ط§|ط¯ط§ط¨ط§|ط¨ط´ط­ط§ظ„|ظƒظٹظپط§ط´|ظ…ط²ظٹط§ظ†|ط´ظ†ظˆ|ط±ط§ظ‡|ط­ظٹطھ|ظ†طھط§|ط¯ظٹط§ظ„ظٹ|ط¹ظ„ط§ط´)/, "maghrebi"],
  [/(ظƒظٹظپظƒ|ط´ظ„ظˆظ†ظƒ\s*ط­ط¨ظٹط¨ظٹ|ظ‡ظ„ظ‚|ظ…ظ†ظٹط­|ظƒطھظٹط±|ط´ظˆ\s|ط´ظˆ$|ط¨ط¯ظٹ|ظ‡ظٹظƒ|ظ„ظ‡ظٹظƒ|طھظƒط±ظ…\s*ط¹ظٹظ†ظƒ|ظٹط¹ط·ظٹظƒ\s*ط§ظ„ط¹ط§ظپظٹط©)/, "levantine"],
  [/(ظˆط´\s|ظˆط´$|ظˆط´ظ„ظˆظ†|ط´ظ„ظˆظ†|ط£ط¨ط´ط±|ط§ط¨ط´ط±|ظٹط§\s*ظ‡ظ„ط§|ط²ظٹظ†|ظƒط°ط§|ظˆط¯ظٹ|طھط±ط§ظ†ظٹ|طھط±ظ‰|ط¹ط³ط§ظƒ|ظٹط¹ط·ظٹظƒ\s*ط§ظ„ط¹ط§ظپظٹظ‡)/, "khaleeji"],
  [/(ظƒظٹظپ\s*ط­ط§ظ„ط´|ظ…ط¹ظƒ\s*ظƒط°ط§|ظ‚ط¯ظƒ|ط´ظˆظپ\s*ظٹط§\s*ط¨ط¹ط¯|ط­ظ‚ظٹ|ط¹ط§ط¯ظƒ|ط¨ط´ط±ط§ظƒ)/, "yemeni"],
  [/(ط§ط²ظٹظƒ|ط¥ط²ظٹظƒ|ط¹ط§ظ…ظ„\s*ط§ظٹظ‡|ط¥ظٹظ‡\s|ط§ظٹظ‡\s|ط¯ظ„ظˆظ‚طھظٹ|ظƒط¯ظ‡|ط¹ظ„ط´ط§ظ†|ط¹ط´ط§ظ†\s*ظƒط¯ظ‡|ظ…ط´|ط¨طھط§ط¹|ظٹط§\s*ط¨ط§ط´ط§|ظٹط§\s*ظپظ†ط¯ظ…|ط®ظ„ط§طµ)/, "egyptian"],
];

/**
 * Detects the dialect Hamza should speak in.
 * An explicit request wins; otherwise lexical markers; otherwise the previous
 * (sticky) dialect so the voice never flickers mid-conversation.
 */
export function detectDialect(text: string, previous: DialectKey = DEFAULT_DIALECT): DialectKey {
  const t = (text ?? "").trim();
  if (!t) return previous;

  if (REQUEST_HINT.test(t)) {
    for (const [re, key] of EXPLICIT) if (re.test(t)) return key;
  }

  const arabicChars = (t.match(/[\u0600-\u06FF]/g) ?? []).length;
  const latinChars = (t.match(/[A-Za-z]/g) ?? []).length;
  if (latinChars > arabicChars * 2 && latinChars > 4) return "english";
  if (arabicChars === 0) return previous;

  for (const [re, key] of MARKERS) if (re.test(t)) return key;
  return previous;
}

