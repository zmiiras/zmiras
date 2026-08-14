const fs = require('fs');
let s1 = fs.readFileSync('D:/Zmiiras/src/components/site/Header.tsx', 'utf8');
s1 = s1.replace('items-center gap-3', 'items-center gap-0');
s1 = s1.replace(/style=\{\{ width: '56px', height: '56px' \}\}/g, 'style={{ width: \'76px\', height: \'76px\' }}');
s1 = s1.replace('className=\"shrink-0 object-contain\"', 'className=\"shrink-0 object-contain translate-x-2\"');
fs.writeFileSync('D:/Zmiiras/src/components/site/Header.tsx', s1);

let s2 = fs.readFileSync('D:/Zmiiras/src/components/site/Footer.tsx', 'utf8');
s2 = s2.replace('items-center gap-3', 'items-center gap-0');
s2 = s2.replace(/style=\{\{ width: '56px', height: '56px' \}\}/g, 'style={{ width: \'76px\', height: \'76px\' }}');
s2 = s2.replace('className=\"shrink-0 object-contain\"', 'className=\"shrink-0 object-contain translate-x-2\"');
fs.writeFileSync('D:/Zmiiras/src/components/site/Footer.tsx', s2);

console.log('Fixed Header and Footer');
