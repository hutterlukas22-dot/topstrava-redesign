const L = require('./layout');
const { icon, maxNutrition: M } = L;

/* ===========================================================================
   MAX NUTRITION — the à-la-carte line.

   Kept in its own module because it is the one page that does not describe a
   weekly box: no calorie program, no five-day cycle, no configurator. The
   facts here (portion sizes, the three delivery days, the four signature
   dishes) come from topstrava.sk/max-nutrition. That page publishes no prices
   and no per-meal calorie values, so neither does this one — the ordering CTA
   goes to the contact form rather than inventing a checkout that has nothing
   behind it.
   =========================================================================== */

const maxNutritionPage = {
  file: 'max-nutrition.html',
  active: 'max-nutrition',
  title: 'MAX NUTRITION — obedy a večere aj pre profesionálnych športovcov | TopStrava',
  description: 'Nutrične vyvážené obedy a večere v troch veľkostiach porcií M, L a XL. ' +
               'Rozvoz 3× týždenne — v nedeľu, utorok a štvrtok.',
  body: `  <section class="hero">
    <div class="container">
      <ul class="breadcrumb">
        <li><a href="index.html">Domov</a></li>
        <li>${icon.chevron}</li>
        <li><a href="programy.html">Krabičky</a></li>
        <li>${icon.chevron}</li>
        <li>MAX NUTRITION</li>
      </ul>
    </div>
    <div class="container hero__grid on-dark">
      <div>
        <p class="label">${M.eyebrow}</p>
        <h1>MAX NUTRITION — aj pre profesionálnych športovcov</h1>
        <p class="hero__lede">${M.claim}. Obedy a večere navrhnuté tak, aby pokryli všetky nutričné potreby — vy si vyberáte jedlá aj veľkosť porcie.</p>
        <div class="hero__actions">
          <a class="btn btn--primary btn--lg" href="kontakt.html#contact-form">${icon.cart}Mám záujem o program</a>
          <a class="btn btn--secondary btn--lg" href="#jedla">Pozrieť jedlá</a>
        </div>
        <div class="hero__proof">
          <div><b>2</b><span>chody denne</span></div>
          <div><b>3</b><span>veľkosti porcií</span></div>
          <div><b>3×</b><span>rozvoz týždenne</span></div>
          <div><b>72 h</b><span>garancia čerstvosti</span></div>
        </div>
      </div>
      <div class="hero__media">
        <img src="${L.img(M.photoHero)}" alt="Jedlo z programu MAX NUTRITION" width="800" height="600">
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="split">
        <div>
          <p class="label label--gold">Čo to je</p>
          <h2>Nutrične vyvážené jedlá pre každého, kto to myslí vážne</h2>
          <p>MAX NUTRITION nie je týždenný balík krabičiek. Sú to <strong>obedy a večere</strong>, ktoré si skladáte sami — vyberiete si konkrétne jedlá aj veľkosť porcie a my ich pripravíme a dovezieme.</p>
          <p>Zloženie každého jedla je navrhnuté tak, aby pokrylo všetky nutričné potreby — vrátane tých, ktoré má profesionálny športovec. Rovnaká kuchyňa, rovnaké suroviny a rovnaké šokové schladenie ako pri našich týždenných programoch.</p>
          <ul class="steps" style="margin-top:26px">
            <li>
              <span class="steps__n">1</span>
              <div><b>Vyberiete si jedlá</b><p>Z aktuálnej ponuky obedov a večerí.</p></div>
            </li>
            <li>
              <span class="steps__n">2</span>
              <div><b>Zvolíte veľkosť porcie</b><p>M, L alebo XL — podľa vášho energetického výdaja.</p></div>
            </li>
            <li>
              <span class="steps__n">3</span>
              <div><b>Dovezieme vám ich</b><p>Trikrát do týždňa, v nedeľu, utorok a štvrtok.</p></div>
            </li>
          </ul>
        </div>
        <div class="split__media">
          <img src="${L.img(M.photoWide)}" alt="Pripravené jedlá MAX NUTRITION" loading="lazy" width="800" height="600">
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tint" id="velkosti">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Veľkosti porcií</p>
        <h2>Jedno menu, tri veľkosti</h2>
        <p>To isté jedlo v troch gramážach. Nemeníte program, keď sa zmení váš tréningový objem — meníte len veľkosť.</p>
      </div>
      <div class="grid grid--3">
${M.sizes.map(s => `        <div class="card card--tint">
          <div class="card__body">
            <span class="card__step card__step--size">${s.code}</span>
            <h3 class="card__title">Veľkosť ${s.code}</h3>
            <p class="card__text">${s.desc}</p>
          </div>
        </div>`).join('\n')}
      </div>
      <div class="notice" style="margin-top:32px;max-width:70ch">
        ${icon.info}
        <span>Neviete, ktorá veľkosť je tá vaša? Napíšte nám a prejdeme to spolu — alebo si najprv spočítajte svoj denný príjem v <a href="ako-vybrat-program.html">kalorickej kalkulačke</a>.</span>
      </div>
    </div>
  </section>

  <section class="section" id="jedla">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Ukážka jedál</p>
        <h2>Čo v ponuke nájdete</h2>
        <p>Ponuka sa mení. Toto je výber jedál, ktoré sa v programe objavujú pravidelne.</p>
      </div>
      <div class="grid grid--2">
${M.meals.map(m => `        <div class="card card--tint">
          <div class="card__body">
            <span class="card__icon">${icon.box}</span>
            <p class="card__meta"><span class="hi">Obed alebo večera</span><span class="dot"></span>M / L / XL</p>
            <h3 class="card__title">${m}</h3>
          </div>
        </div>`).join('\n')}
      </div>
      <div class="notice" style="margin-top:32px;max-width:70ch">
        ${icon.info}
        <span>Aktuálnu ponuku jedál na najbližší rozvoz vám radi pošleme — <a href="kontakt.html#contact-form">napíšte nám</a> alebo zavolajte na <a href="tel:+421904264951">+421 904 264 951</a>.</span>
      </div>
    </div>
  </section>

  <section class="section section--tint" id="rozvoz-max">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Rozvoz</p>
        <h2>Rozvoz 3× týždenne</h2>
        <p>MAX NUTRITION nemá päťdňový cyklus ako týždenné programy. Vozíme ho v troch dňoch a vždy čerstvo pripravený.</p>
      </div>

      <div class="grid grid--3">
${M.days.map(d => `        <div class="card card--flat">
          <div class="card__body">
            <span class="card__icon">${icon.truck}</span>
            <h3 class="card__title">${d}</h3>
            <p class="card__text">Doručenie v čase 14:00 – 21:30, domov alebo na odberné miesto.</p>
          </div>
        </div>`).join('\n')}
      </div>

      <div class="notice" style="margin-top:32px;max-width:70ch">
        ${icon.clock}
        <span>Rozvážame do rovnakých 13 miest a na rovnakých 12 odberných miest ako pri krabičkách. <a href="ako-to-funguje.html#rozvoz">Pozrieť zoznam miest</a>.</span>
      </div>
    </div>
  </section>

  <section class="section" id="porovnanie">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Porovnanie</p>
        <h2>MAX NUTRITION alebo týždenné krabičky?</h2>
        <p>Dve rôzne veci pre dva rôzne režimy. Toto je rozdiel v skratke.</p>
      </div>
      <div class="table-wrap">
        <table>
          <caption class="sr-only">Porovnanie programu MAX NUTRITION s týždennými programami krabičiek</caption>
          <thead>
            <tr><th scope="col">&nbsp;</th><th scope="col">MAX NUTRITION</th><th scope="col">Týždenné krabičky</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">Čo dostanete</th><td>Obedy a večere</td><td>Celý deň — 3 alebo 5 jedál</td></tr>
            <tr><th scope="row">Ako sa vyberá</th><td>Konkrétne jedlá podľa vás</td><td>Hotový jedálniček podľa kalórií</td></tr>
            <tr><th scope="row">Veľkosť</th><td>M / L / XL</td><td>9 programov, 1 200 – 2 500 kcal</td></tr>
            <tr><th scope="row">Rozvoz</th><td class="num">3× týždenne</td><td class="num">5× týždenne (nedeľa – štvrtok)</td></tr>
            <tr><th scope="row">Objednávka</th><td>Podľa výberu jedál</td><td>Minimálne na 5 pracovných dní</td></tr>
            <tr><th scope="row">Pre koho</th><td>Aktívni ľudia a športovci, ktorí si chcú jedlá vyberať</td><td>Kto chce mať celý týždeň vyriešený dopredu</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cluster" style="margin-top:30px">
        <a class="btn btn--primary" href="kontakt.html#contact-form">Mám záujem o MAX NUTRITION</a>
        <a class="btn btn--secondary" href="programy.html">Zobraziť týždenné programy</a>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="band__bg"><img src="${L.img('band-a')}" alt="" aria-hidden="true"></div>
    <div class="container band__inner on-dark">
      <p class="label" style="color:var(--gold)">${M.eyebrow}</p>
      <h2>Chcete MAX NUTRITION vyskúšať?</h2>
      <p>Ozvite sa nám a poradíme vám s veľkosťou porcie aj s výberom jedál.</p>
      <ul>
        <li>${icon.check}Obedy a večere pripravené na mieru</li>
        <li>${icon.check}Tri veľkosti porcií — M, L a XL</li>
        <li>${icon.check}Rozvoz v nedeľu, utorok a štvrtok</li>
      </ul>
      <div class="cluster">
        <a class="btn btn--primary" href="kontakt.html#contact-form">Napísať nám</a>
        <a class="btn btn--secondary" href="tel:+421904264951">${icon.phone}+421 904 264 951</a>
      </div>
    </div>
  </section>

${L.newsletter()}`
};

module.exports = [maxNutritionPage];
