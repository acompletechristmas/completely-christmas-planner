# Our Christmas Traditions

A dedicated traditions planner at `/planner/traditions`, built from the existing planner patterns. One saved traditions dataset shared by manual entries and accepted inspiration. No AI, no external APIs, no affiliate links.

## 1. What exists today

- There is **no traditions functionality**. The Planner HQ "Traditions" card points at `/planner/my`, a generic multi-section list page with an unrelated free-text "Family" section. No traditions table, no traditions catalogue.
- Reusable pieces already in place: `usePeople` (People records), `usePlannerSettings` (`household_types`, `celebration_style`, `num_adults`, `num_children`, `planning_style`, `stress_free`), `activePlanningYear()` in `src/lib/food/constants.ts`, `HOUSEHOLD_TYPES` / `CELEBRATION_STYLES` in `src/lib/household-options.ts`, the cream-and-gold header + pill tabs + `btn-planner` pattern from the Food Planner, `SectionShell`, and the `HelpMePlan` guided-journey pattern.

## 2. Page structure

Single route, two tabs (same pattern as Food):

- **Our traditions** (default) — list of saved traditions grouped by timing, plus a prominent `+ Add a tradition`. The quick-add is one field: tradition name. Saving creates the row instantly; a collapsed "Add details" disclosure on each row reveals notes, timing, category, participants, and the "We do this every Christmas" toggle.
- **Inspire me** — heading adapted to the household ("Christmas traditions for two", "Traditions the whole family can enjoy"), a short line saying what we based it on, an optional small refinement row (household type / mood chips) only when settings are missing, then curated idea cards with name, one-line explanation, how-to line, two or three small tags, and **Add to our Christmas**. Pressing it inserts a normal tradition row into the same table and marks the card as added.

Timing values: `christmas_eve`, `christmas_morning`, `christmas_day`, `boxing_day`, `december`, `new_year`, `flexible`, or a real date. Dates default to the active planning year via the existing `activePlanningYear()` helper — no new year system, no hard-coded year.

## 3. Database (one new table)

```sql
CREATE TABLE public.traditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,                      -- free text key, extendable, nullable
  timing text NOT NULL DEFAULT 'flexible',
  event_date date,
  participants uuid[] NOT NULL DEFAULT '{}',   -- references public.people ids
  participant_note text,                        -- free-text / "Everyone"
  is_annual boolean NOT NULL DEFAULT false,
  started_year integer,                -- future-ready, not surfaced in UI
  source text NOT NULL DEFAULT 'manual',        -- 'manual' | 'inspiration'
  suggestion_key text,                          -- catalogue key when inspired
  done boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

Plus, in the same migration: `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated`, `GRANT ALL ... TO service_role` (no anon), RLS enabled with a single `auth.uid() = user_id` policy for all commands, and the existing `update_updated_at_column()` trigger. `participants` as a uuid array avoids a join table while keeping People as the only people system; `started_year` and the `is_annual` flag leave room for future year history without building it now.

No other schema changes.

## 4. Curated catalogue and ranking

`src/lib/traditions/catalogue.ts` — a flat array of ~70 varied ideas, each with:
`key, name, blurb (one line), how (one line), category, timing, audiences[] (young_children, teenagers, young_adults, couple, adults_no_children, alone, extended, mixed_ages), moods[] (magical, traditional, cosy, fun, sentimental, romantic, relaxing, active, creative, meaningful), cost (free | low | treat), place (home | out | either), tags[]`.

Coverage spans every household group in the brief — young children, older children/teens, adult children, couples, multi-generational, friends/adults, and a genuinely positive set for spending Christmas alone — plus budget, free, creative, outdoors and special/luxury ideas. Near-duplicates are deliberately avoided.

`src/lib/traditions/recommend.ts` — one deterministic function `recommendTraditions({ settings, people, alreadySavedKeys, refinements })`:
1. Derive the household profile from `planner_settings.household_types`, `celebration_style`, adult/child counts, and People `age_range` / `date_of_birth`.
2. Score each idea: audience match (highest weight), mood/celebration-style match, cost fit, timing spread; drop anything already saved.
3. Diversify — cap per category and per mood so the list isn't twenty variations of one idea; return ~12 ranked ideas plus a context heading string.

No component contains ranking logic. Unit tests in `src/lib/traditions/recommend.test.ts` cover the couple, young-children, alone and extended-family profiles (vitest is already set up).

## 5. Files

Added:
- `src/routes/_authenticated/planner.traditions.tsx` — the route (head metadata, `noindex`, tabs, header).
- `src/hooks/use-traditions.ts` — load/add/update/delete with realtime, mirroring `usePlannerList`/`useFood`.
- `src/components/traditions/TraditionRow.tsx` — saved tradition row with progressive-disclosure details.
- `src/components/traditions/AddTradition.tsx` — one-field quick add.
- `src/components/traditions/InspireTraditions.tsx` — inspire tab UI, idea cards, Add to our Christmas.
- `src/lib/traditions/catalogue.ts`, `src/lib/traditions/recommend.ts`, `src/lib/traditions/recommend.test.ts`.
- `src/lib/traditions/constants.ts` — categories and timing labels (extendable lists).

Changed:
- `src/routes/_authenticated/planner.index.tsx` — the Traditions card's `to` becomes `/planner/traditions`. Nothing else on that page changes.
- `src/integrations/supabase/types.ts` regenerates from the migration.

Nothing else is touched: homepage, header, Gifts, Food, Days Out, Decorations, Looks, Cards, People and the global design system stay as they are.

## 6. Design and mobile

Existing cream surfaces, gold hairlines, serif display headings, `btn-planner`, pill tabs, existing spacing. Single column at 360/390px, 44px minimum touch targets, no horizontal scroll, no long forms — verified in a real browser at 390px before finishing.

## 7. Confirmations

- ONE saved traditions system: the `traditions` table. Inspiration is reference content only; accepting an idea writes an ordinary, fully editable row.
- No Gemini, OpenAI, other AI, web search, external API, affiliate or retailer links introduced.
- Cross-linking to Days Out / Food / Gifts is deliberately not built — traditions stay lightweight personal records this phase.
