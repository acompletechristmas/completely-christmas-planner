# Reposition and shrink the floating Help button

Only `src/components/HelpButton.tsx` changes (plus a small safe-area allowance). No header, logo, layout or spacing changes anywhere else.

## 1. Logo untouched

The "A Complete Christmas" logo in the header keeps its exact size, position, colours, font and spacing. Help stays a separate floating element and is never merged into the header or branding.

## 2. Smaller, icon-only Help button

- Visible size reduced by roughly 40%: tighter padding and a smaller sparkle icon.
- The "Help" / "How can I help you?" text is removed — only the sparkle icon remains inside the gold pill (now a small round gold button).
- Same gold gradient, gold hairline border and fully round shape; softer shadow.
- Accessible name kept via `aria-label` and a title tooltip, so it still reads as "How can I help you?".
- Invisible padding keeps a 44x44 minimum touch target even though the visual button is small.

## 3. Fixed top-right position on every page

- Stays a floating element (fixed), never in the bottom-right corner and never inside the header.
- Sits in the top-right corner of every page, 16px in from the right edge, directly below the header band with at least 24px of clear vertical space below the header so it never crowds the logo or navigation.
- Identical coordinates on every page — the position never depends on page content, scroll position or route, and it never moves dynamically.
- Keeps hiding itself whenever a modal is open (existing behaviour).

## 4. Nothing hidden behind it

Because it is now a small icon-only button tucked into the top-right gutter, it covers far less. Page content that would otherwise sit exactly under it is checked at mobile widths during verification; no layout, spacing, header, logo or navigation changes are made.



## 5. Verification

Checked with a real browser run at 360x800 (common Android), 390x844 (iPhone 14), 414x896 (iPhone Plus) and 430x932 (iPhone Pro Max), on the homepage and every planner page (Planning HQ, Gifts, List, Cards, Outings, Reminders, To-dos, Timeline, Helper, My Christmas, Setup). For each: confirm the Help button sits in the same top-right spot below the header, overlaps nothing important, and responds to a single tap.

## Technical notes

- All changes live in `src/components/HelpButton.tsx`: the trigger becomes a `fixed` icon-only round button at `right: 16px` with a top offset equal to the header height plus 24px (a fixed pixel value, not content-derived), roughly 40% smaller, with invisible padding for the 44x44 target.
- No changes to `src/components/SiteNav.tsx`, the logo markup, navigation, or any page layout.
