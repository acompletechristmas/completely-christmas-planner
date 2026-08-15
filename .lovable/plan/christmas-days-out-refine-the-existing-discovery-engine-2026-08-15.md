# Christmas Days Out — refine the existing discovery engine

No new routes, tables, planners or event models. Everything below modifies files that already exist, plus one small new component.

## What is already there (verified)

- `/days-out` already has postcode/town + radius + date-from/date-to search, all five filter groups, collections, cards, Add to calendar and Save to Festive Activities.
- `searchExperiences` already returns `items`, `origin`, `sources: {id,name,count}[]` and `locationNotFound`.
- `registry.server.ts` already fans out to enabled sources, dedupes and sorts; Ticketmaster stays dormant until `TICKETMASTER_API_KEY` exists.

## Gaps this task closes

1. `sources` is returned by the server but never shown to the user.
2. Cards have Save and Add to calendar but no clear action to open the genuine event/booking page.
3. When there are no live results the page silently swaps in the static inspiration catalogue and describes it in the same way as real listings; the collection rows are also built from whichever set is in play.
4. Ticketmaster results are keyword-filtered on "christmas" at the API only, so some non-festive events can slip in.

## Changes

**Source transparency (new small component `SourcesSearched.tsx`)**
- While searching: "Searching A Complete Christmas + connected event providers".
- After results: "Sources searched: A Complete Christmas • Ticketmaster" — built only from the `sources` array the server returned, so unconfigured providers never appear. Quiet 12–13px muted text under the search bar, no provider logos or branding.

**External event action (`ExperienceActions.tsx`)**
- Add a single gold primary action using `affiliateUrl ?? bookingUrl ?? sourceUrl`.
- Label: "View & book" when a `bookingUrl`/`affiliateUrl` exists, otherwise "View event". Opens in a new tab with `rel="noopener noreferrer"` and an external-link icon. No intermediate page, no implication that we sell the ticket.
- Add to calendar and Save to My Festive Activities stay exactly as they are, ordered after it.

**Real results vs inspiration (`days-out.tsx`)**
- Keep one results grid, but make the state explicit:
  - searching → "Searching festive listings…"
  - location not found → existing message, unchanged
  - live results → "N festive activities near {place}" with the sources line
  - searched but nothing found → "We haven't found matching live listings for those dates yet. Here are some Christmas ideas you might enjoy while we keep building our coverage." then the inspiration set under its own heading "Christmas ideas to inspire you", clearly marked as ideas, not bookable listings.
- Collections rows are always driven by the inspiration catalogue (as today when nothing is live), so live and inspirational content are never blended in one row.
- Inspiration cards keep calendar/save off, as they do now, since they have no real dates or links.

**Christmas focus (`ticketmaster.server.ts`, review only + one small filter)**
- Keep the adapter and its graceful empty-array failure. Add a festive-relevance check on the normalised result (festive keyword in name/genre) so unrelated concerts and sport that happen to match are dropped before they reach the combined set. No key is hard-coded and nothing runs client-side.

**Deduplication** — left as is; it already fingerprints name + date + venue coordinates. No change unless the new filter exposes a problem.

**Mobile** — verify at 360px and 390px: sources line wraps, the three card actions wrap to full-width-friendly pills with 44px targets, no horizontal scroll.

## Files touched

- `src/routes/days-out.tsx` — status copy, result/inspiration separation, render sources line.
- `src/components/days-out/SourcesSearched.tsx` — new, small.
- `src/components/days-out/ExperienceActions.tsx` — add View event / View & book.
- `src/lib/days-out/sources/ticketmaster.server.ts` — festive relevance filter only.

Not touched: homepage, header, logo, Gifts, Decorations, Looks, planner structure, `/planner/outings`, `outings`, `curated_experiences`, geocoding, filters, the registry contract or the ICS helper. No migration, no new data, no invented events or providers.
