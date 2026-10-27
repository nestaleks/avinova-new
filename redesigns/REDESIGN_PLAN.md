# AVINOVA — Redesign Plan

Evolutionary redesign of the AVINOVA website: four alternative, fully working concepts built next to the
original site. The original site is **not modified**; everything new lives in `redesigns/`.

---

## 1. The original site

### Purpose and audience
AVINOVA is a German-language (`lang="de"`, informal "du") marketing and lead-generation agency
(AVINOVA OÜ, Tallinn, with a branch in Garching bei München). The audience is owners and managers of
small and mid-sized businesses (construction, dental practices, fitness studios) who want a predictable
flow of qualified enquiries. The single business goal of the site is the **free potential analysis**
(„Kostenlose Potenzialanalyse“) — every CTA leads to the contact form.

### Stack
| Item | Finding |
|---|---|
| Type | Hand-written static HTML/CSS/JS, no framework, no build step, no package.json |
| Entry point | `index.html` (served as static files) |
| Pages | `index.html`, `case-studies.html`, `impressum.html`, `datenschutz.html`, `agb.html` |
| CSS | `css/style.css` (global + all pages), `css/hero.css`, `css/steps.css`, `css/images.css` (responsive WebP backgrounds), `css/case-studies.css` |
| JS | `js/main.js` (sticky header shadow, burger menu, reveal-on-scroll, case-nav chip highlight, legal TOC highlight, form validation), `js/timeline.js` (Web Animations API timeline on case studies) |
| Fonts | Figtree (Google Fonts) 400/500/600/700/800 + 800 italic |
| Dependencies | none; no lint/test/type-check tooling exists |
| Instruction files | no AGENTS.md / CLAUDE.md in the repo |
| Unrelated folder | `hover/` (Stylus/Pug social-button demo, not linked from the site) |

### Information architecture
**Home (`index.html`)**: sticky header (logo, Leistungen → #case-studies, Ergebnisse → #ergebnisse,
Ablauf → #ablauf, Über uns → #ueber-uns, FAQ → #kontakt, CTA visible only in the mobile menu) →
dark full-bleed hero with photo of the office wall sign → partner logos (Google, Meta, HubSpot, Shopify,
LinkedIn, Semrush) → About („Wir glauben an messbares Wachstum.“ + tags Strategie/Umsetzung/Wachstum) →
Process (4 steps Analyse/Strategie/Umsetzung/Wachstum) → Testimonial (Dr. Markus Weber, Weber Dental,
5 stars, stat card +95 % Neupatienten in 3 Monaten) → Case study teasers (3 cards) → Contact
(checklist + form name/email/message/consent) → footer (logo, legal links, social icons).

**Case studies**: hero with laptop photo + 3 KPIs → sticky chip navigation → three cases
(Bauunternehmen, Zahnarztpraxis, Fitnessstudio), each with image + badge, index, h2, intro, facts (Branche,
Zeitraum, Kanäle), 3 blocks (Ausgangslage, Unsere Lösung, Ergebnis), dark results panel with 3 metrics,
animated 4-step timeline, quote (case 2 only) → CTA band → contact → footer.

**Legal pages**: hero (breadcrumb, eyebrow „Rechtliches“, h1, intro, „Stand: Oktober 2026“) →
sticky TOC + page switcher → prose sections.

### Visual identity
| Token | Value | Role |
|---|---|---|
| `--dark` | `#061a1a` | Deep green-black: dark sections, primary buttons, badges |
| `--dark-2` | `#0b2321` | Hover fill |
| `--bg` / `--bg-2` | `#fbfaf6` / `#fefdfb` | Warm off-white page backgrounds |
| `--ink` | `#0d1117` | Headlines |
| `--text` / `--muted` | `#3e4352` / `#6b7084` | Body / secondary text |
| `--accent` | `#5f716a` | Sage green — accent half of headlines, case index |
| hero accent | `#a9c7b6` | Light sage on dark |
| `--check` | `#a6cf86` | Light green check marks |
| icon colour | `#19224b` | Navy inside the SVG icons |
| `--star` | `#f5c518` | Rating stars |
| `--link` | `#2f95d3` | Text links („Alle Case Studies“) |

- Typography: Figtree only; bold, tight-tracked headlines (`-.02em`); uppercase wide-tracked eyebrows
  (`.24em`); two-tone headlines (ink + sage accent).
- Shapes: pill buttons (`999px`), 12–18px card radii, soft low-contrast shadows.
- Signature interaction: **diagonal fill sweep** on buttons, chips, KPIs and metrics (a rotated square
  slides in from bottom-left).
- Photography: warm, architectural, green plants, dark green walls; the AVINOVA wall sign in the hero.
- Tone: confident, short, results-oriented sentences; numbers as proof.

### Strengths
- Clear single conversion goal, consistent CTA.
- Strong, coherent colour palette and photography; recognisable two-tone headlines.
- Real proof: concrete numbers, a named testimonial, detailed case studies.
- Already performance-minded (responsive WebP, lazy loading, width/height attributes).

### Weaknesses / opportunities
- Type scale is inconsistent: body text in cards is 20–23px on desktop while headings are 24–27px —
  hierarchy is flat in the teaser cards, steps, testimonial and contact areas.
- Vertical rhythm is uneven (sections use 14px…96px paddings; the contact section is only 14px tall padding).
- Desktop header has no visible CTA; „FAQ“ links to the contact form although there is no FAQ.
- Case teaser images are cropped to 138px height — the photos lose impact.
- Motion is limited to one generic reveal; process and numbers are static.
- Contact form claims success without sending anything (`TODO` in `main.js`).
- Social links point to `#` (real URLs are not in the repository).

---

## 2. Reusable content and assets
See `shared/assets-reference.md` for the full inventory. All concepts reference originals through
relative paths (`../../img/...`) — no binaries are copied or modified.

---

## 3. Shared requirements (all concepts)
- Same pages as the original: home, case studies, Impressum, Datenschutz, AGB.
- Same copy (German, „du“), same numbers, same testimonial, same partner logos. No invented claims.
- Same section order on the home page unless a concept documents a reason to differ.
- Every CTA leads to the contact form; the form validates client-side and then honestly states that
  **sending is not connected in this preview** (no fake success message).
- Navigation label „FAQ“ (which pointed to the contact form) is renamed **„Kontakt“** — there is no FAQ
  content, and inventing one is out of scope. Documented usability fix.
- Legal pages: the legal text has a single source of truth — each concept's legal page loads the
  `.prose`/TOC content from the original page at runtime (`shared/core.js → AV.loadLegal`) and renders
  it in the concept's styling. Fallback (no JS / `file://`): a visible link to the original page.
- `html.js` class gates every hide-before-reveal style, so content is visible without JavaScript.
- `prefers-reduced-motion: reduce` disables movement (reveals become instant, loops stop, counters
  show final values).
- Keyboard: visible `:focus-visible`, Escape closes menus/dialogs, focus is trapped in open dialogs
  and returned to the trigger.
- Touch: no hover-only content; all targets ≥ 44px.
- Images: `srcset`/`sizes`, `loading="lazy"` below the fold, explicit `width`/`height` or aspect ratio.
- No new runtime dependencies. CSS + vanilla JS + Web Animations API only.

## 4. Technical constraints
- Static files served from the **project root** so `../../img/` resolves; any static server works.
  A zero-dependency server is provided: `node redesigns/tools/serve.mjs`.
- `fetch` of the legal source requires http(s) — on `file://` the fallback link is shown.
- Google Fonts is loaded exactly like the original (same privacy situation as the original site).

---

## 5. Concept design systems

### Concept A — Refined Original (`concept-a-refined/`)
*The safest option: the same site, tidied up.*
- **Visual direction**: identical layout logic and imagery to the original; fixes rhythm, scale and details.
- **Typography**: Figtree; a real modular scale (h1 64 → h2 44 → h3 22, body 17/18, small 15) with
  `clamp()`; body copy never larger than lead copy.
- **Colour**: exact original tokens.
- **Layout**: consistent section padding (`clamp(64px, 8vw, 112px)`), 12-column container 1306px,
  case teaser images at 16:10 instead of 138px strips, contact section with real breathing room.
- **Components**: original pill buttons with the diagonal-fill hover, header CTA visible on desktop,
  cards with 16px radius and hairline border + soft shadow, process steps with connecting line.
- **Motion**: gentle staggered fade-up reveals, hero entrance, step line draws in, number cards count up
  once, header condenses on scroll.
- **Interaction**: active-section highlight in the nav (scroll-spy), mobile menu as a full-height sheet,
  back-to-top button.
- **Mobile**: original stacked structure, larger tap targets, hero photo below the copy (as original).

### Concept B — Modern Premium (`concept-b-premium/`)
*Calmer, more editorial, more expensive-feeling.*
- **Visual direction**: generous whitespace, hairline rules, numbered sections („01 — Über uns“),
  dark/light alternation used deliberately, large photographs with masked reveals.
- **Typography**: Figtree only, but used with more contrast: light 300 display weights for large
  headlines with semibold accents, small-caps-like tracked labels, tabular figures for numbers.
- **Colour**: `#061a1a` becomes the dominant premium surface (hero, testimonial, results, footer);
  warm off-white for reading sections; sage `#a9c7b6` as the only accent on dark.
- **Layout**: asymmetric 12-column grid; editorial case list (rows with large number, title, result) on
  home; the case-studies page uses wide image + sticky side column.
- **Components**: thin-bordered ghost buttons + one solid primary; underline-sweep links; hairline cards.
- **Motion**: clip-path image unmask on enter, slow subtle image parallax (transform only, ≤ 40px),
  line-by-line headline rise, cursor-following image preview on the case list (pointer devices only).
- **Interaction**: header transparent over the dark hero, solid after scroll; full-screen overlay menu.
- **Mobile**: single column, images full-bleed, overlay menu with large type.

### Concept C — Dynamic Interactive (`concept-c-interactive/`)
*Engaging, interactive, still professional.*
- **Visual direction**: brighter use of the light palette with dark interactive panels; content is
  explored rather than just scrolled.
- **Typography**: Figtree 700/800 for headlines, 500 for UI; numbers large and animated.
- **Colour**: original tokens; sage accent used for progress/active states.
- **Layout**: card-based modules.
- **Components & interactions**:
  - scroll progress bar in the header;
  - partner logos as an infinite marquee (pauses on hover/focus, static under reduced motion);
  - process as an **accessible tab/stepper** (ARIA tabs, arrow keys, optional autoplay with pause button);
  - testimonial stat counts up when visible;
  - case studies as an **interactive showcase** (tabs + previous/next, swipe on touch);
  - case images open in an accessible **lightbox dialog**;
  - case-studies page: case switcher tabs synced with the URL hash, results metrics count up,
    original animated timeline re-implemented;
  - contact form: inline validation, character counter, button loading state.
- **Motion**: spring-like transforms, staggered card entrances, 3D tilt on case cards (pointer only).
- **Mobile**: tabs become horizontally scrollable pills; swipe support in the showcase.

### Concept D — Creative Brand Evolution (`concept-d-creative/`)
*A bolder, more memorable interpretation.*
- **Visual direction**: poster-like compositions, big typography, sage colour blocks, angled image frames
  echoing the „AV“ chevrons of the logo.
- **Typography**: Figtree 800 italic (already loaded by the original but unused) for display words,
  uppercase, very tight tracking; Figtree 400/500 for reading.
- **Colour**: deep green `#061a1a`, light sage `#a9c7b6` as large surfaces, off-white; navy `#19224b`
  of the icons as a secondary ink. No new hues.
- **Layout**: asymmetric split hero with a clipped photo frame, oversized outline numbers for the process,
  a kinetic text band using the real about-tags („Strategie · Umsetzung · Wachstum“), case studies as
  full-width stacked „posters“.
- **Components**: square-cornered buttons with an arrow that slides through, sticker-style badges.
- **Motion**: chevron-shaped reveals (clip-path polygons), marquee band, sticky stacking case posters
  (CSS `position: sticky`, no scroll hijacking), magnetic primary CTA (pointer only).
- **Mobile**: posters become simple stacked cards; kinetic band stays but slows; reduced motion → static.

---

## 6. Implementation phases
1. **Discovery** — this document, `shared/assets-reference.md`. ✔
2. **Design direction** — section 5. ✔
3. **Shared foundations** — `shared/core.js` (menu, reveal, scroll-spy, form validation, count-up,
   legal loader, dialog focus trap), `shared/base.css` (reset + brand primitives + reduced motion),
   `tools/serve.mjs`, concept selector `redesigns/index.html`.
4. **Implementation** — concepts A–D, each: `index.html`, `case-studies.html`, `impressum.html`,
   `datenschutz.html`, `agb.html`, `css/`, `js/`.
5. **Responsive refinement** — 1920, 1440, 1024, 768, 390, 360 widths.
6. **Interaction & animation polish.**
7. **QA** — Playwright script `qa/run-qa.cjs`: console errors, failed requests, horizontal overflow,
   broken images, menu/form/tabs/dialog checks, reduced motion; screenshots in `qa/screenshots/`.
8. **Documentation** — README, PROGRESS, TEST_RESULTS.

## 7. QA strategy
- Automated (Playwright, Chromium): every page of every concept at 6 viewports; console errors, page
  errors, HTTP ≥ 400, failed requests, `scrollWidth > innerWidth`, `img.naturalWidth === 0`, invisible
  `.reveal` elements after scrolling, mobile menu open/close + Escape, form invalid/valid submit,
  concept-specific widgets, reduced-motion emulation.
- Manual review of screenshots against the original.
- Original integrity: `sha256sum -c qa/original-checksums.sha256` (taken before any work) + `git status`.

---

## 8. Second round — Concepts E–H (2026-10-27)

Four further directions, built to the same requirements (sections 1–4, 7) and with the same shared
foundations (`shared/base.css`, `shared/core.js` — **not modified**, so A–D keep working). They were chosen
to differ from A–D in composition and interaction model, not just colour:

| | A–D already cover | E–H add |
|---|---|---|
| Layout | original structure, editorial list, card modules, posters | strict architectural grid, cinematic dark, bento tiles, long-form magazine |
| Case teasers | cards, list w/ cursor preview, tab showcase, sticky posters | expandable spec table, horizontal scroll-snap reel, flip tiles, story accordion |
| Process | line, numbered columns, ARIA stepper, outline numbers | scroll-lit grid line, sticky scrollytelling, expanding tiles, scroll-drawn SVG path |
| Case timeline | WAAPI timeline (C) | Gantt chart from the real week/month ranges (E), scroll-drawn vertical line (F), step tiles (G), margin notes (H) |
| Contact | classic form | spec form (E), floating-label dark form (F), 3-step form (G), letter-style form (H) |

Shared rules stay: original German copy and numbers only, original images via `../../img/`, no new
dependencies, Figtree only, five pages per concept, legal text loaded by `AV.loadLegal`, honest form
status (`AV.form`), content visible without JS (`html.js` gating), `prefers-reduced-motion` honoured,
targets ≥ 44 px, no hover-only content.

### Concept E — Architectural Grid (`concept-e-grid/`)
*Precision and order — the office interior and "planbar und messbar" read as an architect's drawing.*
- **Visual direction**: warm paper `#fbfaf6`, faint visible 12-column hairline grid, crop/registration
  marks on image frames, coordinate-style indices („A/01“), spec-sheet boxes.
- **Typography**: Figtree 600 headlines (sentence case), 300 for very large numerals, 600 uppercase
  10–12 px technical labels with wide tracking, tabular figures everywhere.
- **Colour**: ink `#0d1117` + navy `#19224b` (the icon colour) as the technical secondary ink, sage
  `#5f716a` as the only accent, deep green `#061a1a` for one testimonial band and the footer.
- **Layout**: everything snaps to the 12-col grid; sticky vertical section index with per-section
  progress on desktop (≥1200 px).
- **Components**: 2 px radius rectangular buttons with a left-to-right ink fill, hairline tables,
  spec boxes.
- **Signature interactions**: process line fills step by step as the section scrolls (scroll-linked,
  no hijacking); home case teasers as a **spec table** (Branche · Zeitraum · Kanäle · Ergebnis) whose rows
  expand (button + `aria-expanded`) to reveal image and summary; case-studies page with a **Gantt chart**
  built from the real timeline ranges (Woche 1–2 … 9–12; Monat 1–3; Woche 1–16), bars grow in on view;
  metrics count up.
- **Mobile**: 4-col grid, section index becomes a thin top progress bar, table rows become stacked cards.

### Concept F — Noir Cinematic (`concept-f-noir/`)
*The brand's deep green as a night-time stage — premium, calm, cinematic.*
- **Visual direction**: whole site dark (`#061a1a` base, `#0b2321` surfaces, hairlines `rgba(255,255,255,.1)`),
  off-white text, light sage `#a9c7b6` accent, star yellow only for the rating. Very subtle static grain.
- **Typography**: Figtree 400/500 display with tight tracking, line-mask headline reveals, 600 micro labels.
- **Layout**: full-viewport hero photo, generous vertical spacing, wide image bands.
- **Components**: outline pill buttons that fill with sage, pointer-following spotlight glow on cards
  (fine pointers only), white partner logos at reduced opacity.
- **Signature interactions**: slow Ken-Burns on the hero (off under reduced motion); **sticky
  scrollytelling** for the process (sticky panel number/icon follows the step in view);
  testimonial quote revealed word by word as it scrolls; case teasers as a **horizontal scroll-snap reel**
  with prev/next buttons, drag on desktop, keyboard and progress bar; case page with full-bleed chapter
  headers and a scroll-drawn vertical timeline; floating-label form.
- **Mobile**: reel becomes a swipeable snap row, scrollytelling degrades to stacked steps.

### Concept G — Bento Dashboard (`concept-g-bento/`)
*Results-first: the agency's numbers presented like a clean analytics product.*
- **Visual direction**: light warm canvas `#f2f1eb`, white tiles, deep green tiles, sage tint tiles
  (`#e3ebe5`, a tint of the original sage), 24–28 px radii, soft layered shadows.
- **Typography**: Figtree 700 headlines (moderate size), 500 UI, 800 for numbers.
- **Layout**: bento grids — hero, about, process and results composed of tiles of different sizes.
- **Components**: floating "island" header with a sliding active-link indicator, pill chips, widget tiles.
- **Signature interactions**: case tiles **flip** to their real metrics („Kennzahlen anzeigen“ button,
  `aria-pressed`, inactive face hidden from AT); honest index bars (Ausgangslage = 100 → +142 % = 242);
  process tiles expand on click/focus; **3-step contact form** (Kontakt → Anliegen → Einwilligung) with
  progress and per-step validation, all fields visible without JS; case-studies page as a dashboard with a
  sticky case sidebar, count-up KPI widgets and step tiles.
- **Mobile**: tiles stack into a single column with 2-up small tiles; sidebar becomes a pill switcher.

### Concept H — Organic Editorial (`concept-h-editorial/`)
*A warm magazine — the story behind the numbers, told in chapters.*
- **Visual direction**: warm paper `#f6f3ec`, ink, sage and deep green chapter breaks; arch-topped image
  masks echoing the plants and warm interiors of the photography; pill buttons as in the original.
- **Typography**: Figtree 300 large display with Figtree **italic 400** accents (same family, extra
  styles requested from Google Fonts), drop caps, pull quotes, 18–19 px reading text.
- **Layout**: chapters („Kapitel 1 · Über uns“), two-column magazine spreads, margin notes.
- **Signature interactions**: hero image that opens from an arch to full width as you scroll
  (scroll-linked `clip-path`); process along an **SVG path drawn by scroll**; case teasers as a story
  **accordion** (one open); chapter menu overlay with thumbnails; reading-progress bar; case-studies page
  as a long-form article with sticky chapter TOC and margin facts; **letter-style form**
  („Hallo AVINOVA, mein Name ist …“) with real labels.
- **Mobile**: single column, arches kept, margin notes become inline boxes.

### Phases for E–H
1. Plan (this section). 2. Implementation by four parallel agents (one per concept, isolated folders,
own Playwright checks on separate ports 8091–8094). 3. Integration: selector page, README, QA script
extended to 8 concepts. 4. Full QA run + screenshot review + fixes. 5. Docs (PROGRESS, TEST_RESULTS).
