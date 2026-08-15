import type { Experience } from "@/lib/days-out/experience-data";
import type { ExperienceSource, SearchQuery } from "./types";

/**
 * Registration point for a general live web/place search provider.
 *
 * Many Christmas activities — garden centres, heritage properties, farms,
 * local grottos, steam railways, theatres, hotels — only ever appear on their
 * own websites, so the discovery engine needs a general search source
 * alongside the specialist event APIs.
 *
 * Deliberately provider-neutral: no provider is chosen, no key is read, no
 * page is scraped and NOTHING is invented. It stays dormant and returns an
 * empty array until a real provider is connected, at which point it will use
 * `query.keywords` to find the specific experience the user asked for.
 */
export const webSearchSource: ExperienceSource = {
  id: "websearch",
  name: "Web search",
  enabled: () => false,
  async search(_query: SearchQuery): Promise<Experience[]> {
    return [];
  },
};
