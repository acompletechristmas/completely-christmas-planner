# Christmas Magic Near Me — real activity discovery engine

Plan only. Nothing below is built yet. Nothing on the homepage, header, logo or Gifts is touched.

## 1. What exists today (verified in the codebase)

**Discovery — "Christmas Magic Near Me"**
- Route: `src/routes/days-out.tsx` (public, `/days-out`). Hero, five filter groups (activity type, budget, who's coming, when, indoor/outdoor), a results grid, five curated collection rows and a CTA to reminders.
- Data: `src/lib/days-out/experience-data.ts` — 18 hand-written placeholder experiences plus the label maps for every filter. No location, no dates, no images, no booking link.
- Filtering: `src/hooks/use-experience-filters.ts` — pure client-side filtering over an injectable `source` array (already written as the seam for live data).
- Components: `ExperienceCard`, `CollectionRow`, `FilterPills`, `ExperienceEmptyState`. `ExperienceCard` already reserves an empty footer slot for distance / Save / Add to Calendar.

**Saved activities — "Festive Activities"**
- Route: `src/routes/_authenticated/planner.outings.tsx` (`/planner/outings`).
- Table: `outings` — `name, event_date, event_time, location, attendees, cost, booking_url, planned, booked, paid, completed, notes, sort_order`, RLS scoped to `auth.uid()`.
- Hook: `usePlannerList<OutingRow>("outings", …)` with optimistic edits and realtime.

**The connection that exists / is missing**
- Exists: navigational links only. Days Out → "Open my Festive Activities"; Festive Activities → "Find ideas near me" / "Browse Christmas Magic Near Me".
- Missing: any way to save a discovered experience. No Save button, no calendar action, no location, no dates, no real data.

**Placeholder data to be replaced eventually:** the whole `EXPERIENCES` array. The type/price/audience/setting/time label maps are kept — they become the shared taxonomy that every source is normalised into.

## 2. Preserve, don't redesign

Kept exactly as they are: the page layout, hero, filter pill design, collection rows, card styling, the Discover → Choose → Organise panel, and one Festive Activities planner backed by `outings`.

Added, without redesign: location + date inputs above the existing filters, and the already-reserved card footer filled in with distance, "Save to my Festive Activities" and "Add to calendar". No second planner, no second route, no duplicated data.

## 3. External sources, and how each is legitimately obtained

**Phase 1 — suitable to start with**
| Source | Method |
| --- | --- |
| Curated in-house UK Christmas listings (markets, light trails, big grottos, panto) | Manually curated rows in our own database, entered/maintained by us. Always legal, works day one, guarantees coverage even where no API exists. |
| Ticketmaster Discovery API | Official free API key, UK events, `classificationName` + `keyword` + `geoPoint`/`radius`. Good for panto, theatre, arena Christmas shows. |
| Skiddle API | Official UK events API, free key on application. Strong on local/community/family events and markets. |
| Eventbrite | Public organiser/venue feeds only — their search API is now restricted, so treat as best-effort, not a backbone. |
| Venue/attraction structured data (schema.org `Event` JSON-LD) | Only from sites whose robots.txt and terms permit automated reading, fetched server-side on a slow schedule, cached. Used for National Trust-style attractions, garden centres, councils, cathedrals. |

**Phase 2 — later, once the engine is live**
- Affiliate feeds: Awin / Impact merchants (Virgin Experience Days, Red Letter Days, hotel and afternoon-tea partners), Booking.com or similar for "trips and stays". These are also the monetisation route.
- Tourism boards and local council open-data event feeds (many publish ICS/JSON/CSV).
- Partner submissions — a form letting attractions submit their own Christmas event.

**Unsuitable / restricted**
- Scraping National Trust, English Heritage, Eventbrite search, Facebook Events, TripAdvisor, Google Places listings/reviews, or any site whose terms forbid automated access. Ratings and reviews are only shown where a source licenses them; otherwise the rating field stays empty rather than invented.

## 4. Architecture (scalable, multi-source)

```text
 user query (location, radius, dates, type, budget, audience)
                     |
        server function: searchExperiences
                     |
        +------------+------------+------------+
        |            |            |            |
   curated DB   Ticketmaster   Skiddle    (future adapters)
     adapter      adapter       adapter
        +------------+------------+------------+
                     |
        normalise -> Experience (one internal shape)
                     |
        dedupe -> rank -> cache -> return
                     |
        existing ExperienceCard / filters / collections
```

- Each source is an **adapter** implementing one interface (`search(query) => NormalisedExperience[]`) and registered in a list. Adding a provider later = one new file + one line, no rebuild.
- Adapters run in parallel; any that fails or times out is skipped, so one broken provider never breaks the page.
- Everything is normalised into an extended `Experience` (existing fields plus `sourceId`, `sourceName`, `sourceUrl`, `imageUrl`, `startDate`, `endDate`, `time`, `venue`, `postcode`, `lat`, `lng`, `distanceMiles`, `priceFrom`, `bookingUrl`, `isSponsored`, `isFeatured`, `affiliateUrl`) — the sponsored/featured/affiliate fields exist from day one but are unused, so monetisation later needs no rebuild.

**Deduplication:** a fingerprint of normalised name (lowercased, stopwords/"christmas"/punctuation stripped) + date + rounded venue coordinates. Matches are merged into one card, preferring the richer record for description and image, keeping every source's booking link, and attributing the primary provider. A fuzzy name-similarity check catches "Santa's Grotto at X" vs "X Santa Grotto".

**Freshness:** search results cached per query for a short window; curated and API events store an `ends_at`, and anything past it is filtered out and refreshed on a scheduled job. Prices are shown as "from" with the source and a "checked on" date so stale pricing is never presented as authoritative.

**Attribution:** each card shows "via {source}" linking to the original listing; the booking link always goes to the provider.

## 5. Location search

- User enters a postcode, town or city, or taps "Use my location".
- Postcode/town is geocoded to lat/lng via **postcodes.io** (free, open, UK-only, no key) with results cached.
- Radius selector: 5 / 10 / 25 / 50 miles. Coordinates + radius are passed to each adapter (APIs support geo-radius natively; curated rows are filtered by haversine distance in SQL).
- Distance from the user is computed once and shown on each card; results are sorted by a blend of distance, date proximity and completeness.
- No location entered = the current behaviour, nationwide curated results.

## 6. "Save to my Festive Activities"

One button on each result. It calls the **existing** `outings` insert path — same table, same planner, same hooks:

| Discovery field | `outings` column |
| --- | --- |
| name | `name` |
| start date | `event_date` |
| time | `event_time` |
| venue + town | `location` |
| priceFrom | `cost` |
| bookingUrl (or source URL) | `booking_url` |
| — | `planned = true` |

The user then adds who's going, notes and status in the planner exactly as today. Signed-out users are sent to sign in and the save is completed afterwards. Already-saved items show "Saved ✓" with a link to `/planner/outings`. No new table, no second planner, no duplicated activity data.

**Add to calendar:** a plain `.ics` download generated client-side from the saved fields — works on iPhone, Android, Google, Outlook and Apple Calendar with no integration or accounts. Offered on both the result card and each saved planner row.

## 7. Smallest useful first implementation (Phase 1)

1. Extend the `Experience` type with the source/location/date/price/booking/monetisation fields (all optional, so the existing 18 placeholders keep compiling and the page keeps working throughout).
2. Add a `curated_experiences` table (public read, admin write) plus the adapter registry and the `searchExperiences` server function with one adapter: curated. Ticketmaster is added as the second adapter in the same structure as soon as a key exists.
3. Add postcode/town + radius + date-range inputs above the existing filters, wired through URL search params so searches are shareable.
4. Fill the reserved card footer: distance, "Save to my Festive Activities", "Add to calendar", and "via {source}".
5. Keep the curated collection rows, driven by the same normalised results.

This gives genuine, real, saveable Christmas activities immediately, with every seam in place for live providers.

## 8. Files that would change

- `src/lib/days-out/experience-data.ts` — extend the type and taxonomy; placeholders stay until real data replaces them.
- New: `src/lib/days-out/sources/types.ts`, `registry.ts`, `curated.server.ts` (+ `ticketmaster.server.ts` when keyed), `normalise.ts`, `dedupe.ts`, `geo.ts`.
- New: `src/lib/days-out/search.functions.ts` — the `searchExperiences` server function.
- New: `src/lib/days-out/save-to-planner.ts` and `src/lib/calendar-ics.ts`.
- New: `src/components/days-out/LocationDateSearch.tsx`, `SaveToActivitiesButton.tsx`.
- `src/hooks/use-experience-filters.ts` — accept live results and URL-backed query state.
- `src/routes/days-out.tsx` — add the search bar and pass live results in. Layout and styling unchanged.
- `src/components/days-out/ExperienceCard.tsx` — populate the existing reserved footer; add image and dates.
- `src/routes/_authenticated/planner.outings.tsx` — add "Add to calendar" per row only.
- One database migration for `curated_experiences` (with grants and RLS).

Not touched: homepage, header, logo, nav, all Gifts routes, data and components, and every other planner section.

## 9. What you need to obtain before implementation

- **Ticketmaster Discovery API key** — free, self-service developer account.
- **Skiddle API key** — free, requires a short application.
- **postcodes.io** — no account or key needed.
- **Curated data** — a first batch of real UK Christmas events (name, venue, postcode, dates, price, official link) for me to load; I can draft the structure and you supply/approve the listings.
- Later, for monetisation only: Awin / Impact affiliate accounts, and any direct partner agreements.
- Nothing here requires payment to begin.
