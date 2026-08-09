# Recreate the Choose Your Christmas Look gallery (visual only)

Rebuild the presentation of `/inspire/looks` to match the reference: a full-bleed premium Christmas hero with right-aligned heading, a cream editorial body, a style filter row, a four-across magazine card grid with palette swatches and gold buttons, and a closing gold CTA band.

No changes to routes, data, database, look detail pages, Shop the Look, or any other section of the site.

## What the page becomes

**1. Hero band (full-bleed)**
- Existing warm fireplace/tree photography (`hero-room.webp`) spanning the full width, roughly 360px tall on desktop, shorter on mobile.
- Right-aligned text block over a soft dark-to-transparent gradient on the right side only, so the left photography stays visible:
  - gold letter-spaced label "CHRISTMAS DECORATIONS"
  - serif heading "Choose Your Christmas Look" on two lines
  - two-line supporting sentence
  - thin gold rule with a small centred tree glyph
  - italic line "Find your style • Get inspired • Shop the look"
- On mobile the text centres under the photo area, hero shrinks, no horizontal scroll.

**2. Cream editorial body**
- The gallery content sits on a cream/ivory background with dark ink text and gold accents, using the project's existing light-theme tokens (the same cream-and-gold language used in the planner), scoped to this page only — no global theme change.

**3. Style filter row**
- Centred serif line "What style speaks to you?" with a row of pill buttons: All Looks, Classic, Modern, Luxury, Natural, Traditional, Family Friendly.
- Active pill is solid gold with cream text; the rest are outlined.
- Filtering is client-side and purely presentational: each of the 12 existing looks is tagged with one or more style pills via a small static slug→tags map. No data or schema change; unknown slugs simply always show.
- Pills wrap onto multiple lines and meet 44px touch targets on mobile.

**4. Card grid**
- 4 columns desktop, 2 on tablet, 1 on 360/390px mobile.
- Each card: large 4:3 photograph, serif style name, two-line short description, a row of small circular palette swatches drawn from the look's existing palette data, and a full-width gold "Explore this look →" button.
- Cards are cream with a hairline gold border, soft shadow, gentle lift on hover; the whole card remains a link to the existing detail route.
- The "Latest Trends" card keeps a small "NEW" badge and its button reads "Start exploring →", as in the reference.

**5. Closing CTA band**
- Full-width cream band with a gift-stack photograph fading in from the left and faint gold snowflakes on the right.
- Centred serif heading "Not sure which look to choose?", supporting line, and a gold "Start exploring →" button that scrolls back to the grid.

## Technical notes

- Only `src/routes/inspire.looks.index.tsx` and `src/components/looks/LookCard.tsx` change, plus a presentational style-tag map and (if needed) a small `LookFilters` component under `src/components/looks/`.
- `listChristmasLooks`, `getChristmasLook`, `src/lib/decorations/looks.functions.ts`, the detail route and all DB tables are untouched.
- Cream styling comes from the existing light-theme token block applied to a wrapper on this route; no new global CSS variables and no hardcoded hex colours in components.
- The page stops using `PageShell`'s standard hero so it can render the full-bleed hero, but keeps the same `SiteNav`, `Snowfall` and `SiteFooter` composition so branding and navigation are identical.
- Existing look imagery is reused; the CTA band photo reuses an existing gift/present asset. New imagery only if no suitable asset exists.
- Head metadata for the route stays as-is.
