const L = require('./layout');
const { icon, programs } = L;
const { durations, restrictions, allergenNames } = require('./program-data');

/* ===========================================================================
   PROGRAM DETAIL — one template for all nine programs.

   Nothing about the markup is specific to "3 chody Žena". The program is read
   from ?program=<slug> at runtime and every program-specific value (name,
   calories, meals per day, description, picture, price) is filled in by JS
   from the same data the cards use. Switching program is how you verify the
   template holds; it is not nine pages.
   =========================================================================== */

const DAYS = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok'];
const DAY_SHORT = { 'Pondelok': 'Po', 'Utorok': 'Ut', 'Streda': 'St', 'Štvrtok': 'Št', 'Piatok': 'Pi' };

function durationOptions() {
  return durations.map((d, i) => `            <label class="opt">
              ${d.popular ? '<span class="opt__flag">Najobľúbenejšie</span>' : ''}
              <input type="radio" name="duration" value="${d.days}"${i === 0 ? ' checked' : ''}>
              <b>${d.label}</b>
              <small>${d.weeks}</small>
              ${d.discount ? `<span class="opt__note">${d.note}</span>` : ''}
            </label>`).join('\n');
}

function restrictionChips() {
  const tick = '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M8 14.2 4.3 10.5l1.4-1.4L8 11.4l6.3-6.3 1.4 1.4z"/></svg>';
  return restrictions.map(r => `            <li>
              <label class="pick">
                <input type="checkbox" name="restriction" value="${r.id}" data-price="${r.price}" data-label="${r.label}">
                <span class="pick__box">${tick}</span>
                ${r.label}
                <span class="pick__price">+${String(r.price.toFixed(2)).replace('.', ',')} €</span>
              </label>
            </li>`).join('\n');
}

function weekdayButtons() {
  return DAYS.map((d, i) => `          <button class="day" type="button" data-day="${d}" aria-pressed="${i === 0}">
            ${d}<small class="day__kcal"></small>
          </button>`).join('\n');
}

const programPage = {
  file: 'program.html',
  active: 'programy',
  css: ['program.css'],
  js: ['week-menu.js', 'program.js'],
  title: '3 chody Žena — 1 200 kcal, 3 jedlá denne | TopStrava',
  description: 'Praktická voľba pre tých, ktorí preferujú menej jedál denne. Raňajky, obed a večera na 5 pracovných dní, doručené deň vopred.',
  bodyEnd: `<div class="orderbar">
  <div class="orderbar__price">
    <b data-bind="totalMobile">87,50 €</b>
    <span data-bind="durationMobile">5 dní</span>
  </div>
  <a class="btn btn--primary" href="dokoncenie-objednavky.html">Objednať program</a>
</div>`,
  body: `  <section class="prog-hero">
    <div class="container">
      <a class="backlink" href="programy.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>
        Späť na programy
      </a>

      <div class="prog-hero__grid">
        <div class="prog-visual">
          <img src="${L.img('meal1')}" alt="" data-bind="image" width="800" height="1000">
        </div>

        <div class="prog-head">
          <div class="prog-switch">
            <label for="prog-select">Program</label>
            <select id="prog-select" data-bind="switcher">
${programs.map(p => `              <option value="${p.slug}"${p.slug === '3-chody-zena' ? ' selected' : ''}>${p.name}</option>`).join('\n')}
            </select>
          </div>

          <h1 data-bind="name">3 chody Žena</h1>

          <p class="prog-kcal"><b data-bind="kcal">1 200</b><span>kcal denne</span></p>

          <p class="lede" data-bind="desc">Praktická voľba pre tých, ktorí preferujú menej jedál denne.</p>

          <ul class="prog-facts">
            <li>${icon.box}<span data-bind="meals">3 jedlá denne</span></li>
            <li>${icon.clock}5 pracovných dní</li>
            <li>${icon.truck}Doručenie deň vopred</li>
            <li>${icon.leaf}Čerstvé, nie mrazené</li>
          </ul>

          <div class="prog-price">
            <span class="prog-price__now" data-bind="basePrice">87,50 €</span>
            <span class="prog-price__unit">za 5 pracovných dní · <span data-bind="perDay">17,50 €</span> / deň</span>
          </div>

          <div class="cluster">
            <a class="btn btn--primary btn--lg" href="#objednavka">${icon.cart}Objednať program</a>
            <a class="btn btn--secondary btn--lg" href="#jedalnicek">Pozrieť jedálniček</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tint" id="objednavka">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">Objednávka</p>
        <h2>Nastavte si program</h2>
        <p>Tri kroky. Cena sa prepočítava priebežne, nič sa neúčtuje teraz.</p>
      </div>

      <div class="config">
        <form>
          <div class="config__step">
            <div class="config__head">
              <span class="config__num">1</span>
              <h2>Dĺžka predplatného</h2>
              <span class="hint">Čím dlhšie, tým výhodnejšie</span>
            </div>
            <div class="opts">
${durationOptions()}
            </div>
          </div>

          <div class="config__step">
            <div class="config__head">
              <span class="config__num">2</span>
              <h2>Stravovacie obmedzenia</h2>
              <span class="hint">Nepovinné · príplatok za deň</span>
            </div>
            <ul class="picks">
${restrictionChips()}
            </ul>
            <p class="form-note">Suroviny vieme nahradiť alebo vynechať. Pri alergiách nás radšej kontaktujte — niektoré sa vynechať nedajú.</p>
          </div>

          <div class="config__step">
            <div class="config__head">
              <span class="config__num">3</span>
              <h2>Začiatok odberu</h2>
              <span class="hint">Rozvážame nedeľa – štvrtok</span>
            </div>
            <div class="cal" data-cal>
              <div class="cal__top">
                <span class="cal__month" data-bind="calMonth">Jún 2026</span>
                <div class="cal__nav">
                  <button type="button" data-cal-prev aria-label="Predchádzajúci mesiac">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>
                  </button>
                  <button type="button" data-cal-next aria-label="Nasledujúci mesiac">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
                  </button>
                </div>
              </div>
              <div class="cal__dow" aria-hidden="true">
                <span>Po</span><span>Ut</span><span>St</span><span>Št</span><span>Pi</span><span>So</span><span>Ne</span>
              </div>
              <div class="cal__grid" data-cal-grid role="group" aria-label="Výber dátumu začiatku"></div>
              <p class="cal__legend">
                <span><i></i>Vybraný začiatok</span>
                <span>Víkendy a uplynulé dni sú nedostupné</span>
              </p>
            </div>
          </div>
        </form>

        <aside class="sum" aria-label="Zhrnutie objednávky">
          <h2>Zhrnutie</h2>
          <dl class="sum__list">
            <div class="sum__row"><dt>Program</dt><dd data-bind="sumName">3 chody Žena</dd></div>
            <div class="sum__row"><dt>Kalórie</dt><dd data-bind="sumKcal">1 200 kcal / deň</dd></div>
            <div class="sum__row"><dt>Jedál denne</dt><dd data-bind="sumMeals">3</dd></div>
            <div class="sum__row"><dt>Dĺžka</dt><dd data-bind="sumDuration">5 dní</dd></div>
            <div class="sum__row"><dt>Začiatok</dt><dd data-bind="sumStart">—</dd></div>
            <div class="sum__row"><dt>Obmedzenia</dt><dd><span class="sum__tags" data-bind="sumRestrictions">Žiadne</span></dd></div>
          </dl>
          <div class="sum__total">
            <span>Spolu</span>
            <b data-bind="total">87,50 €</b>
          </div>
          <span class="sum__save" data-bind="save" hidden></span>
          <a class="btn btn--primary btn--block" href="dokoncenie-objednavky.html">Objednať program</a>
          <p class="sum__note">Objednávku je potrebné dokončiť do stredy 22:00. Stravu možno pozastaviť 48 hodín vopred.</p>
        </aside>
      </div>
    </div>
  </section>

  <section class="section" id="jedalnicek">
    <div class="container">
      <div class="tabs" role="tablist" aria-label="Detail programu">
        <button type="button" role="tab" id="tab-prehlad" aria-controls="panel-prehlad" aria-selected="true">Prehľad</button>
        <button type="button" role="tab" id="tab-menu" aria-controls="panel-menu" aria-selected="false">Menu</button>
      </div>

      <div class="tabpanel" id="panel-prehlad" role="tabpanel" aria-labelledby="tab-prehlad">
        <div class="facts">
          <div class="fact-card">
            <span class="fact-card__icon">${icon.box}</span>
            <b data-bind="factMeals">3 jedlá denne</b>
            <p data-bind="factCourses">Raňajky, obed a večera. Každé jedlo zabalené, označené a pripravené na konzumáciu.</p>
          </div>
          <div class="fact-card">
            <span class="fact-card__icon">${icon.clock}</span>
            <b>72 hodín čerstvosti</b>
            <p>Jedlá sú po uvarení šokovo schladené a vákuovo balené, nie mrazené.</p>
          </div>
          <div class="fact-card">
            <span class="fact-card__icon">${icon.truck}</span>
            <b>Doručenie deň vopred</b>
            <p>Chladiarenským autom domov (2,10 €/deň) alebo na odberné miesto (1,56 €/deň).</p>
          </div>
          <div class="fact-card">
            <span class="fact-card__icon">${icon.leaf}</span>
            <b>Prispôsobiteľné</b>
            <p>Štrnásť surovín vieme vynechať alebo nahradiť. Vegetariánska verzia bez príplatku.</p>
          </div>
        </div>

        <div class="split" style="margin-top:var(--sp-section)">
          <div class="prose">
            <p class="label label--gold">Pre koho je program</p>
            <h2 style="margin-bottom:16px" data-bind="forWhomTitle">Menej jedál, plná kontrola nad dňom</h2>
            <p data-bind="forWhom">Tri chody denne sú praktická voľba, ak nechcete jesť každé dve hodiny alebo vám počas dňa nevyhovuje desiata a olovrant. Rovnaký denný príjem, rozdelený do menšieho počtu väčších porcií.</p>
            <p>Ak si nie ste istí kalorickou hladinou, prejdite si kalkulačku — odporučí program podľa vášho veku, hmotnosti, aktivity a cieľa.</p>
            <div class="cluster" style="margin-top:24px">
              <a class="btn btn--secondary" href="ako-vybrat-program.html">Zistiť svoj program</a>
              <a class="btn btn--text" href="faq.html">Časté otázky ${icon.arrow}</a>
            </div>
          </div>
          <div class="split__media"><img src="${L.img('meal5')}" alt="Ukážka denného menu" loading="lazy" width="800" height="600"></div>
        </div>
      </div>

      <div class="tabpanel" id="panel-menu" role="tabpanel" aria-labelledby="tab-menu" hidden>
        <div class="section-head">
          <p class="label label--gold">Vzorový týždeň</p>
          <h2>Jedálniček na tento týždeň</h2>
          <p>Jedálniček sa každý týždeň mení. Hodnoty sú za porciu.</p>
        </div>

        <div class="days" role="group" aria-label="Deň v týždni">
${weekdayButtons()}
        </div>

        <div class="meals" data-bind="mealGrid"></div>

        <p class="form-note" data-bind="allergenKey"></p>
      </div>
    </div>
  </section>

${L.bandDelivery()}`
};

module.exports = [programPage];
