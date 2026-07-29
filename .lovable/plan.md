## Plan — Build the "Midnight Luxury Mobile" People & Presents page

You've selected v2. I'll implement that direction faithfully — matching the header, action buttons, stats strip with gold ring, filter pills, three card states (cream / cream + orange corner / gold + red satin ribbon + wax seal), and the fixed bottom summary strip — and make it the single page shown for every gifts entry point.

### 1. Rebuild the People & Presents board (`src/routes/_authenticated/planner.gifts.tsx`)
- Rewrite the `BuyingForPage` component to match the selected v2 prototype exactly:
  - Snowy header with village silhouettes, lamp glow, tree, gold "Christmas" script, "149 SLEEPS UNTIL CHRISTMAS", "Hi Lisa, welcome back" greeting.
  - 2×2 action buttons: gold "Add person"; outlined "Add present", "Find gift ideas", "Find an event".
  - Dark rounded stats strip with 5 stats + circular gold progress ring.
  - Horizontal scroll filter pills: All people / To buy / To wrap / To send / All done (active in gold).
  - Person cards with three visual states driven by real data:
    - **To buy** — cream card, dark initials circle.
    - **To wrap** — cream card, gold initials circle, orange corner flag.
    - **All done** — gold gradient card, red satin ribbon, wax seal with initials.
  - Fixed bottom 4-tile summary strip (Done / To Buy / To Wrap / To Send).
- Preserve existing functionality: Add person modal, Add present modal, per-person expand, live updates, real counts and totals from the database.
- Keep all links/actions working: Find gift ideas → `/gift-finder`; Find an event → `/planner/outings`; tapping a person → `/planner/people/$personId`.

### 2. Make every gift entry point land on this page
- `/planner/people` and `/planner/gifts` already both render `BuyingForPage` — verify still true.
- Update `src/routes/_authenticated/planner.index.tsx` (Planning HQ): replace the current dark doorway "My People & Presents" section with a compact link card that opens `/planner/people`, so HQ stops showing the old dark preview you screenshotted.
- Check `SiteNav`, `save.tsx`, `build.tsx`, `gift-finder.index.tsx`, `gift-finder.secret-santa.tsx` — any "Gifts" or "People & Presents" link points to `/planner/people`.

### 3. Verification
After building, open these routes on mobile and take screenshots:
- `/planner` — HQ no longer shows old dark board; shows a clear entry card.
- `/planner/people` — matches v2 prototype.
- `/planner/gifts` — matches v2 prototype (same component).
- `/gift-finder`, `/save`, `/build` — links to gifts open the v2 page.

I'll report back with the screenshots so you can see the result before spending more credits on further tweaks.

### 4. What I will not do
- No changes to homepage.
- No changes to database schema, auth, or unrelated pages.
- No new design directions.
- No re-adding emoji or informal wording that contradicts the Design Bible.