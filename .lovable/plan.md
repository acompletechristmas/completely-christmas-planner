# Planner Christmas Atmosphere — Visual Refinement

Purely presentational. No routes, data, forms, functionality, layout positions or control spacing change.

## 1. Warm festive glow behind planner content

Add a single non-interactive glow layer inside the planner layout (behind content, above the navy background, below snowfall):

- Two very soft gold radial pools (roughly 8-10% opacity) — one upper-left, one lower-right — plus a faint warm wash near the top of the content column.
- Fixed/absolute, `pointer-events-none`, `aria-hidden`, sits at a z-index below all content.
- Deep navy background and existing snowfall untouched. Contrast on cards and text stays exactly as now (glow opacity kept low enough that body text contrast is unchanged).

Because every planner page renders inside the planner layout, this applies to all planner pages at once with no per-page edits.

## 2. Gold line icons on section headings

Extend the shared section heading wrapper so a heading can display one elegant gold line icon to the left of the title:

- Icons are Lucide line icons rendered in gold at heading size, thin stroke, with a faint gold glow. No emoji, no filled shapes, no background circles.
- Icon sits inline with the title; the eyebrow label and title text stay exactly where they are, so no vertical spacing changes.

Icon mapping (closest premium line icon for each theme):

| Section | Icon |
|---|---|
| People & Presents | Gift |
| Stockings | stocking (Lucide `Gift`-adjacent: use `Footprints`-free alternative — `Stocking` not in Lucide, so use a custom inline gold line stocking SVG) |
| Events / Days plan | TreePine |
| Food | Leaf (holly-style) |
| Cards | Mail |
| Budget | CircleDollarSign / bauble-style circle |
| Decorations | Star |
| Lists | Ribbon (custom inline gold line ribbon SVG) |
| Music | Music |
| Films | Clapperboard |
| Days Out | Lamp (lantern) |
| Pets | PawPrint |
| Teachers | GraduationCap |

Where Lucide has no faithful match (stocking, ribbon, bauble, holly), a small inline gold line SVG in the same stroke weight is added to a shared icon module so the set looks consistent.

Headings updated across: Planning HQ overview, People & Presents, person detail sections, Gifts, Cards, Stockings, Lists, Reminders, Timeline, To-dos, Outings, Budget, My Christmas, Setup, Helper.

## Technical notes

- New glow layer added to `src/routes/_authenticated/planner.tsx` only.
- `src/components/planner/SectionShell.tsx` gains an optional `icon` prop; existing usages without it render unchanged.
- New `src/components/planner/section-icons.tsx` holds the custom gold line SVGs (stocking, ribbon, bauble, holly).
- Pages that render bare `<h2 className="font-display ...">` headings instead of `SectionShell` get the same icon treatment inline, with no change to their markup structure or spacing classes.

## Note

Your message was cut off at "Teachers =". If there were points 3, 4, etc., send them and I will fold them into this plan before building.
