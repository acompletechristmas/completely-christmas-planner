# Make "Help Me Plan Christmas Food" genuinely personalised

Extension of the existing Food Planner only. No second planner, no second menu system, no AI, no external APIs, no migration.

## 1. What Help Me Plan does today

`src/components/food/HelpMePlan.tsx` is a three-step panel:
1. Pick an occasion (from existing `food_occasions`).
2. Pick one of the 8 curated menu styles.
3. Every suggestion for that style is pre-ticked; the user unticks what they don't want and presses "Add N dishes to my plan".

`suggestionsFor(style)` in `src/lib/food/curated-menus.ts` returns a fixed hard-coded array per style — identical for a couple and for twenty guests. Guest counts, guest dietary tags and household type are read nowhere. Accepting calls `acceptSuggestions` in `planner.food.tsx`, which writes ordinary `food_items` rows with `source: "suggested"` and `suggestion_key`. There is no Swap, no "add my own" inside the journey, no explanation, no portion guidance.

## 2. Personalisation data that already exists (nothing new needed)

- `food_occasions`: `name`, `default_key` (christmas_eve / christmas_day / boxing_day), `occasion_date`, `num_adults`, `num_children`.
- `food_occasion_guests`: `person_id` or `guest_name`, `dietary_tags[]` (vegetarian, vegan, gluten_free, dairy_free, nut_allergy, other_allergy, other), `dietary_notes`.
- `people`: `age_range`, `date_of_birth`, `name` — already loaded on the food page via `usePeople`.
- `planner_settings`: `household_types[]` (young_children, teenagers, mixed_ages, couple, adults_no_children, young_adults, alone, extended), `celebration_style[]`, `dietary_notes`, `stress_free`, `budget_total`.
- Existing vocabulary: `MEALS`, `DIETARY_TAGS`, `STATUSES` in `src/lib/food/constants.ts`.

So the journey can drop straight to: confirm occasion → confirm the pre-filled context (adults, children, group type, dietary tags) → pick a style → review the personalised menu. Nothing is asked twice.

## 3. Database

**No migration required.** Everything needed is already stored, and accepted suggestions keep writing to `food_items` exactly as now. Portion guidance (item 8 of the brief) uses the existing `food_items.servings` column plus the existing `notes` column — also no migration.

## 4. Extending `curated-menus.ts` without a recipe database

Keep the same file, the same 8 `MENU_STYLES`, the same dish names. Change the shape from "one array per style" to **one flat pool of suggestions carrying metadata**, each entry gaining optional fields:

```ts
interface Suggestion {
  key: string; name: string; meal: MealKey; course: string;
  styles: string[];              // which curated styles it belongs to
  occasions?: string[];          // christmas_eve | christmas_day | boxing_day (omit = any)
  dietary_tags?: string[];       // vegetarian | vegan | gluten_free | dairy_free
  contains?: string[];           // meat | fish | gluten | dairy | nuts — for filtering only
  childFriendly?: boolean;
  adultOnly?: boolean;           // e.g. oysters, negronis
  budget?: 1 | 2 | 3;            // value → premium
  effort?: 1 | 2 | 3;            // easy → involved
  makeAhead?: "make_ahead" | "day_before" | "on_the_day";
  scales?: boolean;              // works well for a crowd
  note?: string;
}
```

Existing dishes get tagged; a modest number of extra curated dishes are added so every style still has a workable menu after dietary filtering (vegan main, gluten-free dessert, dairy-free side, nut-free alternatives, scalable crowd dishes, small-portion couple options). Still dish names and metadata only — no ingredients, quantities, recipes, prices or links.

`suggestionsFor(style)` is kept as a thin wrapper over the pool so nothing else breaks.

## 5. One recommendation service

New file `src/lib/food/recommend.ts` — pure, deterministic, no React, no network:

```ts
buildMenu(context): PersonalisedMenu
alternativesFor(suggestion, context): Suggestion[]
```

`context` = { occasionKey, adults, children, groupType, dietaryTags, styleKey }, derived once by `deriveContext(occasion, guests, people, settings)` in the same file.

Pipeline:
1. **Filter** — drop anything incompatible: `adultOnly` when children are present in a family-friendly context; dishes whose `contains` clashes with an unavoidable dietary requirement in the "must have an option" sense (never hides everything, see 5.4); wrong occasion.
2. **Score** — additive rules: style match (+), effort matches low-stress/`stress_free` (+), budget matches budget/luxury style (+), `scales` when total guests ≥ 8 (+), `childFriendly` when children > 0 (+), premium when group is a couple + luxury (+), penalise a large dish count for a couple.
3. **Assemble a balanced menu** — take the top N per course with per-course caps that depend on group size (couple: 1 starter, 1 main, 2–3 sides, 1 dessert; large group: more sides, more shareables; buffet style skips starter/main and uses Cold/Hot/Cheese). Ensure the suggested menu includes at least one curated option intended to accommodate each recorded dietary requirement where such an option exists in the curated pool. Do not describe any dish as guaranteed allergen-safe. Always show a reminder to check ingredients, labels and preparation methods for individual dietary needs and allergies.
4. **Alternatives** — the remaining scored, still-compatible dishes in the same course, ordered by score, used by Swap.
5. **Difficult combinations** — when guarantees can't be met (e.g. vegan + traditional), return the best available and a plain caveat line: "We couldn't find a fully vegan traditional main — you may want to add your own." Never claim allergen safety; dietary notes read "Suitable option to consider for a gluten-free guest — check individual ingredients and labels."

Group type is derived from counts plus `household_types`: couple, family_young, family_teens, family_adult_children, multigenerational, large_group, solo — each mapping to the scoring weights and course caps described in the brief.

## 6. Personalised introduction and portions

`buildMenu` also returns `intro: string`, composed from curated sentence fragments (occasion name + counts + style tone + dietary mention). Example output: "A relaxed Christmas Day menu for 8 adults and 3 children, with plenty you can prepare in advance — and vegetarian options for your guests."

Portion guidance is light: each suggestion card shows "serves about N" derived from guest count rounded sensibly, and accepted items are written with `servings` set to that number. No weight calculations, no catering claims.

## 7. Journey and UI (same design system)

`HelpMePlan.tsx` is edited in place — same cream card, gold hairlines, serif headings, `btn-planner`, 44px+ targets, single column at 360/390px:

- Step 0 — occasion (unchanged).
- Step 1 — **"Does this look right?"**: pre-filled adults/children steppers, group type chip, dietary tags already recorded for that occasion's guests (read-only summary with an edit hint pointing to the existing Guests tab). Editing counts here writes through the existing `updateOccasion`.
- Step 2 — menu style (unchanged tiles).
- Step 3 — personalised menu: intro paragraph, grouped by course, each card with **Accept (tick) / Swap / Remove** and "serves about N"; a **"Add my own"** field per course writing a normal dish; caveat lines where relevant.

Swap replaces the card in place from `alternativesFor` — no network, no AI.

## 8. Accepted items

Unchanged path: `acceptSuggestions` in `planner.food.tsx` keeps calling `food.addItem` with `occasion_id`, `meal`, `dietary_tags`, `source: "suggested"`, `suggestion_key`; it additionally passes `servings` and, for make-ahead dishes in a low-stress menu, a short `notes` value such as "Make ahead" / "Prepare the day before" / "Best cooked on the day" (existing `notes` field, no recipe text). Items then behave exactly like manually added dishes in the menu, shopping and prep views. No ingredients are invented; the shopping list stays manual.

## 9. Files

Changed:
- `src/lib/food/curated-menus.ts` — metadata-carrying pool, extra curated dishes, `suggestionsFor` kept.
- `src/components/food/HelpMePlan.tsx` — context step, intro, Accept/Swap/Remove/Add my own.
- `src/routes/_authenticated/planner.food.tsx` — pass guests/people/settings into `HelpMePlan`; accept `servings` and make-ahead note.

New:
- `src/lib/food/recommend.ts` — the single recommendation service.
- `src/lib/food/recommend.test.ts` — deterministic tests (couple vs large group, vegan guarantee, low-stress effort bias, swap alternatives).

Untouched: database, hooks (`use-food.ts`), `DishRow`, shopping, prep, guests, and everything outside Food.

## 10. Confirmations

- One Food Planner, one menu dataset, one recommendation service; no second suggestion store.
- No Gemini/OpenAI/paid AI, no external, recipe, supermarket or affiliate APIs.
- No migration.
- Homepage, header, logo, Gifts, Decorations, Looks, Days Out, Activities, People and planner structure outside Food are unchanged.

## 11. Smallest safe first implementation

1. Metadata on the existing dishes + `recommend.ts` with filter/score/assemble and tests.
2. Wire `HelpMePlan` to `buildMenu` with the pre-filled context step and personalised intro.
3. Swap, Add my own, portions and make-ahead notes.
