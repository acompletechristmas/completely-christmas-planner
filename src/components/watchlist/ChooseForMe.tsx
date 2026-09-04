import { useMemo, useState } from "react";
import { ChevronDown, Clapperboard, Sparkles } from "lucide-react";
import { TIMINGS } from "@/lib/watchlist/constants";
import { COLLECTIONS } from "@/lib/watchlist/collections";
import {
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

import { WatchCard } from "@/components/watchlist/WatchCard";

interface ChooseForMeProps {
  context: HouseholdContext;
  savedKeys: string[];
  onAdd: (input: NewWatchlistItem) => void;
}

/** The five main audience choices, shown first. */
const PRIMARY_AUDIENCES: { label: string; keys: AudienceKey[] }[] = [
  { label: "Everyone", keys: ["multigenerational"] },
  { label: "Adults", keys: ["adults"] },
  { label: "Kids", keys: ["young_children", "older_children"] },
  { label: "Couple", keys: ["couple"] },
  { label: "Just me", keys: ["alone"] },
];

/** Extra audience choices behind the secondary "More options" control. */
const EXTRA_AUDIENCES: AudienceKey[] = ["teenagers", "young_adults", "adult_children", "mixed_ages"];

/** The seven moods offered up front, with friendly labels. */
const OFFERED_MOODS: { key: MoodKey; label: string }[] = [
  { key: "comedy", label: "Funny" },
  { key: "romance", label: "Romantic" },
  { key: "cosy", label: "Cosy" },
  { key: "magical", label: "Magical" },
  { key: "action", label: "Action" },
  { key: "nostalgic", label: "Nostalgic" },
  { key: "alternative", label: "Something different" },
];

const pill = (active: boolean) =>
  `px-4 py-2 rounded-full text-[13px] border min-h-[44px] transition-colors ${
    active
      ? "bg-[#D4AF37] text-white border-[#D4AF37] font-medium shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
      : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]/80 hover:border-[#D4AF37]/60"
  }`;

export function ChooseForMe({ context, savedKeys, onAdd }: ChooseForMeProps) {
  const [audiences, setAudiences] = useState<AudienceKey[]>([]);
  const [moods, setMoods] = useState<MoodKey[]>([]);
  const [collection, setCollection] = useState<CollectionKey | "">("");
  const [timing, setTiming] = useState<string>("");
  const [showMoreAudiences, setShowMoreAudiences] = useState(false);
  const [showTiming, setShowTiming] = useState(false);

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

  const { heading, scored, items, totalAvailable } = useMemo(
    () => recommendWatchlistItems(context, refinements),
    [context, refinements],
  );

  const contextByKey = useMemo(
    () => new Map(scored.map((s) => [s.item.key, s.topContext])),
    [scored],
  );

  const selectedContexts = useMemo(
    () => [...audiences, ...moods, ...(collection ? [collection] : [])],
    [audiences, moods, collection],
  );

  const handleSurprise = () => {
    const item = surpriseWatchlistItem(context, refinements);
    if (item) onAdd(watchlistItemToSavedFields(item));
  };

  const isAudienceGroupActive = (keys: AudienceKey[]) => keys.every((k) => audiences.includes(k));

  const toggleAudienceGroup = (keys: AudienceKey[]) =>
    setAudiences((prev) =>
      isAudienceGroupActive(keys)
        ? prev.filter((x) => !keys.includes(x))
        : [...new Set([...prev, ...keys])],
    );

  const toggleAudience = (a: AudienceKey) =>
    setAudiences((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const toggleMood = (m: MoodKey) =>
    setMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const timingLabelFor = (key: string) => TIMINGS.find((t) => t.key === key)?.label ?? key;

  return (
    <div className="space-y-7">
      {/* Opening */}
      <div className="text-center">
        <h3 className="font-serif text-2xl text-[#2A3A4A]">What shall we watch?</h3>
        <p className="mt-2 text-sm text-[#2A3A4A]/70">
          Tell us who's watching and what you're in the mood for, and we'll find something festive.
        </p>
      </div>

      {/* Main choices */}
      <div className="rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 p-4 sm:p-5 space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">Who's watching?</p>
          <div className="flex flex-wrap gap-2">
            {PRIMARY_AUDIENCES.map((group) => (
              <button
                key={group.label}
                type="button"
                onClick={() => toggleAudienceGroup(group.keys)}
                className={pill(isAudienceGroupActive(group.keys))}
              >
                {group.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowMoreAudiences((v) => !v)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-[#2A3A4A]/60 hover:text-[#2A3A4A] min-h-[44px]"
          >
            More options
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showMoreAudiences ? "rotate-180" : ""}`}
            />
          </button>
          {showMoreAudiences && (
            <div className="mt-1 flex flex-wrap gap-2">
              {EXTRA_AUDIENCES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAudience(a)}
                  className={pill(audiences.includes(a))}
                >
                  {audienceLabel(a)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">
            What are you in the mood for?
          </p>
          <div className="flex flex-wrap gap-2">
            {OFFERED_MOODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => toggleMood(m.key)}
                className={pill(moods.includes(m.key))}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/20 pt-3">
          <button
            type="button"
            onClick={() => setShowTiming((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-[#2A3A4A]/60 hover:text-[#2A3A4A] min-h-[44px]"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showTiming ? "rotate-180" : ""}`}
            />
            {timing ? `Watching: ${timingLabelFor(timing)}` : "Choose when you're watching"}
          </button>
          {showTiming && (
            <div className="mt-1 flex flex-wrap gap-2">
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
          )}
        </div>
      </div>

      {/* Collections as discovery */}
      <div>
        <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">
          Or browse something special
        </p>
        <div className="relative -mx-4 sm:mx-0">
          <div className="flex gap-3 overflow-x-auto pb-2 px-4 sm:px-0 [scrollbar-width:thin]">
            {COLLECTIONS.map((c) => {
              const active = collection === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCollection((prev) => (prev === c.key ? "" : c.key))}
                  className={`flex-shrink-0 w-52 text-left rounded-2xl border p-3 min-h-[44px] transition-colors ${
                    active
                      ? "bg-[#D4AF37] text-white border-[#D4AF37] shadow-[0_2px_10px_rgba(212,175,55,0.35)]"
                      : "bg-white border-[#D4AF37]/30 text-[#2A3A4A] hover:border-[#D4AF37]/60"
                  }`}
                >
                  <span className="block font-serif text-sm">{c.title}</span>
                  <span
                    className={`block text-xs mt-1 ${active ? "text-white/85" : "text-[#2A3A4A]/60"}`}
                  >
                    {c.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#FAF7F2] to-transparent sm:hidden" />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
            <h3 className="font-serif text-lg text-[#2A3A4A]">
              {selectedContexts.length > 0 ? "Our picks for you" : heading}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleSurprise}
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-white px-3 py-1.5 text-xs text-[#2A3A4A] min-h-[44px] hover:border-[#D4AF37] transition-colors"
          >
            <Clapperboard className="w-3.5 h-3.5 text-[#D4AF37]" />
            Surprise me
          </button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#D4AF37]/30 p-6 text-center">
            <p className="text-sm text-[#2A3A4A]/70">
              No suggestions match these choices. Try a different mood or audience.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => {
              const topContext = contextByKey.get(item.key);
              const badge = curationBadge(item, topContext);
              const isTopPick =
                selectedContexts.length > 0 &&
                selectedContexts.some((c) => item.strength[c as keyof typeof item.strength] === "essential");
              return (
                <WatchCard
                  key={item.key}
                  item={item}
                  badge={badge}
                  why={describeWhy(item, audiences, topContext)}
                  topPick={isTopPick}
                  onAdd={onAdd}
                />
              );
            })}
          </div>
        )}

        {totalAvailable > items.length && (
          <p className="text-center text-xs text-[#2A3A4A]/50">
            {totalAvailable} suggestions match your choices. Add some to see more.
          </p>
        )}
      </div>
    </div>
  );
}
