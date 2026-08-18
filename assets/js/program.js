/* ===========================================================================
   PROGRAM DETAIL — prototype behaviour

   Mock only. Nothing is submitted, no cart is real, prices are computed in the
   browser so the interaction can be judged. The point is to show the pattern,
   not to implement the shop.
   =========================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('.prog-hero');
  if (!root) return;

  /* ---- data ------------------------------------------------------------ */

  /* Everything that differs between the nine programs. Adding a program is a
     line here, not another page. */
  var PROGRAMS = {
    '3-chody-zena':     { name: '3 chody Žena',  kcal: 1200, meals: 3, price: 87.50,  img: 'meal1',
      desc: 'Praktická voľba pre tých, ktorí preferujú menej jedál denne.' },
    '3-chody-muz':      { name: '3 chody Muž',   kcal: 1600, meals: 3, price: 98.50,  img: 'meal2',
      desc: 'Praktická voľba pre tých, ktorí preferujú menej jedál denne.' },
    'slim':             { name: 'Slim',          kcal: 1200, meals: 5, price: 94.50,  img: 'meal3',
      desc: 'Ideálne pre rýchle chudnutie, detox či veľmi nízku fyzickú aktivitu. Odporúčané len krátkodobo a pri dohľade odborníka.' },
    'slim-plus':        { name: 'Slim+',         kcal: 1400, meals: 5, price: 99.50,  img: 'meal4',
      desc: 'Častá voľba žien pri redukcii váhy. Pomáha schudnúť bez hladovania, ak je aktivita nízka až stredná.' },
    'balance':          { name: 'Balance',       kcal: 1600, meals: 5, price: 104.50, img: 'meal5',
      desc: 'Vyvážený program pre ženy s bežným denným pohybom alebo pre mužov, ktorí chcú redukovať váhu.' },
    'balance-plus':     { name: 'Balance+',      kcal: 1800, meals: 5, price: 109.50, img: 'meal6',
      desc: 'Univerzálny variant pre udržiavanie hmotnosti. Vhodné pre aktívne ženy alebo menej aktívnych mužov.' },
    'active-body':      { name: 'Active body',   kcal: 2000, meals: 5, price: 114.50, img: 'meal7',
      desc: 'Štandardný príjem pre väčšinu populácie pri bežnom dennom režime.' },
    'active-body-plus': { name: 'Active body+',  kcal: 2200, meals: 5, price: 119.50, img: 'meal8',
      desc: 'Vhodné pre mužov s vyššou fyzickou aktivitou alebo pre ženy s náročnými tréningmi.' },
    'max-energy':       { name: 'Max energy',    kcal: 2500, meals: 5, price: 124.50, img: 'meal9',
      desc: 'Najvyšší program – ideálny pre športovcov, fyzicky pracujúcich alebo na naberanie svalovej hmoty.' }
  };

  var DURATIONS = {
    5:  { label: '5 dní',  weeks: 1,  discount: 0 },
    10: { label: '10 dní', weeks: 2,  discount: 0.05 },
    20: { label: '20 dní', weeks: 4,  discount: 0.10 },
    60: { label: '60 dní', weeks: 12, discount: 0.15 }
  };

  var ALLERGENS = {
    '1': 'obilniny s lepkom', '2': 'kôrovce', '3': 'vajcia', '4': 'ryby',
    '5': 'arašidy', '6': 'sója', '7': 'mlieko', '8': 'orechy', '9': 'zeler',
    '10': 'horčica', '11': 'sezam', '12': 'oxid siričitý', '13': 'vlčí bôb', '14': 'mäkkýše'
  };

  /* Real menu from the live 3 chody Žena page. Only this program has menu data
     in the prototype; the others reuse it, labelled as a sample week. */
  var WEEK = window.TOPSTRAVA_WEEK || [];

  /* ---- helpers --------------------------------------------------------- */

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return [].slice.call((ctx || document).querySelectorAll(sel)); };
  var bind = function (name) { return $('[data-bind="' + name + '"]'); };

  var eur = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var num = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };

  /* ---- state ----------------------------------------------------------- */

  var params = new URLSearchParams(location.search);
  var slug = PROGRAMS[params.get('program')] ? params.get('program') : '3-chody-zena';
  var duration = 5;
  var picked = [];          /* restriction ids */
  var startDate = null;     /* Date */
  var calMonth = null;      /* Date, first of shown month */

  /* ---- program ---------------------------------------------------------- */

  function applyProgram() {
    var p = PROGRAMS[slug];

    bind('name').textContent = p.name;
    bind('kcal').textContent = num(p.kcal);
    bind('desc').textContent = p.desc;
    bind('meals').textContent = p.meals + ' jedlá denne';
    bind('sumName').textContent = p.name;
    bind('sumKcal').textContent = num(p.kcal) + ' kcal / deň';
    bind('sumMeals').textContent = p.meals;
    bind('factMeals').textContent = p.meals + ' jedlá denne';
    bind('factCourses').textContent = p.meals === 3
      ? 'Raňajky, obed a večera. Každé jedlo zabalené, označené a pripravené na konzumáciu.'
      : 'Raňajky, desiata, obed, olovrant a večera. Každé jedlo zabalené, označené a pripravené na konzumáciu.';
    bind('forWhomTitle').textContent = p.meals === 3
      ? 'Menej jedál, plná kontrola nad dňom'
      : 'Päť chodov, o ktorých nemusíte premýšľať';
    bind('forWhom').textContent = p.meals === 3
      ? 'Tri chody denne sú praktická voľba, ak nechcete jesť každé dve hodiny alebo vám počas dňa nevyhovuje desiata a olovrant. Rovnaký denný príjem, rozdelený do menšieho počtu väčších porcií.'
      : 'Päť menších chodov drží stabilnú hladinu energie počas celého dňa a nemusíte riešiť, čo si dať medzi hlavnými jedlami.';

    /* the picture follows the program, same crop language as the cards */
    var im = bind('image');
    im.src = im.src.replace(/assets\/img\/[^?"]+/, 'assets/img/' + p.img + '.webp');
    im.alt = p.name + ' — ukážka jedál';

    /* title and URL follow, so the page can be shared as it is being viewed */
    document.title = p.name + ' — ' + num(p.kcal) + ' kcal, ' + p.meals + ' jedlá denne | TopStrava';
    var url = new URL(location.href);
    url.searchParams.set('program', slug);
    history.replaceState(null, '', url);

    recalc();
  }

  /* ---- price ------------------------------------------------------------ */

  function recalc() {
    var p = PROGRAMS[slug];
    var d = DURATIONS[duration];

    var perDay = p.price / 5;
    var base = perDay * duration;
    var extrasPerDay = picked.reduce(function (n, id) {
      var el = $('input[value="' + id + '"]');
      return n + (el ? parseFloat(el.dataset.price) : 0);
    }, 0);
    var extras = extrasPerDay * duration;
    var beforeDiscount = base + extras;
    var saved = beforeDiscount * d.discount;
    var total = beforeDiscount - saved;

    bind('basePrice').textContent = eur(p.price);
    bind('perDay').textContent = eur(perDay);
    bind('sumDuration').textContent = d.label + (d.weeks > 1 ? ' · ' + d.weeks + ' týždne' : '');
    bind('total').textContent = eur(total);
    bind('totalMobile').textContent = eur(total);
    bind('durationMobile').textContent = d.label;

    var save = bind('save');
    if (saved > 0.005) {
      save.textContent = 'Ušetríte ' + eur(saved);
      save.hidden = false;
    } else {
      save.hidden = true;
    }

    var tags = bind('sumRestrictions');
    if (!picked.length) {
      tags.textContent = 'Žiadne';
    } else {
      tags.textContent = '';
      picked.forEach(function (id) {
        var el = $('input[value="' + id + '"]');
        var s = document.createElement('span');
        s.textContent = el ? el.dataset.label : id;
        tags.appendChild(s);
      });
    }
  }

  /* ---- calendar --------------------------------------------------------- */

  var MONTHS = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
                'Júl', 'August', 'September', 'Október', 'November', 'December'];

  function midnight(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  /* Delivery runs Sunday–Thursday for the next weekday, so a program can start
     on a working day only, and not in the past. */
  function selectable(d) {
    var today = midnight(new Date());
    if (d < today) return false;
    var wd = d.getDay();
    return wd >= 1 && wd <= 5;
  }

  function drawCalendar() {
    var grid = $('[data-cal-grid]');
    if (!grid) return;
    grid.textContent = '';

    var y = calMonth.getFullYear(), m = calMonth.getMonth();
    bind('calMonth').textContent = MONTHS[m] + ' ' + y;

    var first = new Date(y, m, 1);
    /* getDay(): 0 = Sunday. The grid starts on Monday. */
    var lead = (first.getDay() + 6) % 7;
    var daysInMonth = new Date(y, m + 1, 0).getDate();

    for (var i = 0; i < lead; i++) {
      var blank = document.createElement('span');
      blank.className = 'cal__day cal__day--out';
      blank.appendChild(document.createElement('span'));
      grid.appendChild(blank);
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var date = new Date(y, m, day);
      var ok = selectable(date);
      var wrap = document.createElement('label');
      wrap.className = 'cal__day' + (ok ? '' : ' cal__day--off');

      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'startDate';
      input.value = date.toISOString().slice(0, 10);
      input.disabled = !ok;
      if (startDate && date.getTime() === startDate.getTime()) input.checked = true;

      var face = document.createElement('span');
      face.textContent = day;

      wrap.appendChild(input);
      wrap.appendChild(face);
      grid.appendChild(wrap);
    }

    var today = midnight(new Date());
    $('[data-cal-prev]').disabled =
      (y < today.getFullYear()) || (y === today.getFullYear() && m <= today.getMonth());
  }

  function setStart(date) {
    startDate = date;
    var f = new Intl.DateTimeFormat('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' });
    bind('sumStart').textContent = f.format(date);
  }

  /* ---- menu ------------------------------------------------------------- */

  function dayTotal(d) {
    return d.jedla.reduce(function (n, j) { return n + (j.kcal || 0); }, 0);
  }

  function drawDay(name) {
    var wrap = bind('mealGrid');
    if (!wrap) return;
    var day = WEEK.filter(function (d) { return d.den === name; })[0];
    wrap.textContent = '';
    if (!day) return;

    var used = {};

    day.jedla.forEach(function (m) {
      var card = document.createElement('article');
      card.className = 'meal';

      var course = document.createElement('p');
      course.className = 'meal__course';
      course.textContent = m.chod;

      var h = document.createElement('h3');
      h.className = 'meal__name';
      h.textContent = m.nazov;

      var kcal = document.createElement('p');
      kcal.className = 'meal__kcal';
      var kb = document.createElement('b');
      kb.textContent = m.kcal + ' kcal';
      var ks = document.createElement('span');
      ks.textContent = m.hmotnost ? m.hmotnost + ' g porcia' : '';
      kcal.appendChild(kb);
      kcal.appendChild(ks);

      var macros = document.createElement('div');
      macros.className = 'meal__macros';
      [['bielkoviny', 'Bielkoviny'], ['sacharidy', 'Sacharidy'], ['tuky', 'Tuky']]
        .forEach(function (pair) {
          var cell = document.createElement('div');
          var b = document.createElement('b');
          b.textContent = m[pair[0]] != null ? Math.round(m[pair[0]]) + ' g' : '—';
          var s = document.createElement('span');
          s.textContent = pair[1];
          cell.appendChild(b);
          cell.appendChild(s);
          macros.appendChild(cell);
        });

      card.appendChild(course);
      card.appendChild(h);
      card.appendChild(kcal);
      card.appendChild(macros);

      if (m.alergeny && m.alergeny.length) {
        var al = document.createElement('p');
        al.className = 'meal__allerg';
        var alb = document.createElement('b');
        alb.textContent = 'Alergény: ';
        al.appendChild(alb);
        al.appendChild(document.createTextNode(m.alergeny.join(', ')));
        card.appendChild(al);
        m.alergeny.forEach(function (a) { used[a] = true; });
      }

      wrap.appendChild(card);
    });

    var key = bind('allergenKey');
    if (key) {
      var list = Object.keys(used).sort(function (a, b) { return a - b; })
        .map(function (a) { return a + ' – ' + (ALLERGENS[a] || '?'); });
      key.textContent = list.length ? 'Alergény v tento deň: ' + list.join(' · ') : '';
    }
  }

  function labelDays() {
    $$('.day').forEach(function (btn) {
      var day = WEEK.filter(function (d) { return d.den === btn.dataset.day; })[0];
      var small = $('.day__kcal', btn);
      if (day && small) small.textContent = dayTotal(day) + ' kcal';
    });
  }

  /* ---- wiring ----------------------------------------------------------- */

  var switcher = bind('switcher');
  if (switcher) {
    switcher.value = slug;
    switcher.addEventListener('change', function () {
      slug = switcher.value;
      applyProgram();
    });
  }

  $$('input[name="duration"]').forEach(function (el) {
    el.addEventListener('change', function () { duration = +el.value; recalc(); });
  });

  $$('input[name="restriction"]').forEach(function (el) {
    el.addEventListener('change', function () {
      picked = $$('input[name="restriction"]:checked').map(function (x) { return x.value; });
      recalc();
    });
  });

  var grid = $('[data-cal-grid]');
  if (grid) {
    grid.addEventListener('change', function (e) {
      if (e.target.name !== 'startDate') return;
      var parts = e.target.value.split('-');
      setStart(new Date(+parts[0], +parts[1] - 1, +parts[2]));
    });
    $('[data-cal-prev]').addEventListener('click', function () {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
      drawCalendar();
    });
    $('[data-cal-next]').addEventListener('click', function () {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
      drawCalendar();
    });
  }

  /* tabs */
  var tabs = $$('[role="tab"]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    });
    tab.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') tabs[(i + 1) % tabs.length].focus();
      if (e.key === 'ArrowLeft') tabs[(i - 1 + tabs.length) % tabs.length].focus();
    });
  });

  /* weekday selector */
  $$('.day').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.day').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      drawDay(btn.dataset.day);
    });
  });

  /* ---- init ------------------------------------------------------------- */

  var today = new Date();
  calMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  drawCalendar();

  /* preselect the next available start day, so the summary is never empty */
  var probe = midnight(today);
  for (var i = 0; i < 14; i++) {
    probe = new Date(probe.getFullYear(), probe.getMonth(), probe.getDate() + 1);
    if (selectable(probe)) break;
  }
  if (probe.getMonth() !== calMonth.getMonth()) {
    calMonth = new Date(probe.getFullYear(), probe.getMonth(), 1);
  }
  setStart(probe);
  drawCalendar();

  labelDays();
  drawDay(DAYS_FIRST());
  applyProgram();

  function DAYS_FIRST() {
    var first = $('.day');
    return first ? first.dataset.day : 'Pondelok';
  }
})();
