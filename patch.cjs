const fs = require("fs");
let code = fs.readFileSync("d:/Zmiiras/src/routes/admin.tsx", "utf-8");

const from = `function useCrud(table: string, keys: string[], entityType: string) {
  const qc = useQueryClient();
  const invalidate = () => {
    keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
    qc.invalidateQueries({ queryKey: ["admin_activity_logs"] });
  };
  const save = useMutation({
    mutationFn: async (row: Record<string, unknown>) => {
      const { id, ...rest } = row as { id?: string };
      const { error } = id
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from(table as any) as any).update(rest).eq("id", id)
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from(table as any) as any).insert(rest);
      if (error) throw error;
      await logActivity({
        action: id ? "ÊÚÏíá" : "ÅÖÇÝÉ",
        entity_type: entityType,
        entity_label: String((row as { title?: string }).title ?? ""),
      });
    },
    onSuccess: () => {
      toast.success("Êã ÇáÍÝÙ");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(table as any) as any).delete().eq("id", id);
      if (error) throw error;
      await logActivity({ action: "ÍÐÝ", entity_type: entityType, details: \`ÇáãÚÑÝ: \${id}\` });
    },
    onSuccess: () => {
      toast.success("Êã ÇáÍÐÝ");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return { save, remove };
}`;

const to = `function useCrud(table: string, keys: string[], entityType: string) {
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
        action: id ? "ÊÚÏíá" : "ÅÖÇÝÉ",
        entity_type: entityType,
        entity_label: String((row as { title?: string }).title ?? ""),
      });
    },
    onSuccess: () => {
      toast.success("Êã ÇáÍÝÙ");
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
      await logActivity({ action: "ÍÐÝ", entity_type: entityType, details: \`ÇáãÚÑÝ: \${id}\` });
    },
    onSuccess: () => {
      toast.success("Êã ÇáÍÐÝ");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return { save, remove };
}`;

// fallback regex replace if string replace fails due to whitespace
let newCode = code.replace(from, to);
if (newCode === code) {
  newCode = code.replace(/function useCrud[\s\S]*?return \{ save, remove \};\n\}/, to);
}

fs.writeFileSync("d:/Zmiiras/src/routes/admin.tsx", newCode);
console.log("Patched useCrud successfully.");

