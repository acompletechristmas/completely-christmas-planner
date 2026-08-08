import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { ChristmasLook, LookProduct, PaletteColour } from "./looks";

function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

type LookRow = Database["public"]["Tables"]["christmas_looks"]["Row"];

function toLook(row: LookRow): ChristmasLook {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    palette: (Array.isArray(row.palette) ? row.palette : []) as unknown as PaletteColour[],
    keyElements: row.key_elements ?? [],
    categories: row.categories ?? [],
    heroImageUrl: row.hero_image_url,
  };
}

export const listChristmasLooks = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("christmas_looks")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return { looks: (data ?? []).map(toLook) };
});

export const getChristmasLook = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const client = publicClient();
    const { data: row, error } = await client
      .from("christmas_looks")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw error;
    if (!row) return { look: null, products: [] as LookProduct[] };

    const { data: joins, error: joinError } = await client
      .from("look_products")
      .select(
        "id, category, sort_order, decor_products(id, name, retailer, description, image_url, price, previous_price, currency, product_url, affiliate_url, affiliate_network, is_sponsored, is_featured, is_available, last_checked_at)",
      )
      .eq("look_id", row.id)
      .order("sort_order", { ascending: true });
    if (joinError) throw joinError;

    const products: LookProduct[] = (joins ?? [])
      .map((join) => {
        const p = join.decor_products;
        if (!p || !p.is_available) return null;
        return {
          id: join.id,
          category: join.category,
          name: p.name,
          retailer: p.retailer,
          description: p.description,
          imageUrl: p.image_url,
          price: p.price,
          previousPrice: p.previous_price,
          currency: p.currency,
          url: p.affiliate_url ?? p.product_url,
          isAffiliate: Boolean(p.affiliate_url),
          isSponsored: p.is_sponsored,
          isFeatured: p.is_featured,
          lastCheckedAt: p.last_checked_at,
        } satisfies LookProduct;
      })
      .filter((p): p is LookProduct => p !== null);

    return { look: toLook(row), products };
  });
