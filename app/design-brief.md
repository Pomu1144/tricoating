# Triangle Coatings Inc. — design brief

## Design read
Professional buyers (facility managers, OEM engineers, refinishing contractors) who need a
coatings manufacturer that feels like a working chemical plant with 90+ years of formulation
authority: industrial trust, not startup gloss.

## Concept spine
**"The formulation lab"** : the whole page behaves like a batch card from Triangle's lab.
Liquid chemistry is the recurring motif (poured coating self-levelling, mix ratios, product
codes, concentration tables set in mono). Scroll literally plays the pour.

## Delivery tier
`cinema` : Lenis + GSAP ScrollTrigger, Tier-1 scroll-scrubbed hero film, chaptered reveals.

## Locked palette (user's brand colors, override of default bans)
- Brand red `#B30F16` (primary accent, ONE accent page-wide), deep red `#81090F` for hover/depth.
- Gold `#C49A3A` used ONLY inside the logo mark and hairline rules in the data band (logo heritage, not a second accent).
- Ground: near-black charcoal `#14171B` / `#1B1F24` panels (dark industrial page, one theme page-wide).
- Ink-on-light inverts are NOT used: the whole page stays dark, tint-shifts only.
Defense: these are the company's existing brand colors (logo red + gold on dark), so the
palette is inherited, not invented.

## Locked type
- Display: **Archivo** (weight 700-800, tight tracking, condensed feel matches the logo's
  industrial wordmark). No serif: the brand's authority is industrial, not editorial.
- Data/mono: **JetBrains Mono** for product codes, ratios, percentages, prices (batch-card motif).
- Body: Archivo 400/500.

## Tier-1 technique
**A1 : single-shot hero scrub** (wow-catalog). A ~5s generated film of glossy red coating
pouring and self-levelling across a dark steel surface, ffmpeg'd to ~100 frames, canvas
scrubbed by the pinned hero's scroll progress. Defense: the spine is liquid chemistry; the
user's scroll IS the pour. Mobile: shorter pin (150vh), same frames. Reduced motion: static
final frame, no pin.

## Section plan (landing page, 7 sections, 5 layout families, eyebrow budget 3)
1. **Hero** : image-as-canvas, bottom-left text over the scrubbed film. Family: full-bleed canvas.
2. **Batch record strip** : oversized metrics strip (Since 1932 · custom formulation · domestic + international · technical guidance), mono rules. Family: metrics strip.
3. **Coating systems** : gapless bento of the 6 product lines (industrial, concrete, tub & tile, decorative, artist, architectural), varied cell sizes, 2 cells carry imagery. Family: bento.
4. **Custom formulation lab** : asymmetric split, right-weighted lab image, left capability list with mono mix-ratio annotations. Family: split (only use).
5. **Chemistry data band** : full-width dark panel styled as a batch card: real ingredient
   concentrations (Trilon Liquid Porcelain FC White) in mono table, gold hairlines, link to SDS page. Family: data table band. Second-read moment: one oversized "1932" numeral as structure here.
6. **Proof / heritage** : poster-stacked timeline (1932 Berkeley → growth → today Livermore) + field applications line (antennas, bridges, refineries, utility equipment). No invented testimonials; heritage + applications ARE the social proof. Family: poster stack.
7. **Final CTA** : banner CTA, phone + email + catalog. Family: banner.

## Other routes
- `/catalog` : product catalog with request list (localStorage), estimated subtotal, mailto
  order request to orders@tricoat.com. No payment. Reference-pricing disclaimer.
- `/safety` : searchable SDS summary table (hazard classes, transport data) with
  "summary only, official SDS controls" language.

## Asset plan
- Hero film still x2 candidates (glossy red coating pour on dark steel) → winner → seedance 5s scrub clip → frames.
- Lab image (formulation chemist, dark grade).
- Macro coating texture plate (section 6 background).
- Icon sheet: 6 glyphs (drum, flask, layer/coating, shield, triangle, globe) 2px stroke, brand red on charcoal.
- OG card 1200x630 in brand language.
- Logo: USER-PROVIDED red wordmark (kept as-is, nav + footer) + exact geometric triangle mark rebuilt as inline SVG per brand spec (red outer, gold inner).

## CTA inventory (bespoke chrome, no shared button class)
- Hero primary "Explore coating systems": red block button with liquid-fill hover (pseudo-element rises like poured coating).
- Hero secondary "Talk to a specialist": underlined inline link + arrow.
- Catalog card "Add to request": hairline framed block, fills red on hover, mono label.
- Request drawer "Email order request": full-width red banner button, active scale.
- Final CTA "Call 1-925-583-0800": oversized framed block with corner ticks.

## Verification honesty
Pricing, chemical data, historic and environmental claims from the source package are marked
for company verification: catalog shows "reference pricing, confirmed at order time";
safety page states summaries do not replace the official SDS.
