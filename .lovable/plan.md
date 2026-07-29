## Goal
Make the homepage match the approved image only. No new interpretation, no alternative design, no extra polish.

## Important constraint
A true exact visual match is only possible if the approved mockup image is used as the visual source. Rebuilding it from code and regenerated artwork can only approximate it, which is the problem you are rightly calling out.

## Plan

### 1. Lock the approved image as the reference
- Use `file_000000002e5c81f493ba94d0862b135d.png` as the single approved target.
- Ignore the current generated hero direction if it differs from that image.
- Treat the approved image as the source of truth for:
  - Snowy village atmosphere
  - Large lit Christmas tree as the main focal point
  - Lantern on the right
  - Small side countdown gift tag
  - Hero proportions
  - Planner section height and position

### 2. Restore the approved composition
- Rework only the homepage hero layout so it follows the approved image:
  - Tree dominates the right side.
  - Village buildings glow behind the tree.
  - Lantern sits on the right edge.
  - Text sits on the left.
  - Countdown gift tag is smaller and lower-left/side, not the main feature.
  - Button sits below the tag.
  - Cream planner section starts within the first viewport.

### 3. Stop using speculative redesigns
- Do not redesign the header, cards, planner section, fonts, wording, or theme beyond what is necessary to match the approved image.
- Do not create a different Christmas scene.
- Do not enlarge or centre the countdown tag.
- Do not move the main visual focus away from the tree.

### 4. Asset approach
- Best match: use the approved mockup as the fixed visual reference while adjusting the real page to match it.
- If the current `hero-village.jpg` cannot visually match the approved tree/village/lantern composition, replace it once with a new asset explicitly based on the approved image composition — not a new interpretation.
- No repeated regeneration loops.

### 5. Verification before claiming complete
- Capture screenshots at:
  - Mobile: 390×844
  - Desktop: 1280×800
- Compare against the approved image before saying it is done.
- The fix is only complete if:
  - The tree is clearly the main hero subject.
  - The countdown tag is visibly smaller and off to the side.
  - The snowy village and lantern are present.
  - The first viewport composition matches the approved mockup.

## Out of scope
- No new pages.
- No navigation restructure.
- No planner functionality changes.
- No extra homepage sections.
- No experimental style changes.