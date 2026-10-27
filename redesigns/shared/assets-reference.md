# Asset reference

All paths are relative to the project root. From a concept page (`redesigns/concept-x/…`) use `../../img/…`.
Originals are never modified or copied. Prefer the responsive WebP variants; the large JPG/PNG files are
only kept as originals.

## Brand
| Path | Type | Size | Current use | Use in redesigns |
|---|---|---|---|---|
| `img/logo-400.webp`, `img/logo-800.webp` | Logo (dark on transparent) | 400×61 / 800×123 | Header, footer (1x/2x) | Header/footer on light backgrounds |
| `img/logo.png` | Logo master | 2112×324, 197 KB | not used | avoid (large) |
| `img/logo-white.png` | Logo (white on transparent) | 697×116, 31 KB | not used | Header/footer on dark backgrounds (B, D) |
| `img/favicon-32.png`, `img/favicon-180.png` | Favicon / touch icon | 32², 180² | `<head>` | same |

## Photographs (aspect ratio)
| Path | Size | Ratio | Current use | Use in redesigns |
|---|---|---|---|---|
| `img/hero-800/1400/2089.webp` (`hero.png` master 2.3 MB) | 2089×753 | 2.77:1 | Home hero; office with AVINOVA wall sign on the right | Hero in all concepts; keep the right side (sign) visible |
| `img/about-team-640/1044.webp` (`about-team.jpg`) | 1044×768 | 1.36:1 | About section | About |
| `img/testimonial-640/1100.webp` (`testimonial.jpg`) | 1100×733 | 1.5:1 | Testimonial (Dr. Weber, face right of centre) | Testimonial |
| `img/avatar-weber-96/192.webp` (`avatar-weber.png`) | 192×192 | 1:1 | Testimonial person + case quote | same |
| `img/case-bau-600/1100/1600.webp` (`case-bau.jpg`) | 1600×535 | 2.99:1 | Case card + case page (modern house at dusk) | Case teasers / pages |
| `img/case-zahnarzt-600/1100/1600.webp` | 1600×535 | 2.99:1 | Case card + case page (bright practice) | same |
| `img/case-fitness-600/1100/1600.webp` | 1600×535 | 2.99:1 | Case card + case page (dark gym) | same |
| `img/studies-hero-800/1300/1774.webp` (`studies-hero.png`) | 1774×887 | 2:1 | Case studies hero (laptop dashboard, white wall left) | Case studies hero |
| `img/contact-bg-800/1400/2172.webp` (`contact-bg.jpg`) | 2172×724 | 3:1 | Contact background (dark green wall, plants) | Contact / CTA backgrounds |
| `WhatsApp Image 2026-10-05 at 22.16.26.jpeg` | — | — | Reference mock-up of the home page, not used on the site | Visual reference only |

## Icons (`img/icons/`, navy `#19224b` unless noted)
| File | Current use | Use |
|---|---|---|
| `search.svg`, `target.svg`, `rocket.svg`, `diagram.svg` | Process steps 01–04 | Process steps |
| `flag.svg`, `lamp.svg`, `growth.svg` | Case blocks Ausgangslage / Lösung / Ergebnis | same |
| `check.svg` (dark), `check-white.svg`, `check-color.svg` (green circle) | Lists, hero checks, contact checklist | same |
| `arrow-black.svg`, `arrow-white.svg` | Button arrows | Buttons (or inline SVG with `currentColor`) |
| `circle-notch.svg`, `point.svg` | Animated case timeline | Timeline (C) |
| `google-`, `meta-`, `hubspot-`, `shopify-`, `linkedin-`, `semrush-logo.svg` | Partner row (`#19224b`) | Partner row / marquee |

Inline SVGs in the HTML (copy from the original markup): star, LinkedIn/Instagram/YouTube social icons,
right arrow (`M4 12h15M13 6l6 6-6 6`), form-success check.

## Fonts
Figtree via Google Fonts: 400, 500, 600, 700, 800, 800 italic (already requested by the original).
Concept B additionally requests weight 300 of the same family.

## Content sources
- Home copy: `index.html`
- Case study copy, facts, metrics, timelines, quote: `case-studies.html`
- Legal copy: `impressum.html`, `datenschutz.html`, `agb.html` (loaded at runtime by the concepts)

## Missing / limitations
- No real social-media URLs in the original (`href="#"`); concepts keep the icons and document this.
- No FAQ content exists although the original nav has a „FAQ“ item.
- No backend endpoint for the contact form.
