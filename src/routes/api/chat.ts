import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_CHARS = 4000;
const TIMEOUT_MS = 25000;

/** Pull the current admin-managed content so Hamza always answers from live data. */
async function fetchLiveContext(): Promise<string> {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_ANON_KEY"] || process.env["VITE_SUPABASE_ANON_KEY"];
  if (!url || !key) return "";

  const get = async (path: string) => {
    try {
      const res = await fetch(`${url}/rest/v1/${path}`, {
        cache: "no-store",
        headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" },
      });
      if (!res.ok) return [];
      return (await res.json()) as Record<string, unknown>[];
    } catch { return []; }
  };

  const [services, offers, settings] = await Promise.all([
    get("services?select=title,short_description,price_label&is_active=eq.true&order=sort_order"),
    get("offers?select=title,new_price&is_active=eq.true&order=sort_order"),
    get("site_settings?select=whatsapp_number,contact_email&limit=1"),
  ]);

  const s = settings[0] ?? {};
  const lines: string[] = ["بيانات المنصة الحيّة الآن:"];
  services.forEach((x: any) => lines.push(`- ${x.title}: ${x.short_description} (${x.price_label})`));
  offers.forEach((x: any) => lines.push(`- عرض: ${x.title} بسعر ${x.new_price}`));
  if (s.whatsapp_number) lines.push(`واتساب: ${s.whatsapp_number}`);
  return lines.join("\n");
}

const SYSTEM_PROMPT = `أنت "حَمْزَة"، الموظف المخلص والخبير لمنصة "زميراس" (ZMiras). أنت لست مجرد مساعد ذكي، بل موظف حقيقي يمثل الشركة بكل أمانة واحترافية.

هويتك وقدراتك:
1. شاب مصري مسلم، "ابن بلد" مخلص من "برج البرلس"، ملتزم بأخلاق المسلمين وحافظ للقرآن الكريم.
2. خبير ديني: أنت ملهم وملم تماماً بأمور الدين الإسلامي، حافظ للقرآن الكريم والأحاديث النبوية، وقادر على الإجابة على أي سؤال ديني بدقة تامة وبأدب وأخلاق الإسلام.
3. موظف زميراس: أنت خبير حصري في خدمات زميراس (تصميم المواقع، تطبيقات الجوال، بطاقات NFC، استرجاع نشاط خرائط جوجل).

قواعدك الصارمة (لتوفير الرصيد ومنع الهبد):
- التخصص المزدوج: تتحدث فقط في (خدمات زميراس الرقمية) و (أمور الدين الإسلامي).
- الاعتذار اللبق: لو المستخدم سألك عن أي حاجة تانية (سياسة، رياضة، فن، مشاهير، أو أسئلة عامة مالهاش علاقة بالدين أو الشركة)، اعتذر منه بلباقة وبلهجة مصرية ودودة جداً. قول مثلاً: "يا غالي، أنا تخصصي هنا في زميراس وفي أمور دينا بس، مقدرش أفتي لك في حاجة تانية عشان مضيعش وقتك".
- الهوية والنطق: بتتكلم مصري "أصيل" (عامية نطقية زي: علشان، إحنا، دي، هنعمل، هنضبطك) عشان الصوت يطلع بشكل بشري حقيقي (في حال تم استدعاؤه).
- الانتماء: أنت ابن المهندس حمادة أيوب وعباقرة زميراس.

مهمتك: تكون الواجهة المشرفة لزميراس، تجيب على أسئلة الدين والعمل بكل دقة، وتوفر التوكنز برفض المواضيع الخارجة عن تخصصك.`;

async function callOpenAI(apiKey: string, messages: ChatMessage[], signal: AbortSignal, liveContext = "") {
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    signal,
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\n${liveContext}` },
        ...messages
      ],
      temperature: 0.85,
    }),
  });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { messages?: ChatMessage[] };
        try {
          body = (await request.json()) as { messages?: ChatMessage[] };
        } catch {
          return Response.json({ error: "Invalid Request" }, { status: 400 });
        }

        const messages = (body.messages ?? [])
          .filter((m): m is ChatMessage => !!m && typeof m.content === "string")
          .slice(-10)
          .map((m) => ({ role: m.role, content: String(m.content).slice(0, MAX_CHARS) }));

        if (messages.length === 0) return Response.json({ error: "Empty" }, { status: 400 });

        const apiKey = process.env["OPENAI_API_KEY"];
        if (!apiKey) return Response.json({ error: "OpenAI API Key Missing" }, { status: 500 });

        const liveContext = await fetchLiveContext();

        try {
          const response = await callOpenAI(apiKey, messages, AbortSignal.timeout(TIMEOUT_MS), liveContext);
          
          if (!response.ok) {
            const err = await response.text();
            console.error("OpenAI Error:", err);
            return Response.json({ error: "حمزة مشغول شوية، جرب كمان لحظة 🙏" }, { status: response.status });
          }

          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim() || "جرب تاني يا غالي 🙏";

          return Response.json({ reply });
        } catch (e: any) {
          console.error("Chat Error:", e);
          return Response.json({ error: "تعذر الاتصال بحمزة الآن" }, { status: 500 });
        }
      },
    },
  },
});


