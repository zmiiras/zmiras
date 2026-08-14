const fs = require('fs');
let s1 = fs.readFileSync('D:/Zmiiras/src/components/site/Header.tsx', 'utf8');
s1 = s1.replace(/className=\"shrink-0 object-contain\\s+-translate-x-3\"/, 'className=\"shrink-0 object-contain scale-[1.3] -translate-y-[2px] -translate-x-2.5\"');
s1 = s1.replace(/style=\{\{ width: '52px', height: '52px' \}\}/g, "style={{ width: '56px', height: '56px' }}");
fs.writeFileSync('D:/Zmiiras/src/components/site/Header.tsx', s1);

let s2 = fs.readFileSync('D:/Zmiiras/src/components/site/Footer.tsx', 'utf8');
s2 = s2.replace(/className=\"shrink-0 object-contain\\s+-translate-x-3\"/, 'className=\"shrink-0 object-contain scale-[1.3] -translate-y-[2px] -translate-x-2.5\"');
s2 = s2.replace(/style=\{\{ width: '52px', height: '52px' \}\}/g, "style={{ width: '56px', height: '56px' }}");
fs.writeFileSync('D:/Zmiiras/src/components/site/Footer.tsx', s2);
console.log('Fixed Navbar logo size and position');
