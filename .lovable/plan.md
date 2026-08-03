# Immersive dark feature row below the CTA

Replace the cream panel under "Let's start Christmas" with a dark, seamless continuation of the hero so the page reads as one magical scene.

## What changes

- Remove the cream curved panel entirely (including the "Your Complete Christmas Planner" laurel heading, the ornament divider, the pill nav row and the paragraph beneath it).
- In its place, a dark section that continues the hero's night-sky background with no visible seam: a soft gradient from the hero's bottom vignette into the deep midnight blue, keeping snowfall running across it.
- Three equally spaced feature links across the full width, separated by thin vertical gold hairlines (fading at top and bottom, as in the reference).

Each feature:
- A small circular Christmas illustration with a thin gold ring and a soft warm glow behind it.
- Heading in the display serif, gold, uppercase with light letter-spacing: PLAN / INSPIRE / SHARE & PLAY.
- A short one-line description in cream, small size:
  - Plan — "Gifts, lists, budgets, meals & more"
  - Inspire — "Decorations, recipes, ideas & traditions"
  - Share & Play — "Films, music, games & family fun"

Destinations stay exactly as they are: /planner, /inspire, /entertainment.

## Sizing and height

- Circles roughly 64px on mobile (390px wide) and 84px on desktop — deliberately smaller than the reference so all three sit comfortably in one row with no wrapping and no horizontal scroll.
- Total section height kept close to the current cream panel's height, so the homepage does not get taller and the CTA stays where it is.
- Text truncates to two short lines on mobile rather than pushing the section taller.

## Untouched

Design Bible tokens, logo, navigation, hero image, snowfall, countdown gift tag, CTA button and the spacing above it, and all existing routes/functionality.

## Technical notes

- Edit `src/routes/index.tsx` only: delete the cream `<section>` and its inner markup, replace with a dark `<section>` using existing CSS tokens (`--midnight-deep`, `--gold`, `--cream`); remove the now-unused `GoldLaurel` helper.
- Snowfall continuity: move the hero's `<Snowfall>` so it covers hero + feature row (fixed-position overlay already used elsewhere), rather than adding a second instance.
- Three new circular illustration assets generated into `src/assets/` (gift with gold bow, lit Christmas tree, cocoa mug with clapperboard and music notes) as transparent PNGs, imported as ES6 image imports and rendered inside the gold rings.
- The feature row is a small local `FeatureLink` component in the same file, reusing TanStack `Link`.
