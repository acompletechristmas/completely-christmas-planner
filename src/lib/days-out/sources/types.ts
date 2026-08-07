import type {
  Audience,
  Experience,
  ExperienceType,
  PriceBand,
  Setting,
  TimeOfDay,
} from "@/lib/days-out/experience-data";

/** A normalised search request, shared by every source adapter. */
export interface SearchQuery {
  /** Resolved user origin, when a location was given. */
  lat?: number;
  lng?: number;
  radiusMiles?: number;
  /** ISO dates. */
  from?: string;
  to?: string;
  types?: ExperienceType[];
  price?: PriceBand[];
  audiences?: Audience[];
  setting?: Setting[];
  timeOfDay?: TimeOfDay[];
  limit?: number;
}

/**
 * Every external provider is wrapped in one of these. Adding a source later
 * means writing one adapter and registering it — nothing else changes.
 */
export interface ExperienceSource {
  id: string;
  name: string;
  /** Set false to keep an adapter in the codebase but out of live results. */
  enabled: () => boolean;
  search: (query: SearchQuery) => Promise<Experience[]>;
}
