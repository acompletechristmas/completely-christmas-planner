## Goal

Reorganise the Person Detail page (`/planner/people/$personId`) into the approved section order. Structural reorganisation only — existing colours, typography, spacing, cards, navigation and overall styling stay exactly as they are, per the A Complete Christmas Design Bible. No database changes. Any AI buttons shown are visual placeholders only, with no AI functionality wired up at this stage.

## Current state (verified)

- The page currently shows: back link, profile header (name, relationship, age, Remove), a "Gift ideas" free-text box + "Things to avoid" box, a collapsible "Interests & details" block, then "Christmas Memories" (year-by-year gift list).
- `gifts` already has `is_idea` (boolean) and `category` — the Gifts board already uses `is_idea` to split Ideas from Presents and to convert an idea into a present (`is_idea -> false`). No migration needed.
- `people` already has `needs_stocking`, `needs_card`, `gift_budget`, `notes`, `dislikes`, `initial_ideas`.
- There is currently no Presents section, no Budget summary, no Stocking or Cards section on this page.

## New section order

1. **Person Header** — name (inline edit), relationship, budget summary line (spent / budget), quick actions (Add idea, Add present, Remove). Reuses the existing header card markup.
2. **Gift Ideas** — list of `is_idea = true` rows for this person (current year). Each row: item text, optional price, "Make it a present" action (sets `is_idea = false`), delete. The existing free-text `initial_ideas` box is kept beneath as "Brainstorm notes" so no data is lost. An optional "Suggest ideas" button appears here as a disabled/placeholder control only.
3. **Presents** — list of `is_idea = false` rows for the current year, using the existing `GiftCard` component unchanged (status select, More panel, photos, duplicate warning).
4. **Budget** — spent vs `gift_budget`, remaining, count of presents. Same calculation already used on the Gifts board.
5. **Notes** — existing `notes` field via `ProfileArea`.
6. **Interests & Details** — existing collapsible `<details>` block, unchanged (minus fields promoted to their own sections).
7. **Things to Avoid** — existing `dislikes` `ProfileArea`, now its own section.
8. **Stocking** — rendered only when `person.needs_stocking`; lists gifts with `category = 'stocking'` plus an add row, reusing the presents row rendering.
9. **Christmas Cards** — rendered only when `person.needs_card`; simple card status tracked with an existing-shape gift row (`category = 'card'`), so no schema change.
10. **Christmas Memories** — existing year-grouped history, current year handled above, kept as the final section.

## Files affected

- `src/routes/_authenticated/planner.people.$personId.tsx` — main restructuring (section order, new Gift Ideas / Presents / Budget / Stocking / Cards blocks).
- `src/hooks/use-person-gifts.ts` — small additions only: derived `ideas`, `presents`, `stockingItems`, `cardItems` selectors and a `convertToPresent(id)` helper. No query or shape changes.

No other files change. Homepage untouched.

## Reusable components to extract

Extract from the current file into `src/components/planner/`, carrying the existing class strings across verbatim so nothing shifts visually:

- `SectionShell` — the existing `rounded-2xl border … bg-…` wrapper plus eyebrow label.
- `ProfileField` / `ProfileArea` — moved as-is (currently local).
- `GiftCard` — moved as-is, no visual change.
- `IdeaRow` — new, composed only from existing input/button classes.
- `BudgetSummary` — presentational, reuses existing typography classes.

## Mobile considerations

- Single-column stacking at 360/390px; existing `sm:grid-cols-*` breakpoints kept.
- Header quick actions wrap to a second line rather than shrinking.
- Idea/present controls keep ~44px tap targets.
- No horizontal scroll: long item names truncate; detail fields stay inside the existing "More" panel.
- Conditional sections (Stocking, Cards) unmount entirely, keeping the page calm and short for most people.

## Testing checklist

- Section order renders exactly as listed, for a person with and without gifts.
- Adding an idea creates `is_idea = true` and appears only under Gift Ideas.
- "Make it a present" moves the row to Presents and persists after reload.
- Present status changes still save immediately; photos, notes, rating unchanged.
- Budget totals match the Gifts board for the same person; no double currency symbol.
- Stocking section hidden when Needs Stocking is off, shown and functional when on; same for Christmas Cards.
- Christmas Memories still groups previous years and remains last.
- No blank/untitled rows can be saved.
- Any AI-labelled control is inert (no request fired, clearly non-functional).
- 360px and 390px viewports: no horizontal scroll, all controls tappable.
- Side-by-side check against the current page: colours, fonts, spacing, cards and navigation unchanged.
