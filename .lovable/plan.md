# Premium photography on the large feature cards

Visual refinement only. No changes to routes, navigation, layout, card sizes, spacing, typography, buttons or Coming Soon badges.

## What changes

Every large feature card currently painted with a solid/gradient colour panel gets a full-bleed Christmas photograph behind its existing content, with a dark navy overlay (65%) so the gold icons, headings and text stay exactly as legible as now. Corners, borders, gold hairline and shadow stay identical.

The cards affected are the big section cards in Planning HQ (My Christmas Plans, My Christmas Home, Food & Hosting, Films & TV, Music & Playlists, Cards & Post, Traditions, Final Checklist) plus the Festive Activities and Budget panels on the same page, so the whole hub reads as a set of magazine covers rather than coloured blocks.

## Imagery

Each card gets its own photograph matching its subject. Several premium photos already exist in the project and will be reused so the look matches the homepage:

- Films & TV, Music & Playlists, Traditions, Decorations, Days Out, Gifts, Pets, Teachers, Food & Hosting — existing photographic assets.
- Newly generated, in the same warm, realistic, candlelit style as the homepage: My Christmas Plans (planner, diary, wrapped presents, fairy lights on wood), My Christmas Home (decorated living room with tree and fireplace), Cards & Post (cards, envelopes, ribbon, wax seal, fountain pen), Budget (gift tags, notebook, calculator, wrapped presents), Final Checklist (list and pen beside baubles and candlelight).

## Art direction (mandatory, applies to every image)

The set must read as one professionally art-directed Christmas shoot, closer to Fortnum & Mason or John Lewis Christmas advertising than to stock photography:

- Warm golden fairy-light and candlelight as the only light source; no harsh studio light.
- Palette locked to rich red, deep green, navy, gold and warm wood.
- Shallow depth of field with softly blurred bokeh lights behind the subject.
- Natural, realistic photography, richly styled and full frame — no empty space, no plain backgrounds, no unrealistic HDR.
- No visible faces, no illustration, no clipart.

Every existing asset is checked against this standard first and reused if it passes; anything that reads flat, cold or generic is regenerated so the collection stays consistent.

## Technical notes

- `src/routes/_authenticated/planner.index.tsx`: the `Section` type swaps its `bg` gradient string for an imported image; each card renders an absolutely positioned `<img>` at `inset-0 h-full w-full object-cover` inside the existing rounded container, followed by a navy overlay layer (`linear-gradient` of `oklch(0.16 0.05 245 / 0.68)`), both behind the current content (`relative z-10` on the inner wrapper only — no structural or spacing edits).
- Same treatment applied inline to the Festive Activities and Budget panels, which currently use inline gradient `style` backgrounds.
- New images generated into `src/assets/` as `.jpg` and imported as ES modules; existing `card-*.jpg` assets reused where they already fit the brief.
- `alt=""` and `aria-hidden` on all decorative card images; `loading="lazy"` on cards below the fold.
