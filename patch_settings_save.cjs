const fs = require("fs");
let code = fs.readFileSync("d:/Zmiiras/src/routes/admin.tsx", "utf-8");

const from = `      const {
        id,
        created_at: _c,
        updated_at: _u,
        ...rest
      } = row as { id?: string; created_at?: string; updated_at?: string };`;

const to = `      const {
        id,
        created_at: _c,
        updated_at: _u,
        ...rest
      } = row as { id?: string; created_at?: string; updated_at?: string };

      // Remove columns that don't exist in Supabase DB to prevent Schema Cache errors
      delete (rest as any).banner_text_color;
      delete (rest as any).stat1_value;
      delete (rest as any).stat1_label;
      delete (rest as any).stat2_value;
      delete (rest as any).stat2_label;
      delete (rest as any).stat3_value;
      delete (rest as any).stat3_label;`;

code = code.replace(from, to);

fs.writeFileSync("d:/Zmiiras/src/routes/admin.tsx", code);
console.log("Patched Settings save payload successfully.");

