import { createFileRoute } from "@tanstack/react-router";
import { getVoiceProfile } from "@/lib/dialect";


const MAX_CHARS = 2000;
// Default Voice ID for ElevenLabs (Adam)
const DEFAULT_VOICE_ID = "pNInz6obpgnuMvtmZiXy"; 

function prepareForSpeech(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, " ")
    .replace(/[^\u0600-\u06FF\s0-9a-zA-Z،؛؟?.!,]/g, " ")
    .replace(/\s*\n+\s*/g, "، ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { text?: string; voiceId?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid Request" }, { status: 400 });
        }

        const text = prepareForSpeech(body.text ?? "");
        if (!text) return Response.json({ error: "No Text" }, { status: 400 });

        const apiKey = process.env["ELEVENLABS_API_KEY"]; 
        if (!apiKey) return Response.json({ error: "ElevenLabs API Key Missing" }, { status: 500 });

        const profile = getVoiceProfile(body.dialect);
        const voiceId = body.voiceId || profile.elevenLabsVoice || DEFAULT_VOICE_ID;

        try {
          const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.8,
              },
            }),
          });

          if (!response.ok) {
            const err = await response.text();
            console.error("ElevenLabs Error:", err);
            return Response.json({ error: "TTS Failed" }, { status: response.status });
          }

          const audioBuffer = await response.arrayBuffer();
          return new Response(audioBuffer, {
            headers: { "Content-Type": "audio/mpeg" },
          });
        } catch (e) {
          console.error("TTS Connection Error:", e);
          return Response.json({ error: "Connection Error" }, { status: 500 });
        }
      },
    },
  },
});

