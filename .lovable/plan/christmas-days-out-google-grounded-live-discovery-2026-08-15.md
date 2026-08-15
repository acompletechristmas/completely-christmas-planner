# Christmas Days Out — Google-grounded live discovery

Extends the existing `/days-out` engine. No new routes, no second search system, no second event model. The dormant `websearch` adapter becomes a real Google-grounded provider, and the Find Something panel gets one obvious query field and one unmissable search button.

## What changes for the user

1. A new field at the top of the search panel: **WHAT ARE YOU LOOKING FOR?** with placeholder `Santa, light trails, Christmas market, afternoon tea…`. It feeds the existing keyword state — no separate query system.
2. One primary gold button at the bottom of the panel: **Search Christmas activities**, becoming **Searching Christmas activities…** and disabled while running.
3. While searching, the status area shows `Searching Christmas magic near you…` with `Checking A Complete Christmas and connected live sources.` (or `Searching A Complete Christmas and the live web…` when Google is configured).
4. Results heading becomes `Christmas activities near {place}` with `{n} festive experiences found`.
5. Results are shown in batches with a **Show more results** button; no re-running the search to see more.
6. Static inspiration only appears after a genuine zero-result live search, clearly labelled as ideas, never bookable.
7. Inspire Me is untouched — `Find this near me` feeds the same live search with the idea's keywords and types.

## How the Google search works

- Server-only provider using the official Gemini API with the Google Search grounding tool (current documented syntax will be checked against Google's docs at implementation time, not written from memory).
- One user search fans out into a small set of targeted queries (typically 3–5) built from the free-text query, idea keywords, selected types, town/postcode, radius and date range, plus festive context — e.g. `Santa` + `RH1 3HA` becomes grotto/farm/garden-centre/heritage variants. These queries are never shown to the user.
- Results are normalised into the existing `Experience` shape and pass through the existing dedupe, distance and sort pipeline.
- Location-aware grounding (Maps/Places) is used only where the selected model officially supports it, and only to firm up venue name, address and coordinates. A venue existing on Maps is never treated as proof of an event.

## Trust rules (hard constraints)

- A live result is only created when a grounded source supports it. Minimum required: a title and a genuine, parseable http(s) source URL. Anything else is discarded.
- Dates, prices, venues and booking URLs are never guessed — missing fields stay empty.
- Google search-result pages, placeholder URLs and invented links are rejected.
- Preference order for the destination URL: official venue/event page → organiser page → legitimate ticketing page → reputable tourism/council listing. Blogs, thin directories and social posts are not used as the booking source.
- Existing action priority `affiliateUrl ?? bookingUrl ?? sourceUrl` is preserved, labelled `View & book` when a real booking URL exists, otherwise `View event`.
- Grounding/citation metadata from the API is retained on the result; the card keeps showing the venue/event source first with provider attribution quiet and secondary.

## Failure and cost behaviour

- No `GEMINI_API_KEY` → the provider reports itself disabled, is never listed in `Sources searched`, and curated/Ticketmaster results continue as today.
- A Gemini error mid-search → the page still renders other providers' results; Google is not claimed as searched.
- Grounded searches only run on `Search Christmas activities` or `Find this near me` — never on keystrokes or filter toggles. Identical search requests are cached server-side for a short period, and duplicate sub-queries within one search are collapsed.

## Technical detail

Files changed (existing files only):

- `src/lib/days-out/sources/websearch.server.ts` — implement the Gemini + Google Search grounding adapter behind `enabled: () => Boolean(process.env.GEMINI_API_KEY)`; multi-query fan-out, strict validation, URL sanity checks, per-search in-memory cache.
- `src/lib/days-out/sources/types.ts` — allow the query to carry the raw free-text query alongside `keywords` (additive, optional).
- `src/lib/days-out/search.functions.ts` — pass the free-text query through and keep the existing geocode → registry → dedupe flow; short-lived result cache keyed on the normalised request.
- `src/components/days-out/LocationDateSearch.tsx` — add the query field, relabel the submit button, add the disabled/searching state.
- `src/routes/days-out.tsx` — add `q` to the existing URL search schema, wire it into the existing `searchExperiences` query key, update the status/heading copy, add `Show more results` paging over the combined result set, and gate the query so it only runs after an explicit submit.
- `src/components/days-out/SourcesSearched.tsx` — copy only, so Google appears only when the provider actually ran.

Unchanged: `ExperienceCard`, `ExperienceActions`, `curated.server.ts`, `ticketmaster.server.ts`, `dedupe.ts`, `geo.ts`, Inspire Me components, planner, `outings` table, and everything outside Days Out.

## Secret you need to add

`GEMINI_API_KEY` — a Google AI Studio API key with the Gemini API enabled (server-side only). Nothing else is required for Google Search grounding. If the model chosen also supports Maps grounding and it needs separate enablement, that will be reported rather than assumed.

## Verification before I report done

Tests A–E from your brief, run in a real browser: `Santa` and `Christmas light trail` at RH1 3HA / 25 miles / 01-11-2026→24-12-2026, an Inspire Me romantic idea via `Find this near me`, opening at least five returned links to confirm they resolve to genuine relevant pages, and the one-tap mobile flow at 360px and 390px. Without the key present, I can verify everything except live Google results — I'll say so plainly if the key isn't added before I build.
