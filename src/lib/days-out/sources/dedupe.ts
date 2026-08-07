import type { Experience } from "@/lib/days-out/experience-data";

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "at",
  "in",
  "of",
  "and",
  "&",
  "christmas",
  "xmas",
  "festive",
  "experience",
  "event",
  "2026",
  "2027",
]);

/** "Santa's Grotto at Kew" -> "grotto kew" */
export function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w))
    .sort()
    .join(" ");
}

function fingerprint(e: Experience): string {
  const geo =
    e.lat != null && e.lng != null
      ? `${e.lat.toFixed(2)},${e.lng.toFixed(2)}`
      : (e.town ?? e.venue ?? "").toLowerCase();
  return `${normaliseName(e.name)}|${e.startDate ?? ""}|${geo}`;
}

/** Token overlap, 0–1. Catches "Grotto at Kew" vs "Kew Santa Grotto". */
function similarity(a: string, b: string): number {
  const A = new Set(a.split(" ").filter(Boolean));
  const B = new Set(b.split(" ").filter(Boolean));
  if (!A.size || !B.size) return 0;
  let shared = 0;
  A.forEach((t) => {
    if (B.has(t)) shared += 1;
  });
  return shared / Math.max(A.size, B.size);
}

/** Prefer the record with more usable information. */
function richness(e: Experience): number {
  let score = 0;
  for (const v of [e.imageUrl, e.blurb, e.startDate, e.priceFrom, e.bookingUrl, e.venue, e.postcode]) {
    if (v !== undefined && v !== null && v !== "") score += 1;
  }
  if (e.isFeatured) score += 2;
  return score;
}

function merge(primary: Experience, other: Experience): Experience {
  return {
    ...other,
    ...primary,
    imageUrl: primary.imageUrl ?? other.imageUrl,
    blurb: primary.blurb || other.blurb,
    startDate: primary.startDate ?? other.startDate,
    endDate: primary.endDate ?? other.endDate,
    time: primary.time ?? other.time,
    priceFrom: primary.priceFrom ?? other.priceFrom,
    bookingUrl: primary.bookingUrl ?? other.bookingUrl,
    postcode: primary.postcode ?? other.postcode,
    lat: primary.lat ?? other.lat,
    lng: primary.lng ?? other.lng,
    rating: primary.rating ?? other.rating,
  };
}

/**
 * Collapse the same event found in more than one source into a single card.
 * Exact fingerprint match, then a fuzzy name check for near-identical titles
 * on the same date and place.
 */
export function dedupeExperiences(items: Experience[]): Experience[] {
  const byFingerprint = new Map<string, Experience>();

  for (const item of items) {
    const key = fingerprint(item);
    const existing = byFingerprint.get(key);
    if (!existing) {
      byFingerprint.set(key, item);
      continue;
    }
    const [primary, secondary] =
      richness(item) > richness(existing) ? [item, existing] : [existing, item];
    byFingerprint.set(key, merge(primary, secondary));
  }

  const out: Experience[] = [];
  for (const item of byFingerprint.values()) {
    const nameKey = normaliseName(item.name);
    const near = out.findIndex((o) => {
      if (o.startDate !== item.startDate) return false;
      const samePlace =
        (o.postcode && item.postcode && o.postcode === item.postcode) ||
        (o.town && item.town && o.town.toLowerCase() === item.town.toLowerCase());
      if (!samePlace) return false;
      return similarity(normaliseName(o.name), nameKey) >= 0.7;
    });
    if (near === -1) {
      out.push(item);
    } else {
      const existing = out[near]!;
      const [primary, secondary] =
        richness(item) > richness(existing) ? [item, existing] : [existing, item];
      out[near] = merge(primary, secondary);
    }
  }

  return out;
}
