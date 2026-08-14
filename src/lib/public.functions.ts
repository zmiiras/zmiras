import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً"),
  role: z.string().optional(),
  content: z.string().min(5, "المحتوى قصير جداً"),
  rating: z.number().min(1).max(5).default(5),
});

export const submitTestimonial = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => testimonialSchema.parse(input))
  .handler(async ({ data }) => {
    // Import admin client to bypass RLS for public insertions (since we want anonymous users to be able to submit)
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const { error } = await supabaseAdmin.from("testimonials").insert({
      name: data.name,
      role: data.role || null,
      content: data.content,
      rating: data.rating,
      is_approved: false,
    });

    if (error) {
      return { ok: false as const, message: error.message };
    }
    
    return { ok: true as const };
  });