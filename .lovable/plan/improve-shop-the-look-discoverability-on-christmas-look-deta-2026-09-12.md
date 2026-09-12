# Improve Shop the Look discoverability on Christmas Look detail pages

Small UX/navigation change only. No database, product, routing, component-layout or design-system changes.

## Current state (verified)

- `src/routes/inspire.looks.$slug.index.tsx` renders, in order:
  1. Colours of the Look / Key elements cards
  2. `<InspirationGallery />`
  3. The full Shop the Look section (eyebrow "Shop the look", heading, `LookCategorySection`s, `AffiliateDisclosure`)
- `src/components/looks/InspirationGallery.tsx` is a simple section with an eyebrow, heading, supporting copy, and a responsive grid of `InspirationCard`s. It returns `null` when there are no inspirations.
- The Shop the Look section currently has no `id`, so it cannot be linked to directly.

## What will change

### 1. Anchor the Shop the Look section
Add `id="shop-the-look"` to the existing `<section>` that wraps the Shop the Look content in `src/routes/inspire.looks.$slug.index.tsx`.

### 2. Add a contextual CTA inside the Inspiration Gallery area
Inside `InspirationGallery`, after the inspiration grid, add a compact editorial CTA:

- "Love this look?" as the prominent heading.
- "Shop pieces to recreate it at home." as supporting copy.
- "Shop this look ↓" as the clear clickable action that scrolls to `#shop-the-look`.
- Styled as a cream/gold card or inline link treatment consistent with the existing palette (gold text, subtle border, surface-card background if card-based).
- It is a same-page anchor link (`<a href="#shop-the-look">`) so it scrolls smoothly to the existing products section.
- Only rendered when inspirations exist (the component already returns `null` otherwise).
- Does **not** duplicate product cards or pull product data into the gallery.

### 3. Scroll offset for the fixed/sticky header
Apply a scroll-margin offset to `#shop-the-look` so the anchor lands below the site header rather than behind it. Based on existing project patterns, use `scroll-mt-28` (112px) on the section, matching the offset already used for looks-grid anchors. Verify visually and adjust to `scroll-mt-32` or a custom value if the header is taller on mobile.

## Files to change

1. `src/routes/inspire.looks.$slug.index.tsx`
   - Add `id="shop-the-look"` and `scroll-mt-28` (or equivalent) to the Shop the Look `<section>`.

2. `src/components/looks/InspirationGallery.tsx`
   - Add the "Love this look? Shop pieces to recreate it at home." CTA after the inspiration grid.
   - Use an anchor link to `#shop-the-look`.
   - Keep the existing layout, copy and responsive grid untouched.

## Out of scope

- No changes to Supabase schema or data.
- No changes to `decor_products`, `look_products`, product categories, or `ProductCard`.
- No changes to Inspiration detail pages, routes, navigation, or other Christmas Looks behaviour.
- No product duplication.

## Verification

- Build/typecheck passes.
- Browser check at 360px/390px and desktop confirms:
  - CTA appears directly below the inspiration grid.
  - Clicking "Shop this look ↓" scrolls to the existing product section, landing below the header.
  - Product cards remain in their existing location; none are duplicated in the gallery.
