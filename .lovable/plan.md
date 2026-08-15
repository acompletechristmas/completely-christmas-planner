# Christmas Days Out — add "Inspire Me" on top of the existing search

No second Days Out system, no second planner, no second event model, no new routes, no migration.

## 1. What already exists and gets reused (verified)

- `/days-out` route with URL search state (`location`, `from`, `to`, `radius`), `LocationDateSearch`, five filter groups via `useExperienceFilters`, collections, `ExperienceCard`, `ExperienceActions` (View & book / calendar / Save to Festive Activities), `SourcesSearched`.
- `searchExperiences` server fn already accepts `location`, `radiusMiles`, `from`, `to`, `types`, `price`, `setting` and returns `{ items, origin, sources, locationNotFound }`.
- `registry.server.ts` fans out to enabled adapters (`curated`, `ticketmaster`), dedupes, sorts. `ExperienceSource` interface in `types.ts`.
- `Experience` model already carries `sourceId/sourceName/sourceUrl/bookingUrl/affiliateUrl/priceFrom/checkedAt/venue/town/dates`.
- Static `EXPERIENCES` inspiration catalogue — kept exactly as is.

None of the above is rebuilt or duplicated.

## 2. What genuinely needs adding

**A mode switch at the top of `/days-out`:** "Find something" (existing search panel, default) and "Inspire me". Mode lives in the existing URL search schema (`mode: "find" | "inspire"`), so there is one page and one state.

**A short, progressive Inspire Me journey** (not a long form), also stored in the same URL search state:
- Step 1 — Who's going? one choice from: couple, babies/toddlers, young children, older children, teenagers, young adults, adult children, multi-generational, adults/friends, going alone. Optional free-text "ages" field.
- Step 2 — What sort of Christmas? multi-select chips: magical, romantic, traditional, fun, cosy, relaxing, something different, food & drink, outdoors, indoors, active, luxury, budget friendly, free, surprise me.
- Step 3 — Practical: reuses the *existing* `LocationDateSearch` component and the same `location/from/to/radius` params. No duplicate location/date/budget controls.

**Ideas (not events).** A new `ExperienceIdea` type, entirely separate from `Experience`:
`{ id, title, why, tags: string[], types: ExperienceType[], keywords: string[], audiences, moods }`.
An idea has no price, no date, no venue, no booking link — it cannot be mistaken for a listing and never becomes a card with actions.

**A provider-neutral recommendation seam.** `recommendIdeas` server fn takes a `RecommendationRequest` (group, optional ages, moods, plus the existing search context) and returns `ExperienceIdea[]`. Behind it sits a small `Recommender` interface with one implementation now: a curated rules recommender (group × mood → idea pool, deterministic scoring, shuffle seed for "Show me more ideas" / "Surprise me"). A real AI recommender can be registered later with no UI change. No API keys, no AI provider wired now.

**"Find this near me".** Each idea card's primary gold action navigates on the same route to `mode=find` with the idea's `types` applied to the existing search and the location/dates already held in state — i.e. it calls the existing `searchExperiences` flow. Nothing new searches.

**Live-web-search readiness.** `SearchQuery` gains an optional `keywords?: string[]` (ignored by the curated adapter, passed through by the registry) and a new dormant `websearch.server.ts` adapter implementing the existing `ExperienceSource` interface: `enabled()` returns false while unconfigured, `search()` returns `[]`. It contains no provider name, no key, no scraping, no synthesised results — it is the registration point for a general live-web/place source later. Ticketmaster stays one optional source among several.

**Trust.** Ideas render in a visually distinct card (`IdeaCard`) with no price/date/link and a quiet "Christmas ideas, not listings" note. Only adapter-returned results become `Experience` cards with source, dates, price-from and booking links. Static catalogue keeps its existing "ideas, not live listings" labelling.

## 3. Personal headings

Heading is composed from group + moods, e.g. "Romantic Christmas ideas for two", "Christmas ideas for a magical family day out", "Festive ideas for the whole family" — never "Recommended events".

## 4. Files

Changed:
- `src/routes/days-out.tsx` — add `mode`/`group`/`ages`/`moods` to the search schema, render the two-way switch, mount either the existing search panel + results or the Inspire journey. Existing search, filters, collections, results grid untouched.
- `src/lib/days-out/sources/types.ts` — add optional `keywords?: string[]`.
- `src/lib/days-out/sources/registry.server.ts` — register the dormant web-search adapter.

New:
- `src/lib/days-out/ideas.ts` — `ExperienceIdea`, `RecommendationRequest`, group/mood label maps, heading builder.
- `src/lib/days-out/recommend/rules.ts` — curated idea pool + scoring (extensible, examples not exhaustive).
- `src/lib/days-out/recommend.functions.ts` — `recommendIdeas` server fn (thin wrapper, provider-neutral).
- `src/lib/days-out/sources/websearch.server.ts` — dormant adapter, returns `[]` until configured.
- `src/components/days-out/DiscoveryModeSwitch.tsx`
- `src/components/days-out/InspireJourney.tsx` (steps + chips, reuses `LocationDateSearch`)
- `src/components/days-out/IdeaCard.tsx`

Not touched: homepage, header, Gifts, Decorations, Looks, planner, `outings`, `curated_experiences`, `ExperienceCard`, `ExperienceActions`, `dedupe`, `geo`, `curated.server`, ICS helper, the `Experience` model. No migration.

## 5. Mobile

360/390px first: full-width choice cards, wrapping chips, 44px+ targets, one step visible at a time, no fixed widths, no horizontal scroll. Verified with screenshots at both widths before finishing.

## 6. Visual

Existing tokens only — midnight background, gold hairline borders and gold CTAs, serif display headings, existing radii/shadows. No AI iconography, chat bubbles or gradients.
