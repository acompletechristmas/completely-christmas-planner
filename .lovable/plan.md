# One Gifts destination: "My Christmas Gifts"

Right now the same board is reachable at two places — "My People & Presents" (`/planner/people`) and the Gifts page (`/planner/gifts`) — both render the identical component. This consolidates everything into "My Christmas Gifts" without touching data, styling or features.

## What changes

1. **One destination.** `/planner/gifts` becomes the single Gifts home. Visiting the old People & Presents address quietly forwards there, so existing bookmarks keep working. Individual person pages (`/planner/people/<id>`) are untouched and keep working exactly as they do now.

2. **Every link points to Gifts.** All navigation, shortcuts, tip cards and CTAs that currently open People & Presents are re-pointed at My Christmas Gifts:
   - Main navigation "Gifts" item
   - Planner hub: "Add person" button, the Tip card, the "Review ideas" link
   - Gift list page: back links and footer CTA
   - Christmas Helper: "add people" link
   - Gift Finder page: tool card and "Open my gift list" CTA
   - Save/budget page CTA
   - Build page suggestion card (renamed to "My Christmas Gifts")
   - Person detail page back link

3. **"View My Gifts" primary action.** A prominent gold action is added at the top of the Gifts area (planner hub Gifts panel), opening the existing full list of all people and gifts. No new page, no duplicated data.

4. **Wording.** Page title and description on the Gifts page change from "People & Presents" to "My Christmas Gifts". The board itself, its sections and person cards stay as they are.

## Unchanged

Routes still resolve, database and hooks untouched, all gift management/editing behaviour identical, and the cream-and-gold premium styling stays exactly as it is.

## Technical notes

- `src/routes/_authenticated/planner.people.tsx` becomes a pathless layout: `beforeLoad` redirects an exact `/planner/people` hit to `/planner/gifts`, and it renders only `<Outlet />` for the `$personId` child. The duplicate `BuyingForPage` render is removed.
- `BuyingForPage` stays exported from `planner.gifts.tsx` as today; only its `head()` copy changes.
- `SiteNav` Gifts entry `to` becomes `/planner/gifts`, keeping the existing `match` array so `/planner/people/...` still highlights.
- The "View My Gifts" action reuses `PlannerButton` (gold gradient, `Gift` icon) placed above the existing four-action grid, linking to `/planner/gifts`.
