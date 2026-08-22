/** Shared vocabulary for My Christmas Home. Plain strings, so new areas,
 *  categories or statuses never need a migration. */

/** Default areas created once, in-app, the first time a user opens the planner. */
export const DEFAULT_AREAS = [
  "Living room",
  "Dining room",
  "Kitchen",
  "Hallway",
  "Stairs / landing",
  "Front door / entrance",
  "Outside / garden",
  "Bedrooms",
  "Fireplace / mantel",
  "Windows",
  "Other",
] as const;

export const HOME_CATEGORIES = [
  { key: "tree", label: "Tree" },
  { key: "lights", label: "Lights" },
  { key: "garland", label: "Garland" },
  { key: "wreath", label: "Wreath" },
  { key: "mantel", label: "Mantel / fireplace" },
  { key: "table", label: "Table" },
  { key: "baubles", label: "Baubles / ornaments" },
  { key: "stockings", label: "Stockings" },
  { key: "candles", label: "Candles" },
  { key: "soft", label: "Soft furnishings" },
  { key: "outdoor", label: "Outdoor decorations" },
  { key: "windows", label: "Window decorations" },
  { key: "general", label: "General decorating" },
  { key: "job", label: "Job / task" },
  { key: "shopping", label: "Shopping need" },
  { key: "other", label: "Other" },
] as const;

export function categoryLabel(key: string | null): string {
  if (!key) return "";
  return HOME_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export const HOME_STATUSES = [
  { key: "idea", label: "Idea" },
  { key: "todo", label: "To do" },
  { key: "buy", label: "Need to buy" },
  { key: "ready", label: "Ready" },
  { key: "done", label: "Done" },
] as const;

export type HomeStatus = (typeof HOME_STATUSES)[number]["key"];

export function statusLabel(key: string): string {
  return HOME_STATUSES.find((s) => s.key === key)?.label ?? key;
}
