/* =========================================================
   Concept C — Case studies page
   1. Case switcher: links → ARIA tabs synced with the URL hash
      (#bauunternehmen / #zahnarztpraxis / #fitnessstudio), plus "Alle anzeigen".
      Without JS all three cases are stacked and the chips are plain jump links.
   2. Animated timeline (re-implementation of the original js/timeline.js):
      circle-notch of the current marker turns 180°, the point travels to the next
      marker, the previous notch turns back; after the last marker the point fades
      and restarts. Runs only while visible (hidden case / off-screen / tab hidden
      → paused) and never under reduced motion.
   Requires ../shared/core.js and js/ui.js (window.AVC.tabs).
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV, AVC = window.AVC;
  if (!AV || !AVC || !AVC.tabs) return;

  /* ---------- 1. Case switcher ---------- */
  (function () {
    var bar = AV.$('[data-switcher]');
    var list = bar && AV.$('[data-switcher-tabs]', bar);
    var wrap = AV.$('[data-cases]');
    if (!list || !wrap) return;
    var links = AV.$$('a[href^="#"]', list);
    var ids = links.map(function (a) { return a.getAttribute('href').slice(1); });
    var panels = ids.map(function (id) { return document.getElementById(id); });
    if (panels.some(function (p) { return !p; })) return;
    var allBtn = AV.$('[data-show-all]', bar);
    var showingAll = false;

    // enhance links into tabs
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', 'Case Studies');
    list.setAttribute('aria-orientation', 'horizontal');
    links.forEach(function (a, i) {
      a.id = 'case-tab-' + (i + 1);
      a.setAttribute('role', 'tab');
      a.setAttribute('aria-controls', ids[i]);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', a.id);
    });
    wrap.classList.add('is-tabbed');

    function scrollToCases(target) {
      // put the top of the shown case right below the sticky header + switcher
      var y = (target || wrap).getBoundingClientRect().top + window.scrollY;
      var offset = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76) + bar.offsetHeight;
      window.scrollTo({ top: Math.max(0, y - offset + 1), behavior: 'auto' });
    }
    function setHash(id) {
      if (!history.replaceState) return;
      history.replaceState(null, '', id ? '#' + id : location.pathname + location.search);
    }
    function setAll(on) {
      showingAll = on;
      if (allBtn) allBtn.setAttribute('aria-pressed', String(on));
      wrap.classList.toggle('is-tabbed', !on);
      if (on) {
        panels.forEach(function (p) { p.hidden = false; });
        links.forEach(function (a) { a.setAttribute('aria-selected', 'false'); });
      }
    }

    var tabs = AVC.tabs(list, {
      noInit: true,
      onSelect: function (i, prev, byUser, o) {
        if (showingAll) setAll(false);
        panels[i].hidden = false;                       // managePanels already did this; keep explicit for clarity
        if (byUser || o.fromHash) {
          setHash(ids[i]);
          if (!AV.reduced() && prev !== i) {
            panels[i].classList.remove('is-entering');
            void panels[i].offsetWidth;
            panels[i].classList.add('is-entering');
          }
          if (o.scroll !== false && (wrap.getBoundingClientRect().top < 0 || o.fromHash)) scrollToCases(o.fromHash ? panels[i] : wrap);
        }
      }
    });
    panels.forEach(function (p) {
      p.addEventListener('animationend', function (e) { if (e.target === p) p.classList.remove('is-entering'); });
    });

    if (allBtn) {
      allBtn.hidden = false;
      allBtn.addEventListener('click', function () {
        if (showingAll) { tabs.select(tabs.index(), { byUser: true, scroll: false }); return; }
        setAll(true);
        setHash('');
      });
    }

    function fromHash(initial) {
      var i = ids.indexOf(decodeURIComponent(location.hash.slice(1)));
      if (i < 0) return false;
      if (showingAll && !initial) return true;          // native jump inside the stacked list
      tabs.select(i, { fromHash: true });
      return true;
    }
    if (!fromHash(true)) tabs.select(0);
    // after fonts/images settle, make sure a deep-linked case is still aligned
    if (location.hash && ids.indexOf(location.hash.slice(1)) > -1) {
      window.addEventListener('load', function () { if (!showingAll) scrollToCases(panels[tabs.index()]); }, { once: true });
    }
    window.addEventListener('hashchange', function () { fromHash(false); });
  })();

  /* ---------- 2. Animated timelines ---------- */
  (function () {
    var timelines = AV.$$('[data-timeline]');
    if (!timelines.length || !('animate' in Element.prototype)) return;
    var ROTATE = 1100, MOVE = 2000, FADE = 800, PAUSE = 300;
    var EASE = 'cubic-bezier(.65,0,.35,1)';

    function Timeline(el) {
      this.el = el;
      this.box = AV.$('.tl', el);
      this.point = AV.$('.tl-point', el);
      this.items = AV.$$('.tl__list li', el);
      this.dots = AV.$$('.tl-dot', el);
      this.notches = this.dots.map(function (d) { return AV.$('.tl-notch', d); });
      this.idx = 0;
      this.visible = false;
      this.started = false;
      this.anims = [];
      this.waiters = [];
    }
    Timeline.prototype.canRun = function () { return this.visible && !document.hidden && !AV.reduced(); };
    Timeline.prototype.base = function () { return parseFloat(getComputedStyle(this.el).getPropertyValue('--notch-base')) || 0; };
    // centre of marker i relative to .tl, as translate() for the 36px point
    Timeline.prototype.pos = function (i) {
      var o = this.box.getBoundingClientRect(), d = this.dots[i].getBoundingClientRect();
      return 'translate(' + (d.left - o.left + d.width / 2 - 18) + 'px,' + (d.top - o.top + d.height / 2 - 18) + 'px)';
    };
    Timeline.prototype.place = function () {
      if (!this.box.offsetParent) return;                // hidden case: cannot measure
      this.point.style.transform = this.pos(this.idx);
      this.point.style.opacity = '1';
      this.mark();
    };
    Timeline.prototype.mark = function () {
      var idx = this.idx;
      this.items.forEach(function (li, k) { li.classList.toggle('is-current', k === idx); });
    };
    /* resolves once the timeline may run (visible, tab visible, motion allowed) */
    Timeline.prototype.gate = function () {
      var self = this;
      if (this.canRun()) return Promise.resolve();
      return new Promise(function (r) { self.waiters.push(r); });
    };
    Timeline.prototype.update = function () {
      var run = this.canRun();
      this.anims.forEach(function (a) { if (run) a.play(); else a.pause(); });
      if (run) { var w = this.waiters; this.waiters = []; w.forEach(function (r) { r(); }); }
    };
    Timeline.prototype.play = function (el, frames, opts) {
      var self = this;
      var a = el.animate(frames, Object.assign({ fill: 'forwards', easing: EASE }, opts));
      this.anims.push(a);
      if (!this.canRun()) a.pause();
      return a.finished.then(function () {
        var last = frames[frames.length - 1];
        Object.keys(last).forEach(function (k) { if (k !== 'offset') el.style[k] = last[k]; });
        a.cancel();
        self.anims = self.anims.filter(function (x) { return x !== a; });
      }, function () { /* cancelled */ });
    };
    Timeline.prototype.wait = function (ms) {
      var self = this;
      return new Promise(function (r) { setTimeout(r, ms); }).then(function () { return self.gate(); });
    };
    Timeline.prototype.turn = function (i) {
      var b = this.base();
      return this.play(this.notches[i], [{ transform: 'rotate(' + b + 'deg)' }, { transform: 'rotate(' + (b + 180) + 'deg)' }], { duration: ROTATE });
    };
    Timeline.prototype.turnBack = function (i) {
      var b = this.base(), n = this.notches[i];
      return this.play(n, [{ transform: 'rotate(' + (b + 180) + 'deg)' }, { transform: 'rotate(' + b + 'deg)' }], { duration: ROTATE })
        .then(function () { n.style.transform = ''; });  // hand back to CSS (--notch-base)
    };
    Timeline.prototype.loop = async function () {
      var n = this.dots.length;
      for (;;) {
        var i = this.idx;
        await this.gate();
        await this.turn(i);
        await this.wait(PAUSE);
        this.turnBack(i);
        if (i < n - 1) {
          var from = this.pos(i), to = this.pos(i + 1);
          this.idx = i + 1;
          this.mark();
          await this.play(this.point, [{ transform: from }, { transform: to }], { duration: MOVE });
        } else {
          await this.play(this.point, [{ opacity: 1 }, { opacity: 0 }], { duration: FADE, easing: 'ease' });
          this.idx = 0;
          this.point.style.transform = this.pos(0);
          this.mark();
          await this.play(this.point, [{ opacity: 0 }, { opacity: 1 }], { duration: FADE, easing: 'ease' });
        }
        await this.gate();
      }
    };
    Timeline.prototype.setVisible = function (v) {
      this.visible = v;
      if (v && !this.anims.length) this.place();       // (re)measure when shown and idle
      if (v && !this.started && !AV.reduced()) { this.started = true; this.loop(); }
      this.update();
    };

    var list = timelines.map(function (el) { return new Timeline(el); }).filter(function (t) { return t.point && t.dots.length > 1; });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var t = list.filter(function (x) { return x.el === en.target; })[0];
          if (t) t.setVisible(en.isIntersecting);       // hidden case (display:none) never intersects
        });
      }, { threshold: 0.2 });
      list.forEach(function (t) { io.observe(t.el); });
    } else {
      list.forEach(function (t) { t.setVisible(true); });
    }
    document.addEventListener('visibilitychange', function () { list.forEach(function (t) { t.update(); }); });
    AV.onResize(function () { list.forEach(function (t) { if (!t.anims.length) t.place(); }); }, 150);
  })();
})();
