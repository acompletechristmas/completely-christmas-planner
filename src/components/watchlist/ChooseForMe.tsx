import { useMemo, useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { MOODS, TIMINGS } from "@/lib/watchlist/constants";
import { type Audience, WATCHLIST_IDEAS } from "@/lib/watchlist/catalogue";
import {
  audienceLabel,
  describeWhy,
  recommendWatchlistItems,
  surpriseWatchlistItem,
  type HouseholdContext,
  watchlistItemToSavedFields,
  type WatchlistRefinements,
} from "@/lib/watchlist/recommend";
import type { NewWatchlistItem } from "@/hooks/use-watchlist";

interface ChooseForMeProps {
  context: HouseholdContext;
  savedKeys: string[];
  onAdd: (input: NewWatchlistItem) => void;
}

const AUDIENCES: Audience[] = [
  "young_children",
  "older_children",
  "teenagers",
  "young_adults",
  "couple",
  "adults_no_children",
  "mixed_ages",
  "extended",
  "alone",
];

export function ChooseForMe({ context, savedKeys, onAdd }: ChooseForMeProps) {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [timing, setTiming] = useState<string>("");

  const refinements: WatchlistRefinements = useMemo(
    () => ({
      audiences: audiences.length > 0 ? audiences : undefined,
      moods: moods.length > 0 ? (moods as WatchlistRefinements["moods"]) : undefined,
      timing: timing || undefined,
      excludeSavedKeys: savedKeys,
    }),
    [audiences, moods, timing, savedKeys],
  );

  const { heading, subheading, explanation, items, totalAvailable } = useMemo(
    () => recommendWatchlistItems(context, refinements),
    [context, refinements],
  );

  const handleSurprise = () => {
    const item = surpriseWatchlistItem(context, refinements);
    if (item) onAdd(watchlistItemToSavedFields(item));
  };

  const toggleAudience = (a: Audience) => {
    setAudiences((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const toggleMood = (m: string) => {
    setMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 p-4 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">Who is watching?</p>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAudience(a)}
                className={`px-3 py-2 rounded-full text-xs border min-h-[44px] transition-colors ${
                  audiences.includes(a)
                    ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                    : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]/80"
                }`}
              >
                {audienceLabel(a)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">Mood or style</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => toggleMood(m.key)}
                className={`px-3 py-2 rounded-full text-xs border min-h-[44px] transition-colors ${
                  moods.includes(m.key)
                    ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                    : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]/80"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">Timing</p>
          <div className="flex flex-wrap gap-2">
            {TIMINGS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTiming((prev) => (prev === t.key ? "" : t.key))}
                className={`px-3 py-2 rounded-full text-xs border min-h-[44px] transition-colors ${
                  timing === t.key
                    ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                    : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSurprise}
          className="w-full btn-planner flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Wand2 className="w-4 h-4" />
          Surprise me
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-serif text-lg text-[#2A3A4A]">{heading}</h3>
            <p className="text-sm text-[#2A3A4A]/70">{subheading}</p>
          </div>
        </div>
        <p className="text-xs text-[#2A3A4A]/50 italic">{explanation}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#D4AF37]/30 p-6 text-center">
          <p className="text-sm text-[#2A3A4A]/70">
            No suggestions match these filters. Try a different mood or audience.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl bg-white border border-[#D4AF37]/30 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-serif text-[#2A3A4A] text-base">{item.title}</h4>
                  <p className="text-xs text-[#2A3A4A]/60 mt-0.5">
                    {item.year ? `${item.year} · ` : ""}
                    {item.type.replace("tv_special", "TV special").replace("episode", "Festive episode")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAdd(watchlistItemToSavedFields(item))}
                  className="flex-shrink-0 px-3 py-2 rounded-full bg-[#D4AF37] text-white text-xs min-h-[44px] hover:bg-[#B5952F] transition-colors"
                >
                  Add to my watchlist
                </button>
              </div>
              <p className="text-sm text-[#2A3A4A]/80 mt-3 leading-relaxed">{item.blurb}</p>
              <p className="text-xs text-[#2A3A4A]/60 mt-2">{describeWhy(item, audiences)}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {item.moods.slice(0, 3).map((m) => (
                  <span
                    key={m}
                    className="px-2 py-1 rounded-full bg-[#D4AF37]/10 text-[#2A3A4A]/80 text-xs border border-[#D4AF37]/20"
                  >
                    {MOODS.find((x) => x.key === m)?.label ?? m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalAvailable > items.length && (
        <p className="text-center text-xs text-[#2A3A4A]/50">
          {totalAvailable} suggestions match your filters. Add some to see more.
        </p>
      )}
    </div>
  );
}
