import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Experience } from "@/lib/days-out/experience-data";

const searchInput = z.object({
  /** Free text from the "What are you looking for?" field. */
  q: z.string().max(120).optional(),
  location: z.string().max(80).optional(),
  radiusMiles: z.number().optional(),
  from: z.string().max(10).optional(),
  to: z.string().max(10).optional(),
  keywords: z.array(z.string().max(60)).max(10).optional(),
  types: z.array(z.string()).optional(),
  price: z.array(z.string()).optional(),
  setting: z.array(z.string()).optional(),
});

export interface ExperienceSearchResult {
  items: Experience[];
  origin: { label: string; lat: number; lng: number } | null;
  sources: { id: string; name: string; count: number }[];
  /** Per-provider outcome (no technical detail) so a failure is never shown as "no results". */
  providerStatus: { id: string; name: string; status: "success" | "failed"; count: number }[];
  locationNotFound: boolean;
}


/** Short-lived cache so identical searches never re-hit paid providers. */
const CACHE_TTL_MS = 10 * 60_000;
const cache = new Map<string, { at: number; value: ExperienceSearchResult }>();

/**
 * Public read-only search across every enabled activity source.
 * No auth: this powers the signed-out Christmas Magic Near Me page.
 */
export const searchExperiences = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => searchInput.parse(data))
  .handler(async ({ data }): Promise<ExperienceSearchResult> => {
    const key = JSON.stringify({
      q: (data.q ?? "").trim().toLowerCase(),
      location: (data.location ?? "").trim().toLowerCase(),
      radiusMiles: data.radiusMiles ?? 25,
      from: data.from ?? "",
      to: data.to ?? "",
      keywords: [...(data.keywords ?? [])].sort(),
      types: [...(data.types ?? [])].sort(),
      price: [...(data.price ?? [])].sort(),
      setting: [...(data.setting ?? [])].sort(),
    });

    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;

    const { geocodeUk } = await import("./sources/geo");
    const { searchAllSources } = await import("./sources/registry.server");

    const origin = data.location ? await geocodeUk(data.location) : null;

    const { items, sources } = await searchAllSources({
      ...(data.q?.trim() ? { query: data.q.trim() } : {}),
      ...(origin ? { lat: origin.lat, lng: origin.lng, placeLabel: origin.label } : {}),
      radiusMiles: data.radiusMiles ?? 25,
      ...(data.from ? { from: data.from } : {}),
      ...(data.to ? { to: data.to } : {}),
      ...(data.keywords?.length ? { keywords: data.keywords } : {}),
      ...(data.types?.length ? { types: data.types as never } : {}),
      ...(data.price?.length ? { price: data.price as never } : {}),
      ...(data.setting?.length ? { setting: data.setting as never } : {}),
      limit: 120,
    });

    const result: ExperienceSearchResult = {
      items,
      origin,
      sources,
      locationNotFound: Boolean(data.location) && origin === null,
    };

    cache.set(key, { at: Date.now(), value: result });
    if (cache.size > 100) {
      const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
      if (oldest) cache.delete(oldest[0]);
    }

    return result;
  });
