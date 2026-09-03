import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { WATCHLIST_IDEAS, type CatalogueTitle } from "@/lib/watchlist/catalogue";
import { AUDIENCES, MOOD_VOCABULARY } from "@/lib/watchlist/vocabulary";
import { WatchCard } from "@/components/watchlist/WatchCard";
import type { NewWatchlistItem } from "@/hooks/use-watchlist";

interface SearchCatalogueProps {
  savedKeys: string[];
  onAdd: (input: NewWatchlistItem) => void;
}

/** Friendly labels for catalogue context keys, so "romance" finds romantic titles. */
const CONTEXT_LABELS: Record<string, string> = Object.fromEntries(
  [...AUDIENCES, ...MOOD_VOCABULARY].map((x) => [x.key, x.label.toLowerCase()]),
);

function matches(item: CatalogueTitle, q: string): boolean {
  if (item.title.toLowerCase().includes(q)) return true;
  if (/^\d{4}$/.test(q) && item.year === Number(q)) return true;
  return Object.keys(item.strength).some((key) => CONTEXT_LABELS[key]?.includes(q));
}

/**
 * "I know what I want" — purely local, case-insensitive search over the
 * existing catalogue. No APIs, no external search, and entirely independent
 * of the "What shall we watch?" recommendation filters below.
 */
export function SearchCatalogue({ savedKeys, onAdd }: SearchCatalogueProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return WATCHLIST_IDEAS.filter(
      (item) => !savedKeys.includes(item.key) && matches(item, q),
    );
  }, [query, savedKeys]);

  return (
    <section aria-label="Search films and TV">
      <label
        htmlFor="watchlist-search"
        className="mb-2 block text-xs uppercase tracking-wide text-[#2A3A4A]/50"
      >
        Search films &amp; TV
      </label>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4AF37]"
        />
        <input
          id="watchlist-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a Christmas film or TV favourite…"
          className="min-h-[44px] w-full rounded-full border border-[#D4AF37]/30 bg-white py-2.5 pl-10 pr-4 text-sm text-[#2A3A4A] placeholder:text-[#2A3A4A]/40 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
        />
      </div>

      {results !== null && (
        <div className="mt-4 space-y-3" aria-live="polite">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-[#D4AF37]/30 bg-white p-6 text-center">
              <p className="text-sm text-[#2A3A4A]/70">
                We couldn't find that in our Christmas collection yet.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <WatchCard key={item.key} item={item} onAdd={onAdd} />
            ))
          )}
        </div>
      )}
    </section>
  );
}
