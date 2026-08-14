import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

/** Uploads an image file to storage and returns its public URL. */
export function ImageUpload({
  value,
  onChange,
  label = "الصورة",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار ملف صورة");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }
    setBusy(true);
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      
      // Ensure bucket exists right before uploading (fallback)
      const { data: bucket } = await supabaseAdmin.storage.getBucket("site-images");
      if (!bucket) {
        await supabaseAdmin.storage.createBucket("site-images", { public: true });
      }

      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      
      // Use admin client to bypass RLS for uploading too!
      const { error } = await supabaseAdmin.storage
        .from("site-images")
        .upload(path, file, { contentType: file.type, upsert: false });
        
      if (error) throw error;
      
      // We must get the public URL directly since we might not have a proxy for /api/public/media setup yet
      const { data: publicUrlData } = supabaseAdmin.storage.from("site-images").getPublicUrl(path);
      onChange(publicUrlData.publicUrl);
      
      toast.success("تم رفع الصورة");
    } catch (e) {
      toast.error((e as Error).message || "تعذر رفع الصورة");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="min-w-0">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-secondary">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            رفع صورة
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 rounded-xl border border-destructive px-3 py-2 text-sm font-bold text-destructive"
            >
              <Trash2 className="h-4 w-4" /> إزالة
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />
    </div>
  );
}