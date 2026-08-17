const L = require('./layout');
const { icon, programs, deliveryCities, pickupPoints } = L;

/* ============================ HOMEPAGE ============================ */
const home = {
  file: 'index.html',
  active: 'home',
  title: 'Krabičková strava — pravidelne, zdravo a chutne | TopStrava',
  description: 'Krabičková strava na mieru. Deväť programov od 1 200 do 2 500 kcal, čerstvo pripravené a doručené deň vopred do 13 miest na Slovensku.',
  body: `  <section class="hero">
    <div class="container hero__grid on-dark">
      <div>
        <p class="label">Pravidelne · Zdravo · Chutne</p>
        <h1>Zdravé jedlo na celý týždeň. Bez nákupov a bez varenia.</h1>
        <p class="hero__lede">Vyberte si jeden z deviatich jedálničkov. My uvaríme, šokovo schladíme a doručíme vám krabičky deň vopred až domov alebo na odberné miesto.</p>
        <div class="hero__actions">
          <a class="btn btn--primary btn--lg" href="programy.html">${icon.cart}Objednať krabičky</a>
          <a class="btn btn--secondary btn--lg" href="ako-vybrat-program.html">Zistiť svoj program</a>
        </div>
        <div class="hero__proof">
          <div><b>9</b><span>programov</span></div>
          <div><b>13</b><span>miest rozvozu</span></div>
          <div><b>12</b><span>odberných miest</span></div>
          <div><b>72 h</b><span>garancia čerstvosti</span></div>
        </div>
      </div>
      <div class="hero__media hero__media--reels">
${L.reelsSlider()}
      </div>
    </div>
  </section>

  <section class="section section--tint">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Ako to funguje</p>
        <h2>Objednajte si TOP stravu už dnes</h2>
        <p>Päť krokov od výberu programu po jedlo v chladničke. Objednávku je potrebné urobiť najneskôr do stredy 22:00.</p>
      </div>
      <div class="grid grid--4">
        <div class="card card--tint">
          <div class="card__body">
            <span class="card__step">1</span>
            <h3 class="card__title">Vyberte si obľúbený variant</h3>
            <p class="card__text">Deväť programov od 3 chodov po Max energy. Neviete si vybrať? Máme kalorickú kalkulačku.</p>
            <a class="card__cta" href="ako-vybrat-program.html">Zistiť svoj program ${icon.arrow}</a>
          </div>
        </div>
        <div class="card card--tint">
          <div class="card__body">
            <span class="card__step">2</span>
            <h3 class="card__title">Vložte do košíka</h3>
            <p class="card__text">Objednávka vždy minimálne na jeden týždeň, teda 5 pracovných dní nasledujúceho týždňa.</p>
          </div>
        </div>
        <div class="card card--tint">
          <div class="card__body">
            <span class="card__step">3</span>
            <h3 class="card__title">Kuchári pripravia jedlá</h3>
            <p class="card__text">V nedeľu pripravíme jedlá na celý týždeň. Šokové schladenie predlžuje čerstvosť na 72 hodín.</p>
          </div>
        </div>
        <div class="card card--tint">
          <div class="card__body">
            <span class="card__step">4</span>
            <h3 class="card__title">Dovezieme až k vám</h3>
            <p class="card__text">Chladiarenským autom domov alebo na jedno z 12 odberných miest, vždy deň vopred.</p>
            <a class="card__cta" href="ako-to-funguje.html#rozvoz">Rozvrh doručovania ${icon.arrow}</a>
          </div>
        </div>
      </div>
    </div>
  </section>

${L.sectionPrograms(6)}

  <section class="section section--tint" id="oblasti">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Kam doručujeme</p>
        <h2>Rozvoz do 13 miest, výdaj na 12 miestach</h2>
        <p>Doručujeme od nedele do štvrtka, vždy deň vopred, v čase 14:00–21:30.</p>
      </div>
      <div class="grid grid--2">
        <div class="card">
          <div class="card__body">
            <span class="card__icon">${icon.truck}</span>
            <p class="card__meta"><span class="hi">Rozvoz na adresu</span><span class="dot"></span>2,10 €/deň</p>
            <h3 class="card__title">Doručíme priamo k vašim dverám</h3>
            <ul class="card__taglist">
${deliveryCities.map(c => `              <li>${c}</li>`).join('\n')}
            </ul>
            <a class="card__cta" href="kontakt.html">Overiť moju adresu ${icon.arrow}</a>
          </div>
        </div>
        <div class="card">
          <div class="card__body">
            <span class="card__icon">${icon.pin}</span>
            <p class="card__meta"><span class="hi">Odberné miesta</span><span class="dot"></span>1,56 €/deň</p>
            <h3 class="card__title">Vyzdvihnite si krabičky cestou domov</h3>
            <ul class="card__taglist">
${pickupPoints.map(c => `              <li>${c}</li>`).join('\n')}
            </ul>
            <a class="card__cta" href="ako-to-funguje.html#rozvoz">Zobraziť miesta ${icon.arrow}</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="referencie">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Referencie</p>
        <h2>Čo hovoria naši zákazníci</h2>
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
    </div>
  </section>

${L.bandDelivery()}

  <section class="section" id="blog">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Blog</p>
        <h2>Blog plný inšpirácie a noviniek</h2>
      </div>
      <div class="grid grid--3">
        <a class="card" href="#">
          <div class="card__media"><img src="${L.img('blog1')}" alt="" loading="lazy" width="600" height="375"></div>
          <div class="card__body">
            <p class="card__meta"><span class="hi">Rozvoz</span><span class="dot"></span>20. 6. 2026<span class="dot"></span>4 min</p>
            <h3 class="card__title">Prečo je pri krabičkovej strave dôležitý chladený rozvoz?</h3>
            <p class="card__text">V lete rozhoduje chladiaci reťazec o kvalite aj bezpečnosti jedla.</p>
            <span class="card__cta">Prečítať článok ${icon.arrow}</span>
          </div>
        </a>
        <a class="card" href="#">
          <div class="card__media"><img src="${L.img('blog3')}" alt="" loading="lazy" width="600" height="375"></div>
          <div class="card__body">
            <p class="card__meta"><span class="hi">Jedálničky</span><span class="dot"></span>22. 6. 2026<span class="dot"></span>6 min</p>
            <h3 class="card__title">Koľko jedálničkov máme v TopStrave a prečo ich rozširujeme</h3>
            <p class="card__text">Od troch chodov po 2 500 kcal — ako vzniká nový program.</p>
            <span class="card__cta">Prečítať článok ${icon.arrow}</span>
          </div>
        </a>
        <a class="card" href="#">
          <div class="card__media"><img src="${L.img('blog4')}" alt="" loading="lazy" width="600" height="375"></div>
          <div class="card__body">
            <p class="card__meta"><span class="hi">Príbeh</span><span class="dot"></span>16. 5. 2026<span class="dot"></span>5 min</p>
            <h3 class="card__title">Schudla 35 kg za 6 mesiacov: skutočná premena vďaka TopStrave</h3>
            <p class="card__text">Ako vyzerá polrok so stravou, o ktorej nemusíte premýšľať.</p>
            <span class="card__cta">Prečítať článok ${icon.arrow}</span>
          </div>
        </a>
      </div>
    </div>
  </section>

${L.newsletter()}`
};

/* ============================ KRABIČKY / PROGRAMY ============================ */
const programyPage = {
  file: 'programy.html',
  active: 'programy',
  title: 'Krabičky — všetky programy a cenník | TopStrava',
  description: 'Deväť programov krabičkovej stravy od 1 200 do 2 500 kcal. Porovnajte kalórie, počet jedál a ceny.',
  body: `  <section class="pagetop">
    <div class="container">
      <ul class="breadcrumb">
        <li><a href="index.html">Domov</a></li>
        <li>${icon.chevron}</li>
        <li>Krabičky</li>
      </ul>
      <div class="pagetop__inner">
        <h1>Krabičky pre každý cieľ</h1>
        <p class="lede">Deväť jedálničkov od 1 200 do 2 500 kcal. Každý na 5 pracovných dní, pripravený čerstvo a doručený deň vopred.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="sr-only">Všetky programy</h2>
      <div class="cluster" style="margin-bottom:32px">
        <span class="label" style="margin-right:4px">Filtrovať podľa cieľa</span>
        <a class="chip is-active" href="#">Všetky</a>
        <a class="chip" href="#slim">Chudnutie</a>
        <a class="chip" href="#balance-plus">Udržiavanie</a>
        <a class="chip" href="#max-energy">Naberanie</a>
        <a class="chip" href="#3-chody-zena">3 chody</a>
      </div>
      <div class="grid grid--3">
${programs.map(p => L.programCard(p)).join('\n')}
      </div>
    </div>
  </section>

  <section class="section section--tint has-deco" id="cennik">
${L.deco('papricky', 'r', { w: '250px', o: '.32', y: '18%', x: '-90px' })}
${L.deco('kopr', 'bl', { w: '150px', r: '40deg', y: '-30px', x: '-30px', o: '.5' })}
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Cenník</p>
        <h2>Prehľadné ceny bez skrytých poplatkov</h2>
        <p>Ceny sú uvedené za 5 pracovných dní vrátane DPH. Doprava sa účtuje zvlášť podľa spôsobu doručenia.</p>
      </div>
      <div class="table-wrap">
        <table>
          <caption class="sr-only">Cenník programov krabičkovej stravy</caption>
          <thead>
            <tr>
              <th scope="col">Program</th>
              <th scope="col" class="num">Kalórie</th>
              <th scope="col" class="num">Jedál denne</th>
              <th scope="col" class="num">Cena / týždeň</th>
              <th scope="col" class="num">Cena / deň</th>
              <th scope="col"><span class="sr-only">Akcia</span></th>
            </tr>
          </thead>
          <tbody>
${programs.map(p => {
  const perDay = (parseFloat(p.price.replace(',', '.')) / 5).toFixed(2).replace('.', ',');
  return `            <tr>
              <th scope="row">${p.name}</th>
              <td class="num">${p.kcal} kcal</td>
              <td class="num">${p.meals}</td>
              <td class="num"><strong>${p.price}</strong></td>
              <td class="num">${perDay} €</td>
              <td class="num"><a class="btn btn--sm btn--secondary" href="dokoncenie-objednavky.html">Objednať</a></td>
            </tr>`;
}).join('\n')}
          </tbody>
        </table>
      </div>

      <div class="grid grid--3" style="margin-top:28px">
        <div class="card card--flat">
          <div class="card__body">
            <span class="card__icon">${icon.truck}</span>
            <h3 class="card__title">Rozvoz na adresu</h3>
            <p class="card__text">2,10 € / deň. Výnimka platí pre Košice, Spišskú Novú Ves, Martin, Liptovský Mikuláš a Poprad.</p>
          </div>
        </div>
        <div class="card card--flat">
          <div class="card__body">
            <span class="card__icon">${icon.pin}</span>
            <h3 class="card__title">Odberné miesto</h3>
            <p class="card__text">1,56 € / deň. Osobný odber v našej kuchyni na Hlinskej v Žiline je zadarmo.</p>
          </div>
        </div>
        <div class="card card--flat">
          <div class="card__body">
            <span class="card__icon">${icon.leaf}</span>
            <h3 class="card__title">Bez laktózy</h3>
            <p class="card__text">Príplatok 1,50 € / deň. Vegetariánsku verziu pripravíme bez príplatku.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="jedalnicek">
    <div class="container">
      <div class="split">
        <div>
          <p class="label label--gold">Vzorový jedálniček</p>
          <h2 style="margin-bottom:14px">Pozrite si jedálniček na tento týždeň</h2>
          <p class="lede" style="margin-bottom:24px">Prezrite si náš jedálniček plný chutných jedál. Typický deň päťchodového menu obsahuje raňajky, desiatu, obed, olovrant a večeru.</p>
          <ul class="steps" style="margin-bottom:28px">
            <li><span class="steps__n">1</span><div><b>Raňajky</b><p>Ovsené kaše, omelety, chlebíčky s tvarohom</p></div></li>
            <li><span class="steps__n">2</span><div><b>Desiata</b><p>Ovocie, orechy, proteínové dezerty</p></div></li>
            <li><span class="steps__n">3</span><div><b>Obed</b><p>Mäso alebo ryba s prílohou a zeleninou</p></div></li>
            <li><span class="steps__n">4</span><div><b>Olovrant</b><p>Slané aj sladké dezerty</p></div></li>
            <li><span class="steps__n">5</span><div><b>Večera</b><p>Ľahšie jedlá s vyšším podielom bielkovín</p></div></li>
          </ul>
          <a class="btn btn--primary" href="dokoncenie-objednavky.html">Objednať tento týždeň</a>
        </div>
        <div class="split__media"><img src="${L.img('band-menu')}" alt="Vzorový týždenný jedálniček" loading="lazy" width="800" height="600"></div>
      </div>
    </div>
  </section>

  <section class="section section--cream has-deco" id="poukazy">
${L.deco('ostruziny', 'tr', { w: '230px', o: '.34', y: '-60px', x: '-70px' })}
    <div class="container">
      <div class="split split--media-first">
        <div class="split__media"><img src="${L.img('meal2')}" alt="Darčekové poukážky TopStrava" loading="lazy" width="800" height="600"></div>
        <div>
          <p class="label label--gold">🎁 Darčekové poukážky</p>
          <h2 style="margin-bottom:14px">Darujte týždeň bez varenia</h2>
          <p class="lede" style="margin-bottom:24px">Darčekový poukaz vytvoríme podľa vašich požiadaviek. Ponúkame personalizované poukážky v rôznych hodnotách.</p>
          <div class="cluster">
            <a class="btn btn--primary" href="kontakt.html#contact-form">Objednať poukaz</a>
            <a class="btn btn--text" href="faq.html">Ako to funguje ${icon.arrow}</a>
          </div>
        </div>
      </div>
    </div>
  </section>

${L.bandDelivery()}`
};

/* ============================ PLNENIE OBJEDNÁVKY ============================ */
const checkout = {
  file: 'dokoncenie-objednavky.html',
  active: 'checkout',
  title: 'Dokončenie objednávky | TopStrava',
  description: 'Dokončite svoju objednávku krabičkovej stravy — doručenie, platba a zhrnutie.',
  body: `  <section class="pagetop">
    <div class="container">
      <ul class="breadcrumb">
        <li><a href="index.html">Domov</a></li>
        <li>${icon.chevron}</li>
        <li><a href="programy.html">Krabičky</a></li>
        <li>${icon.chevron}</li>
        <li>Dokončenie objednávky</li>
      </ul>
      <div class="pagetop__inner">
        <h1>Dokončenie objednávky</h1>
        <p class="lede">Ešte dva kroky a máte celý týždeň vyriešený.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <ol class="progress">
        <li class="is-done"><b>${icon.check}</b>Košík</li>
        <li class="is-current"><b>2</b>Doručenie a platba</li>
        <li><b>3</b>Zhrnutie</li>
      </ol>

      <div class="grid grid--main-rail">
        <form novalidate>
          <div class="notice" style="margin-bottom:30px">
            ${icon.clock}
            <span>Objednávku je potrebné dokončiť <strong>najneskôr do stredy 22:00</strong>, aby sme stihli uvariť na nasledujúci týždeň.</span>
          </div>

          <h2 style="margin-bottom:20px">Kontaktné údaje</h2>
          <div class="field-row">
            <div class="field">
              <label for="fname">Meno <span class="req">*</span></label>
              <input class="input" id="fname" name="fname" type="text" autocomplete="given-name" required>
            </div>
            <div class="field">
              <label for="lname">Priezvisko <span class="req">*</span></label>
              <input class="input" id="lname" name="lname" type="text" autocomplete="family-name" required>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="email">E-mail <span class="req">*</span></label>
              <input class="input" id="email" name="email" type="email" autocomplete="email" required>
            </div>
            <div class="field">
              <label for="phone">Telefón <span class="req">*</span></label>
              <input class="input" id="phone" name="phone" type="tel" autocomplete="tel" placeholder="+421 ___ ___ ___" required>
            </div>
          </div>

          <h2 style="margin:44px 0 20px">Spôsob doručenia</h2>
          <div class="radio-cards" style="margin-bottom:22px">
            <label class="radio-card">
              <input type="radio" name="delivery" value="address" checked>
              <span>Na adresu<br><span style="font-weight:500;color:var(--text-3);font-size:13.5px">2,10 € / deň</span></span>
            </label>
            <label class="radio-card">
              <input type="radio" name="delivery" value="pickup">
              <span>Odberné miesto<br><span style="font-weight:500;color:var(--text-3);font-size:13.5px">1,56 € / deň</span></span>
            </label>
          </div>
          <div class="field">
            <label for="city">Mesto <span class="req">*</span></label>
            <select class="select" id="city" name="city" required>
              <option value="">Vyberte mesto…</option>
${deliveryCities.map(c => `              <option>${c}</option>`).join('\n')}
            </select>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="street">Ulica a číslo <span class="req">*</span></label>
              <input class="input" id="street" name="street" type="text" autocomplete="street-address" required>
            </div>
            <div class="field">
              <label for="zip">PSČ <span class="req">*</span></label>
              <input class="input" id="zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" required>
            </div>
          </div>
          <div class="field">
            <label for="note">Poznámka pre kuriéra</label>
            <textarea class="textarea" id="note" name="note" rows="3" placeholder="Poschodie, zvonček, kam nechať balíček…"></textarea>
          </div>

          <h2 style="margin:44px 0 20px">Spôsob platby</h2>
          <div class="radio-cards" style="margin-bottom:22px">
            <label class="radio-card">
              <input type="radio" name="pay" value="card" checked>
              <span>Platobná karta<br><span style="font-weight:500;color:var(--text-3);font-size:13.5px">Online, okamžité potvrdenie</span></span>
            </label>
            <label class="radio-card">
              <input type="radio" name="pay" value="transfer">
              <span>Bankový prevod<br><span style="font-weight:500;color:var(--text-3);font-size:13.5px">Údaje pošleme e-mailom</span></span>
            </label>
          </div>

          <h2 style="margin:44px 0 20px">Špeciálne požiadavky</h2>
          <div class="stack" style="gap:12px;margin-bottom:26px">
            <label class="check"><input type="checkbox" name="lactofree"><span>Bez laktózy <strong>(+1,50 € / deň)</strong></span></label>
            <label class="check"><input type="checkbox" name="vege"><span>Vegetariánska verzia (bez príplatku)</span></label>
          </div>
          <div class="field">
            <label for="allergy">Alergie alebo potraviny, ktoré nejete</label>
            <textarea class="textarea" id="allergy" name="allergy" rows="3" placeholder="Napríklad: bez húb, bez rýb…"></textarea>
          </div>

          <div class="stack" style="gap:12px;margin:26px 0">
            <label class="check"><input type="checkbox" name="terms" required><span>Súhlasím s <a href="#">obchodnými podmienkami</a> a so <a href="#">spracovaním osobných údajov</a> <span class="req">*</span></span></label>
            <label class="check"><input type="checkbox" name="news"><span>Chcem dostávať novinky o jedálničkoch</span></label>
          </div>

          <button class="btn btn--primary btn--lg" type="submit">Záväzne objednať ${icon.arrow}</button>
          <p class="form-note">Objednávka je záväzná. Stravu je možné pozastaviť najneskôr 48 hodín vopred.</p>
        </form>

        <aside class="rail" aria-label="Zhrnutie objednávky">
          <h3>Zhrnutie objednávky</h3>
          <div class="rail__item">
            <img src="${L.img('meal5')}" alt="" width="56" height="56">
            <div><b>Balance</b><span>1 600 kcal · 5 jedál denne</span><br><span>5 pracovných dní</span></div>
          </div>
          <div class="rail__item">
            <img src="${L.img('meal3')}" alt="" width="56" height="56">
            <div><b>Slim</b><span>1 200 kcal · 5 jedál denne</span><br><span>5 pracovných dní</span></div>
          </div>
          <div class="rail__line"><span>Medzisúčet</span><span>199,00 €</span></div>
          <div class="rail__line"><span>Doprava (5 dní)</span><span>10,50 €</span></div>
          <div class="rail__line"><span>DPH</span><span>v cene</span></div>
          <div class="rail__total"><span>Spolu</span><b>209,50 €</b></div>
          <div class="notice notice--green" style="margin-top:20px;font-size:14.5px">
            ${icon.check}
            <span>Prvé doručenie v <strong>nedeľu večer</strong> na pondelok.</span>
          </div>
        </aside>
      </div>
    </div>
  </section>`
};

module.exports = [home, programyPage, checkout];
