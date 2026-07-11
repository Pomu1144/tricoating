# Performance Report

Date: 2026-07-11

## What changed for Core Web Vitals

### Largest Contentful Paint / Cumulative Layout Shift
- **Removed three external Unsplash hero images** that were full-bleed
  backgrounds behind the LCP hero text. The hero is now a self-contained CSS
  gradient with no network image, so the hero paints immediately and cannot
  shift as media loads.
- **Stable hero height** via `min-height: clamp(420px, 62svh, 620px)` reserved
  before any content — no resize on load.
- **Logo** uses the official SVG with explicit `width`/`height` (200×80) so its
  box is reserved and does not reflow.
- **CLS probe:** document horizontal overflow measured `0` at every required
  width (320–1920px); the hero heading renders with a system fallback font first
  (`Libre Baskerville, Georgia, serif`) so web-font swap does not move it.

### JavaScript
- Split one 27 KB global script into small ES modules loaded as
  `type="module"` (deferred by default). Each initializer is guarded, so no
  work runs on pages that lack a given component.
- No animation framework is loaded; all motion is CSS transitions.
- Event listeners are attached once per element; the cart uses a single
  delegated `click` listener for removals.

### Images / assets
- The favicon package is generated from the triangle mark at exact sizes
  (16, 32, 180, 192, 512, plus `.ico` and scalable `.svg`) — total ≈ 27 KB.
- No large raster hero to download on mobile; nothing above the fold is
  lazy-loaded because there is no above-the-fold image to defer.

### Resilience
- The site is usable without JavaScript: hero, navigation links, content, and
  footer all render; forms fall back to standard submission targets and the
  page still communicates phone/email ordering.

## Remaining performance opportunities (documented, not yet done)

- **Self-host fonts** or subset them. Currently Google Fonts is render-blocking
  via `<link>`; `display=swap` is set to avoid invisible text. Self-hosting would
  remove a third-party connection (also a privacy improvement — see Privacy
  Policy).
- **Minify** CSS/JS for production. The source is unminified for readability;
  a build step could cut transfer size.
- **CSS cleanup:** `style.css` carries legacy rules from the old rotating hero
  and several overlapping `@media` blocks. These are overridden and harmless but
  could be pruned to reduce file size.
- **Real photography:** when Higgsfield/Nano Banana assets are produced (see
  ASSETS.md), deliver responsive `srcset` with WebP/AVIF and explicit dimensions,
  and preload only the true hero image.
- **Caching headers** are controlled by GitHub Pages defaults; a CDN or custom
  headers could improve repeat-visit performance.

## How this was measured

Headless Chromium (Playwright 1.56, Chromium 1194) against a local static server,
fonts blocked to simulate first paint. Console/pageerror capture, overflow
probes, and no-JS render checks are reproducible from
`scratchpad/*.cjs`. A full Lighthouse run against the deployed GitHub Pages URL
is recommended as a follow-up once the branch is live.
