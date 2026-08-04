# Recreate your reference image, then use it below the CTA

## Why the earlier attempt didn't look like your image

Image models don't copy an attached picture by default — they generate fresh artwork from a text prompt, so a reference only survives as much as the words describing it. The fix is to run your actual uploaded image through image *editing*, where the picture itself is the input and the model restyles or extends it.

## What I'll produce

Using your reference (`file_0000000047f481f4af542ba1a90fccf5.png`) as the direct input:

1. **Background band** — a wide, cinematic dark-festive strip that extends the reference's atmosphere (deep midnight blue, warm bokeh lights, soft snowfall, gold glow). Sized for a full-width band roughly the current cream panel's height, so page height doesn't change.
2. **Three circular cinematic vignettes** — richly detailed, photorealistic miniature Christmas scenes that tell a story. No icons, single objects or clip-art. Lighting, palette and atmosphere matched to the reference exactly.
   - Plan — a beautiful Christmas planning scene: elegantly wrapped presents, an open planner notebook with handwritten lists, gold ribbon, warm fairy lights, festive details
   - Inspire — an enchanting Christmas interior: a magnificent decorated tree, glowing ornaments, candles, garlands, magical golden bokeh, luxurious festive atmosphere
   - Share & Play — a cosy family Christmas scene: board games, Christmas treats, hot chocolate, laughter, candles and twinkling fairy lights
   Each circular with a subtle thin gold rim and soft glow, on a transparent background.

I'll show all four images for approval before any code changes.

## Then, if you approve the visuals

Replace only the section immediately below the "LET'S START CHRISTMAS" button:
- Remove the cream panel and its curved top edge.
- Use the generated band as the background so the hero flows straight into it.
- Keep the existing heading, laurels and one-line description, retinted for a dark background.
- The three links stay on one row with the same destinations (`/planner`, `/inspire`, `/entertainment`), now using the circular illustrations with thin gold hairline dividers between them.
- Snowfall continues over the band.

Unchanged: hero image, logo, countdown tag, CTA button, spacing above the CTA, navigation, routing, and total page height.

## Technical notes

- Images produced with the image-edit tool from the uploaded reference, saved to `src/assets/` and imported directly.
- Only `src/routes/index.tsx` changes; the cream-panel block is swapped for a dark band using existing tokens and the `Snowfall` component.
- Circles rendered as `<img>` at ~40–44px on mobile, replacing the current Lucide icon circles.
