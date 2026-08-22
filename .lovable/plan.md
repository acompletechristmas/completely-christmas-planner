# Navigation & Link Audit — A Complete Christmas

Audit only. No files, links, routes, redirects or data were changed.

## A. Executive summary

- Page routes checked: **38** (21 public, 17 authenticated) plus non-user-facing system routes (`/mcp`, `.mcp`, `.well-known`, OAuth consent).
- User-facing internal links/actions checked: **~74**.
- Correct/consistent: **58**
- Needs review: **8**
- Broken / non-functional: **2**
- Inconsistent or duplicate destination: **4**
- Legacy / possibly obsolete: **2** (plus 3 orphan routes with no inbound link)

Headline findings: `/planner/my` is now referenced by exactly one card ("My Christmas Home"), the Gifts area has converged correctly, and two Planner HQ cards that link to fully built planners still display a "Coming soon" badge.

## B. Canonical feature map

| Feature | Public / inspiration | Personal / planner | Saved data | Status |
|---|---|---|---|---|
| Gifts | `/gift-finder`, `/gift-finder/secret-santa` | `/planner/gifts` | `people`, `gifts` | Converged |
| Food | `/food` | `/planner/food` | `food_occasions`, `food_items`, `food_occasion_guests`, `food_shopping_items` | Planner correct; public CTA generic |
| Days Out / Activities | `/days-out` (discovery+inspire) | `/planner/outings` | `outings` | Correct, three purposes clear |
| Decorations / Looks | `/inspire`, `/inspire/looks/*` | none dedicated | `christmas_looks`, `look_inspirations` etc. (editorial content, not user data) | Gap — HQ card points to `/planner/my` |
| Cards | — | `/planner/cards` | `cards` | Correct route, badge wrong |
| Traditions | — | `/planner/traditions` | `traditions` | Correct route, badge wrong |
| Films & TV | `/entertainment` | `/planner/watchlist` | `watchlist_items` | Correct; no CTA from `/entertainment` |
| Music | `/entertainment` | `/planner/music` | `music_items` | Correct |
| Plans / To-dos | — | `/planner/todos` | `todos` | Correct |
| Budget | `/save` (editorial) | `/planner/setup` (budget fields) | `planner_settings` | Public CTA misdirects |
| Reminders | — | `/planner/reminders` | `reminders` | Correct |

## C. Broken links / non-functional actions

1. ❌ **"Preview Gift Finder"** — `src/routes/gift-finder.index.tsx:47`, `to: "#ai-gift-finder"`. It scrolls to an anchor that only contains a "Coming soon" badge and a dead form. Technically valid anchor, functionally a dead end.
2. ❌ **"Conjure ideas"** button — `src/routes/gift-finder.index.tsx` (~line 113). `<button type="button">` with **no onClick handler**. Looks like the primary action of the page and does nothing.

No link points at a nonexistent route: typed `<Link to>` targets all resolve, and every untyped `GoldCTA to=` string (`/auth`, `/planner`, `/planner/gifts`, `/planner/music`, `/planner/reminders`, `/vip`, `/inspire/looks`) matches a real route.

## D. Inconsistent links

1. 🔁 **"Start my budget"** — `/save:43` → `/planner/gifts`. Budget lives in `/planner/setup` (and the HQ budget card). Gifts is not a budget screen.
2. 🔁 **Public → planner CTAs are generic.** `/food:43` "Open my planner" → `/planner`, while `/entertainment:44` offers both `/planner/music` (specific) and `/planner` (generic); `/inspire:59` and `/pets:43` → `/planner`. Same label, three levels of specificity.
3. 🔁 **"Coming soon" badge vs live route.** In `planner.index.tsx` SECTIONS, `cards` (→`/planner/cards`) and `traditions` (→`/planner/traditions`) have no `live: true`, so they render the "Coming soon" pill even though both planners are built and linked.
4. 🔁 **Two distinct gift-list screens.** `/planner/gifts` (canonical) and `/planner/list` both read the `gifts` table with different UIs. `/planner/list` has no inbound link but is matched by SiteNav's Gifts `match` array.

## E. `/planner/my` report

`/planner/my` is a **category-tabbed to-do board** reading the shared `todos` table (`usePlannerList<TodoRow>("todos")`), with tabs: Gifts, Food, Decorations, Cards, Wrapping, Festive Activities, Travel, Elf, School, Family. It is the same dataset `/planner/todos` uses, filtered by `category`.

Incoming links — exactly one:

CURRENT: `My Christmas Home ("View home ideas") → /planner/my` (`planner.index.tsx:120`)

- What it provides for that concept: a "decorations" to-do tab only — no tree/lights/rooms planner, no saved decoration data, no link to `/inspire/looks`.
- Dedicated destination: **none exists.** Decorations currently only has public editorial (`/inspire`, `/inspire/looks`). So this is not a stale link to a replaced planner; it is a **concept with no dedicated planner**, currently absorbed by the generic to-do board. ⚠️ NEEDS DECISION.

No other file links to `/planner/my`.

## F. Dead ends

- `/coming-soon` (Advent & Countdown, linked from SiteNav) — waitlist email form only, no outbound link back into the app.
- `/gift-finder` AI section — badge + dead input + dead button.
- `/planner/helper`, `/planner/timeline`, `/planner/list` — **no inbound links anywhere**; reachable only by typing the URL.
- `/entertainment` — has a music CTA but **no CTA to `/planner/watchlist`**, although the watchlist planner exists.
- `/inspire` and `/inspire/looks/*` — only offer generic "Open my planner"; no route into any decorations/home planner.
- `/teachers/$category` — "Full downloadable resource coming soon" with no alternative action.

## G. Same-label conflicts

- **"Open my planner"** → `/planner` on `/food`, `/pets`, `/inspire`, `/entertainment`, while `/gift-finder` uses "Open my gift list" → `/planner/gifts`. Same intent, different specificity.
- **"Gifts"** appears as SiteNav item → `/planner/gifts`, HQ heading "My Christmas Gifts" → `/planner/gifts`, and `/gift-finder` "Everything gifts, in one place" (discovery). Purposes differ legitimately, but the wording overlaps.
- **"Festive Activities"** → `/planner/outings` in SiteNav and HQ, but is also a tab label inside `/planner/my` (a todo category) — two different surfaces, same words.
- **"Music & Playlists"** used as both the HQ card title and eyebrow → single destination `/planner/music`. Consistent.

## H. Public vs planner relationships

Correctly separate: `/gift-finder` vs `/planner/gifts`; `/days-out` (discovery/inspire) vs `/planner/outings` (saved); `/entertainment` (editorial) vs `/planner/watchlist` + `/planner/music`; `/food` (editorial) vs `/planner/food`; `/inspire/looks` (editorial looks) vs — nothing.

Days Out purposes, as implemented:
1. Discovery/search — `/days-out` search mode (live provider aggregation).
2. Public inspiration — `/days-out` inspire mode + curated collections.
3. Saved/planned — `/planner/outings`, written to by `ExperienceActions` (`outings` insert). Cross-links between them are correct in both directions.

CTA gaps: `/food` → generic `/planner`; `/entertainment` → no watchlist CTA; `/inspire` → generic `/planner`.

## I. Saved-data consistency

- `todos` is shared by `/planner/todos` and `/planner/my` — one dataset, two UIs. Not duplicated data, but duplicated experience.
- `gifts` is shared by `/planner/gifts` and `/planner/list` — same concern.
- No case found where two routes create *separate* datasets for the same concept.

## J. Recommended fixes — prioritised, NOT implemented

### P0 — definitely broken
- CURRENT: `"Conjure ideas" (gift-finder) → (no handler)` / PROPOSED: ⚠️ NEEDS DECISION — wire to real AI gift ideas or make the state explicitly disabled. REASON: primary-looking button silently does nothing.
- CURRENT: `"Preview Gift Finder" → #ai-gift-finder` / PROPOSED: ⚠️ NEEDS DECISION. REASON: scrolls to a non-working section.

### P1 — wrong/inconsistent destination
- CURRENT: `"Start my budget" (/save) → /planner/gifts` / PROPOSED: `→ /planner/setup`. REASON: budget is configured in setup, not the gift list.
- CURRENT: `Cards & Traditions HQ cards show "Coming soon"` / PROPOSED: mark `live: true`. REASON: both planners are built and linked.
- CURRENT: `"My Christmas Home" → /planner/my` / PROPOSED: ⚠️ NEEDS DECISION — no dedicated home/decorations planner exists. REASON: cannot invent a destination.

### P2 — confusing journey
- CURRENT: `"Open my planner" (/food) → /planner` / PROPOSED: `→ /planner/food`.
- CURRENT: `/entertainment` has no watchlist CTA / PROPOSED: add `→ /planner/watchlist`.
- CURRENT: `/inspire` + look pages → `/planner` / PROPOSED: depends on the Home decision above.
- CURRENT: `/coming-soon` has no onward link / PROPOSED: add a return route into `/planner` or `/`.

### P3 — cleanup
- `/planner/list` vs `/planner/gifts`, `/planner/my` vs `/planner/todos`, and orphaned `/planner/helper`, `/planner/timeline` — decide keep/retire; all are currently unreachable via UI except `/planner/my`.
- SiteNav omits Food, Traditions, Watchlist, Music, Cards, Plans; add if desired (mobile and desktop share the same `navItems` array, so no desktop/mobile divergence exists).

## L. Mobile navigation

SiteNav renders one `navItems` array for all breakpoints, so desktop and mobile destinations are identical. The only breakpoint difference is the "Login / My planner" pill, hidden below `sm` — but the same action is repeated inside the open menu, so nothing is unreachable. No nested mobile dead ends found.

## K. Explicit confirmation

- NO files were changed.
- NO links were changed.
- NO routes were changed.
- NO redirects were added.
- NO database changes were made.
- This was an audit only.
