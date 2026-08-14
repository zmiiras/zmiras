import { Plus, Trash2 } from "lucide-react";

import type { FaqItem } from "@/lib/zmiras";

const inputCls =
  "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent";

/** Friendly question/answer editor that saves as structured JSON. */
export function FaqEditor({
  items,
  onChange,
}: {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}) {
  const update = (index: number, patch: Partial<FaqItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-muted-foreground">الأسئلة الشائعة</span>
        <button
          type="button"
          onClick={() => onChange([...items, { q: "", a: "" }])}
          className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary"
        >
          <Plus className="h-4 w-4" /> إضافة سؤال جديد
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-xs text-muted-foreground">لا توجد أسئلة بعد — أضف أول سؤال.</p>
      )}

      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-2xl border border-border bg-card/60 p-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted-foreground">السؤال</span>
            <input
              className={inputCls}
              value={item.q}
              onChange={(e) => update(i, { q: e.target.value })}
              placeholder="اكتب السؤال هنا"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted-foreground">الإجابة</span>
            <textarea
              rows={3}
              className={inputCls}
              value={item.a}
              onChange={(e) => update(i, { a: e.target.value })}
              placeholder="اكتب الإجابة هنا"
            />
          </label>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="inline-flex items-center gap-1 rounded-xl border border-destructive px-3 py-1.5 text-xs font-bold text-destructive"
          >
            <Trash2 className="h-4 w-4" /> حذف السؤال
          </button>
        </div>
      ))}
    </div>
  );
}