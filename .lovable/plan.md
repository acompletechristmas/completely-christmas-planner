# Get Inspired by This Look — many inspirations per Christmas Look

An addition to the existing look pages. Nothing already built is rebuilt, replaced or duplicated.

## 1. What already exists on /inspire/looks/$slug

- `src/routes/inspire.looks.$slug.tsx` — loads one look via `getChristmasLook`, renders `PageShell` with hero image, name, description, then a two-card row (colour palette, key elements), then a "Shop the look" section that maps `look.categories` to `LookCategorySection`, then `AffiliateDisclosure` when any product is affiliate. Route has its own `head()`, `errorComponent` and `notFoundComponent`.
- Data comes from `christmas_looks` (+ `look_products` join to `decor_products`), fetched by `src/lib/decorations/looks.functions.ts` through a public anon client.
- Products currently render as an elegant empty state per category, because no products exist yet.

## 2. Reused unchanged

`christmas_looks` table and its 12 rows, `getChristmasLook` / `listChristmasLooks`, `PageShell`, `PalettePreview`, `LookCard`, the `/inspire/looks` gallery, the slug→image asset map in `src/lib/decorations/looks.ts`, all design tokens.

## 3. Product system reused unchanged

`decor_products` stays the single product catalogue. `look_products`, `ProductCard`, `ProductsEmptyState`, `LookCategorySection` and `AffiliateDisclosure` are reused as-is. No second product table, no second Shop the Look system.

## 4. Minimum new data structure

One new table `look_inspirations`:

- `look_id` (references `christmas_looks`), `slug` (unique per look), `title`, `description` (optional), `styling_tip` (optional), `category` (free text from the existing inspiration category vocabulary), `image_url`, `sort_order`, `is_active`.

Public read of active rows; admin-only writes via the existing `has_role(auth.uid(),'admin')` pattern; GRANTs as usual. Adding more inspirations later is a data insert only.

## 5. Minimum join for products

One new join table `inspiration_products`: `inspiration_id`, `product_id` (existing `decor_products`), `category`, `sort_order`, unique(`inspiration_id`, `product_id`, `category`).

This gives: Look → many Inspirations, Inspiration → many Products, Product → many Inspirations, Product → many Looks (through the existing `look_products`). One product record is never duplicated.

## 6. The individual inspiration view

A new nested route is genuinely needed so each inspiration is shareable, indexable and has its own metadata:

```text
/inspire/looks/<look-slug>                     existing look page (+ new section)
/inspire/looks/<look-slug>/<inspiration-slug>  new inspiration detail
```

The look page becomes a layout that renders `<Outlet />`, its current body moves unchanged to a sibling index leaf, and the detail leaf is new. The detail page shows the large image, title, description, styling tip, a link back to the parent look ("More <look name> inspiration"), and a "Shop this look" section grouped by the categories present on that inspiration — with the empty state text "We're finding the perfect pieces to recreate this look — shopping links are coming soon."

## 7. Where the new section appears

On the existing look page, between "Key elements" and the existing "Shop the look" section: a band titled **Get Inspired by This Look**, one short line of intro, then the inspiration grid. Everything already on the page stays exactly where it is.

## 8. Mobile

Single column at 360/390px, promoting to two and three columns at `sm:`/`lg:`. Feature/supporting mix comes from a CSS grid span on the first card at `sm:` and above only, so mobile stays a clean stack. Every card is a `Link` with a 44px minimum tap target, `min-w-0` on text containers, images `loading="lazy"` with fixed aspect ratios to avoid layout shift, and no fixed-width elements — no horizontal scroll.

## 9. Files added or changed

Added:
- `src/routes/inspire.looks.$slug.index.tsx` (current look-page body, moved unchanged)
- `src/routes/inspire.looks.$slug.$inspiration.tsx` (inspiration detail)
- `src/components/looks/InspirationCard.tsx`
- `src/components/looks/InspirationGallery.tsx`
- `src/lib/decorations/inspirations.ts` (types, category labels, local image map)
- `src/lib/decorations/inspirations.functions.ts` (`listLookInspirations`, `getLookInspiration`)

Changed:
- `src/routes/inspire.looks.$slug.tsx` → becomes a layout rendering `<Outlet />`
- `src/lib/decorations/looks.functions.ts` → only if the look query needs the inspiration count (otherwise untouched)

No other file is touched.

## 10. Database changes

One migration adding `look_inspirations` and `inspiration_products` with GRANTs, RLS and public-read/admin-write policies. No existing table is altered. Seed rows for the first look's inspirations use existing project photography plus newly generated realistic, style-matched Christmas photography — no fake products, retailers, prices or affiliate links are ever inserted.

## 11. Confirmation — single product catalogue

`decor_products` remains the one and only product catalogue. Nothing else stores products.

## 12. Confirmation — no duplication

No Christmas Look, route, page, component or Shop the Look system is duplicated or recreated. The existing look page content is moved into an index leaf byte-for-byte, not rewritten.

## 13. Smallest safe first implementation

1. Migration for the two new tables.
2. Data layer + two new components + the route split.
3. Seed a real set of inspirations for **one** look (Traditional Red & Gold) so the full journey is provable end to end: gallery → look → inspiration → "Shop this look" empty state.
4. Every other look renders the section only when it has inspirations, so nothing looks unfinished.

Adding the remaining looks' inspirations afterwards is pure data.
