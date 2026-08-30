# Watchlist UX polish + Christmas Looks back link

Small, tightly scoped presentation-only task. Two jobs. No catalogue, scoring, suitability, collections logic, database, or saved-data changes.

## Job 1 — `ChooseForMe` presentation rework

Rewrite the render of `src/components/watchlist/ChooseForMe.tsx` only. All state, refinements, `recommendWatchlistItems`, `surpriseWatchlistItem`, `curationBadge`, and `describeWhy` calls stay exactly as they are — same inputs, same outputs.

### Layout (top to bottom)

1. **Opening** — serif heading **"What shall we watch?"** + one line of supporting copy: *"Tell us who's watching and what you're in the mood for, and we'll find something festive."* No other explanation above the choices.

2. **Who's watching?** — primary prominent chips (existing gold selected pill styling, 44px+ targets):
   - Everyone → `multigenerational`
   - Adults → `adults`
   - Kids → `young_children` + `older_children` (one chip selecting both)
   - Couple → `couple`
   - Just me → `alone`
   - A smaller secondary text control ("More options") expands the remaining existing audience choices (teenagers, grown-up children, etc.). No new People system; household `context` prop unchanged.

3. **What are you in the mood for?** — compact chips, exactly these seven, in this order, with friendly labels (internal keys unchanged):
   - Funny → `comedy`, Romantic → `romance`, Cosy → `cosy`, Magical → `magical`, Action → `action`, Nostalgic → `nostalgic`, Something different → `alternative`
   - Musical and dark comedy are removed from the offered row (vocabulary untouched).

4. **Choose when you're watching** — subtle collapsed disclosure (small text button with chevron). Expanding reveals the existing `TIMINGS` pills with unchanged single-select behaviour. Selection state is shown on the collapsed button when a timing is chosen.

5. **Or browse something special** — the existing collections become a horizontal scroll row of compact cards (existing title + subtitle, existing gold selected state). Scroll made intentional: edge fade/peek via negative-margin padding so it never looks clipped. Membership and behaviour unchanged.

6. **Our picks for you** — warmer results heading replacing the current heading/subheading/explanation block (the engine's `heading`/`subheading` strings are not rendered as technical explainer text; no scores shown anywhere). Result cards keep title, year, type, blurb, existing `curationBadge` chip, existing `describeWhy` line, and the existing Add to my watchlist action. Top (essential-strength) picks get a subtle visual lift — slightly stronger gold border/glow — so they read as the main suggestions; no invented metadata.

7. **🎬 Surprise me** — moved to a small secondary action placed near the results heading (icon-button/text style, not a full-width stage button). Same deterministic `surpriseWatchlistItem` call.

The form panel keeps the existing cream card (`#FAF7F2`, gold hairline border) — no new visual system.

### Mobile
- Verify at 360px and 390px: no horizontal page overflow (collections scroll is contained), chips wrap compactly, all touch targets ≥ 44px, selected states obvious, heading-to-results path is short.
- Playwright screenshots at both widths to confirm.

## Job 2 — Christmas Looks back link

`src/routes/inspire.looks.index.tsx`:
- Add a small "Back to Get Inspired" link (ArrowLeft, existing PageShell back-link styling) at the top of the custom hero, pointing `to="/inspire"`.
- Add `backTo="/inspire"` to the two `PageShell` usages in this file (error and not-found states), which currently default to `/`.

No design or content changes to Christmas Looks; no other navigation touched.

## Out of scope (explicitly not changed)

- `catalogue.ts`, `vocabulary.ts`, `collections.ts`, `recommend.ts`, suitability logic, `watchlist_items`, database, Music planner, Entertainment page, Planner HQ, homepage.
- No films added/removed/reclassified; no streaming availability.
- Recommendation tests untouched (UI-only change; `recommend.test.ts` tests the engine, not the component).

## Files changed

- `src/components/watchlist/ChooseForMe.tsx` (render/layout only)
- `src/routes/inspire.looks.index.tsx` (back link only)

## Verify

1. Heading "What shall we watch?" leads; Who's watching first, Mood second.
2. Timing collapsed by default, fully functional when expanded.
3. Collections presented as "Or browse something special" discovery cards.
4. Results headed "Our picks for you", no technical scoring visible, essential picks visually lifted.
5. Surprise me present as secondary action, behaviour unchanged.
6. Saved-watchlist add flow unchanged.
7. 360px/390px screenshots: no overflow, 44px+ targets.
8. `/inspire/looks` back link goes to `/inspire` (hero link + PageShell states).
9. `bunx vitest run src/lib/watchlist/recommend.test.ts` passes; typecheck/build pass.
