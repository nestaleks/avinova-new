# QA checklist

Legend: **auto** = covered by `qa/run-qa.cjs`; **manual** = screenshot / hands-on review.

## Per page × viewport (1920, 1440, 1024, 768, 390, 360) — auto
- [ ] HTTP 200
- [ ] No console errors, page errors, failed requests or HTTP ≥ 400 (Google Fonts excluded from "failed")
- [ ] No horizontal overflow (`scrollWidth ≤ innerWidth`), offending elements listed
- [ ] No broken images; every `<img>` has `alt`
- [ ] Exactly one `<h1>`
- [ ] No reveal element left invisible after scrolling through the page
- [ ] No `<a>` without `href`; every `<button>` has an accessible name
- [ ] Legal pages: legal text loaded from the original (`[data-legal="body"] section` > 0)

## Interactions — auto
- [ ] Mobile menu (390px): toggle visible, ≥ 44×44, opens, shows links, Escape closes, focus returns
- [ ] Contact form (1440px): empty submit → 4 invalid fields + error status; valid submit → honest
      "nicht versendet" status, invalid state cleared
- [ ] Reduced motion (home @1440, case studies @390): no errors, nothing left hidden

## Concept-specific — scripted ad hoc (see TEST_RESULTS.md)
- [ ] C: process tabs keyboard (arrows/Home/End), autoplay pause, showcase prev/next, lightbox open /
      Escape / focus return, case switcher deep links via hash, marquee pause
- [ ] D: marquee pause, magnetic CTA only on fine pointers, sticky posters
- [ ] B: header transparent → solid on scroll, case list image preview (pointer), overlay menu
- [ ] A: scroll-spy active nav, back-to-top, count-up

## Manual review
- [ ] Brand recognisable (logo, colours, photography, copy) vs. original
- [ ] All original sections present, in order; no invented content
- [ ] Typography / spacing / alignment consistent at desktop and mobile
- [ ] Hover, focus-visible and touch states present and distinct per component type
- [ ] Hero wall sign visible
- [ ] Original site unchanged: `sha256sum -c redesigns/qa/original-checksums.sha256` + `git status`
