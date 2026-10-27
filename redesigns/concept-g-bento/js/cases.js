/* Concept G — case studies dashboard: sidebar / pill switcher with scroll-spy and
   per-case reading progress. Count-ups, index bars, rings and the timeline line are
   driven by site.js (AV.reveal → .is-in, AV.counters). */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;

  var links = AV.$$('[data-side-link]');
  var cases = AV.$$('[data-case]');
  if (!links.length || !cases.length) return;

  AV.spy(links, {
    rootMargin: '-35% 0px -50% 0px',   // band taller than the gap between cases
    onChange: function (id, arr) {
      var a = arr[0];
      if (!a || window.innerWidth > 1100) return;
      // keep the active pill visible in the horizontal switcher
      var list = a.closest('.side__list');
      if (list && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: Math.max(0, a.parentNode.offsetLeft - 8), behavior: AV.reduced() ? 'auto' : 'smooth' });
      }
    }
  });

  var bars = cases.map(function (s) { return AV.$('[data-prog="' + s.id + '"]'); });
  AV.onScroll(function () {
    var mid = window.innerHeight * 0.5;
    cases.forEach(function (s, i) {
      if (!bars[i]) return;
      var r = s.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      bars[i].style.setProperty('--p', p.toFixed(3));
    });
  });
})();
