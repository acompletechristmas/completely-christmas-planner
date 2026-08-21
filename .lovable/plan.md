# My Christmas Music — one canonical Music & Playlists system

## 1. What exists today

There is **no** music planner. Nothing saves music data anywhere. What exists is:

- **Planner HQ card "Music & Playlists"** (`src/routes/_authenticated/planner.index.tsx`, `key: "music"`) — currently points at `/planner/my` (the generic "my Christmas" page). This is the only planner-side music entry point.
- **Public editorial page `/entertainment`** ("Films & Music") — a marketing/inspiration page listing Playlists alongside Films, games and quiz packs. Editorial content, no saved data.
- **Site navigation** (`src/components/SiteNav.tsx`) — "Films & Music" → `/entertainment`. Site-level editorial nav, not a planner link.

No other music/playlist links exist anywhere in the app.

## 2. Link decisions

| Link | Now | After |
| --- | --- | --- |
| Planner HQ "Music & Playlists" card | `/planner/my` | `/planner/music` |
| `/entertainment` page | public editorial | stays; gains one planner CTA → `/planner/music` |
| SiteNav "Films & Music" | `/entertainment` | unchanged (editorial, not a planner link) |

`/entertainment` stays separate because it is genuine public editorial content covering films, games and quizzes — not a personal planner. Only its music CTA converges on `/planner/music`.

## 3. Reused patterns (Watchlist / Traditions)

Route shape, tabbed pill UI, quick-add with progressive disclosure, People selection, deterministic catalogue + recommend service, local filters, hook with realtime + optimistic updates, RLS/GRANT/`update_updated_at_column` trigger, mobile-first cream-and-gold styling. No copy-paste of whole systems — same shape, music-specific content.

## 4. Database — one table

Single migration creating `public.music_items`:

`id`, `user_id`, `title` (required), `artist`, `item_type` (song / album / playlist_idea / artist / other), `moment`, `moods text[]`, `participants text[]`, `participant_note`, `is_favourite`, `is_annual`, `notes`, `source` (manual | suggestion), `suggestion_key`, `sort_order`, `created_at`, `updated_at`.

**Participants reuse the existing convention exactly** — the same shape Traditions and Watchlist already use, no third convention: `participants text[]` holds `people.id` values only (as `WatchRow` does when toggling a person), and `participant_note` holds free text such as "Everyone" or "the neighbours". Names are never written into `participants`, and the People chip UI is the same pattern as the Watchlist row.

GRANT SELECT/INSERT/UPDATE/DELETE to `authenticated`, ALL to `service_role`, no anon. RLS enabled with a single `auth.uid() = user_id` ALL policy. `BEFORE UPDATE` trigger on `update_updated_at_column()`. No platform URL columns — future Spotify/Apple/YouTube/Amazon links become a later additive layer.

**One dataset:** both manual adds and accepted recommendations insert into `music_items`. Recommendations carry `source: "suggestion"` and a `suggestion_key`, and are then fully editable like any other row.

## 5. Curated catalogue

`src/lib/music/catalogue.ts` — ~130 well-known Christmas entries as factual metadata only: `key, title, artist, type, era, audiences[], moods[], moments[], energy, familySafe, tags[]`, plus one short **original** A Complete Christmas line. No lyrics, no copied descriptions, no artwork, no external links.

Balanced across carols, crooners, classic recordings, Christmas pop, modern festive, children's favourites, jazz/elegant, romantic, party, nostalgic, relaxed background and singalongs.

## 6. Recommendation service

`src/lib/music/recommend.ts` — one deterministic, network-free function.

1. Derive audience from existing `planner_settings` household types and `people` age ranges — nothing re-asked.
2. Apply the chosen **moment** as the strongest signal (moment mismatch heavily penalised).
3. Apply optional **mood** chips as a secondary boost.
4. Filter clearly unsuitable entries (e.g. drop non-family-safe when young children are the intended audience) — but never collapse a mixed household into children's music.
5. Score: moment fit, audience fit, mood fit, broad-appeal bonus for mixed/multi-generational contexts.
6. **Soundtrack assembly**, not a ranked list: pick a target energy curve for the moment (dinner = mostly low/mid, party = mostly high, decorating = warm mid with a lift), then fill slots against that curve while enforcing diversity caps — max 1 track per artist, spread across eras and styles.
7. Exclude already-saved `suggestion_key`s.
8. Output a context-appropriate heading, an original explanation sentence, and ~10–12 items. `Show me more` extends the set; `Surprise me` returns one item using a seeded pick.

Covered by `src/lib/music/recommend.test.ts` (moment shifts the set, children present ≠ all children's music, couple + romantic favours crooners/jazz, artist diversity, saved-item exclusion).

## 7. Files

Added:
- `src/lib/music/constants.ts` (moments, moods, types, labels)
- `src/lib/music/catalogue.ts`
- `src/lib/music/recommend.ts`, `recommend.test.ts`
- `src/hooks/use-music.ts`
- `src/components/music/AddMusicItem.tsx`, `MusicRow.tsx`, `MusicFilters.tsx`, `SoundtrackBuilder.tsx`
- `src/routes/_authenticated/planner.music.tsx`

Changed (minimum only):
- `src/routes/_authenticated/planner.index.tsx` — card `to: "/planner/music"`, `live: true`
- `src/routes/entertainment.tsx` — add one planner CTA to `/planner/music`

Migration: one new file creating `music_items`.

## 8. Page behaviour

**Tab 1 — My music.** Prominent `+ Add music` needing only a title; everything else behind disclosure. Filters: All / Songs / Playlist ideas / Favourites / Every Christmas, plus moment grouping and a local title/artist search. Rows toggle Favourite and Every Christmas inline (no Traditions record created).

**Tab 2 — Help me create the soundtrack.** Short visual refinement — "What are we creating music for?" (moment chips) then optional "What sort of feel?" (mood chips) — then the suggested soundtrack with heading, explanation, per-item **Add to my music**, plus **Add all to my music**. Items already saved show as saved rather than duplicating.

Wording stays "Suggested soundtrack" — never implies a real streaming playlist.

## 9. Confirmations

- No Gemini, Google search, paid AI, Spotify/Apple/YouTube/Amazon APIs, scraping, affiliate or retailer functionality.
- No fake platform URLs.
- All Music-planning links converge on `/planner/music`; nothing points at `/planner/my` for music.
- Existing People/household architecture reused, not duplicated.
- Cream-and-gold planner styling only; verified at 360px and 390px with 44px touch targets and no horizontal scroll.
- No changes to Gifts, Food, Days Out, Decorations, Cards, Traditions, Watchlist, homepage, header or the global design system.
