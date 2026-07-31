# Complete the Stocking Section

Structural completion of the existing Stocking section on the Person Detail page only. No redesign, no new pages, no navigation changes.

## What the Stocking section will do

Shown only when "Needs stocking" is on for that person (unchanged behaviour).

- Add a stocking item (button already exists)
- Edit an item: name and cost, inline, saving as you type (same as Presents)
- Delete an item
- Two tick controls per item: **Purchased** and **Wrapped**
- A stocking budget strip at the top of the section showing Stocking Budget / Spent / Remaining, using the same component and calculations as the Presents budget

Items stay stocking items (`category = 'stocking'`), stay on this page, and never appear in the Presents list.

## Implementation plan

1. **New lightweight row component** `src/components/planner/StockingRow.tsx`, modelled on the existing Christmas-cards row already in the page (same card shell, same input styling, same 44px touch targets): item name input, `£` cost input, "Purchased" checkbox, "Wrapped" checkbox, Remove button. This is lighter than `GiftCard` (no photos, ratings, history, duplicate warnings), which matches "a lightweight version of Presents".
2. **Reuse `BudgetSummary`** for the stocking budget, with its label text made generic (`count` noun becomes a prop with "present" as the default) so Presents output is byte-identical and Stocking reads "3 stocking items counted this year."
3. **Wire the section** in `src/routes/_authenticated/planner.people.$personId.tsx`: replace the `GiftCard` list in section 8 with `StockingRow`, add the budget strip plus a "Stocking budget (£)" field in the same `ProfileField` style used for the gift budget.
4. **Spend calculation**: sum of `price` over that person's `category = 'stocking'` items for the current year, computed in the route from the existing `stockingItems` array from `usePersonGifts`. Stocking spend stays out of the Presents budget total, as it does today.
5. Purchased maps to the existing `ordered`/bought state already on gifts (`status`/`wrapped` booleans are reused, no new gift columns).

## Database change (one, minimal)

The `people` table has `gift_budget` but no stocking budget field, so a stocking budget cannot be stored today. One migration adding a single nullable column:

```sql
ALTER TABLE public.people ADD COLUMN stocking_budget numeric;
```

No new table, no policy or grant changes (existing per-user policy covers it). If you would rather not touch the database, the alternative is to show only "Spent" with no budget/remaining — say the word and I will drop the migration.

## Files affected

- `src/components/planner/StockingRow.tsx` (new)
- `src/components/planner/BudgetSummary.tsx` (optional noun prop, default unchanged)
- `src/routes/_authenticated/planner.people.$personId.tsx` (section 8 only)
- `src/hooks/use-people.ts` (add `stocking_budget` to the `Person` type)
- one migration file

## Components reused

`SectionShell`, `BudgetSummary`, `ProfileField`, existing button/input class strings, `usePersonGifts` (`addGift`, `updateField`, `removeGift`, `stockingItems`).

## Mobile considerations

- Rows stack vertically at 360/390px; name full width, cost + the two ticks on the second line, remove action right-aligned
- All controls at least 44px tall
- Budget strip uses the existing responsive 3-up grid that collapses to one column
- No horizontal scroll

## Testing checklist

- Section hidden when Needs stocking is off, visible when on
- Add / edit name / edit cost / delete an item, each persisting after reload
- Purchased and Wrapped toggle independently and persist
- Budget: set, unset, spend under, spend over (remaining goes red)
- Stocking spend does not change the Presents budget figures
- Stocking items never appear in Gift Ideas or Presents
- 360px and 390px: no overflow, all taps land
