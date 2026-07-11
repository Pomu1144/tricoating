# Bug Audit Report — Triangle Coatings Rebuild

Date: 2026-07-11
Branch: `claude/triangle-coatings-rebuild-wwmyj8`

## JavaScript integrity (stated first priority)

The shared script was rebuilt from a single fragile global file (`script.js`) into
guarded ES modules under `js/`. A syntax check (`node --check`) passes on every
module, and headless Chromium reports **zero uncaught runtime errors** across all
10 pages plus interaction flows (add-to-cart, filter, sort, request modal,
assistant, mobile nav).

| # | Issue (before) | Severity | Fix |
|---|----------------|----------|-----|
| 1 | `getCart()` called `JSON.parse(localStorage.getItem(...))` with no guard — throws if storage is disabled (private mode), full, or corrupt. | High | `js/storage.js` wraps all reads/writes in try/catch with an in-memory fallback and a corrupt-value reset. |
| 2 | Single global `script.js` ran top-to-bottom; an error in any block could abort later features on every page. | High | Split into `storage, cart, ui, store, forms, safety, assistant` modules; `main.js` inits each inside a `try/catch` so one failure is isolated and logged. |
| 3 | `navGroups.forEach(g => g.querySelector("button").addEventListener(...))` dereferenced a possibly-null button. | Medium | `js/ui.js` guards `if (!button) return`. |
| 4 | Sort handler read `.querySelector(".add-to-cart").dataset.price` with no null guard. | Medium | `js/store.js` uses optional chaining and a `0` fallback. |
| 5 | Mobile drawer had no Escape / outside-click close and no focus return. | Medium | `js/ui.js` adds Escape, outside-click, focus return to toggle, and resets state on resize to desktop. |
| 6 | Cart items were injected via template literal without escaping product names (stored-XSS-style risk if names ever contained markup). | Medium | `js/cart.js` escapes names before injection. |
| 7 | JS mobile breakpoint (900px) did not match CSS drawer breakpoint (820px). | Low | Aligned `matchMedia` to 820px. |

## Layout / CSS bugs

| # | Issue | Fix |
|---|-------|-----|
| 8 | Primary nav clipped links at 1280–1440px (≈396px internal overflow); "Architectural Coating" was cut off. | Nav wraps to a second row and uses fuller width; all links reachable, no page scroll (verified 320–1920px). |
| 9 | Mobile nav drawer, when closed, left a ~71px red sliver at the top of the viewport (transform `-115%` insufficient for a 528px-tall menu at `top:150px`). | Authoritative mobile override anchors the drawer under the header and hides it with `visibility:hidden` — height-independent, no peek (verified). |
| 10 | Homepage hero loaded three full-bleed **external** Unsplash images and rotated on a JS timer — layout shift, offline breakage, and a moving target for hero text. | Replaced with one stable, self-contained CSS hero: `clamp()`/`svh` sizing, no external image, renders and is readable without JS, respects `prefers-reduced-motion`. |

## Honesty / integrity bugs (prototype presented as production)

| # | Issue | Fix |
|---|-------|-----|
| 11 | Guest checkout claimed "a confirmation email will be sent" — none was. | Converted to an **order request** that opens a real email to `orders@tricoat.com` and states plainly it is not a completed purchase and no payment is taken online. |
| 12 | Login stored an unauthenticated email in `localStorage` and presented it as a session. | Login page rebuilt as an honest "Account & Orders" page; no fake auth, nothing sensitive stored. |
| 13 | Order lookup replied "We found the lookup request…" with no lookup. | Replaced with an honest order-status **request** (real mailto), clearly stating there is no automated lookup. |
| 14 | Lead / recommendation forms showed a success message but sent nothing. | Forms now submit to real inboxes via mailto and never claim server receipt. |

## Verification performed

- `node --check` on all 9 JS modules — pass.
- Headless Chromium console/pageerror capture on all 10 pages — 0 errors.
- Interaction tests: add-to-cart counter, category filter (updates count, live status, URL param), sort, request modal open/label, assistant reply, mobile drawer open/Escape-close, mobile dropdown expand.
- No-JavaScript render: hero heading and 38 nav links present.
- Horizontal-overflow probe at 1920/1728/1536/1440/1366/1280/1024/834/768/430/375/320 — document overflow `0` at every width.
