/* Vývojový server: node dev.js
   Zostaví stránky, sleduje zmeny a po každej úprave prestaví — takže po
   výmene obrázka stačí obnoviť kartu, nič sa nespúšťa ručne.

   HTML sa servíruje s no-cache, aby prehliadač nedržal starú verziu stránky
   (obrázky a CSS majú vlastný ?v= otisk, tie sa cacheovať môžu).

   Na produkciu to netreba — tam sú to obyčajné statické súbory. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const PORT = 5173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.avif': 'image/avif', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.md': 'text/markdown; charset=utf-8'
};

function build(reason) {
  try {
    const out = execFileSync(process.execPath, [path.join(ROOT, 'build.js')], { encoding: 'utf8' });
    const summary = out.trim().split('\n').slice(-2).join(' | ');
    console.log('[build] ' + (reason || 'štart') + ' → ' + summary);
  } catch (e) {
    /* build.js exits non-zero when an image is missing; still show its report */
    const out = (e.stdout || '') + (e.stderr || '');
    console.log('[build] ' + (reason || 'štart'));
    console.log(out.trim());
  }
}

/* --- watcher ------------------------------------------------------------ */
const WATCH = ['src', 'assets/css', 'assets/js', 'assets/img', 'assets/video'];
let pending = null;
function schedule(reason) {
  clearTimeout(pending);           // editors write in bursts; debounce them
  pending = setTimeout(() => build(reason), 150);
}

build();
for (const rel of WATCH) {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) continue;
  fs.watch(dir, { persistent: true }, (evt, file) => {
    if (file && /^\.|~$|\.tmp$/.test(file)) return;   // ignore temp/hidden churn
    schedule(rel + '/' + (file || ''));
  });
}
console.log('[watch] ' + WATCH.join(', '));

/* --- server ------------------------------------------------------------- */
http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(ROOT, path.normalize(rel).replace(/^([/\\])+/, ''));

  if (!file.startsWith(ROOT)) { res.writeHead(403).end('Forbidden'); return; }

  /* /programy → programy.html, and /programy/ → programy.html too, so
     extension-less links behave the way they do on GitHub Pages */
  const candidates = [file];
  if (!path.extname(file)) candidates.push(file + '.html');
  if (file.endsWith(path.sep + 'index.html')) {
    candidates.push(file.slice(0, -('index.html'.length + 1)) + '.html');
  }

  const found = candidates.find(f => {
    try { return fs.statSync(f).isFile(); } catch (e) { return false; }
  });

  if (!found) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 — ' + rel);
    console.log('  404 ' + rel);
    return;
  }

  fs.readFile(found, (err, buf) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 — ' + rel);
      return;
    }
    const ext = path.extname(found).toLowerCase();
    const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream' };
    /* pages must never be served stale, or a swapped image stays invisible
       because the cached HTML still points at the old filename */
    if (ext === '.html') headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    res.writeHead(200, headers);
    res.end(buf);
  });
}).listen(PORT, () => console.log('[serve] http://localhost:' + PORT));
