# Complete the Christmas Cards section

Finish the existing Christmas Cards section on the Person page. No redesign of the page, navigation, or any other section.

## Behaviour

- The section stays exactly where it is and only appears when "Needs Christmas Card" is on for that person.
- "Add Card" button creates a new blank card entry, pre-filled with the person's name as the recipient.
- Each card entry shows:
  - Recipient name — defaults to the person's name, editable
  - Address — optional, multiline
  - Sent tick
  - Received tick
  - Delete
- Every edit saves automatically as you type or tick, exactly like Presents and Stocking.
- Empty state message stays as-is when there are no cards.
- No budgets, postage costs, reminders, scheduling, templates, printing, or AI.

## Layout

Same card styling as the Stocking rows: stacked on mobile (full-width name field, address textarea below, ticks in a row, delete at the end), and a tidier side-by-side arrangement on wider screens. Touch targets stay at least 44px.

## Technical notes

- New component `src/components/planner/CardRow.tsx`, mirroring `StockingRow`.
- Reuses the existing `gifts` rows with `category = 'card'` — no migration.
  - recipient name → `recipient`
  - address → `notes`
  - Sent → `sent`
  - Received → `delivered`
- Add `sent` to the `Gift` interface in `src/hooks/use-person-gifts.ts` (the column already exists).
- Replace the inline card markup in `src/routes/_authenticated/planner.people.$personId.tsx` with `<CardRow />`; the "Track a card" button becomes "Add Card" and passes the person's name as the default recipient.
- Cards remain excluded from the budget/spend totals.
