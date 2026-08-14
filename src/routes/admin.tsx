import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, LogOut, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { activityLogsQuery, logActivity } from "@/lib/activity";
import { changeAdminPassword, createSecondaryAdmin, adminMutateDb, deleteAdminAccount } from "@/lib/admin.functions";
import { FaqEditor } from "@/components/admin/FaqEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { OffersBanner } from "@/components/site/OffersBanner";
import { bannerStyleOf, orderLink, type FaqItem } from "@/lib/zmiras";
import {
  adminAccountsQuery,
  adminTestimonialsQuery,
  offersQuery,
  partnersQuery,
  portfolioQuery,
  servicesQuery,
  siteSettingsQuery,
} from "@/lib/content";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "لوحة تحكم ZMiras" },
      { name: "description", content: "لوحة إدارة محتوى منصة زميراس." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  ["offers", "العروض"],
  ["services", "الخدمات"],
  ["portfolio", "الأعمال"],
  ["partners", "الشركاء والمنصات"],
  ["testimonials", "آراء العملاء"],
  ["settings", "إعدادات الموقع"],
  ["admins", "حسابات الإدارة"],
  ["logs", "سجل النشاط"],
] as const;

type TabKey = (typeof TABS)[number][0];

const inputCls =
  "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent";

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<TabKey>("offers");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        toast.error("الرجاء تسجيل الدخول أولاً");
        void navigate({ to: "/" });
        return;
      }
      setReady(true);
    });
  }, [navigate]);

  if (!ready) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">...</div>;
  }

  return (
    <div className="surface-grid min-h-screen overflow-x-hidden">
      <header className="glass sticky top-0 z-40 border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <h1 className="truncate text-lg font-black">لوحة تحكم ZMiras</h1>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              void navigate({ to: "/" });
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold"
          >
            <LogOut className="h-4 w-4" /> خروج
          </button>
        </div>
        <div className="no-scrollbar mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                tab === key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        {tab === "offers" && <OffersAdmin />}
        {tab === "services" && <ServicesAdmin />}
        {tab === "portfolio" && <PortfolioAdmin />}
        {tab === "partners" && <PartnersAdmin />}
        {tab === "testimonials" && <TestimonialsAdmin />}
        {tab === "settings" && <SettingsAdmin />}
        {tab === "admins" && <AdminsAdmin />}
        {tab === "logs" && <ActivityLogsAdmin />}
      </main>
    </div>
  );
}

function useCrud(table: string, keys: string[], entityType: string) {
  const qc = useQueryClient();
  const mutateDb = useServerFn(adminMutateDb);
  const invalidate = () => {
    keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
    qc.invalidateQueries({ queryKey: ["admin_activity_logs"] });
  };
  const save = useMutation({
    mutationFn: async (row: Record<string, unknown>) => {
      const { id, ...rest } = row as { id?: string };
      const result = await mutateDb({
        data: {
          table,
          action: id ? "update" : "insert",
          id,
          payload: rest
        }
      });
      if (!result.ok) throw new Error(result.message);
      await logActivity({
        action: id ? "تعديل" : "إضافة",
        entity_type: entityType,
        entity_label: String((row as { title?: string }).title ?? ""),
      });
    },
    onSuccess: () => {
      toast.success("تم الحفظ");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const result = await mutateDb({
        data: { table, action: "delete", id }
      });
      if (!result.ok) throw new Error(result.message);
      await logActivity({ action: "حذف", entity_type: entityType, details: "المعرف: " + id });
    },
    onSuccess: () => {
      toast.success("تم الحذف");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return { save, remove };
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="glass space-y-2 rounded-2xl p-4">{children}</div>;
}

function OffersAdmin() {
  const { data: offers = [] } = useQuery(offersQuery);
  const { save, remove } = useCrud("offers", ["offers"], "عرض");
  const [draft, setDraft] = useState({
    title: "",
    old_price: "",
    new_price: "",
    whatsapp_url: "",
    sort_order: 0,
  });

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-base font-black">إضافة عرض جديد</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className={inputCls}
            placeholder="عنوان العرض"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="رابط واتساب"
            value={draft.whatsapp_url}
            onChange={(e) => setDraft({ ...draft, whatsapp_url: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="السعر القديم"
            value={draft.old_price}
            onChange={(e) => setDraft({ ...draft, old_price: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="السعر الجديد"
            value={draft.new_price}
            onChange={(e) => setDraft({ ...draft, new_price: e.target.value })}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!draft.title.trim()) return;
            save.mutate({ ...draft });
            setDraft({ title: "", old_price: "", new_price: "", whatsapp_url: "", sort_order: 0 });
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </Card>

      {offers.map((offer) => (
        <EditableRow
          key={offer.id}
          row={offer as unknown as Record<string, unknown>}
          fields={[
            ["title", "العنوان"],
            ["old_price", "السعر القديم"],
            ["new_price", "السعر الجديد"],
            ["whatsapp_url", "رابط واتساب"],
          ]}
          onSave={(r) => save.mutate(r)}
          onDelete={() => remove.mutate(offer.id)}
        />
      ))}
    </div>
  );
}

function EditableRow({
  row,
  fields,
  onSave,
  onDelete,
  textareas = [],
}: {
  row: Record<string, unknown>;
  fields: [string, string][];
  onSave: (row: Record<string, unknown>) => void;
  onDelete: () => void;
  textareas?: string[];
}) {
  const [state, setState] = useState(row);

  return (
    <Card>
      <div className="grid gap-2 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <label key={key} className="block min-w-0">
            <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
            {textareas.includes(key) ? (
              <textarea
                rows={3}
                className={inputCls}
                value={String(state[key] ?? "")}
                onChange={(e) => setState({ ...state, [key]: e.target.value })}
              />
            ) : (
              <input
                className={inputCls}
                value={String(state[key] ?? "")}
                onChange={(e) => setState({ ...state, [key]: e.target.value })}
              />
            )}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <label className="inline-flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={Boolean(state["is_active"])}
            onChange={(e) => setState({ ...state, is_active: e.target.checked })}
          />
          ظاهر للزوار
        </label>
        <input
          className="w-24 rounded-xl border border-border bg-card px-3 py-2 text-sm"
          type="number"
          value={Number(state["sort_order"] ?? 0)}
          onChange={(e) => setState({ ...state, sort_order: Number(e.target.value) })}
        />
        <button
          type="button"
          onClick={() => onSave(state)}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
        >
          حفظ
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-xl border border-destructive px-4 py-2 text-sm font-bold text-destructive"
        >
          <Trash2 className="h-4 w-4" /> حذف
        </button>
      </div>
    </Card>
  );
}

function ServicesAdmin() {
  const { data: services = [] } = useQuery(servicesQuery);
  const { save, remove } = useCrud("services", ["services"], "خدمة");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-base font-black">إضافة خدمة</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className={inputCls}
            placeholder="اسم الخدمة"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="المعرف بالإنجليزية (slug)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!title.trim() || !slug.trim()) return;
            save.mutate({ title, slug: slug.trim().toLowerCase() });
            setTitle("");
            setSlug("");
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </Card>

      {services.map((service) => (
        <ServiceEditor
          key={service.id}
          service={service as unknown as Record<string, unknown>}
          onSave={(r) => save.mutate(r)}
          onDelete={() => remove.mutate(service.id)}
        />
      ))}
    </div>
  );
}

function ServiceEditor({
  service,
  onSave,
  onDelete,
}: {
  service: Record<string, unknown>;
  onSave: (row: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [state, setState] = useState(service);
  const [features, setFeatures] = useState((service["features"] as string[]).join("\n"));
  const [faq, setFaq] = useState<FaqItem[]>(
    Array.isArray(service["faq"]) ? (service["faq"] as FaqItem[]) : [],
  );

  const text = (key: string, label: string, area = false) => (
    <label key={key} className="block min-w-0">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      {area ? (
        <textarea
          rows={3}
          className={inputCls}
          value={String(state[key] ?? "")}
          onChange={(e) => setState({ ...state, [key]: e.target.value })}
        />
      ) : (
        <input
          className={inputCls}
          value={String(state[key] ?? "")}
          onChange={(e) => setState({ ...state, [key]: e.target.value })}
        />
      )}
    </label>
  );

  return (
    <Card>
      <div className="grid gap-2 sm:grid-cols-2">
        {text("title", "الاسم")}
        {text("slug", "المعرف (slug)")}
        {text("subtitle", "العنوان الفرعي")}
        {text("price_label", "السعر")}
        {text("icon", "الأيقونة (globe / smartphone / credit-card ...)")}
        {text("whatsapp_message", "رسالة واتساب عند الطلب")}
        {text("short_description", "وصف مختصر", true)}
        {text("description", "الوصف الكامل", true)}
      </div>
      <ImageUpload
        label="صورة الخدمة"
        value={String(state["image_url"] ?? "")}
        onChange={(url) => setState({ ...state, image_url: url })}
      />
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-muted-foreground">
          المميزات (كل ميزة في سطر)
        </span>
        <textarea
          rows={4}
          className={inputCls}
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
        />
      </label>
      <FaqEditor items={faq} onChange={setFaq} />
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={Boolean(state["is_active"])}
            onChange={(e) => setState({ ...state, is_active: e.target.checked })}
          />
          ظاهر
        </label>
        <input
          type="number"
          className="w-24 rounded-xl border border-border bg-card px-3 py-2 text-sm"
          value={Number(state["sort_order"] ?? 0)}
          onChange={(e) => setState({ ...state, sort_order: Number(e.target.value) })}
        />
        <button
          type="button"
          onClick={() => {
            onSave({
              ...state,
              features: features.split("\n").map((f) => f.trim()).filter(Boolean),
              faq: faq.filter((f) => f.q.trim() || f.a.trim()),
            });
          }}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
        >
          حفظ
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-xl border border-destructive px-4 py-2 text-sm font-bold text-destructive"
        >
          <Trash2 className="h-4 w-4" /> حذف
        </button>
      </div>
    </Card>
  );
}

function PortfolioAdmin() {
  const { data: items = [] } = useQuery(portfolioQuery);
  const { save, remove } = useCrud("portfolio", ["portfolio"], "عمل");
  const [title, setTitle] = useState("");

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-base font-black">إضافة عمل</h2>
        <input
          className={inputCls}
          placeholder="اسم المشروع"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            if (!title.trim()) return;
            save.mutate({ title });
            setTitle("");
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </Card>

      {items.map((item) => (
        <PortfolioEditor
          key={item.id}
          item={item as unknown as Record<string, unknown>}
          onSave={(r) => save.mutate(r)}
          onDelete={() => remove.mutate(item.id)}
        />
      ))}
    </div>
  );
}

function PortfolioEditor({
  item,
  onSave,
  onDelete,
}: {
  item: Record<string, unknown>;
  onSave: (row: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [state, setState] = useState(item);

  const text = (key: string, label: string, area = false) => (
    <label key={key} className="block min-w-0">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      {area ? (
        <textarea
          rows={3}
          className={inputCls}
          value={String(state[key] ?? "")}
          onChange={(e) => setState({ ...state, [key]: e.target.value })}
        />
      ) : (
        <input
          className={inputCls}
          value={String(state[key] ?? "")}
          onChange={(e) => setState({ ...state, [key]: e.target.value })}
        />
      )}
    </label>
  );

  return (
    <Card>
      <div className="grid gap-2 sm:grid-cols-2">
        {text("title", "الاسم")}
        {text("category", "التصنيف")}
        {text("link_url", "رابط المشروع")}
        {text("description", "الوصف", true)}
      </div>
      <ImageUpload
        label="صورة المشروع"
        value={String(state["image_url"] ?? "")}
        onChange={(url) => setState({ ...state, image_url: url })}
      />
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <label className="inline-flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={Boolean(state["is_active"])}
            onChange={(e) => setState({ ...state, is_active: e.target.checked })}
          />
          ظاهر للزوار
        </label>
        <input
          type="number"
          className="w-24 rounded-xl border border-border bg-card px-3 py-2 text-sm"
          value={Number(state["sort_order"] ?? 0)}
          onChange={(e) => setState({ ...state, sort_order: Number(e.target.value) })}
        />
        <button
          type="button"
          onClick={() => onSave(state)}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
        >
          حفظ
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-xl border border-destructive px-4 py-2 text-sm font-bold text-destructive"
        >
          <Trash2 className="h-4 w-4" /> حذف
        </button>
      </div>
    </Card>
  );
}

function PartnersAdmin() {
  const { data: items = [] } = useQuery(partnersQuery);
  const { save, remove } = useCrud("partners", ["partners"], "شريك");
  const [title, setTitle] = useState("");

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-base font-black">إضافة شريك / منصة / مشروع</h2>
        <input
          className={inputCls}
          placeholder="اسم الشريك أو المنصة"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            if (!title.trim()) return;
            save.mutate({ title: title.trim() });
            setTitle("");
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </Card>

      {items.map((item) => (
        <PartnerEditor
          key={item.id}
          item={item as unknown as Record<string, unknown>}
          onSave={(r) => save.mutate(r)}
          onDelete={() => remove.mutate(item.id)}
        />
      ))}
    </div>
  );
}

function PartnerEditor({
  item,
  onSave,
  onDelete,
}: {
  item: Record<string, unknown>;
  onSave: (row: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [state, setState] = useState(item);

  return (
    <Card>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="mb-1 block text-xs font-bold text-muted-foreground">الاسم</span>
          <input
            className={inputCls}
            value={String(state["title"] ?? "")}
            onChange={(e) => setState({ ...state, title: e.target.value })}
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1 block text-xs font-bold text-muted-foreground">الرابط المباشر</span>
          <input
            className={inputCls}
            dir="ltr"
            placeholder="https://..."
            value={String(state["link_url"] ?? "")}
            onChange={(e) => setState({ ...state, link_url: e.target.value })}
          />
        </label>
      </div>
      <ImageUpload
        label="شعار الشريك"
        value={String(state["logo_url"] ?? "")}
        onChange={(url) => setState({ ...state, logo_url: url })}
      />
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <label className="inline-flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={Boolean(state["is_active"])}
            onChange={(e) => setState({ ...state, is_active: e.target.checked })}
          />
          ظاهر للزوار
        </label>
        <input
          type="number"
          className="w-24 rounded-xl border border-border bg-card px-3 py-2 text-sm"
          value={Number(state["sort_order"] ?? 0)}
          onChange={(e) => setState({ ...state, sort_order: Number(e.target.value) })}
        />
        <button
          type="button"
          onClick={() => onSave(state)}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
        >
          حفظ
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-xl border border-destructive px-4 py-2 text-sm font-bold text-destructive"
        >
          <Trash2 className="h-4 w-4" /> حذف
        </button>
      </div>
    </Card>
  );
}

function TestimonialsAdmin() {
  const { data: items = [] } = useQuery(adminTestimonialsQuery);
  const qc = useQueryClient();
  const mutateDb = useServerFn(adminMutateDb);
  const update = useMutation({
    mutationFn: async ({
      id,
      is_approved,
      name,
    }: {
      id: string;
      is_approved: boolean;
      name: string;
    }) => {
      const result = await mutateDb({
          data: { table: "testimonials", action: "update", id, payload: { is_approved } }
        });
        if (!result.ok) throw new Error(result.message);
      await logActivity({
        action: is_approved ? "اعتماد تقييم" : "إلغاء اعتماد تقييم",
        entity_type: "تقييم",
        entity_label: name,
      });
    },
    onSuccess: () => {
      toast.success("تم التحديث");
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      qc.invalidateQueries({ queryKey: ["admin_activity_logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const result = await mutateDb({
          data: { table: "testimonials", action: "delete", id }
        });
        if (!result.ok) throw new Error(result.message);
      await logActivity({ action: "حذف تقييم", entity_type: "تقييم", details: `المعرف: ${id}` });
    },
    onSuccess: () => {
      toast.success("تم الحذف");
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      qc.invalidateQueries({ queryKey: ["admin_activity_logs"] });
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-base font-black">مراجعة آراء العملاء</h2>
        <p className="text-xs text-muted-foreground">
          أي تقييم جديد يصل هنا بحالة «بانتظار الموافقة» ولا يظهر للزوار إطلاقاً حتى تعتمده.
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-xs font-bold">
          <span className="rounded-full bg-secondary px-3 py-1">
            بانتظار الموافقة: {items.filter((t) => !t.is_approved).length}
          </span>
          <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground">
            معتمد: {items.filter((t) => t.is_approved).length}
          </span>
        </div>
      </Card>
      {[...items]
        .sort((a, b) => Number(a.is_approved) - Number(b.is_approved))
        .map((t) => (
          <TestimonialCard
            key={t.id}
            t={t}
            onToggle={() =>
              update.mutate({ id: t.id, is_approved: !t.is_approved, name: t.name })
            }
            onDelete={() => remove.mutate(t.id)}
          />
        ))}
      {items.length === 0 && <p className="text-center text-muted-foreground">لا توجد تقييمات.</p>}
    </div>
  );
}

function TestimonialCard({
  t,
  onToggle,
  onDelete,
}: {
  t: { id: string; name: string; role: string; rating: number; content: string; is_approved: boolean };
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-4">
        <Card key={t.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-black">
                {t.name} <span className="text-muted-foreground">— {t.role}</span>
              </div>
              <div className="text-xs text-muted-foreground">تقييم {t.rating}/5</div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                t.is_approved ? "bg-accent text-accent-foreground" : "bg-secondary"
              }`}
            >
              {t.is_approved ? "معتمد" : "بانتظار الموافقة"}
            </span>
          </div>
          <p className="text-sm text-foreground/80">{t.content}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              {t.is_approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              {t.is_approved ? "إلغاء الاعتماد" : "اعتماد"}
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 rounded-xl border border-destructive px-4 py-2 text-sm font-bold text-destructive"
            >
              <Trash2 className="h-4 w-4" /> حذف
            </button>
          </div>
        </Card>
    </div>
  );
}

function ActivityLogsAdmin() {
  const { data: logs = [], isLoading } = useQuery(activityLogsQuery);

  if (isLoading) return <p className="text-center text-muted-foreground">جاري التحميل...</p>;

  return (
    <div className="space-y-3">
      <Card>
        <h2 className="text-base font-black">سجل نشاط الإدارة</h2>
        <p className="text-xs text-muted-foreground">
          آخر ٢٠٠ عملية تمت داخل لوحة التحكم (إضافة، تعديل، حذف، اعتماد، تغيير الإعدادات).
        </p>
      </Card>
      {logs.map((log) => (
        <Card key={log.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-black">
                {log.action} — {log.entity_type}
                {log.entity_label ? `: ${log.entity_label}` : ""}
              </div>
              <div className="text-xs text-muted-foreground" dir="ltr">
                {log.actor_email}
              </div>
              {log.details && (
                <div className="text-xs text-muted-foreground">{log.details}</div>
              )}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(log.created_at).toLocaleString("ar-SA")}
            </span>
          </div>
        </Card>
      ))}
      {logs.length === 0 && (
        <p className="text-center text-muted-foreground">لا توجد عمليات مسجلة بعد.</p>
      )}
    </div>
  );
}

function AdminsAdmin() {
  return <AdminsAdminInner />;
}

function SettingsAdmin() {
  const { data: settings, isLoading } = useQuery(siteSettingsQuery);
  const qc = useQueryClient();
  const mutateDb = useServerFn(adminMutateDb);
  const [state, setState] = useState<Record<string, unknown> | null>(null);
  
  // If no settings exist in DB yet, provide a fallback object so it doesn't get stuck loading
  const current = state ?? (settings as unknown as Record<string, unknown> | null) ?? { id: "new" };

  const save = useMutation({
    mutationFn: async (row: Record<string, unknown>) => {
      const {
        id,
        created_at: _c,
        updated_at: _u,
        ...rest
      } = row as { id?: string; created_at?: string; updated_at?: string };

      // Remove columns that don't exist in Supabase DB to prevent Schema Cache errors
              const payload = { ...rest };
        delete (payload as any).banner_text_color;

        let result = await mutateDb({
          data: {
            table: "site_settings",
            action: id === "new" ? "insert" : "update",
            id: id === "new" ? undefined : id,
            payload
          }
        });

        if (!result.ok && result.message.includes("does not exist") && (result.message.includes("logo") || result.message.includes("hero_title_size"))) {
          toast.error("تنبيه: تم حفظ الإعدادات باستثناء بعض الحقول الجديدة. يرجى التأكد من إضافة الأعمدة (logo_url, logo_width, logo_height, hero_title_size) لجدول site_settings من Supabase.", { duration: 15000 });
          delete (payload as any).logo_url;
          delete (payload as any).logo_width;
          delete (payload as any).logo_height;
          delete (payload as any).hero_title_size;
          
          result = await mutateDb({
            data: {
              table: "site_settings",
              action: id === "new" ? "insert" : "update",
              id: id === "new" ? undefined : id,
              payload
            }
          });
        }

        if (!result.ok) throw new Error(result.message);

      await logActivity({ action: "تعديل", entity_type: "إعدادات الموقع" });
    },
    onSuccess: () => {
      toast.success("تم حفظ الإعدادات");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      qc.invalidateQueries({ queryKey: ["admin_activity_logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-center text-muted-foreground">جاري التحميل...</p>;

  const field = (key: string, label: string, area = false) => (
    <label key={key} className="block min-w-0">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      {area ? (
        <textarea
          rows={3}
          className={inputCls}
          value={String(current[key] ?? "")}
          onChange={(e) => setState({ ...current, [key]: e.target.value })}
        />
      ) : (
        <input
          className={inputCls}
          value={String(current[key] ?? "")}
          onChange={(e) => setState({ ...current, [key]: e.target.value })}
        />
      )}
    </label>
  );

  const toggle = (key: string, label: string) => (
    <label key={key} className="inline-flex items-center gap-2 text-sm font-bold">
      <input
        type="checkbox"
        checked={Boolean(current[key])}
        onChange={(e) => setState({ ...current, [key]: e.target.checked })}
      />
      {label}
    </label>
  );

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-base font-black">شعار الموقع والهوية</h2>
        <p className="text-xs text-muted-foreground">
          ارفع شعار الموقع الرسمي (يفضل أن يكون بخلفية شفافة PNG). يمكنك التحكم في أبعاد العرض والارتفاع.
        </p>
        <div className="grid gap-4 sm:grid-cols-1">
          <ImageUpload
            label="رابط الشعار (Logo URL)"
            value={String(current["logo_url"] ?? "")}
            onChange={(url) => setState({ ...current, logo_url: url })}
          />
          <div className="grid grid-cols-2 gap-4">
            <label className="block min-w-0">
              <span className="mb-1 block text-xs font-bold text-muted-foreground">عرض الشعار (بكسل)</span>
              <input
                type="number"
                className={inputCls}
                value={Number(current["logo_width"] ?? 64)}
                onChange={(e) => setState({ ...current, logo_width: Number(e.target.value) })}
              />
            </label>
            <label className="block min-w-0">
              <span className="mb-1 block text-xs font-bold text-muted-foreground">ارتفاع الشعار (بكسل)</span>
              <input
                type="number"
                className={inputCls}
                value={Number(current["logo_height"] ?? 64)}
                onChange={(e) => setState({ ...current, logo_height: Number(e.target.value) })}
              />
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-black">التواصل والأزرار العائمة</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {field("whatsapp_number", "رقم الواتساب (بصيغة دولية بدون +)")}
          {field("whatsapp_float_message", "رسالة زر الواتساب العائم")}
          {field("contact_email", "البريد الإلكتروني")}
        </div>
        <div className="flex flex-wrap gap-4 pt-1">
          {toggle("whatsapp_float_enabled", "إظهار زر الواتساب العائم")}
          {toggle("chat_enabled", "تفعيل مساعد حمزة الذكي")}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-black">روابط التواصل الاجتماعي</h2>
        <p className="text-xs text-muted-foreground">اترك الحقل فارغاً لإخفاء أيقونة المنصة.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {field("facebook_url", "فيسبوك")}
          {field("x_url", "X (تويتر)")}
          {field("instagram_url", "إنستغرام")}
          {field("tiktok_url", "تيك توك")}
          {field("linkedin_url", "لينكدإن")}
          {field("youtube_url", "يوتيوب")}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-black">القسم الرئيسي (Hero)</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {field("hero_badge", "الشارة الترحيبية")}
          {field("hero_title", "العنوان الرئيسي")}
          {field("hero_title_size", "حجم خط العنوان (Tailwind أو px)")}
          {field("hero_cta_primary", "زر الإجراء الأساسي")}
          {field("hero_cta_secondary", "زر الإجراء الثانوي")}
          {field("hero_guarantee", "سطر الضمان")}
          {field("hero_subtitle", "الوصف تحت العنوان", true)}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-black">أرقام الثقة</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {field("stat1_value", "الرقم الأول")}
          {field("stat2_value", "الرقم الثاني")}
          {field("stat3_value", "الرقم الثالث")}
          {field("stat1_label", "وصف الرقم الأول")}
          {field("stat2_label", "وصف الرقم الثاني")}
          {field("stat3_label", "وصف الرقم الثالث")}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-black">عناوين الأقسام</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {field("services_kicker", "تسمية قسم الخدمات")}
          {field("services_title", "عنوان قسم الخدمات")}
          {field("portfolio_kicker", "تسمية قسم الأعمال")}
          {field("portfolio_title", "عنوان قسم الأعمال")}
          {field("testimonials_kicker", "تسمية قسم الآراء")}
          {field("testimonials_title", "عنوان قسم الآراء")}
          {field("contact_kicker", "تسمية قسم التواصل")}
          {field("contact_title", "عنوان قسم التواصل")}
          {field("contact_description", "وصف قسم التواصل", true)}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-black">نصوص التذييل</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {field("footer_contact_title", "عنوان تواصل مباشر")}
          {field("footer_copyright", "نص حقوق النشر")}
          {field("footer_about", "نبذة زميراس في التذييل", true)}
        </div>
      </Card>

      <BannerDesignCard current={current} setState={setState} />

      <button
        type="button"
        disabled={save.isPending}
        onClick={() => save.mutate(current)}
        className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60 sm:w-auto"
      >
        حفظ الإعدادات
      </button>
    </div>
  );
}

function AdminsAdminInner() {
  return <AdminsAdminBody />;
}

/** Live-preview design controls for the top promotional banner. */
function BannerDesignCard({
  current,
  setState,
}: {
  current: Record<string, unknown>;
  setState: (v: Record<string, unknown>) => void;
}) {
  const { data: offers = [] } = useQuery(offersQuery);
  const style = bannerStyleOf(current as never);
  const set = (key: string, value: unknown) => setState({ ...current, [key]: value });

  const color = (key: string, label: string) => (
    <label key={key} className="block min-w-0">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5">
        <input
          type="color"
          className="h-8 w-10 cursor-pointer rounded-md border-0 bg-transparent p-0"
          value={String(current[key] ?? "#000000")}
          onChange={(e) => set(key, e.target.value)}
        />
        <input
          dir="ltr"
          className="w-full bg-transparent text-xs outline-none"
          value={String(current[key] ?? "")}
          onChange={(e) => set(key, e.target.value)}
        />
      </div>
    </label>
  );

  const active = offers.filter((o) => o.is_active).slice(0, 6);
  const items = (
    active.length
      ? active
      : [
          { id: "d1", title: "باقة الموقع الاحترافي", old_price: "٣٥٠٠ ريال", new_price: "٢٤٩٠ ريال" },
          { id: "d2", title: "بطاقة NFC ذكية", old_price: "٢٥٠ ريال", new_price: "١٦٠ ريال" },
        ]
  ).map((o) => ({
    id: o.id,
    title: o.title,
    old_price: o.old_price,
    new_price: o.new_price,
    href:
      ("whatsapp_url" in o && (o as { whatsapp_url?: string }).whatsapp_url) ||
      orderLink(String(current["whatsapp_number"] ?? ""), {
        kind: "عرض",
        title: o.title,
        price: o.new_price,
        oldPrice: o.old_price,
      }),
  }));

  return (
    <Card>
      <h2 className="text-base font-black">تصميم شريط العروض العلوي</h2>
      <p className="text-xs text-muted-foreground">
        تحكّم كامل في ألوان الشريط وزر «عروض خاصة» — الروابط والمنتجات تُدار من تبويب العروض.
      </p>

      <div className="rounded-2xl border border-border bg-background p-3">
        <span className="mb-2 block text-xs font-bold text-muted-foreground">معاينة مباشرة</span>
        <OffersBanner items={items} style={style} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="mb-1 block text-xs font-bold text-muted-foreground">نص الزر الرئيسي</span>
          <input
            className={inputCls}
            value={String(current["banner_label"] ?? "")}
            onChange={(e) => set("banner_label", e.target.value)}
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1 block text-xs font-bold text-muted-foreground">نمط الخلفية</span>
          <select
            className={inputCls}
            value={String(current["banner_style"] ?? "gradient")}
            onChange={(e) => set("banner_style", e.target.value)}
          >
            <option value="gradient">تدرّج لوني</option>
            <option value="solid">لون واحد</option>
          </select>
        </label>
        {color("banner_bg_color", "لون خلفية الشريط")}
        {color("banner_bg_color_2", "لون التدرّج الثاني")}
        {color("banner_text_color", "لون نص العروض")}
        {color("banner_old_price_color", "لون السعر القديم")}
        {color("banner_price_bg", "خلفية السعر الجديد")}
        {color("banner_price_color", "لون نص السعر الجديد")}
        {color("banner_btn_bg", "خلفية زر «عروض خاصة»")}
        {color("banner_btn_text_color", "لون نص الزر")}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={Boolean(current["banner_animated"])}
            onChange={(e) => set("banner_animated", e.target.checked)}
          />
          تفعيل حركة التمرير
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-bold">
          سرعة الحركة (ثانية)
          <input
            type="number"
            min={5}
            max={120}
            className="w-24 rounded-xl border border-border bg-card px-3 py-1.5 text-sm"
            value={Number(current["banner_speed"] ?? 30)}
            onChange={(e) => set("banner_speed", Number(e.target.value) || 30)}
          />
        </label>
      </div>
    </Card>
  );
}

function AdminsAdminBody() {
  const { data: accounts = [] } = useQuery(adminAccountsQuery);
  const qc = useQueryClient();
  const mutateDb = useServerFn(adminMutateDb);
  const create = useServerFn(createSecondaryAdmin);
  const changePassword = useServerFn(changeAdminPassword);
  const deleteAccount = useServerFn(deleteAdminAccount);
  const [form, setForm] = useState({ email: "", password: "", label: "" });
  const [pwd, setPwd] = useState({ email: "", password: "", confirm: "" });

  const updatePassword = useMutation({
    mutationFn: async () => {
      if (pwd.password.length < 8) throw new Error("كلمة المرور يجب ألا تقل عن ٨ أحرف");
      if (pwd.password !== pwd.confirm) throw new Error("كلمتا المرور غير متطابقتين");
      const res = await changePassword({ data: { email: pwd.email, password: pwd.password } });
      if (!res.ok) throw new Error(res.message);
      await logActivity({
        action: "تغيير كلمة المرور",
        entity_type: "حساب إدارة",
        entity_label: pwd.email,
      });
    },
    onSuccess: () => {
      toast.success("تم تحديث كلمة المرور");
      setPwd({ email: "", password: "", confirm: "" });
      qc.invalidateQueries({ queryKey: ["admin_activity_logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const add = useMutation({
    mutationFn: async () => {
      const res = await create({ data: form });
      if (!res.ok) throw new Error(res.message);
      await logActivity({
        action: "إضافة مسؤول",
        entity_type: "حساب إدارة",
        entity_label: form.email,
      });
    },
    onSuccess: () => {
      toast.success("تم إنشاء حساب المسؤول");
      setForm({ email: "", password: "", label: "" });
      qc.invalidateQueries({ queryKey: ["admin_accounts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({
      id,
      is_enabled,
      email,
    }: {
      id: string;
      is_enabled: boolean;
      email: string;
    }) => {
      const result = await mutateDb({
          data: { table: "admin_accounts", action: "update", id, payload: { is_enabled } }
        });
        if (!result.ok) throw new Error(result.message);
      await logActivity({
        action: is_enabled ? "تفعيل مسؤول" : "إيقاف مسؤول",
        entity_type: "حساب إدارة",
        entity_label: email,
      });
    },
    onSuccess: () => {
      toast.success("تم التحديث");
      qc.invalidateQueries({ queryKey: ["admin_accounts"] });
      qc.invalidateQueries({ queryKey: ["admin_activity_logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async ({ id, email }: { id: string; email: string }) => {
      if (!confirm(`هل أنت متأكد من حذف حساب المسؤول (${email})؟ لا يمكن التراجع عن هذه العملية.`)) return;
      const res = await deleteAccount({ data: { id, email } });
      if (!res.ok) throw new Error(res.message);
      await logActivity({
        action: "حذف مسؤول",
        entity_type: "حساب إدارة",
        entity_label: email,
      });
    },
    onSuccess: () => {
      toast.success("تم حذف الحساب");
      qc.invalidateQueries({ queryKey: ["admin_accounts"] });
      qc.invalidateQueries({ queryKey: ["admin_activity_logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-base font-black">تغيير كلمة المرور</h2>
        <p className="text-xs text-muted-foreground">
          اختر الحساب ثم أدخل كلمة مرور جديدة (٨ أحرف على الأقل) — تُطبّق فوراً على تسجيل الدخول.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <select
            className={inputCls}
            value={pwd.email}
            onChange={(e) => setPwd({ ...pwd, email: e.target.value })}
          >
            <option value="">اختر الحساب</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.email}>
                {a.email}
                {a.is_primary ? " (الرئيسي)" : ""}
              </option>
            ))}
          </select>
          <input
            type="password"
            className={inputCls}
            placeholder="كلمة المرور الجديدة"
            value={pwd.password}
            onChange={(e) => setPwd({ ...pwd, password: e.target.value })}
          />
          <input
            type="password"
            className={inputCls}
            placeholder="تأكيد كلمة المرور"
            value={pwd.confirm}
            onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
          />
        </div>
        <button
          type="button"
          disabled={!pwd.email || updatePassword.isPending}
          onClick={() => updatePassword.mutate()}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          تحديث كلمة المرور
        </button>
      </Card>

      <Card>
        <h2 className="text-base font-black">إضافة مسؤول جديد</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            className={inputCls}
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="كلمة المرور"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="الاسم / الصفة"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
        </div>
        <button
          type="button"
          disabled={add.isPending}
          onClick={() => add.mutate()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> إنشاء الحساب
        </button>
      </Card>

      {accounts.map((account) => (
        <Card key={account.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-black" dir="ltr">
                {account.email}
              </div>
              <div className="text-xs text-muted-foreground">
                {account.label || "مسؤول"} {account.is_primary && "• الحساب الرئيسي"}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!account.is_primary && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      toggle.mutate({
                        id: account.id,
                        is_enabled: !account.is_enabled,
                        email: account.email,
                      })
                    }
                    className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold"
                  >
                    {account.is_enabled ? "إيقاف" : "تفعيل"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove.mutate({ id: account.id, email: account.email })}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
              {account.is_primary && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  مفعل دائماً
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
