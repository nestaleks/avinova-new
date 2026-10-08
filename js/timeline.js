/* Case studies – animated timeline
   1. circle-notch of the current point turns 180° clockwise
   2. the "point" icon travels to the next marker; meanwhile the previous notch turns back
   3. repeat; after the last marker the point fades out and fades in again on the first one */
(function () {
  var ROTATE = 1100, MOVE = 2000, FADE = 800, PAUSE = 300;   // ms — increase to slow down further
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('animate' in Element.prototype)) return;

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function play(el, frames, opts) {
    var a = el.animate(frames, Object.assign({ fill: 'forwards', easing: 'cubic-bezier(.65,0,.35,1)' }, opts));
    return a.finished.then(function () {
      var last = frames[frames.length - 1];
      Object.keys(last).forEach(function (k) { if (k !== 'offset') el.style[k] = last[k]; });
      a.cancel();
    });
  }

  function base(tl) {
    return parseFloat(getComputedStyle(tl).getPropertyValue('--notch-base')) || 0;
  }

  // centre of marker i, relative to the <ol>, as a translate() for the 36px point icon
  function pos(ol, dot) {
    var o = ol.getBoundingClientRect(), d = dot.getBoundingClientRect();
    var x = d.left - o.left + d.width / 2 - 18, y = d.top - o.top + d.height / 2 - 18;
    return 'translate(' + x + 'px,' + y + 'px)';
  }

  function turn(tl, notch) {           // 0 → 180° clockwise
    var b = base(tl);
    return play(notch, [{ transform: 'rotate(' + b + 'deg)' }, { transform: 'rotate(' + (b + 180) + 'deg)' }], { duration: ROTATE });
  }
  function turnBack(tl, notch) {       // 180° → 0, then hand back to CSS
    var b = base(tl);
    return play(notch, [{ transform: 'rotate(' + (b + 180) + 'deg)' }, { transform: 'rotate(' + b + 'deg)' }], { duration: ROTATE })
      .then(function () { notch.style.transform = ''; });
  }

  async function run(tl) {
    var ol = tl.querySelector('ol'), point = tl.querySelector('.tl-point');
    var dots = [].slice.call(tl.querySelectorAll('.tl-dot'));
    var notches = dots.map(function (d) { return d.querySelector('.tl-notch'); });
    if (!ol || !point || dots.length < 2) return;

    point.style.transform = pos(ol, dots[0]);
    point.style.opacity = '1';
    point.dataset.idx = 0;
    if (reduce) return;

    for (;;) {
      for (var i = 0; i < dots.length; i++) {
        await turn(tl, notches[i]);
        await wait(PAUSE);
        if (i < dots.length - 1) {
          turnBack(tl, notches[i]);
          await play(point, [{ transform: pos(ol, dots[i]) }, { transform: pos(ol, dots[i + 1]) }], { duration: MOVE });
          point.dataset.idx = i + 1;
        } else {
          turnBack(tl, notches[i]);
          await play(point, [{ opacity: 1 }, { opacity: 0 }], { duration: FADE, easing: 'ease' });
          point.style.transform = pos(ol, dots[0]);
          point.dataset.idx = 0;
          await play(point, [{ opacity: 0 }, { opacity: 1 }], { duration: FADE, easing: 'ease' });
        }
      }
    }
  }

  function start() {
    [].forEach.call(document.querySelectorAll('.timeline'), function (tl) { run(tl); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // keep the point on its marker when the layout changes (resize / rotate device)
  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      [].forEach.call(document.querySelectorAll('.timeline .tl-point'), function (p) {
        if (p.getAnimations && p.getAnimations().length) return;   // moving: next step re-measures anyway
        var tl = p.closest('.timeline'), dots = tl.querySelectorAll('.tl-dot');
        var d = dots[+p.dataset.idx || 0];
        if (d) p.style.transform = pos(tl.querySelector('ol'), d);
      });
    }, 150);
  });
})();
