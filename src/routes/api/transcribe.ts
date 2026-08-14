import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 20 * 1024 * 1024;

const EXT: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "AI غير مهيأ" }, { status: 500 });

        let audio: File | null = null;
        let language: string | null = null;
        try {
          const form = await request.formData();
          const value = form.get("audio");
          if (value instanceof File) audio = value;
          const lang = form.get("language");
          if (typeof lang === "string" && /^(ar|en)$/.test(lang)) language = lang;
        } catch {
          audio = null;
        }

        if (!audio || audio.size < 1024) {
          return Response.json({ error: "التسجيل فاضي، جرب تاني 🎙️" }, { status: 400 });
        }
        if (audio.size > MAX_BYTES) {
          return Response.json({ error: "التسجيل طويل جداً" }, { status: 413 });
        }

        const mime = (audio.type || "audio/webm").split(";")[0] ?? "audio/webm";
        const ext = EXT[mime] ?? "webm";

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", audio, `recording.${ext}`);
        // Omitted when "auto" so the model detects the language itself.
        if (language) upstream.append("language", language);

        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}` },
          body: upstream,
        });

        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error(`Transcription failed [${res.status}]: ${detail}`);
          return Response.json({ error: "تعذر تحويل الصوت لنص" }, { status: res.status });
        }

        const data = (await res.json()) as { text?: string };
        return Response.json({ text: (data.text ?? "").trim() });
      },
    },
  },
});