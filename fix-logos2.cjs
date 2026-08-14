const fs = require('fs');
let s1 = fs.readFileSync('D:/Zmiiras/src/components/site/Header.tsx', 'utf8');
s1 = s1.replace(/width: '76px', height: '76px'/g, "width: '88px', height: '88px'");
s1 = s1.replace('translate-x-2', '-translate-x-3');
fs.writeFileSync('D:/Zmiiras/src/components/site/Header.tsx', s1);

let s2 = fs.readFileSync('D:/Zmiiras/src/components/site/Footer.tsx', 'utf8');
s2 = s2.replace(/width: '76px', height: '76px'/g, "width: '88px', height: '88px'");
s2 = s2.replace('translate-x-2', '-translate-x-3');
fs.writeFileSync('D:/Zmiiras/src/components/site/Footer.tsx', s2);

console.log('Fixed Header and Footer spacing');
