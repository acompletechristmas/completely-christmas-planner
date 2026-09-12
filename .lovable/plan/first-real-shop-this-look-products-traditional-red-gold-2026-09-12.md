# First real Shop This Look products — Traditional Red & Gold

Data population only. No schema, route, component, styling or layout changes. One `run_sql` data operation; no migration.

## Current state (verified)

- `decor_products` and `look_products` are both empty — no duplicates can occur.
- Traditional Red & Gold (`id 749bc2ca-…`) has categories: tree, tree-decorations, baubles, ribbon-garland, tree-topper, lights, stockings, mantel, wreath, table.
- The existing `getChristmasLook` query already renders products per category via `ProductCard`; products with no `image_url` show the existing card fallback. `is_essential` exists only on `inspiration_products`, not `look_products` — so no priority system is invented.

## What will be inserted

**12 rows into `decor_products`** — exactly the approved products, with: name, retailer, description (the provided styling note), price (GBP), `product_url` (the provided retailer URL), `is_available = true`, `last_checked_at = now()`. `affiliate_url`, `affiliate_network`, `previous_price`, `image_url` all left null. No images, no SKUs, no invented data.

**12 rows into `look_products`** linking each product to the Traditional Red & Gold look, with a category from the look's existing category list and `sort_order` matching the approved curated order:

| # | Product | Category |
|---|---------|----------|
| 1 | The Range Red & Gold Bauble Garland £22.99 | ribbon-garland |
| 2 | Dunelm 180cm Light-Up Red Bauble Garland £29 | ribbon-garland |
| 3 | Dunelm 55cm Light-Up Red Bauble Wreath £29 | wreath |
| 4 | Dunelm Red Bauble Door Swag £12 | wreath |
| 5 | The Range Beaded Red Bauble £1.59 | baubles |
| 6 | The Range Red & Gold Bauble £0.48 | baubles |
| 7 | M&S Velvet Bow Sleigh Bells 9-pack £15 | tree-decorations |
| 8 | Next Kensington Red Velvet Stocking £21 | stockings |
| 9 | Next Red Velvet Initial Sack £32 | finishing-touches → **stockings** (see note) |
| 10 | Georg Jensen Drum Decoration £49 | tree-decorations |
| 11 | Georg Jensen 3-Piece Gold Set £74 | tree-decorations |
| 12 | Georg Jensen Lyra Star Tree Topper £79 | tree-topper |

Note: `finishing-touches` is not in this look's category list, so the gift sack goes under **stockings** to keep the page consistent (only categories the look declares render sections). Alternative: place it under `mantel`. Flag if you'd prefer otherwise.

`inspiration_products` is not touched — linking these products to individual inspiration scenes can be a later data task.

## Technical notes

- Single `supabase--run_sql` call with 12 `INSERT … RETURNING` into `decor_products`, then 12 inserts into `look_products` referencing the new product ids and look id `749bc2ca-4936-42d6-9974-121f790a1ba3`.
- Product names prefixed with retailer-distinct naming as approved; descriptions use the supplied styling notes verbatim.
- Verification afterwards via `supabase--read_query`: count of 12 products, 12 links for this look, 0 links for other looks, all `affiliate_url` null, all `image_url` null; plus a browser check of `/inspire/looks/traditional-red-gold` showing populated category sections and unchanged `ProductCard` styling.

## Out of scope

No affiliate links, no image sourcing/scraping, no other looks, no UI or schema changes, no Amazon or The White Company products.
