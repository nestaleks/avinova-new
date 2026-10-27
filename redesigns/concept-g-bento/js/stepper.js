/* Concept G — contact form as a 3-step vertical stepper.
   All three steps stay rendered and usable (the active one is emphasised), so the form works
   as one normal form without JS and every field remains reachable. "Weiter" validates only the
   current step; the always-visible submit button runs AV.form's validation over ALL fields and
   jumps to the step containing the first invalid field. No backend: AV.form reports honestly
   that nothing was sent. */
(function () {
  'use strict';
  var AV = window.AV;
  var form = AV && AV.$('[data-stepper]');
  if (!form) return;

  var steps = AV.$$('[data-fstep]', form);
  var required = AV.$$('[required]', form);
  var fill = AV.$('[data-progress-fill]', form);
  var ptext = AV.$('[data-progress-text]', form);
  var MSG = AV.formMessages || {};
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var current = -1;

  function isValid(el) {
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'email') return emailRe.test(el.value.trim());
    return el.value.trim().length > 1;
  }
  // same rules + messages as AV.form, applied to one step
  function mark(el) {
    var ok = isValid(el);
    var wrap = el.closest('.field, .consent');
    var err = wrap && wrap.querySelector('[data-error]');
    el.setAttribute('aria-invalid', String(!ok));
    if (wrap) wrap.classList.toggle('is-invalid', !ok);
    if (err) err.textContent = ok ? '' : (MSG[el.name] || MSG.invalid || '');
    return ok;
  }
  function stepOf(el) { return steps.indexOf(el.closest('[data-fstep]')); }

  function activate(i, focusField) {
    if (i < 0 || i >= steps.length) return;
    current = i;
    steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
    if (focusField) {
      var f = steps[i].querySelector('input, textarea');
      if (f) f.focus();
    }
  }

  function update() {
    var n = required.filter(isValid).length;
    if (fill) fill.style.setProperty('--p', (n / required.length).toFixed(3));
    if (ptext) ptext.textContent = n + ' von ' + required.length + ' Angaben';
    steps.forEach(function (s) {
      var req = AV.$$('[required]', s);
      s.classList.toggle('is-done', req.length > 0 && req.every(isValid));
    });
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  // Pointer focus must not change the layout between mousedown and mouseup (the click would be
  // lost), so pointer-initiated activation waits for the click event; keyboard focus activates at once.
  var pointerDown = false;
  form.addEventListener('pointerdown', function () { pointerDown = true; });
  document.addEventListener('pointerup', function () { setTimeout(function () { pointerDown = false; }, 0); });
  document.addEventListener('pointercancel', function () { pointerDown = false; });
  form.addEventListener('focusin', function (e) {
    if (pointerDown) return;
    var i = stepOf(e.target);
    if (i > -1 && i !== current) activate(i);
  });
  form.addEventListener('click', function (e) {
    var next = e.target.closest('[data-next]');
    var prev = e.target.closest('[data-prev]');
    if (next) {
      var i = stepOf(next), first = null;
      AV.$$('[required]', steps[i]).forEach(function (el) { if (!mark(el) && !first) first = el; });
      if (first) { first.focus(); return; }
      activate(i + 1, true);
      return;
    }
    if (prev) { activate(stepOf(prev) - 1, true); return; }
    // clicking into another (dimmed) step brings it forward
    var s = e.target.closest('[data-fstep]');
    if (s && !s.classList.contains('is-active')) {
      activate(steps.indexOf(s), !e.target.closest('input, textarea, a, label, button'));
    }
  });

  AV.form(form, {
    onInvalid: function (first) { activate(stepOf(first)); },
    onValid: function () { update(); }
  });

  activate(0);
  update();
})();
