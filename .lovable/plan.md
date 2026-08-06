# Reposition and shrink the floating Help button

Only `src/components/HelpButton.tsx` changes (plus a small safe-area allowance). No header, logo, layout or spacing changes anywhere else.

## 1. Logo untouched

The "A Complete Christmas" logo in the header keeps its exact size, position, colours, font and spacing. Help stays a separate floating element and is never merged into the header or branding.

## 2. Smaller, lighter Help button

- About 25% smaller overall: reduced padding and a smaller sparkle icon, label text one step down.
- Same gold gradient, gold hairline border and fully rounded pill shape.
- Softer shadow so it reads as a quiet helper, not a primary CTA.
- Slight transparency at rest that becomes fully solid on hover/tap, so anything briefly behind it is still legible.
- Tap area stays comfortable (44x44 minimum) even though the visual pill is smaller, using invisible padding rather than extra visible size.

## 3. Permanent position in the header

- The "A Complete Christmas" logo stays exactly where it is — same size, colours and spacing.
- Help remains a separate floating element (fixed, not part of the logo), pinned to the top-right area of the header so it sits horizontally alongside the logo.
- At least a 16px clear gap between the logo and the Help button, on every width, so they never touch or appear connected.
- It sits inside the header height and never overlaps the logo, the Login link or the hamburger menu — it takes its place in the right-hand control group's rhythm.
- Stays fixed in that position across the whole site while scrolling, so it can never cover page content.
- Keeps hiding itself whenever a modal is open (existing behaviour).

## 4. Nothing hidden behind it

Because the button now lives in the header band rather than over the page, no card, button or text can end up underneath it. On the narrowest phones the pill collapses to the sparkle icon plus a shorter label if needed to preserve the 16px gap and avoid crowding the menu button.


## 5. Verification

Checked with a real browser run at 360x800 (common Android), 390x844 (iPhone 14), 414x896 (iPhone Plus) and 430x932 (iPhone Pro Max), on the homepage and every planner page (Planning HQ, Gifts, List, Cards, Outings, Reminders, To-dos, Timeline, Helper, My Christmas, Setup). For each: confirm the Help button sits in the header with a 16px+ gap from the logo, overlaps nothing, no page text is hidden behind it, and it responds to a single tap.

## Technical notes

- All changes live in `src/components/HelpButton.tsx`: the trigger becomes a `fixed` top-right element aligned to the header band (matching `SiteNav`'s `max-w-7xl` / `px-5 sm:px-8` gutters and vertical centre), offset left of the Login/Menu controls, with a smaller pill scale and invisible padding for the 44x44 target.
- No changes to `src/components/SiteNav.tsx`, the logo markup, or any page layout.
