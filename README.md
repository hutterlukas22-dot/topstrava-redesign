# TopStrava — UI refresh (static prototype)

An upgraded front-end for [topstrava.braveshop.cz](https://topstrava.braveshop.cz/),
built from the agreed visual direction. Same brand, same content, same
e-commerce logic — one consistent UI language instead of two competing ones.

**Eight pages:**

| Page | File |
| --- | --- |
| Homepage | `index.html` |
| Krabičky (programy + cenník) | `programy.html` |
| Ako to funguje | `ako-to-funguje.html` |
| Ako vybrať program | `ako-vybrat-program.html` |
| O nás | `o-nas.html` |
| Plnenie objednávky | `dokoncenie-objednavky.html` |
| Často kladené otázky | `faq.html` |
| Kontakt | `kontakt.html` |

---

## Run it locally

No build tooling or dependencies are needed to *view* the site — the `.html`
files are plain static files. Any static server works:

```bash
npx --yes serve . -l 5173
```

Then open <http://localhost:5173>.

## Editing

The header and footer appear on all eight pages, so they are generated from a
single source rather than copy-pasted. After changing anything in `src/`,
regenerate the HTML:

```bash
node build.js
```

- `src/layout.js` — header, footer, `<head>`, shared sections, program data
- `src/pages-a.js` — homepage, programy, dokončenie objednávky
- `src/pages-b.js` — ako to funguje, ako vybrať program, o nás, FAQ, kontakt
- `assets/css/site.css` — the whole design system (tokens → components)
- `assets/js/site.js` — sticky header, mobile nav, accordion, calculator

CSS and JS are cache-busted with a `?v=` query stamped at build time, so a
rebuild always serves fresh assets.

Editing `assets/css/site.css` or `assets/js/site.js` alone does **not** require
a rebuild — but rerun `node build.js` to refresh the cache-busting stamp.

---

## What changed, and why

### Header — 3 bars → 2, and an actual CTA
The old header stacked a gold bar, a dark bar and a grey bar (13 links, three
different type treatments) and contained **no primary call to action**. Gold —
the brand accent — was spent on the least important row, which is why nothing
could stand out.

Now: a quiet cream utility bar, then the dark navigation bar with 7 primary
links, a cart with a visible count, an account icon and one gold
**"Objednať krabičky"** button. On scroll the utility bar retracts and the dark
bar compresses 72 → 60px with a shadow.

Nothing was removed. The four links from the retired third bar, plus Referencie
and Blog, live in the "Krabičky" mega-menu's right-hand column.

### Typography — 1 family, 6 roles
The live site loads **18 font files across 4 families** (Epilogue, Montserrat,
Inter, Roboto). This uses Epilogue only, at five weights.

The live site also scales the whole design down via `:root { font-size: 42% }`
below 1449px, which renders body copy at **10.1px** and labels at 8.7px. Here
the scale is fixed and readable: H1 46 / H2 34 / H3 20 / body 16.5 / labels 12,
with line length capped at ~68 characters.

### Cards — one language, five uses
Meal programs, blog posts, testimonials, delivery info and content blocks all
use the same `.card`: 16px radius, 20/22px padding, layered soft shadow,
16:10 image, uppercase metadata, 18px title, CTA pinned to the bottom, and a
lift-and-warm hover.

Meal programs were previously bare text links in grey pills — no image, price
or calories. They are now real cards.

### Buttons — 3 tiers
The live site renders ten visually distinct buttons, including **two competing
primaries** (orange `#FF9600` pill and gold `#DEB350` rectangle). Here:

- **Primary** — gold fill, dark text, 12px radius
- **Secondary** — outlined, inverts on hover
- **Text** — gold underline + arrow

Grey pills became `.chip` (filters and tags), so they no longer read as buttons.
Orange is retired: one accent means one meaning.

### Spacing
Nine sections previously had nine different paddings (84 / 63.8 / 6.7 / 60.5 /
107.5 / 40.3 / 80.6 / 73.2 / 100.8px). All sections now use
`--sp-section: clamp(56px, 7vw, 96px)`.

---

## Accessibility

Verified across all eight pages at 1440px and 390px:

- No WCAG AA contrast failures (gold is never used as text on white — it is
  `1.97:1`; gold surfaces always take dark text at `8.47:1`)
- Exactly one `<h1>` per page, no heading-level skips
- Skip link, landmarks, visible focus rings, labelled form controls
- No horizontal scrolling; tap targets ≥24px
- `prefers-reduced-motion` respected

The calorie calculator never recommends below the clinical minimum
(1200 kcal for women / 1500 for men) and never suggests a "3 chody" variant
that contradicts the selected sex.

---

## Notes

This is a **front-end prototype**. Forms do not submit, the cart count is
static, and blog links are placeholders — the goal is to show the UI direction
in the real content, not to reimplement the shop.

Photography, logo and the Epilogue webfont are taken from the live site and
remain the property of TopStrava.
