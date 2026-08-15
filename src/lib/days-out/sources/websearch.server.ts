import type {
  Audience,
  Experience,
  ExperienceType,
  PriceBand,
  Setting,
} from "@/lib/days-out/experience-data";
import type { ExperienceSource, SearchQuery } from "./types";
import { haversineMiles } from "./geo";

/**
 * Live Christmas discovery powered by the Gemini API with Google Search
 * grounding. Gemini is used to SEARCH and NORMALISE current public web
 * content — never to invent a listing. A result is only kept when the model
 * returns a genuine, parseable http(s) source URL, and every factual field is
 * optional so nothing is ever guessed.
 *
 * Dormant (and silent) until GEMINI_API_KEY is set.
 */

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/** Never used as an event destination: search pages, redirects, social posts. */
const BANNED_HOST_PARTS = [
  "google.com/search",
  "google.co.uk/search",
  "vertexaisearch.cloud.google.com",
  "bing.com/search",
  "duckduckgo.com",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "pinterest.",
];

function isUsableUrl(raw: unknown): raw is string {
  if (typeof raw !== "string" || raw.length < 10) return false;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  const full = `${url.host}${url.pathname}`.toLowerCase();
  if (BANNED_HOST_PARTS.some((bad) => full.includes(bad))) return false;
  if (url.searchParams.has("q") && url.pathname.includes("search")) return false;
  return true;
}

const TYPES: ExperienceType[] = [
  "grotto",
  "panto",
  "lights",
  "market",
  "skating",
  "tea",
  "meal",
  "party",
  "gathering",
  "community",
  "stay",
];

const PRICE_BANDS: PriceBand[] = ["free", "budget", "mid", "splash"];
const AUDIENCES: Audience[] = ["toddlers", "children", "teens", "adults", "dogs"];

interface RawResult {
  name?: unknown;
  sourceUrl?: unknown;
  bookingUrl?: unknown;
  sourceName?: unknown;
  venue?: unknown;
  town?: unknown;
  postcode?: unknown;
  lat?: unknown;
  lng?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  time?: unknown;
  priceFrom?: unknown;
  priceBand?: unknown;
  type?: unknown;
  setting?: unknown;
  audiences?: unknown;
  blurb?: unknown;
}

const str = (v: unknown, max = 200): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;

const isoDate = (v: unknown): string | undefined =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ? v.trim() : undefined;

const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

function toExperience(raw: RawResult, index: number, query: SearchQuery): Experience | null {
  const name = str(raw.name, 140);
  const sourceUrl = isUsableUrl(raw.sourceUrl) ? (raw.sourceUrl as string) : undefined;
  // Hard trust rule: no title or no genuine source URL means no live result.
  if (!name || !sourceUrl) return null;

  const bookingUrl = isUsableUrl(raw.bookingUrl) ? (raw.bookingUrl as string) : undefined;
  const type = TYPES.includes(raw.type as ExperienceType)
    ? (raw.type as ExperienceType)
    : "gathering";
  const priceBand = PRICE_BANDS.includes(raw.priceBand as PriceBand)
    ? (raw.priceBand as PriceBand)
    : "mid";
  const setting: Setting = raw.setting === "outdoor" ? "outdoor" : "indoor";
  const audiences = Array.isArray(raw.audiences)
    ? (raw.audiences.filter((a) => AUDIENCES.includes(a as Audience)) as Audience[])
    : [];

  const lat = num(raw.lat);
  const lng = num(raw.lng);

  let host = "";
  try {
    host = new URL(sourceUrl).host.replace(/^www\./, "");
  } catch {
    host = "";
  }

  return {
    id: `websearch:${host}:${index}:${name.toLowerCase().slice(0, 40)}`,
    name,
    type,
    priceBand,
    audiences,
    setting,
    timeOfDay: [],
    blurb: str(raw.blurb, 220) ?? "",
    sourceId: "websearch",
    sourceName: str(raw.sourceName, 60) ?? host || "Web",
    sourceUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...(str(raw.venue, 120) ? { venue: str(raw.venue, 120)! } : {}),
    ...(str(raw.town, 80) ? { town: str(raw.town, 80)! } : {}),
    ...(str(raw.postcode, 12) ? { postcode: str(raw.postcode, 12)! } : {}),
    ...(lat != null ? { lat } : {}),
    ...(lng != null ? { lng } : {}),
    ...(isoDate(raw.startDate) ? { startDate: isoDate(raw.startDate)! } : {}),
    ...(isoDate(raw.endDate) ? { endDate: isoDate(raw.endDate)! } : {}),
    ...(str(raw.time, 40) ? { time: str(raw.time, 40)! } : {}),
    ...(num(raw.priceFrom) != null ? { priceFrom: num(raw.priceFrom)! } : {}),
    ...(lat != null && lng != null && query.lat != null && query.lng != null
      ? { distanceMiles: haversineMiles(query.lat, query.lng, lat, lng) }
      : {}),
    checkedAt: new Date().toISOString(),
  };
}

/** Christmas concepts used to widen a vague or empty query. */
const BROAD_ANGLES = [
  "Father Christmas grottos and Santa experiences",
  "Christmas light trails and illuminated gardens",
  "Christmas markets and festive shopping events",
  "pantomimes, Christmas theatre and candlelit carol concerts",
  "festive afternoon teas, Christmas dining and winter experiences",
];

/**
 * One user search becomes a handful of targeted, deduplicated searches so
 * coverage reaches beyond ticketing platforms. Never shown to the user.
 */
function buildAngles(query: SearchQuery): string[] {
  const intent = [query.query, ...(query.keywords ?? [])]
    .map((s) => (s ?? "").trim())
    .filter(Boolean);

  const angles: string[] = [];
  if (intent.length) {
    angles.push(intent.join(" "));
    const head = intent[0]!;
    angles.push(
      `${head} at farms, garden centres and family attractions`,
      `${head} at heritage properties, stately homes, steam railways and theatres`,
      `${head} run by councils, tourism boards, churches and local organisers`,
    );
  } else {
    angles.push(...BROAD_ANGLES);
  }

  return Array.from(new Set(angles.map((a) => a.toLowerCase()))).slice(0, 5);
}

function placeContext(query: SearchQuery): string {
  const bits: string[] = [];
  if (query.placeLabel) bits.push(`near ${query.placeLabel}`);
  if (query.lat != null && query.lng != null) {
    bits.push(`(approximately ${query.lat.toFixed(3)}, ${query.lng.toFixed(3)})`);
  }
  bits.push(`within about ${Math.round(query.radiusMiles ?? 25)} miles`);
  return bits.join(" ");
}

function buildPrompt(angle: string, query: SearchQuery): string {
  const dates =
    query.from || query.to
      ? `Only include experiences taking place between ${query.from ?? "now"} and ${query.to ?? "25 December"}.`
      : "Focus on this Christmas season.";

  return [
    `Use Google Search to find REAL, currently advertised Christmas experiences in the United Kingdom: ${angle}.`,
    `Location: ${placeContext(query)}.`,
    dates,
    "Prefer the official venue, attraction or organiser page over ticket resellers, blogs, directories or social media.",
    "",
    "Rules you must obey:",
    "- Only list an experience if a real web page you found actually advertises it.",
    "- NEVER invent or guess a name, date, price, venue or URL.",
    "- If a field is not stated on the source page, omit it entirely.",
    "- sourceUrl must be the exact page describing the experience, not a search results page or a homepage-with-no-mention.",
    "- bookingUrl only if the page genuinely offers booking/tickets.",
    "",
    "Reply with ONLY a JSON array (no markdown fence, no commentary), each item:",
    `{"name":string,"sourceUrl":string,"sourceName"?:string,"bookingUrl"?:string,"venue"?:string,"town"?:string,"postcode"?:string,"startDate"?:"YYYY-MM-DD","endDate"?:"YYYY-MM-DD","time"?:string,"priceFrom"?:number,"priceBand"?:"free"|"budget"|"mid"|"splash","type"?:"grotto"|"panto"|"lights"|"market"|"skating"|"tea"|"meal"|"party"|"gathering"|"community"|"stay","setting"?:"indoor"|"outdoor","audiences"?:string[],"blurb"?:string}`,
    "Return up to 12 items. Return [] if you find nothing genuine.",
  ].join("\n");
}

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    groundingMetadata?: {
      groundingChunks?: { web?: { uri?: string; title?: string; domain?: string } }[];
    };
  }[];
}

function parseJsonArray(text: string): RawResult[] {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end <= start) return [];
  try {
    const parsed: unknown = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(parsed) ? (parsed as RawResult[]) : [];
  } catch {
    return [];
  }
}

async function runAngle(
  angle: string,
  query: SearchQuery,
  apiKey: string,
): Promise<{ items: RawResult[]; grounded: Set<string> }> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildPrompt(angle, query) }] }],
      tools: [{ google_search: {} }],
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini grounding failed [${res.status}]: ${await res.text()}`);
  }

  const json = (await res.json()) as GeminiResponse;
  const candidate = json.candidates?.[0];
  const text = (candidate?.content?.parts ?? []).map((p) => p.text ?? "").join("");

  // Preserve Google grounding attribution: the domains actually searched.
  const grounded = new Set<string>();
  for (const chunk of candidate?.groundingMetadata?.groundingChunks ?? []) {
    const domain = chunk.web?.domain ?? chunk.web?.title;
    if (domain) grounded.add(domain.toLowerCase().replace(/^www\./, ""));
  }

  return { items: parseJsonArray(text), grounded };
}

export const webSearchSource: ExperienceSource = {
  id: "websearch",
  name: "Google-powered web search",
  enabled: () => Boolean(process.env["GEMINI_API_KEY"]),
  async search(query: SearchQuery): Promise<Experience[]> {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) return [];

    const angles = buildAngles(query);
    const settled = await Promise.allSettled(angles.map((a) => runAngle(a, query, apiKey)));

    // Every angle failing means Google was not searched — tell the registry.
    if (settled.every((s) => s.status === "rejected")) {
      const first = settled[0];
      throw first && first.status === "rejected"
        ? (first.reason as Error)
        : new Error("Gemini grounding failed");
    }

    const grounded = new Set<string>();
    const raw: RawResult[] = [];
    for (const outcome of settled) {
      if (outcome.status !== "fulfilled") continue;
      raw.push(...outcome.value.items);
      outcome.value.grounded.forEach((d) => grounded.add(d));
    }

    const seen = new Set<string>();
    const out: Experience[] = [];

    raw.forEach((item, i) => {
      const experience = toExperience(item, i, query);
      if (!experience) return;
      const key = `${experience.name.toLowerCase()}|${experience.sourceUrl}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push(experience);
    });

    return out;
  },
};
