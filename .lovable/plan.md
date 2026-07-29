## Plan

I will fix this as one controlled correction, not another redesign.

### 1. Make one approved People & Presents experience
- Treat the approved picture as the only source for the Gifts / People & Presents screen.
- Replace the current dark “Gift editor” feel with the approved structure:
  - snowy premium header
  - gold action buttons
  - dark summary stats strip with circular progress
  - five filter pills
  - luxury white/champagne person cards
  - red satin ribbon and wax seal states
  - four-tile status summary footer
- Remove wording that makes it feel like a secondary editor or “dark picture”.

### 2. Put the same experience everywhere gifts are accessed
- `/planner/people` will show the approved People & Presents page.
- `/planner/gifts` will also show that same approved People & Presents page, so “Gifts” never opens a different old-looking screen.
- Planning HQ gift links will open the approved page.
- Main navigation “Gifts” will open the approved page.
- Gift Finder / Secret Santa / Budget / Build links that currently point at the old gift editor will point to the approved page.

### 3. Keep gift actions practical on the approved page
- “Add person” opens the add-person modal on the approved page.
- “Add present” opens the add-present flow from the approved page, not a separate dark editor first.
- “Find gift ideas” and “Secret Santa” remain available as clear buttons from the top action area.
- Person cards continue linking to that person’s detailed gift page when someone wants deeper editing.

### 4. Match the approved visual more faithfully
- Change the top area away from a plain dark card into a snowy, premium planner header like the mockup.
- Make person cards read as luxury stationery: warm white by default, champagne gold when bought, red satin ribbon when wrapped, wax seal when complete.
- Make the page feel like a Christmas planner board, not admin software.
- Follow the Design Bible exactly: midnight blue background, snow-white cards, champagne gold, red only for ribbons/seals, elegant line icons.

### 5. Verify the real paths
After implementation I will check these routes:
- `/planner/people`
- `/planner/gifts`
- `/planner`
- `/gift-finder`
- `/save`

Success means every gifts/presents entry point visibly lands on the approved People & Presents experience, not the old dark editor or a generic dark card.