/* Shared chrome for every page. One source, so the header and footer
   cannot drift apart across the site. */

/* The visual-direction document this rebuild was based on. It lives on this
   site as a normal page, so anyone with the link can open it — no login, no
   artifact. It is noindex, so it stays out of search results. */
const UI_DIRECTION_URL = 'vizualny-smer.html';

/* Cache-buster for CSS/JS, derived from the contents of those two files.
   Content-addressed on purpose: a timestamp would move the stamp on every
   build, so `node build.js` would dirty all eight pages even when nothing
   changed. This keeps the build reproducible — the stamp moves only when
   the CSS or JS actually does. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const VERSION = (() => {
  const root = path.join(__dirname, '..', 'assets');
  const css = fs.readFileSync(path.join(root, 'css', 'site.css'));
  const js = fs.readFileSync(path.join(root, 'js', 'site.js'));
  return crypto.createHash('sha256').update(css).update(js).digest('hex').slice(0, 8);
})();

/* ---------------------------------------------------------------------------
   Images are referenced by BASE NAME only — img('meal1'), not 'meal1.webp'.

   Two problems this solves:

   1. Swapping meal1.webp for meal1.jpg used to break the page, because the
      filename changed with the extension. The build now finds whatever
      meal1.* actually exists.
   2. Overwriting a file kept showing the old picture, because the browser
      caches by URL. Each URL now carries ?v=<hash of the file>, so new bytes
      mean a new URL and the browser always refetches.

   Missing or ambiguous names are reported by build.js rather than failing
   silently.
   --------------------------------------------------------------------------- */
const IMG_DIR = path.join(__dirname, '..', 'assets', 'img');
/* first match wins when several extensions share a base name */
const IMG_PREFERENCE = ['.avif', '.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg'];

const imageWarnings = [];

const imageIndex = (() => {
  const map = new Map();

  /* walks subfolders too, so img('deco/kopr') and img('pay/visa') resolve */
  const walk = (dir, prefix = '') => {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) {
      imageWarnings.push(`Priečinok assets/img/${prefix} sa nedá čítať.`);
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) { walk(path.join(dir, entry.name), prefix + entry.name + '/'); continue; }
      const ext = path.extname(entry.name).toLowerCase();
      if (!IMG_PREFERENCE.includes(ext)) continue;
      const key = prefix + path.basename(entry.name, path.extname(entry.name));
      const rel = prefix + entry.name;
      const rank = IMG_PREFERENCE.indexOf(ext);
      const prev = map.get(key);
      if (prev) {
        const keep = prev.rank <= rank ? prev.file : rel;
        const drop = prev.rank <= rank ? rel : prev.file;
        imageWarnings.push(
          `"${key}" existuje viackrát (${prev.file} aj ${rel}). Používam ${keep}, ` +
          `${drop} sa ignoruje — zmažte ho, nech je jasné, ktorý platí.`
        );
        if (prev.rank <= rank) continue;
      }
      const buf = fs.readFileSync(path.join(dir, entry.name));
      map.set(key, {
        file: rel,
        rank,
        hash: crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8)
      });
    }
  };

  walk(IMG_DIR);
  return map;
})();

function img(name) {
  const base = name.replace(/\.[A-Za-z0-9]+$/, '');
  const hit = imageIndex.get(base);
  if (!hit) {
    imageWarnings.push(`Chýba obrázok "${base}" — v assets/img/ nie je žiadny ${base}.*`);
    return `assets/img/${name}`;
  }
  return `assets/img/${hit.file}?v=${hit.hash}`;
}

/* ---------------------------------------------------------------------------
   Background video.

   Same cache-busting rule as the images: the URL carries a hash of the file,
   so replacing the clip cannot serve a stale copy from cache. Sources are
   listed best-first — a browser picks the first type it can decode, so
   dropping a converted .mp4 next to the .mov makes every browser use it
   without touching the markup.
   --------------------------------------------------------------------------- */
const VIDEO_DIR = path.join(__dirname, '..', 'assets', 'video');
/* A <source> whose declared type the browser cannot play is skipped without
   ever being fetched, and canPlayType('video/quicktime') is "" in Chrome —
   so declaring a .mov honestly guarantees it is ignored. Omitting the type
   instead makes the browser sniff the file, and a .mov carrying H.264/AAC
   then decodes fine in Chrome and Safari. Firefox still will not touch the
   QuickTime container, which is why a real .mp4 belongs here. */
const VIDEO_TYPES = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': null };
/* order matters: first playable wins, and .mov is the last resort */
const VIDEO_PREFERENCE = ['.webm', '.mp4', '.mov'];

function videoSources(base) {
  const out = [];
  for (const ext of VIDEO_PREFERENCE) {
    const file = base + ext;
    let buf;
    try { buf = fs.readFileSync(path.join(VIDEO_DIR, file)); } catch (e) { continue; }
    const hash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
    out.push({ src: `assets/video/${file}?v=${hash}`, type: VIDEO_TYPES[ext], bytes: buf.length });
  }
  if (!out.length) imageWarnings.push(`Chýba video "${base}" — v assets/video/ nie je žiadny ${base}.*`);
  return out;
}

/* Full-bleed muted background clip with a darkening scrim over it.
   `poster` is a still shown until the first frame decodes — and the only
   thing visitors on prefers-reduced-motion ever see, because site.js stops
   the clip for them. */
function videoBg(base, poster) {
  const sources = videoSources(base);
  return `    <div class="vbg" aria-hidden="true">
      <video class="vbg__video" data-bgvideo autoplay muted loop playsinline
             preload="metadata" poster="${img(poster)}" tabindex="-1">
${sources.map(s => `        <source src="${s.src}"${s.type ? ` type="${s.type}"` : ''}>`).join('\n')}
      </video>
    </div>`;
}

const icon = {
  check: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M8 14.2 4.3 10.5l1.4-1.4L8 11.4l6.3-6.3 1.4 1.4z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 7V5.6a3 3 0 0 1 6 0V7"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
  caret: '<svg class="nav__caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8h11v9H2zM13 11h4.5l3.5 3.5V17h-8z"/><circle cx="6" cy="18.6" r="1.7"/><circle cx="17" cy="18.6" r="1.7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7.5-4.7-7.5-10.2A7.5 7.5 0 0 1 12 3.3a7.5 7.5 0 0 1 7.5 7.5C19.5 16.3 12 21 12 21z"/><circle cx="12" cy="10.6" r="2.6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20c0-8 5-14 16-15 0 10-5 15-11 15a5 5 0 0 1-5-5z"/><path d="M9 15c2-3 5-5 8-6"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8h.01"/></svg>',
  star: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.6 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5L11 19z"/><path d="m16 9.5 4 5M20 9.5l-4 5"/></svg>',
  soundOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5L11 19z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  /* meal-box mark from the Figma card badge — recoloured through currentColor
     so the same path can be a filled box or an empty slot */
  mealBox: '<svg viewBox="0 0 21 15" fill="currentColor" aria-hidden="true"><path d="M19.3108 5.5035L1.8864 5.50698C1.71683 5.50698 1.65389 5.48432 1.50879 5.47212L2.29373 1.49572C2.48429 0.53867 3.42832 0 4.37934 0L16.449 0.00348653C17.657 -0.026149 18.4611 0.852458 18.6692 1.99255L19.3108 5.50524V5.5035Z"/><path d="M16.5663 14.1117H4.2414C3.32534 14.1117 2.45124 13.4475 2.28341 12.5741L1.32015 7.59189C1.00547 7.5762 0.67331 7.63373 0.363877 7.564C0.0981497 7.50298 -0.00849087 7.2659 0.000250159 7.01835C0.00724299 6.84228 0.13661 6.53198 0.423316 6.53198H20.4088C20.72 6.53198 20.8389 6.87541 20.8336 7.07588C20.8249 7.33389 20.6553 7.58666 20.3686 7.5884L19.5015 7.59189L18.6571 12.1715C18.4666 13.2035 17.7271 14.11 16.568 14.11L16.5663 14.1117ZM11.7849 9.69253C12.1485 9.69253 12.3618 9.43278 12.3461 9.15037C12.3304 8.86796 12.1258 8.64308 11.8199 8.64308H9.00876C8.68359 8.64308 8.46856 8.90806 8.4843 9.20964C8.49653 9.45893 8.70807 9.68904 9.0175 9.68904H11.7867L11.7849 9.69253Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none"/></svg>'
};

/* Instagram clips shown in the hero.
   `file` is looked for in assets/video/ — drop the real export there and it
   plays. Missing file => the poster shows and the slider advances on a timer.
   Replace `title` with the real caption of each post. */
const reels = [
  { file: 'reel-1.mp4', poster: 'real-foto/flatlay-zhora', title: 'Takto vyzerá týždeň krabičiek', tag: 'Jedálniček' },
  { file: 'reel-2.mp4', poster: 'real-foto/kuchyna-tim', title: 'Ráno v kuchyni: príprava 5 chodov', tag: 'Zo zákulisia' },
  { file: 'reel-3.mp4', poster: 'real-foto/kuchyna-vydaj', title: 'Šokové schladenie a vákuové balenie', tag: 'Čerstvosť 72 h' },
  { file: 'reel-4.mp4', poster: 'real-foto/kuchyna-dezerty', title: 'Rozvoz až k dverám, deň vopred', tag: 'Rozvoz' },
  { file: 'reel-5.mp4', poster: 'real-foto/ranajkovy-box', title: 'Čo dostanete v jednom dni', tag: 'Unboxing' }
];

/* The nine programs — names, calories and prices as published on the live site.
   Card artwork is layered, not baked:
     `art`    food cut-out with alpha, from assets/img/programy_karty/
     `figure` the gold silhouette behind it — its head deliberately overhangs
              the top edge of the card, which is why .pcard cannot clip
     `g1/g2`  the card's gradient stops
   `img` stays because the mega-menu, the checkout rail and the program detail
   page still use the old flat pictures. */
const programs = [
  { slug: '3-chody-zena', name: '3 chody Žena', kcal: 1200, price: '87,50 €', meals: 3, img: 'meal1.webp',
    art: '3_chody_zena', figure: 'woman', g1: '#8E5BD0', g2: '#5B2E9E',
    desc: 'Praktická voľba pre tých, ktorí preferujú menej jedál denne. Raňajky, obed, večera.' },
  { slug: '3-chody-muz', name: '3 chody Muž', kcal: 1600, price: '98,50 €', meals: 3, img: 'meal2.webp',
    art: '3_chody_muz', figure: 'man', g1: '#4A8FD4', g2: '#12327A',
    desc: 'Praktická voľba pre tých, ktorí preferujú menej jedál denne. Raňajky, obed, večera.' },
  { slug: 'slim', name: 'Slim', kcal: 1200, price: '94,50 €', meals: 5, img: 'meal3.webp',
    art: 'slim', figure: 'woman', g1: '#7DC65A', g2: '#1F7A3D',
    desc: 'Ideálne pre rýchle chudnutie, detox či veľmi nízku fyzickú aktivitu. Vhodné pre drobnejšie postavy alebo ako štart.' },
  { slug: 'slim-plus', name: 'Slim+', kcal: 1400, price: '99,50 €', meals: 5, img: 'meal4.webp',
    art: 'slim+', figure: 'woman', g1: '#C3D96B', g2: '#5C8A2A',
    desc: 'Častá voľba žien pri redukcii váhy. Pomáha schudnúť bez hladovania, ak je aktivita nízka až stredná.' },
  { slug: 'balance', name: 'Balance', kcal: 1600, price: '104,50 €', meals: 5, img: 'meal5.webp',
    art: 'balance', figure: 'woman', g1: '#F2718D', g2: '#B01E4B',
    desc: 'Vyvážený program pre ženy s bežným denným pohybom alebo pre mužov, ktorí chcú redukovať váhu.' },
  /* the only pair figure — the program is explicitly for both, and the
     zena+muz artboard is wider than the singles, which the card handles by
     sizing every figure on height and letting width follow */
  { slug: 'balance-plus', name: 'Balance+', kcal: 1800, price: '109,50 €', meals: 5, img: 'meal6.webp',
    art: 'balance+', figure: 'zena+muz', g1: '#F0A868', g2: '#B4541C',
    desc: 'Univerzálny variant pre udržiavanie hmotnosti. Vhodné pre aktívne ženy alebo menej aktívnych mužov.' },
  { slug: 'active-body', name: 'Active body', kcal: 2000, price: '114,50 €', meals: 5, img: 'meal7.webp',
    art: 'active_body', figure: 'man', g1: '#5AC8C0', g2: '#136E74',
    desc: 'Štandardný príjem pre väčšinu populácie pri bežnom dennom režime. Podporuje stabilnú energiu počas dňa.' },
  /* TODO obrázok: active_body+.png a max_energy.png zatiaľ nedodané —
     dočasne bežia na cut-oute susedného programu. */
  { slug: 'active-body-plus', name: 'Active body+', kcal: 2200, price: '119,50 €', meals: 5, img: 'meal8.webp',
    art: 'active_body', figure: 'man', g1: '#5AA6E0', g2: '#134C8C',
    desc: 'Vhodné pre mužov s vyššou fyzickou aktivitou alebo pre ženy s náročnými tréningmi.' },
  { slug: 'max-energy', name: 'Max energy', kcal: 2500, price: '124,50 €', meals: 5, img: 'meal9.webp',
    art: '3_chody_muz', figure: 'man', g1: '#F0563C', g2: '#9E0F1E',
    desc: 'Najvyšší program – ideálny pre športovcov, fyzicky pracujúcich alebo na naberanie svalovej hmoty.' }
];

/* MAX NUTRITION stands apart from the nine weekly programs above and is
   deliberately modelled as its own thing, not a tenth entry in `programs`:
   it is à la carte (lunches and dinners, not a five-day box), sized by
   portion instead of by calorie target, and delivered three times a week
   rather than five. Mixing it into `programs` would put it in the pricing
   table, the configurator and the calorie calculator, where none of those
   columns apply. It gets a promo slot in the mega-menu and its own page. */
const maxNutrition = {
  href: 'max-nutrition.html',
  name: 'MAX NUTRITION',
  eyebrow: 'Špeciálny program',
  claim: 'Nutrične vyvážené jedlá pre každého, kto to myslí vážne',
  short: 'Obedy a večere · veľkosti M / L / XL · rozvoz 3× týždenne',
  lede: 'Obedy a večere navrhnuté tak, aby pokryli všetky nutričné potreby — ' +
        'aj pre profesionálnych športovcov. Vyberáte si jedlá aj veľkosť porcie, ' +
        'nie týždenný balík.',
  sizes: [
    { code: 'M', desc: 'Pre ľudí s nižším energetickým výdajom' },
    { code: 'L', desc: 'Ideál pre aktívnych jednotlivcov' },
    { code: 'XL', desc: 'Pre športovcov s vysokou potrebou energie' }
  ],
  /* delivery runs three times a week instead of the five-day box cycle */
  days: ['Nedeľa', 'Utorok', 'Štvrtok'],
  /* Real kitchen photography now, from assets/img/real-foto/. The meal1..meal9
     renders could never be used here — each has a calorie figure burned into
     the artwork ("2000 kcal") belonging to a box program. */
  meals: [
    'Kurací steak s kurkumovou ryžou a grilovaným ananásom',
    'Turkey meatballs, paradajková omáčka s opekaným zemiakom',
    'Teriyaki rezančeky z roštenky s brokolicou a ryžou',
    'Beef bolognese rice pasta'
  ],
  /* real kitchen photography for the hero and teaser */
  photoHero: 'real-foto/kura-paprikova-ryza',
  photoWide: 'hero-funguje',
  photoTeaser: 'band-menu'
};

/* ---------------------------------------------------------------------------
   MAX NUTRITION menu — courses and dishes.

   Shaped so that ADDING A COURSE IS ONE ENTRY IN THIS ARRAY. The client plans
   to add snacks and breakfasts later; the page renders whatever it finds here,
   so a new course needs no layout work and no new page — which was the whole
   reason they preferred this concept.

   Only dishes TopStrava actually publishes are listed. The client's mock-up
   invented fitness meals (protein pancakes, burger bowls); inventing menu
   items is exactly what they complained about elsewhere, so the four real
   dishes from topstrava.sk/max-nutrition are all that ship until they send
   more.

   `nutri` values are SAMPLE figures, flagged as such in the UI the same way
   the client's own mock-up flagged them. Neither the live page nor anything
   they sent carries real per-dish macros.
   --------------------------------------------------------------------------- */
const MAX_SIZES = [
  { code: 'M', note: 'ľahšia porcia' },
  { code: 'L', note: 'štandardná porcia' },
  { code: 'XL', note: 'väčšia porcia' }
];

const maxCourses = [
  {
    id: 'hlavne-jedla',
    label: 'Hlavné jedlá',
    title: 'Obedy a večere',
    lede: 'Jedlá, ktoré sa v programe objavujú pravidelne. Ku každému si vyberáte veľkosť porcie.',
    meals: [
      {
        slug: 'kuraci-steak-kurkumova-ryza',
        name: 'Kurací steak s kurkumovou ryžou a grilovaným ananásom',
        desc: 'Grilovaný kurací steak, kurkumová ryža a grilovaný ananás.',
        photo: 'real-foto/kura-kurkumove-rizoto',
        zlozenie: 'kuracie prsia, ryža, kurkuma, ananás, olivový olej, korenie',
        alergeny: [],
        nutri: { M: [390, 34, 38, 9], L: [520, 45, 51, 12], XL: [690, 60, 68, 16] }
      },
      {
        slug: 'turkey-meatballs',
        name: 'Turkey meatballs, paradajková omáčka s opekaným zemiakom',
        desc: 'Morčacie guľky v paradajkovej omáčke s opekaným zemiakom.',
        photo: 'real-foto/kura-smotanova-kuskus',
        zlozenie: 'morčacie mäso, paradajky, zemiaky, cibuľa, cesnak, bylinky',
        alergeny: ['1', '3'],
        nutri: { M: [410, 32, 40, 11], L: [545, 43, 53, 15], XL: [720, 57, 70, 20] }
      },
      {
        slug: 'teriyaki-rezancky',
        name: 'Teriyaki rezančeky z roštenky s brokolicou a ryžou',
        desc: 'Hovädzia roštenka v teriyaki omáčke s brokolicou a ryžou.',
        photo: 'real-foto/kura-ryzove-rezance',
        zlozenie: 'hovädzia roštenka, brokolica, ryža, teriyaki omáčka, sezam',
        alergeny: ['1', '6', '11'],
        nutri: { M: [430, 36, 41, 12], L: [575, 48, 55, 16], XL: [760, 63, 73, 21] }
      },
      {
        slug: 'beef-bolognese-rice-pasta',
        name: 'Beef bolognese rice pasta',
        desc: 'Hovädzie ragú s ryžovými cestovinami.',
        photo: 'real-foto/mlete-hovadzie',
        zlozenie: 'hovädzie mäso, ryžové cestoviny, paradajky, mrkva, zeler, bylinky',
        alergeny: ['9'],
        nutri: { M: [400, 33, 42, 10], L: [535, 44, 56, 13], XL: [705, 58, 74, 18] }
      }
    ]
  }
  /* Ďalšie chody (raňajky, snacky, dezerty) sa pridávajú sem ako nová položka.
     Stránka aj detail jedla sa vykreslia samy, netreba meniť šablónu. */
];

/* flat lookup for the detail page */
const maxMeals = maxCourses.flatMap(c => c.meals.map(m => ({ ...m, course: c.label })));

const deliveryCities = ['Žilina', 'Považská Bystrica', 'Púchov', 'Kysucké Nové Mesto', 'Bytča',
  'Martin', 'Čadca', 'Spišská Nová Ves', 'Levoča', 'Liptovský Mikuláš', 'Poprad', 'Trenčín', 'Košice'];

/* ---------------------------------------------------------------------------
   Pickup points.

   Names are real — they are the twelve partners already published on the live
   site. ADDRESSES, OPENING HOURS AND NOTES ARE PROTOTYPE FILLER so the client
   can see the map and the popup working; they must come from the kitchen
   before this is public. Same for `x`/`y`, which are percentage positions on
   the static map image and were placed by eye, not by geocoding.

   When the real Google map goes in, `x`/`y` are dropped and lat/lng take over
   — the popup content stays exactly as it is.
   --------------------------------------------------------------------------- */
const pickupPoints = [
  { name: 'Repeat Crossfit', city: 'Považská Bystrica', x: 36.7, y: 27.8,
    address: 'Robotnícka 2158, 017 01 Považská Bystrica',
    hours: 'Po – Pi 6:00 – 21:00 · So 8:00 – 12:00',
    note: 'Krabičky nájdete v chladničke hneď pri recepcii.' },
  { name: 'Zauko Fitness', city: 'Púchov', x: 35.0, y: 31.3,
    address: 'Námestie slobody 1400, 020 01 Púchov',
    hours: 'Po – Pi 6:00 – 22:00 · So – Ne 9:00 – 20:00',
    note: 'Vyzdvihnutie na recepcii, stačí povedať meno.' },
  { name: 'Mestská Kaviareň', city: 'Bytča', x: 37.5, y: 24.9,
    address: 'Námestie SR 1, 014 01 Bytča',
    hours: 'Po – Pi 7:00 – 20:00 · So 8:00 – 14:00',
    note: 'Chladnička je vzadu za barom.' },
  { name: 'MM Aréna', city: 'Krásno nad Kysucou', x: 38.8, y: 17.9,
    address: 'Struhy 2172, 023 02 Krásno nad Kysucou',
    hours: 'Po – Pi 8:00 – 21:00 · So 9:00 – 18:00',
    note: 'Odber pri vstupe do haly.' },
  { name: 'Imperia fitness', city: 'Trenčín', x: 32.0, y: 37.3,
    address: 'Bratislavská 6688, 911 05 Trenčín',
    hours: 'Po – Pi 6:00 – 22:00 · So – Ne 8:00 – 20:00',
    note: 'Chladnička hneď vedľa turniketu.' },
  { name: 'City Gym', city: 'Košice', x: 68.8, y: 44.0,
    address: 'Štúrova 27, 040 01 Košice',
    hours: 'Po – Pi 6:00 – 22:00 · So – Ne 9:00 – 20:00',
    note: 'Rozvoz sem chodí v nedeľu a v stredu večer.' },
  { name: 'Fit Factory', city: 'Liptovský Mikuláš', x: 52.0, y: 29.5,
    address: 'Kamenné pole 4554, 031 01 Liptovský Mikuláš',
    hours: 'Po – Pi 6:00 – 21:30 · So 9:00 – 19:00',
    note: 'Vyzdvihnutie na recepcii fitka.' },
  { name: 'Riecky fitness', city: 'Kysucké Nové Mesto', x: 39.0, y: 20.8,
    address: 'Belanského 2725, 024 01 Kysucké Nové Mesto',
    hours: 'Po – Pi 7:00 – 21:00 · So 9:00 – 13:00',
    note: 'Chladnička je pri šatniach.' },
  { name: 'Olympia fit', city: 'Ilava', x: 33.5, y: 34.7,
    address: 'Mierové námestie 81, 019 01 Ilava',
    hours: 'Po – Pi 7:00 – 21:00 · So 9:00 – 12:00',
    note: 'Odber cez recepciu, parkovanie pred budovou.' },
  { name: 'Pro Fitness LK', city: 'Čadca', x: 38.0, y: 18.5,
    address: 'Palárikova 966, 022 01 Čadca',
    hours: 'Po – Pi 6:30 – 21:00 · So 9:00 – 14:00',
    note: 'Krabičky pripravené v chladničke pri vstupe.' },
  { name: 'Life Studio Gym', city: 'Žilina', x: 39.5, y: 24.1,
    address: 'Vysokoškolákov 8556, 010 08 Žilina',
    hours: 'Po – Pi 6:00 – 22:00 · So – Ne 8:00 – 20:00',
    note: 'Najbližšie k našej kuchyni na Hlinskej.' },
  { name: 'Big Fitness', city: 'Martin', x: 41.8, y: 30.3,
    address: 'Jilemnického 3, 036 01 Martin',
    hours: 'Po – Pi 6:00 – 21:30 · So 9:00 – 18:00',
    note: 'Chladnička hneď za dverami vpravo.' }
];

/* Primary navigation: 7 items. Everything retired from the old third bar
   lives in the mega-menu aside — regrouped, never removed. */
const navItems = [
  { id: 'programy', href: 'programy.html', label: 'Krabičky', mega: true },
  { id: 'ako-to-funguje', href: 'ako-to-funguje.html', label: 'Ako to funguje' },
  { id: 'ako-vybrat-program', href: 'ako-vybrat-program.html', label: 'Ako vybrať program' },
  { id: 'cennik', href: 'programy.html#cennik', label: 'Cenník' },
  { id: 'o-nas', href: 'o-nas.html', label: 'O nás' },
  { id: 'faq', href: 'faq.html', label: 'Časté otázky' },
  { id: 'kontakt', href: 'kontakt.html', label: 'Kontakt' }
];

const megaAside = [
  { href: 'ako-vybrat-program.html', label: 'Ako vybrať program?' },
  { href: 'programy.html#jedalnicek', label: 'Vzorový jedálniček' },
  { href: 'kontakt.html#contact-form', label: 'Nutričné poradenstvo' },
  { href: 'programy.html#poukazy', label: '🎁 Darčekové poukážky' },
  { href: 'ako-to-funguje.html#rozvoz', label: 'Rozvoz a odberné miesta' },
  { href: 'o-nas.html#referencie', label: 'Referencie' }
];

function header(active) {
  const nav = navItems.map(item => {
    const current = item.id === active ? ' aria-current="page"' : '';
    if (!item.mega) {
      return `          <li><a class="nav__link" href="${item.href}"${current}>${item.label}</a></li>`;
    }
    return `          <li>
            <a class="nav__link" href="${item.href}"${current}>${item.label}${icon.caret}</a>
            <div class="nav__panel">
              <div>
                <p class="label label--gold">Naša ponuka</p>
                <ul class="nav__progs">
                  <li class="nav__promo">
                    <a href="${maxNutrition.href}"${active === 'max-nutrition' ? ' aria-current="page"' : ''}>
                      <span class="nav__promo-text">
                        <span class="nav__promo-tag">${maxNutrition.eyebrow}</span>
                        <b>${maxNutrition.name}</b>
                        <span class="nav__promo-sub">${maxNutrition.short}</span>
                      </span>
                      <span class="nav__promo-go" aria-hidden="true">${icon.arrow}</span>
                    </a>
                  </li>
${programs.map(p => `                  <li><a href="program.html?program=${p.slug}" style="--g1:${p.g1};--g2:${p.g2}">${p.name}<span>${p.kcal} kcal · ${p.meals} jedál</span></a></li>`).join('\n')}
                </ul>
              </div>
              <div class="nav__aside">
                <p class="label">Pomôžeme vám vybrať</p>
                <ul>
${megaAside.map(a => `                  <li><a href="${a.href}">${a.label}</a></li>`).join('\n')}
                </ul>
              </div>
            </div>
          </li>`;
  }).join('\n');

  return `  <a class="skip" href="#main">Preskočiť na obsah</a>

  <div class="utilbar">
    <div class="container utilbar__inner">
      <ul class="utilbar__claims">
        <li>${icon.check}Pravidelne</li>
        <li>${icon.check}Zdravo</li>
        <li>${icon.check}Chutne</li>
      </ul>
      <div class="utilbar__contact">
        <a href="tel:+421904264951">${icon.phone}<span>+421 904 264 951</span></a>
        <a href="mailto:topstrava.info@gmail.com">${icon.mail}<span>topstrava.info@gmail.com</span></a>
      </div>
    </div>
  </div>

  <header class="masthead">
    <div class="container masthead__inner">
      <a class="masthead__logo" href="index.html" aria-label="TopStrava — domov">
        <img src="${img('logo')}" alt="TopStrava" width="118" height="46">
      </a>

      <nav class="nav" id="nav" aria-label="Hlavná navigácia">
        <ul class="nav__list">
${nav}
        </ul>
      </nav>

      <div class="masthead__actions">
        <button class="icon-btn nav-toggle" type="button" aria-expanded="false"
                aria-controls="nav" aria-label="Otvoriť menu">${icon.menu}</button>
        <a class="icon-btn" href="kontakt.html" aria-label="Môj účet">${icon.user}</a>
        <a class="icon-btn" href="dokoncenie-objednavky.html" aria-label="Košík, 2 položky">
          ${icon.cart}<span class="cart-count">2</span>
        </a>
        <a class="btn btn--primary masthead__cta" href="programy.html">
          ${icon.cart}<span>Objednať krabičky</span>
        </a>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div>
          <div class="footer__logo"><img src="${img('logo')}" alt="TopStrava" width="132" height="52"></div>
          <p>Krabičková strava pripravená na mieru. Pravidelne, zdravo a chutne — už od roku 2024.</p>
        </div>
        <div>
          <h3>Krabičky</h3>
          <ul>
${programs.slice(0, 6).map(p => `            <li><a href="program.html?program=${p.slug}">${p.name}</a></li>`).join('\n')}
            <li><a href="programy.html">Všetky programy</a></li>
            <li><a href="${maxNutrition.href}">${maxNutrition.name}</a></li>
          </ul>
        </div>
        <div>
          <h3>Informácie</h3>
          <ul>
            <li><a href="ako-to-funguje.html">Ako to funguje</a></li>
            <li><a href="ako-vybrat-program.html">Ako vybrať program</a></li>
            <li><a href="programy.html#cennik">Cenník</a></li>
            <li><a href="ako-to-funguje.html#rozvoz">Rozvoz a doprava</a></li>
            <li><a href="faq.html">Časté otázky</a></li>
            <li><a href="o-nas.html">O nás</a></li>
          </ul>
        </div>
        <div>
          <h3>Kontakt</h3>
          <address>
            <a href="tel:+421904264951">+421 904 264 951</a><br>
            <a href="mailto:topstrava.info@gmail.com">topstrava.info@gmail.com</a><br><br>
            <strong style="color:#fff">Kuchyňa Žilina</strong><br>
            Hlinská 2592/14<br>
            010 01 Žilina
          </address>
        </div>
      </div>
      <div class="footer__pay">
        <h3>Možnosti platby</h3>
        <ul class="pay">
${payMethods.map(m => {
  const tag = `<img src="${img('pay/' + m.file)}" alt="${m.label}" loading="lazy">`;
  /* The Visa mark doubles as the way into the design document. Sighted
     visitors just see a payment logo. The aria-label keeps it honest for
     anyone on a screen reader, who would otherwise be told the link goes
     to "Visa" and end up somewhere else entirely. */
  return m.doc
    ? `          <li><a class="pay__doc" href="${UI_DIRECTION_URL}" aria-label="Vizuálny smer a UI dokumentácia">${tag}</a></li>`
    : `          <li>${tag}</li>`;
}).join('\n')}
        </ul>
      </div>
      <div class="footer__bottom">
        <p>© <span data-year>2026</span> TopStrava. Všetky práva vyhradené.</p>
        <p>Obchodné podmienky · Spracovanie osobných údajov · Mapa stránok</p>
        <p class="footer__credit">
          <span>by</span>
          <a href="https://www.impnet.cz/" target="_blank" rel="noopener noreferrer">
            <img src="${img('IMPnet-logo-white-monochrome_horizontal')}" alt="IMPnet" loading="lazy" width="59" height="16">
          </a>
        </p>
      </div>
    </div>
  </footer>`;
}

/* Reusable sections shared by several pages. */
function bandDelivery() {
  return `  <section class="band" id="rozvoz">
    <div class="band__bg"><img src="${img('band-food')}" alt="" aria-hidden="true"></div>
    <div class="container band__inner on-dark">
      <p class="label" style="color:var(--gold)">Rozvoz</p>
      <h2>Chcete vedieť, kam rozvážame naše krabičky?</h2>
      <p>Overte si, či rozvážame aj k vám — chutné krabičky doručíme priamo až domov.</p>
      <ul>
        <li>${icon.check}Skontrolujte dostupnosť vo vašej oblasti</li>
        <li>${icon.check}Pravidelný rozvoz až k vašim dverám</li>
        <li>${icon.check}Čerstvé krabičky pripravené na mieru</li>
      </ul>
      <div class="cluster">
        <a class="btn btn--primary" href="ako-to-funguje.html#rozvoz">Chcem vedieť viac</a>
        <a class="btn btn--secondary" href="kontakt.html">Opýtať sa na moju adresu</a>
      </div>
    </div>
  </section>`;
}

function sectionPrograms(limit) {
  const list = limit ? programs.slice(0, limit) : programs;
  return `  <section class="section">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Krabičky podľa vášho gusta</p>
        <h2>Vyberte si svoj obľúbený program</h2>
        <p>Deväť jedálničkov od 1 200 do 2 500 kcal. Každý na 5 pracovných dní, pripravený čerstvo a doručený deň vopred.</p>
      </div>
      <div class="grid grid--programs">
${list.map(p => programCard(p)).join('\n')}
      </div>
      ${limit ? `<div class="cluster" style="margin-top:32px">
        <a class="btn btn--secondary" href="programy.html">Zobraziť všetkých 9 programov</a>
      </div>` : ''}
    </div>
  </section>`;
}

/* Full-bleed strip of real kitchen photography, sitting straight under the
   hero. The client asked for a site carrying more pictures of the actual food;
   this is the cheapest place to put a lot of them without pushing the page
   structure around. Scrolls horizontally rather than stacking, so it costs one
   band of height no matter how many photos go in. */
const galleryShots = [
  { img: 'real-foto/kura-kurkumove-rizoto', alt: 'Kurací steak s kurkumovou ryžou' },
  { img: 'real-foto/hovadzie-brusnice', alt: 'Hovädzie na smotane s brusnicami' },
  { img: 'real-foto/kura-cviklove-rizoto', alt: 'Kuracie prsia s cviklovým rizotom' },
  { img: 'real-foto/krevety-hraskove-pyre', alt: 'Krevety s hráškovým pyré' },
  { img: 'real-foto/kuracie-stehno-kapusta', alt: 'Pečené kuracie stehno s červenou kapustou' },
  { img: 'real-foto/ranajkovy-box', alt: 'Raňajkový box so šunkou a vajcom' },
  { img: 'real-foto/hovadzie-kuskus-fazulky', alt: 'Hovädzie s kuskusom a fazuľkami' },
  { img: 'real-foto/kura-slanina-fazulky', alt: 'Kuracie so slaninovými fazuľkami' },
  { img: 'real-foto/makovnik-visne', alt: 'Makovník s višňami' },
  { img: 'real-foto/kuchyna-vydaj', alt: 'Výdaj krabičiek v našej kuchyni' },
  { img: 'real-foto/knedlicky-jahody', alt: 'Tvarohové knedličky s jahodovou omáčkou' },
  { img: 'real-foto/kura-ryzove-rezance', alt: 'Kuracie s ryžovými rezancami' }
];

function sectionGallery() {
  return `  <section class="gallery" aria-label="Galéria jedál">
    <ul class="gallery__strip">
${galleryShots.map(s => `      <li><img src="${img(s.img)}" alt="${s.alt}" loading="lazy" width="600" height="450"></li>`).join('\n')}
    </ul>
  </section>`;
}

/* ---------------------------------------------------------------------------
   GOOGLE REVIEWS — PROTOTYPE CONTENT, NOT REAL REVIEWS.

   Every name, rating, date and quote below is invented, so the client can see
   the layout. Nothing here came from the Google Business Profile.

   Before this goes anywhere public it MUST be replaced with the real feed:
   publishing invented reviews under the Google mark is a misleading commercial
   practice under the EU Omnibus rules, quite apart from Google's own terms.
   The site is static, so the real feed needs either a server-side fetch of the
   Places API (the key cannot sit in client code) or a licensed widget — the
   constraint flagged with client point 4.
   --------------------------------------------------------------------------- */
const googleReviews = {
  rating: 4.9,
  count: 187,
  profileUrl: 'https://www.google.com/maps',
  /* `photo` is optional — a reviewer without one falls back to an initial in
     a tinted circle. Only three portraits exist, so the fourth uses that. */
  items: [
    { name: 'Zuzana K.', when: 'pred 2 týždňami', stars: 5, photo: 'profile_pics/zuzana',
      text: 'Objednávam už pol roka a stále ma to baví. Jedlá sú chutné, ' +
            'porcie sedia a rozvoz chodí presne. Konečne neriešim, čo budem variť.' },
    { name: 'Martin H.', when: 'pred mesiacom', stars: 5, photo: 'profile_pics/martin',
      text: 'Pracujem na zmeny a toto mi vyriešilo obedy aj večere. Krabičky ' +
            'vydržia čerstvé a chuťovo je to úplne inde než konkurencia.' },
    { name: 'Peter B.', when: 'pred 3 týždňami', stars: 5, photo: 'profile_pics/peter',
      text: 'Beriem Max energy pri naberaní. Oceňujem, že si viem vyradiť ' +
            'potraviny, ktoré nejem, a že je všetko navážené.' },
    { name: 'Lucia M.', when: 'pred 2 mesiacmi', stars: 4,
      text: 'Veľmi spokojná s jedlom aj s prístupom. Jedinú hviezdičku ' +
            'uberám za to, že vo väčšom meste by som privítala viac odberných miest.' }
  ]
};

function starRow(n) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="gstar${i < n ? ' is-on' : ''}">${icon.star}</span>`).join('');
}

/* Homepage section. Kept visually quiet — the point is the reviews, and a
   Google-coloured block would fight everything around it. */
function sectionReviews() {
  const g = googleReviews;
  return `  <section class="section section--tint" id="recenzie">
    <div class="container">
      <div class="reviews__head">
        <div>
          <p class="label label--gold">Referencie</p>
          <h2>Čo o nás hovoria zákazníci</h2>
        </div>
        <div class="gbadge">
          <img class="gbadge__logo" src="${img('google-logo')}" alt="Google" width="80" height="27" loading="lazy">
          <div class="gbadge__score">
            <b>${String(g.rating).replace('.', ',')}</b>
            <span class="gbadge__stars" aria-hidden="true">${starRow(5)}</span>
          </div>
          <p class="gbadge__count">${g.count} hodnotení</p>
        </div>
      </div>

      <ul class="reviews">
${g.items.map(r => `        <li class="review">
          <div class="review__top">
            ${r.photo
              ? `<img class="review__avatar review__avatar--photo" src="${img(r.photo)}" alt="" loading="lazy" width="38" height="38">`
              : `<span class="review__avatar" aria-hidden="true">${r.name.charAt(0)}</span>`}
            <div>
              <b>${r.name}</b>
              <span>${r.when}</span>
            </div>
          </div>
          <p class="review__stars" aria-label="${r.stars} z 5 hviezdičiek">${starRow(r.stars)}</p>
          <p class="review__text">${r.text}</p>
        </li>`).join('\n')}
      </ul>

      <div class="cluster" style="margin-top:30px">
        <a class="btn btn--secondary" href="${g.profileUrl}" target="_blank" rel="noopener noreferrer">
          Všetky hodnotenia na Google ${icon.arrow}
        </a>
      </div>
    </div>
  </section>`;
}

/* ---------------------------------------------------------------------------
   Pickup-point map.

   A STATIC SCREENSHOT with pins positioned on top, standing in for the real
   embedded Google map. That is deliberate: the live map needs a Maps
   JavaScript API key, which cannot sit in client code on a static site, so it
   waits for the backend — the constraint flagged with client point 5.

   The swap is contained: the <img> and the percentage-positioned buttons go,
   markers take lat/lng, and everything inside .pinpop stays as it is, because
   Google's InfoWindow takes arbitrary HTML.
   --------------------------------------------------------------------------- */
function sectionPickupMap() {
  return `  <section class="section" id="odberne-miesta">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Odberné miesta</p>
        <h2>Kde si môžete krabičky vyzdvihnúť</h2>
        <p>Dvanásť partnerských miest po celom Slovensku. Kliknite na značku a uvidíte adresu, otváracie hodiny aj to, kde presne je chladnička.</p>
      </div>

      <div class="pinmap" data-pinmap>
        <img class="pinmap__img" src="${img('mapa_svk')}" alt="Mapa odberných miest TopStravy na Slovensku" loading="lazy" width="2418" height="1045">
${pickupPoints.map((p, i) => `        <button class="pin" type="button" style="--x:${p.x}%;--y:${p.y}%"
                data-pin="${i}" aria-expanded="false" aria-controls="pinpop-${i}">
          <span class="pin__dot" aria-hidden="true">${icon.pin}</span>
          <span class="sr-only">${p.name}, ${p.city}</span>
        </button>
        <div class="pinpop" id="pinpop-${i}" data-pop="${i}" hidden>
          <button class="pinpop__x" type="button" data-pin-close aria-label="Zavrieť">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
          <p class="pinpop__city">${p.city}</p>
          <h3 class="pinpop__name">${p.name}</h3>
          <dl class="pinpop__rows">
            <div><dt>${icon.pin}<span class="sr-only">Adresa</span></dt><dd>${p.address}</dd></div>
            <div><dt>${icon.clock}<span class="sr-only">Otváracie hodiny</span></dt><dd>${p.hours}</dd></div>
            <div><dt>${icon.info}<span class="sr-only">Poznámka</span></dt><dd>${p.note}</dd></div>
          </dl>
          <a class="pinpop__nav" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(p.name + ' ' + p.address)}"
             target="_blank" rel="noopener noreferrer">Navigovať ${icon.arrow}</a>
        </div>`).join('\n')}
      </div>

      <p class="form-note" style="margin-top:14px">Rozvoz na adresu funguje do 13 miest. Osobný odber v našej kuchyni na Hlinskej v Žiline je zadarmo.</p>
    </div>
  </section>`;
}

/* Homepage teaser. Deliberately dark: the nine box programs above it sit on
   light cards, so the only way this reads as a separate line rather than a
   tenth program is to change the ground under it. The clip runs full-bleed
   behind everything, which is why the text column carries its own scrim —
   white on raw video is not readable. */
function sectionMaxNutrition() {
  const m = maxNutrition;
  return `  <section class="maxn" id="max-nutrition">
${videoBg('reel-3', m.photoTeaser)}
    <div class="container">
      <div class="maxn__grid on-dark">
        <div class="maxn__body">
          <p class="label maxn__eyebrow">${m.eyebrow}</p>
          <h2 class="maxn__title">${m.name}</h2>
          <p class="maxn__lede">${m.lede}</p>
          <ul class="maxn__sizes">
${m.sizes.map(s => `            <li><b>${s.code}</b><span>${s.desc}</span></li>`).join('\n')}
          </ul>
          <div class="cluster">
            <a class="btn btn--primary btn--lg" href="${m.href}">Zobraziť MAX NUTRITION</a>
            <a class="btn btn--secondary btn--lg" href="kontakt.html#contact-form">Opýtať sa na program</a>
          </div>
          <p class="maxn__note">${icon.truck}<span>Rozvoz <strong>3× týždenne</strong> — ${m.days.join(', ').toLowerCase()}.</span></p>
        </div>
      </div>
    </div>
  </section>`;
}

/* Program card.

   Its own component rather than a .card variant: nothing of the shared card
   survives here — no white body, no 16:10 media well, and above all no
   `overflow:hidden`, because the whole point is that the silhouette's head
   breaks out over the top edge. Bending .card into this would have meant
   unpicking the four other places that rely on it clipping.

   Layering, back to front: .pcard__plate (gradient + watermark, the only
   part that clips) → figure → food → badges and copy.

   MEAL_SLOTS is 5 because that is the largest program; a 3-meal program
   shows three filled boxes and two empty ones, so the badges stay
   comparable at a glance instead of just being shorter. */
const MEAL_SLOTS = 5;

function programCard(p) {
  const boxes = Array.from({ length: MEAL_SLOTS }, (_, i) =>
    `<span class="pcard__box${i < p.meals ? ' is-on' : ''}">${icon.mealBox}</span>`).join('');
  /* Watermark: the calorie figure tiled behind the artwork.

     Emitted as explicit non-wrapping ROWS rather than one wrapping
     paragraph. Wrapped text breaks where it happens to fit, which left a
     ragged gap down the right-hand side of every card; rows that deliberately
     overrun the width get clipped by the plate instead, so the pattern reaches
     both edges. Odd rows are offset, so the columns do not line up in a grid. */
  const wmRow = (p.kcal + ' ').repeat(5);
  const wm = Array.from({ length: 9 }, (_, i) =>
    `<span${i % 2 ? ' class="is-off"' : ''}>${wmRow}</span>`).join('');

  return `        <a class="pcard" href="program.html?program=${p.slug}" id="${p.slug}"
           style="--g1:${p.g1};--g2:${p.g2}">
          <span class="pcard__plate" aria-hidden="true"><span class="pcard__wm">${wm}</span></span>
          <div class="pcard__art">
            <img class="pcard__figure${p.figure === 'zena+muz' ? ' pcard__figure--pair' : ''}" src="${img('programy_karty/' + p.figure)}" alt="" aria-hidden="true" loading="lazy">
            <img class="pcard__food" src="${img('programy_karty/' + p.art)}" alt="${p.name} — ukážka jedál" loading="lazy">
            <p class="pcard__meals"><b>${p.meals} ×</b><span class="pcard__boxes">${boxes}</span></p>
            <p class="pcard__kcal">${p.kcal} kcal</p>
          </div>
          <div class="pcard__body">
            <h3 class="pcard__title">${p.name}</h3>
            <p class="pcard__text">${p.desc}</p>
            <div class="pcard__foot">
              <p class="pcard__price"><b>${p.price}</b><span>/ týždeň s DPH</span></p>
              <span class="pcard__cta">Viac o programu ${icon.arrow}</span>
            </div>
          </div>
        </a>`;
}

/* `css` and `js` carry extra bundles for pages that need them, so the other
   pages never download the program configurator. */
function page({ title, description, active, body, css = [], js = [], bodyEnd = '' }) {
  return `<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="preload" href="assets/fonts/epilogue-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/epilogue-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css?v=${VERSION}">
${css.map(f => `<link rel="stylesheet" href="assets/css/${f}?v=${VERSION}">`).join('\n')}
</head>
<body>
${header(active)}

<main id="main">
${body}
</main>

${footer()}
${bodyEnd}
<script src="assets/js/site.js?v=${VERSION}"></script>
${js.map(f => `<script src="assets/js/${f}?v=${VERSION}"></script>`).join('\n')}
</body>
</html>
`;
}

/* Payment methods accepted at checkout. */
const payMethods = [
  { file: 'visa', label: 'Visa', doc: true },
  { file: 'mastercard', label: 'Mastercard' },
  { file: 'applepay', label: 'Apple Pay' },
  { file: 'gpay', label: 'Google Pay' },
  { file: 'thepay', label: 'ThePay' }
];

function newsletter() {
  return `  <section class="newsletter gradient-warm">
    <div class="container">
      <div class="newsletter__grid">
        <div>
          <h2>Novinky od TopStravy</h2>
          <p>Chcete získať informácie o nových jedlách a jedálničkoch? Píšeme len keď máme čo povedať.</p>
        </div>
        <form class="newsletter__form" novalidate>
          <div class="newsletter__row">
            <label class="sr-only" for="nl-mail">E-mail</label>
            <input id="nl-mail" name="email" type="email" placeholder="Zadajte váš e-mail" autocomplete="email" required>
            <button class="btn" type="submit">Prihlásiť sa</button>
          </div>
          <label class="check">
            <input type="checkbox" name="nl-gdpr" required>
            <span>Súhlasím so <a href="#">spracovaním osobných údajov</a></span>
          </label>
        </form>
      </div>
    </div>
  </section>`;
}

/* The hero's vertical Instagram player. */
function reelsSlider() {
  return `        <div class="reels" data-reels tabindex="-1">
          <div class="reels__frame">
            <div class="reels__bars" aria-hidden="true"></div>
${reels.map((r, i) => `            <article class="reel${i === 0 ? ' is-active' : ''}" data-src="assets/video/${r.file}"
                     aria-label="${r.tag}: ${r.title}"${i === 0 ? '' : ' aria-hidden="true"'}>
              <img class="reel__poster" src="${img(r.poster)}" alt="" loading="${i === 0 ? 'eager' : 'lazy'}" width="1080" height="1920">
              <video class="reel__video" muted playsinline preload="none" poster="${img(r.poster)}"></video>
              <div class="reel__caption"><b>${r.title}</b><span>${r.tag}</span></div>
            </article>`).join('\n')}
            <button class="reels__nav reels__nav--prev" type="button" data-reels-prev aria-label="Predchádzajúce video">${icon.chevronLeft}</button>
            <button class="reels__nav reels__nav--next" type="button" data-reels-next aria-label="Ďalšie video">${icon.chevron}</button>
            <button class="reels__sound" type="button" data-reels-sound aria-pressed="false" aria-label="Zapnúť zvuk">
              <span data-icon-muted>${icon.soundOff}</span>
              <span data-icon-loud hidden>${icon.soundOn}</span>
            </button>
          </div>
          <a class="reels__cta" href="https://www.instagram.com/topstrava/" target="_blank" rel="noopener noreferrer">
            ${icon.instagram}@topstrava<span>· celý profil</span>
          </a>
        </div>`;
}

module.exports = {
  icon, programs, deliveryCities, pickupPoints, reels, maxNutrition,
  maxCourses, maxMeals, MAX_SIZES,
  page, bandDelivery, sectionPrograms, programCard, reelsSlider,
  sectionMaxNutrition, sectionReviews, googleReviews, sectionPickupMap, sectionGallery,
  img, imageWarnings, imageIndex, newsletter, payMethods, videoBg
};
