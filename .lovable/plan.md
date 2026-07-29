One change only in `src/routes/index.tsx`: swap the bow into the exact same slot the original SVG bow used, so the realistic PNG sits on the tag at the eyelet (as shown in your screenshot).

**Edit (lines ~282–295):** the bow `<img>` currently floats above the tag at `top: -95px, width: 150px`. Change to the original SVG bow's footprint:
- `top: -26px`
- `width: 160px, height: 64px`
- `object-fit: contain`

That's it. Tag position, tilt, size, gold CTA, tree, cream section, planner cards — all untouched.