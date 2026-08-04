# Planner: match the attached mock-up

Styling only. No route, data, functionality, navigation or component-hierarchy changes.

## 1. Hero

Replace the current planner hero (the built-from-CSS snowy village strip with the triangle tree, lamp, house silhouettes and the dark navy panel beneath it) with a single full-bleed premium Christmas living-room photograph, as in the mock-up.

- New generated photograph, roughly 30% brighter than the current hero: cream furnishings, glowing tree, fireplace, wrapped presents, soft daylight through snowy windows, warm golden fairy lights. Elegant and inviting, not dramatic — no heavy navy shadows.
- Photo fills the whole hero; a soft cream gradient rises from the left/bottom behind the welcome text so it reads cleanly, as shown. Overlay stays cream-warm, never navy.
- All decorative CSS objects (tree, village, lamp glow) are deleted.


## 2. Countdown capsule

Cream pill, thin gold border, gold uppercase letter-spaced type, small gold snowflake either side, floating over the photo at the top. No dark panel behind it.

## 3. Welcome typography

- "Hi Lisa," — large elegant serif in deep navy ink.
- "welcome back" — gold handwritten script beneath it, larger, italic.
- Supporting line in warm grey sans beneath. Same hierarchy as the mock-up.

## 4. Gifts panel

The "My People & Presents" block becomes a warm cream panel, keeping the app's personal tone:

- Small gold uppercase label with a gold gift line icon: GIFTS & PEOPLE
- Large elegant serif heading in navy ink: My Christmas Gifts (consistent with My Christmas Plans / My Christmas Home)
- Two-line supporting sentence in warm grey
- Decorative gold line-art foliage flourish top-right, as shown


No heavy white headings.

## 5. Action buttons

Four equal large rounded rectangles, two per row: soft gold gradient fill, subtle shadow, dark text, left icon, right chevron.

- Add person → /planner/people
- Add present → /planner/people
- Find gift ideas → /gift-finder
- Secret Santa → the existing Secret Santa route (shortcut only; stays separate from the People list)

"Add an activity" is removed from this block. Existing mini-stats, the "Open the full board" row and the ideas line stay, restyled onto cream.

## 6. Shared gold button

The gold button becomes a shared planner component (`PlannerButton`) used by every primary action across every planner page. All dark outlined / navy primary buttons in the planner are replaced by it, so there is one consistent premium gold primary style. Secondary and destructive controls stay quiet text or subtle gold-hairline links.


## 7. Warm palette across the planner

Planner surfaces move off almost-black: warm cream page background, warm white cards, soft gold borders and accents, evergreen and deep navy reserved for text and contrast. The existing snowfall and gold glow are retuned so they read on a light background. Photographic feature cards keep their images; their veil is lightened so cards feel warm rather than dark.

## Technical notes

- `src/routes/_authenticated/planner.index.tsx`: hero block replaced; SECTIONS data untouched.
- `src/routes/_authenticated/planner.tsx`: layout background/glow retuned; greeting hero uses the new photo.
- `src/styles.css`: light planner surface tokens added (`--planner-bg`, `--planner-card`, ink-on-cream foreground) — global dark tokens for marketing pages left intact.
- New `src/components/planner/PlannerButton.tsx`; adopted across planner routes.
- New assets: cream Christmas living-room hero photo, gold foliage flourish (line-art SVG, inline).

## 8. Atmosphere and final check

The planner should read as John Lewis / Fortnum & Mason / The White Company Christmas: warm cream backgrounds, soft gold accents, elegant typography, bright premium photography.

Before finishing, the built page is captured at mobile width and compared side by side with the mock-up; spacing, type scale, button size and photo brightness are refined until it matches closely rather than reinterpreting it.
