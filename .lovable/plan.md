# My Christmas Watchlist

A dedicated Christmas Films & TV planner at `/planner/watchlist`, built exactly on the Traditions pattern that already exists. One saved dataset shared by manual entries and accepted recommendations. No AI, no streaming or entertainment APIs, no affiliate links.

## 1. What exists today

- There is **no watchlist functionality**. The Planner HQ "Films & TV" card (line 143 of `src/routes/_authenticated/planner.index.tsx`) points at `/planner/my`, a generic multi-section list page.
- The Traditions feature shipped recently and is the closest precedent: `traditions` table, `useTraditions` hook, `TraditionRow` / `AddTradition` / `InspireTraditions` components, `catalogue.ts` + deterministic `recommend.ts` + vitest suite, and open-ended constants lists.
- Reusable pieces: `usePeople` (with `calcAge`, `age_range`), `usePlannerSettings` (`household_types`, `celebration_style`, `num_adults`, `num_children`), `activePlanningYear()` in `src/lib/food/constants.ts`, cream-and-gold header + pill tabs + `btn-planner`, `SectionShell`.

## 2. Page structure

One route, two tabs (same shape as Traditions):

- **My watchlist** (default) — saved titles with a prominent `+ Add something to watch`. Quick add is one field: title. Each row has a watched tick, a favourite star, and a collapsed "Add details" disclosure holding type, year, timing, mood tags, who's watching, "We watch this every Christmas", age guidance and notes.
- **Help me choose** — a contextual heading built from the household ("Cosy Christmas viewing for two", "Festive favourites for a family with teenagers"), a line saying what it was based on, an optional mood/viewer refinement row, then recommendation cards with **Add to my watchlist**, plus **Show me more** and **Surprise me** (both local, deterministic).

Lightweight filter pills on the saved tab: All / Films / TV / Not watched / Watched / Favourites / Annual, plus a simple title search input. All client-side over the loaded rows.

## 3. Database (one new table)

```sql
CREATE TABLE public.watchlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_type text,                      -- film | tv_special | episode | series | other, nullable
  release_year integer,
  note text,
  age_guidance text,
  participants uuid[] NOT NULL DEFAULT '{}',
  participant_note text,
  timing text NOT NULL DEFAULT 'any_time',
  moods text[] NOT NULL DEFAULT '{}',
  watched boolean NOT NULL DEFAULT false,
  is_favourite boolean NOT NULL DEFAULT false,
  is_annual boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'manual',  -- manual | recommendation
  suggestion_key text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

Same migration also: `GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated`, `GRANT ALL TO service_role` (no anon), RLS enabled with one `auth.uid() = user_id` policy for all commands, and the existing `update_updated_at_column()` trigger. No streaming/provider columns. `is_annual` alone represents annual viewing traditions — it does **not** write to the `traditions` table.

No other schema changes.

## 4. Curated catalogue

`src/lib/watchlist/catalogue.ts` — a flat array of ~100 well-known Christmas titles, each with:
`key, title, year, type, blurb (one short original line written for A Complete Christmas), audiences[], moods[], ageBand (all | 5+ | 8+ | 12+ | adult), timings[], minutes?, tags[]`.

Coverage: classic and modern Christmas films, family and children's films, animation, romance, comedy, musicals, nostalgic favourites, Christmas TV specials and well-known festive episodes. No obscure filler.

**Copyright restraint:** every blurb is one original sentence written for this project — no plot summaries, reviews or critic text copied from anywhere, no poster artwork, no external image URLs. Cards use the existing cream-and-gold surfaces and typography only.

## 5. Recommendation service

`src/lib/watchlist/recommend.ts` — one deterministic function `recommendWatchlist({ settings, people, alreadySavedKeys, refinements, offset, seed })`:

1. Derive the viewer profile from `planner_settings.household_types`, adult/child counts, and People `age_range` / `date_of_birth` (via `calcAge`) → audiences (young_children, older_children, teenagers, young_adults, couple, adults_no_children, mixed_ages, extended, alone) and a youngest-age band.
2. **Suitability filter** — use the youngest selected/known viewer as a suitability constraint only when the recommendation is intended for the whole group. If the user refines the audience or selects specific participants, base suitability on those viewers instead. Do not exclude suitable teen/adult recommendations merely because a younger household member exists but is not part of that viewing choice. Adult-only content must never surface when young children are included in the intended viewing group.
3. **Score** — audience match highest weight, then selected moods, then celebration-style hints, then timing fit and a small bonus for crossover titles in mixed-age households (so a multi-generational household gets genuine crossover picks, not just children's films). Exclude saved keys.
4. **Diversify** — cap per type and per dominant mood so the set isn't ten near-identical films.
5. Return ~9 ranked ideas plus a deterministic contextual heading and a "because" line. `offset` powers Show me more; `seed` reshuffles within the qualifying set for Surprise me — both purely local.

No ranking logic lives in components. `src/lib/watchlist/recommend.test.ts` covers the young-children, teenagers, couple, mixed-age and alone profiles.

## 6. Files

Added:
- `src/routes/_authenticated/planner.watchlist.tsx` — route (head metadata, noindex, tabs, cream-and-gold header).
- `src/hooks/use-watchlist.ts` — load/add/update/delete with realtime, mirroring `useTraditions`.
- `src/components/watchlist/WatchRow.tsx` — saved row: watched tick, favourite, progressive-disclosure details.
- `src/components/watchlist/AddWatchItem.tsx` — one-field quick add.
- `src/components/watchlist/WatchlistFilters.tsx` — filter pills + title search.
- `src/components/watchlist/ChooseForMe.tsx` — Help me choose tab, refinement chips, result cards.
- `src/lib/watchlist/catalogue.ts`, `recommend.ts`, `recommend.test.ts`, `constants.ts` (types, timings, moods — open-ended lists).

Changed:
- `src/routes/_authenticated/planner.index.tsx` — the Films & TV card's `to` becomes `/planner/watchlist`. Nothing else on that page changes.
- `src/integrations/supabase/types.ts` regenerates from the migration.

Nothing else is touched: homepage, header, logo, Gifts, Food, Days Out, Festive Activities, Decorations, Looks, Shop This Look, Cards, Traditions, People and the global design system stay as they are.

## 7. Design and mobile

Existing cream surfaces, gold hairlines, serif display headings, `btn-planner`, pill tabs, existing spacing and radii. Single column at 360/390px, 44px minimum touch targets, no horizontal scroll, no long forms — verified in a real browser at 390px before finishing. No poster grids, no streaming-app styling.

## 8. Confirmations

- ONE saved watchlist system: the `watchlist_items` table. The catalogue is reference content only; accepting a recommendation writes an ordinary, fully editable row (watched, favourite, annual, participants, delete).
- No paid AI, no TMDB/IMDb/JustWatch/Netflix/Disney/Amazon, no web search, no affiliate or retailer links, no streaming-availability data — but the row shape leaves room to add a "Where can I watch this?" layer later.
- Marking "We watch this every Christmas" does not create a Tradition; no records are duplicated between the two features.
