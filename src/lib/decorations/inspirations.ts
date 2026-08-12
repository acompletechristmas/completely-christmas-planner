import inspLivingRoom from "@/assets/looks/inspirations/living-room.webp";
import inspTree from "@/assets/looks/inspirations/tree.webp";
import inspMantel from "@/assets/looks/inspirations/mantel.webp";
import inspTable from "@/assets/looks/inspirations/table.webp";
import inspStaircase from "@/assets/looks/inspirations/staircase.webp";
import inspDoor from "@/assets/looks/inspirations/door.webp";

/** Inspiration categories. Free text in the database — new values may be added as data. */
export const INSPIRATION_CATEGORY_LABELS: Record<string, string> = {
  room: "The whole room",
  tree: "Christmas tree",
  mantel: "Fireplace & mantel",
  table: "Dining table",
  staircase: "Staircase",
  door: "Front door & wreath",
  window: "Windows",
  garland: "Garlands",
  shelf: "Shelves & sideboards",
  detail: "Styling details",
};

export function inspirationCategoryLabel(value: string): string {
  return INSPIRATION_CATEGORY_LABELS[value] ?? value;
}

export interface LookInspiration {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  stylingTip: string | null;
  category: string;
  imageUrl: string | null;
}

export interface InspirationProduct {
  id: string;
  category: string;
  name: string;
  retailer: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  previousPrice: number | null;
  currency: string;
  url: string | null;
  isAffiliate: boolean;
  isSponsored: boolean;
  isFeatured: boolean;
  lastCheckedAt: string | null;
  quantity: number | null;
  quantityMax: number | null;
  quantityUnit: string | null;
  sizeNote: string | null;
  colourFinish: string | null;
  stylingNote: string | null;
  isEssential: boolean;
  sortOrder: number;
}

export function formatRecreateQuantity(
  quantity: number | null,
  quantityMax: number | null,
  unit: string | null,
): string | null {
  if (quantity == null && quantityMax == null) return null;
  const hasUnit = Boolean(unit?.trim());
  const unitText = hasUnit ? ` ${unit}` : "";
  if (quantity != null && quantityMax != null) {
    return `Approximately ${quantity}–${quantityMax}${unitText}`;
  }
  if (quantity != null) {
    return `Approximately ${quantity}${unitText}`;
  }
  return `Up to ${quantityMax}${unitText}`;
}

/**
 * Local photography for seeded inspirations, keyed by `<look-slug>/<inspiration-slug>`.
 * Rows may instead supply a remote `image_url`, which always wins.
 */
const INSPIRATION_IMAGES: Record<string, string> = {
  "traditional-red-gold/living-room": inspLivingRoom,
  "traditional-red-gold/tree": inspTree,
  "traditional-red-gold/mantel": inspMantel,
  "traditional-red-gold/table": inspTable,
  "traditional-red-gold/staircase": inspStaircase,
  "traditional-red-gold/front-door": inspDoor,
};

export function inspirationImage(
  lookSlug: string,
  inspiration: Pick<LookInspiration, "slug" | "imageUrl">,
): string | undefined {
  return inspiration.imageUrl ?? INSPIRATION_IMAGES[`${lookSlug}/${inspiration.slug}`];
}
