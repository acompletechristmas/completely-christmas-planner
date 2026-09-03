import { Film } from "lucide-react";

import type { CatalogueTitle } from "@/lib/watchlist/catalogue";
import { watchlistItemToSavedFields } from "@/lib/watchlist/recommend";
import type { NewWatchlistItem } from "@/hooks/use-watchlist";

interface WatchCardProps {
  item: CatalogueTitle;
  /** Small curated-context badge (e.g. "Essential for a cosy night in"). */
  badge?: string | null;
  /** "Why this fits" line from the recommendation engine. Omit in search results. */
  why?: string;
  /** Visual lift for essential top picks. */
  topPick?: boolean;
  onAdd: (input: NewWatchlistItem) => void;
}

function typeLabel(type: CatalogueTitle["type"]): string {
  return type.replace("tv_special", "TV special").replace("episode", "Festive episode");
}

/**
 * Poster-ready card used by both the recommendation results and the local
 * catalogue search. The poster area holds a fixed 2:3 slot: a real image when
 * `posterUrl` exists, an elegant in-design-system placeholder otherwise.
 * The UK certificate badge renders only when a verified value is present.
 */
export function WatchCard({ item, badge, why, topPick = false, onAdd }: WatchCardProps) {
  return (
    <div
      className={`flex gap-4 rounded-2xl bg-white p-4 transition-shadow ${
        topPick
          ? "border-2 border-[#D4AF37]/70 shadow-[0_4px_16px_rgba(212,175,55,0.25)]"
          : "border border-[#D4AF37]/30 shadow-sm"
      }`}
    >
      {/* Poster slot — fixed 2:3 aspect, real artwork drops in without layout change */}
      <div className="w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#D4AF37]/30 sm:w-24">
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={`${item.title} poster`}
            loading="lazy"
            className="aspect-[2/3] h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex aspect-[2/3] h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#16233B] to-[#0F1726]"
          >
            <Film className="h-5 w-5 text-[#D4AF37]/70" />
            <span className="mt-2 px-1 text-center font-serif text-[11px] leading-tight text-[#F5EFE2]/90">
              {item.title}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-serif text-base text-[#2A3A4A]">{item.title}</h4>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[#2A3A4A]/60">
              {item.year ? <span>{item.year} ·</span> : null}
              <span>{typeLabel(item.type)}</span>
              {item.ukCertificate ? (
                <span
                  aria-label={`UK certificate ${item.ukCertificate}`}
                  className="inline-block rounded border border-[#2A3A4A]/50 px-1 py-px text-[10px] font-semibold leading-tight text-[#2A3A4A]"
                >
                  {item.ukCertificate}
                </span>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAdd(watchlistItemToSavedFields(item))}
            className="min-h-[44px] flex-shrink-0 rounded-full bg-[#D4AF37] px-3 py-2 text-xs text-white transition-colors hover:bg-[#B5952F]"
          >
            Add to my watchlist
          </button>
        </div>
        {badge ? (
          <span className="mt-3 inline-block rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/15 px-2 py-1 text-xs text-[#2A3A4A]">
            {badge}
          </span>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-[#2A3A4A]/80">{item.blurb}</p>
        {why ? <p className="mt-2 text-xs text-[#2A3A4A]/60">{why}</p> : null}
      </div>
    </div>
  );
}
