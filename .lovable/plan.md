# Christmas Magic — consistent foundation (no new features yet)

This revision does not build Save, Add to Calendar, AI recommendations or Near Me. It only makes discovery and planning one coherent feature, so those can be added later without redesign.

## Where things stand

- `/days-out` — public discovery page, currently titled "Christmas Days Out". Filters, cards, curated rows, static data.
- `/planner/outings` — planner list titled "Outings & Events", saved to the `outings` table, surfaced in the nav as "Events" and on Planning HQ as "Outings & Events — Things We'd Love to Do".

One idea, three names, and the two halves do not look or read like the same feature.

## 1. Names (one decision to confirm)

- The public discovery page returns to **Christmas Magic Near Me** — title, eyebrow, meta and nav label.
- The planner side becomes the saved half of that same feature. Proposed label: **My Christmas Magic**, with each saved row called an *activity* or *plan* rather than an outing or event.
- "Outings", "Events" and "Planner Events" disappear from the interface.

If you would rather the planner side keep a different label, say so and only this section changes — everything below is unaffected.

## 2. Scope: all festive activities, not just days out

Copy, empty states, filters and placeholder content are written to cover experiences, events, parties, meals out, trips, family gatherings and any other festive plan. Practically:

- The discovery "what kind of day out" filter becomes a broader activity-type filter, with the existing types kept and room for parties, meals, gatherings and trips.
- The placeholder catalogue gains a few non-day-out examples so the breadth is visible.
- Planner copy stops assuming a ticketed outing ("Add an outing" → wording that fits a dinner or a family visit equally).

No filter mechanics change — same pills, same hook, same multi-select behaviour.

## 3. One consistent recording style

Discovery cards and planner rows currently look like two different products. They are brought onto the same patterns already used across the planner:

- The planner list reuses `SectionShell` and the existing row/input patterns (`IdeaRow`, `StockingRow`, `CardRow` styling) instead of its own bespoke card and input styles.
- Both halves describe an activity with the same vocabulary: name, type, when, who's coming, rough cost, indoor/outdoor.
- Both halves link to each other with the existing gold CTA and secondary pill buttons — browse from the saved list, saved list from browse.

## 4. Layout slots reserved (not implemented)

- `ExperienceCard` keeps its existing empty recommendation slot at the top (AI picks) and its flexible footer row, which already holds "Distance coming soon" and has room beside it for Save and Add to Calendar.
- The planner row keeps space for a date and a calendar action without reflowing.
- Discovery data continues to come from one source (`experience-data.ts`) behind `use-experience-filters`, so a live or AI-backed source replaces it later with no UI change.

None of these are wired up in this pass.

## Technical notes

- No route renames, no table renames, no schema changes: `/days-out`, `/planner/outings` and the `outings` table stay exactly as they are.
- Files touched: `src/routes/days-out.tsx`, `src/lib/days-out/experience-data.ts` (labels and a few extra placeholder items), `src/components/days-out/ExperienceCard.tsx` (styling alignment only), `src/routes/_authenticated/planner.outings.tsx` (copy plus reuse of existing planner components), `src/routes/_authenticated/planner.index.tsx` and `src/components/SiteNav.tsx` (labels).
- No changes to colours, typography, spacing tokens, button or icon styles, the homepage, or the Design Bible.
