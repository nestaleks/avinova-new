/* =========================================================
   AVINOVA — Concept C "Dynamic Interactive"
   Global behaviour for every page of the concept.
   Builds on ../shared/core.js (window.AV). One IIFE per feature,
   each guarded for missing elements.
   Exposes window.AVC.tabs() for home.js / cases.js.
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;
  var AVC = window.AVC = window.AVC || {};

  /* ---------- Generic accessible tabs (roving tabindex, automatic activation) ----------
     tablist: element with role="tablist" containing [role="tab"] (button or a) with aria-controls.
     opts.onSelect(index, previousIndex, byUser)  – called after state changed
     opts.managePanels (default true) – toggle [hidden] on panels
     Arrow keys follow aria-orientation (vertical: Up/Down, horizontal: Left/Right), Home/End always. */
  AVC.tabs = function (tablist, opts) {
    if (!tablist) return null;
    opts = opts || {};
    var tabs = AV.$$('[role="tab"]', tablist);
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var manage = opts.managePanels !== false;
    var current = -1;

    function select(i, o) {
      o = o || {};
      i = (i + tabs.length) % tabs.length;
      var prev = current;
      current = i;
      tabs.forEach(function (t, k) {
        var on = k === i && !o.none;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = (k === i) ? 0 : -1;
        if (manage && panels[k]) panels[k].hidden = !on;
      });
      if (o.focus) tabs[i].focus();
      keepVisible(tabs[i], o.byUser);
      if (opts.onSelect) opts.onSelect(i, prev, !!o.byUser, o);
    }
    // horizontally scrolling tab rows: bring the active tab into view without moving the page
    function keepVisible(tab, smooth) {
      if (tablist.scrollWidth <= tablist.clientWidth + 1) return;
      var left = tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2;
      tablist.scrollTo({ left: Math.max(0, left), behavior: smooth && !AV.reduced() ? 'smooth' : 'auto' });
    }

    tabs.forEach(function (t, k) {
      t.addEventListener('click', function (e) { e.preventDefault(); select(k, { byUser: true }); });
    });
    tablist.addEventListener('keydown', function (e) {
      var k = tabs.indexOf(document.activeElement);
      if (k < 0) return;
      var vertical = tablist.getAttribute('aria-orientation') === 'vertical';
      var next = null;
      switch (e.key) {
        case 'ArrowRight': if (!vertical) next = k + 1; break;
        case 'ArrowLeft': if (!vertical) next = k - 1; break;
        case 'ArrowDown': if (vertical) next = k + 1; break;
        case 'ArrowUp': if (vertical) next = k - 1; break;
        case 'Home': next = 0; break;
        case 'End': next = tabs.length - 1; break;
        case ' ': if (tabs[k].tagName === 'A') { e.preventDefault(); select(k, { byUser: true }); } return;
        default: return;
      }
      if (next === null) return;
      e.preventDefault();
      select(next, { focus: true, byUser: true });
    });

    var initial = tabs.findIndex ? tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; }) : 0;
    if (opts.initial !== undefined) initial = opts.initial;
    if (!opts.noInit) select(initial < 0 ? 0 : initial);

    return {
      tabs: tabs, panels: panels, select: select,
      index: function () { return current; },
      next: function (o) { select(current + 1, o); },
      prev: function (o) { select(current - 1, o); }
    };
  };

  /* ---------- Header: shadow state + scroll progress ---------- */
  (function () {
    var header = AV.$('[data-header]');
    if (!header) return;
    AV.headerState(header, 8, 'is-scrolled');
    var bar = AV.$('[data-progress]', header);
    if (!bar) return;
    var max = 1;
    function measure() { max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
    measure();
    AV.onResize(measure, 100);
    window.addEventListener('load', measure);
    AV.onScroll(function (y) { bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, y / max)).toFixed(4) + ')'; });
    // page height changes when tabs switch / legal text loads
    if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); }).observe(document.body);
  })();

  /* ---------- Mobile menu ---------- */
  (function () {
    var toggle = AV.$('[data-burger]'), panel = AV.$('[data-nav]');
    if (!toggle || !panel) return;
    AV.menu({ toggle: toggle, panel: panel, breakpoint: 1100 });
  })();

  /* ---------- Section reveal (staggered via [data-stagger]) ---------- */
  AV.reveal('[data-reveal]');

  /* ---------- Scroll spy for in-page nav (home only) ---------- */
  (function () {
    var links = AV.$$('[data-nav] .nav__list a[href^="#"]');
    if (links.length) AV.spy(links);
  })();

  /* ---------- Count-up numbers ---------- */
  AV.counters('[data-count]', 1600);

  /* ---------- Contact form: validation, character counter, loading state ---------- */
  (function () {
    var form = AV.$('[data-contact-form]');
    if (!form) return;
    var btn = AV.$('[data-submit]', form);
    var label = btn && AV.$('.btn__label', btn);
    var status = AV.$('[data-form-status]', form);
    var msg = AV.$('textarea[maxlength]', form);
    var counter = AV.$('[data-counter]', form);

    if (msg && counter) {
      var max = +msg.getAttribute('maxlength');
      var update = function () {
        var n = msg.value.length;
        counter.textContent = n + ' / ' + max;
        counter.classList.toggle('is-near', n >= max * 0.9 && n < max);
        counter.classList.toggle('is-full', n >= max);
      };
      msg.addEventListener('input', update);
      update();
    }

    var timer = null;
    AV.form(form, {
      onValid: function () {
        if (!btn || !status) return;
        // core.js has already written the honest "not connected" message; hold it back briefly
        // while the button shows a short loading state, then reveal it (announced by the live region).
        var text = status.textContent;
        status.textContent = '';
        status.classList.remove('is-ok');
        btn.classList.add('is-loading');
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        var original = label ? label.textContent : '';
        if (label) label.textContent = 'Einen Moment …';
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.classList.remove('is-loading');
          btn.disabled = false;
          btn.removeAttribute('aria-busy');
          if (label) label.textContent = original;
          status.textContent = text;
          status.classList.add('is-ok');
        }, 900);
      }
    });
  })();

  /* ---------- Lightbox (native <dialog> via AV.openDialog) ---------- */
  (function () {
    var dialog = AV.$('[data-lightbox-dialog]');
    if (!dialog) return;
    var img = AV.$('[data-lightbox-img]', dialog);
    var cap = AV.$('[data-lightbox-caption]', dialog);
    var close = AV.$('[data-lightbox-close]', dialog);

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-lightbox]');
      if (!trigger) return;
      var swipe = trigger.closest('[data-swipe]');
      if (swipe && swipe.getAttribute('data-dragged') === '1') return;   // ignore the click that ends a swipe
      var src = trigger.getAttribute('data-src');
      var alt = trigger.getAttribute('data-alt') || '';
      img.src = src;
      img.alt = alt;
      cap.textContent = alt;
      if (!AV.openDialog(dialog, trigger)) window.location.href = src;  // very old browsers: open the image
    });
    if (close) close.addEventListener('click', function () { dialog.close(); });
  })();

  /* ---------- 3D tilt on case cards (fine pointers only, ≤ 6°) ---------- */
  (function () {
    var cards = AV.$$('[data-tilt]');
    if (!cards.length || !window.matchMedia) return;
    var fine = window.matchMedia('(hover:hover) and (pointer:fine)');
    var MAX = 5;
    cards.forEach(function (card) {
      var raf = 0, px = 0, py = 0;
      function apply() {
        raf = 0;
        card.style.transform = 'perspective(1200px) rotateX(' + (-py * MAX).toFixed(2) + 'deg) rotateY(' + (px * MAX).toFixed(2) + 'deg)';
      }
      card.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse' || !fine.matches || AV.reduced()) return;
        var r = card.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1 … 1
        py = ((e.clientY - r.top) / r.height - 0.5) * 2;
        card.classList.add('is-tilting');
        if (!raf) raf = requestAnimationFrame(apply);
      });
      card.addEventListener('pointerleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        card.classList.remove('is-tilting');
        card.style.transform = '';                           // springs back via CSS transition
      });
    });
  })();

  /* ---------- Partner marquee: pause button + pause while off-screen ---------- */
  (function () {
    var marquee = AV.$('[data-marquee]');
    if (!marquee) return;
    var btn = AV.$('[data-marquee-toggle]', marquee);
    if (btn) btn.addEventListener('click', function () {
      var paused = marquee.classList.toggle('is-paused');
      btn.setAttribute('aria-label', paused ? 'Logo-Laufband abspielen' : 'Logo-Laufband anhalten');
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        marquee.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }).observe(marquee);
    }
  })();

  /* ---------- Legal pages: load text from the original page ---------- */
  (function () {
    if (!AV.$('[data-legal-src]')) return;
    AV.loadLegal({
      onLoad: function (host) {
        // some source TOCs are already numbered ("1. Allgemeine Hinweise") → drop the CSS counter there
        var toc = AV.$('[data-legal="toc"]', host), first = toc && AV.$('a', toc);
        if (first && /^\s*\d/.test(first.textContent)) toc.classList.add('is-numbered');
      }
    });
    // reading progress through the legal text (header bar shows page progress)
    var bar = AV.$('[data-reading]'), body = AV.$('[data-legal="body"]');
    if (!bar || !body) return;
    AV.onScroll(function () {
      var r = body.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var p = total > 0 ? (window.innerHeight * 0.4 - r.top) / total : 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)).toFixed(4) + ')';
    });
  })();
})();
