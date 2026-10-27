/* =========================================================
   AVINOVA — Concept H „Organic Editorial“ — shared page behaviour
   Built on ../shared/core.js (window.AV). Every feature is an
   independent block that does nothing when its markup is missing.
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;

  /* ---------- Reading-progress bar ---------- */
  (function progress() {
    var bar = AV.$('[data-progress]');
    if (!bar) return;
    AV.onScroll(function (y) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    });
  })();

  /* ---------- Header background after scrolling ---------- */
  AV.headerState(AV.$('[data-header]'), 12, 'is-scrolled');

  /* ---------- Chapter menu overlay (mobile menu + optional on desktop) ---------- */
  (function chapters() {
    AV.menu({
      toggle: AV.$('[data-menu-toggle]'),
      panel: AV.$('[data-menu]'),
      breakpoint: 1e6,                 // the overlay is available at every width
      labels: { open: 'Kapitelübersicht öffnen', close: 'Kapitelübersicht schließen' }
    });
    // highlight the chapter currently being read inside the overlay as well
    var links = AV.$$('[data-menu] a[href^="#"]');
    if (links.length) AV.spy(links);
  })();

  /* ---------- Scroll-spy for the inline nav ---------- */
  (function spy() {
    var links = AV.$$('[data-spy] a[href^="#"]');
    if (links.length) AV.spy(links);
  })();

  /* ---------- Reveals + count-up figures ---------- */
  AV.reveal('[data-reveal]');
  AV.counters('[data-count]', 1800);

  /* ---------- Letter-style contact form (honest status, no backend) ---------- */
  AV.form(AV.$('[data-contact-form]'));

  /* ---------- Legal pages: text from the original page ---------- */
  if (AV.$('[data-legal-src]')) {
    AV.loadLegal({
      onLoad: function (host) {
        // drop cap only on a real opening paragraph (not on a one-line name)
        var first = AV.$('[data-legal="body"] p', host);
        if (first && first.textContent.trim().length > 120) first.classList.add('dropcap');
        // the original headings are already numbered ("1. …") → hide our own counter
        var toc = AV.$('[data-legal="toc"]', host), a = toc && AV.$('a', toc);
        if (a && /^\d/.test(a.textContent.trim())) toc.classList.add('is-numbered');
      }
    });
  }
})();
