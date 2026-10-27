/* =========================================================
   AVINOVA — Concept A „Refined Original“
   Page behaviour built on the shared helpers in ../shared/core.js (window.AV).
   Each feature is an independent IIFE that does nothing when its markup is missing.
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;

  /* ---------- Header: condenses after scrolling ---------- */
  (function header() {
    AV.headerState(AV.$('[data-header]'), 24, 'is-scrolled');
  })();

  /* ---------- Mobile menu: full-height sheet ---------- */
  (function menu() {
    AV.menu({
      toggle: AV.$('[data-menu-toggle]'),
      panel: AV.$('[data-menu]'),
      breakpoint: 1100
    });
  })();

  /* ---------- Scroll-spy for in-page nav links (home only) ---------- */
  (function spy() {
    var links = AV.$$('[data-spy] a[href^="#"]');
    if (links.length) AV.spy(links);
  })();

  /* ---------- Case-studies chip navigation ---------- */
  (function caseNav() {
    var chips = AV.$$('[data-case-nav] a');
    if (!chips.length) return;
    AV.spy(chips, {
      rootMargin: '-35% 0px -60% 0px',
      onChange: function (id, active) {
        // keep the active chip visible inside the horizontally scrollable bar
        var chip = active[0], bar = chip && chip.parentNode;
        if (!chip || bar.scrollWidth <= bar.clientWidth) return;
        bar.scrollTo({ left: chip.offsetLeft - 16, behavior: AV.reduced() ? 'auto' : 'smooth' });
      }
    });
  })();

  /* ---------- Reveals, process line, timelines ---------- */
  (function reveals() {
    // timeline dots light up one after another (delay via --i)
    AV.$$('.timeline ol').forEach(function (ol) {
      AV.$$('li', ol).forEach(function (li, i) { li.style.setProperty('--i', i); });
    });
    AV.reveal('[data-reveal]');
  })();

  /* ---------- Numbers count up once ---------- */
  (function counters() {
    AV.counters('[data-count]', 1600);
  })();

  /* ---------- Back-to-top button ---------- */
  (function toTop() {
    var btn = AV.$('[data-to-top]');
    if (!btn) return;
    AV.onScroll(function (y) { btn.classList.toggle('is-visible', y > window.innerHeight * 1.2); });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: AV.reduced() ? 'auto' : 'smooth' });
      var target = AV.$('#main');
      if (target) target.focus({ preventScroll: true });
    });
  })();

  /* ---------- Contact form (honest: not connected in the preview) ---------- */
  (function form() {
    AV.form(AV.$('[data-contact-form]'));
  })();

  /* ---------- Legal pages: text loaded from the original page ---------- */
  (function legal() {
    if (AV.$('[data-legal-src]')) AV.loadLegal();
  })();
})();
