/* =========================================================
   AVINOVA redesigns — shared behaviour (window.AV)
   Small, framework-free helpers used by all four concepts.
   Concept scripts call these; nothing here runs automatically.
   ========================================================= */
(function () {
  'use strict';

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var AV = {};

  /** true while the user prefers reduced motion (live value) */
  AV.reduced = function () { return !!mq.matches; };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  AV.$ = $; AV.$$ = $$;

  /* ---------- rAF-throttled scroll / resize ---------- */
  var scrollFns = [], ticking = false;
  function runScroll() { ticking = false; scrollFns.forEach(function (fn) { fn(window.scrollY); }); }
  /** fn(scrollY) is called once per frame while scrolling, and once immediately */
  AV.onScroll = function (fn) {
    if (!scrollFns.length) {
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } }, { passive: true });
    }
    scrollFns.push(fn); fn(window.scrollY);
    return function off() { scrollFns = scrollFns.filter(function (f) { return f !== fn; }); };
  };
  AV.onResize = function (fn, delay) {
    var t; function h() { clearTimeout(t); t = setTimeout(fn, delay || 150); }
    window.addEventListener('resize', h);
    return function off() { window.removeEventListener('resize', h); };
  };

  /** toggles `cls` on el once scrollY > threshold */
  AV.headerState = function (el, threshold, cls) {
    if (!el) return;
    AV.onScroll(function (y) { el.classList.toggle(cls || 'is-scrolled', y > (threshold || 8)); });
  };

  /* ---------- Mobile menu ----------
     opts: { toggle, panel, root=document.documentElement, openClass='menu-open', breakpoint=900,
             labels:{open,close}, onToggle(open) } */
  AV.menu = function (opts) {
    var toggle = opts.toggle, panel = opts.panel;
    if (!toggle || !panel) return null;
    var root = opts.root || document.documentElement;
    var cls = opts.openClass || 'menu-open';
    var labels = opts.labels || { open: 'Menü öffnen', close: 'Menü schließen' };
    var bp = opts.breakpoint || 900;
    var isOpen = false;

    function focusables() { return $$('a[href],button:not([disabled]),input,textarea,[tabindex]:not([tabindex="-1"])', panel).filter(function (el) { return el.offsetParent !== null; }); }
    function set(open, restoreFocus) {
      if (open === isOpen) return;
      isOpen = open;
      root.classList.toggle(cls, open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? labels.close : labels.open);
      if (open) { var f = focusables()[0]; if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 50); }
      else if (restoreFocus) toggle.focus({ preventScroll: true });
      if (opts.onToggle) opts.onToggle(open);
    }
    toggle.addEventListener('click', function () { set(!isOpen); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { set(false, true); return; }
      if (e.key === 'Tab') {                      // keep focus inside menu + toggle
        var items = [toggle].concat(focusables());
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    AV.onResize(function () { if (window.innerWidth > bp) set(false); }, 100);
    return { open: function () { set(true); }, close: function () { set(false); }, isOpen: function () { return isOpen; } };
  };

  /* ---------- Reveal on scroll ----------
     Elements matching `selector` get `is-in` when they enter the viewport.
     Children of [data-stagger] get --i (0,1,2…) for CSS transition-delay.
     CSS must only hide elements under `html.js` so no-JS users see everything. */
  AV.reveal = function (selector, opts) {
    opts = opts || {};
    $$('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (c, i) { c.style.setProperty('--i', i); });
    });
    var els = $$(selector || '[data-reveal]');
    if (!('IntersectionObserver' in window) || AV.reduced()) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); if (opts.onIn) opts.onIn(en.target); }
      });
    }, { threshold: opts.threshold || 0.12, rootMargin: opts.rootMargin || '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
    return io;
  };

  /* ---------- Scroll spy ----------
     links: anchors with href="#id" (or "page.html#id" on the same page). Active link gets
     .is-active + aria-current="true". */
  AV.spy = function (links, opts) {
    opts = opts || {};
    links = Array.prototype.slice.call(links || []);
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) {
      var id = (a.getAttribute('href') || '').split('#')[1];
      if (id && document.getElementById(id)) (map[id] = map[id] || []).push(a);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        (map[en.target.id] || []).forEach(function (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); });
        if (opts.onChange) opts.onChange(en.target.id, map[en.target.id] || []);
      });
    }, { rootMargin: opts.rootMargin || '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
    return io;
  };

  /* ---------- Count-up numbers ----------
     Works with the original notation: "+142 %", "−38 %", "6,4 %", "3,1×", "48 %".
     The final text is in the HTML, so no-JS / reduced motion shows the real value. */
  AV.countUp = function (el, duration) {
    var finalText = el.getAttribute('data-final') || el.textContent;
    el.setAttribute('data-final', finalText);
    var m = finalText.match(/^([^\d]*)(\d+(?:,\d+)?)(.*)$/);
    if (!m || AV.reduced()) { el.textContent = finalText; return; }
    var prefix = m[1], num = m[2], suffix = m[3];
    var decimals = num.indexOf(',') > -1 ? num.split(',')[1].length : 0;
    var target = parseFloat(num.replace(',', '.'));
    var start = null, dur = duration || 1400;
    el.setAttribute('aria-label', finalText);       // screen readers get the final value only
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * e).toFixed(decimals).replace('.', ',') + suffix;
      if (p < 1) requestAnimationFrame(frame); else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  };
  /** count up every element matching selector when it becomes visible */
  AV.counters = function (selector, duration) {
    var els = $$(selector);
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || AV.reduced()) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { AV.countUp(en.target, duration); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  };

  /* ---------- Contact form (client-side validation only) ----------
     Expects inputs with [required]; each field wrapper `.field` (or `opts.fieldSelector`) may contain
     an element [data-error] for the message. A [data-form-status] element receives the result text.
     The preview has NO backend, so a valid form is NOT sent — the status says so honestly. */
  var MSG = {
    name: 'Bitte gib deinen Namen ein.',
    email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    message: 'Bitte beschreibe kurz dein Anliegen.',
    consent: 'Bitte stimme der Datenverarbeitung zu.',
    invalid: 'Bitte prüfe die markierten Felder.',
    valid: 'Alle Angaben sind vollständig. Hinweis: Diese Design-Vorschau ist noch nicht an einen Server angebunden – deine Anfrage wurde nicht versendet. Schreib uns gern direkt an info@avinova.de.'
  };
  AV.formMessages = MSG;
  AV.form = function (form, opts) {
    if (!form) return;
    opts = opts || {};
    var fieldSel = opts.fieldSelector || '.field, .consent';
    var status = $('[data-form-status]', form.parentNode) || $('[data-form-status]', form);
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var fields = $$('[required]', form);

    fields.forEach(function (el, i) {
      var wrap = el.closest(fieldSel);
      var err = wrap && $('[data-error]', wrap);
      if (err) {
        if (!err.id) err.id = (form.id || 'form') + '-err-' + i;
        var d = el.getAttribute('aria-describedby');
        el.setAttribute('aria-describedby', (d ? d + ' ' : '') + err.id);
      }
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () {
        if (el.getAttribute('aria-invalid') === 'true') validate(el);
      });
      el.addEventListener('blur', function () { if (el.type !== 'checkbox' && el.value.trim()) validate(el); });
    });

    function validate(el) {
      var ok = el.type === 'checkbox' ? el.checked
        : el.type === 'email' ? emailRe.test(el.value.trim())
        : el.value.trim().length > 1;
      var wrap = el.closest(fieldSel);
      var err = wrap && $('[data-error]', wrap);
      el.setAttribute('aria-invalid', String(!ok));
      if (wrap) wrap.classList.toggle('is-invalid', !ok);
      if (err) err.textContent = ok ? '' : (MSG[el.name] || MSG.invalid);
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      fields.forEach(function (el) { if (!validate(el) && !first) first = el; });
      if (status) { status.classList.remove('is-ok', 'is-error'); }
      if (first) {
        if (status) { status.textContent = MSG.invalid; status.classList.add('is-error'); }
        first.focus();
        if (opts.onInvalid) opts.onInvalid(first);
        return;
      }
      // TODO (production): send data, e.g. fetch('/api/contact', { method: 'POST', body: new FormData(form) })
      if (status) { status.textContent = MSG.valid; status.classList.add('is-ok'); }
      if (opts.onValid) opts.onValid(form);
    });
  };

  /* ---------- Modal dialog (native <dialog>) ----------
     Returns focus to the trigger on close; closes on backdrop click. */
  AV.openDialog = function (dialog, trigger) {
    if (!dialog || typeof dialog.showModal !== 'function') return false;
    if (!dialog._avBound) {
      dialog._avBound = true;
      dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
      dialog.addEventListener('close', function () {
        document.documentElement.classList.remove('dialog-open');
        if (dialog._avTrigger) dialog._avTrigger.focus({ preventScroll: true });
      });
    }
    dialog._avTrigger = trigger || document.activeElement;
    dialog.showModal();
    document.documentElement.classList.add('dialog-open');
    return true;
  };

  /* ---------- Legal pages: load text from the original page ----------
     <main data-legal-src="../../impressum.html"> with slots
     [data-legal="title|intro|updated|toc|body"] and an optional [data-legal-fallback].
     Single source of truth for legal copy; links inside stay relative (the concept has the same
     file names). Resolves with true on success. */
  AV.loadLegal = function (opts) {
    opts = opts || {};
    var host = $('[data-legal-src]');
    if (!host) return Promise.resolve(false);
    var src = host.getAttribute('data-legal-src');
    var fallback = $('[data-legal-fallback]', host);
    function slot(name) { return $('[data-legal="' + name + '"]', host); }
    if (!window.fetch || location.protocol === 'file:') return Promise.resolve(false);
    return fetch(src).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var parts = {
        title: $('.legal-hero h1', doc), intro: $('.legal-hero p', doc), updated: $('.legal-hero .updated', doc),
        toc: $('.legal__toc ol', doc), body: $('.prose', doc)
      };
      if (!parts.body) throw new Error('no .prose');
      Object.keys(parts).forEach(function (k) {
        var target = slot(k), node = parts[k];
        if (!target || !node) return;
        if (k === 'title' || k === 'intro' || k === 'updated') target.textContent = node.textContent.trim();
        else {
          target.innerHTML = node.innerHTML;
          if (k === 'toc') $$('li', target).forEach(function (li, i) { li.style.setProperty('--i', i); });
        }
      });
      if (fallback) fallback.hidden = true;
      host.classList.add('is-loaded');
      if (parts.title) document.title = parts.title.textContent.trim() + ' – AVINOVA';
      var tocLinks = $$('[data-legal="toc"] a', host);
      AV.spy(tocLinks, { rootMargin: '-20% 0px -70% 0px' });
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
      if (opts.onLoad) opts.onLoad(host);
      return true;
    }).catch(function (err) {
      if (window.console) console.warn('Legal text could not be loaded:', err);
      return false;
    });
  };

  window.AV = AV;
})();
