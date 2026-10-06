(function () {
  var doc = document.documentElement;
  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');

  /* Header shadow on scroll */
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  function closeMenu() {
    doc.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Menü öffnen');
  }
  burger.addEventListener('click', function () {
    var open = doc.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) closeMenu(); });

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Case studies: highlight active chip */
  var chips = document.querySelectorAll('.case-nav .chip');
  if (chips.length && 'IntersectionObserver' in window) {
    var map = {};
    chips.forEach(function (c) { map[c.getAttribute('href').slice(1)] = c; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          chips.forEach(function (c) { c.classList.remove('is-active'); });
          var chip = map[en.target.id];
          if (chip) {
            chip.classList.add('is-active');
            chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.case[id]').forEach(function (s) { so.observe(s); });
  }


  /* Legal pages: highlight current section in table of contents */
  var tocLinks = document.querySelectorAll('.legal__toc ol a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var tmap = {};
    tocLinks.forEach(function (a) { tmap[a.getAttribute('href').slice(1)] = a; });
    var to = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && tmap[en.target.id]) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
          tmap[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('.prose section[id]').forEach(function (s) { to.observe(s); });
  }

  /* Contact form (frontend validation only – connect to backend / form service) */
  var form = document.getElementById('contact-form');
  if (form) {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    function validate(el) {
      var ok = el.type === 'checkbox' ? el.checked
        : el.type === 'email' ? emailRe.test(el.value.trim())
        : el.value.trim().length > 1;
      var wrap = el.closest('.field') || el.closest('.consent');
      if (wrap) wrap.classList.toggle('is-invalid', !ok);
      return ok;
    }
    form.querySelectorAll('[required]').forEach(function (el) {
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () {
        var wrap = el.closest('.field') || el.closest('.consent');
        if (wrap && wrap.classList.contains('is-invalid')) validate(el);
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('[required]');
      var allOk = true, first = null;
      fields.forEach(function (el) { if (!validate(el)) { allOk = false; first = first || el; } });
      if (!allOk) { first.focus(); return; }
      // TODO: send data, e.g. fetch('/api/contact', { method: 'POST', body: new FormData(form) })
      document.getElementById('form-card').classList.add('is-sent');
      form.reset();
    });
  }
})();
