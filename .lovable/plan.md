Replace only the bow on the countdown gift tag with the approved realistic satin bow PNG. Everything else on the homepage stays exactly as it is in the current version (tag on the left, not over any writing; gold "Let's Start Christmas" button at the bottom).

## Steps
1. Upload `/mnt/documents/bow-satin-preview.png` via `lovable-assets create` and save the pointer to `src/assets/bow-satin.png.asset.json`.
2. In `src/routes/index.tsx`, inside `CountdownGiftTag`, remove the inline SVG bow markup (the "Red satin bow tied through the eyelet" block near line 280 plus the bow loops/knot paths around 606–609) and replace it with a single `<img>` using the imported asset. Position and size the `<img>` to occupy the exact same box and rotation as the current SVG bow so the tag composition does not shift.
   - Attributes: `alt=""`, `draggable={false}`, `className="pointer-events-none select-none"`, plus `width`/`height`.
3. Do not touch: the tag's position, the parchment, eyelet, wax seal, countdown numbers, hero image, tagline, gold CTA button, or anything below the hero.

## Out of scope
No layout, position, size, z-index, copy, or color changes anywhere else.