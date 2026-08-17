/* Assembles the static site. Run: node build.js
   Output is plain .html at the repo root — no server or framework needed. */
const fs = require('fs');
const path = require('path');
const L = require('./src/layout');

const pages = [].concat(require('./src/pages-a'), require('./src/pages-b'));

let count = 0;
for (const p of pages) {
  const html = L.page({
    title: p.title,
    description: p.description,
    active: p.active,
    body: p.body
  });
  fs.writeFileSync(path.join(__dirname, p.file), html, 'utf8');
  console.log('  ' + p.file.padEnd(32) + (html.length / 1024).toFixed(1) + ' KB');
  count++;
}
console.log('\nBuilt ' + count + ' pages.');

/* Image problems are reported here rather than silently producing a page
   full of broken <img> tags. */
const warnings = [...new Set(L.imageWarnings)];
if (warnings.length) {
  console.log('\n!! Obrázky — ' + warnings.length + ' problém(ov):');
  warnings.forEach(w => console.log('   - ' + w));
  console.log('');
  process.exitCode = 1;
} else {
  console.log('Obrázky: ' + L.imageIndex.size + ' súborov, všetky odkazy sedia.');
}
