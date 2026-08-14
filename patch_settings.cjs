const fs = require("fs");
let code = fs.readFileSync("d:/Zmiiras/src/routes/admin.tsx", "utf-8");

const from = `      // If it's a new row, we insert instead of update
      if (id === "new") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from("site_settings") as any).insert([rest]);
        if (error) throw error;
      } else {
        if (!id) throw new Error("·«  ÊÃœ ≈⁄œ«œ« ");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from("site_settings") as any).update(rest).eq("id", id);
        if (error) throw error;
      }`;

const to = `      const mutateDb = useServerFn(adminMutateDb);
      const result = await mutateDb({
        data: {
          table: "site_settings",
          action: id === "new" ? "insert" : "update",
          id: id === "new" ? undefined : id,
          payload: rest
        }
      });
      if (!result.ok) throw new Error(result.message);`;

// fallback regex replace if string replace fails due to whitespace
let newCode = code.replace(from, to);
if (newCode === code) {
  newCode = code.replace(/\/\/ If it's a new row[\s\S]*?if \(error\) throw error;\n      \}/, to);
}

fs.writeFileSync("d:/Zmiiras/src/routes/admin.tsx", newCode);
console.log("Patched SettingsAdmin successfully.");

