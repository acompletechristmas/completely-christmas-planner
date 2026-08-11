# Refine the Christmas Look Colour Palette Presentation

## Goal
Replace the generic circular swatch palette on the Christmas Look detail page with a premium, editorial colour strip that feels like a luxury Christmas interiors magazine, while keeping all existing data, routes and functionality intact.

## Scope
Change only these two files unless a technical dependency forces an edit:
- `src/components/looks/PalettePreview.tsx`
- `src/routes/inspire.looks.$slug.index.tsx`

## Current state
- `PalettePreview.tsx` renders a `flex wrap` list of 32px circular swatches plus colour names.
- `inspire.looks.$slug.index.tsx` shows a card titled "The colour palette" with no supporting line.
- The card uses the existing cream card surface (`bg-[color:var(--surface-card)]`, `border-[oklch(0.80_0.14_85_/_0.22)]`, `rounded-2xl`, `p-6`).

## Changes

### 1. `src/components/looks/PalettePreview.tsx`

Replace the component with a single continuous palette strip.

- Render the palette as one horizontal flex strip with `overflow-hidden` and `rounded-xl` (or matching card radius) outer corners.
- Each colour becomes a vertical section of the strip using its existing `hex` value exactly as the background colour.
- Distribute widths evenly: `flex-1` with `min-width` so each colour stays visible on narrow screens.
- Give the strip a subtle gold hairline border (`border-[oklch(0.82_0.14_85_/_0.35)]`) and a soft shadow (`shadow-soft`).
- Below the strip, list colour names in a small, refined serif/sans font (e.g. `text-sm`, `text-[color:var(--muted-foreground)]`) spaced evenly and aligned with their colour section. Allow names to wrap naturally.
- Keep `aria-hidden` purely decorative; ensure the list itself is semantic (`ul`/`li`) with accessible colour names.
- Add minimal hover state: very slight lift on the strip, but nothing distracting.

### 2. `src/routes/inspire.looks.$slug.index.tsx`

Update the palette card heading and supporting copy.

- Replace `The colour palette` with `Colours of the Look`.
- Add a small supporting line immediately below the heading: `The shades that bring this Christmas style together.`
- Use existing typography tokens (`font-display` for the heading, body text for the supporting line).
- Add a restrained decorative flourish beside the heading using the existing visual language: a small inline SVG of a gold branch/star/snowflake (approximately 24px), using `text-[color:var(--gold-soft)]` or similar token. The flourish must be purely decorative, no emojis or clip art, and must not affect layout or heading alignment.

### 3. Card styling refinement

Keep the existing card container and position, but refine the palette card only:
- Ensure the card surface, border, shadow and spacing align with the premium magazine aesthetic already in the design system.
- Use the same cream surface, gold border, soft shadow and generous spacing.
- Do not alter the `Key elements to recreate the look` card size, position or styling.
- Do not change the two-column grid layout.

### 4. Mobile behaviour

At 360px and 390px:
- The palette strip must fit the available width without horizontal scrolling.
- Colour names may wrap onto multiple lines naturally.
- No text may overlap the strip or other content.
- Touch targets and spacing remain comfortable and uncluttered.

## What stays unchanged
- `christmas_looks` table and palette JSON structure.
- Look routes, inspiration gallery, Shop the Look system, products, key elements.
- Homepage, header, logo, Planner, Gifts, Days Out, navigation.
- No database migrations or new pages.

## Verification
- Open `/inspire/looks/traditional-red-gold` (or any existing look) and confirm the palette is a single continuous strip with no circular swatches.
- Confirm the heading reads `Colours of the Look` with the supporting copy.
- Confirm a small gold decorative flourish sits beside the heading.
- Check at 360px and 390px: no horizontal scroll, names wrap cleanly, no overlaps.
- Confirm the `Key elements` card is unchanged.
