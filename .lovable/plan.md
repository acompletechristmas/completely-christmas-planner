# Watchlist Version 1 master catalogue

Replace the 15-title pilot list in the Films & TV catalogue with the approved Version 1 master catalogue (~150 records), using the curation system already in place. No page redesign, no scoring change, no database change.

## What changes

1. **Catalogue records** — one master record per approved title, covering the film/short/special list plus the British Christmas TV list (Bernard and the Genie appears once only). No title outside the approved list; nothing removed from it. Home Alone 3 and Little Women are absent by design.
2. **Curation** — each record gets contextual strengths (essential / strong / extra / unsuitable), Christmas relevance, internal suitability band, timings, and a short editorial blurb in UK spelling. The editorial priorities in the brief (family, teens, romance, classics, adult comedy, dark/alternative, musical, young children, British TV) drive the essential/strong assignments.
3. **One new collection** — `not_your_usual_christmas` ("Not your usual Christmas") added to the existing collection list, with the eight named members. `secret_christmas` keeps its current members and gains Bernard and the Genie and Trading Places, with Edward Scissorhands and Serendipity as secondary.
4. **Vocabulary** — only additions strictly needed to express the above (the new collection key; a small number of extra mood keys only if an approved editorial group has no existing key). Existing keys and labels are untouched.

## Data rules honoured

- `ukCertificate` left unset everywhere — no fabricated BBFC values.
- `posterUrl` left unset everywhere — placeholders keep working.
- `minutes` only where confidently known; omitted otherwise (short-form items such as The Snowman, Blackadder's Christmas Carol and sitcom specials get their runtimes so quick-watch contexts work later).
- Adult titles (Bad Santa, Violent Night, Office Christmas Party, The Night Before, A Bad Moms Christmas, Black Christmas, Better Watch Out, Christmas Bloody Christmas, The Ref and similar) are marked `adult` and explicitly `unsuitable` for young/older children and family contexts.
- Teenagers and grown-up children stay distinct in the strength maps.
- Christmas relevance stays honest: `core` for true Christmas stories, `strong_setting` where Christmas frames the story, `christmas_adjacent` used sparingly and never upgraded to rank higher.

## Files

- `src/lib/watchlist/catalogue.ts` — rewritten data array (types and exports unchanged).
- `src/lib/watchlist/collections.ts` — one new collection entry.
- `src/lib/watchlist/vocabulary.ts` — new `CollectionKey` member; any minimal mood key additions.
- `src/lib/watchlist/*.test.ts` — pilot-specific assertions adjusted only where the expansion invalidates them, plus checks for unique keys, no duplicate title/year, and no fabricated certificate or poster values.

Untouched: SearchCatalogue, ChooseForMe, WatchCard, saved-watchlist flow, hooks, routes, database.

## Verification

Run the watchlist tests and the project typecheck; fix only breakage caused by the expansion. Confirm record count, unique keys, no duplicate master records, Home Alone 3 and Little Women absent, no certificates or posters populated, search finds titles by title and year, and recommendations still run through the existing deterministic engine.

## Report at the end

Total record count, files changed, whether vocabulary/collections needed additions, and confirmation that no migration, API, poster source, streaming source or UI redesign was introduced.
