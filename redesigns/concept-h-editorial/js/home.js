/* =========================================================
   Concept H — home page interactions
   1. Hero arch that opens to full width while scrolling
   2. Process steps along a scroll-drawn SVG path
   3. Story accordion for the case teasers
   ========================================================= */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function easeInOut(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  /* ---------- 1. Hero: arch → full width (scroll-linked clip-path) ----------
     At the top of the page the photo is shown inside an arch, panned so the
     AVINOVA sign sits in the arch. Scrolling opens the arch until the image is
     full-bleed when it reaches the header. Without JS / with reduced motion the
     full image is shown. */
  (function heroArch() {
    var fig = AV.$('[data-arch-open]');
    if (!fig || AV.reduced()) return;
    var img = AV.$('img', fig);
    var SIGN_X = 0.815;                 // horizontal position of the wall sign in the photo
    var S0 = 1.16;                      // starting zoom
    var w = 0, h = 0, top = 0, inset0 = 0, tx0 = 0, end = 1;

    function measure() {
      var r = fig.getBoundingClientRect();
      w = r.width; h = r.height; top = r.top + window.scrollY;
      var archW = w < 700 ? w * 0.84 : clamp(w * 0.4, 380, 680);
      inset0 = Math.max(0, (w - archW) / 2);
      // where is the sign inside the element (object-fit: cover)?
      var nw = img.naturalWidth || 2089, nh = img.naturalHeight || 753;
      var k = Math.max(w / nw, h / nh), rw = nw * k;
      var ox = parseFloat(getComputedStyle(img).objectPosition) / 100;
      if (isNaN(ox)) ox = 0.5;
      var signX = (w - rw) * ox + SIGN_X * rw;
      tx0 = -(signX - w / 2) * S0;
      // never pan so far that the arch would show an empty edge
      tx0 = clamp(tx0, archW / 2 - S0 * w / 2, S0 * w / 2 - archW / 2);
      var hdr = AV.$('[data-header]');
      end = Math.max(120, top - (hdr ? hdr.offsetHeight : 0));
    }

    function update(y) {
      var p = easeInOut(clamp(y / end, 0, 1)), q = 1 - p;
      var ins = inset0 * q;
      var rad = ((w - 2 * ins) / 2) * q;
      fig.style.clipPath = 'inset(0 ' + ins.toFixed(1) + 'px 0 ' + ins.toFixed(1) + 'px round ' + rad.toFixed(1) + 'px ' + rad.toFixed(1) + 'px 0 0)';
      img.style.transform = 'translate3d(' + (tx0 * q).toFixed(1) + 'px,0,0) scale(' + (1 + (S0 - 1) * q).toFixed(4) + ')';
    }

    fig.classList.add('is-live');
    measure();
    AV.onScroll(update);
    AV.onResize(function () { measure(); update(window.scrollY); });
    if (!img.complete) img.addEventListener('load', function () { measure(); update(window.scrollY); }, { once: true });
  })();

  /* ---------- 2. Process: curving path drawn by scroll ---------- */
  (function processPath() {
    var wrap = AV.$('[data-steps]');
    if (!wrap) return;
    var svg = AV.$('svg', wrap), track = AV.$('.steps__track', wrap), draw = AV.$('.steps__draw', wrap);
    var steps = AV.$$('.step', wrap), badges = AV.$$('.step__badge', wrap);
    var marks = [], H = 1;

    function build() {
      var box = wrap.getBoundingClientRect();
      var W = box.width; H = box.height;
      svg.setAttribute('viewBox', '0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0));
      var pts = badges.map(function (b) {
        var r = b.getBoundingClientRect();
        return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
      });
      if (!pts.length) return;
      var d = 'M' + pts[0][0].toFixed(1) + ' 0 L' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i], my = (b[1] - a[1]) / 2;
        d += ' C' + a[0].toFixed(1) + ' ' + (a[1] + my).toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + (b[1] - my).toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
      }
      var last = pts[pts.length - 1];
      d += ' L' + last[0].toFixed(1) + ' ' + H.toFixed(1);
      track.setAttribute('d', d); draw.setAttribute('d', d);
      marks = pts.map(function (p) { return p[1] / H; });
      wrap.classList.add('has-path');
    }

    function update() {
      var r = wrap.getBoundingClientRect(), vh = window.innerHeight;
      var p = AV.reduced() ? 1 : clamp((vh * 0.62 - r.top) / r.height, 0, 1);
      draw.style.strokeDashoffset = (1 - p).toFixed(4);
      steps.forEach(function (s, i) { s.classList.toggle('is-lit', p >= marks[i] - 0.005); });
    }

    build();
    AV.onScroll(update);
    AV.onResize(function () { build(); update(); });
    window.addEventListener('load', function () { build(); update(); });
  })();

  /* ---------- 3. Story accordion (one open at a time) ---------- */
  (function stories() {
    var list = AV.$('[data-stories]');
    if (!list) return;
    var items = AV.$$('[data-story]', list);
    function set(item, open) {
      item.classList.toggle('is-open', open);
      AV.$('.story__btn', item).setAttribute('aria-expanded', String(open));
    }
    items.forEach(function (item, i) {
      set(item, i === 0);
      AV.$('.story__btn', item).addEventListener('click', function () {
        var open = !item.classList.contains('is-open');
        items.forEach(function (other) { set(other, other === item && open); });
      });
    });
    list.classList.add('is-ready');
  })();
})();
