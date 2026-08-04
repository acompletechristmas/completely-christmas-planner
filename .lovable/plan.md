# Bring the Christmas photography back to life

Refinement only. No layout, typography, spacing or component changes — the only edits are to how the background photographs are veiled and rendered.

## What changes

1. **Feature card photos (Planning HQ cards, budget card, activities card)**
   - The warm cream veil currently sits at 92–96% opacity, which almost completely hides each photo. Reduce it to roughly 60–68% at the text side and fade to ~25–35% across the rest of the card, so the image reads as a feature.
   - Add a gentle image treatment (about +25–30% saturation, small contrast and brightness lift) so the scenes feel rich and warm rather than washed out.
   - Keep the strongest part of the cream gradient behind the eyebrow/title/description so navy and gold text stays legible.

2. **Planner hero (bright living room)**
   - Reduce the left-hand cream wash so more of the room, tree and fireplace shows through, keeping enough wash behind "Hi Lisa, welcome back" and the countdown pill.
   - Same saturation/contrast lift on the hero image.

3. **Interior page hero band (PageShell)**
   - Lift saturation and contrast on the hero photo and slightly reduce the overlay strength so the photography is visible, keeping the bottom fade into the page background intact.

## Not changing

- No new dark overlays anywhere.
- No changes to cards, buttons, gold accents, fonts, spacing, icons or copy.
- No changes to any data, routes or logic.

## Technical notes

- `src/routes/_authenticated/planner.index.tsx`: soften the `CARD_VEIL` gradient stops and add a `filter: saturate(1.28) contrast(1.1) brightness(1.04)` style to the card `<img>` elements.
- `src/routes/_authenticated/planner.tsx`: reduce the hero cream gradient stop opacities and apply the same image filter to the hero image.
- `src/components/PageShell.tsx`: reduce the overlay gradient opacities and apply the image filter.
- Verify contrast of the card text over the lighter veil on mobile (360/390px) with a screenshot check before finishing.
