# Progress

## Current phase
**Complete** — all 8 phases done (2026-10-26).

## Completed
1. Discovery — repository inspected, original rendered with Playwright, `REDESIGN_PLAN.md`,
   `shared/assets-reference.md`, checksums of all 76 original files (`qa/original-checksums.sha256`).
2. Design direction — concept design systems in `REDESIGN_PLAN.md` §5.
3. Shared foundations — `shared/base.css`, `shared/core.js`, `tools/serve.mjs`, selector `index.html`.
4. Implementation — concepts A–D, 5 pages each (built in parallel by four sub-agents from the plan).
5. Responsive refinement — each concept reviewed at 1920/1440/1024/768/390/360 and fixed.
6. Interaction & animation — see README comparison and `qa/TEST_RESULTS.md`.
7. QA — `qa/run-qa.cjs`: 1271/1271 checks passed; concept-specific scripts passed.
8. Documentation — README, TEST_RESULTS, QA_CHECKLIST, this file.

## Files created (all under `redesigns/`)
`README.md`, `REDESIGN_PLAN.md`, `PROGRESS.md`, `index.html`, `shared/{assets-reference.md,base.css,core.js}`,
`tools/serve.mjs`, `qa/{QA_CHECKLIST.md,TEST_RESULTS.md,run-qa.cjs,results.json,original-checksums.sha256,screenshots/}`,
`concept-a-refined/`, `concept-b-premium/`, `concept-c-interactive/`, `concept-d-creative/`
(each: 5 HTML pages + `css/` + `js/`). No original file was modified.

## Decisions
- Static, dependency-free; served from project root to reuse `img/` without copies.
- Legal texts loaded at runtime from the original pages.
- Honest form status instead of a fake success message.
- „FAQ“ → „Kontakt“.
- Playwright kept outside the project.
- QA scroll helper disables smooth scrolling first (otherwise stepwise scrolling does not move the page).
- Notable fixes during review: D — clip-path-hidden elements never intersect, so the clip moved to
  children; B — hero layout switch moved to 1280 px to keep the wall sign clear; A — about-tags padding
  overridden by `ul[role=list]`; C — KPI row invisible, double-numbered legal TOC, clipped tab at 768 px.

## Known issues
- Social links point to `#` (no real URLs in the original).
- `AV.spy` keeps the last highlight when scrolling above the first observed section (minor; e.g. legal TOC).
- B: the cursor preview covers the hovered row's result badge while hovering.
- C/D: consent checkbox moved before the submit button; C adds a 1000-character limit for the message counter.
- C: sub-pages were assembled from shared fragments — header/footer edits must be repeated per page
  (true for all concepts, as in the original).
- Only Chromium tested.

## Next steps (optional)
- Pick a concept, then connect the form to a real endpoint and add real social URLs.
- Cross-browser pass (Firefox, Safari) and a Lighthouse audit.

---

# Round 2 — Concepts E–H (2026-10-27)

## Current phase
**Complete** — E–H implemented, integrated, QA'd and documented.

## Completed
1. Plan — `REDESIGN_PLAN.md` §8 (design systems E–H, differentiation from A–D).
2. Implementation — four parallel agents, one per concept, each in its own folder with its own server port
   (8091–8094) and Playwright tests in the session scratchpad (not in the project). Interrupted once by an
   API rate limit; all four resumed from their saved state and finished.
3. Integration — selector `index.html` (8 cards, grouped by round, card titles h3 under round h2),
   `README.md` (URLs + comparison table), `qa/run-qa.cjs` (8 concepts, `--only=` filter).
4. Lead review + fixes — G: flip switch track collapsed and label wrapped (`html.js .js-only{display:revert}`
   overrode `.switch`'s inline-flex; inline span had no width); H: removed the drop cap from the About
   paragraph (it split the brand name „A|VINOVA“).
5. QA — see `qa/TEST_RESULTS.md` §5.

## Files created / modified (round 2)
New: `concept-e-grid/`, `concept-f-noir/`, `concept-g-bento/`, `concept-h-editorial/` (5 pages + css/ + js/ each).
Modified: `index.html`, `README.md`, `REDESIGN_PLAN.md`, `PROGRESS.md`, `qa/run-qa.cjs`, `qa/TEST_RESULTS.md`,
`qa/results.json`, `qa/screenshots/`. `shared/*` and concepts A–D unchanged; original site unchanged.

## Known issues (E–H)
- Social links `href="#"` (as original). Only Chromium tested; no real touch device / screen reader.
- E: desktop spec table relies on CSS `subgrid` and `:has()` (current browsers only).
- F: wide panorama case photos are cropped hard in tall reel cards; Ken Burns loops (paused off-screen, off
  under reduced motion). Added microcopy „Bewertung“, „Case ansehen“.
- G: hero caption chip „Unser Büro“ (from the original's image label). Index bars only for the three
  percentage increases (Ausgangslage = 100), rings only for 6,4 % and 48 %.
- H: hero photo slightly soft while the arch is closed (starts at 1.16× scale). Added microcopy: chapter and
  figure labels, the letter sentence, „Eckdaten“, „Epilog“.
- Full-page screenshots show sticky/scroll-linked elements in odd states (capture artefact).

## Next steps (optional)
- Choose a direction; connect the form to a real endpoint; add real social URLs; cross-browser pass.
