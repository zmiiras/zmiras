const fs = require('fs');
let s = fs.readFileSync('D:/Zmiiras/src/routes/admin.tsx', 'utf8');
s = s.replace(/\\s*delete \\(rest as any\\)\\.stat1_value;/g, '');
s = s.replace(/\\s*delete \\(rest as any\\)\\.stat1_label;/g, '');
s = s.replace(/\\s*delete \\(rest as any\\)\\.stat2_value;/g, '');
s = s.replace(/\\s*delete \\(rest as any\\)\\.stat2_label;/g, '');
s = s.replace(/\\s*delete \\(rest as any\\)\\.stat3_value;/g, '');
s = s.replace(/\\s*delete \\(rest as any\\)\\.stat3_label;/g, '');
fs.writeFileSync('D:/Zmiiras/src/routes/admin.tsx', s);
