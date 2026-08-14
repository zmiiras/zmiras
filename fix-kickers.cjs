const fs = require('fs');
let paths = [
  'D:/Zmiiras/src/components/site/PortfolioSection.tsx',
  'D:/Zmiiras/src/components/site/TestimonialsSection.tsx',
  'D:/Zmiiras/src/components/site/ContactSection.tsx'
];
for(let p of paths) {
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/<p className=\"text-sm font-bold text-accent\">/g, '<span className=\"mb-4 inline-flex items-center justify-center rounded-full bg-accent/15 border border-accent/30 px-5 py-2 text-sm sm:text-base font-black tracking-wide text-accent uppercase shadow-sm\">');
  s = s.replace(/<\/p>\s*<h2 className=\"mt-[12]/g, '</span>\n          <h2 className=\"mt-2');
  fs.writeFileSync(p, s);
}
console.log('Fixed kickers');
