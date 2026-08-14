const fs = require('fs');
let s1 = fs.readFileSync('D:/Zmiiras/src/components/site/Header.tsx', 'utf8');
s1 = s1.replace('py-3 sm:py-4', 'py-2 sm:py-3');
s1 = s1.replace('px-3 py-2 transition-all sm:px-4 sm:py-2.5', 'px-3 py-1.5 transition-all sm:px-4 sm:py-2');
fs.writeFileSync('D:/Zmiiras/src/components/site/Header.tsx', s1);
console.log('Fixed Header padding');
