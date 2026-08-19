/**
 * Shared vocabulary for Our Christmas Traditions.
 * Both lists are deliberately open-ended: a tradition may store any string,
 * so new categories or timings can be added later without a migration.
 */

export const TRADITION_CATEGORIES = [
  { key: "christmas_eve", label: "Christmas Eve" },
  { key: "christmas_morning", label: "Christmas morning" },
  { key: "christmas_day", label: "Christmas Day" },
  { key: "decorating", label: "Decorating" },
  { key: "food", label: "Food & baking" },
  { key: "giving", label: "Giving" },
  { key: "family", label: "Family" },
  { key: "friends", label: "Friends" },
  { key: "children", label: "Children" },
  { key: "going_out", label: "Going out" },
  { key: "films_music", label: "Films & music" },
  { key: "games", label: "Games & fun" },
  { key: "remembering", label: "Remembering" },
  { key: "kindness", label: "Acts of kindness" },
  { key: "faith", label: "Faith & reflection" },
  { key: "new_year", label: "New Year" },
  { key: "other", label: "Other" },
] as const;

export function categoryLabel(key: string | null | undefined): string {
  if (!key) return "No category";
  return TRADITION_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export const TIMINGS = [
  { key: "christmas_eve", label: "Christmas Eve" },
  { key: "christmas_morning", label: "Christmas morning" },
  { key: "christmas_day", label: "Christmas Day" },
  { key: "boxing_day", label: "Boxing Day" },
  { key: "december", label: "During December" },
  { key: "new_year", label: "New Year" },
  { key: "date", label: "A specific date" },
  { key: "flexible", label: "Whenever it suits us" },
] as const;

export type TimingKey = (typeof TIMINGS)[number]["key"];

export function timingLabel(key: string | null | undefined): string {
  if (!key) return "Whenever it suits us";
  return TIMINGS.find((t) => t.key === key)?.label ?? key;
}

/** Order used when grouping saved traditions on the page. */
export const TIMING_ORDER: string[] = [
  "december",
  "christmas_eve",
  "christmas_morning",
  "christmas_day",
  "boxing_day",
  "new_year",
  "date",
  "flexible",
];
