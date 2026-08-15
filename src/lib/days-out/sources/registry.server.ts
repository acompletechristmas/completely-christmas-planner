import type { Experience } from "@/lib/days-out/experience-data";
import type { ExperienceSource, SearchQuery } from "./types";
import { curatedSource } from "./curated.server";
import { ticketmasterSource } from "./ticketmaster.server";
import { webSearchSource } from "./websearch.server";
import { dedupeExperiences } from "./dedupe";

/** Register new providers here — nothing else in the app needs to change. */
const SOURCES: ExperienceSource[] = [curatedSource, ticketmasterSource, webSearchSource];

export interface AggregatedResults {
  items: Experience[];
  /** Which adapters actually contributed, for the "sources searched" line. */
  sources: { id: string; name: string; count: number }[];
}

/** Fan out to every enabled source in parallel, normalise, dedupe, sort. */
export async function searchAllSources(query: SearchQuery): Promise<AggregatedResults> {
  const active = SOURCES.filter((s) => s.enabled());

  const settled = await Promise.allSettled(active.map((s) => s.search(query)));

  const sources: AggregatedResults["sources"] = [];
  let all: Experience[] = [];

  settled.forEach((result, i) => {
    const source = active[i]!;
    // One failing provider must never break the page — and a provider that
    // failed is never claimed as "searched".
    if (result.status !== "fulfilled") {
      console.error(`[days-out] source "${source.id}" failed:`, result.reason);
      return;
    }
    sources.push({ id: source.id, name: source.name, count: result.value.length });
    all = all.concat(result.value);
  });

  const deduped = dedupeExperiences(all);

  deduped.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    if (a.distanceMiles != null && b.distanceMiles != null) {
      return a.distanceMiles - b.distanceMiles;
    }
    if (a.startDate && b.startDate) return a.startDate.localeCompare(b.startDate);
    return (b.rating ?? 0) - (a.rating ?? 0);
  });

  return { items: deduped.slice(0, query.limit ?? 120), sources };
}
