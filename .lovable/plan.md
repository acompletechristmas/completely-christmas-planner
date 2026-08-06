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

## 3. Permanent position outside the content flow

- Stays `position: fixed`, bottom-right, above all content but below modals.
- Mobile: icon-only circular button (no "Help" text), tucked into the bottom-right corner and offset above the iPhone home-indicator area using the safe-area inset, so it sits in the natural dead space beside the page edge rather than over a card.
- Desktop/tablet: pill with the "How can I help you?" label, in the same corner where page content has generous margin.
- Keeps hiding itself whenever a modal is open (existing behaviour).

## 4. Nothing hidden behind it

To guarantee no card, button or text ever ends up underneath it, the app's scroll container gets a small bottom clearance equal to the button's height plus the safe-area inset. This is bottom padding at the very end of the page only — no section spacing, grid or layout is altered.

## 5. Verification

Checked with a real browser run at 360x800 (common Android), 390x844 (iPhone 14), 414x896 (iPhone Plus) and 430x932 (iPhone Pro Max), on the homepage and every planner page (Planning HQ, Gifts, List, Cards, Outings, Reminders, To-dos, Timeline, Helper, My Christmas, Setup). For each: confirm the last interactive element on the page is fully tappable, no text sits under the button, and the button responds to a single tap.

## Technical notes

- All changes live in `src/components/HelpButton.tsx`; the trigger classes move to a smaller scale with `env(safe-area-inset-bottom)` in the `bottom` offset.
- Bottom clearance is applied once via a global rule in `src/styles.css` targeting the app root, not per page.
