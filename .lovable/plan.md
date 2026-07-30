## Goal

Make adding a person feel like jotting a name in a notebook. Everything else moves to that person's own page, captured naturally as planning happens. No visual redesign, no data loss, no database migration.

## Current state (verified)

The Add Person modal in `planner.gifts.tsx` currently asks for **9 things** up front: Name, Relationship, Age or age range, Overall gift budget, Interests, Dislikes or things to avoid, Initial gift ideas (large textarea), Needs a stocking, Needs a Christmas card. The same modal component is reused for Edit Person.

The Person Detail page (`planner.people.$personId.tsx`) already holds an editable profile block (relationship, date of birth, budget, clothing size, shoe size, favourite colours/shops/hobbies/films/books/games/characters, wishlist, notes) plus a year-by-year Christmas Memories gift timeline.

---

## 1. Proposed Add Person journey

One short screen, same modal shell, same gold button, same fonts, colours and spacing.

- **Name** — the only required field
- **Relationship** — **optional**. Free-text box plus quick-select chips: Mum, Dad, Partner, Son, Daughter, Brother, Sister, Grandparent, Friend, Colleague, Teacher. Tapping a chip fills the box; it can be cleared or typed over; leaving it blank saves without any warning or prompt.
- **Budget** — optional, £
- **Needs a stocking** — optional toggle
- **Needs a Christmas card** — optional toggle

On save: the person is created and the user is taken **directly to that person's page**, where a small confirmation line appears at the top — *"Person added. Start collecting gift ideas whenever you're ready."* It fades after a few seconds and never blocks anything.

Removed from this screen: Age or age range, Interests, Dislikes, Initial gift ideas.

## 2. Edit Person

**Identical simplified screen** — same five fields, same chips, same layout, pre-filled with current values. Saves in place, stays on the current page, no confirmation banner, no redirect. Everything that left this screen stays fully editable on the Person Detail page.

## 3. Proposed Person Detail journey

The person's page becomes their Christmas planning page. Sections in this order, each collapsible, each empty-by-default with one friendly prompt rather than a form:

1. **Header** — name, relationship, budget, progress. Existing card visual language.
2. **Gift ideas** — separate individual ideas, added one at a time. Each idea can be promoted to a present. Includes the future ✨ *Help me think of gift ideas* button.
3. **Presents** — existing present rows with the five independent status toggles (Ordered, Received, Wrapped, Sent, Given).
4. **Budget** — budget, spend so far, remaining.
5. **Notes** — free text.
6. **Interests & details** — hobbies, favourite shops/colours/films/books/games/characters, sizes, age, date of birth, wishlist. Collapsed by default.
7. **Things to avoid** — existing dislikes field.
8. **Stocking** — only when Needs a stocking is on: stocking ideas, stocking items, progress, plus future ✨ *Help me think of stocking fillers*.
9. **Christmas cards** — only when Needs a Christmas card is on: card chosen / written / posted, address.
10. **Christmas Memories** — existing year-by-year timeline stays as-is at the bottom.

## 4. Wireframes

Add / Edit Person modal (390px):

```text
+----------------------------------+
|  A PERSON ON YOUR LIST           |
|  Add someone                     |
|----------------------------------|
|  Name *                          |
|  [ Auntie Rose               ]   |
|                                  |
|  Relationship (optional)         |
|  [                           ]   |
|  (Mum)(Dad)(Partner)(Son)        |
|  (Daughter)(Friend)(Teacher)...  |
|                                  |
|  Budget (optional)               |
|  [ £  50                     ]   |
|                                  |
|  [ ] Needs a stocking            |
|  [ ] Needs a Christmas card      |
|----------------------------------|
|            Cancel   [ Save ✨ ]  |
+----------------------------------+
```

Person Detail page (390px):

```text
< All people
+----------------------------------+
|  Person added. Start collecting  |
|  gift ideas whenever you're ready|
+----------------------------------+
|  (R)  Auntie Rose                |
|       Sister · £50 budget        |
|       ●●○○○  2 of 5 sorted       |
+----------------------------------+
|  GIFT IDEAS                  [+] |
|  · Gardening gloves    -> Present|
|  · Theatre tickets     -> Present|
|  [ + Add an idea             ]   |
|  [ ✨ Help me think of ideas  ]   |
+----------------------------------+
|  PRESENTS                    [+] |
|  Cookbook  £18                   |
|  Ord Rec Wrap Sent Given         |
+----------------------------------+
|  BUDGET                          |
|  £50 budget · £18 spent · £32 left|
+----------------------------------+
|  NOTES                        v  |
|  THINGS TO AVOID              v  |
|  INTERESTS & DETAILS          v  |
+----------------------------------+
|  STOCKING (if enabled)        v  |
|  · Ideas  · Items  · Progress    |
|  [ ✨ Stocking filler ideas   ]   |
+----------------------------------+
|  CHRISTMAS CARDS (if enabled) v  |
+----------------------------------+
|  CHRISTMAS MEMORIES (existing)   |
+----------------------------------+
```

## 5. Fields moving from Add/Edit Person to Person Detail

| Field | New home |
|---|---|
| Age or age range (`age_range`) | Interests & details |
| Interests (`hobbies`) | Interests & details |
| Dislikes (`dislikes`) | Things to avoid |
| Initial gift ideas (`initial_ideas`) | Gift ideas section — existing text still shown so nothing is lost; new entries added as individual ideas |

Stays on Add/Edit Person: name, relationship, gift_budget, needs_stocking, needs_card.

## 6. Database implications

- **No migration. No new field. No field removed, no data deleted.** Every field currently on the form still exists on the person record and stays editable on the detail page.
- `initial_ideas` is kept and displayed, so existing text survives.
- **Gift ideas** reuse the existing presents table, which already has `is_idea`, `is_chosen` and `person_id`. An idea is a row with `is_idea = true`; "make this a present" flips the flags.
- **Stocking items** reuse the same presents table, flagged via the **existing `category` column set to `stocking`**. No new column, no migration. If a dedicated `is_stocking` boolean is ever preferred, I'll propose it separately before implementing.

## 7. Scope

Files touched at build time: `src/routes/_authenticated/planner.gifts.tsx` (the shared Add/Edit Person modal) and `src/routes/_authenticated/planner.people.$personId.tsx` (section structure and the confirmation line). No changes to the homepage, People & Presents board visuals, logo, typography, colours, navigation, cards, buttons, icons, layout or spacing — all per the Christmas Bible. No database migration. The two ✨ AI buttons are placed but not wired in this stage.
