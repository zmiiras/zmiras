const fs = require('fs');
let s1 = fs.readFileSync('D:/Zmiiras/src/components/site/Header.tsx', 'utf8');
s1 = s1.replace(/-translate-y-\[2px\] -translate-x-2.5/, '-translate-y-1 -translate-x-3');
fs.writeFileSync('D:/Zmiiras/src/components/site/Header.tsx', s1);

let s2 = fs.readFileSync('D:/Zmiiras/src/components/site/Footer.tsx', 'utf8');
s2 = s2.replace(/-translate-y-\[2px\] -translate-x-2.5/, '-translate-y-1 -translate-x-3');
fs.writeFileSync('D:/Zmiiras/src/components/site/Footer.tsx', s2);
