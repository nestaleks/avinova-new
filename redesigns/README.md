# AVINOVA — Redesign concepts

Eight working redesign alternatives of the AVINOVA website (round 1: A–D, round 2: E–H). The original site in the project root is
untouched; everything here lives in `redesigns/`. Analysis and design rationale: `REDESIGN_PLAN.md`.
Status: `PROGRESS.md`. Test report: `qa/TEST_RESULTS.md`.

## Preview

No build step and no dependencies are needed. The pages must be served over HTTP from the **project root**
(they reuse the original images via `../../img/` and load the legal texts from the original pages).

```sh
node redesigns/tools/serve.mjs          # Node ≥ 18, default port 8080 (pass another port as argument)
```

| What | URL |
|---|---|
| Concept selector | http://localhost:8080/redesigns/ |
| A — Refined Original | http://localhost:8080/redesigns/concept-a-refined/ |
| B — Modern Premium | http://localhost:8080/redesigns/concept-b-premium/ |
| C — Dynamic Interactive | http://localhost:8080/redesigns/concept-c-interactive/ |
| D — Creative Brand Evolution | http://localhost:8080/redesigns/concept-d-creative/ |
| E — Architectural Grid | http://localhost:8080/redesigns/concept-e-grid/ |
| F — Noir Cinematic | http://localhost:8080/redesigns/concept-f-noir/ |
| G — Bento Dashboard | http://localhost:8080/redesigns/concept-g-bento/ |
| H — Organic Editorial | http://localhost:8080/redesigns/concept-h-editorial/ |
| Original site | http://localhost:8080/ |

Each concept has `index.html`, `case-studies.html`, `impressum.html`, `datenschutz.html`, `agb.html`.
Any other static server rooted at the project folder works too. Opened via `file://` the pages render,
but the legal pages show a link to the original text instead of the loaded content.

## The concepts

| | A — Refined Original | B — Modern Premium | C — Dynamic Interactive | D — Creative Brand Evolution |
|---|---|---|---|---|
| Idea | Same site, polished | Calm, editorial, premium | Content to explore | Bold poster-like evolution |
| Layout | Original structure, consistent rhythm, 16:10 case cards | Asymmetric 12-col grid, hairlines, editorial case list | Card modules, dark interactive panels | Split hero with chevron frame, sticky stacked case posters |
| Typography | Figtree, fluid modular scale | Figtree 300 display + semibold sage accents, tabular numbers | Figtree 800 headlines, big animated numbers | Figtree 800 italic uppercase display, 400/500 reading |
| Colour | Original tokens | Deep green dominant, sage only accent | Light palette, sage for active/progress | Sage as large surfaces, green, navy secondary ink |
| Signature motion | Staggered fade-ups, drawn process line, count-up, condensing header | Clip-path image unmask, subtle parallax, line-by-line headline, cursor-following case preview | Process stepper (ARIA tabs + autoplay), case showcase with swipe, lightbox, logo marquee, animated timeline, scroll progress | Chevron wipes, kinetic text band, magnetic CTA, sticker badges |
| Risk | Lowest | Low | Medium | Highest (most distinctive) |

All concepts share: original German copy and numbers, original photos/logos/icons (no copies), all original
sections and pages, scroll-spy navigation, accessible mobile menu (Escape, focus handling), contact form
with client-side validation, `prefers-reduced-motion` support, content visible without JavaScript.

### Round 2 — E–H (design rationale: `REDESIGN_PLAN.md` §8)

| | E — Architectural Grid | F — Noir Cinematic | G — Bento Dashboard | H — Organic Editorial |
|---|---|---|---|---|
| Idea | The site as an architect's drawing | Deep green as a night-time stage | Results presented like an analytics product | A warm magazine told in chapters |
| Layout | Visible 12/8/4-col hairline grid, crop marks, coordinate indices (A/01…), spec boxes | Entirely dark, full-viewport hero, wide image bands, faint grain | Bento tiles of different sizes, floating island header | Chapter spreads, arch-topped image masks, margin notes |
| Typography | Figtree 600 sentence case, 300 numerals, tracked technical labels, tabular figures | Figtree 400/500 display, line-mask reveals | Figtree 700 two-tone, 800 numbers | Figtree 300 + italic 400 sage accents, drop caps, pull quotes |
| Colour | Paper, ink, navy as technical ink, sage accent; deep green bands | #061a1a/#0b2321, off-white, light sage only accent | Warm canvas, white / deep green / sage-tint tiles | Warm paper, sage, deep green chapter breaks |
| Case teasers | Expandable spec table (Branche · Zeitraum · Kanäle · Ergebnis) | Horizontal scroll-snap reel (buttons, drag, keys, progress) | Flip tiles → real metrics, honest index bars / rings | Story accordion |
| Process | One line filling with scroll, steps light up | Sticky scrollytelling panel (01–04) | Expanding tiles (one open) | Steps along an SVG path drawn by scroll |
| Case page | Spec sheets, Gantt charts from the real week/month ranges, segmented control | Full-bleed chapter headers, spotlight cards, scroll-drawn timeline | Dashboard with sticky sidebar, KPI widgets, step tiles | Long-form article, sticky TOC with per-case reading progress |
| Contact | Spec form | Floating-label dark form | Vertical 3-step form (all steps usable, single submit) | Letter-style form („Hallo AVINOVA, mein Name ist …“) |
| Extra motion | Section rail with per-section progress (≥1200 px), crosshair row hover | Ken Burns hero, hide-on-scroll header, word-by-word quote | Sliding nav indicator, 3D flip, count-up | Hero arch opens to full width on scroll, chapter overlay menu, reading progress |
| Risk | Low–medium | Medium (dark site) | Medium | Medium |

E–H pages are plain static HTML (the agents generated header/footer/contact from partials with scratch
scripts kept outside the project — when editing, repeat header/footer changes per page).

## Shared files
- `shared/base.css` — brand primitives from the original, reset, a11y helpers.
- `shared/core.js` — `window.AV` helpers: menu, reveal, scroll-spy, count-up, form validation, dialog,
  legal-text loader.
- `tools/serve.mjs` — zero-dependency static server.

## Deliberate deviations from the original
- Nav item „FAQ“ is labelled „Kontakt“ (it always linked to the contact form; no FAQ content exists).
- The contact form does **not** pretend to send: after validation it states that the preview is not
  connected to a server (the original shows a "Vielen Dank" message without sending anything).
- Legal texts are loaded from the original pages at runtime (single source of truth).
- Small UI microcopy was added where controls need labels (e.g. "Case Study ansehen", "Alle anzeigen",
  pause buttons, "← Alle Konzepte").

## Quality checks

```sh
# once, outside the project:
mkdir %TEMP%\av-qa && cd %TEMP%\av-qa && npm i playwright && npx playwright install chromium
# with the preview server running on port 8090:
set PLAYWRIGHT_PATH=%TEMP%\av-qa\node_modules\playwright
node redesigns/qa/run-qa.cjs http://localhost:8090 --shots          # add --only=e,f,g,h to limit concepts
# original files unchanged?
sha256sum -c redesigns/qa/original-checksums.sha256
```

The original project has no lint, type-check or test tooling; none was added to it.
