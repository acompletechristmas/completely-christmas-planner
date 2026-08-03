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

Each destination is unique.

## Christmas Magic Near Me

It stays a separate discovery feature — not a homepage category, not renamed, not redesigned. It must be reachable from:

- **Main navigation** — currently `/days-out` has no nav entry of its own; it is only folded into the "Festive Activities" item as a match path. Add a distinct "Christmas Magic Near Me" nav entry pointing at `/days-out`, using the existing nav item shape and styling.
- **Planner → Events (Festive Activities)** — `src/routes/_authenticated/planner.outings.tsx` already links to `/days-out` in two places, including a "Browse Christmas Magic Near Me" button. Verify both read clearly and keep them.

Discovery flows into planning: activities found in Christmas Magic Near Me are meant to end up in Planner → Events, and the Planner stays the single place where everything saved is organised. The discovery page's existing "Discover → Choose → Organise" panel and its link back to Festive Activities already express this and stay as-is.


## Layout

The tile grid is currently `grid-cols-2 ... lg:grid-cols-4`. With three cards this would leave an unbalanced row, so the grid becomes `grid-cols-1 sm:grid-cols-3` so the three tiles sit evenly on desktop and stack cleanly on mobile. Card styling, gaps, gold borders, corner accents and icons are untouched.

Icons/tints reuse the existing set: gift icon for Plan, tree icon for Inspire, heart icon for Share & Play — all already defined in the homepage file.

## Technical notes

- Only `src/routes/index.tsx` changes: the `cards` array and the one grid class on the tile row.
- No routing, planner, navigation, or design-token changes.

## Acceptance criteria

- Homepage shows three category cards, each with one unique destination: Plan → `/planner`, Inspire → `/inspire`, Share & Play → `/entertainment`.
- No two homepage categories link to the same page.
- Christmas Magic Near Me is accessible from both the main navigation and Planner → Events.
- Planner → Events contains a clear link to Christmas Magic Near Me.
- The Planner remains the single destination for organising all saved Christmas activities, events and plans.
- Existing styling preserved; desktop and mobile layouts stay visually balanced.
