/* Concept G — behaviour shared by all pages:
   island header (menu sheet + sliding active indicator), reveals, count-up numbers. */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;
  var BP = 1020;

  /* ---------- island header ---------- */
  var island = AV.$('[data-island]');
  if (island) {
    AV.headerState(island, 10, 'is-scrolled');
    var menu = AV.menu({ toggle: AV.$('.burger', island), panel: AV.$('#nav'), breakpoint: BP });
    var scrim = AV.$('[data-scrim]');
    if (scrim && menu) scrim.addEventListener('click', function () { menu.close(); });

    /* sliding indicator behind the active / hovered nav link */
    var track = AV.$('[data-navtrack]', island);
    var ind = AV.$('[data-indicator]', island);
    var links = track ? AV.$$('.nav__list a', track) : [];
    var active = null, placedOnce = false;

    var place = function (a) {
      if (!ind) return;
      if (!a || window.innerWidth <= BP) { ind.classList.remove('is-on'); return; }
      var tr = track.getBoundingClientRect(), r = a.getBoundingClientRect();
      if (!placedOnce) {                      // first placement: appear in place, don't slide in from 0
        ind.style.transition = 'none';
        requestAnimationFrame(function () { requestAnimationFrame(function () { ind.style.transition = ''; }); });
        placedOnce = true;
      }
      ind.style.setProperty('--x', (r.left - tr.left) + 'px');
      ind.style.setProperty('--w', r.width + 'px');
      ind.classList.add('is-on');
    };
    var clearActive = function () {
      links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
      active = null;
      place(null);
    };

    links.forEach(function (a) {
      a.addEventListener('mouseenter', function () { place(a); });
      a.addEventListener('focus', function () { place(a); });
    });
    if (track) {
      track.addEventListener('mouseleave', function () { place(active); });
      track.addEventListener('focusout', function (e) { if (!track.contains(e.relatedTarget)) place(active); });
    }

    // same-page links (home) follow the section in view
    var samePage = links.filter(function (a) { return (a.getAttribute('href') || '').charAt(0) === '#'; });
    if (samePage.length) {
      AV.spy(samePage, { onChange: function (id, arr) { active = arr[0] || null; place(active); } });
      AV.onScroll(function (y) { if (active && y < window.innerHeight * 0.35) clearActive(); });
    }
    AV.onResize(function () { place(active); }, 120);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (active) place(active); });
  }

  /* ---------- reveals + numbers ---------- */
  AV.reveal('[data-reveal]', { threshold: 0.08 });
  AV.counters('[data-count]', 1400);
})();
