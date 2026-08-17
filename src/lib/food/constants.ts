/** Shared vocabulary for the Christmas Food Planner. Plain strings so new
 *  meals, statuses or categories never need a migration. */

export const MEALS = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "buffet", label: "Buffet / picky bits" },
  { key: "snacks", label: "Snacks" },
  { key: "desserts", label: "Desserts" },
  { key: "drinks", label: "Drinks" },
] as const;

export type MealKey = (typeof MEALS)[number]["key"];

export function mealLabel(key: string): string {
  return MEALS.find((m) => m.key === key)?.label ?? key;
}

export const STATUSES = [
  { key: "planned", label: "Planned" },
  { key: "to_buy", label: "To buy" },
  { key: "bought", label: "Bought" },
  { key: "to_prepare", label: "To prepare" },
  { key: "prepared", label: "Prepared" },
  { key: "served", label: "Served / Complete" },
] as const;

export type StatusKey = (typeof STATUSES)[number]["key"];

export function statusLabel(key: string): string {
  return STATUSES.find((s) => s.key === key)?.label ?? key;
}

export const DIETARY_TAGS = [
  { key: "vegetarian", label: "Vegetarian" },
  { key: "vegan", label: "Vegan" },
  { key: "gluten_free", label: "Gluten free" },
  { key: "dairy_free", label: "Dairy free" },
  { key: "nut_allergy", label: "Nut allergy" },
  { key: "other_allergy", label: "Other allergy" },
  { key: "other", label: "Other dietary requirement" },
] as const;

export function dietaryLabel(key: string): string {
  return DIETARY_TAGS.find((d) => d.key === key)?.label ?? key;
}

export const SHOP_CATEGORIES = [
  { key: "fruit_veg", label: "Fruit & vegetables" },
  { key: "meat_fish", label: "Meat & fish" },
  { key: "chilled", label: "Chilled" },
  { key: "dairy", label: "Dairy" },
  { key: "bakery", label: "Bakery" },
  { key: "cupboard", label: "Cupboard" },
  { key: "frozen", label: "Frozen" },
  { key: "drinks", label: "Drinks" },
  { key: "snacks", label: "Snacks & confectionery" },
  { key: "other", label: "Other" },
] as const;

export function shopCategoryLabel(key: string | null): string {
  if (!key) return "Uncategorised";
  return SHOP_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

/**
 * The Christmas the user is currently planning for. Matches the rollover the
 * planner countdown already uses: after Boxing Day we plan next Christmas.
 */
export function activePlanningYear(now: Date = new Date()): number {
  return now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
}

/** The three occasions every planner starts with, dated in the active year. */
export function defaultOccasions(year = activePlanningYear()) {
  return [
    { default_key: "christmas_eve", name: "Christmas Eve", occasion_date: `${year}-12-24`, sort_order: 0 },
    { default_key: "christmas_day", name: "Christmas Day", occasion_date: `${year}-12-25`, sort_order: 1 },
    { default_key: "boxing_day", name: "Boxing Day", occasion_date: `${year}-12-26`, sort_order: 2 },
  ];
}

export function formatDayLabel(iso: string | null): string {
  if (!iso) return "No date yet";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}
