# Asset Inventory

Date: 2026-07-11

## Generated in this rebuild

### Favicon package (from the official triangle mark)
Rasterized directly from the triangle geometry in
`assets/triangle-coatings-logo.svg` — no new symbol was invented, and the
wordmark logo itself was not regenerated or redrawn.

- `assets/favicon/favicon.ico` (16/32/48)
- `assets/favicon/favicon.svg` (scalable)
- `assets/favicon/favicon-16x16.png`
- `assets/favicon/favicon-32x32.png`
- `assets/favicon/apple-touch-icon.png` (180×180)
- `assets/favicon/android-chrome-192x192.png`
- `assets/favicon/android-chrome-512x512.png`

### Site infrastructure
- `site.webmanifest`, `robots.txt`, `sitemap.xml`
- `404.html` (with `<base>` so it works from any URL depth on the `/tricoating/` Pages path)
- `privacy.html`, `terms.html`, `accessibility.html`

### Inline SVG icon system (replaces character glyphs)
- Six homepage solution-panel icons (industrial, concrete, tub & tile,
  decorative, artist, architectural)
- Footer social icons (Facebook, Instagram, LinkedIn, YouTube) as inline SVG
- Hero arrow, nav caret (CSS triangle) — all decorative SVG marked `aria-hidden`

### JavaScript modules (`js/`)
`storage.js, cart.js, ui.js, store.js, forms.js, safety.js, assistant.js, util.js, main.js`

## Existing assets reused
- `assets/triangle-coatings-logo.svg` — official logo, used in header and footer
- `assets/assets-tricoat-2026-05-29/` — product reference photos (small
  thumbnails, ~300 KB total). Not used as large hero/panel imagery because their
  resolution is too low for editorial crops; the catalog uses a neutral
  "Product image pending" placeholder instead of the old single-letter tiles.

## NOT generated this session (documented, requires approval/credits)

The brief requests original **Higgsfield** cinematic hero video (desktop + mobile)
and a **Nano Banana Pro** still-image set (7 categories, desktop/mobile crops,
WebP/AVIF). These were **not** produced here to avoid:

- spending image/video generation credits without explicit sign-off, and
- shipping unverified generated media that would need art-direction review.

The MCP tools for both are available in this environment. Recommended next step:
generate to the exact specs in the brief, review, optimize to WebP/AVIF with
`srcset`, and drop them into the hero and solution panels (the markup already has
clean slots: `.hero`, `.solution-card`, and the catalog `.product-thumb`).

Until then the site ships with the stable, self-contained CSS hero and neutral
placeholders — no fake or misleading generated imagery, and no generated image
contains fabricated text or logos.

## Before/after screenshots
See `reports/screenshots/`:
`before-home-desktop`, `before-store-desktop`, `after-home-desktop`,
`after-home-1366`, `after-home-mobile-closed`, `after-home-mobile-open`,
`after-store-desktop`, `after-about-desktop`.
