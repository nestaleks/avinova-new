/* =========================================================
   Concept H — case-studies article
   Sticky chapter TOC with active state + per-case reading progress.
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;

  (function toc() {
    var list = AV.$('[data-toc]');
    if (!list) return;
    var links = AV.$$('a[href^="#"]', list);
    var cases = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });

    AV.spy(links, {
      rootMargin: '-35% 0px -60% 0px',
      onChange: function (id, active) {
        // horizontal TOC on smaller screens: keep the active chapter in view
        var a = active[0];
        if (!a || list.scrollWidth <= list.clientWidth) return;
        list.scrollTo({ left: a.parentNode.offsetLeft - 16, behavior: AV.reduced() ? 'auto' : 'smooth' });
      }
    });

    AV.onScroll(function () {
      var vh = window.innerHeight;
      links.forEach(function (a, i) {
        var s = cases[i];
        if (!s) return;
        var r = s.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (vh * 0.4 - r.top) / r.height));
        a.style.setProperty('--p', p.toFixed(3));
      });
    });
  })();
})();
