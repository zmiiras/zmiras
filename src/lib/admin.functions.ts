import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PRIMARY_EMAIL = "zmiras@gmail.com";
const PRIMARY_PASSWORD = "HAmza2001";

const adminMutationSchema = z.object({
  table: z.string(),
  action: z.enum(["insert", "update", "delete"]),
  id: z.string().optional(),
  payload: z.record(z.unknown()).optional(),
});

/** Generic server function to bypass RLS for admin panel data mutations */
export const adminMutateDb = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => adminMutationSchema.parse(input))
  .handler(async ({ data }) => {
    const { getAuthorizedAdminId } = await import("./admin.server");
    const callerId = await getAuthorizedAdminId();
    if (!callerId) return { ok: false as const, message: "غير مصرح لك بإجراء هذه العملية" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    try {
      if (data.action === "delete") {
        if (!data.id) throw new Error("Missing ID for delete");
        const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
        if (error) throw error;
      } else if (data.action === "update") {
        if (!data.id || !data.payload) throw new Error("Missing ID or payload for update");
        const { error } = await supabaseAdmin.from(data.table).update(data.payload).eq("id", data.id);
        if (error) throw error;
      } else if (data.action === "insert") {
        if (!data.payload) throw new Error("Missing payload for insert");
        const { error } = await supabaseAdmin.from(data.table).insert(data.payload);
        if (error) throw error;
      }
      return { ok: true as const };
    } catch (e: any) {
      return { ok: false as const, message: e.message || "حدث خطأ في قاعدة البيانات" };
    }
  });

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

/**
 * Signs an admin in. The primary admin account is guaranteed to exist:
 * if it is missing (or its password drifted) it is (re)provisioned before sign-in.
 */
export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => loginSchema.parse(input))
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: accountRow } = await supabaseAdmin
      .from("admin_accounts")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!accountRow && email !== PRIMARY_EMAIL) {
      return { ok: false as const, message: "بيانات الدخول غير صحيحة" };
    }
    if (accountRow && !accountRow.is_enabled) {
      return { ok: false as const, message: "تم إيقاف هذا الحساب" };
    }

    // Owner recovery: the documented primary credentials must ALWAYS work.
    // The auth user is created if missing, confirmed if pending, and its password
    // is re-synced when the owner signs in with the default password.
    if (email === PRIMARY_EMAIL && data.password === PRIMARY_PASSWORD) {
      // 1. Try to create the user directly (safest way to check if they exist without relying on listUsers pagination)
      const { error: createErr, data: newUser } = await supabaseAdmin.auth.admin.createUser({
        email: PRIMARY_EMAIL,
        password: PRIMARY_PASSWORD,
        email_confirm: true,
      });

      if (createErr) {
        // If it failed because the user already exists, update their password and confirm their email
        if (createErr.message.toLowerCase().includes("already exists") || createErr.status === 422) {
          // We must fetch the user ID to update them.
          // The best way to get a single user by email via admin API is to list with a search, or just list.
          // Supabase's listUsers isn't ideal, but we'll try it.
          const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
          const existing = list?.users.find((u) => u.email?.toLowerCase() === PRIMARY_EMAIL);
          
          if (existing) {
            await supabaseAdmin.auth.admin.updateUserById(existing.id, {
              password: PRIMARY_PASSWORD,
              email_confirm: true,
              ban_duration: "none",
            });
            console.log("Admin account password forcefully updated.");
          }
        } else {
          console.error("admin bootstrap failed:", createErr.message);
        }
      } else {
        console.log("Admin account forcefully created.");
      }

      // Ensure the admin account exists in our custom admin_accounts table
      if (!accountRow) {
        await supabaseAdmin
          .from("admin_accounts")
          .insert({ email: PRIMARY_EMAIL, label: "المالك", is_enabled: true });
      }
    }

    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
    const key = process.env["SUPABASE_ANON_KEY"] || process.env["VITE_SUPABASE_ANON_KEY"];
    
    if (!url || !key) return { ok: false as const, message: "بيانات قاعدة البيانات غير مكتملة" };

    const authClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: signIn, error } = await authClient.auth.signInWithPassword({
      email,
      password: data.password,
    });

    if (error || !signIn.session) {
      console.error("admin sign-in failed:", error?.message ?? "no session");
      // Return the exact error message from Supabase to help debug
      return { ok: false as const, message: `فشل الدخول: ${error?.message ?? "لا توجد جلسة نشطة"}` };
    }

    const userId = signIn.session.user.id;
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!existingRole) {
      await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
    }

    if (accountRow && accountRow.user_id !== userId) {
      await supabaseAdmin.from("admin_accounts").update({ user_id: userId }).eq("id", accountRow.id);
    }

    // Ensure the storage bucket exists
    try {
      const { data: bucket } = await supabaseAdmin.storage.getBucket("site-images");
      if (!bucket) {
        await supabaseAdmin.storage.createBucket("site-images", { public: true });
        console.log("Storage bucket 'site-images' created.");
      }
    } catch (e) {
      console.error("Failed to ensure storage bucket:", e);
    }

    return {
      ok: true as const,
      access_token: signIn.session.access_token,
      refresh_token: signIn.session.refresh_token,
    };
  });

const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  label: z.string().default(""),
});

/** Creates a secondary admin account. Caller must already be an admin. */
export const createSecondaryAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createAdminSchema.parse(input))
  .handler(async ({ data }) => {
    const { getAuthorizedAdminId } = await import("./admin.server");
    const callerId = await getAuthorizedAdminId();
    if (!callerId) return { ok: false as const, message: "غير مصرح" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let userId = list?.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
    if (userId) {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: data.password,
        email_confirm: true,
      });
    } else {
      const created = await supabaseAdmin.auth.admin.createUser({
        email,
        password: data.password,
        email_confirm: true,
      });
      if (created.error) return { ok: false as const, message: created.error.message };
      userId = created.data.user?.id ?? null;
    }

    if (!userId) return { ok: false as const, message: "تعذر إنشاء الحساب" };

    // 1. Assign 'admin' role manually without relying on upsert constraints
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!existingRole) {
      const { error: roleErr } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (roleErr) return { ok: false as const, message: `خطأ في تعيين الصلاحية: ${roleErr.message}` };
    }

    // 2. Manage admin_accounts record manually
    const { data: existingAcc } = await supabaseAdmin
      .from("admin_accounts")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    const accData = {
      email,
      label: data.label,
      user_id: userId,
      is_enabled: true,
      is_primary: false,
    };

    if (existingAcc) {
      const { error: accErr } = await supabaseAdmin
        .from("admin_accounts")
        .update(accData)
        .eq("id", existingAcc.id);
      if (accErr) return { ok: false as const, message: `خطأ في تحديث سجل الحساب: ${accErr.message}` };
    } else {
      const { error: accErr } = await supabaseAdmin
        .from("admin_accounts")
        .insert(accData);
      if (accErr) return { ok: false as const, message: `خطأ في إنشاء سجل الحساب: ${accErr.message}` };
    }

    return { ok: true as const };
  });

/** Fetches all admin accounts. Caller must be an authenticated admin. */
export const getAdminAccounts = createServerFn({ method: "GET" })
  .handler(async () => {
    const { getAuthorizedAdminId } = await import("./admin.server");
    const callerId = await getAuthorizedAdminId();
    if (!callerId) throw new Error("غير مصرح");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("admin_accounts")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  });


const changePasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "كلمة المرور يجب ألا تقل عن ٨ أحرف"),
});

/** Updates the password of any admin account. Caller must be an authenticated admin. */
export const changeAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => changePasswordSchema.parse(input))
  .handler(async ({ data }) => {
    const { getAuthorizedAdminId } = await import("./admin.server");
    const callerId = await getAuthorizedAdminId();
    if (!callerId) return { ok: false as const, message: "غير مصرح" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();

    const { data: account } = await supabaseAdmin
      .from("admin_accounts")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (!account) return { ok: false as const, message: "هذا الحساب غير موجود" };

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const user = list?.users.find((u) => u.email?.toLowerCase() === email);
    if (!user) return { ok: false as const, message: "لم يتم تفعيل هذا الحساب بعد" };

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: data.password,
    });
    if (error) return { ok: false as const, message: error.message };

    return { ok: true as const };
  });

const deleteAdminSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

/** Deletes an admin account and its auth user. Caller must be an authenticated admin. */
export const deleteAdminAccount = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => deleteAdminSchema.parse(input))
  .handler(async ({ data }) => {
    const { getAuthorizedAdminId } = await import("./admin.server");
    const callerId = await getAuthorizedAdminId();
    if (!callerId) return { ok: false as const, message: "غير مصرح" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();

    // 1. Get the account to make sure it's not primary
    const { data: account } = await supabaseAdmin
      .from("admin_accounts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();

    if (!account) return { ok: false as const, message: "هذا الحساب غير موجود" };
    if (account.is_primary) return { ok: false as const, message: "لا يمكن حذف الحساب الرئيسي" };

    // 2. Delete from auth.users
    if (account.user_id) {
      await supabaseAdmin.auth.admin.deleteUser(account.user_id);
    } else {
      // Fallback: try to find user by email if user_id is missing
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const user = list?.users.find((u) => u.email?.toLowerCase() === email);
      if (user) {
        await supabaseAdmin.auth.admin.deleteUser(user.id);
      }
    }

    // 3. Delete roles and account record
    if (account.user_id) {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", account.user_id);
    }
    await supabaseAdmin.from("admin_accounts").delete().eq("id", data.id);

    return { ok: true as const };
  });
