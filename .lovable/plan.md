# Fix the Gifts page, mobile taps and image weight

Correction only — no new pages, no redesign of the list itself.

## 1. Replace the obsolete Gifts header

`/planner/gifts` still renders the old dark header. Everything above the summary strip gets removed:

- the CSS "snowy village" banner (grey building blocks, glowing lamp, triangle tree, sleeps counter strip)
- the dark navy header panel
- the "PEOPLE & PRESENTS" label and "My People & Presents" heading
- the old cream/navy header layout

In its place, a simple premium cream header in the new visual language:

- Small gold label: GIFTS & PEOPLE
- Heading: My Christmas Gifts
- Supporting line: "Everyone you love, every little idea and every budget — kept safe in one beautiful place."
- Subtle gold hairline detailing only. No hero photo, no decorative village.

The four existing header actions (Add person, Add present, Gift Finder, Secret Santa) stay, restyled to the gold/cream buttons so users can act straight away.

## 2. The list itself is untouched

All people cards, gifts, budgets, filters, search, progress, editing controls and database reads stay exactly as they are on `/planner/gifts`. Nothing is duplicated or moved.

The summary/filter/search blocks below the header get their cream-and-gold surface treatment so the page reads as one consistent screen rather than half-navy, half-cream.

## 3. One Gifts destination

Already in place and kept: an exact visit to `/planner/people` redirects to `/planner/gifts`, `/planner/people/<id>` person pages keep working, and every nav item, Tip card, Gift Finder link and CTA points at `/planner/gifts`. A sweep confirms no "My People & Presents" wording or destination remains anywhere.

## 4. VIEW MY GIFTS on Planning HQ

The Gifts panel keeps its four actions and keeps the gold "View My Gifts" button above them, opening `/planner/gifts` — which now shows the full list immediately under the new header. Label styled in uppercase gold.

## 5. Mobile tap reliability

Audit across planner pages and shared components:

- every decorative layer (snowfall, gradients, veils, flourishes, background photos, glows) gets `pointer-events: none`
- every button, link and clickable card gets a minimum 44x44px touch target
- unnest any button inside a link (and vice versa)
- remove unnecessary `preventDefault` on navigation handlers
- ensure loading/saving states never leave a full-screen invisible overlay
- keep the floating Help button clear of primary actions (it already hides when a modal is open; add bottom padding so it can't sit over the last card action)

Verified by tapping each planner action once at 390px width in a real browser run.

## 6. Image weight

`src/assets` is currently ~17MB, with seven files over 1MB (hero-village.jpg 1.9MB, the three circle PNGs ~1.5MB each, card-party, home-band, card-crafts).

- Re-encode every oversized asset to WebP at sensible display dimensions (heroes max 1600px wide, cards max 900px, circular vignettes max 600px), targeting under ~150KB each
- Keep transparency on the circular vignettes (WebP with alpha)
- Update imports to the new files and delete the originals
- Add `loading="lazy"` and `decoding="async"` to below-the-fold images; keep the homepage hero eager with a preload link

Expected result: several megabytes removed from initial mobile load.

## Technical notes

- All header work is inside `src/routes/_authenticated/planner.gifts.tsx` (lines ~226–300); `BuyingForPage` stays the exported component and its `head()` metadata is unchanged.
- Colour values come from the existing `.planner-light` cream/gold tokens in `src/styles.css`; no new tokens.
- Image conversion runs through `sharp`/`ffmpeg` in the sandbox at build time only — no runtime image pipeline.
