# Christmas Days Out — Discovery Structure (Plan Only)

Rename the page to **Christmas Days Out** (page title, eyebrow, meta/SEO and any in-page heading references), and turn the static "Coming Soon" cards on `/days-out` into a proper discovery framework: browsable categories, curated collections and filter scaffolding, with placeholder content instead of live data. "Near me" becomes a future search/filter, not the page title. No APIs, no postcode search, no maps, no booking, no saving yet.

## Proposed user journey

1. Arrive on Christmas Days Out — heading, short warm intro, and a single clear next step.
2. Choose a starting point: browse by **what kind of day out** (grottos, markets, light trails, panto, afternoon teas, festive stays) or by **what suits us** (free, budget, splash out, toddlers, teens, adults only, dogs, evenings, weekends, indoor, outdoor).
3. Filter pills refine the list on the page — no page change, no reload feel.
4. Results appear as experience cards showing name, type, price band, who it suits, indoor/outdoor and a short line of description. Placeholder/example entries make the shape obvious.
5. Curated collections ("Free festive magic", "Under £20 family days", "Worth splashing out on", "Grown-ups only evenings", "Best rated Christmas experiences") give a shortcut for people who don't want to filter.
6. Each card leaves a clear space for a future **Save to my Christmas Days Out** action, a future "near me" distance line, and a future recommendation badge.

## Page structure (top to bottom)

1. **Header** — eyebrow and title renamed to Christmas Days Out; intro reworded only where it names the old title. Keep the postcode field as a "notify me" placeholder, relabelled so it reads as future-facing, not broken.
2. **Filter bar** — horizontally scrollable pill groups on mobile:
   - Price: Free · Budget · Mid · Splash out
   - Who: Toddlers · Children · Teens · Adults only · Dogs
   - When: Daytime · Evening · Weekend
   - Where: Indoor · Outdoor
   Multi-select, with a visible "Clear filters" when any are active. Filters run against local placeholder data.
3. **Category strip** — the six existing experience types as compact chips/cards; selecting one acts as another filter rather than navigating away.
4. **Curated collections** — 5 horizontally scrollable rows of experience cards, including **Best Rated Christmas Experiences** (placeholder, ordered by a `rating` field on the placeholder data; same card layout and behaviour as the other rows).
5. **All experiences** — filtered grid of experience cards with a count line ("12 festive ideas") and a warm empty state when filters match nothing.
6. **Closing CTA** — existing reminders CTA, unchanged.

## Reusable components (new, under `src/components/days-out/`)

- `ExperienceCard` — Snow White card, gold border, title, type, price band, tags, short body. Includes a reserved, currently-empty **recommendation slot** directly under the title (fixed minimum height so nothing shifts later) for future badges such as "AI Pick" or "Perfect for young children", plus a reserved footer slot for the future save action and distance label. Optional `badge`/`recommendation` props exist but are unused for now.
- `FilterPills` — generic labelled pill group, multi-select, keyboard focusable, horizontal scroll on mobile.
- `CollectionRow` — titled row with a short subtitle and a scroll-snap list of `ExperienceCard`s.
- `ExperienceEmptyState` — festive encouraging message plus "Clear filters".
- `experience-data.ts` — typed placeholder catalogue (`id, name, type, priceBand, audiences, setting, timeOfDay, rating, blurb`) so a future data source can replace it without touching UI.
- `use-experience-filters.ts` — filter state + derived filtered list; the single seam a future API swaps into.

## Files affected

- `src/routes/days-out.tsx` — rename (title, eyebrow, meta/og/canonical text) and restructured content; palette, typography and page shell unchanged.
- `src/components/SiteNav.tsx` / `SiteFooter.tsx` / homepage tile label — text-only rename where "Christmas Magic Near Me" appears, so naming stays consistent. No layout or styling change.
- New: `src/components/days-out/ExperienceCard.tsx`, `FilterPills.tsx`, `CollectionRow.tsx`, `ExperienceEmptyState.tsx`
- New: `src/lib/days-out/experience-data.ts`, `src/hooks/use-experience-filters.ts`
- Nothing else touched — no homepage redesign, colour, typography or styling changes.

## Mobile considerations

- Designed at 360/390px first; no horizontal page scroll — only intentional scroll-snap rows.
- Filter pills scroll horizontally with fade edge; tap targets at least 44px tall.
- Cards single-column on mobile, two up at sm, three at lg.
- Collection rows use snap points so cards land cleanly; the next card peeks to signal scrollability.
- Sticky filter bar avoided on mobile to preserve vertical space; a compact "filters active" count sits above the grid instead.

## Design Bible compliance

Midnight blue background, Snow White cards with thin champagne gold borders and faint embossed snowflake, serif titles, sans body, line icons only, one subtle sparkle moment on the collections heading. Price bands and audience shown as text plus icon, never colour alone.

## Testing checklist

- Page renders at 360px, 390px and desktop with no horizontal scroll.
- Each filter group multi-selects, combines across groups, and clears correctly.
- Selecting a category chip filters the same list as the pills.
- Result count updates and matches visible cards.
- Empty state appears when no experience matches, and "Clear filters" restores the full list.
- Collection rows scroll and snap on touch; keyboard tab order remains sensible.
- Cards keep equal height with long and short titles; no clipped text.
- Contrast checked on gold-on-navy and body text.
- No console errors; existing reminders CTA and nav still work.
