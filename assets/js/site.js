/* TopStrava — refined UI. Progressive enhancement only; nothing here is
   required for the content to be readable or the links to work. */
(function () {
  'use strict';

  /* --- Header: compress on scroll (the "improve sticky behavior" fix) --- */
  var masthead = document.querySelector('.masthead');
  if (masthead) {
    var stuck = false;
    var onScroll = function () {
      var should = window.scrollY > 8;
      if (should !== stuck) {
        stuck = should;
        masthead.classList.toggle('is-stuck', stuck);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobile navigation --- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    var backdrop = document.createElement('button');
    backdrop.className = 'nav-backdrop';
    backdrop.type = 'button';
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', 'Zavrieť menu');
    document.body.appendChild(backdrop);

    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
      /* stop the page behind the drawer from scrolling */
      document.body.style.overflowY = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });
    backdrop.addEventListener('click', function () { setNav(false); toggle.focus(); });
    nav.addEventListener('click', function (e) {
      /* follow a link, then close behind it */
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        toggle.focus();
      }
    });
    /* leaving mobile width resets everything */
    window.matchMedia('(min-width: 981px)').addEventListener('change', function (ev) {
      if (ev.matches) setNav(false);
    });
  }

  /* --- Accordion (FAQ) --- */
  document.querySelectorAll('.acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  });

  /* --- FAQ category filter --- */
  var filters = document.querySelectorAll('[data-faq-filter]');
  if (filters.length) {
    filters.forEach(function (f) {
      f.addEventListener('click', function (e) {
        e.preventDefault();
        var cat = f.getAttribute('data-faq-filter');
        filters.forEach(function (o) { o.setAttribute('aria-current', String(o === f)); });
        document.querySelectorAll('[data-faq-group]').forEach(function (g) {
          g.hidden = !(cat === 'all' || g.getAttribute('data-faq-group') === cat);
        });
      });
    });
  }

  /* --- Calorie calculator (Ako vybrať program) --- */
  var calc = document.getElementById('calc');
  if (calc) {
    var programs = [
      { id: '3-chody-zena',   name: '3 chody Žena',  kcal: 1200, price: '87,50 €' },
      { id: 'slim',           name: 'Slim',          kcal: 1200, price: '94,50 €' },
      { id: 'slim-plus',      name: 'Slim+',         kcal: 1400, price: '99,50 €' },
      { id: '3-chody-muz',    name: '3 chody Muž',   kcal: 1600, price: '98,50 €' },
      { id: 'balance',        name: 'Balance',       kcal: 1600, price: '104,50 €' },
      { id: 'balance-plus',   name: 'Balance+',      kcal: 1800, price: '109,50 €' },
      { id: 'active-body',    name: 'Active body',   kcal: 2000, price: '114,50 €' },
      { id: 'active-body-plus', name: 'Active body+', kcal: 2200, price: '119,50 €' },
      { id: 'max-energy',     name: 'Max energy',    kcal: 2500, price: '124,50 €' }
    ];
    var out = {
      bmi:   document.getElementById('out-bmi'),
      bmiN:  document.getElementById('out-bmi-note'),
      ideal: document.getElementById('out-ideal'),
      kcal:  document.getElementById('out-kcal'),
      bmr:   document.getElementById('out-bmr'),
      rec:   document.getElementById('out-rec'),
      recWrap: document.getElementById('recommendation')
    };

    var compute = function () {
      var sex = (calc.querySelector('input[name="sex"]:checked') || {}).value || 'f';
      var age = +calc.querySelector('#age').value || 0;
      var h   = +calc.querySelector('#height').value || 0;
      var w   = +calc.querySelector('#weight').value || 0;
      var act = +calc.querySelector('#activity').value || 1.2;
      var goal = calc.querySelector('#goal').value;
      if (!age || !h || !w) return;

      /* Mifflin–St Jeor */
      var bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'm' ? 5 : -161);
      var tdee = bmr * act;
      if (goal === 'lose') tdee -= 400;
      if (goal === 'gain') tdee += 350;

      /* Never recommend below the usual clinical minimum. A deficit that
         deep is not something a food company should be suggesting. */
      var floor = sex === 'm' ? 1500 : 1200;
      var floored = tdee < floor;
      if (floored) tdee = floor;

      var bmi = w / Math.pow(h / 100, 2);
      var ideal = Math.round(22 * Math.pow(h / 100, 2));

      var bmiLabel = bmi < 18.5 ? 'Podváha'
                   : bmi < 25   ? 'Normálna hmotnosť'
                   : bmi < 30   ? 'Nadváha' : 'Obezita';

      out.bmi.textContent = bmi.toFixed(1);
      out.bmiN.textContent = bmiLabel;
      out.ideal.textContent = 'Ideálna váha by mala byť okolo ' + ideal + ' kg';
      out.kcal.textContent = Math.round(tdee / 10) * 10 + ' kcal';
      out.bmr.textContent = floored
        ? 'Nastavené na bezpečné minimum ' + floor + ' kcal'
        : 'BMR: ' + Math.round(bmr) + ' kcal';

      /* Nearest program by calorie target. The two "3 chody" variants are
         explicitly gendered, so never offer the one that contradicts the
         selection the visitor just made. */
      var pool = programs.filter(function (p) {
        if (p.id === '3-chody-zena' && sex === 'm') return false;
        if (p.id === '3-chody-muz' && sex === 'f') return false;
        return true;
      });
      var best = pool[0], diff = Infinity;
      pool.forEach(function (p) {
        var d = Math.abs(p.kcal - tdee);
        if (d < diff) { diff = d; best = p; }
      });
      out.rec.innerHTML =
        '<p class="card__meta"><span class="hi">Odporúčaný program</span>' +
        '<span class="dot"></span>' + best.kcal + ' kcal</p>' +
        '<h3 class="card__title">' + best.name + '</h3>' +
        '<p class="card__text">Každý deň 5 jedál po dobu 5 pracovných dní.</p>' +
        '<div class="card__price"><b>' + best.price + '</b><span>/ týždeň s DPH</span></div>' +
        '<a class="btn btn--primary" style="margin-top:14px" href="programy.html">Zobraziť program</a>';
      out.recWrap.hidden = false;
    };

    calc.addEventListener('input', compute);
    calc.addEventListener('change', compute);
    compute();
  }

  /* --- Year in footer --- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
