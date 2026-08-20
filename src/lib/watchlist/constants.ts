/**
 * Shared vocabulary for My Christmas Watchlist.
 * All lists are open-ended: the database stores free text, so new values can
 * be added without a migration.
 */

export const CONTENT_TYPES = [
  { key: "film", label: "Film" },
  { key: "tv_special", label: "TV special" },
  { key: "episode", label: "Festive episode" },
  { key: "series", label: "Series" },
  { key: "other", label: "Other" },
] as const;

export function typeLabel(key: string | null | undefined): string {
  if (!key) return "Other";
  return CONTENT_TYPES.find((t) => t.key === key)?.label ?? key;
}

export const TIMINGS = [
  { key: "christmas_eve", label: "Christmas Eve" },
  { key: "christmas_morning", label: "Christmas morning" },
  { key: "christmas_day", label: "Christmas Day" },
  { key: "boxing_day", label: "Boxing Day" },
  { key: "december", label: "During December" },
  { key: "weekend", label: "A weekend in December" },
  { key: "any_time", label: "Any time" },
] as const;

export function timingLabel(key: string | null | undefined): string {
  if (!key) return "Any time";
  return TIMINGS.find((t) => t.key === key)?.label ?? key;
}

export const TIMING_ORDER = [
  "december",
  "weekend",
  "christmas_eve",
  "christmas_morning",
  "christmas_day",
  "boxing_day",
  "any_time",
];

export const MOODS = [
  { key: "classic", label: "Classic Christmas" },
  { key: "funny", label: "Funny" },
  { key: "romantic", label: "Romantic" },
  { key: "cosy", label: "Cosy" },
  { key: "magical", label: "Magical" },
  { key: "nostalgic", label: "Nostalgic" },
  { key: "family", label: "Family favourite" },
  { key: "newer", label: "Something newer" },
  { key: "easy", label: "Easy/background viewing" },
  { key: "tearjerker", label: "Tearjerker" },
  { key: "musical", label: "Musical" },
  { key: "animated", label: "Animated" },
  { key: "adventure", label: "Adventure" },
  { key: "feel_good", label: "Feel-good" },
  { key: "surprise", label: "Surprise me" },
] as const;

export function moodLabel(key: string | null | undefined): string {
  if (!key) return "";
  return MOODS.find((m) => m.key === key)?.label ?? key;
}

export const AGE_BANDS = ["all", "5+", "8+", "12+", "adult"] as const;

export const AGE_ORDER: Record<string, number> = {
  all: 0,
  "5+": 1,
  "8+": 2,
  "12+": 3,
  adult: 4,
};

/** Checks whether an age band is suitable for a given maximum age band. */
export function isSuitableForAge(ageBand: string, maxAgeBand: string): boolean {
  return AGE_ORDER[ageBand] <= AGE_ORDER[maxAgeBand];
}
