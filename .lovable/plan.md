# Christmas Days Out — one consistent feature

Today the feature is split in two with two different names:

- `/days-out` — public discovery page (filters, cards, curated rows), no way to keep anything.
- `/planner/outings` — "Outings & Events" inside the planner, saved to the `outings` table, shown on the dashboard as "Outings & Events" and in the nav as "Events".

Nothing links discovery to planning, and three names are used for one idea. This plan unifies them into a single **Christmas Days Out** feature with the journey **Discover → Save → Plan**, without redesigning anything.

## 1. One name everywhere

Use "Christmas Days Out" (short form "Days Out") in all user-facing copy:

- Main nav item "Events" becomes "Days Out" (same position, same styling, same match rules).
- Planner page heading "Outings & Events" becomes "Christmas Days Out"; "Add an outing" becomes "Add a day out"; empty state and delete copy follow.
- Planning HQ dashboard section "Outings & Events — Things We'd Love to Do" becomes "Christmas Days Out"; "View outings" becomes "View days out".
- Footer and the `/build` step already say "Days out" — left as-is.

No new terminology is introduced. "Events" and "Outings" disappear from the interface.

## 2. Discovery and planning become one feature

- The planner route moves from `/planner/outings` to `/planner/days-out` so the URL matches the name. All internal links updated.
- The public discovery page `/days-out` gains a persistent link through to the saved list ("My Christmas Days Out") using the existing gold CTA pattern already at the bottom of the page.
- The planner page gains a matching link back to discovery ("Find more days out"), using the same secondary pill button used elsewhere in the planner.

Same feature, two views: browse ideas, keep the ones you like.

## 3. Save to My Christmas Days Out

This is the missing middle step, so it is built now rather than left as a slot.

- The reserved footer area already present on `ExperienceCard` gets a "Save" action next to the existing "Distance coming soon" line — no layout change, the slot was designed for it.
- Saving writes a row to the existing `outings` table through the existing `usePlannerList` hook (name, notes from the blurb, `planned: true`). No schema change, no new table, no new data pattern.
- Signed-out users are sent to the existing `/auth` route and returned to discovery, matching how the rest of the planner behaves.
- Already-saved items show as saved rather than duplicating.

## 4. Room for what comes next

- Card footer stays a flexible row, so "Add to calendar" and a distance/near-me chip drop in beside Save later.
- The recommendation slot at the top of the card is unchanged and still empty — AI picks fill it without touching layout.
- Discovery data still comes from the single `experience-data.ts` source, so a live/AI-backed source replaces it behind the same hook.

## Technical notes

- Files touched: `src/components/SiteNav.tsx`, `src/routes/_authenticated/planner.outings.tsx` (renamed to `planner.days-out.tsx`), `src/routes/_authenticated/planner.index.tsx`, `src/routes/days-out.tsx`, `src/components/days-out/ExperienceCard.tsx`, plus a small `use-saved-days-out.ts` wrapper over `usePlannerList("outings")`.
- Database unchanged: table stays `outings`; only the interface language changes.
- No changes to colours, typography, spacing, card/button/icon styles, the homepage, or the Design Bible.
