import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Experience } from "@/lib/days-out/experience-data";

const searchInput = z.object({
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
  locationNotFound: boolean;
}

/**
 * Public read-only search across every enabled activity source.
 * No auth: this powers the signed-out Christmas Magic Near Me page.
 */
export const searchExperiences = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => searchInput.parse(data))
  .handler(async ({ data }): Promise<ExperienceSearchResult> => {
    const { geocodeUk } = await import("./sources/geo");
    const { searchAllSources } = await import("./sources/registry.server");

    const origin = data.location ? await geocodeUk(data.location) : null;

    const { items, sources } = await searchAllSources({
      ...(origin ? { lat: origin.lat, lng: origin.lng } : {}),
      radiusMiles: data.radiusMiles ?? 25,
      ...(data.from ? { from: data.from } : {}),
      ...(data.to ? { to: data.to } : {}),
      ...(data.keywords?.length ? { keywords: data.keywords } : {}),
      ...(data.types?.length ? { types: data.types as never } : {}),
      ...(data.price?.length ? { price: data.price as never } : {}),
      ...(data.setting?.length ? { setting: data.setting as never } : {}),
      limit: 120,
    });

    return {
      items,
      origin,
      sources,
      locationNotFound: Boolean(data.location) && origin === null,
    };
  });
