# Tiny Planner HQ tidy-up — Final Checklist only

## Goal
Make the existing `Final Checklist` card in Planner HQ honestly reflect its unfinished status, without creating a new feature or duplicating the todo system.

## Current state
- `src/routes/_authenticated/planner.index.tsx` renders a grid of `SECTIONS` cards.
- Each card is wrapped in a `<Link>` and shows either an `Open` or `Coming soon` badge based on `section.live`.
- The `key: "checklist"` entry has no `live` flag (so it already shows `Coming soon`) but still has `to: "/planner/todos"`, making the card clickable into the existing to-do list.

## Change
In `src/routes/_authenticated/planner.index.tsx` only:

1. Update the `Section` interface so `to` is optional (`to?: string`).
2. Remove the `to` field from the `key: "checklist"` entry, keeping its eyebrow, title, tagline, action text, icon, photo, colours and styling exactly as they are.
3. In the card render loop:
   - If `section.to` is present, render the existing `<Link>` wrapper.
   - If `section.to` is absent, render a `<div>` with the exact same classes and styles so the visual appearance is unchanged.
   - The badge logic (`section.live ? "Open" : "Coming soon"`) stays the same, so `Final Checklist` continues to show `Coming soon`.

## What this avoids
- No new route, table, component or styling.
- No change to `My Christmas To-Do List` (`/planner/todos`).
- No change to any other Planner HQ card.
- No change to navigation, database or design system.

## Verification
1. `My Christmas To-Do List` still shows `Open` and opens `/planner/todos`.
2. `Final Checklist` still shows `Coming soon`.
3. Clicking/tapping `Final Checklist` does not navigate.
4. Only `src/routes/_authenticated/planner.index.tsx` changed.
5. Build/typecheck passes.
