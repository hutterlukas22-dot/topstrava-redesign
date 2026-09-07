const L = require('./layout');
const { icon, maxNutrition: M, maxCourses, maxMeals, MAX_SIZES } = L;

/* ===========================================================================
   MAX NUTRITION — menu and dish detail.

   Rebuilt to the structure the client sent (menu.html + product page), but in
   this site's design language rather than theirs. Their files are wireframes:
   Arial, Unsplash placeholders, pure black and gold. Copied literally, the
   page would have read as a different website bolted onto this one — so what
   is taken from them is the INFORMATION ARCHITECTURE:

     menu     hero → one section per course → dish cards with M/L/XL
     detail   photo + size picker + macro table + composition + allergens
              + delivery calendar + CTA

   The first version of this page was the opposite shape — long explanatory
   prose and almost no food — which is what the client rejected.

   Courses come from L.maxCourses, so adding breakfasts or snacks later is a
   data entry, not a template change.
   =========================================================================== */

/* Only one dish has a truthful photograph so far. The rest get a deliberate
   placeholder rather than a borrowed picture of something else — a named dish
   under the wrong photo is the kind of thing the client called out. */
function mealMedia(meal) {
  if (meal.photo) {
    return `<div class="meal__media"><img src="${L.img(meal.photo)}" alt="${meal.name}" loading="lazy" width="600" height="420"></div>`;
  }
  return `<div class="meal__media meal__media--empty" aria-hidden="true">
              <span class="meal__ph">${icon.box}<b>Foto pripravujeme</b></span>
            </div>`;
}

function mealCard(meal) {
  return `          <article class="meal">
            ${mealMedia(meal)}
            <div class="meal__body">
              <h3 class="meal__title"><a href="max-nutrition-jedlo.html?jedlo=${meal.slug}">${meal.name}</a></h3>
              <p class="meal__text">${meal.desc}</p>
              <p class="meal__sizes">
                <span class="sr-only">Dostupné veľkosti:</span>
${MAX_SIZES.map(s => `                <span class="meal__size">${s.code}</span>`).join('\n')}
              </p>
              <a class="btn btn--secondary btn--sm meal__cta" href="max-nutrition-jedlo.html?jedlo=${meal.slug}">
                Vybrať jedlo ${icon.arrow}
              </a>
            </div>
          </article>`;
}

function courseSection(course, i) {
  return `  <section class="section${i % 2 ? ' section--tint' : ''}" id="${course.id}">
    <div class="container">
      <div class="section-head">
        <p class="label label--gold">${course.label}</p>
        <h2>${course.title}</h2>
        <p>${course.lede}</p>
      </div>
      <div class="grid grid--meals">
${course.meals.map(mealCard).join('\n')}
      </div>
    </div>
  </section>`;
}

const maxNutritionPage = {
  file: 'max-nutrition.html',
  active: 'max-nutrition',
  title: 'MAX NUTRITION — vyskladajte si jedlá podľa svojich cieľov | TopStrava',
  description: 'Nutrične vyvážené jedlá v troch veľkostiach porcií M, L a XL. ' +
               'Vyberte si konkrétne jedlá a nechajte si ich doviezť.',
  js: ['max-nutrition.js'],
  body: `  <section class="hero hero--video">
${L.videoBg('reel-3', M.photoHero)}
    <div class="container">
      <ul class="breadcrumb">
        <li><a href="index.html">Domov</a></li>
        <li>${icon.chevron}</li>
        <li>MAX NUTRITION</li>
      </ul>
    </div>
    <div class="container hero__grid on-dark">
      <div>
        <p class="label">${M.eyebrow}</p>
        <h1>Vyskladajte si jedlá podľa svojich cieľov</h1>
        <p class="hero__lede">${M.claim}. Vyberáte si konkrétne jedlá aj veľkosť porcie — M, L alebo XL podľa toho, koľko energie potrebujete.</p>
        <div class="hero__actions">
          <a class="btn btn--primary btn--lg" href="#${maxCourses[0].id}">${icon.cart}Vybrať jedlá</a>
          <a class="btn btn--secondary btn--lg" href="#velkosti">Ako fungujú veľkosti</a>
        </div>
        <div class="hero__proof">
          <div><b>${MAX_SIZES.length}</b><span>veľkosti porcií</span></div>
          <div><b>${maxMeals.length}</b><span>jedál v ponuke</span></div>
          <div><b>3×</b><span>rozvoz týždenne</span></div>
          <div><b>72 h</b><span>garancia čerstvosti</span></div>
        </div>
      </div>
    </div>
  </section>

${maxCourses.map(courseSection).join('\n\n')}

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
        ${icon.truck}
        <span>Rozvoz <strong>3× týždenne</strong> — ${M.days.join(', ').toLowerCase()}, v čase 14:00 – 21:30. Do rovnakých miest ako krabičky. <a href="ako-to-funguje.html#rozvoz">Pozrieť zoznam miest</a>.</span>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="band__bg"><img src="${L.img('band-a')}" alt="" aria-hidden="true"></div>
    <div class="container band__inner on-dark">
      <p class="label" style="color:var(--gold)">${M.eyebrow}</p>
      <h2>Nie ste si istí výberom?</h2>
      <p>Ozvite sa nám a poradíme vám s veľkosťou porcie aj so skladbou jedál.</p>
      <ul>
        <li>${icon.check}Jedlá si vyberáte sami, nie hotový balík</li>
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

/* ---------------------------------------------------------------------------
   DISH DETAIL — one template for every dish, filled at runtime from
   ?jedlo=<slug>, the same pattern program.html already uses. A new dish is a
   data entry; it never becomes another page.
   --------------------------------------------------------------------------- */
const maxMealPage = {
  file: 'max-nutrition-jedlo.html',
  active: 'max-nutrition',
  title: 'Detail jedla | MAX NUTRITION | TopStrava',
  description: 'Nutričné hodnoty, zloženie a alergény jedla z programu MAX NUTRITION. ' +
               'Vyberte si veľkosť porcie a termín doručenia.',
  js: ['max-nutrition.js'],
  body: `  <section class="section meal-detail" data-meal-detail>
    <div class="container">
      <a class="backlink" href="max-nutrition.html">
        ${icon.chevronLeft}Späť na menu
      </a>

      <div class="grid grid--meal-detail">
        <aside class="meal-detail__media">
          <div class="meal-detail__photo" data-bind="photo"></div>
          <ul class="meal-detail__facts">
            <li>${icon.leaf}<span>Nutrične vyvážené</span></li>
            <li>${icon.box}<span>M / L / XL veľkosti</span></li>
            <li>${icon.clock}<span>Spotreba do 72 hodín</span></li>
          </ul>
        </aside>

        <div>
          <p class="label label--gold" data-bind="course">Hlavné jedlá</p>
          <h1 data-bind="name">Jedlo</h1>
          <p class="lede" data-bind="desc"></p>

          <h2 class="meal-detail__h">Veľkosť porcie</h2>
          <div class="sizepick" data-bind="sizes" role="radiogroup" aria-label="Veľkosť porcie"></div>

          <h2 class="meal-detail__h">Nutričné hodnoty</h2>
          <p class="form-note" style="margin:-8px 0 14px">Ukážkové hodnoty na porciu — reálne makrá doplníme podľa podkladov z kuchyne.</p>
          <div class="table-wrap">
            <table>
              <caption class="sr-only">Nutričné hodnoty podľa veľkosti porcie</caption>
              <thead>
                <tr>
                  <th scope="col">Veľkosť</th>
                  <th scope="col" class="num">Kalórie</th>
                  <th scope="col" class="num">Bielkoviny</th>
                  <th scope="col" class="num">Sacharidy</th>
                  <th scope="col" class="num">Tuky</th>
                </tr>
              </thead>
              <tbody data-bind="nutri"></tbody>
            </table>
          </div>

          <div class="grid grid--2" style="margin-top:26px">
            <div class="card card--flat">
              <div class="card__body">
                <h3 class="card__title">Zloženie</h3>
                <p class="card__text" data-bind="zlozenie"></p>
              </div>
            </div>
            <div class="card card--flat">
              <div class="card__body">
                <h3 class="card__title">Alergény a spotreba</h3>
                <p class="card__text" data-bind="alergeny"></p>
              </div>
            </div>
          </div>

          <h2 class="meal-detail__h">Termín doručenia</h2>
          <p class="form-note" style="margin:-8px 0 14px">Rozvážame v nedeľu, utorok a štvrtok — ostatné dni sa nedajú zvoliť.</p>
          <div class="daypick" data-bind="calendar"></div>

          <div class="cluster" style="margin-top:28px">
            <a class="btn btn--primary btn--lg" href="dokoncenie-objednavky.html">${icon.cart}Pridať do objednávky</a>
            <a class="btn btn--secondary btn--lg" href="max-nutrition.html">Vybrať ďalšie jedlo</a>
          </div>
        </div>
      </div>
    </div>
  </section>

${L.newsletter()}`
};

module.exports = [maxNutritionPage, maxMealPage];
