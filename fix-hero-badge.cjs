const fs = require('fs');
let p = 'D:/Zmiiras/src/components/site/Hero.tsx';
let s = fs.readFileSync(p, 'utf8');
s = s.replace(/className=\"glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-primary sm:text-sm\"/, 'className=\"glass inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm sm:text-base font-black tracking-wide text-primary shadow-sm border border-primary/10\"');
fs.writeFileSync(p, s);
console.log('Fixed Hero badge');
