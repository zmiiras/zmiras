const fs = require('fs');
const path = 'D:/Zmiiras/src/routes/admin.tsx';
let s = fs.readFileSync(path, 'utf8');

// Using regex to handle any whitespace/newline variations
const regex = /if\s*\(!result\.ok\s*&&\s*result\.message\.includes\("does not exist"\)\s*&&\s*result\.message\.includes\("logo"\)\)\s*{\s*toast\.error\("تنبيه: تم حفظ الإعدادات باستثناء الشعار\. يرجى أولاً إضافة الأعمدة \(logo_url, logo_width, logo_height\) لجدول site_settings من Supabase\.",\s*{\s*duration:\s*15000\s*}\);\s*delete\s*\(payload\s*as\s*any\)\.logo_url;\s*delete\s*\(payload\s*as\s*any\)\.logo_width;\s*delete\s*\(payload\s*as\s*any\)\.logo_height;/;

const to = `if (!result.ok && result.message.includes("does not exist") && (result.message.includes("logo") || result.message.includes("hero_title_size"))) {
          toast.error("تنبيه: تم حفظ الإعدادات باستثناء بعض الحقول الجديدة. يرجى التأكد من إضافة الأعمدة (logo_url, logo_width, logo_height, hero_title_size) لجدول site_settings من Supabase.", { duration: 15000 });
          delete (payload as any).logo_url;
          delete (payload as any).logo_width;
          delete (payload as any).logo_height;
          delete (payload as any).hero_title_size;`;

if (regex.test(s)) {
    s = s.replace(regex, to);
    fs.writeFileSync(path, s);
    console.log('Successfully updated admin.tsx using regex');
} else {
    console.log('Regex match failed');
}
