## Goal
Bring the homepage hero closer to the approved mockup with three targeted changes. No redesign, no scope creep.

## 1. Recreate the village hero image
Regenerate `src/assets/hero-village.jpg` with a prompt tuned to the approved mockup:
- Wide snowy village street at dusk / early night, deep midnight-blue sky
- Row of warm glowing shopfronts and cottages with lit windows and wreaths
- Tall snow-dusted Christmas tree with warm fairy lights on the right
- Ornate wrought-iron street lantern with a warm halo of light, gentle snowfall
- Cinematic, painterly, luxury Christmas card feel — no people, no text, no logos
- 1536×1024, standard quality for detail fidelity

Replace the existing file in place so all imports keep working. No layout changes to how the hero image is used.

## 2. Faithful luxury gift-tag countdown
Rebuild only the `CountdownGiftTag` component inside `src/routes/index.tsx`. Keep the same props, position, and countdown logic from `src/components/Countdown.tsx`.

Visual spec (matches approved mockup):
- Parchment shape: rounded rectangle with both top corners clipped at 45° to form the classic tag silhouette
- Parchment fill: layered cream gradient + subtle noise/grain via inline SVG `<filter>` (feTurbulence + feColorMatrix) for real texture, not a flat colour
- Antique brass eyelet at the top: dark ring with inner shadow and a small highlight
- Satin ribbon threaded through the eyelet: two draped tails as an inline SVG with a soft gold→deep-gold gradient and a subtle sheen highlight down the centre
- Deep red wax seal in the lower-right of the tag: radial gradient, tiny embossed snowflake or "C" mark, soft cast shadow
- Gold hairline inner border just inside the parchment edge following the clipped shape
- Soft outer drop shadow so the tag lifts off the hero
- Countdown numerals: existing serif display font, warm ink colour, tabular-nums; "DAYS HOURS MINUTES SECONDS" labels in small letterspaced caps beneath

No new dependencies. All shapes done with SVG + CSS so it stays crisp on mobile.

## 3. Reduce hero height
In `src/routes/index.tsx`, lower the hero section height so the "Your Christmas planner" heading and the top edge of the four planner cards are visible in the initial viewport on a 390×844 mobile.
- Mobile: `min-h-[72svh]` (was `85svh`)
- Desktop (`sm:`): `min-h-[82vh]` (was `100vh`/current value)
- Verify with a Playwright screenshot at 390×844 and 1280×800; adjust by ±4svh only if the planner heading is still fully below the fold.

## Out of scope
- No changes to nav, divider, planner cards, fonts, or copy.
- No changes to `Countdown.tsx` internals — only the visual wrapper in `index.tsx`.
- No new routes, data, or dependencies.

## Verification
- Screenshot mobile (390×844) and desktop (1280×800) after each of the three changes
- Compare against the approved mockup for: village atmosphere, tag silhouette + ribbon + seal, planner heading visibility
- Stop as soon as all three read correctly — no extra polish passes
