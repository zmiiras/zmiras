import { getRequest } from "@tanstack/react-start/server";

/** Returns the caller's user id when the bearer token belongs to an enabled admin. */
export async function getAuthorizedAdminId(): Promise<string | null> {
  const request = getRequest();
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: role } = await supabaseAdmin
    .from("user_roles")
    .select("user_id")
    .eq("user_id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();

  return role ? data.user.id : null;
}

