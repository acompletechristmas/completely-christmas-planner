# One reusable interior page template

Visual refinement only. No routes, data, forms, components or flows change — every page keeps exactly the content and behaviour it has today.

## What changes

`PageShell` (already used by every main public page) becomes the single interior template. Each page then simply passes a hero image; nothing else about the page is touched.

The template, top to bottom:

1. Deep navy background with subtle snowfall (unchanged) and the existing sticky nav.
2. A cinematic hero banner: premium photographic Christmas image, warm festive lighting, gently darkened and faded into the navy at the bottom so there is no hard edge. Height stays responsive and deliberately restrained — roughly a third of the screen on mobile and a little taller on desktop, capped so the title, intro and the first row of real page content are reachable without excessive scrolling. Immersive, never a full-screen blocker.
3. Back link, eyebrow, and page title in the existing gold serif typography, sitting over the lower part of the hero.
4. A short welcoming one-line introduction (each page already has one — kept, lightly adjusted only where a page has none).
5. Existing page content underneath, unchanged, on the same navy background with the existing cream/mist cards, gold hairline borders, rounded corners and soft shadows.

Spacing, corner radii, shadows and font sizes are set once in the template so every section matches.

## Hero imagery

Reuse existing premium photography where it already exists (`card-food-new`, `card-gifts`, `card-decorations`, `card-daysout`, `card-films`, `card-music`, `card-pets`, `card-teachers`, `card-traditions`, `card-save`, `card-party`, `card-magic`, `card-inspire`). Generate new wide, photographic hero versions only where the existing asset is too small or off-topic for a full-width banner — same style as the homepage: realistic, elegant, warm candle/fairy-light lighting, no cartoons or illustrations.

Sections covered: Gifts / Gift Finder, Food, Decorations & Inspire, Christmas Days Out, Films, Music, Games (Share & Play / Entertainment), Cards, Budget (Save), Pets, Teachers, Traditions, plus Assistant, VIP, Partners and Coming Soon so nothing is left out.

## Planner pages

Planner screens keep their layout, components and flows exactly as they are. They get the same treatment only at the top: a matching hero band and title strip in the shared style, so Planning HQ and its sub-pages read as part of the same site. No planner component is moved or redesigned.

## Technical notes

- `src/components/PageShell.tsx`: hero rendered above the title block with a gradient fade, `heroImage` becomes the standard prop; existing `FeatureCard`, `GoldCTA`, `ComingSoonBadge` untouched.
- Each route file gains one `heroImage` prop and an `import` — no other edits.
- New images saved under `src/assets/hero-*.jpg` and imported directly.
- Colours stay on existing tokens (`--midnight`, `--gold`, `--cream`, `--mist`); no new hardcoded colours.
