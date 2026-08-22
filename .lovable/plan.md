# My Christmas Home — one canonical personal Home planner

A new authenticated planner at `/planner/home` for organising Christmas decorating room by room. Public inspiration stays exactly where it is; the planner links into it.

## Audit of what exists today

**Personal Home planning functionality: none.** There is no home/decorations dataset. The Planner HQ "My Christmas Home" card currently points at `/planner/my`, which is the generic to-do board (`todos` table) with a "Decorations" category chip among ten others — it is not a home planner.

Home / Decorations links found:

| Link | Current destination | Type |
| --- | --- | --- |
| Planner HQ card "My Christmas Home" / "View home ideas" | `/planner/my` | Personal → moves to `/planner/home` |
| `/inspire` CTA "Open my planner" | `/planner` | Generic → becomes "Plan my Christmas home" → `/planner/home` |
| `/inspire` CTA "Browse the looks" | `/inspire/looks` | Public — unchanged |
| Header nav "Decorations" | `/inspire` | Public — unchanged |
| Footer "Inspiration" | `/inspire` | Public — unchanged |
| Look cards / inspiration cards | `/inspire/looks/...` | Public — unchanged |
| `/build` "My Christmas Home" idea row | `/inspire` | Public inspiration copy — unchanged |
| `/planner/my` "Decorations" category chip | stays on `/planner/my` | Legacy to-do filter — untouched |

`/planner/my` is not deleted and not redirected.

## Data model — two small tables

`home_areas` (user-owned rows, so custom areas need no schema change):
`id, user_id, name, is_hidden, sort_order, created_at, updated_at`

`home_items` (the single source of truth for everything in the Home planner):
`id, user_id, area_id → home_areas, name, category, status ('idea'|'todo'|'buy'|'ready'|'done'), already_owned bool, quantity int null, estimated_cost numeric null, responsible_person_id → people null, responsible_name text null, look_slug text null, inspiration_slug text null, notes, sort_order, created_at, updated_at`

Both get `GRANT` to `authenticated` + `service_role`, owner-only RLS on `auth.uid() = user_id`, and the existing `update_updated_at_column` trigger. No public write. No third table: need-to-buy, already-owned, ideas, jobs and done are all states/flags on `home_items`.

- **Need to buy** = filter `status = 'buy' OR (already_owned = false AND …)` over the same rows — a view tab, no second list.
- **Area completion** = derived in the client: an area is complete when it has items and every non-idea item has `status = 'done'`.
- **Responsibility** reuses the existing People records via `responsible_person_id` (same pattern as `food_items`), with `responsible_name` only for free text.
- **Inspiration** is referenced by slug only (`look_slug` / `inspiration_slug`); no images, products or inspiration rows are copied.
- **No dates**, so the Christmas-year logic is untouched and nothing is hard-coded.

## Default areas

On first open, if the user has zero `home_areas` rows, the app inserts the eleven defaults (Living room, Dining room, Kitchen, Hallway, Stairs/landing, Front door, Outside/garden, Bedrooms, Fireplace/mantel, Windows, Other) in one call — the same idempotent in-app pattern `use-food.ts` already uses for default occasions. Areas can be renamed, hidden or removed by the user; nothing is seeded in SQL.

## The page

`/planner/home` — cream and gold, same shell as Food/Traditions/Music.

- Header: "My Christmas Home" with two inspiration links — **Choose your Christmas look** → `/inspire/looks` and **Browse Christmas home inspiration** → `/inspire`. No look cards are duplicated.
- Tabs: **My home** (areas overview) · **Need to buy** (filtered view) · **Already have** (owned items).
- Each area card shows its name plus small counts (items, still to do, to buy) and a subtle complete state; tapping opens the area's items inline.
- Quick add inside an area: one field ("Put up main tree") plus Add. Category, status, quantity, cost, who's responsible and notes sit behind a "More details" disclosure per item.
- `+ Add an area` takes a name only.
- Mobile-first at 360/390px, 44px touch targets, no horizontal scroll.

## Files

New: migration for the two tables; `src/lib/home/constants.ts` (default areas, categories, statuses); `src/hooks/use-home.ts`; `src/components/home/AreaCard.tsx`, `HomeItemRow.tsx`, `AddHomeItem.tsx`, `AddArea.tsx`; `src/routes/_authenticated/planner.home.tsx`.

Changed: `src/routes/_authenticated/planner.index.tsx` (Home card → `/planner/home`); `src/routes/inspire.index.tsx` (bottom CTA wording + destination only).

Untouched: `/planner/my`, Gifts, Food, Days Out, Cards, Traditions, Watchlist, Music, People, Christmas Looks and all `christmas_looks` / `look_inspirations` / `decor_products` / `look_products` / `inspiration_products` tables, Shop This Look, RecreateChecklist, homepage, header, design system.

## Confirmations

One personal Home system, one dataset. `/planner/my` neither deleted nor globally redirected. No AI, web search, retailer API, affiliate links or external service — zero per-user running cost.
