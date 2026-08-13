# Six-plus inspirations for the remaining 11 Christmas Looks

Content population only. No schema, route, component or Shop This Look change.

## Confirmed current state

- `christmas_looks` holds the 12 looks; only `traditional-red-gold` has inspirations (6 rows). The other 11 have 0.
- Inspiration images live in `src/assets/looks/inspirations/` (6 files) and are mapped in `src/lib/decorations/inspirations.ts` by `<look-slug>/<inspiration-slug>`.
- Routes, `InspirationGallery`, `InspirationCard`, `RecreateChecklist` and the Shop This Look empty state already work; the gallery renders only when a look has inspirations.

## What gets added

For each of the 11 remaining looks: 6 inspirations (66 total), each with unique slug, title, useful description, useful styling tip, category, sort order, `is_active = true`.

Categories are chosen per style from the existing vocabulary (room, tree, mantel, table, staircase, door, window, shelf, garland, detail) — not the same six each time. Examples of the tailoring:

- Elegant Gold & Champagne: room, tree, table, mantel, shelf, detail
- Winter Wonderland: room, tree, window, staircase, mantel, detail
- Nordic Christmas: room, tree, shelf, window, table, detail
- Natural Woodland: room, tree, door (wreath), garland, mantel, detail
- Classic Green & Tartan: room, tree, staircase, table, mantel, door
- Candy Cane Christmas: tree, table, mantel, door, detail, room
- Vintage Christmas: room, tree, mantel, shelf, table, detail
- Luxury Christmas: room, tree, staircase, table, mantel, detail
- Colourful Family Christmas: room, tree, mantel, table, shelf, detail
- A White Christmas: room, tree, table, mantel, garland, detail
- Latest Trends: room, tree, table, shelf, window, detail

## Images

66 new photographic images, generated one per inspiration in the style described for that look, then converted/resized to WebP (long edge ~1600px, quality tuned so each file stays well under ~250KB) and stored as:

```text
src/assets/looks/inspirations/<look-slug>/<inspiration-slug>.webp
```

No image is shared between looks; the six existing Traditional Red & Gold files and their mappings are untouched. Prompts avoid people, text, clipart and illustration, and deliberately include shoppable elements (baubles, ribbon, lights, toppers, garlands, wreaths, stockings, tableware, candles, cushions, throws).

## Data

One migration inserting the 66 rows into `look_inspirations`, resolving `look_id` by look slug, with `image_url` left null so the local WebP mapping supplies the image. No other table is written — `decor_products` and `inspiration_products` stay empty, so every inspiration page keeps the existing "We're finding the perfect pieces…" empty state.

## Files changed

- `src/lib/decorations/inspirations.ts` — add the 66 new entries to the local image map (existing entries unchanged)
- `src/assets/looks/inspirations/<look-slug>/*.webp` — new assets
- one new migration file

Nothing else is touched.

## Delivery

Because 66 images are generated and optimised, the work runs look by look (11 batches). Each batch: generate 6 images, convert to WebP, add map entries. The single migration is applied once all assets exist, then the gallery and one detail page per look are checked at 360/390px.
