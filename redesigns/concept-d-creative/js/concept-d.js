/* =========================================================
   AVINOVA — Concept D behaviour
   Uses the shared helpers in ../shared/core.js (window.AV).
   One IIFE per feature; each one is guarded for missing elements.
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;
  var $ = AV.$, $$ = AV.$$;

  /* ---------- Header: border once the page scrolls ---------- */
  (function header() {
    AV.headerState($('[data-header]'), 8, 'is-scrolled');
  })();

  /* ---------- Mobile menu (sage full-screen panel) ---------- */
  (function menu() {
    var toggle = $('[data-burger]'), panel = $('[data-nav]');
    if (!toggle || !panel) return;
    AV.menu({ toggle: toggle, panel: panel, breakpoint: 1200 });
  })();

  /* ---------- Reveals (rise / chevron wipe) + partner stagger ---------- */
  (function reveals() {
    var sel = '[data-reveal], [data-reveal-group]';
    AV.reveal(sel);
    // Safety net for very fast scrolling / jumps: reveal everything that is above the viewport bottom.
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

  /* ---------- Scroll spy: main nav on home, chip nav on case studies ---------- */
  (function spy() {
    var navLinks = $$('.nav__link[href^="#"]');
    if (navLinks.length) AV.spy(navLinks);
    var chips = $$('[data-case-nav] a');
    if (chips.length) {
      AV.spy(chips, {
        rootMargin: '-35% 0px -60% 0px',
        onChange: function (id, active) {
          // keep the active chip visible inside the horizontally scrollable bar (mobile)
          var a = active[0], bar = a && a.parentNode;
          if (!a || !bar || bar.scrollWidth <= bar.clientWidth) return;
          bar.scrollTo({ left: a.offsetLeft - 16, behavior: AV.reduced() ? 'auto' : 'smooth' });
        }
      });
    }
  })();

  /* ---------- Count-up numbers (final value is in the HTML) ---------- */
  (function counters() {
    AV.counters('[data-count]', 1300);
  })();

  /* ---------- Kinetic band: pause button, pause off-screen ---------- */
  (function band() {
    $$('[data-band]').forEach(function (band) {
      var btn = $('[data-band-toggle]', band);
      if (btn) {
        btn.addEventListener('click', function () {
          var paused = band.classList.toggle('is-paused');
          btn.setAttribute('aria-pressed', String(paused));
          btn.setAttribute('aria-label', paused ? 'Laufband abspielen' : 'Laufband anhalten');
        });
      }
      if (!('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { band.classList.toggle('is-offscreen', !en.isIntersecting); });
      });
      io.observe(band);
      window.addEventListener('pagehide', function () { io.disconnect(); }, { once: true });
    });
  })();

  /* ---------- Magnetic primary CTA (fine pointers only, small offset) ---------- */
  (function magnetic() {
    var els = $$('[data-magnetic]');
    if (!els.length || !window.matchMedia) return;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    var MAX = 8; // px
    var bound = false;

    function move(e) {
      var el = e.currentTarget, r = el.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.setProperty('--mx', (Math.max(-1, Math.min(1, dx)) * MAX).toFixed(1) + 'px');
      el.style.setProperty('--my', (Math.max(-1, Math.min(1, dy)) * MAX * 0.6).toFixed(1) + 'px');
    }
    function reset(e) {
      var el = e.currentTarget || e;
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    }
    function bind() {
      var on = fine.matches && !AV.reduced();
      if (on === bound) return;
      bound = on;
      els.forEach(function (el) {
        if (on) { el.addEventListener('pointermove', move); el.addEventListener('pointerleave', reset); el.addEventListener('blur', reset); }
        else { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset); el.removeEventListener('blur', reset); reset(el); }
      });
    }
    bind();
    if (fine.addEventListener) fine.addEventListener('change', bind);
  })();

  /* ---------- Contact form (honest "not connected" status from core.js) ---------- */
  (function form() {
    var f = $('#contact-form');
    if (f) AV.form(f);
  })();

  /* ---------- Legal pages: load text from the original pages ---------- */
  (function legal() {
    if (!$('[data-legal-src]')) return;
    AV.loadLegal();
  })();
})();
