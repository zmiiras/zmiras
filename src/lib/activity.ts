import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type ActivityLog = {
  id: string;
  actor_email: string;
  action: string;
  entity_type: string;
  entity_label: string;
  details: string;
  created_at: string;
};

export const activityLogsQuery = queryOptions({
  queryKey: ["admin_activity_logs"],
  queryFn: async (): Promise<ActivityLog[]> => {
    const { data, error } = await supabase
      .from("admin_activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return (data ?? []) as unknown as ActivityLog[];
  },
});

/** Records an administrative action. Never throws — logging must not break the action. */
export async function logActivity(entry: {
  action: string;
  entity_type: string;
  entity_label?: string;
  details?: string;
}) {
  try {
    const { data } = await supabase.auth.getUser();
    const { adminMutateDb } = await import("@/lib/admin.functions");
    await adminMutateDb({
      data: {
        table: "admin_activity_logs",
        action: "insert",
        payload: {
          actor_email: data.user?.email ?? "",
          action: entry.action,
          entity_type: entry.entity_type,
          entity_label: entry.entity_label ?? "",
          details: entry.details ?? "",
        }
      }
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
