You’re right — this should have been done the first time.

The mistake was that I rebuilt the approved design on the `/planner/people` route, but I did not update all the places labelled “People & Presents”, “Gifts”, or “Presents” to send you there. So you were still being taken to older screens like `/planner` and `/planner/gifts`, which made it look like the approved picture had not been applied.

## Plan

1. **Make People & Presents the main presents page**
   - Update the global navigation “Gifts” link so it opens `/planner/people`.
   - Update Planning HQ’s People & Presents buttons/cards so they open `/planner/people`.
   - Update any “View gifts”, “Add person”, “Add present”, or presents entry links that currently send users to the wrong older view.

2. **Keep the existing gift editor, but make it secondary**
   - `/planner/gifts` will remain available for the detailed editing controls.
   - Add a clear route from the approved People & Presents page into the detailed gift editor only when needed.

3. **Remove the visual confusion on Planning HQ**
   - Replace or simplify the older People & Presents preview on `/planner` so it no longer looks like a separate, outdated version of the page.
   - Make it act as a doorway into the approved People & Presents experience.

4. **Verify the real user paths**
   - Check that pressing “People & Presents”, “Gifts”, and presents-related links consistently lands on the approved picture-style page.
   - Check mobile layout so the page is visibly the approved People & Presents design.

## Technical details

- I’ll edit the existing route/link files only: `SiteNav`, `planner.index`, and the top navigation/actions around `planner.gifts` if needed.
- I won’t change the database, gift statuses, or existing planner functionality.