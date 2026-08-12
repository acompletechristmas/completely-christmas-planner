# Make Shop This Look ready for real products

Preparation only. No products, retailers, prices or links are created. Nothing existing is rebuilt.

## 1. How Shop This Look works today on an inspiration page

`src/routes/inspire.looks.$slug.$inspiration.tsx` loads `getLookInspiration` (in `src/lib/decorations/inspirations.functions.ts`), which resolves the look by slug, the inspiration by slug, then reads `inspiration_products` joined to `decor_products`. Rows whose product is unavailable are dropped. The page derives the distinct set of categories from the returned products and renders one `LookCategorySection` per category; each renders `ProductCard`s or `ProductsEmptyState`. With no rows, the page shows the single elegant empty state: "We're finding the perfect pieces to recreate this look — shopping links are coming soon." `AffiliateDisclosure` renders only when a product has an affiliate URL.

## 2. Fields currently in `decor_products`

id, name, retailer, description, image_url, price, previous_price, currency (default GBP), product_url, affiliate_url, affiliate_network, is_sponsored, is_featured, is_available, last_checked_at, created_at, updated_at.

## 3. Fields currently in `inspiration_products`

id, inspiration_id, product_id, category, sort_order, created_at. No quantity or styling information exists yet.

## 4. Reused unchanged

`ProductCard`, `ProductsEmptyState`, `LookCategorySection`, `AffiliateDisclosure`, `InspirationCard`, `InspirationGallery`, `PalettePreview`, `PageShell`, all look/inspiration routes and data, `decor_products`, `look_products`, `look_inspirations`, `christmas_looks`.

## 5. Minimum new fields on `inspiration_products`

- `quantity` integer, nullable
- `quantity_max` integer, nullable (gives a range with `quantity`)
- `quantity_unit` text, nullable (e.g. metres, boxes — free text, no fixed list)
- `size_note` text, nullable
- `colour_finish` text, nullable
- `styling_note` text, nullable
- `is_essential` boolean, not null, default true

`sort_order` already exists and is reused. Nothing is added to `decor_products` — all of this describes the product's role inside one photograph, so it belongs on the relationship.

## 6. Any other database change?

No new tables. Only the column additions above, plus an `updated_at` column and its existing trigger on `inspiration_products` so edits to quantities and notes are traceable. `look_products` is untouched.

## 7. How "What You'll Need to Recreate This Look" avoids duplicate data

It reads the same `inspiration_products` rows already fetched for Shop This Look — one query, one array in memory. The checklist renders the relationship fields (quantity/range/unit, size, colour or finish, essential vs optional, styling note) with the product's name; the cards below render the commercial detail. No second query, no second data source, no copy of product data.

## 8. Replacing an unavailable product

Availability lives on `decor_products` (`is_available`, `last_checked_at`); the link lives on `inspiration_products`. To swap a product, point the existing relationship row at a new `product_id` (or add a new row and remove the old one). The inspiration row, its image, title, description and styling tip are never touched. The recreate guidance stays with the relationship, so quantities and notes survive a product swap.

## 9. Retailer URLs and affiliate URLs together

Unchanged from today: the data layer resolves `affiliate_url ?? product_url` and flags `isAffiliate` when an affiliate URL exists. A product with only a plain retailer URL still shows and still links out. Affiliate status never gates whether a product appears; `AffiliateDisclosure` continues to appear only when at least one affiliate link is on the page. `retailer` is free text, so any UK retailer works with no code change.

## 10. Files and migrations that change

Migration (one):
- add the seven columns + `updated_at` and trigger to `inspiration_products`

Code:
- `src/lib/decorations/inspirations.ts` — extend the `InspirationProduct` shape with the recreate fields; add a small helper that formats a quantity/range/unit into readable text
- `src/lib/decorations/inspirations.functions.ts` — select and map the new columns; order by `sort_order`
- `src/components/looks/RecreateChecklist.tsx` — new, the "What You'll Need to Recreate This Look" list (renders nothing when there are no rows)
- `src/routes/inspire.looks.$slug.$inspiration.tsx` — render the checklist directly above the existing Shop This Look product sections; existing empty state and layout otherwise unchanged

Not touched: the gallery, the look page, the 12 looks, inspiration images, homepage, header, Gifts, Planner, Days Out, navigation.

## 11. Confirmation — single catalogue

`decor_products` remains the one and only product catalogue.

## 12. Confirmation — no fake data

No products, retailers, prices, URLs, affiliate links or placeholder cards will be created. The examples in the brief are illustrative only and will not be inserted.

## 13. Confirmation — extend, not rebuild

The existing inspiration and Shop This Look architecture is extended in place. Nothing is recreated, duplicated or replaced.

## 14. Smallest safe implementation

1. Run the single migration extending `inspiration_products`.
2. Extend the data layer to carry the new fields.
3. Add `RecreateChecklist` and render it above the existing product sections on the inspiration page.
4. Leave every Traditional Red & Gold inspiration (e.g. the tree scene) with zero product rows, so the page still shows the existing empty state — but the moment a genuine retailer product is inserted into `decor_products` and linked with a quantity and styling note, both the checklist and the product cards appear with no further code change.

## Mobile

The checklist is a single-column stack at 360/390px: product name on one line, quantity line beneath, styling note in muted text, an "Optional" tag where relevant. No table layout, no fixed widths, no horizontal scroll; cream surfaces, gold rules, serif headings from the existing system.
