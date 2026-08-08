import heroTraditional from "@/assets/hero-room.webp";
import heroElegant from "@/assets/looks/elegant-gold-champagne.webp";
import heroWinter from "@/assets/looks/winter-wonderland.webp";
import heroNordic from "@/assets/looks/nordic-christmas.webp";
import heroWoodland from "@/assets/looks/natural-woodland.webp";
import heroTartan from "@/assets/looks/classic-green-tartan.webp";
import heroCandy from "@/assets/looks/candy-cane-christmas.webp";
import heroVintage from "@/assets/looks/vintage-christmas.webp";
import heroLuxury from "@/assets/looks/luxury-christmas.webp";
import heroColourful from "@/assets/looks/colourful-family-christmas.webp";
import heroWhite from "@/assets/looks/a-white-christmas.webp";
import heroTrends from "@/assets/looks/latest-trends.webp";

/** Fixed product categories a look can be organised into. */
export const LOOK_CATEGORY_LABELS = {
  tree: "Christmas tree",
  "tree-decorations": "Tree decorations",
  baubles: "Baubles",
  "ribbon-garland": "Ribbon & garland",
  "tree-topper": "Tree topper",
  lights: "Lights",
  stockings: "Stockings",
  mantel: "Mantel & fireplace",
  wreath: "Wreath",
  table: "Table decorations",
  cushions: "Cushions & throws",
  "finishing-touches": "Finishing touches",
} as const;

export type LookCategory = keyof typeof LOOK_CATEGORY_LABELS;

export function categoryLabel(value: string): string {
  return LOOK_CATEGORY_LABELS[value as LookCategory] ?? value;
}

export interface PaletteColour {
  name: string;
  hex: string;
}

export interface ChristmasLook {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  palette: PaletteColour[];
  keyElements: string[];
  categories: string[];
  heroImageUrl: string | null;
}

export interface LookProduct {
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
}

/** Local photography for the seeded looks; data rows may also supply a remote URL. */
const LOOK_IMAGES: Record<string, string> = {
  "traditional-red-gold": heroTraditional,
  "elegant-gold-champagne": heroElegant,
  "winter-wonderland": heroWinter,
  "nordic-christmas": heroNordic,
  "natural-woodland": heroWoodland,
  "classic-green-tartan": heroTartan,
  "candy-cane-christmas": heroCandy,
  "vintage-christmas": heroVintage,
  "luxury-christmas": heroLuxury,
  "colourful-family-christmas": heroColourful,
  "a-white-christmas": heroWhite,
  "latest-trends": heroTrends,
};

export function lookImage(look: Pick<ChristmasLook, "slug" | "heroImageUrl">): string | undefined {
  return look.heroImageUrl ?? LOOK_IMAGES[look.slug];
}
