/* =========================================================
   AVINOVA — Concept F "Noir Cinematic"
   One IIFE per feature; each one is guarded for missing elements, so the
   same file serves home, case studies and legal pages.
   Relies on ../shared/core.js (window.AV).
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;
  var $ = AV.$, $$ = AV.$$;
  var root = document.documentElement;
  var finePointer = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : { matches: false };
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function scrollBehavior() { return AV.reduced() ? 'auto' : 'smooth'; }

  /* ---------- Header: transparent → blurred surface; hides on scroll down, returns on scroll up ---------- */
  var header = $('[data-header]');
  (function headerState() {
    if (!header) return;
    var last = window.scrollY;
    AV.onScroll(function (y) {
      header.classList.toggle('is-solid', y > 40);
      var d = y - last;
      if (Math.abs(d) < 6 && y > 0) return;               // ignore jitter
      var hide = d > 0 && y > 360 && !root.classList.contains('menu-open');
      header.classList.toggle('is-hidden', hide);
      root.classList.toggle('hdr-hidden', hide);
      last = y;
    });
    // keyboard users: reveal the header as soon as focus enters it
    header.addEventListener('focusin', function () {
      header.classList.remove('is-hidden'); root.classList.remove('hdr-hidden');
    });
  })();

  /* ---------- Full-screen overlay menu (≤1099px) ---------- */
  (function menu() {
    var toggle = $('[data-menu-toggle]'), panel = $('#site-nav');
    if (!toggle || !panel) return;
    AV.menu({
      toggle: toggle, panel: panel, breakpoint: 1099,
      onToggle: function () { if (header) header.classList.remove('is-hidden'); root.classList.remove('hdr-hidden'); }
    });
  })();

  /* ---------- Reveals (fade-rise, line masks, curtain, zoom) ---------- */
  (function reveals() {
    var sel = '[data-reveal]';
    AV.reveal(sel);
    // safety net for fast jumps (anchor links, flings): anything already above the
    // bottom of the viewport is revealed even if the observer skipped it
    var pending = $$(sel).filter(function (el) { return !el.classList.contains('is-in'); });
    if (!pending.length) return;
    var off = AV.onScroll(function () {
      var limit = window.innerHeight;
      pending = pending.filter(function (el) {
        if (el.classList.contains('is-in')) return false;
        if (el.getBoundingClientRect().top < limit) { el.classList.add('is-in'); return false; }
        return true;
      });
      if (!pending.length && off) { off(); off = null; }
    });
  })();

  /* ---------- Ken Burns: pause the loop while the hero is off screen ---------- */
  (function kenBurns() {
    var hero = $('[data-hero]');
    if (!hero || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (en) {
      hero.classList.toggle('is-paused', !en[0].isIntersecting);
    }).observe(hero);
  })();

  /* ---------- Scroll spy: header links (home) + case chips ---------- */
  (function spy() {
    function clearAbove(links) {
      var first = links.map(function (a) { return document.getElementById((a.getAttribute('href') || '').split('#')[1]); })
        .filter(Boolean).sort(function (a, b) { return a.offsetTop - b.offsetTop; })[0];
      if (!first) return;
      AV.onScroll(function () {
        if (first.getBoundingClientRect().top > window.innerHeight * 0.5) {
          links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        }
      });
    }
    if (document.body.classList.contains('page-home')) {
      var nav = $$('.nav__link[href^="#"]');
      if (nav.length) { AV.spy(nav); clearAbove(nav); }
    }
    var chips = $$('[data-case-nav] a');
    if (chips.length) {
      var strip = chips[0].parentElement;
      AV.spy(chips, {
        rootMargin: '-35% 0px -60% 0px',
        onChange: function (id, active) {          // keep the active chip visible in the scrolling strip
          if (!active[0] || strip.scrollWidth <= strip.clientWidth) return;
          strip.scrollTo({ left: active[0].offsetLeft - strip.offsetLeft - 16, behavior: scrollBehavior() });
        }
      });
      clearAbove(chips);
    }
  })();

  /* ---------- Count-up numbers (final value is in the HTML) ---------- */
  AV.counters('[data-count]', 1700);

  /* ---------- Process: sticky scrollytelling ---------- */
  (function scrolly() {
    var sec = $('[data-scrolly]');
    if (!sec || !('IntersectionObserver' in window)) return;
    var steps = $$('[data-step]', sec);
    var groups = ['[data-panel-num]', '[data-panel-icon]', '[data-panel-title]', '[data-panel-dot]'].map(function (s) { return $$(s, sec); });
    var current = -1;
    function set(i) {
      if (i === current) return;
      current = i;
      sec.setAttribute('data-active', String(i + 1));
      steps.forEach(function (s, j) { s.classList.toggle('is-current', j === i); });
      groups.forEach(function (els) {
        els.forEach(function (el, j) { el.classList.toggle('is-active', j === i); el.classList.toggle('is-past', j < i); });
      });
    }
    set(0);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) set(steps.indexOf(en.target)); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- Testimonial: quote revealed word by word with scroll progress ---------- */
  (function words() {
    var q = $('[data-words]');
    if (!q || AV.reduced()) return;                      // reduced motion / no JS: full opacity
    var list = [];
    Array.prototype.slice.call(q.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement('span');
        w.className = 'w'; w.textContent = part;
        frag.appendChild(w); list.push(w);
      });
      q.replaceChild(frag, node);
    });
    if (!list.length) return;
    q.classList.add('is-split');
    var lit = -1;
    AV.onScroll(function () {
      var r = q.getBoundingClientRect(), vh = window.innerHeight;
      if (r.top > vh || r.bottom < -vh) {                 // far away: settle on the obvious state
        var all = r.bottom < 0 ? list.length : 0;
        if (all !== lit) { lit = all; list.forEach(function (w, i) { w.classList.toggle('is-lit', i < lit); }); }
        return;
      }
      var p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3), 0, 1);
      var n = Math.round(p * list.length);
      if (n === lit) return;
      lit = n;
      list.forEach(function (w, i) { w.classList.toggle('is-lit', i < n); });
    });
  })();

  /* ---------- Case reel: buttons, progress, mouse drag, keyboard ---------- */
  $$('[data-reel]').forEach(function (reel) {
    var track = $('[data-reel-track]', reel);
    if (!track) return;
    var prev = $('[data-reel-prev]', reel), next = $('[data-reel-next]', reel), fill = $('[data-reel-fill]', reel);
    var items = $$('.reel__item', track);

    function maxScroll() { return track.scrollWidth - track.clientWidth; }
    function padStart() { return parseFloat(getComputedStyle(track).scrollPaddingLeft) || parseFloat(getComputedStyle(track).paddingLeft) || 0; }
    function update() {
      var m = maxScroll(), x = track.scrollLeft;
      var atStart = x <= 4, atEnd = x >= m - 4;
      [[prev, atStart, next], [next, atEnd, prev]].forEach(function (t) {
        if (!t[0]) return;
        if (t[1] && document.activeElement === t[0] && t[2] && !t[2].disabled) t[2].focus();
        t[0].disabled = t[1];
      });
      if (fill) fill.style.transform = 'scaleX(' + (m > 0 ? clamp((x + track.clientWidth) / track.scrollWidth, 0, 1) : 1).toFixed(3) + ')';
    }
    function targets() { var pad = padStart(); return items.map(function (it) { return Math.min(maxScroll(), Math.max(0, it.offsetLeft - pad)); }); }
    function go(dir) {
      var x = track.scrollLeft, t = targets(), dest;
      if (dir > 0) dest = t.filter(function (v) { return v > x + 4; })[0];
      else dest = t.filter(function (v) { return v < x - 4; }).pop();
      if (dest === undefined) dest = dir > 0 ? maxScroll() : 0;
      track.scrollTo({ left: dest, behavior: scrollBehavior() });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    var raf = 0;
    track.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; update(); }); }, { passive: true });
    AV.onResize(update);
    update();

    // keyboard: arrow keys move focus between cards (focus scrolls the card into view)
    track.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var links = $$('a', track), i = links.indexOf(document.activeElement);
      if (i < 0) return;
      var n = links[clamp(i + (e.key === 'ArrowRight' ? 1 : -1), 0, links.length - 1)];
      if (n) { e.preventDefault(); n.focus(); }
    });

    // mouse drag (touch uses native swipe); a real drag swallows the following click
    var startX = 0, startL = 0, moved = false, suppress = false, down = false;
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    function onMove(e) {
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('is-dragging'); }
      if (moved) track.scrollLeft = startL - dx;
    }
    function onUp() {
      if (!down) return;
      down = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (!moved) return;
      suppress = true; setTimeout(function () { suppress = false; }, 50);
      // settle on the nearest card, then hand control back to CSS snapping
      var x = track.scrollLeft, t = targets();
      var dest = t.reduce(function (a, b) { return Math.abs(b - x) < Math.abs(a - x) ? b : a; }, t[0]);
      track.scrollTo({ left: dest, behavior: scrollBehavior() });
      setTimeout(function () { track.classList.remove('is-dragging'); }, AV.reduced() ? 0 : 450);
      moved = false;
    }
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startL = track.scrollLeft;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });
    track.addEventListener('click', function (e) {
      if (suppress) { e.preventDefault(); e.stopPropagation(); suppress = false; }
    }, true);
  });

  /* ---------- Spotlight glow following the pointer (fine pointers only) ---------- */
  (function spotlight() {
    var els = $$('[data-spot]');
    if (!els.length || !finePointer.matches) return;
    root.classList.add('spot-on');
    els.forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
      });
    });
  })();

  /* ---------- Case timelines: the line draws with scroll, dots light up as it passes ---------- */
  (function timelines() {
    var lists = $$('[data-tl]');
    if (!lists.length || AV.reduced()) return;           // reduced motion / no JS: fully drawn
    var data = lists.map(function (list) {
      var tl = list.closest('.tl') || list;
      tl.classList.add('is-live');
      return { list: list, tl: tl, fill: $('[data-tl-fill]', list), items: $$('li', list), p: -1 };
    });
    AV.onScroll(function () {
      var vh = window.innerHeight;
      data.forEach(function (d) {
        var r = d.list.getBoundingClientRect();
        if (r.top > vh * 1.2 && d.p === 0) return;
        var p = clamp((vh * 0.62 - r.top) / Math.max(1, r.height), 0, 1);
        if (Math.abs(p - d.p) < 0.002) return;
        d.p = p;
        if (d.fill) d.fill.style.setProperty('--p', p.toFixed(3));
        d.items.forEach(function (li) {
          li.classList.toggle('is-lit', (li.offsetTop + 14) / r.height <= p + 0.001);
        });
      });
    });
  })();

  /* ---------- Contact form (client-side only, honest status) ---------- */
  $$('form[data-form]').forEach(function (f) { AV.form(f); });

  /* ---------- Legal pages: text from the original pages ---------- */
  if ($('[data-legal-src]')) AV.loadLegal();
})();
