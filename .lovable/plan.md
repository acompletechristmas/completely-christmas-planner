## What's broken

On the homepage the "Let's start Christmas" button can't be clicked. The cream Planner section is painted on top of it, and the countdown gift-tag also sits over the button's area. Nothing else on the page is broken — this is purely a stacking/position bug in the hero.

## Fix (one file, no design changes)

Edit only `src/routes/index.tsx`, hero section:

1. Move the CTA up inside the hero so it sits directly under the intro copy — change the huge `mt-[18.5rem] sm:mt-[23rem] lg:mt-[7rem]` on the CTA wrapper to `mt-6 sm:mt-8`.
2. Wrap the CTA `<Link>` in a `relative z-30` container so it always sits above the tag and the cream section's curved lip.
3. Reposition the countdown gift-tag to the lower-right of the hero (`right-4 bottom-10 sm:right-10 sm:bottom-14 lg:right-[7%] lg:bottom-16`) with the same slight rotation — matches the approved mockup's "tag to the side" composition and clears the CTA.
4. Add `pointer-events-none` to the vignette overlay div so no invisible layer catches clicks.

No changes to: hero image, copy, fonts, colours, planner cards, cream section, or any other page.

## Verification before I hand back

- Playwright at 390×844 and 1280×800: screenshot the hero and confirm CTA, tag, and planner cards are all visible with no overlap.
- `elementFromPoint` at the CTA centre must return the `<a class="btn-luxury">`.
- Click the CTA and confirm it navigates to `/build`.

I will not touch anything else, and I won't regenerate any images.