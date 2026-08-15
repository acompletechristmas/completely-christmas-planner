# Fix: Days Out "Find Christmas magic near me" resets the page

Fix only. No new features, no redesign, no new routes, no second search system, no database or provider changes.

## What is actually happening (verified in the code)

In `src/routes/days-out.tsx`:

1. **The button never leaves Inspire mode.** In Inspire mode, step 3 renders the existing `LocationDateSearch`, and its submit handler merges only `location`, `from`, `to`, `radius`. It does **not** set `mode: "find"`. The live search query is disabled while `mode=inspire`, so no search runs, no results appear, and the page simply re-renders the journey — which reads as "the button did nothing / it reset".
2. **Every press jumps to the top.** The router is created with `scrollRestoration: true` (`src/router.tsx`), so each search-param navigation restores scroll to the top of `/days-out`. Combined with (1), the user is thrown back to the start of the page.
3. **The idea action forces the same jump.** `findIdeaNearMe` calls `window.scrollTo({ top: 0 })` immediately after navigating, so even the correct `mode=find` path lands the user on the hero instead of the results.

Not causes (checked): all buttons already use `type="button"`; `LocationDateSearch` submits through `onSubmit` with `preventDefault`; every `navigate` already uses the functional `search: (prev) => ({ ...prev, ... })` merge form; the zod schema has `fallback(...)` defaults for `types` and `keywords`, so nothing is stripped; there is no redirect effect and no `replace` navigation.

## The fix (smallest change, one file plus a small prop)

All in `src/routes/days-out.tsx`, except one optional ref prop.

1. Add a `resultsRef` on the existing results/status area (the search-status block in Find mode) and a tiny `scrollToResults()` helper that scrolls that element into view on the next frame.
2. **Inspire step 3 submit** — merge location/from/to/radius **and** set `mode: "find"`, keeping `group`, `ages`, `moods`, `types`, `keywords` untouched via the existing `...prev` merge. Then `scrollToResults()`.
3. **`findIdeaNearMe`** — keep the existing merge (`mode: "find"`, idea `keywords`, idea `types`); replace `window.scrollTo({ top: 0 })` with `scrollToResults()`.
4. Pass `resetScroll: false` to the `navigate` calls on this page so TanStack's scroll restoration stops pulling the user back to the top on a same-page search-param change.

Everything else — the "Searching for:" chip, live/no-live/location-not-found status copy, `SourcesSearched`, filters, collections, Add to calendar, Save to Festive Activities — is untouched and continues to work because the URL state is only ever merged, never rebuilt.

## Verification

Real browser (Playwright) at 360px and 390px: open `/days-out`, tap Inspire me, pick a group, pick moods, enter a postcode, set dates and radius, generate ideas, then tap the find action once. Confirm: one tap is enough; URL keeps `location`, `from`, `to`, `radius`, `types`, `keywords` and `mode=find`; the page stays in Find mode; the viewport lands on the results/status section, not the hero; browser Back returns to the Inspire state.
