/* Concept G — home: expanding process tiles + flip tiles with real case metrics. */
(function () {
  'use strict';
  var AV = window.AV;
  if (!AV) return;
  var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  /* ---------- process: one expanded tile at a time ---------- */
  var list = AV.$('[data-psteps]');
  if (list) {
    var items = AV.$$('.pstep', list);
    var open = function (i) {
      items.forEach(function (li, j) {
        var on = j === i;
        li.classList.toggle('is-open', on);
        var b = li.querySelector('.pstep__btn');
        if (b) b.setAttribute('aria-expanded', String(on));
      });
    };
    items.forEach(function (li, i) {
      var h = li.querySelector('[data-pstep-title]');
      var text = li.querySelector('.pstep__text');
      if (!h || !text) return;
      // upgrade the heading text to a button (no dead controls without JS)
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pstep__btn';
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-controls', text.id);
      b.innerHTML = h.textContent.trim() + '<span class="pstep__chev" aria-hidden="true">' + CHEV + '</span>';
      h.textContent = '';
      h.appendChild(b);
      b.addEventListener('click', function () { open(i); });
    });
    open(0);
  }

  /* ---------- flip tiles ---------- */
  function hide(el, hidden) {
    if (!el) return;
    if (hidden) { el.setAttribute('aria-hidden', 'true'); el.inert = true; el.setAttribute('inert', ''); }
    else { el.removeAttribute('aria-hidden'); el.inert = false; el.removeAttribute('inert'); }
  }
  AV.$$('[data-flip]').forEach(function (tile) {
    var btn = tile.querySelector('[data-flip-toggle]');
    var front = tile.querySelector('.flip__front');
    var back = tile.querySelector('.flip__back');
    if (!btn || !front || !back) return;
    var counted = false;
    var set = function (on) {
      tile.classList.toggle('is-flipped', on);
      btn.setAttribute('aria-pressed', String(on));
      hide(back, !on);
      hide(front, on);
      if (on && !counted) {
        counted = true;
        setTimeout(function () {
          AV.$$('[data-count-flip]', back).forEach(function (el) { AV.countUp(el, 1100); });
        }, AV.reduced() ? 0 : 260);
      }
    };
    set(false);
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-pressed') !== 'true'); });
  });
})();
