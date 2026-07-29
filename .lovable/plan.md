## Change

Replace the flat red ribbon on the countdown gift-tag with a proper red satin **bow** — two looped loops with a centre knot and two tails hanging down through the brass eyelet, matching the luxury Christmas-gift-bow look in the approved mockup.

## Where

Only `src/routes/index.tsx`, the `SatinRibbon` component (currently draws two draping tails + a small centre rectangle). Replace it with a bow-shaped SVG:

- Two curved loops (left + right) rendered as filled paths with a `satin-red` gradient and a lighter `satin-sheen` highlight arcing across each loop.
- A small centre knot (rounded rect, slightly darker red) covering the eyelet.
- Two shorter tails with V-cut notched ends draping down past the top of the tag.
- Same colour tokens already defined (`satin-red`, `satin-sheen`) so the palette stays consistent with the Design Bible (Rich Christmas Red used only for ribbons/bows/seals).

Also nudge the wrapper size/position around the bow so the loops sit centred above the tag without covering the countdown numbers:
- Wrapper `top` moves from `-18px` to about `-26px`, `width` ~150–170px, `height` ~60px, keeping `drop-shadow` for depth.

## Not changing

Parchment tag body, eyelet, wax seal, countdown numbers, copy, layout, or any other page.

## Verification

Playwright screenshot at 390×844 and 1280×800 focused on the tag to confirm the bow reads clearly as a bow (two loops + knot + tails), and the CTA remains clickable and unobstructed.