# Watchlist Correction — Search Visibility + Card Polish

Small correction to `/planner/watchlist` only. No catalogue, scoring, suitability, collections, database, or saved-watchlist behaviour changes. No other routes touched.

## Fix 1 — Make Search an obvious action

In `src/components/watchlist/SearchCatalogue.tsx`:

- Add a visible gold **Search** button (with the existing lucide `Search` icon) next to the input, 44px+ touch target.
- Desktop/tablet: input and button side by side (`flex` row, input `flex-1`, button `flex-shrink-0`).
- Mobile: keep side by side if it fits cleanly at 360px (input + compact "Search" label button); otherwise stack the button full-width below. Verify at 360px and pick the cleaner result.
- Button is `type="submit"` inside a `<form>` so **Enter in the input and tapping Search behave identically**. Keep the existing live filter-as-you-type; on submit, ensure results are displayed (e.g. commit the query / blur the input). No API calls.
- Move the `Search` icon from inside the input onto the button (input keeps its padding, may drop the inner icon since the button now carries it).

## Fix 2 — Move Search above the tabs

In `src/routes/_authenticated/planner.watchlist.tsx`:

- Render `<SearchCatalogue savedKeys={savedKeys} onAdd={add} />` in the parent page, directly below the page header and **above** the "My watchlist / Help me choose" tab bar, so it's a shared top-level action visible on both tabs.
- Search results render directly beneath the search block, above the tabs (existing behaviour, new position).

In `src/components/watchlist/ChooseForMe.tsx`:

- Remove the `SearchCatalogue` import and rendering so search does not appear twice. Leave "What shall we watch?" and everything else untouched.

Adding from search continues to use the existing `onAdd` → `watchlist_items` flow unchanged.

## Fix 3 — Soften the poster placeholder

In `src/components/watchlist/WatchCard.tsx`, restyle only the missing-artwork placeholder (poster slot and 2:3 aspect unchanged):

- Cream / warm neutral background with a very subtle gold tint instead of the dark navy gradient (e.g. `from-[#FBF7EE] to-[#F5EFE2]`).
- Thin gold border (the slot already has `border-[#D4AF37]/30` — keep or slightly strengthen).
- Small `Film` line icon in soft gold, with the title in small serif, now in muted dark-blue text for contrast on the light background.
- Real `posterUrl` rendering path is untouched; no artwork generated or fetched.

All existing card content (title, year, type, conditional UK certificate, badge, blurb, "why" line, Add to my watchlist) stays exactly as-is.

## Verification

- `bunx vitest run src/lib/watchlist/` — all 22 existing tests pass unchanged.
- Typecheck passes.
- Playwright at 360px and 390px on `/planner/watchlist`:
  1. Search block with a visible gold **Search** button sits above both tabs.
  2. Search is visible on both "My watchlist" and "Help me choose" tabs; exactly one search box on the page.
  3. Typing `Holiday` and pressing Enter / tapping Search shows The Holiday; Add to my watchlist works from a result.
  4. No horizontal overflow; results don't break layout.
  5. Placeholder poster reads as a light cream/gold placeholder, no longer dominating the card.
  6. Add button remains 44px+ and easy to tap.

## Out of scope

Catalogue content/growth, scoring, suitability, collections, database, saved-watchlist behaviour, real poster artwork, Music, Entertainment, and every other route.
