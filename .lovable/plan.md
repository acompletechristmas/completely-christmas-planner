# First-time clarity improvements — /planner/gifts

Small UX/copy change to the existing Gifts planner only. One file changes: `src/routes/_authenticated/planner.gifts.tsx`. No rebuild, no schema, no new routes, no logic changes.

## Current state (verified)

- Header (lines ~228–286): heading "My Christmas Gifts", copy "Everyone you love, every little idea and every budget…", then a 2×2 grid of four equal gold `PlannerButton`s: Add person · Add present · Find gift ideas → `/gift-finder` · Secret Santa → `/gift-finder/secret-santa`.
- There is no "how it works" explanation and no legend for the bought → wrapped → given visuals.
- EmptyState already tells first-timers to "Add your first person".
- Gift-help today (report item 9): header "Find gift ideas" opens the live `/gift-finder` gateway (Gift Planner + Secret Santa are live; the AI Gift Finder there is honestly labelled Coming Soon with a disabled input). Each recipient card also has a working "Find ideas" AI helper that saves suggestions into that person's Gift Ideas. Both are honest and functional — no changes needed.

## Changes

### 1. Heading + supporting copy (header only)

- h1 → **My Christmas Gift List**
- Supporting copy → "Everyone you're buying for, every gift idea, and everything still to do — all in one place."
- Eyebrow stays "GIFTS & PEOPLE" (nav/category name "Gifts" unchanged). Head metadata unchanged. Sleeps-until-Christmas line unchanged.

### 2. "Add a person" as the obvious first action

Restructure only the header button block:

- **Add a person** becomes a full-width gold primary button at the top of the action area (Plus icon, existing `btn-planner` + a subtle emphasis class). Opens the existing Add Person form — same handler, no duplicate form.
- Below it, the other three actions (Add present · Find gift ideas · Secret Santa) sit in a compact row/grid as secondary buttons.
- Net effect on mobile: title → copy → big "Add a person" within the first screen, minimal scrolling.

### 3. Compact "How it works" strip

Immediately under the header actions, a single slim bordered card (cream/gold hairline, no large cards):

- Caption: **Your Christmas gifts, sorted**
- Three inline steps as one flowing compact block (numbers + short text, wraps to 2–3 lines on mobile):
  1. Add someone — everyone you're buying for.
  2. Add their gifts — save an idea, add something chosen or bought, or get help finding the right present.
  3. Watch your progress — Bought changes colour · Wrapped gets a bow · Given or sent gets the Christmas seal.
- Approximately 100–140px tall on mobile, so the list still starts high on the page.

### 4. De-emphasise once the user has people (tiny, existing state only)

- When `people.length === 0`: full three-step strip as above.
- When people exist: strip collapses to one muted single line — "Bought changes colour · Wrapped gets a bow · Given or sent gets the seal" — keeping the list as the focus. Driven purely by the existing `people.length`; no storage, no onboarding state.

### 5. Everything untouched

Statuses, bow/seal/completion visuals, budgets, spend, filters, search, orphan-gift assignment, Secret Santa, Gift Finder, routes, navigation, database — unchanged.

## Verification

- Typecheck; Playwright screenshots at 360px, 390px and desktop (signed in via minted session): new heading/copy visible, "Add a person" clearly primary and reachable with no/minimal scroll, compact strip not pushing the list down, collapsed line shown when people exist, no horizontal overflow, 44px touch targets.
- Confirm no data/API changes; report what "Find gift ideas" does today (as above).
