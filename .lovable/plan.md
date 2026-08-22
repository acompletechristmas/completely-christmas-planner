# Targeted navigation fixes (from the approved audit)

Scope-limited to the six items below. Nothing else changes: My Christmas Home stays on `/planner/my`, and `/planner/list`, `/planner/helper`, `/planner/timeline` are untouched. No database, styling or feature-internal changes.

## 1. `/save` — Start my budget
`src/routes/save.tsx` line 43: change the CTA destination from `/planner/gifts` to `/planner/setup`. Label and styling unchanged.

## 2 & 3. Planner HQ — remove wrong "Coming soon" badges
`src/routes/_authenticated/planner.index.tsx`, in the `SECTIONS` array: add `live: true` to the `cards` entry and the `traditions` entry. Both already link to `/planner/cards` and `/planner/traditions`; the badge is driven purely by that flag, so they will read "Open". No other section changes.

## 4. `/food` — specific planner CTA
`src/routes/food.tsx` line 43: change `Open my planner → /planner` to `Open my Christmas Food → /planner/food`, reusing the existing `GoldCTA`.

## 5. `/entertainment` — add Watchlist CTA
`src/routes/entertainment.tsx`: add one `GoldCTA` — `Open my Christmas Watchlist → /planner/watchlist` (film icon) — above the existing music CTA. The existing `Plan my Christmas music → /planner/music` stays exactly as is. The page remains editorial.

## 6. `/gift-finder` — make the unfinished section honest
`src/routes/gift-finder.index.tsx`:
- Replace the handler-less "Conjure ideas" `<button>` with a non-interactive, visibly disabled element reading `Gift idea helper — coming soon`, keeping the existing gold visual language (reduced opacity, `cursor-not-allowed`, `aria-disabled`). The placeholder text input beside it becomes `disabled` so the block reads as a preview rather than a form.
- Keep the "Preview Gift Finder" card scrolling to `#ai-gift-finder`; that target section already shows the `Coming soon` badge, so its label stays accurate. No new functionality, no AI calls.

## Verification
Build/typecheck, then check in the preview: `/save` CTA → `/planner/setup`; Planner HQ Cards and Traditions show "Open"; `/food` CTA → `/planner/food`; `/entertainment` shows both watchlist and music CTAs; the Gift Finder button is no longer clickable-but-dead; My Christmas Home still points to `/planner/my`.

Files changed: `src/routes/save.tsx`, `src/routes/food.tsx`, `src/routes/entertainment.tsx`, `src/routes/_authenticated/planner.index.tsx`, `src/routes/gift-finder.index.tsx`.
