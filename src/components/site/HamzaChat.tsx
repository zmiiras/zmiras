import { useQuery } from "@tanstack/react-query";
import { Check, Copy, Loader2, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import avatar from "@/assets/hamza-avatar-3d-clean.png";
import { siteSettingsQuery } from "@/lib/content";

type Msg = { role: "user" | "assistant"; content: string };
const GREETING: Msg = { role: "assistant", content: "أنا حمزة، موظف زميراس.. تحت أمرك، تحب أساعدك في إيه النهاردة؟" };
const QUICK_PROMPTS = ["إيه خدمات زميراس؟", "إزاي أتصدر نتايج جوجل؟", "عندك نصيحة دينية؟", "كلمني عن برج البرلس", "أبغى تطبيق جوال"];

export function HamzaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);  const [showWelcome, setShowWelcome] = useState(true);  const [hovering, setHovering] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);
  const { data: settings } = useQuery(siteSettingsQuery);

  useEffect(() => { 
    if (open) {
      setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" }); 
      }, 100);
  useEffect(() => {
    const t = setTimeout(() => setShowWelcome(false), 30000);
    return () => clearTimeout(t);
  }, []);


    }
  }, [messages, open]);

  async function sendText(raw: string) {
    const text = raw.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }) 
      });
      const data = await res.json();
      const content = data.reply || "معلش يا غالي، السيرفر مهنج شوية.. جرب تاني كمان لحظة 🙏";
      setMessages([...next, { role: "assistant", content }]);
    } catch { 
      setMessages([...next, { role: "assistant", content: "حمزة مش عارف يوصل للسيرفر دلوقتي، جرب تاني يا باشا." }]); 
    }
    finally { setLoading(false); }
  }

  const waNumber = settings?.whatsapp_number ?? "966500000000";
  const waMessage = settings?.whatsapp_float_message ?? "مرحباً زميراس، أرغب في الاستفسار عن خدماتكم";
  const showWa = settings?.whatsapp_float_enabled ?? true;
  const chatEnabled = settings?.chat_enabled ?? true;

  return (
    <>
      {/* Floating WhatsApp Button */}
      {showWa && (
        <a 
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fixed right-4 bottom-4 z-[90] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-2xl transition-transform hover:scale-105 active:scale-95"
          aria-label="تواصل عبر واتساب"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.02a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.2-8.25 8.2Zm4.52-6.14c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12s-.64.8-.79.97c-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
          </svg>
        </a>
      )}

      {/* Hamza Chatbot */}
      {chatEnabled && (
        <div className="fixed bottom-4 left-4 z-[90] flex flex-col items-start gap-4">
          <div className={`glass pointer-events-none absolute bottom-2 left-[4.75rem] w-[260px] origin-bottom-left rounded-2xl border border-primary/30 px-3 py-2.5 text-[12px] font-bold leading-snug text-foreground shadow-xl transition-all duration-300 ease-out ${!open && (showWelcome || hovering) ? "translate-x-0 scale-100 opacity-100" : "pointer-events-none -translate-x-2 scale-95 opacity-0"}`}>
            <p>أنا حمزة، موظف زميراس.. معاك لو محتاج أي استفسار! 👋</p>
          </div>
          {open && (
            <div className="glass flex h-[500px] max-h-[70vh] w-[350px] flex-col overflow-hidden rounded-3xl shadow-2xl border border-primary/20 sm:w-[400px]">
              <div className="flex items-center gap-3 border-b border-white/10 bg-primary p-4 text-primary-foreground shadow-lg">
                <img src={avatar} alt="حمزة" className="h-10 w-10 rounded-full border-2 border-white/20 object-cover shadow-sm" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-black">حمزة — موظف زميراس</div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold opacity-80">
                    <span className={`h-2 w-2 rounded-full ${loading ? "bg-amber-400 animate-pulse" : "bg-green-400"}`}></span>
                    {loading ? "حمزة يفكر..." : "متصل وجاهز لخدمتك"}
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-background/50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tl-none" : "border border-border bg-card text-card-foreground rounded-tr-none"}`}>
                      {m.content}
                      {m.role === "assistant" && (
                        <div className="mt-2 flex items-center gap-3 border-t border-border/50 pt-2">
                          <button type="button" onClick={() => { void navigator.clipboard?.writeText(m.content); setCopied(i); setTimeout(() => setCopied((c) => (c === i ? null : c)), 1500); }} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground transition-colors hover:text-primary">
                            {copied === i ? <><Check className="h-3.5 w-3.5 text-primary" /> تم النسخ</> : <><Copy className="h-3.5 w-3.5" /> نسخ</>}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-end">
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground shadow-sm">
                      <Loader2 className="h-3 w-3 animate-spin" /> حمزة بيكتب لك...
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
              <div className="p-3 border-t border-border bg-card/90 backdrop-blur-md">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
                  {QUICK_PROMPTS.map(q => <button key={q} onClick={() => sendText(q)} className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-bold text-primary transition-all hover:border-primary hover:bg-primary/5 active:scale-95">{q}</button>)}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); sendText(input); }} className="flex gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اسأل حمزة أي حاجة..." className="flex-1 rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary transition-all" />
                  <button type="submit" disabled={loading} className="rounded-xl bg-primary px-4 text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"><Send className="h-4 w-4 rotate-180" /></button>
                </form>
              </div>
            </div>
          )}
          <button type="button" onClick={() => setOpen(!open)} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} className="animate-pulse-glow h-16 w-16 rounded-full bg-primary overflow-hidden shadow-2xl transition-transform hover:scale-105 active:scale-95">
            {open ? <X className="m-auto h-6 w-6 text-primary-foreground" /> : <img src={avatar} alt="حمزة" className="h-full w-full object-cover" />}
          </button>
        </div>
      )}
    </>
  );
}

