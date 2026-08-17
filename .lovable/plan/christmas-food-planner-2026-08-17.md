# Christmas Food Planner

## 1. What Food functionality exists today

- `/food` (`src/routes/food.tsx`) — public marketing page, "Coming soon" badge, six feature cards. No data, no planner.
- Planner HQ (`planner.index.tsx`) has a "Food & Hosting" card that currently points at `/planner/my` (the generic to-do board) — a placeholder, not a food planner.
- `/planner/my` groups `todos` rows by category, one of which is `food`. Free-text tasks only; no dishes, guests, shopping or prep.
- `planner_settings` already stores `is_hosting`, `num_adults`, `num_children`, `dietary_notes` (set during onboarding).
- No food/menu/dish/recipe table exists. No curated menu data exists.

Conclusion: there is no Food planner data structure yet, and no duplicate to consolidate — only two entry points to re-point.

## 2. What gets reused (no new versions of anything)

- People: existing `people` table via `usePeople`, for guests and "who's bringing what". No second people system.
- Data hook: `usePlannerList` (optimistic edits, debounced saves, realtime) extended with the new table names.
- Layout/UI: `/planner` layout, `SectionShell`, `SectionIcon`, `PlannerButton`, cream-and-gold tokens already in `styles.css`. No new design system.
- `planner_settings.num_adults` / `num_children` / `dietary_notes` seed the first occasion's defaults.

## 3. One destination

The single Food Planner lives at **`/planner/food`**, named **"My Christmas Food"** (matching "My Christmas Gifts").

Routes:

```text
/planner/food              Food planner home — occasions, quick add, links to list/shopping/prep
/planner/food/$occasionId  One occasion: guests, dietary, meal sections, dishes
/planner/food/shopping     The one Christmas food shopping list
/planner/food/prep         Preparation plan grouped by date
/planner/food/help         "Help me plan Christmas food" guided journey (curated)
```

Consolidation, not duplication:
- Planner HQ "Food & Hosting" card re-points from `/planner/my` to `/planner/food`.
- Public `/food` page CTA points to `/planner/food` (page otherwise unchanged).
- `/planner/my` keeps its food to-do category untouched (unrelated free-text tasks); no data is moved.

## 4. Data model — minimum viable, four tables

```text
food_occasions   (Christmas Eve / Day / Boxing Day + user-created)
  → food_items   (a dish, with meal section, status, prep date, responsibility)
      → food_shopping_items (optional, may also be standalone)
  food_occasion_guests (links existing people, or free-text name)
```

- `food_occasions`: user_id, name, occasion_date, num_adults, num_children, notes, sort_order, is_default. Free-form name means new occasion types need no migration.
- `food_items`: user_id, occasion_id, meal (`breakfast|lunch|dinner|buffet|snacks|desserts|drinks`, plain text so more can be added), name (only required field), servings, dietary_tags text[], responsible_person_id → people, responsible_name text, prep_date, notes, status (`planned|to_buy|bought|to_prepare|prepared|served`), needs_shopping, source (`manual|suggested`), suggestion_key. One row per dish through its whole lifecycle — status is a column, not extra records.
- `food_occasion_guests`: occasion_id, person_id (nullable) or guest_name, dietary_tags text[], dietary_notes. Dietary requirements sit on the guest here and as tags on the dish — nothing medical, just what the host recorded.
- `food_shopping_items`: user_id, item, quantity, unit, category (`fruit_veg|meat_fish|chilled|dairy|bakery|cupboard|frozen|drinks|snacks|other`, nullable), bought, food_item_id (nullable → dish), notes.

Future-readiness comes free: recipe_url, cook_minutes, price, product links are all additive columns later. Nothing is added for them now.

## 5. Derived views — one source of truth

- **Shopping list** = all `food_shopping_items` for the user, grouped by category, ticked in place. Items created from a dish carry `food_item_id`; manual items simply have none. There is exactly one list.
- **Prep plan** = `food_items` where `prep_date is not null`, grouped by date, ordered. No task records are created, nothing is copied.

## 6. The two journeys, one dataset

- **I know what I'm cooking (default):** occasion → meal → type a dish name → Add. Everything else lives behind a "Add details" disclosure on the dish row (servings, who's bringing it, dietary tags, prep date, status, "needs shopping").
- **Help me plan:** three short steps (occasion → who you're feeding, pre-filled from planner settings and people → meal style: Traditional / Easy / Budget / Luxury / Vegetarian / Buffet / Family friendly / Something different). Produces a curated suggested menu from a static file `src/lib/food/curated-menus.ts` (dish names grouped by course; roughly 8–12 suggestions per style, no recipes, no external data). Each suggestion can be accepted, removed, swapped, or the user can add their own. Accepting writes a normal `food_items` row (`source: 'suggested'`). No separate storage, no AI, no API.

## 7. Files

New:
- `src/routes/_authenticated/planner.food.tsx` (layout + head), `.index.tsx`, `.$occasionId.tsx`, `.shopping.tsx`, `.prep.tsx`, `.help.tsx`
- `src/components/food/DishRow.tsx`, `QuickAddDish.tsx`, `MealSection.tsx`, `OccasionCard.tsx`, `GuestPanel.tsx`, `ShoppingRow.tsx`, `SuggestionCard.tsx`
- `src/hooks/use-food.ts` (occasions, items, guests, shopping — built on the existing Supabase client patterns)
- `src/lib/food/types.ts`, `src/lib/food/curated-menus.ts`, `src/lib/food/constants.ts` (meals, statuses, dietary tags, shop categories)

Changed (minimal):
- `src/hooks/use-planner-list.ts` — add the new table names to the `TableName` union
- `src/routes/_authenticated/planner.index.tsx` — Food card `to: "/planner/food"`
- `src/routes/food.tsx` — CTA target only

Unchanged: homepage, header, logo, Gifts, People, Decorations, Looks, Days Out, Festive Activities.

## 8. Migration

One migration creating the four tables, each with GRANTs to `authenticated` and `service_role`, RLS enabled, owner-only policies on `auth.uid() = user_id` (guests/shopping scoped through their parent), plus `updated_at` triggers. Three default occasions are created in-app on first visit (per user), not seeded in SQL.

The three default occasions must use the user's active Christmas planning year when assigning dates. Do not hard-code a single calendar year. Christmas Eve = 24 December, Christmas Day = 25 December, and Boxing Day = 26 December of the active planning year. Reuse the project's existing active/planning-year logic if one already exists; do not create a second year-selection system.

## 9. Mobile-first

Built and checked at 360px and 390px: single column, 44px minimum targets, dish add is one field plus one button, shopping rows are large tick targets, prep plan is a clean date-grouped read. Progressive disclosure everywhere; no long forms.

## 10. Confirmations

- ONE Food Planner at `/planner/food`; ONE source of truth (`food_items` + `food_shopping_items`); shopping and prep are views over it.
- No Gemini, OpenAI, paid AI, recipe APIs, supermarket APIs, prices, affiliate or sponsored links in this phase.

## 11. Smallest safe first implementation

Ship in this order, each step usable on its own:
1. Migration + `use-food` hook + `/planner/food` home with the three default occasions and per-meal quick-add dishes (the "I know what I'm cooking" path).
2. Occasion page: guests from existing people, adult/child counts, dietary requirements, dish details disclosure.
3. Shopping list (from dishes + manual items) and prep plan.
4. "Help me plan Christmas food" curated journey writing into the same dishes.
