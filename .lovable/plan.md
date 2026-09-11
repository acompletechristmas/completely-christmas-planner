# Temporary branded title-card thumbnails for the Watchlist

Visual-only change. The catalogue data, recommendations, search, saved watchlist, routes and database stay exactly as they are.

## What changes

Every film or programme without licensed artwork currently shows a plain cream box. It will instead show a small, elegant A Complete Christmas "title card": warm cream or deep navy background, thin gold border, a subtle festive motif, the title in serif and the year underneath in smaller text.

No film posters, stills, actor images, studio logos or any outside pictures are used. Nothing is downloaded or fetched. These are drawn in-house from the existing look and feel, and are replaced automatically the moment real licensed artwork is supplied for a title.

## Motif and colour, chosen automatically

The look is derived from the curated tags each title already has — no new data file, no changes to the catalogue.

| Title feels like | Look |
|---|---|
| Family / magical | Cream, gold sparkle and snowflakes |
| Romance / cosy | Cream, soft heart and a fine ribbon line |
| Comedy | Cream, gift-cracker and confetti dots |
| Classic / nostalgic | Cream with a vintage double-line frame |
| Musical | Cream with a music note |
| Alternative / dark / horror | Deep navy-charcoal with faint snow and a star |
| British Christmas TV | Cream with a small understated TV outline |
| Young children | Softer cream with playful rounded festive shapes |

First matching rule wins, so each title gets one consistent card every time.

## Legibility

Titles wrap onto up to four lines, long words break cleanly, and very long titles step down a size so entries like "The Vicar of Dibley: The Christmas Lunch Incident" and "Shaun the Sheep: The Flight Before Christmas" stay readable. Checked at 360px and 390px.

## Technical notes

- New file `src/components/watchlist/PosterFallback.tsx`: a pure presentational component taking a `CatalogueTitle`, picking a theme from `item.strength` keys plus `item.suitability` and `item.type`, and rendering an inline SVG-free layout using existing lucide line icons (Sparkles, Snowflake, Heart, Gift, Music, Star, Tv) inside the existing 2:3 slot.
- `src/components/watchlist/WatchCard.tsx`: the `posterUrl ? <img> : <placeholder>` branch swaps the placeholder markup for `<PosterFallback item={item} />`. Slot size, aspect ratio and every other part of the card are untouched.
- No edits to `catalogue.ts`, `recommend.ts`, `collections.ts`, `vocabulary.ts`, hooks, routes or SQL. `posterUrl` stays unset everywhere.

## Verification

Run the existing watchlist tests and typecheck, then view `/planner/watchlist` at 360px and 390px: search results and recommendations show themed title cards, no horizontal overflow, add-to-watchlist still works.
