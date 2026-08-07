import { createClient } from "@supabase/supabase-js";
import type {
  Audience,
  Experience,
  ExperienceType,
  PriceBand,
  Setting,
  TimeOfDay,
} from "@/lib/days-out/experience-data";
import type { ExperienceSource, SearchQuery } from "./types";
import { haversineMiles } from "./geo";

interface CuratedRow {
  id: string;
  name: string;
  blurb: string | null;
  description: string | null;
  type: string;
  price_band: string;
  price_from: number | null;
  audiences: string[];
  setting: string;
  time_of_day: string[];
  venue: string | null;
  town: string | null;
  postcode: string | null;
  lat: number | null;
  lng: number | null;
  start_date: string | null;
  end_date: string | null;
  event_time: string | null;
  image_url: string | null;
  booking_url: string | null;
  source_name: string;
  source_url: string | null;
  rating: number | null;
  is_featured: boolean;
  is_sponsored: boolean;
  affiliate_url: string | null;
  checked_at: string;
}

function toExperience(row: CuratedRow): Experience {
  return {
    id: `curated:${row.id}`,
    name: row.name,
    type: row.type as ExperienceType,
    priceBand: row.price_band as PriceBand,
    audiences: (row.audiences ?? []) as Audience[],
    setting: row.setting as Setting,
    timeOfDay: (row.time_of_day ?? []) as TimeOfDay[],
    blurb: row.blurb ?? row.description ?? "",
    ...(row.rating != null ? { rating: Number(row.rating) } : {}),
    sourceId: "curated",
    sourceName: row.source_name,
    ...(row.source_url ? { sourceUrl: row.source_url } : {}),
    ...(row.image_url ? { imageUrl: row.image_url } : {}),
    ...(row.start_date ? { startDate: row.start_date } : {}),
    ...(row.end_date ? { endDate: row.end_date } : {}),
    ...(row.event_time ? { time: row.event_time } : {}),
    ...(row.venue ? { venue: row.venue } : {}),
    ...(row.town ? { town: row.town } : {}),
    ...(row.postcode ? { postcode: row.postcode } : {}),
    ...(row.lat != null ? { lat: row.lat } : {}),
    ...(row.lng != null ? { lng: row.lng } : {}),
    ...(row.price_from != null ? { priceFrom: Number(row.price_from) } : {}),
    ...(row.booking_url ? { bookingUrl: row.booking_url } : {}),
    checkedAt: row.checked_at,
    isFeatured: row.is_featured,
    isSponsored: row.is_sponsored,
    ...(row.affiliate_url ? { affiliateUrl: row.affiliate_url } : {}),
  };
}

/**
 * Our own curated UK Christmas listings. Always legal, always available,
 * and the fallback that guarantees coverage where no provider API exists.
 */
export const curatedSource: ExperienceSource = {
  id: "curated",
  name: "A Complete Christmas",
  enabled: () => true,
  async search(query: SearchQuery): Promise<Experience[]> {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return [];

    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    let builder = supabase
      .from("curated_experiences")
      .select("*")
      .eq("is_active", true)
      .limit(query.limit ?? 200);

    if (query.from) builder = builder.or(`end_date.is.null,end_date.gte.${query.from}`);
    if (query.to) builder = builder.or(`start_date.is.null,start_date.lte.${query.to}`);
    if (query.types?.length) builder = builder.in("type", query.types);
    if (query.price?.length) builder = builder.in("price_band", query.price);
    if (query.setting?.length) builder = builder.in("setting", query.setting);

    const { data, error } = await builder;
    if (error || !data) return [];

    let results = (data as CuratedRow[]).map(toExperience);

    if (query.lat != null && query.lng != null) {
      const radius = query.radiusMiles ?? 25;
      results = results
        .map((e) =>
          e.lat != null && e.lng != null
            ? { ...e, distanceMiles: haversineMiles(query.lat!, query.lng!, e.lat, e.lng) }
            : e,
        )
        .filter((e) => e.distanceMiles == null || e.distanceMiles <= radius);
    }

    return results;
  },
};
