import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { adminLogin } from "@/lib/admin.functions";

export function AdminLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const login = useServerFn(adminLogin);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login({ data: { email, password } });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
      if (error) {
        toast.error("تعذر بدء الجلسة");
        return;
      }
      toast.success("مرحباً بك في لوحة التحكم");
      onClose();
      await navigate({ to: "/admin" });
    } catch (err) {
      console.error("Login Exception:", err);
      toast.error("حدث خطأ غير متوقع، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-navy-deep/70 p-4 backdrop-blur-sm">
      <div className="glass glow-ring relative w-full max-w-md rounded-3xl p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-4 left-4 grid h-9 w-9 place-items-center rounded-xl border border-border bg-card"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Lock className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-xl font-black">بوابة الإدارة</h2>
          <p className="mt-1 text-sm text-muted-foreground">منطقة محمية — الدخول للمصرح لهم فقط</p>
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            autoComplete="username"
            style={{ color: "#111111" }}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-neutral-500 outline-none focus:border-accent"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            autoComplete="current-password"
            style={{ color: "#111111" }}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-neutral-500 outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}