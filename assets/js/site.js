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

/* ============================================================
   REELS SLIDER (hero)
   Vertical player for the Instagram clips. Advances when a clip ends,
   arrows for manual control, one sound toggle, CTA out to the profile.

   Instagram's own <iframe> embed cannot do this: it is cross-origin, so the
   page can neither detect that a clip finished nor mute/unmute it. That is
   why this plays self-hosted files. Until a file exists in assets/video/,
   the slide falls back to its poster and advances on a timer, so the
   component behaves the same either way.
   ============================================================ */
(function () {
  'use strict';

  var root = document.querySelector('[data-reels]');
  if (!root) return;

  var STILL_MS = 5000;   // how long a poster-only slide stays up
  var slides = [].slice.call(root.querySelectorAll('.reel'));
  if (!slides.length) return;

  var barsWrap = root.querySelector('.reels__bars');
  var soundBtn = root.querySelector('[data-reels-sound]');
  var prevBtn = root.querySelector('[data-reels-prev]');
  var nextBtn = root.querySelector('[data-reels-next]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var index = 0;
  var muted = true;
  var stillTimer = null;
  var rafId = null;
  var inView = true;

  /* one progress bar per slide */
  var bars = slides.map(function () {
    var b = document.createElement('span');
    b.className = 'reels__bar';
    b.appendChild(document.createElement('i'));
    barsWrap.appendChild(b);
    return b;
  });

  function videoOf(slide) { return slide.querySelector('.reel__video'); }

  /* Point each <video> at its file. A missing file flips the slide to
     poster-only mode rather than leaving an empty black box. */
  slides.forEach(function (slide) {
    var v = videoOf(slide);
    var src = slide.getAttribute('data-src');
    if (!v || !src) { slide.classList.add('is-still'); return; }
    v.muted = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.addEventListener('error', function () { slide.classList.add('is-still'); }, { once: true });
    v.addEventListener('loadedmetadata', function () { slide.classList.remove('is-still'); });
    v.src = src;
    v.addEventListener('ended', function () {
      if (slide.classList.contains('is-active')) go(index + 1);
    });
  });

  function clearTimers() {
    if (stillTimer) { clearTimeout(stillTimer); stillTimer = null; }
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function paintBars(activeFraction) {
    bars.forEach(function (bar, i) {
      var fill = bar.firstChild;
      bar.classList.toggle('is-done', i < index);
      if (i < index) { fill.style.transition = 'none'; fill.style.width = '100%'; }
      else if (i > index) { fill.style.transition = 'none'; fill.style.width = '0%'; }
      else {
        fill.style.transition = 'none';
        fill.style.width = (activeFraction * 100).toFixed(2) + '%';
      }
    });
  }

  function trackVideo(v) {
    function step() {
      if (!v.duration || !isFinite(v.duration)) { rafId = requestAnimationFrame(step); return; }
      paintBars(Math.min(1, v.currentTime / v.duration));
      if (!v.paused && !v.ended) rafId = requestAnimationFrame(step);
    }
    step();
  }

  function runStill() {
    var start = Date.now();
    function step() {
      var f = Math.min(1, (Date.now() - start) / STILL_MS);
      paintBars(f);
      if (f < 1) rafId = requestAnimationFrame(step);
    }
    step();
    if (!reduce) stillTimer = setTimeout(function () { go(index + 1); }, STILL_MS);
  }

  function go(next) {
    clearTimers();

    var prev = slides[index];
    var pv = videoOf(prev);
    if (pv) { try { pv.pause(); pv.currentTime = 0; } catch (e) {} }
    prev.classList.remove('is-active');

    index = ((next % slides.length) + slides.length) % slides.length;

    var slide = slides[index];
    slide.classList.add('is-active');
    paintBars(0);

    var v = videoOf(slide);
    var isStill = slide.classList.contains('is-still') || !v;

    if (isStill || !inView) { if (inView && !reduce) runStill(); return; }

    /* Someone who asked for reduced motion does not want a clip starting by
       itself. Show the poster and let the arrows do the work. */
    if (reduce) { slide.classList.add('is-still'); return; }

    v.muted = muted;
    var p = v.play();
    if (p && typeof p.catch === 'function') {
      /* autoplay refused (or no decodable file) — fall back to the timer */
      p.catch(function () { slide.classList.add('is-still'); runStill(); });
    }
    trackVideo(v);
  }

  /* --- controls --- */
  if (prevBtn) prevBtn.addEventListener('click', function () { go(index - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { go(index + 1); });

  if (soundBtn) {
    soundBtn.addEventListener('click', function () {
      muted = !muted;
      slides.forEach(function (s) { var v = videoOf(s); if (v) v.muted = muted; });
      soundBtn.setAttribute('aria-pressed', String(!muted));
      soundBtn.setAttribute('aria-label', muted ? 'Zapnúť zvuk' : 'Vypnúť zvuk');
      soundBtn.querySelector('[data-icon-muted]').hidden = !muted;
      soundBtn.querySelector('[data-icon-loud]').hidden = muted;
      /* unmuting is a user gesture, so a clip blocked from autoplaying can start now */
      var v = videoOf(slides[index]);
      if (v && !muted && v.paused && !slides[index].classList.contains('is-still')) {
        v.play().catch(function () {});
      }
    });
  }

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });

  /* Don't play to an empty room: pause offscreen and on a hidden tab. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      var v = videoOf(slides[index]);
      if (!inView) {
        clearTimers();
        if (v) { try { v.pause(); } catch (e) {} }
      } else {
        go(index);
      }
    }, { threshold: 0.25 }).observe(root);
  }

  document.addEventListener('visibilitychange', function () {
    var v = videoOf(slides[index]);
    if (document.hidden) {
      clearTimers();
      if (v) { try { v.pause(); } catch (e) {} }
    } else if (inView) {
      go(index);
    }
  });

  go(0);
})();

/* ---------------------------------------------------------------------------
   Background videos (.vbg)

   Decorative clips behind a section. Three things are handled here that the
   HTML attributes alone cannot:

   1. prefers-reduced-motion — autoplay is an attribute, so the only way to
      honour the setting is to stop the clip in script. The poster stays on
      screen, which is exactly the still image the section was designed for.
   2. Off-screen sections — a looping clip nobody can see still costs decode
      time and battery, so it only runs while it is actually in view.
   3. Autoplay refusal — some browsers reject autoplay even when muted. The
      promise rejection is swallowed deliberately: the poster is a perfectly
      good fallback and a console error helps nobody.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  var vids = [].slice.call(document.querySelectorAll('[data-bgvideo]'));
  if (!vids.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    vids.forEach(function (v) {
      v.removeAttribute('autoplay');
      v.removeAttribute('loop');
      try { v.pause(); } catch (e) {}
    });
    return;
  }

  var play = function (v) {
    var p = v.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  };

  if (!('IntersectionObserver' in window)) {
    vids.forEach(play);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) play(e.target);
      else try { e.target.pause(); } catch (err) {}
    });
  }, { rootMargin: '200px 0px' });

  vids.forEach(function (v) { io.observe(v); });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      vids.forEach(function (v) { try { v.pause(); } catch (e) {} });
    }
  });
})();
