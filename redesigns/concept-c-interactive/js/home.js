/* =========================================================
   Concept C — Home page widgets
   1. Process stepper (ARIA tabs + optional autoplay with pause button)
   2. Case showcase (tabs + previous/next + touch swipe)
   Requires ../shared/core.js and js/ui.js (window.AVC.tabs).
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV, AVC = window.AVC;
  if (!AV || !AVC || !AVC.tabs) return;

  /* ---------- 1. Process stepper ---------- */
  (function () {
    var root = AV.$('[data-stepper]');
    if (!root) return;
    var tablist = AV.$('[role="tablist"]', root);
    var btn = AV.$('[data-autoplay-toggle]', root);
    var btnLabel = btn && AV.$('[data-autoplay-label]', btn);
    var STEP_MS = 6000;
    var playing = false;
    var holds = { offscreen: true, hover: false, hidden: document.hidden };

    // vertical list on desktop, horizontal pill row on small screens
    var mqRow = window.matchMedia('(max-width:900px)');
    function orient() { tablist.setAttribute('aria-orientation', mqRow.matches ? 'horizontal' : 'vertical'); }
    orient();
    if (mqRow.addEventListener) mqRow.addEventListener('change', orient); else if (mqRow.addListener) mqRow.addListener(orient);

    var tabs = AVC.tabs(tablist, {
      onSelect: function (i, prev, byUser) {
        var panel = tabs && tabs.panels[i];             // undefined during the initial select
        if (panel && prev !== i && !AV.reduced()) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth;                       // restart the entrance animation
          panel.classList.add('is-entering');
        }
        if (byUser) setPlaying(false);                  // any interaction stops autoplay
      }
    });
    tabs.panels.forEach(function (p) {
      p.addEventListener('animationend', function (e) { if (e.target === p) p.classList.remove('is-entering'); });
    });

    function updateHold() {
      root.classList.toggle('is-holding', holds.offscreen || holds.hover || holds.hidden);
    }
    function setPlaying(on) {
      playing = on && !AV.reduced();
      root.classList.toggle('is-autoplay', playing);
      if (btn) {
        btn.classList.toggle('is-stopped', !playing);
        if (btnLabel) btnLabel.textContent = playing ? 'Automatik pausieren' : 'Automatik starten';
      }
    }

    // the CSS progress fill of the active tab drives the timing; when it ends, advance
    root.style.setProperty('--step-ms', STEP_MS + 'ms');
    root.addEventListener('animationend', function (e) {
      if (e.animationName !== 'fill' || !playing) return;
      if (AV.reduced()) { setPlaying(false); return; }
      tabs.select(tabs.index() + 1);
    });

    if (AV.reduced()) { setPlaying(false); return; }   // no autoplay (and no button) under reduced motion
    if (btn) {
      btn.hidden = false;
      // resuming restarts the progress fill of the current step (the CSS animation is re-applied)
      btn.addEventListener('click', function () { setPlaying(!playing); });
    }
    root.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { holds.hover = true; updateHold(); } });
    root.addEventListener('pointerleave', function () { holds.hover = false; updateHold(); });
    document.addEventListener('visibilitychange', function () { holds.hidden = document.hidden; updateHold(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { holds.offscreen = !en[0].isIntersecting; updateHold(); }, { threshold: 0.35 }).observe(root);
    } else { holds.offscreen = false; }
    updateHold();
    setPlaying(true);
  })();

  /* ---------- 2. Case showcase ---------- */
  (function () {
    var root = AV.$('[data-showcase]');
    if (!root) return;
    var tablist = AV.$('[role="tablist"]', root);
    var track = AV.$('.showcase__track', root);
    var viewport = AV.$('[data-swipe]', root);
    var countEl = AV.$('[data-count-current]', root);
    var slides = AV.$$('.slide', root);

    var tabs = AVC.tabs(tablist, {
      managePanels: false,                             // slides stay rendered for the slide animation
      onSelect: function (i) {
        track.style.transform = 'translateX(' + (-i * 100) + '%)';
        slides.forEach(function (s, k) {
          if (k === i) { s.removeAttribute('inert'); s.removeAttribute('aria-hidden'); }
          else { s.setAttribute('inert', ''); s.setAttribute('aria-hidden', 'true'); }
        });
        if (countEl) countEl.textContent = String(i + 1);
      }
    });

    var prev = AV.$('[data-prev]', root), next = AV.$('[data-next]', root);
    if (prev) prev.addEventListener('click', function () { tabs.prev({ byUser: true }); });
    if (next) next.addEventListener('click', function () { tabs.next({ byUser: true }); });

    /* touch / pen swipe (mouse users have the buttons and tabs) */
    if (!viewport || !window.PointerEvent) return;
    var startX = 0, startY = 0, dx = 0, active = false, dragging = false, id = null;
    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      active = true; dragging = false; dx = 0; id = e.pointerId;
      startX = e.clientX; startY = e.clientY;
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!active || e.pointerId !== id) return;
      dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (!dragging) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
        dragging = true;
        track.classList.add('is-dragging');
        viewport.setAttribute('data-dragged', '1');
      }
      var resist = dx / (1 + Math.abs(dx) / (viewport.clientWidth * 1.4));   // rubber-band feel
      track.style.transform = 'translateX(calc(' + (-tabs.index() * 100) + '% + ' + resist + 'px))';
    });
    function end() {
      if (!active) return;
      active = false;
      if (!dragging) return;
      track.classList.remove('is-dragging');
      var limit = Math.min(80, viewport.clientWidth * 0.18);
      if (dx < -limit) tabs.next({ byUser: true });
      else if (dx > limit) tabs.prev({ byUser: true });
      else tabs.select(tabs.index());                  // snap back
      setTimeout(function () { viewport.removeAttribute('data-dragged'); }, 60);
    }
    viewport.addEventListener('pointerup', end);
    viewport.addEventListener('pointercancel', end);
  })();
})();
