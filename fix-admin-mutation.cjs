const fs = require('fs');
let s = fs.readFileSync('D:/Zmiiras/src/routes/admin.tsx', 'utf8');

const oldCode =         delete (rest as any).banner_text_color;







        const result = await mutateDb({
          data: {
            table: "site_settings",
            action: id === "new" ? "insert" : "update",
            id: id === "new" ? undefined : id,
            payload: rest
          }
        });
        if (!result.ok) throw new Error(result.message);;

const newCode =         const payload = { ...rest };
        delete (payload as any).banner_text_color;

        let result = await mutateDb({
          data: {
            table: "site_settings",
            action: id === "new" ? "insert" : "update",
            id: id === "new" ? undefined : id,
            payload
          }
        });

        if (!result.ok && result.message.includes("does not exist") && result.message.includes("logo_url")) {
          toast.error("تنبيه: تم حفظ الإعدادات باستثناء الشعار. يرجى أولاً إضافة الأعمدة (logo_url, logo_width, logo_height) كـ (text) و (numeric) لجدول site_settings من Supabase.", { duration: 15000 });
          delete (payload as any).logo_url;
          delete (payload as any).logo_width;
          delete (payload as any).logo_height;
          
          result = await mutateDb({
            data: {
              table: "site_settings",
              action: id === "new" ? "insert" : "update",
              id: id === "new" ? undefined : id,
              payload
            }
          });
        }

        if (!result.ok) throw new Error(result.message);;

// Wait, the newlines and whitespace might not match exactly.
// Let's use regex.
let regex = /delete \(rest as any\)\.banner_text_color;[\s\S]*?payload:\s*rest\s*\}\s*\});\s*if \(\!result\.ok\) throw new Error\(result\.message\);/;
s = s.replace(regex, newCode);

fs.writeFileSync('D:/Zmiiras/src/routes/admin.tsx', s);
console.log('Fixed mutation in admin');
