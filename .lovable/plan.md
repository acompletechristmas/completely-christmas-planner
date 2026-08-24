# Small wording fix — make My Christmas Plans clearly the master To-Do List

## Goal
Rename the existing `/planner/todos` feature from "My Christmas Plans" to "My Christmas To-Do List" everywhere it is presented as the user's master task/checklist destination. No new feature, route, table or redesign.

## Files to change

### 1. `src/routes/_authenticated/planner.index.tsx`
Update the existing planner card whose `key` is `"plans"` and `to` is `"/planner/todos"`:

- `eyebrow`: `"YOUR MASTER CHECKLIST"`
- `title`: `"My Christmas To-Do List"`
- `tagline`: `"All the little jobs you want to remember, in one place."`
- `action`: `"View my to-dos"`

Leave the route (`to: "/planner/todos"`), icon, photo, colours, `live: true` flag and all other cards untouched.

The separate `"checklist"` card ("LAST-WEEK SWEEP / Final Checklist") also points to `/planner/todos`, but it represents a distinct "final sweep" concept and is not labelled as "My Christmas Plans", so it is out of scope for this change.

### 2. `src/routes/_authenticated/planner.todos.tsx`
Add a short page header above the existing stats grid:

- Eyebrow: `"YOUR MASTER CHECKLIST"`
- Heading: `"My Christmas To-Do List"`
- Supporting line: `"All the little jobs you want to remember, in one place."`

Keep the existing stats, task list, categories, add/remove/edit/complete behaviour and saved data exactly as they are.

## Out of scope (will not be touched)

- `/planner/my`, Gifts, Food, Home, Festive Activities, Traditions, Watchlist, Music, Cards, Christmas Looks
- Database tables, routes, homepage, header, design system
- Generic uses of the word "plans" (e.g. auth meta description, watchlist catalogue blurb, build journey)
- The `"Final Checklist"` card's wording

## Verification

1. Planner HQ shows a card titled **My Christmas To-Do List** with eyebrow **YOUR MASTER CHECKLIST**, tagline **All the little jobs you want to remember, in one place.** and button **View my to-dos**, opening `/planner/todos`.
2. `/planner/todos` displays **My Christmas To-Do List** with the same supporting line.
3. Existing saved todos remain unchanged.
4. No new page, table or feature is created.
5. Build/typecheck passes.
