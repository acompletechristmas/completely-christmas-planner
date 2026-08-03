# Homepage information architecture refinement

Tighten the homepage category tiles to three primary sections. No redesign — same card component, same styling, same layout.

## Current state

The homepage renders four tiles: Plan (/planner), Experience (/inspire), Create (/inspire), Share & Play (/entertainment). Two tiles ("Experience" and "Create") point to the same destination, and the labels don't clearly describe the sections.

## Change

Replace the four tiles with three:

| Card | Purpose | Destination |
| --- | --- | --- |
| Plan | Presents, gift ideas, stockings, cards, budgets, meals, events, lists | `/planner` |
| Inspire | Tree themes, decorations, table settings, wrapping, Christmas Eve boxes, crafts, traditions | `/inspire` |
| Share & Play | Films, music, games, quizzes, family activities | `/entertainment` |

Each destination is unique. Christmas Magic Near Me stays where it is — a separate discovery feature reached through navigation, not a homepage tile.

## Layout

The tile grid is currently `grid-cols-2 ... lg:grid-cols-4`. With three cards this would leave an unbalanced row, so the grid becomes `grid-cols-1 sm:grid-cols-3` so the three tiles sit evenly on desktop and stack cleanly on mobile. Card styling, gaps, gold borders, corner accents and icons are untouched.

Icons/tints reuse the existing set: gift icon for Plan, tree icon for Inspire, heart icon for Share & Play — all already defined in the homepage file.

## Technical notes

- Only `src/routes/index.tsx` changes: the `cards` array and the one grid class on the tile row.
- No routing, planner, navigation, or design-token changes.
