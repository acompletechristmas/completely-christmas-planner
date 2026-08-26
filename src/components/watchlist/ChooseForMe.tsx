import { useMemo, useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { TIMINGS } from "@/lib/watchlist/constants";
import { COLLECTIONS } from "@/lib/watchlist/collections";
import {
  MOOD_VOCABULARY,
  type AudienceKey,
  type CollectionKey,
  type MoodKey,
} from "@/lib/watchlist/vocabulary";
import {
  audienceLabel,
  curationBadge,
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

/** Short, human list of who might actually be watching. */
const AUDIENCES: AudienceKey[] = [
  "multigenerational",
  "adults",
  "couple",
  "young_children",
  "older_children",
  "teenagers",
  "adult_children",
  "alone",
];

/** The moods worth offering up front; the full vocabulary stays available in data. */
const OFFERED_MOODS: MoodKey[] = [
  "comedy",
  "romance",
  "cosy",
  "magical",
  "action",
  "nostalgic",
  "musical",
  "dark_comedy",
  "alternative",
];

const pill = (active: boolean) =>
  `px-3 py-2 rounded-full text-xs border min-h-[44px] transition-colors ${
    active
      ? "bg-[#D4AF37] text-white border-[#D4AF37]"
      : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]/80"
  }`;

export function ChooseForMe({ context, savedKeys, onAdd }: ChooseForMeProps) {
  const [audiences, setAudiences] = useState<AudienceKey[]>([]);
  const [moods, setMoods] = useState<MoodKey[]>([]);
  const [collection, setCollection] = useState<CollectionKey | "">("");
  const [timing, setTiming] = useState<string>("");

  const refinements: WatchlistRefinements = useMemo(
    () => ({
      audiences: audiences.length > 0 ? audiences : undefined,
      moods: moods.length > 0 ? moods : undefined,
      collection: collection || undefined,
      timing: timing || undefined,
      excludeSavedKeys: savedKeys,
    }),
    [audiences, moods, collection, timing, savedKeys],
  );

  const { heading, subheading, explanation, scored, items, totalAvailable } = useMemo(
    () => recommendWatchlistItems(context, refinements),
    [context, refinements],
  );

  const contextByKey = useMemo(
    () => new Map(scored.map((s) => [s.item.key, s.topContext])),
    [scored],
  );

  const handleSurprise = () => {
    const item = surpriseWatchlistItem(context, refinements);
    if (item) onAdd(watchlistItemToSavedFields(item));
  };

  const toggleAudience = (a: AudienceKey) =>
    setAudiences((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const toggleMood = (m: MoodKey) =>
    setMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 p-4 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">Who is watching?</p>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <button key={a} type="button" onClick={() => toggleAudience(a)} className={pill(audiences.includes(a))}>
                {audienceLabel(a)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">In the mood for?</p>
          <div className="flex flex-wrap gap-2">
            {OFFERED_MOODS.map((m) => {
              const label = MOOD_VOCABULARY.find((x) => x.key === m)?.label ?? m;
              return (
                <button key={m} type="button" onClick={() => toggleMood(m)} className={pill(moods.includes(m))}>
                  {label}
                </button>
              );
            })}
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
                className={pill(timing === t.key)}
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

      <div>
        <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">Collections</p>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {COLLECTIONS.map((c) => {
            const active = collection === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCollection((prev) => (prev === c.key ? "" : c.key))}
                className={`flex-shrink-0 w-56 text-left rounded-2xl border p-3 min-h-[44px] transition-colors ${
                  active
                    ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                    : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]"
                }`}
              >
                <span className="block font-serif text-sm">{c.title}</span>
                <span className={`block text-xs mt-1 ${active ? "text-white/80" : "text-[#2A3A4A]/60"}`}>
                  {c.subtitle}
                </span>
              </button>
            );
          })}
        </div>
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
          {items.map((item) => {
            const topContext = contextByKey.get(item.key);
            const badge = curationBadge(item, topContext);
            return (
              <div key={item.key} className="rounded-2xl bg-white border border-[#D4AF37]/30 p-4 shadow-sm">
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
                {badge && (
                  <span className="inline-block mt-3 px-2 py-1 rounded-full bg-[#D4AF37]/15 text-[#2A3A4A] text-xs border border-[#D4AF37]/30">
                    {badge}
                  </span>
                )}
                <p className="text-sm text-[#2A3A4A]/80 mt-3 leading-relaxed">{item.blurb}</p>
                <p className="text-xs text-[#2A3A4A]/60 mt-2">{describeWhy(item, audiences, topContext)}</p>
              </div>
            );
          })}
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
