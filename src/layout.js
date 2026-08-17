/* Shared chrome for every page. One source, so the header and footer
   cannot drift apart across the site. */

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
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none"/></svg>'
};

/* Instagram clips shown in the hero.
   `file` is looked for in assets/video/ — drop the real export there and it
   plays. Missing file => the poster shows and the slider advances on a timer.
   Replace `title` with the real caption of each post. */
const reels = [
  { file: 'reel-1.mp4', poster: 'blog4.webp', title: 'Takto vyzerá týždeň krabičiek', tag: 'Jedálniček' },
  { file: 'reel-2.mp4', poster: 'meal6.webp', title: 'Ráno v kuchyni: príprava 5 chodov', tag: 'Zo zákulisia' },
  { file: 'reel-3.mp4', poster: 'meal7.webp', title: 'Šokové schladenie a vákuové balenie', tag: 'Čerstvosť 72 h' },
  { file: 'reel-4.mp4', poster: 'blog1.webp', title: 'Rozvoz až k dverám, deň vopred', tag: 'Rozvoz' },
  { file: 'reel-5.mp4', poster: 'meal9.webp', title: 'Čo dostanete v jednom dni', tag: 'Unboxing' }
];

/* The nine programs — names, calories and prices as published on the live site. */
const programs = [
  { slug: '3-chody-zena', name: '3 chody Žena', kcal: 1200, price: '87,50 €', meals: 3, img: 'meal1.webp',
    desc: 'Praktická voľba pre tých, ktorí preferujú menej jedál denne. Raňajky, obed, večera.' },
  { slug: '3-chody-muz', name: '3 chody Muž', kcal: 1600, price: '98,50 €', meals: 3, img: 'meal2.webp',
    desc: 'Praktická voľba pre tých, ktorí preferujú menej jedál denne. Raňajky, obed, večera.' },
  { slug: 'slim', name: 'Slim', kcal: 1200, price: '94,50 €', meals: 5, img: 'meal3.webp',
    desc: 'Ideálne pre rýchle chudnutie, detox či veľmi nízku fyzickú aktivitu. Vhodné pre drobnejšie postavy alebo ako štart.' },
  { slug: 'slim-plus', name: 'Slim+', kcal: 1400, price: '99,50 €', meals: 5, img: 'meal4.webp',
    desc: 'Častá voľba žien pri redukcii váhy. Pomáha schudnúť bez hladovania, ak je aktivita nízka až stredná.' },
  { slug: 'balance', name: 'Balance', kcal: 1600, price: '104,50 €', meals: 5, img: 'meal5.webp',
    desc: 'Vyvážený program pre ženy s bežným denným pohybom alebo pre mužov, ktorí chcú redukovať váhu.' },
  { slug: 'balance-plus', name: 'Balance+', kcal: 1800, price: '109,50 €', meals: 5, img: 'meal6.webp',
    desc: 'Univerzálny variant pre udržiavanie hmotnosti. Vhodné pre aktívne ženy alebo menej aktívnych mužov.' },
  { slug: 'active-body', name: 'Active body', kcal: 2000, price: '114,50 €', meals: 5, img: 'meal7.webp',
    desc: 'Štandardný príjem pre väčšinu populácie pri bežnom dennom režime. Podporuje stabilnú energiu počas dňa.' },
  { slug: 'active-body-plus', name: 'Active body+', kcal: 2200, price: '119,50 €', meals: 5, img: 'meal8.webp',
    desc: 'Vhodné pre mužov s vyššou fyzickou aktivitou alebo pre ženy s náročnými tréningmi.' },
  { slug: 'max-energy', name: 'Max energy', kcal: 2500, price: '124,50 €', meals: 5, img: 'meal9.webp',
    desc: 'Najvyšší program – ideálny pre športovcov, fyzicky pracujúcich alebo na naberanie svalovej hmoty.' }
];

const deliveryCities = ['Žilina', 'Považská Bystrica', 'Púchov', 'Kysucké Nové Mesto', 'Bytča',
  'Martin', 'Čadca', 'Spišská Nová Ves', 'Levoča', 'Liptovský Mikuláš', 'Poprad', 'Trenčín', 'Košice'];

const pickupPoints = ['Repeat Crossfit Považská Bystrica', 'Zauko Fitness Púchov', 'Mestská Kaviareň Bytča',
  'MM Aréna Krásno Nad Kysucou', 'Imperia fitness Trenčín', 'City Gym Košice', 'Fit Factory Liptovský Mikuláš',
  'Riecky fitness Kysucké Nové Mesto', 'Olympia fit Ilava', 'Pro Fitness LK Čadca', 'Life Studio Gym Žilina',
  'Big Fitness Martin'];

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
${programs.map(p => `                  <li><a href="programy.html#${p.slug}">${p.name}<span>${p.kcal} kcal · ${p.meals} jedál</span></a></li>`).join('\n')}
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
${programs.slice(0, 6).map(p => `            <li><a href="programy.html#${p.slug}">${p.name}</a></li>`).join('\n')}
            <li><a href="programy.html">Všetky programy</a></li>
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
${payMethods.map(m => `          <li><img src="${img('pay/' + m.file)}" alt="${m.label}" loading="lazy"></li>`).join('\n')}
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
  return `  <section class="section has-deco">
${deco('zelenina', 'bl', { w: '330px', o: '.38', y: '-70px', x: '-110px' })}
${deco('kopr', 'tr', { w: '160px', r: '-32deg', y: '10px', x: '-20px' })}
${deco('koriandr', 'l', { w: '130px', r: '24deg', y: '12%', x: '-45px', o: '.5' })}
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Krabičky podľa vášho gusta</p>
        <h2>Vyberte si svoj obľúbený program</h2>
        <p>Deväť jedálničkov od 1 200 do 2 500 kcal. Každý na 5 pracovných dní, pripravený čerstvo a doručený deň vopred.</p>
      </div>
      <div class="grid grid--3">
${list.map(p => programCard(p)).join('\n')}
      </div>
      ${limit ? `<div class="cluster" style="margin-top:32px">
        <a class="btn btn--secondary" href="programy.html">Zobraziť všetkých 9 programov</a>
      </div>` : ''}
    </div>
  </section>`;
}

function programCard(p) {
  return `        <a class="card" href="programy.html#${p.slug}" id="${p.slug}">
          <div class="card__media"><img src="${img(p.img)}" alt="${p.name} — ukážka jedál" loading="lazy" width="600" height="375"></div>
          <div class="card__body">
            <p class="card__meta"><span class="hi">Program</span><span class="dot"></span>${p.kcal} kcal<span class="dot"></span>${p.meals} jedál denne</p>
            <h3 class="card__title">${p.name}</h3>
            <p class="card__text">${p.desc}</p>
            <div class="card__price"><b>${p.price}</b><span>/ týždeň s DPH</span></div>
            <span class="card__cta">Zobraziť program ${icon.arrow}</span>
          </div>
        </a>`;
}

function page({ title, description, active, body }) {
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
</head>
<body>
${header(active)}

<main id="main">
${body}
</main>

${footer()}
<script src="assets/js/site.js?v=${VERSION}"></script>
</body>
</html>
`;
}

/* Blurred herb/vegetable cut-outs, taken from topstrava.sk so the rebuild
   carries the same brand texture. Purely decorative: aria-hidden, never
   focusable, and skipped entirely below 900px via CSS. */
function deco(name, spot, opts = {}) {
  const kind = ['zelenina', 'plody', 'ostruziny', 'papricky'].includes(name) ? 'veg' : 'herb';
  const style = Object.entries(opts)
    .map(([k, v]) => `--deco-${k}:${v}`).join(';');
  return `      <img class="deco deco--${spot} deco--${kind}" src="${img('deco/' + name)}" alt=""` +
         ` aria-hidden="true" loading="lazy"${style ? ` style="${style}"` : ''}>`;
}

/* Payment methods accepted at checkout. */
const payMethods = [
  { file: 'visa', label: 'Visa' },
  { file: 'mastercard', label: 'Mastercard' },
  { file: 'applepay', label: 'Apple Pay' },
  { file: 'gpay', label: 'Google Pay' },
  { file: 'thepay', label: 'ThePay' }
];

function newsletter() {
  return `  <section class="newsletter gradient-warm has-deco">
${deco('kopr', 'tr', { w: '170px', r: '18deg', o: '.5' })}
${deco('polnicek', 'bl', { w: '210px', r: '-8deg', o: '.45' })}
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
  icon, programs, deliveryCities, pickupPoints, reels,
  page, bandDelivery, sectionPrograms, programCard, reelsSlider,
  img, imageWarnings, imageIndex, deco, newsletter, payMethods
};
