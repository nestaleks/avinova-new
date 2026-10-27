/* =========================================================
   AVINOVA — Concept B "Modern Premium"
   One IIFE per feature; every feature is guarded for missing elements.
   Relies on ../shared/core.js (window.AV).
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;
  var $ = AV.$, $$ = AV.$$;

  /* ---------- Header: transparent over the dark hero, solid after scroll ---------- */
  (function header() {
    var el = $('[data-header]');
    if (!el) return;
    AV.headerState(el, 40, 'is-solid');
  })();

  /* ---------- Full-screen overlay menu (≤1099px) ---------- */
  (function menu() {
    var toggle = $('.menu-toggle');
    var panel = $('#site-nav');
    if (!toggle || !panel) return;
    AV.menu({ toggle: toggle, panel: panel, breakpoint: 1099 });
  })();

  /* ---------- Reveals: fade-rise, image unmask, headline lines ---------- */
  (function reveals() {
    var sel = '[data-reveal], [data-mask], [data-lines]';
    AV.reveal(sel);
    // Safety net for fast jumps (anchor links, quick flings): anything that has already
    // passed the bottom of the viewport is revealed even if the observer skipped it.
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

  /* ---------- Scroll spy for in-page navigation ---------- */
  (function spy() {
    // clears the highlight while the reader is above the first tracked section (e.g. in the hero)
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
    // header links only on the home page (elsewhere they point to other pages)
    var navLinks = document.body.classList.contains('page-home') ? $$('.nav__link[href^="#"]') : [];
    if (navLinks.length) { AV.spy(navLinks); clearAbove(navLinks); }
    var caseLinks = $$('[data-case-nav] a');
    if (caseLinks.length) {
      var strip = caseLinks[0].parentElement;
      AV.spy(caseLinks, {
        rootMargin: '-35% 0px -60% 0px',
        // on narrow screens the chip strip scrolls sideways: keep the active case in view
        onChange: function (id, active) {
          if (!active[0] || strip.scrollWidth <= strip.clientWidth) return;
          var pad = parseFloat(getComputedStyle(strip).paddingLeft) || 0;
          strip.scrollTo({ left: active[0].offsetLeft - pad - strip.offsetLeft, behavior: AV.reduced() ? 'auto' : 'smooth' });
        }
      });
      clearAbove(caseLinks);
    }
  })();

  /* ---------- Count-up numbers (final value is in the HTML) ---------- */
  (function counters() {
    AV.counters('[data-count]', 1600);
  })();

  /* ---------- Slow image parallax (transform only, max 40px) ----------
     data-parallax="24" → the image travels between -24px and +24px while its frame
     crosses the viewport. Only frames currently on screen are updated. */
  (function parallax() {
    var imgs = $$('[data-parallax]');
    if (!imgs.length || AV.reduced() || !('IntersectionObserver' in window)) return;

    var visible = new Set();
    var items = imgs.map(function (img) {
      var max = Math.min(40, parseFloat(img.getAttribute('data-parallax')) || 24);
      return { img: img, frame: img.parentElement, max: max };
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var item = items.find(function (it) { return it.frame === en.target; });
        if (!item) return;
        if (en.isIntersecting) visible.add(item); else visible.delete(item);
      });
      update();
    }, { rootMargin: '10% 0px' });
    items.forEach(function (it) { io.observe(it.frame); });

    // overscan: scale each image just enough that ±max never exposes the frame edge
    function measure() {
      items.forEach(function (it) {
        var h = it.frame.offsetHeight || 1;
        it.img.style.setProperty('--ps', (1 + (2 * it.max + 6) / h).toFixed(3));
      });
    }
    function update() {
      var vh = window.innerHeight;
      visible.forEach(function (it) {
        var r = it.frame.getBoundingClientRect();
        // -1 (frame above centre) … 1 (frame below centre)
        var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        p = Math.max(-1, Math.min(1, p));
        it.img.style.setProperty('--py', (-p * it.max).toFixed(1) + 'px');
      });
    }
    measure();
    AV.onScroll(update);
    AV.onResize(function () { measure(); update(); });
  })();

  /* ---------- Home: cursor-following case preview (fine pointers only) ---------- */
  (function casePreview() {
    var list = $('[data-case-list]');
    var preview = $('[data-case-preview]');
    if (!list || !preview || !window.matchMedia) return;
    var mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    var imgs = $$('img', preview);
    var x = 0, y = 0, cx = 0, cy = 0, raf = 0, active = false, minX = 0;

    // never cover the hovered title: the preview starts right of its text
    function titleRight(link) {
      var title = link.querySelector('.case-row__title');
      if (!title || !document.createRange) return 0;
      var range = document.createRange();
      range.selectNodeContents(title);
      return range.getBoundingClientRect().right + 14 + 32;   // + hover shift + breathing room
    }
    function targetX(w) { return Math.min(Math.max(x + 40, minX), window.innerWidth - w - 24); }

    function place() {
      var w = preview.offsetWidth, h = preview.offsetHeight;
      // sit to the right of the cursor, vertically centred, always inside the viewport
      var tx = targetX(w);
      var ty = Math.max(16, Math.min(y - h / 2, window.innerHeight - h - 16));
      if (AV.reduced()) { cx = tx; cy = ty; }
      else { cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14; }
      preview.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      var settled = Math.abs(tx - cx) < 0.3 && Math.abs(ty - cy) < 0.3;
      raf = (active || !settled) ? requestAnimationFrame(place) : 0;
    }
    function start() { if (!raf) raf = requestAnimationFrame(place); }

    function show(index, link) {
      if (link) minX = titleRight(link);
      imgs.forEach(function (img, i) { img.classList.toggle('is-active', i === index); });
      if (!active) {                       // jump to the cursor on first show
        cx = targetX(preview.offsetWidth);
        cy = y - preview.offsetHeight / 2;
      }
      active = true;
      preview.classList.add('is-visible');
      start();
    }
    function hide() {
      active = false;
      preview.classList.remove('is-visible');
    }

    function onMove(e) { x = e.clientX; y = e.clientY; if (active) start(); }
    function onOver(e) {
      var link = e.target.closest('[data-preview]');
      if (link) show(parseInt(link.getAttribute('data-preview'), 10) || 0, link);
    }

    // while scrolling the row under the (static) cursor changes — follow it
    function onScroll() {
      if (!active) return;
      var el = document.elementFromPoint(x, y);
      var link = el && el.closest('[data-preview]');
      if (link && list.contains(link)) show(parseInt(link.getAttribute('data-preview'), 10) || 0, link);
      else hide();
    }

    var bound = false;
    function bind() {
      if (bound) return;
      bound = true;
      imgs.forEach(function (img) { img.loading = 'eager'; });   // warm up the three previews
      list.addEventListener('pointermove', onMove);
      list.addEventListener('pointerover', onOver);
      list.addEventListener('pointerleave', hide);
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    function unbind() {
      if (!bound) return;
      bound = false;
      hide();
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerover', onOver);
      list.removeEventListener('pointerleave', hide);
      window.removeEventListener('scroll', onScroll);
    }

    if (mq.matches) bind();
    var onChange = function () { if (mq.matches) bind(); else unbind(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  })();

  /* ---------- Contact form (validation only — sending is not connected) ---------- */
  (function contactForm() {
    var form = $('#contact-form');
    if (form) AV.form(form);
  })();

  /* ---------- Legal pages: load the original text, mark the page switcher ---------- */
  (function legal() {
    if (!$('[data-legal-src]')) return;
    AV.loadLegal();
  })();
})();
