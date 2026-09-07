/* ===========================================================================
   MAX NUTRITION — dish detail

   Mock only, like program.js: nothing is submitted and no cart is real. The
   point is to show the pattern — one template, every dish read from
   ?jedlo=<slug> — so adding a dish or a whole new course never means another
   page.

   The dish table below is generated into the built HTML? No: it is duplicated
   here on purpose. The page is static and has no data layer at runtime, so
   the detail template needs its own copy, exactly as program.js does. Keep it
   in step with src/layout.js → maxCourses.
   =========================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-meal-detail]');
  if (!root) return;

  /* ---- data ------------------------------------------------------------ */

  var SIZES = [
    { code: 'M', note: 'ľahšia porcia' },
    { code: 'L', note: 'štandardná porcia' },
    { code: 'XL', note: 'väčšia porcia' }
  ];

  /* nutri: [kcal, bielkoviny, sacharidy, tuky] — sample values, flagged as
     such in the markup */
  var MEALS = {
    'kuraci-steak-kurkumova-ryza': {
      name: 'Kurací steak s kurkumovou ryžou a grilovaným ananásom',
      course: 'Hlavné jedlá',
      desc: 'Grilovaný kurací steak, kurkumová ryža a grilovaný ananás.',
      photo: 'assets/img/blog1.webp',
      zlozenie: 'kuracie prsia, ryža, kurkuma, ananás, olivový olej, korenie',
      alergeny: [],
      nutri: { M: [390, 34, 38, 9], L: [520, 45, 51, 12], XL: [690, 60, 68, 16] }
    },
    'turkey-meatballs': {
      name: 'Turkey meatballs, paradajková omáčka s opekaným zemiakom',
      course: 'Hlavné jedlá',
      desc: 'Morčacie guľky v paradajkovej omáčke s opekaným zemiakom.',
      zlozenie: 'morčacie mäso, paradajky, zemiaky, cibuľa, cesnak, bylinky',
      alergeny: ['1', '3'],
      nutri: { M: [410, 32, 40, 11], L: [545, 43, 53, 15], XL: [720, 57, 70, 20] }
    },
    'teriyaki-rezancky': {
      name: 'Teriyaki rezančeky z roštenky s brokolicou a ryžou',
      course: 'Hlavné jedlá',
      desc: 'Hovädzia roštenka v teriyaki omáčke s brokolicou a ryžou.',
      zlozenie: 'hovädzia roštenka, brokolica, ryža, teriyaki omáčka, sezam',
      alergeny: ['1', '6', '11'],
      nutri: { M: [430, 36, 41, 12], L: [575, 48, 55, 16], XL: [760, 63, 73, 21] }
    },
    'beef-bolognese-rice-pasta': {
      name: 'Beef bolognese rice pasta',
      course: 'Hlavné jedlá',
      desc: 'Hovädzie ragú s ryžovými cestovinami.',
      zlozenie: 'hovädzie mäso, ryžové cestoviny, paradajky, mrkva, zeler, bylinky',
      alergeny: ['9'],
      nutri: { M: [400, 33, 42, 10], L: [535, 44, 56, 13], XL: [705, 58, 74, 18] }
    }
  };

  /* EU allergen numbering, same list the week menu uses */
  var ALLERGENS = {
    '1': 'obilniny s lepkom', '2': 'kôrovce', '3': 'vajcia', '4': 'ryby',
    '5': 'arašidy', '6': 'sója', '7': 'mlieko', '8': 'orechy', '9': 'zeler',
    '10': 'horčica', '11': 'sezam', '12': 'oxid siričitý', '13': 'vlčí bôb',
    '14': 'mäkkýše'
  };

  var DELIVERY_DAYS = ['Nedeľa', 'Utorok', 'Štvrtok'];

  /* ---- helpers --------------------------------------------------------- */

  function bind(name) { return root.querySelector('[data-bind="' + name + '"]'); }

  function slug() {
    var m = /[?&]jedlo=([^&#]+)/.exec(window.location.search);
    var key = m ? decodeURIComponent(m[1]) : '';
    return MEALS[key] ? key : Object.keys(MEALS)[0];
  }

  var meal = MEALS[slug()];

  /* ---- render ---------------------------------------------------------- */

  document.title = meal.name + ' | MAX NUTRITION | TopStrava';
  bind('course').textContent = meal.course;
  bind('name').textContent = meal.name;
  bind('desc').textContent = meal.desc;
  bind('zlozenie').textContent = meal.zlozenie;

  var alg = meal.alergeny.length
    ? 'Obsahuje: ' + meal.alergeny.map(function (n) {
        return ALLERGENS[n] ? ALLERGENS[n] + ' (' + n + ')' : n;
      }).join(', ') + '. Doba spotreby od doručenia: 72 hodín.'
    : 'Bez alergénov z povinného zoznamu. Doba spotreby od doručenia: 72 hodín.';
  bind('alergeny').textContent = alg;

  /* photo, or the same deliberate placeholder the menu cards use */
  var photo = bind('photo');
  if (meal.photo) {
    var im = document.createElement('img');
    im.src = meal.photo;
    im.alt = meal.name;
    im.width = 800; im.height = 1000;
    photo.appendChild(im);
  } else {
    photo.classList.add('is-empty');
    photo.innerHTML = '<span class="meal__ph">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9"/>' +
      '</svg><b>Foto pripravujeme</b></span>';
  }

  /* size picker — real radios, so keyboard and screen readers get the group
     semantics for free */
  var sizeWrap = bind('sizes');
  SIZES.forEach(function (s, i) {
    var id = 'size-' + s.code;
    var label = document.createElement('label');
    label.className = 'sizepick__opt';
    label.setAttribute('for', id);
    label.innerHTML =
      '<input type="radio" name="size" id="' + id + '" value="' + s.code + '"' +
      (i === 1 ? ' checked' : '') + '>' +
      '<b>' + s.code + '</b><span>' + s.note + '</span>' +
      '<span class="sizepick__kcal">' + meal.nutri[s.code][0] + ' kcal</span>';
    sizeWrap.appendChild(label);
  });

  /* macro table */
  var tbody = bind('nutri');
  SIZES.forEach(function (s) {
    var n = meal.nutri[s.code];
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<th scope="row">' + s.code + '</th>' +
      '<td class="num">' + n[0] + ' kcal</td>' +
      '<td class="num">' + n[1] + ' g</td>' +
      '<td class="num">' + n[2] + ' g</td>' +
      '<td class="num">' + n[3] + ' g</td>';
    tbody.appendChild(tr);
  });
  /* highlight the row matching the chosen size */
  function syncTable() {
    var picked = sizeWrap.querySelector('input:checked');
    [].forEach.call(tbody.rows, function (row) {
      row.classList.toggle('is-picked', !!picked && row.cells[0].textContent === picked.value);
    });
  }
  sizeWrap.addEventListener('change', syncTable);
  syncTable();

  /* Delivery picker. The client's mock drew a full month grid with most days
     dead; only three weekdays are ever deliverable, so the next four dates of
     each are far more useful than 31 cells where 18 are greyed out. */
  var cal = bind('calendar');
  var DAY_INDEX = { 'Nedeľa': 0, 'Utorok': 2, 'Štvrtok': 4 };
  var MONTHS = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla',
    'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];

  var today = new Date();
  var slots = [];
  for (var add = 1; add <= 21 && slots.length < 6; add++) {
    var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + add);
    DELIVERY_DAYS.forEach(function (name) {
      if (d.getDay() === DAY_INDEX[name] && slots.length < 6) {
        slots.push({ name: name, date: d });
      }
    });
  }
  slots.forEach(function (s, i) {
    var id = 'day-' + i;
    var label = document.createElement('label');
    label.className = 'daypick__opt';
    label.setAttribute('for', id);
    label.innerHTML =
      '<input type="checkbox" id="' + id + '" name="day"' + (i === 0 ? ' checked' : '') + '>' +
      '<b>' + s.name + '</b>' +
      '<span>' + s.date.getDate() + '. ' + MONTHS[s.date.getMonth()] + '</span>';
    cal.appendChild(label);
  });
})();
