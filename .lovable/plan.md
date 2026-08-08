# Choose Your Christmas Look

An addition inside the existing Decorations section (`/inspire`). Nothing existing is redesigned: the current Decorations page keeps its hero, its six idea cards and its planner CTA, and gains one new entry point.

## The journey

```text
Decorations (/inspire)
  -> Choose Your Christmas Look (/inspire/looks)
       -> a style card -> Explore this look
            -> The complete look (/inspire/looks/<style>)
                 -> Shop the Look (empty, elegant, ready for real products)
```

## Step 1 — entry point on the existing Decorations page

A single new panel above the existing idea cards:

- Heading: Choose Your Christmas Look
- Text: "Find a Christmas style you love, then discover everything you need to create the look at home."
- Gold button opening the styles gallery

## Step 2 — the styles gallery

A magazine-style grid of the twelve looks: Traditional Red & Gold, Elegant Gold & Champagne, Winter Wonderland, Nordic Christmas, Natural Woodland, Classic Green & Tartan, Candy Cane Christmas, Vintage Christmas, Luxury Christmas, Colourful Family Christmas, A White Christmas, Latest Trends.

Each card: one large premium Christmas photograph, style name in the serif display face, one short line of description, and an "Explore this look" action. Photography is newly generated in the same warm, realistic, candlelit style as the rest of the site — real interiors, no illustration, no clipart, no faces.

## Step 3 — the look page

One page component serves every look, driven by data, so new looks never need new code. It shows:

- a large full-bleed inspirational image of the finished room
- style name and short description
- the colour palette as named swatches
- "Key elements to recreate the look" — a short written list
- the look broken into product categories, showing only the categories that apply to that style, drawn from: Christmas tree, tree decorations, baubles, ribbon & garland, tree topper, lights, stockings, mantel & fireplace, wreath, table decorations, cushions & throws, finishing touches

## Step 4 — Shop the Look

A reusable product-card system sits under each category and at the foot of the page. Because no affiliate partnerships are live, every product area renders an elegant cream-and-gold empty state ("We're curating the pieces for this look — shopping links are coming soon"), never a fake product. The card component and the data behind it are complete, so switching real products on later is a data change only.

Each product supports: image, name, retailer, current price, optional previous price, short description, "View product" button, affiliate URL, affiliate network, sponsored/featured flag, availability flag, and a last-checked date. An affiliate disclosure line is written into the page now but only rendered once a look actually has products with affiliate links.

## Architecture

Looks and products are separate entities joined many-to-many, so one product can appear in several looks and a look can hold many products from many different retailers. Products can be added, removed, replaced, reordered, marked unavailable or featured, and assigned to one or more looks — all as data, with no page rebuild and no retailer hard-coded anywhere.

## Technical notes

Database (new tables, public read of active rows, admin-only writes via the existing `has_role(auth.uid(),'admin')` pattern, with GRANTs):

- `christmas_looks` — slug, name, short_description, long_description, palette (jsonb of {name, hex}), key_elements (text[]), hero_image_url, sort_order, is_active
- `decor_products` — name, retailer, description, image_url, price, previous_price, currency, product_url, affiliate_url, affiliate_network, is_sponsored, is_featured, is_available, last_checked_at
- `look_products` — look_id, product_id, category (text, from the fixed category list), sort_order, unique(look_id, product_id, category)

The twelve looks are seeded in the migration (name, description, palette, key elements, categories); `decor_products` and `look_products` start empty.

Routing: `src/routes/inspire.tsx` becomes a layout rendering `<Outlet />`, with the current page body moved unchanged to `src/routes/inspire.index.tsx`. New `src/routes/inspire.looks.index.tsx` (gallery) and `src/routes/inspire.looks.$slug.tsx` (single look, `notFound()` on an unknown slug), each with its own `head()` metadata and canonical URL.

Data access: a `queryOptions`-based read of active looks for the gallery, and of one look plus its joined products for the detail route, using the public anon-readable policies — loader `ensureQueryData` + `useSuspenseQuery`.

Components (new, under `src/components/looks/`): `LookCard`, `PalettePreview`, `LookCategorySection`, `ProductCard`, `ProductsEmptyState`, `AffiliateDisclosure`. All built from existing design tokens — cream surfaces, gold hairlines, serif headings, existing gold button styles, mobile-first single column at 360/390px.

Assets: twelve new photographs generated into `src/assets/looks/` as WebP-sized images and imported as ES modules; hero image URLs on the seeded rows map to those imports through a small slug→asset lookup so future looks added purely as data can also supply a remote URL.

No changes to the homepage, header, logo, Gifts, Planner or Days Out.
