# Fix: navigation and scroll behaviour

Fix only. No new features, no redesign, no route renames, no database changes.

## What the code currently does (verified)

- `src/routes/days-out.tsx` calls `scrollToResults()` immediately after each `navigate(...)` (Find search, Inspire step-3 search, `findIdeaNearMe`). It uses two nested `requestAnimationFrame`s and reads `resultsRef`, which only exists in Find mode — so on the Inspire → Find switch the target often has not rendered yet and the scroll silently does nothing or lands wrong. This is the race.
- `src/router.tsx` sets `scrollRestoration: true` globally; Days Out already opts out per-navigation with `resetScroll: false`. That split is correct and stays.
- `src/components/PageShell.tsx` renders a Back link hard-coded to `to="/"`. Every page using PageShell (18 routes, including inspiration detail and look pages) therefore sends the user to the homepage instead of the logical parent.
- `src/routes/inspire.looks.index.tsx` "Start exploring" is `<a href="#looks-grid">`; `#looks-grid` exists but has no scroll offset under the fixed header.
- `src/routes/gift-finder.index.tsx` "Preview Gift Finder" targets `#ai-gift-finder`, which exists and already has `scroll-mt-20`; the card is rendered through a link list — behaviour to confirm in the browser, fix only if it double-navigates or resets.
- `src/components/SiteNav.tsx` closes the menu with `useEffect(..., [pathname])` only, so a link to the current route or one that only changes search/hash leaves the menu open.
- The only other explicit top-scroll calls are `teachers.generate.tsx` (scrolls to its own output — intentional, keep) and `planner.gifts.tsx` line 1842 (resets a modal body's own scrollTop — keep).

## The fix

1. **Days Out (`src/routes/days-out.tsx`)** — delete the three inline `scrollToResults()` calls. Keep a `pendingScroll` flag set when the user explicitly triggers a search, and run the scroll from a `useEffect` that fires only when Find mode is active, the results/status element ref is attached, and the search nonce has advanced. Scroll with `scrollIntoView({ behavior: "smooth", block: "start" })` on the existing `resultsRef` element (which already carries `scroll-mt-28` for header clearance). No timeouts, no focus movement.
2. **PageShell Back (`src/components/PageShell.tsx`)** — add an optional `backTo` (and optional `backLabel`) prop; when omitted the Back link keeps today's `/` behaviour so nothing regresses. Then pass an explicit parent on the pages with a real hierarchy: inspiration detail → its look page, look page → `/inspire/looks`, looks index → `/inspire`. No other pages change.
3. **Anchors** — add `scroll-mt-24`/`scroll-mt-28` to `#looks-grid` so it clears the fixed header; leave `#ai-gift-finder` as is unless the browser check shows a reset. Global `scroll-behavior: smooth` handling stays as-is.
4. **Mobile menu (`src/components/SiteNav.tsx`)** — also watch `location.searchStr` and `location.hash` in the close effect, and close the menu from the link's own `onClick` so a tap on the current route closes it too. No visual change.
5. **Double navigation** — inspect the Days Out cards and the Gift Finder card list during verification; fix only a confirmed nested-link/handler pair, nothing else.

## Verification

Playwright at 360px and 390px: Days Out — one tap on "Search Christmas activities" lands on the status/results block, not the hero, and repeats consistently; Inspire "Find this near me" behaves the same. Gift Finder preview and Christmas Looks "Start exploring" scroll once, cleanly, target not under the header. Back from an inspiration → its look, look → looks gallery. Mobile menu closes on one tap, including a tap on the current route.

## Not changed

Routes, canonical destinations, Planner HQ cards, database, homepage/header/logo, Days Out search logic, and all planner feature internals.
