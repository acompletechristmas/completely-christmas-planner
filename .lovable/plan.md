# Complete the Stocking Section

Structural completion of the existing Stocking section on the Person Detail page only. No redesign, no new pages, no navigation changes.

## What the Stocking section will do

Shown only when "Needs stocking" is on for that person (unchanged behaviour).

- Add a stocking item (button already exists)
- Edit an item: name and cost, inline, saving as you type (same as Presents)
- Delete an item
- Two tick controls per item: **Purchased** and **Wrapped**
- A single "Spent on stocking" line showing the total cost of the person's stocking items — no separate stocking budget

Items stay stocking items (`category = 'stocking'`), stay on this page, and never appear in the Presents list.

## Implementation plan

1. **Row rendering**: reuse the existing lightweight row markup already used by the Christmas-cards list in the same page (same card shell, same input styling, same 44px touch targets) — item name input, `£` cost input, "Purchased" tick, "Wrapped" tick, Remove. Only if that markup ends up repeated in the file will it be lifted into a small shared `StockingRow` component; `GiftCard` itself is too heavy here (photos, ratings, history, duplicate warnings).
2. **Spend line**: sum of `price` over the person's current-year `category = 'stocking'` items, taken from the existing `stockingItems` array from `usePersonGifts`, rendered in the section header area using the existing muted/gold text styles. No `BudgetSummary` changes.
3. **Overall spend**: stocking spend counts toward the person's overall Christmas gift spending, so it is included in the header spend figure and the Budget section's "Spent" total alongside presents.
4. Purchased and Wrapped map to existing gift columns (`ordered`/bought state and `wrapped`) — no new gift fields.

## Database change

None. No migration, no new columns.

## Files affected

- `src/routes/_authenticated/planner.people.$personId.tsx` (Stocking section, plus including stocking spend in the person's total spend)
- `src/components/planner/StockingRow.tsx` — only if the row markup needs extracting to avoid duplication

## Components reused

`SectionShell`, existing card/input/button class strings from the Presents and Christmas-cards rows, `ProfileField` styles, `usePersonGifts` (`addGift`, `updateField`, `removeGift`, `stockingItems`).

## Mobile considerations

- Rows stack vertically at 360/390px; name full width, cost + the two ticks on the second line, remove action right-aligned
- All controls at least 44px tall
- No horizontal scroll

## Testing checklist

- Section hidden when Needs stocking is off, visible when on
- Add / edit name / edit cost / delete an item, each persisting after reload
- Purchased and Wrapped toggle independently and persist
- Stocking total updates immediately as costs change
- Stocking spend is included in the person's overall spend figure
- Stocking items never appear in Gift Ideas or Presents
- 360px and 390px: no overflow, all taps land
