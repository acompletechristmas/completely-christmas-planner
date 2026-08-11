import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { LookInspiration } from "./inspirations";
import type { LookProduct } from "./looks";

function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

type InspirationRow = Database["public"]["Tables"]["look_inspirations"]["Row"];

function toInspiration(row: InspirationRow): LookInspiration {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    stylingTip: row.styling_tip,
    category: row.category,
    imageUrl: row.image_url,
  };
}

const PRODUCT_COLUMNS =
  "id, name, retailer, description, image_url, price, previous_price, currency, product_url, affiliate_url, affiliate_network, is_sponsored, is_featured, is_available, last_checked_at";

export const listLookInspirations = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ lookSlug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const client = publicClient();
    const { data: look, error: lookError } = await client
      .from("christmas_looks")
      .select("id")
      .eq("slug", data.lookSlug)
      .eq("is_active", true)
      .maybeSingle();
    if (lookError) throw lookError;
    if (!look) return { inspirations: [] as LookInspiration[] };

    const { data: rows, error } = await client
      .from("look_inspirations")
      .select("*")
      .eq("look_id", look.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return { inspirations: (rows ?? []).map(toInspiration) };
  });

export const getLookInspiration = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({ lookSlug: z.string().min(1).max(120), slug: z.string().min(1).max(120) })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const client = publicClient();
    const { data: look, error: lookError } = await client
      .from("christmas_looks")
      .select("id, slug, name, short_description")
      .eq("slug", data.lookSlug)
      .eq("is_active", true)
      .maybeSingle();
    if (lookError) throw lookError;
    if (!look) return { look: null, inspiration: null, products: [] as LookProduct[] };

    const { data: row, error } = await client
      .from("look_inspirations")
      .select("*")
      .eq("look_id", look.id)
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw error;
    if (!row) return { look: null, inspiration: null, products: [] as LookProduct[] };

    const { data: joins, error: joinError } = await client
      .from("inspiration_products")
      .select(`id, category, sort_order, decor_products(${PRODUCT_COLUMNS})`)
      .eq("inspiration_id", row.id)
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

    return {
      look: { slug: look.slug, name: look.name, shortDescription: look.short_description },
      inspiration: toInspiration(row),
      products,
    };
  });
