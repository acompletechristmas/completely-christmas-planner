## Fix visible bugs on `/planner/people` so it matches the mockup

The page already has the correct structure (header + 4 action tiles, 6-stat strip with circular %, 5 filter tabs, stationery person cards, coloured footer). Three visible bugs are making it look wrong.

### 1. "Spent" stat renders as "£ £40" (double £)
- Cause: the icon slot passes a `£` span AND the value uses `gbp()` which already prefixes `£`.
- Fix: drop the `£` icon span and let the value carry the currency, or replace the icon with a small `Banknote`/wallet lucide icon and keep `gbp()` for the value.
- Mockup shows just `£420` with SPENT under it — no separate £ icon. Use no icon and `gbp()`.

### 2. Pip labels overlap on mobile (`ADDEDBOUGHTWRAPPEDSENT/GIVEN`)
- Cause: 4-column pip grid + long labels + tight card padding on 390px.
- Fix on the person card:
  - Shorten labels: `Added`, `Bought`, `Wrapped`, `Sent` (drop "/Given").
  - Add `min-w-0` + `truncate` to each pip label wrapper, tighten letter-spacing, and reduce label size to 8px on mobile.
  - Slightly reduce right-side spent block width on mobile so pips get more room.

### 3. Stage visuals don't match mockup for wrapped / all-done
- Wrapped stage (all bought AND all wrapped, not sent) should show a **gold satin ribbon strip** across the right side of the card (as in Caroline's row).
- All-done stage should show the **red wax seal + "For Christmas" corner banner** and the card should switch to gold gradient — currently triggers only when `sentGiven === added`, which is correct, but the ribbon corner also renders under it and clashes with the seal. Ensure the ribbon underlay is only rendered on wrapped-not-done cards.
- Add a small `For Christmas` banner only to all-done cards (already present, keep).

### 4. Small polish to match the mockup exactly
- Filter tabs: match colour of the count number to the pill's tone even when inactive (currently already tone-tinted — verify red/orange/blue/green).
- Status pill "To send" appears when everything is wrapped. Mockup uses this same pill — keep.
- Footer tile counts already sum correctly — keep.

### Out of scope
- No new data model changes, no navigation changes, no other routes touched.
- Not changing Planning HQ. User reaches this page via the People & Presents tile on `/planner` or by URL `/planner/people`.

### Files
- `src/routes/_authenticated/planner.people.index.tsx` — only file touched.
