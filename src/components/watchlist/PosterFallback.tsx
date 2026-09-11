import { Gift, Heart, Music, Snowflake, Sparkles, Star, Tv } from "lucide-react";

import type { CatalogueTitle } from "@/lib/watchlist/catalogue";

/**
 * Temporary in-house "title card" shown when a catalogue title has no licensed
 * poster artwork. Purely presentational: no external images, no film artwork,
 * no data changes. The moment `posterUrl` is supplied, WatchCard renders the
 * real image instead and this component is never used for that title.
 *
 * The look is derived from curation the catalogue already carries (strength
 * keys, suitability, content type) — no extra mapping table.
 */

type ThemeName =
  | "young"
  | "dark"
  | "british"
  | "musical"
  | "classic"
  | "romance"
  | "comedy"
  | "magical";

interface Theme {
  /** Background + text classes for the 2:3 slot. */
  surface: string;
  title: string;
  meta: string;
  accent: string;
  icon: typeof Sparkles;
  secondaryIcon?: typeof Sparkles;
  /** Vintage double-line frame. */
  framed?: boolean;
}

const THEMES: Record<ThemeName, Theme> = {
  young: {
    surface: "bg-gradient-to-b from-[#FFFCF4] to-[#FBEFDC]",
    title: "text-[#2A3A4A]/85",
    meta: "text-[#2A3A4A]/50",
    accent: "text-[#D4AF37]",
    icon: Star,
    secondaryIcon: Snowflake,
  },
  dark: {
    surface: "bg-gradient-to-b from-[#1B2634] to-[#0F1721]",
    title: "text-[#F5EFE2]/90",
    meta: "text-[#F5EFE2]/50",
    accent: "text-[#D4AF37]/80",
    icon: Star,
    secondaryIcon: Snowflake,
  },
  british: {
    surface: "bg-gradient-to-b from-[#FBF7EE] to-[#F2EADC]",
    title: "text-[#2A3A4A]/85",
    meta: "text-[#2A3A4A]/50",
    accent: "text-[#D4AF37]",
    icon: Tv,
  },
  musical: {
    surface: "bg-gradient-to-b from-[#FBF7EE] to-[#F3EBDA]",
    title: "text-[#2A3A4A]/85",
    meta: "text-[#2A3A4A]/50",
    accent: "text-[#D4AF37]",
    icon: Music,
  },
  classic: {
    surface: "bg-gradient-to-b from-[#FAF5E9] to-[#EFE6D2]",
    title: "text-[#2A3A4A]/85",
    meta: "text-[#2A3A4A]/50",
    accent: "text-[#D4AF37]",
    icon: Sparkles,
    framed: true,
  },
  romance: {
    surface: "bg-gradient-to-b from-[#FDF6EE] to-[#F6E8DF]",
    title: "text-[#2A3A4A]/85",
    meta: "text-[#2A3A4A]/50",
    accent: "text-[#C08A8A]",
    icon: Heart,
  },
  comedy: {
    surface: "bg-gradient-to-b from-[#FDF9EE] to-[#F5EBD6]",
    title: "text-[#2A3A4A]/85",
    meta: "text-[#2A3A4A]/50",
    accent: "text-[#D4AF37]",
    icon: Gift,
    secondaryIcon: Sparkles,
  },
  magical: {
    surface: "bg-gradient-to-b from-[#FBF7EE] to-[#F5EFE2]",
    title: "text-[#2A3A4A]/85",
    meta: "text-[#2A3A4A]/50",
    accent: "text-[#D4AF37]",
    icon: Sparkles,
    secondaryIcon: Snowflake,
  },
};

function has(item: CatalogueTitle, key: string): boolean {
  const value = item.strength[key as keyof typeof item.strength];
  return Boolean(value) && value !== "unsuitable";
}

/** First matching rule wins, so a title always looks the same. */
export function pickTheme(item: CatalogueTitle): ThemeName {
  if (has(item, "horror") || has(item, "alternative") || has(item, "dark_comedy")) return "dark";
  if (item.type === "episode" || item.type === "tv_special" || item.type === "series") return "british";
  if (has(item, "musical")) return "musical";
  if (item.suitability === "all" && has(item, "young_children")) return "young";
  if (has(item, "romance") || has(item, "christmas_romance")) return "romance";
  if (has(item, "classic") || has(item, "nostalgic")) return "classic";
  if (has(item, "comedy")) return "comedy";
  return "magical";
}

export function PosterFallback({ item }: { item: CatalogueTitle }) {
  const theme = THEMES[pickTheme(item)];
  const Icon = theme.icon;
  const Secondary = theme.secondaryIcon;
  const len = item.title.length;
  const titleSize = len > 40 ? "text-[9px]" : len > 24 ? "text-[10px]" : "text-[11px]";

  return (
    <div
      aria-hidden
      className={`relative flex aspect-[2/3] h-full w-full flex-col items-center justify-center overflow-hidden px-1.5 py-2 ${theme.surface}`}
    >
      {theme.framed ? (
        <span className="pointer-events-none absolute inset-1 rounded-md border border-[#D4AF37]/40" />
      ) : null}
      {Secondary ? (
        <>
          <Secondary className={`pointer-events-none absolute left-1.5 top-1.5 h-2.5 w-2.5 ${theme.accent} opacity-50`} />
          <Secondary className={`pointer-events-none absolute bottom-1.5 right-1.5 h-2 w-2 ${theme.accent} opacity-40`} />
        </>
      ) : null}

      <Icon className={`h-4 w-4 ${theme.accent}`} />
      <span
        className={`mt-1.5 line-clamp-4 break-words text-center font-serif leading-tight ${titleSize} ${theme.title}`}
      >
        {item.title}
      </span>
      {item.year ? (
        <span className={`mt-1 text-[9px] leading-none ${theme.meta}`}>{item.year}</span>
      ) : null}
    </div>
  );
}
