const fs = require('fs');

let h = fs.readFileSync('D:/Zmiiras/src/components/site/Header.tsx', 'utf8');
h = h.replace(/<img\s*src="\/zmiras-mark\.png"[\s\S]*?\/>/, 
`<img
                src={settings?.logo_url || "/zmiras-mark.png"}
                alt="شعار زميراس ZMiras"
                className="shrink-0 object-contain -translate-x-3"
                style={{ width: settings?.logo_width ? \`\${settings.logo_width}px\` : '64px', height: settings?.logo_height ? \`\${settings.logo_height}px\` : '64px' }}
                loading="eager"
              />`);
fs.writeFileSync('D:/Zmiiras/src/components/site/Header.tsx', h);

let f = fs.readFileSync('D:/Zmiiras/src/components/site/Footer.tsx', 'utf8');
f = f.replace(/<img\s*src="\/zmiras-mark\.png"[\s\S]*?\/>/, 
`<img
                  src={s?.logo_url || "/zmiras-mark.png"}
                  alt="شعار زميراس ZMiras"
                  className="shrink-0 object-contain -translate-x-3"
                  style={{ width: s?.logo_width ? \`\${s.logo_width}px\` : '64px', height: s?.logo_height ? \`\${s.logo_height}px\` : '64px' }}
                  loading="lazy"
                />`);
fs.writeFileSync('D:/Zmiiras/src/components/site/Footer.tsx', f);
console.log('Fixed Header and Footer dynamic logo for real');
