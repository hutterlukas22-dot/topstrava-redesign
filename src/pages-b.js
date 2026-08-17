const L = require('./layout');
const { icon, programs, deliveryCities, pickupPoints } = L;

/* ============================ AKO TO FUNGUJE ============================ */
const akoFunguje = {
  file: 'ako-to-funguje.html',
  active: 'ako-to-funguje',
  title: 'Ako to funguje — objednávka, príprava a rozvoz | TopStrava',
  description: 'Od objednávky po doručenie: ako pripravujeme krabičky, kedy rozvážame a ako sa strava skladuje.',
  body: `  <section class="pagetop">
    <div class="container">
      <ul class="breadcrumb">
        <li><a href="index.html">Domov</a></li>
        <li>${icon.chevron}</li>
        <li>Ako to funguje</li>
      </ul>
      <div class="pagetop__inner">
        <h1>Ako to funguje</h1>
        <p class="lede">Objednáte v stredu, v nedeľu varíme a od nedele večera vám vozíme čerstvé jedlo — vždy deň vopred.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="sr-only">Priebeh objednávky</h2>
      <div class="notice" style="margin-bottom:40px;max-width:70ch">
        ${icon.clock}
        <span>Objednávku je potrebné urobiť <strong>najneskôr do stredy 22:00</strong>. Našu TOP stravu je možné objednať vždy minimálne na jeden týždeň, teda 5 pracovných dní nasledujúceho týždňa.</span>
      </div>

      <div class="grid grid--3">
        <div class="card card--tint">
          <div class="card__body">
            <span class="card__step">1</span>
            <h3 class="card__title">Objednávka</h3>
            <p class="card__text">Zákazníci si vopred objednajú stravovací plán na celý týždeň. Výber môže byť prispôsobený podľa preferencií — diéta na chudnutie, naberanie svalov, vegetariánska strava či lactofree verzia.</p>
          </div>
        </div>
        <div class="card card--tint">
          <div class="card__body">
            <span class="card__step">2</span>
            <h3 class="card__title">Príprava jedál</h3>
            <p class="card__text">V nedeľu sú všetky jedlá na nasledujúci týždeň pripravené v našej kuchyni. Jedlá sú šokovo schladzované, čo predlžuje ich čerstvosť až na 72 hodín.</p>
          </div>
        </div>
        <div class="card card--tint">
          <div class="card__body">
            <span class="card__step">3</span>
            <h3 class="card__title">Doručenie deň vopred</h3>
            <p class="card__text">Krabičky rozvážame chladiarenským autom. Každý deň doručíme čerstvo pripravené jedlá na nasledujúci deň, v čase 14:00–21:30.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tint" id="rozvoz">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Rozvrh doručovania</p>
        <h2>Nedeľa až štvrtok, vždy deň vopred</h2>
        <p>Na víkendy sa strava nepripravuje. V nedeľu cyklus začína nanovo.</p>
      </div>

      <div class="table-wrap" style="margin-bottom:34px">
        <table>
          <caption class="sr-only">Rozvrh doručovania krabičkovej stravy</caption>
          <thead>
            <tr><th scope="col">Doručujeme</th><th scope="col">Jedlo je určené na</th><th scope="col">Čas doručenia</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">Nedeľa večer</th><td>Pondelok</td><td class="num">14:00 – 21:30</td></tr>
            <tr><th scope="row">Pondelok večer</th><td>Utorok</td><td class="num">14:00 – 21:30</td></tr>
            <tr><th scope="row">Utorok večer</th><td>Streda</td><td class="num">14:00 – 21:30</td></tr>
            <tr><th scope="row">Streda večer</th><td>Štvrtok</td><td class="num">14:00 – 21:30</td></tr>
            <tr><th scope="row">Štvrtok večer</th><td>Piatok</td><td class="num">14:00 – 21:30</td></tr>
          </tbody>
        </table>
      </div>

      <div class="grid grid--2">
        <div class="card">
          <div class="card__body">
            <span class="card__icon">${icon.truck}</span>
            <p class="card__meta"><span class="hi">Rozvoz na adresu</span><span class="dot"></span>2,10 €/deň</p>
            <h3 class="card__title">Doručíme priamo k vašim dverám</h3>
            <p class="card__text">Výnimka platí pre Košice, Spišskú Novú Ves, Martin, Liptovský Mikuláš a Poprad.</p>
            <ul class="card__taglist">
${deliveryCities.map(c => `              <li>${c}</li>`).join('\n')}
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="card__body">
            <span class="card__icon">${icon.pin}</span>
            <p class="card__meta"><span class="hi">Odberné miesta</span><span class="dot"></span>1,56 €/deň</p>
            <h3 class="card__title">Vyzdvihnite si krabičky cestou domov</h3>
            <p class="card__text">Po vyložení balíčkov do chladničky vás kuriér kontaktuje SMS správou. Osobný odber v kuchyni na Hlinskej v Žiline je zadarmo.</p>
            <ul class="card__taglist">
${pickupPoints.map(c => `              <li>${c}</li>`).join('\n')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="split">
        <div class="prose">
          <p class="label label--gold">Jedlá na celý deň</p>
          <h2 style="margin-bottom:16px">Päť chodov, o ktorých nemusíte premýšľať</h2>
          <p>Typický denný plán päťchodového menu obsahuje raňajky, desiatu, obed, olovrant a večeru. Trojchodové menu obsahuje raňajky, obed a večeru.</p>
          <p>Jedlá sú navrhnuté tak, aby zákazník nemusel nič pripravovať a mal po celý deň zabezpečený príjem vyváženej stravy. Každé jedlo je starostlivo zabalené, označené a pripravené na konzumáciu v určenom čase.</p>
          <h3>Jednoduchosť skladovania</h3>
          <p>Krabičky sú navrhnuté tak, aby boli jednoducho skladovateľné v chladničke a môžu byť určené na ohrievanie v mikrovlnke. Po doručení odporúčame krabičky skladovať v chladničke.</p>
          <div class="cluster" style="margin-top:26px">
            <a class="btn btn--primary" href="programy.html">Vybrať si program</a>
            <a class="btn btn--text" href="faq.html">Časté otázky ${icon.arrow}</a>
          </div>
        </div>
        <div class="split__media"><img src="${L.img('hero-funguje')}" alt="Príprava krabičiek v kuchyni TopStrava" loading="lazy" width="800" height="600"></div>
      </div>
    </div>
  </section>

${L.sectionPrograms(3)}
${L.bandDelivery()}`
};

/* ============================ AKO VYBRAŤ PROGRAM ============================ */
const akoVybrat = {
  file: 'ako-vybrat-program.html',
  active: 'ako-vybrat-program',
  title: 'Ako vybrať program — kalorická kalkulačka | TopStrava',
  description: 'Spočítajte si denný kalorický príjem a nájdite program krabičkovej stravy, ktorý zodpovedá vášmu cieľu.',
  body: `  <section class="pagetop">
    <div class="container">
      <ul class="breadcrumb">
        <li><a href="index.html">Domov</a></li>
        <li>${icon.chevron}</li>
        <li>Ako vybrať program</li>
      </ul>
      <div class="pagetop__inner">
        <h1>Pomôžeme vám vybrať program na mieru</h1>
        <p class="lede">Zadajte svoje údaje a cieľ. Kalkulačka spočíta odporúčaný denný kalorický príjem a rovno vám navrhne vhodný jedálniček.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid grid--calc">
        <form id="calc" novalidate>
          <h2 style="margin-bottom:22px">Vaše údaje</h2>

          <div class="field">
            <span class="label" style="margin-bottom:2px">Pohlavie</span>
            <div class="radio-cards">
              <label class="radio-card"><input type="radio" name="sex" value="f" checked><span>Som žena</span></label>
              <label class="radio-card"><input type="radio" name="sex" value="m"><span>Som muž</span></label>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="age">Vek</label>
              <input class="input" id="age" type="number" min="15" max="99" value="32" inputmode="numeric">
            </div>
            <div class="field">
              <label for="height">Výška (cm)</label>
              <input class="input" id="height" type="number" min="130" max="220" value="170" inputmode="numeric">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="weight">Váha (kg)</label>
              <input class="input" id="weight" type="number" min="35" max="200" value="72" inputmode="numeric">
            </div>
            <div class="field">
              <label for="activity">Vaša aktivita</label>
              <select class="select" id="activity">
                <option value="1.2">Sedavá — bez cvičenia</option>
                <option value="1.375" selected>Ľahká — 1–3× týždenne</option>
                <option value="1.55">Stredná — 3–5× týždenne</option>
                <option value="1.725">Vysoká — 6–7× týždenne</option>
                <option value="1.9">Veľmi vysoká — fyzická práca</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label for="goal">Cieľ</label>
            <select class="select" id="goal">
              <option value="keep">Zdravo sa stravovať / udržať váhu</option>
              <option value="lose" selected>Schudnúť</option>
              <option value="gain">Nabrať svalovú hmotu</option>
            </select>
          </div>

          <p class="form-note">Výpočet používa rovnicu Mifflin–St Jeor. Ide o orientačný odhad — pri zdravotných obmedzeniach sa poraďte s odborníkom.</p>
        </form>

        <aside class="rail" aria-label="Výsledok výpočtu" aria-live="polite">
          <h3>Váš výsledok</h3>
          <div class="rail__line">
            <span>BMI</span>
            <span><strong id="out-bmi" style="font-size:20px">—</strong> <span id="out-bmi-note" style="font-weight:500;color:var(--text-3)"></span></span>
          </div>
          <p class="card__text" id="out-ideal" style="padding:11px 0;border-bottom:1px solid var(--line-soft)">—</p>
          <div class="rail__line"><span>Odporúčané denne</span><span id="out-kcal" style="font-size:19px">—</span></div>
          <div class="rail__line"><span id="out-bmr" style="color:var(--text-3)">—</span><span></span></div>
          <div id="recommendation" class="card card--tint" style="margin-top:20px;box-shadow:none" hidden>
            <div class="card__body" id="out-rec"></div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="section section--tint">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Ako to funguje</p>
        <h2>Tri kroky k správnemu programu</h2>
      </div>
      <div class="grid grid--3">
        <div class="card card--flat">
          <div class="card__body">
            <span class="card__step">1</span>
            <h3 class="card__title">Zadajte svoje údaje</h3>
            <p class="card__text">Vek, pohlavie, váhu, výšku a úroveň fyzickej aktivity.</p>
          </div>
        </div>
        <div class="card card--flat">
          <div class="card__body">
            <span class="card__step">2</span>
            <h3 class="card__title">Zvoľte si cieľ</h3>
            <p class="card__text">Chudnutie, udržiavanie hmotnosti alebo budovanie svalov.</p>
          </div>
        </div>
        <div class="card card--flat">
          <div class="card__body">
            <span class="card__step">3</span>
            <h3 class="card__title">Získajte odporúčanie</h3>
            <p class="card__text">Vyberieme program, ktorý najlepšie zodpovedá vášmu kalorickému cieľu.</p>
          </div>
        </div>
      </div>
      <div class="notice" style="margin-top:30px;max-width:70ch">
        ${icon.info}
        <span>Nie ste si istí? Zavolajte nám na <a href="tel:+421904264951"><strong>+421 904 264 951</strong></a> — výber programu radi skonzultujeme telefonicky alebo mailom.</span>
      </div>
    </div>
  </section>

${L.sectionPrograms()}
${L.bandDelivery()}`
};

/* ============================ O NÁS ============================ */
const oNas = {
  file: 'o-nas.html',
  active: 'o-nas',
  title: 'O nás — príbeh TopStravy | TopStrava',
  description: 'Ako vznikla TopStrava: príbeh trénera Petra Benka a krabičkovej stravy, ktorá rieši najväčšiu prekážku vo fitness — jedlo.',
  body: `  <section class="pagetop">
    <div class="container">
      <ul class="breadcrumb">
        <li><a href="index.html">Domov</a></li>
        <li>${icon.chevron}</li>
        <li>O nás</li>
      </ul>
      <div class="pagetop__inner">
        <h1>O nás</h1>
        <p class="lede">Na základe dlhoročných skúseností sme vytvorili koncept krabičkovej stravy na mieru, ktorá uľahčí dosiahnutie cieľov a spestrí vaše stravovanie.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="split">
        <div class="prose">
          <p class="label label--gold">Príbeh TopStravy</p>
          <h2 style="margin-bottom:16px">Ako vznikla myšlienka krabičkovej revolúcie</h2>
          <p>Predstavte si, že sa každý deň venujete ľuďom, pomáhate im zlepšiť kondíciu vo fitness centre a cítite ich nadšenie. No zároveň sledujete, ako sa im vo výsledkoch často nedarí naplno pretaviť svoje snaženie do vytúženého cieľa.</p>
          <p>Peter Benko, tréner s vášňou pre zdravý životný štýl, si všimol jednu zásadnú vec — <strong>ľudia strácajú nadšenie pre cvičenie a pohyb práve kvôli nesprávnemu stravovaniu.</strong></p>
        </div>
        <div class="split__media"><img src="${L.img('hero-onas')}" alt="Tím TopStrava v kuchyni" loading="lazy" width="800" height="600"></div>
      </div>
    </div>
  </section>

  <section class="section section--tint">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Hlavná prekážka</p>
        <h2>Nie tréning. Strava.</h2>
      </div>
      <div class="grid grid--3">
        <div class="card card--flat">
          <div class="card__body">
            <span class="card__icon">${icon.star}</span>
            <h3 class="card__title">Osobné skúsenosti</h3>
            <p class="card__text">Peter strávil nespočetné hodiny cvičením so svojimi klientmi, rozprával sa s nimi o ich cieľoch, výzvach a prekážkach.</p>
          </div>
        </div>
        <div class="card card--flat">
          <div class="card__body">
            <span class="card__icon">${icon.info}</span>
            <h3 class="card__title">Častý problém</h3>
            <p class="card__text">Klienti nevedeli, čo je pre nich dobré, ako správne kombinovať jedlá alebo jednoducho nemali čas variť.</p>
          </div>
        </div>
        <div class="card card--flat">
          <div class="card__body">
            <span class="card__icon">${icon.clock}</span>
            <h3 class="card__title">Neúspešné pokusy</h3>
            <p class="card__text">Aj keď sa im podarilo pár dní udržať v stravovacom režime, vždy sa vrátili k starým návykom.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="split split--media-first">
        <div class="split__media"><img src="${L.img('band-a')}" alt="Krabičky TopStrava pripravené na rozvoz" loading="lazy" width="800" height="600"></div>
        <div class="prose">
          <p class="label label--gold">Vznik TOPSTRAVA</p>
          <h2 style="margin-bottom:16px">Chutne, zdravo a pravidelne</h2>
          <p>Myšlienka, ktorá zmenila nielen Petrov pohľad na zdravé stravovanie, ale aj tisícok ďalších. Jednoduché a efektívne riešenie pre ľudí, ktorí chcú zdravo jesť bez komplikácií.</p>
          <h3>Prečo práve krabičky?</h3>
          <p>Tím TOPSTRAVA chcel vytvoriť riešenie dostupné pre každého, bez ohľadu na časové možnosti či kulinárske schopnosti. Snažili sme sa priniesť zdravé jedlo priamo k ľuďom — či už do práce, domov alebo po tréningu.</p>
          <p>Krabičky sa stali symbolom praktického riešenia: <strong>žiadne nákupy, varenie, ani výhovorky.</strong> Len kvalitná, chutná a zdravá strava.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--cream" id="referencie">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="label label--gold">Naša vášeň, váš úspech</p>
        <h2>Pridajte sa k nám</h2>
        <p>Objavte, aké ľahké je žiť zdravo, chutne a bez kompromisov.</p>
      </div>
      <div class="grid grid--3">
        <div class="card">
          <div class="card__body">
            <div class="card__stars" aria-label="5 z 5 hviezdičiek">${icon.star.repeat(5)}</div>
            <p class="card__quote">„Schudla som 12 kg a konečne neriešim, čo budem variť. Chuťovo je to úplne inde, než som čakala.“</p>
            <div class="card__who">
              <span class="card__avatar" aria-hidden="true">ZK</span>
              <span><b>Zuzana K.</b><span>Žilina · program Slim+</span></span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card__body">
            <div class="card__stars" aria-label="5 z 5 hviezdičiek">${icon.star.repeat(5)}</div>
            <p class="card__quote">„Pracujem na zmeny a nikdy som nestíhal jesť poriadne. Teraz mám celý deň vyriešený dopredu.“</p>
            <div class="card__who">
              <span class="card__avatar" aria-hidden="true">MH</span>
              <span><b>Martin H.</b><span>Trenčín · program Active body</span></span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card__body">
            <div class="card__stars" aria-label="5 z 5 hviezdičiek">${icon.star.repeat(5)}</div>
            <p class="card__quote">„Naberám svalovú hmotu a Max energy mi presne sadol. Oceňujem, že si viem vyradiť potraviny, ktoré nejem.“</p>
            <div class="card__who">
              <span class="card__avatar" aria-hidden="true">PB</span>
              <span><b>Peter B.</b><span>Košice · program Max energy</span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="cluster" style="justify-content:center;margin-top:34px">
        <a class="btn btn--primary btn--lg" href="programy.html">Vybrať si program</a>
        <a class="btn btn--secondary btn--lg" href="kontakt.html">Opýtať sa nás</a>
      </div>
    </div>
  </section>

${L.bandDelivery()}`
};

/* ============================ FAQ ============================ */
const faqGroups = [
  { id: 'objednavka', name: 'Objednávka', items: [
    ['Ako viem, ktorý program je pre mňa najvhodnejší?', 'Odporúčame využiť kalorickú kalkulačku na našej webovej stránke, ktorá vás navedie. V prípade potreby je možné váš výber konzultovať telefonicky alebo mailom.'],
    ['Ako si môžem krabičky objednať?', 'Krabičky si môžete objednať na našej webovej stránke alebo telefonicky cez nášho operátora, či mailom.'],
    ['Pre koho sú krabičky určené?', 'Krabičky sú určené pre každého, kto sa zaujíma o svoje zdravie. Aj pre tých, ktorí majú záujem vylepšiť svoje stravovacie návyky, schudnúť, udržať váhu zdravým spôsobom, či nabrať svalovú hmotu.']
  ]},
  { id: 'doprava', name: 'Doprava a doručenie', items: [
    ['Akým spôsobom sú krabičky balené a rozvážané?', 'Po uvarení sú krabičky šokovo schladzované a vákuovo zabalené. Takýmto spôsobom je čerstvosť jedál predĺžená na dobu 72 hodín. Následne je strava rozvážaná chladiarenským autom.'],
    ['Ako funguje doručovanie? V aké časy sa doručujú jedlá?', 'Rozvoz prebieha od nedele do štvrtku. Jedlo sa doručuje jeden deň dopredu, v časoch od 14:00 do 21:30.'],
    ['Koľko stojí rozvoz na adresu a koľko na odberné miesto?', 'Osobný odber v našej kuchyni na Hlinskej (budova Junior) v Žiline je zadarmo a krabičky je možné vyzdvihnúť od príchodu SMS do 15:00. Rozvoz na adresu stojí 2,10 €/deň okrem výnimky rozvozu do Košíc, Spišskej Novej Vsi, Martina, Liptovského Mikuláša a Popradu. Rozvoz na odberné miesto stojí 1,56 €/deň okrem výnimky do Martina (Big Fitness) a do Košíc (City Gym).'],
    ['Ako fungujú odberné miesta?', 'Po vyložení balíčkov do chladničky vás bude kontaktovať kuriér SMS správou, kde vám oznámi, že krabičky sú k dispozícii na vyzdvihnutie. Svoj balíček si môžete vyzdvihnúť počas otváracích hodín daných odberných miest.'],
    ['Doručujete jedlo aj cez sviatky?', 'Sviatky, ktoré sú počas pracovného týždňa, doručujeme obvyklým spôsobom. Pokiaľ by nastala zmena, klientov vždy kontaktujeme telefonicky alebo mailom.'],
    ['Máte v pláne dovážať aj do iných miest?', 'V budúcnosti by sme radi naše služby rozšírili aj do iných miest. V prípade záujmu o rozvoz či zriadenie odberného miesta do vášho mesta nás kontaktujte mailom. My následne overíme možnosti rozvozu až k vám.']
  ]},
  { id: 'platba', name: 'Platba', items: [
    ['Je možné vytvoriť darčekový poukaz?', 'Áno, darčekový poukaz je možné vytvoriť podľa vašich požiadaviek. Ponúkame personalizované poukážky v rôznych hodnotách.']
  ]},
  { id: 'reklamacie', name: 'Reklamácie a vrátenie', items: [
    ['Krabičky mi prišli poškodené, ako postupovať?', 'Ak vám krabičky prišli poškodené, prosím, vytvorte ihneď fotografiu a následne ju zašlite na náš mail. Taktiež ihneď kontaktujte kuriéra. Situáciu vyriešime a následne vás budeme kontaktovať s jej riešením.']
  ]},
  { id: 'ucet', name: 'Môj účet', items: [
    ['Čo urobiť v prípade, že potrebujem zmeniť doručovacie údaje?', 'V tomto prípade nás, prosím, kontaktujte včas telefonicky alebo mailom.'],
    ['Kedy môžem stravu pozastaviť?', 'Stravu je možné pozastaviť 2 dni (48 hodín) vopred na daný deň. Príklad: ak chcete zrušiť stravu na stredu, je potrebné to nahlásiť v pondelok doobeda.']
  ]},
  { id: 'produkty', name: 'Produkty a jedlá', items: [
    ['Sú krabičky určené len na chudnutie?', 'Krabičky nie sú určené len na chudnutie. Sú určené aj pre zaneprázdnených ľudí, ktorí potrebujú zabezpečiť určitý počet kalórií na udržanie váhy, a aj pre tých, ktorí majú záujem o budovanie svalovej hmoty. Zároveň oslobodia vašu myseľ od neustáleho premýšľania nad jedlom a ušetria čas s prípravou jedál.'],
    ['Viete pripraviť krabičky podľa špeciálnych požiadaviek?', 'Krabičky vieme prispôsobiť a niektoré potraviny nahradiť alebo vyradiť z vášho jedálnička. Prosím, pre potvrdenie nám napíšte mail alebo nás kontaktujte telefonicky. Sú suroviny, ktoré sa dajú vynechať jednoducho, a niektoré vôbec.'],
    ['Dajú sa pripraviť krabičky bez laktózy?', 'Áno, krabičky vieme pripraviť bez laktózy za príplatok 1,50 €/deň.'],
    ['Viete pripraviť krabičky pre vegetariánov?', 'Áno, krabičky pre vegetariánov vieme pripraviť.'],
    ['Ako postupovať, ak si chcem objednať, ale mám alergie?', 'V tomto prípade nás, prosím, kontaktujte telefonicky alebo mailom, kde preveríme možnosť pripraviť krabičky podľa vašich požiadaviek.'],
    ['Kto zostavuje vaše jedálničky?', 'Naše jedálničky zostavuje tím odborníkov a výživových špecialistov. Jedálničky sú nonstop upravované podľa nových štúdií.'],
    ['Ako skladovať krabičky?', 'Po dokončení jedál sú krabičky šokovo schladzované, čo zabezpečuje ich čerstvosť až na 72 hodín. Krabičky skladujeme v chladiacich boxoch a následne sa rozvážajú v chladiarenskom aute. Odporúčame po doručení krabičky skladovať v chladničke.'],
    ['Pripravujete aj dezerty a iné sladké veci?', 'Áno, v našich krabičkách nájdete mnoho sladkých či slaných dezertov, ktoré ulahodia každému.']
  ]}
];

let accId = 0;
const faq = {
  file: 'faq.html',
  active: 'faq',
  title: 'Často kladené otázky | TopStrava',
  description: 'Odpovede na najčastejšie otázky o objednávke, doprave, platbe a jedlách TopStrava.',
  body: `  <section class="pagetop">
    <div class="container">
      <ul class="breadcrumb">
        <li><a href="index.html">Domov</a></li>
        <li>${icon.chevron}</li>
        <li>Časté otázky</li>
      </ul>
      <div class="pagetop__inner">
        <h1>Ako vám môžeme pomôcť?</h1>
        <p class="lede">Nájdite rýchlo odpoveď na vašu otázku. Alebo sa opýtajte priamo — odpovedáme do hodiny v pracovnom čase.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid grid--faq">
        <aside>
          <h2 class="sr-only">Kategórie otázok</h2>
          <p class="label" style="margin-bottom:14px">Kategórie</p>
          <div class="stack" style="gap:6px;margin-bottom:30px">
            <a class="chip" href="#" data-faq-filter="all" aria-current="true">Všetky otázky <span class="chip__count">${faqGroups.reduce((n, g) => n + g.items.length, 0)}</span></a>
${faqGroups.map(g => `            <a class="chip" href="#" data-faq-filter="${g.id}" aria-current="false">${g.name} <span class="chip__count">${g.items.length}</span></a>`).join('\n')}
          </div>
          <div class="card card--tint card--flat">
            <div class="card__body">
              <h3 class="card__title">Nenašli ste odpoveď?</h3>
              <p class="card__text">Napíšte nám. Odpovedáme do hodiny v pracovnom čase.</p>
              <a class="btn btn--primary btn--sm" href="kontakt.html#contact-form" style="margin-top:6px">Kontaktovať</a>
            </div>
          </div>
        </aside>

        <div>
${faqGroups.map(g => `          <div data-faq-group="${g.id}">
            <h2 style="margin-bottom:16px">${g.name}</h2>
            <div class="accordion" style="margin-bottom:44px">
${g.items.map(([q, a]) => {
  accId++;
  return `              <div class="acc__item">
                <h3>
                  <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-${accId}" id="accb-${accId}">
                    <span>${q}</span>
                    <span class="acc__icon">${icon.plus}</span>
                  </button>
                </h3>
                <div class="acc__panel" id="acc-${accId}" role="region" aria-labelledby="accb-${accId}">
                  <p>${a}</p>
                </div>
              </div>`;
}).join('\n')}
            </div>
          </div>`).join('\n')}
        </div>
      </div>
    </div>
  </section>

${L.bandDelivery()}`
};

/* ============================ KONTAKT ============================ */
const kontakt = {
  file: 'kontakt.html',
  active: 'kontakt',
  title: 'Kontakt — sme tu pre vás | TopStrava',
  description: 'Máte otázku o jedálničkoch alebo objednávke? Zavolajte nám alebo napíšte — radi poradíme.',
  body: `  <section class="pagetop">
    <div class="container">
      <ul class="breadcrumb">
        <li><a href="index.html">Domov</a></li>
        <li>${icon.chevron}</li>
        <li>Kontakt</li>
      </ul>
      <div class="pagetop__inner">
        <h1>Sme tu pre vás</h1>
        <p class="lede">Máte otázku o našich jedálničkoch alebo objednávke? Napíšte nám alebo zavolajte — radi vám poradíme.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid grid--3" style="margin-bottom:56px">
        <a class="card card--link" href="tel:+421904264951">
          <div class="card__body">
            <span class="card__icon">${icon.phone}</span>
            <p class="card__meta"><span class="hi">Zavolajte</span></p>
            <h2 class="card__title" style="font-size:20px">+421 904 264 951</h2>
            <p class="card__text">Po–Pia 8:00–17:00</p>
            <span class="card__cta">Zavolať ${icon.arrow}</span>
          </div>
        </a>
        <a class="card card--link" href="mailto:topstrava.info@gmail.com">
          <div class="card__body">
            <span class="card__icon">${icon.mail}</span>
            <p class="card__meta"><span class="hi">Napíšte</span></p>
            <h2 class="card__title" style="font-size:20px">topstrava.info@gmail.com</h2>
            <p class="card__text">Odpoveď do 24 hodín</p>
            <span class="card__cta">Napísať e-mail ${icon.arrow}</span>
          </div>
        </a>
        <a class="card card--link" href="#contact-form">
          <div class="card__body">
            <span class="card__icon">${icon.box}</span>
            <p class="card__meta"><span class="hi">Online formulár</span></p>
            <h2 class="card__title" style="font-size:20px">Napíšte nám</h2>
            <p class="card__text">Reakcia do 24 hodín</p>
            <span class="card__cta">Vyplniť formulár ${icon.arrow}</span>
          </div>
        </a>
      </div>

      <div class="grid grid--form" id="contact-form">
        <form novalidate>
          <h2 style="margin-bottom:8px">Máte otázky?</h2>
          <p class="lede" style="margin-bottom:26px;font-size:17px">Vyplňte formulár a ozveme sa vám do 24 hodín.</p>

          <div class="field">
            <label for="name">Vaše meno a priezvisko <span class="req">*</span></label>
            <input class="input" id="name" name="name" type="text" autocomplete="name" required>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="tel">Telefón <span class="req">*</span></label>
              <input class="input" id="tel" name="tel" type="tel" autocomplete="tel" placeholder="+421 ___ ___ ___" required>
            </div>
            <div class="field">
              <label for="mail">E-mail <span class="req">*</span></label>
              <input class="input" id="mail" name="mail" type="email" autocomplete="email" required>
            </div>
          </div>
          <div class="field">
            <label for="topic">Čoho sa otázka týka?</label>
            <select class="select" id="topic" name="topic">
              <option>Výber programu</option>
              <option>Existujúca objednávka</option>
              <option>Rozvoz a odberné miesta</option>
              <option>Alergie a špeciálne požiadavky</option>
              <option>Darčekové poukážky</option>
              <option>Nutričné poradenstvo</option>
              <option>Iné</option>
            </select>
          </div>
          <div class="field">
            <label for="msg">Čo pre vás môžeme urobiť?</label>
            <textarea class="textarea" id="msg" name="msg" rows="5"></textarea>
          </div>
          <label class="check" style="margin-bottom:22px">
            <input type="checkbox" name="gdpr" required>
            <span>Staráme sa o vaše údaje. Prečítajte si naše podmienky <a href="#">spracovania osobných údajov</a>. <span class="req">*</span></span>
          </label>
          <button class="btn btn--primary btn--lg" type="submit">Odoslať správu ${icon.arrow}</button>
        </form>

        <aside class="stack">
          <div class="card card--tint card--flat">
            <div class="card__body">
              <span class="card__icon">${icon.pin}</span>
              <h3 class="card__title">Kuchyňa Žilina</h3>
              <address style="font-style:normal;color:var(--text-2);font-size:15px;line-height:1.7">
                Hlinská 2592/14<br>010 01 Žilina<br>budova Junior
              </address>
              <p class="card__text">Osobný odber je zadarmo. Krabičky si môžete vyzdvihnúť od príchodu SMS do 15:00.</p>
            </div>
          </div>
          <div class="card card--flat">
            <div class="card__body">
              <span class="card__icon">${icon.clock}</span>
              <h3 class="card__title">Kedy nás zastihnete</h3>
              <div class="rail__line" style="padding:9px 0"><span>Pondelok – Piatok</span><span>8:00 – 17:00</span></div>
              <div class="rail__line" style="padding:9px 0"><span>Sobota</span><span>Zatvorené</span></div>
              <div class="rail__line" style="padding:9px 0;border-bottom:0"><span>Nedeľa</span><span>Rozvoz 14:00 – 21:30</span></div>
            </div>
          </div>
          <div class="card card--flat">
            <div class="card__body">
              <span class="card__icon">${icon.info}</span>
              <h3 class="card__title">Rýchlejšie ako e-mail</h3>
              <p class="card__text">Väčšinu otázok o objednávke, doprave a jedlách zodpovedá naša sekcia častých otázok.</p>
              <a class="card__cta" href="faq.html">Časté otázky ${icon.arrow}</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

${L.bandDelivery()}`
};

module.exports = [akoFunguje, akoVybrat, oNas, faq, kontakt];
