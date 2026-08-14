const fs = require("fs");
let code = fs.readFileSync("d:/Zmiiras/src/routes/admin.tsx", "utf-8");
code = code.replace(
  /function useCrud[\s\S]*?return \{ save, remove \};\n  \}/,
  `function useCrud(table: string, keys: string[], entityType: string) {
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
  }`
);
fs.writeFileSync("d:/Zmiiras/src/routes/admin.tsx", code);

