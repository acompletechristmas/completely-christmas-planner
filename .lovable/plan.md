# Watchlist: Search + UK Certificate + Poster-Ready Cards

Three small, tightly scoped jobs on `/planner/watchlist` only. No catalogue expansion, no scoring/suitability changes, no external APIs, no database migration, no poster artwork (placeholders only). Music, Entertainment, Planner HQ and homepage are untouched.

## Job 1 — "I know what I want" search

A new `src/components/watchlist/SearchCatalogue.tsx` placed at the top of the **Help me choose** tab, above the existing "What shall we watch?" block.

- **Label**: visible heading "Search films & TV" with a lucide `Search` icon inside the input. Placeholder: "Search for a Christmas film or TV favourite…"
- **Behaviour**: purely client-side, case-insensitive match over the existing `WATCHLIST_IDEAS` catalogue:
  - title substring (primary)
  - year match when the query is numeric (e.g. `2006`)
  - existing strength context keys' friendly labels where relevant (e.g. typing "romance" surfaces romantic titles) — kept deliberately simple; title matching is the guarantee (`Holiday` → The Holiday, `Home` → Home Alone, `Bridget` → Bridget Jones's Diary)
- **Results**: appear directly below the input only while the query is non-empty; otherwise the section collapses away so discovery remains the default view. Each result is the same card shape as the recommendations (title, year, type, blurb, UK certificate badge from Job 2, poster placeholder from Job 3) with the existing **Add to my watchlist** action writing the standard `watchlist_items` row via `watchlistItemToSavedFields`. Already-saved titles are excluded or marked "On your watchlist" (excluded, matching recommendation behaviour).
- **Empty state**: "We couldn't find that in our Christmas collection yet." — no external search offer.
- **Separation**: search state is entirely local to the new component; it does not touch or read the recommendation refinements. "What shall we watch?" is unchanged.

No `use-watchlist` changes — reuse the existing `onAdd` prop pattern.

## Job 2 — UK certificate as separate catalogue metadata

- `src/lib/watchlist/vocabulary.ts`: add `export type UkCertificate = "U" | "PG" | "12A" | "12" | "15" | "18"` with a short comment stating it mirrors official UK certificates and is **not** used by the internal suitability engine.
- `src/lib/watchlist/catalogue.ts`: add optional `ukCertificate?: UkCertificate` to `CatalogueTitle`, populated with the known certificates for the 15 pilot titles (The Holiday 12A, Love Actually 15, Last Christmas 12A, Love Hard 15, Bridget Jones's Diary 15, While You Were Sleeping PG, When Harry Met Sally… 15, Elf PG, Home Alone PG, Daddy's Home 2 12A, Arthur Christmas U, The Polar Express U, Bad Santa 15, Violent Night 15, Spirited PG).
- Displayed as a small "12A"-style badge on result/search cards, visually distinct from the internal suitability guidance (which stays as-is and is never relabelled).
- `recommend.ts` scoring, suitability gates, and `AGE_BAND_ORDER` are **not** touched. `watchlist_items` table unchanged — the certificate lives only in the static catalogue.

## Job 3 — Poster-ready cards (placeholders only)

- Add optional `posterUrl?: string` to `CatalogueTitle` (currently unset for every title) so real artwork can be dropped in later without any code change.
- Introduce a small `WatchCard` presenter component (or a shared internal card in `ChooseForMe`/`SearchCatalogue`) used by **both** search results and recommendation results: a cream/gold card with a fixed-aspect (2:3) poster area on mobile/desktop, showing an elegant in-design-system placeholder (midnight blue → gold subtle gradient, serif title initial or `Film` line icon) when `posterUrl` is absent; a real `<img loading="lazy">` when present.
- Card layout keeps all existing content (badge, blurb, "why" line, Add button) and 44px touch targets; no horizontal scroll at 360/390px.

## Verification

- `bunx vitest run src/lib/watchlist/recommend.test.ts` — all 19 existing tests must pass unchanged.
- Typecheck passes.
- Playwright at 390px on `/planner/watchlist`: search finds "The Holiday" from `Holiday`, empty-state message for gibberish, add-to-watchlist from a search result, certificate badges render, placeholders show, no overflow.

## Explicitly out of scope

Catalogue growth beyond the pilot 15, scoring/suitability edits, streaming availability, TMDB/JustWatch/APIs, any database migration, poster image files, and every other page/route.
