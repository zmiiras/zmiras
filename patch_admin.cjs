const fs = require("fs");
let code = fs.readFileSync("d:/Zmiiras/src/routes/admin.tsx", "utf-8");

// Patch TestimonialsAdmin update
code = code.replace(
  /const { error } = await supabase\.from\("testimonials"\)\.update\(\{ is_approved \}\)\.eq\("id", id\);\n\s*if \(error\) throw error;/,
  `const mutateDb = useServerFn(adminMutateDb);
        const result = await mutateDb({
          data: { table: "testimonials", action: "update", id, payload: { is_approved } }
        });
        if (!result.ok) throw new Error(result.message);`
);

// Patch TestimonialsAdmin delete
code = code.replace(
  /const { error } = await supabase\.from\("testimonials"\)\.delete\(\)\.eq\("id", id\);\n\s*if \(error\) throw error;/,
  `const mutateDb = useServerFn(adminMutateDb);
        const result = await mutateDb({
          data: { table: "testimonials", action: "delete", id }
        });
        if (!result.ok) throw new Error(result.message);`
);

// Patch Admin accounts update
code = code.replace(
  /const { error } = await supabase\.from\("admin_accounts"\)\.update\(\{ is_enabled \}\)\.eq\("id", id\);\n\s*if \(error\) throw error;/,
  `const mutateDb = useServerFn(adminMutateDb);
        const result = await mutateDb({
          data: { table: "admin_accounts", action: "update", id, payload: { is_enabled } }
        });
        if (!result.ok) throw new Error(result.message);`
);

fs.writeFileSync("d:/Zmiiras/src/routes/admin.tsx", code);

