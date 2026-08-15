import type {
  Audience,
  Experience,
  ExperienceType,
  PriceBand,
  Setting,
} from "@/lib/days-out/experience-data";
import type { ExperienceSource, SearchQuery } from "./types";
import { haversineMiles } from "./geo";

interface TmEvent {
  id: string;
  name: string;
  url?: string;
  info?: string;
  pleaseNote?: string;
  images?: { url: string; width: number }[];
  dates?: { start?: { localDate?: string; localTime?: string } };
  priceRanges?: { min?: number }[];
  classifications?: { segment?: { name?: string }; genre?: { name?: string } }[];
  _embedded?: {
    venues?: {
      name?: string;
      city?: { name?: string };
      postalCode?: string;
      location?: { latitude?: string; longitude?: string };
    }[];
  };
}

function guessType(event: TmEvent): ExperienceType {
  const text = `${event.name} ${event.classifications?.[0]?.genre?.name ?? ""}`.toLowerCase();
  if (text.includes("panto")) return "panto";
  if (text.includes("santa") || text.includes("grotto")) return "grotto";
  if (text.includes("light")) return "lights";
  if (text.includes("market")) return "market";
  if (text.includes("skat") || text.includes("ice rink")) return "skating";
  if (text.includes("carol") || text.includes("church")) return "community";
  if (text.includes("tea")) return "tea";
  if (text.includes("dinner") || text.includes("lunch")) return "meal";
  if (text.includes("party")) return "party";
  return "panto";
}

function priceBand(min?: number): PriceBand {
  if (min == null) return "mid";
  if (min === 0) return "free";
  if (min < 15) return "budget";
  if (min < 45) return "mid";
  return "splash";
}

function audiences(event: TmEvent): Audience[] {
  const text = event.name.toLowerCase();
  if (text.includes("family") || text.includes("santa") || text.includes("panto")) {
    return ["toddlers", "children", "teens", "adults"];
}

/** Festive keywords — this is a Christmas discovery engine, not a generic events search. */
const FESTIVE_WORDS = [
  "christmas",
  "xmas",
  "festive",
  "santa",
  "grotto",
  "panto",
  "nativity",
  "carol",
  "nutcracker",
  "elf",
  "winter wonderland",
  "light trail",
  "christmas market",
  "yule",
  "advent",
  "reindeer",
  "snowman",
  "scrooge",
  "christmas carol",
  "ice rink",
  "ice skating",
  "new year",
];

/** Drop unrelated concerts/sport that merely matched the API keyword. */
function isFestive(event: TmEvent): boolean {
  const text = [
    event.name,
    event.info ?? "",
    event.classifications?.[0]?.genre?.name ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return FESTIVE_WORDS.some((w) => text.includes(w));
}
  return ["adults", "teens"];
}

/**
 * Ticketmaster Discovery API. Dormant until TICKETMASTER_API_KEY is set,
 * which is exactly how any future provider plugs in.
 */
export const ticketmasterSource: ExperienceSource = {
  id: "ticketmaster",
  name: "Ticketmaster",
  enabled: () => Boolean(process.env["TICKETMASTER_API_KEY"]),
  async search(query: SearchQuery): Promise<Experience[]> {
    const apiKey = process.env["TICKETMASTER_API_KEY"];
    if (!apiKey) return [];

    const params = new URLSearchParams({
      apikey: apiKey,
      countryCode: "GB",
      keyword: "christmas",
      size: String(Math.min(query.limit ?? 50, 100)),
      sort: query.lat != null ? "distance,asc" : "date,asc",
    });
    if (query.lat != null && query.lng != null) {
      params.set("latlong", `${query.lat},${query.lng}`);
      params.set("radius", String(Math.round(query.radiusMiles ?? 25)));
      params.set("unit", "miles");
    }
    if (query.from) params.set("startDateTime", `${query.from}T00:00:00Z`);
    if (query.to) params.set("endDateTime", `${query.to}T23:59:59Z`);

    try {
      const res = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`,
      );
      if (!res.ok) return [];
      const json = (await res.json()) as { _embedded?: { events?: TmEvent[] } };
      const events = json._embedded?.events ?? [];

      return events.filter(isFestive).map((event) => {
        const venue = event._embedded?.venues?.[0];
        const lat = venue?.location?.latitude ? Number(venue.location.latitude) : undefined;
        const lng = venue?.location?.longitude ? Number(venue.location.longitude) : undefined;
        const min = event.priceRanges?.[0]?.min;
        const image = [...(event.images ?? [])].sort((a, b) => b.width - a.width)[0]?.url;
        const setting: Setting = "indoor";

        return {
          id: `ticketmaster:${event.id}`,
          name: event.name,
          type: guessType(event),
          priceBand: priceBand(min),
          audiences: audiences(event),
          setting,
          timeOfDay: [],
          blurb: (event.info ?? event.pleaseNote ?? "").slice(0, 180),
          sourceId: "ticketmaster",
          sourceName: "Ticketmaster",
          ...(event.url ? { sourceUrl: event.url, bookingUrl: event.url } : {}),
          ...(image ? { imageUrl: image } : {}),
          ...(event.dates?.start?.localDate ? { startDate: event.dates.start.localDate } : {}),
          ...(event.dates?.start?.localTime ? { time: event.dates.start.localTime } : {}),
          ...(venue?.name ? { venue: venue.name } : {}),
          ...(venue?.city?.name ? { town: venue.city.name } : {}),
          ...(venue?.postalCode ? { postcode: venue.postalCode } : {}),
          ...(lat != null ? { lat } : {}),
          ...(lng != null ? { lng } : {}),
          ...(min != null ? { priceFrom: min } : {}),
          ...(lat != null && lng != null && query.lat != null && query.lng != null
            ? { distanceMiles: haversineMiles(query.lat, query.lng, lat, lng) }
            : {}),
          checkedAt: new Date().toISOString(),
        } satisfies Experience;
      });
    } catch {
      return [];
    }
  },
};
