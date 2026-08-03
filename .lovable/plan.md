# Refine the three homepage links (no layout change)

Only the three existing links — Plan, Inspire, Share & Play — get more magical. Nothing else on the homepage moves.

## What changes

- The three pill buttons become icon-led links: a small circular Christmas icon above the title, with a soft champagne-gold glow behind it.
- Thin gold hairline dividers (fading out at top and bottom) sit between the three items.
- Titles keep the existing display serif in the current deep red, uppercase with the same letter-spacing.
- The heavy pill background/border is dropped so the items sit lightly on the surface with no boxed feel; the row still reads as three tappable links with a gentle lift on hover/press.
- Icons: a wrapped gift (Plan), a star/sparkle (Inspire), and a bauble-and-music motif (Share & Play), drawn as thin gold line icons at ~20px inside ~40px circles.

## What does not change

Hero image, snowfall, countdown card, CTA button and the space above it, the "Your Complete Christmas Planner" heading and its ornament divider, the sentence below the links, the cream section itself, navigation, logo, colours, typography and all routing (/planner, /inspire, /entertainment).

## Height

The row keeps its current height: the icon circle plus title occupies the same vertical space the current pill row plus its margin uses, so the homepage height is unchanged and the row still fits on one line at 390px.

## Technical notes

- Edit `src/routes/index.tsx` only, replacing the pill markup inside the existing `<nav>` with a small local `HomeLink` component (icon circle + label), still using TanStack `Link`.
- Icons from `lucide-react` (`Gift`, `Sparkles`, `Music`), stroked in the gold token — no new assets, no new dependencies.
- Glow via a blurred radial gold layer behind the circle using existing gold tokens; dividers via a 1px gradient span, matching the gold hairlines already used on the page.
- Verify at 390px that the row does not wrap and the page height matches the current build.
