const fs = require('fs');
let s = fs.readFileSync('D:/Zmiiras/src/integrations/supabase/types.ts', 'utf8');

// We need to inject logo_url, logo_width, logo_height into site_settings Row, Insert, Update.
function injectSettings(str, blockName) {
  let parts = str.split('site_settings: {');
  if(parts.length < 2) return str;
  let inside = parts[1].split('Relationships: []');
  
  let blockRegex = new RegExp(blockName + ': \\{([\\s\\S]*?)\\}');
  inside[0] = inside[0].replace(blockRegex, (match, p1) => {
     if (p1.includes('logo_url')) return match; // already injected
     return blockName + ': {' + p1 + '            logo_url?: string | null\n            logo_width?: number | null\n            logo_height?: number | null\n          }';
  });
  parts[1] = inside.join('Relationships: []');
  return parts.join('site_settings: {');
}

s = injectSettings(s, 'Row');
s = injectSettings(s, 'Insert');
s = injectSettings(s, 'Update');

fs.writeFileSync('D:/Zmiiras/src/integrations/supabase/types.ts', s);
console.log('types.ts updated');
