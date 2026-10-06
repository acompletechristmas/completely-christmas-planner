# My Christmas Gift List — at-a-glance recipient and gift progress polish

A focused update to the existing `/planner/gifts` page. Preserve all data structures, calculations, routes, forms, filtering, Gift Finder behaviour, and the recently added heading/onboarding area.

## Current implementation confirmed

- Recipient cards already show the person, relationship, budget/spend bar, four progress totals, and the existing card-level progression: white → gold when all presents are bought → red ribbon when all are wrapped → wax seal when all are given/sent.
- Collapsed cards do not currently show any gift names or per-gift states; users must select **View gifts**.
- Gift Ideas and Presents are already separate. The existing `chooseIdea` action updates the same gift from `is_idea: true` to `is_chosen: true`; it does not create another record.
- Recipient-level **Find ideas** already opens the working personalised ideas panel for that person and saves selected suggestions into their Gift Ideas.
- Individual present rows currently use the same dark treatment regardless of progress, although their five existing progress controls update `ordered`, `arrived`, `wrapped`, `sent`, and `given`.

## Smallest implementation

### 1. Add a compact collapsed gift preview

Inside each existing recipient card, above **View all gifts**:

- Keep the current name, relationship, budget/spend bar, and progress totals unchanged.
- Show up to two real chosen presents with their highest meaningful existing state: **Chosen**, **Bought**, **Wrapped**, **Sent**, or **Given**.
- Use concise rows with a gift name and text state; include the existing line-art bow for wrapped items and a compact seal treatment for sent/given items.
- If more chosen presents exist, show `+ N more`; if there are only ideas, show a quiet ideas count instead of pretending they are presents.
- Keep this preview read-only and compact. **View all gifts** continues to expand the existing full editor.

### 2. Strengthen existing present-row progression

Style `PresentEditor` from the existing boolean fields without changing their values or calculation rules:

- Chosen/not bought: normal forest present treatment.
- Bought: warmer gold-accented treatment and explicit **Bought** state.
- Wrapped: retain the bought progression and add the existing `RibbonMark` bow treatment clearly.
- Given/sent: completed treatment with a compact wax-seal-style marker based on the recipient-card completion seal.
- Keep all five existing progress controls and editing fields unchanged, with text/icon cues so state is not communicated by colour alone.

### 3. Clarify Idea → Present

- Keep the existing `chooseIdea` function and in-place record conversion.
- Change the idea action to a clearer, mobile-safe treatment: **Love this idea? Make it a present**.
- Ensure the action remains at least 44px high and that the existing success message confirms it moved into that person’s Presents.

### 4. Personalise recipient-level help wording

- Change the expanded-card action from **Find ideas** to **Find ideas for {name}**, using the real recipient name.
- Keep the existing personalised ideas panel and `/gift-finder` gateway untouched.

## Scope and files

- Change only `src/routes/_authenticated/planner.gifts.tsx`.
- No schema migration, API, new AI feature, component architecture, routes, navigation, or global design-system changes.
- No changes to gift/recipient creation, budgets, spend, filters, orphan assignment, Secret Santa, statuses, or completion calculations.

## Verification

- Typecheck and exercise the signed-in Gifts flow using existing data.
- At 360px, 390px, and desktop, confirm recipient cards remain compact, readable, touch-friendly, and free of horizontal overflow.
- Confirm collapsed cards expose real gift names and states without expanding.
- Confirm bought, wrapped, and given/sent rows each have distinct text-and-visual treatments; existing recipient bow/seal progression remains intact.
- Confirm ideas stay separate from Presents and excluded from the existing spend/progress calculations.
- Convert one test idea through the existing action, confirm the same record moves to Presents with no duplicate, then restore the test state.
- Confirm **Find ideas for {name}** opens the same personalised recipient panel.
- Confirm no unrelated files, data model, API, or calculations changed.
