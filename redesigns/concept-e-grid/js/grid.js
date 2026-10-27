/* =========================================================
   AVINOVA — Concept E "Architectural Grid"
   One IIFE per feature, each guarded for missing elements.
   Relies on ../shared/core.js (window.AV).
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;
  var $ = AV.$, $$ = AV.$$;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function idOf(a) { return (a.getAttribute('href') || '').split('#')[1]; }

  /* ---------- Mobile menu: full-height sheet (≤1099px) ---------- */
  (function menu() {
    AV.menu({ toggle: $('.menu-toggle'), panel: $('#site-nav'), breakpoint: 1099 });
  })();

  /* ---------- Reveals (+ safety net for fast jumps) ---------- */
  (function reveals() {
    var sel = '[data-reveal]';
    AV.reveal(sel);
    var pending = $$(sel).filter(function (el) { return !el.classList.contains('is-in'); });
    if (!pending.length) return;
    var off = AV.onScroll(function () {
      var limit = window.innerHeight;
      pending = pending.filter(function (el) {
        if (el.classList.contains('is-in')) return false;
        if (el.getBoundingClientRect().top < limit) { el.classList.add('is-in'); return false; }
        return true;
      });
      if (!pending.length && off) off();
    });
  })();

  /* ---------- Header links: scroll spy on the home page ---------- */
  (function navSpy() {
    if (!document.body.classList.contains('page-home')) return;
    var links = $$('.nav__link[href^="#"]');
    if (!links.length) return;
    AV.spy(links);
    var first = document.getElementById('ueber-uns');
    AV.onScroll(function () {
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.5) {
        links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
      }
    });
  })();

  /* ---------- Section rail (≥1200px) + thin top progress bar ---------- */
  (function railAndProgress() {
    var bar = $('[data-progress]');
    var rail = $('[data-rail]');
    var items = rail ? $$('a', rail).map(function (a) { return { a: a, el: document.getElementById(idOf(a)) }; })
      .filter(function (it) { return it.el; }) : [];
    var darks = $$('.testimonial, .cta-band, .site-footer');
    var wide = window.matchMedia('(min-width: 1200px)');   // rail breakpoint (see grid.css)
    if (items.length) AV.spy(items.map(function (it) { return it.a; }));

    AV.onScroll(function (y) {
      var vh = window.innerHeight;
      if (bar) {
        var max = document.documentElement.scrollHeight - vh;
        bar.style.setProperty('--p', max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0);
      }
      if (!items.length || !wide.matches) return;
      var mid = vh * 0.5;
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        it.a.style.setProperty('--p', clamp((mid - r.top) / (r.height || 1), 0, 1).toFixed(3));
      });
      // light labels while the rail floats over a dark band
      var onDark = darks.some(function (d) { var r = d.getBoundingClientRect(); return r.top < mid && r.bottom > mid; });
      document.body.classList.toggle('on-dark', onDark);
    });
  })();

  /* ---------- Process: one line filled by scroll, steps light up when reached ---------- */
  (function process() {
    var track = $('[data-process]');
    if (!track) return;
    var steps = $$('.step', track);
    var marks = [];
    function measure() {
      var tr = track.getBoundingClientRect();
      var vertical = window.innerWidth < 768;   // matches the process breakpoint in home.css
      marks = steps.map(function (s) {
        var n = $('.step__node', s).getBoundingClientRect();
        return vertical ? (n.top - tr.top) / (tr.height || 1) : (n.left - tr.left) / (tr.width || 1);
      });
    }
    function set(p) {
      track.style.setProperty('--p', p.toFixed(3));
      steps.forEach(function (s, i) { s.classList.toggle('is-on', p >= marks[i] + 0.01); });
    }
    measure();
    if (AV.reduced()) { set(1); return; }
    AV.onScroll(function () {
      var vh = window.innerHeight, r = track.getBoundingClientRect();
      // 0 when the track top reaches 80% of the viewport, 1 when its bottom reaches 60%
      set(clamp((vh * 0.8 - r.top) / (vh * 0.2 + r.height), 0, 1));
    });
    AV.onResize(measure);
  })();

  /* ---------- Home: spec table rows expand (one open at a time) ---------- */
  (function specTable() {
    var spec = $('[data-spec]');
    if (!spec) return;
    var rows = $$('.spec__row', spec);
    function setOpen(row, open) {
      row.classList.toggle('is-open', open);
      $('.spec__toggle', row).setAttribute('aria-expanded', String(open));
    }
    rows.forEach(function (row) {
      var btn = $('.spec__toggle', row);
      btn.addEventListener('click', function () {
        var open = !row.classList.contains('is-open');
        rows.forEach(function (r) { if (r !== row) setOpen(r, false); });
        setOpen(row, open);
      });
    });
  })();

  /* ---------- Count-up numbers (final value stays in the HTML) ---------- */
  AV.counters('[data-count]', 1500);

  /* ---------- Case studies: segmented control with scroll spy ---------- */
  (function caseNav() {
    var nav = $('[data-casenav]');
    if (!nav) return;
    var seg = $('.seg', nav);
    var links = $$('a', nav);
    var sections = links.map(function (a) { return document.getElementById(idOf(a)); }).filter(Boolean);
    if (!sections.length) return;
    AV.spy(links, {
      rootMargin: '-35% 0px -60% 0px',
      onChange: function (id) {
        var i = sections.map(function (s) { return s.id; }).indexOf(id);
        if (i > -1) { seg.style.setProperty('--idx', i); seg.style.setProperty('--on', 1); }
      }
    });
    AV.onScroll(function () {
      var line = window.innerHeight * 0.4;
      var top = sections[0].getBoundingClientRect().top;
      var bottom = sections[sections.length - 1].getBoundingClientRect().bottom;
      if (top > line || bottom < line) {
        seg.style.setProperty('--on', 0);
        links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
      }
    });
  })();

  /* ---------- Contact form: client-side validation, honest status ---------- */
  AV.form($('#contact-form'));

  /* ---------- Legal pages: load text from the original page ---------- */
  if ($('[data-legal-src]')) AV.loadLegal();
})();
