# Test results

Environment: Windows 11, Node 24.19, Playwright 1.56 / Chromium (headless), preview served by
`tools/serve.mjs`. Date: 2026-10-26. Only tests that were actually executed are listed.

## 1. Automated suite — `qa/run-qa.cjs --shots`
**1271 checks, 1271 passed, 0 failed.** Raw data: `qa/results.json`; screenshots (home, case studies,
Impressum at 1440 and 390): `qa/screenshots/`.

Covered:
- Original site: all 5 pages render with HTTP 200 and no errors.
- Concept selector: links to all 4 concepts, no console errors.
- 4 concepts × 5 pages × 6 viewports (1920×1080, 1440×900, 1024×768, 768×1024, 390×844, 360×800):
  HTTP 200; no console errors, page errors, failed requests or HTTP ≥ 400; horizontal overflow 0 px;
  no broken images; all images have `alt`; exactly one `h1`; no reveal element left invisible after
  scrolling; no `<a>` without `href`; all buttons named; legal pages loaded their text from the original
  (Impressum 6, Datenschutz 15, AGB 12 sections).
- Mobile menu at 390 px (each concept): toggle visible and ≥ 44×44, opens, shows ≥ 5 links,
  Escape closes it, focus returns to the toggle.
- Contact form at 1440 px (each concept): empty submit marks 4 fields `aria-invalid` and shows the
  error status; a valid submit shows the honest "nicht versendet" message and clears invalid states.
- Reduced motion (`reducedMotion: 'reduce'`): home @1440 and case studies @390 for each concept —
  no errors, nothing hidden.

## 2. Concept-specific tests (scripted by the implementing agents, Playwright/Chromium)
| Concept | Result | Covered |
|---|---|---|
| A | 19/19 passed | menu sheet + link navigation offset, tap targets ≥ 44 px, form, header condensing 76→64 px, scroll-spy, back-to-top, count-up values, case chip spy, legal TOC spy, no-JS rendering, reduced motion |
| B | all passed (no count given) | overlay menu + focus, form on home and case studies, legal pages, cursor-following case preview (fine pointer) and inline images on touch, reduced motion (parallax off), 12 metrics end on exact values |
| C | 47/47 passed | menu, marquee pause (hover/focus/button/off-screen), process tabs (arrows/Home/End, autoplay advances and stops), count-up, showcase prev/next/keyboard/swipe, lightbox (open, Escape, focus return), 3D tilt reset, form (errors, counter, loading state, status), hash deep links + show-all, timeline runs only in visible case, legal pages, reduced motion, no-JS |
| D | 36/36 passed | menu, form, marquee pause (button/hover/focus/off-screen, `aria-hidden` duplicate), magnetic CTA offset + reset, scroll-spy, case chip spy, count-up, heading order / duplicate IDs, reduced motion, no-JS |

## 3. Manual review
Full-page screenshots of every concept were inspected at desktop and mobile widths against the
original: logo, palette, photography, copy and section order are preserved; the hero wall sign stays
visible. Defects found during the agents' review rounds were fixed before the final run (listed in
`PROGRESS.md`).

## 4. Original integrity
- `sha256sum -c qa/original-checksums.sha256` → all 76 original files unchanged (checksums taken before
  any work started).
- `git status` → only untracked `redesigns/` (and the pre-existing `promt.md`); no tracked file modified.
- Documented server URLs verified on port 8080 (HTTP 200 for selector, 4 concepts, original); path
  traversal is rejected (404).

## Not tested / limitations
- Only Chromium was used; Firefox and WebKit (Safari) were not run.
- No real touch device and no physical screen reader testing (touch was emulated; ARIA verified by script).
- No Lighthouse / performance audit was run.
- Full-page screenshots can show sticky elements at odd positions (capture artifact; viewport
  screenshots render correctly).

---

## 5. Round 2 — Concepts E–H (2026-10-27)
Environment: Windows 10, Node 22.16, Playwright 1.56 / Chromium (headless), `tools/serve.mjs` on port 8090.

### Automated suite — `qa/run-qa.cjs --shots` (all 8 concepts)
**2535 checks, 2535 passed, 0 failed** (final run after the lead's fixes). Same coverage as §1, now for
8 concepts × 5 pages × 6 viewports + reduced-motion runs; the selector check now requires links to all 8
concepts. Screenshots for E–H added to `qa/screenshots/`. An intermediate `--only=g,h` re-run after the
fixes: 639/639.

### Concept-specific tests (scripted by the implementing agents, Playwright/Chromium, scripts in the session scratchpad)
| Concept | Result | Covered |
|---|---|---|
| E | 247/247 passed | 5 pages × 6 viewports, menu sheet (3 pages @390), form (home @1440, case page @390), spec table (default open, one-at-a-time, keyboard, link targets), section rail spy + per-section progress, top progress bar, process line fill + step lighting, segmented control spy/indicator/sticky, Gantt bar positions/widths vs. real ranges (3 charts @1440 and @390), 12 counters, reduced motion, no-JS, focus/hover |
| F | 37/37 passed (+ QA copy 323/323) | header solid/hide/show/focus, sticky process panel 01→04 + icon crossfade, word-by-word quote, all counters, reel prev/next disabled states, progress, drag vs click, arrow keys, spotlight, floating labels/errors, case chips spy + pin range, timeline draw, reduced motion, no-JS, mobile menu scroll lock, reel peek |
| G | 50/50 passed (+ QA copy 323/323) | nav indicator, process tiles (click/Enter, one open), flip tiles (aria-pressed, inert/aria-hidden swap, back values, tap), 3-step form (per-step validation, Weiter/Zurück, focus, real label/checkbox click, jump to first invalid step), menu, sidebar spy/progress/sticky, timeline fill, KPIs, quote on case 2 only, mobile pill switcher, reduced motion, no-JS |
| H | 32/32 passed (+ QA copy 323/323) | hero arch inset 432→0 px, SVG path dashoffset 1→0 with 4 steps lit, counters, accordion (default, one-at-a-time, Enter/Space, closed panels hidden), chapter overlay + thumbnails, reading progress, case TOC per-case progress, reduced motion, no-JS (all panels open), mobile letter-form errors |

### Lead review (manual)
Full-page and in-viewport screenshots of E–H at 1440 and 390 reviewed. Defects found and fixed:
- G: „Kennzahlen anzeigen“ switch — track collapsed, knob covered the label, then label wrapped
  (`html.js .js-only{display:revert}` overrode `.switch{display:inline-flex}`). Fixed in `css/home.css`, verified by screenshot.
- H: drop cap split the brand name („A|VINOVA“) in the About paragraph — removed there.
- Checked and not a defect: H About photo / quote mark looked empty/odd in an older full-page capture; in-viewport
  screenshots show both correctly.

### Original integrity
`sha256sum -c qa/original-checksums.sha256` → 76/76 OK; `git status` shows no change outside `redesigns/` (and the pre-existing `promt.md`).

### Not tested
Firefox/WebKit, real touch devices, real screen readers, Lighthouse.
