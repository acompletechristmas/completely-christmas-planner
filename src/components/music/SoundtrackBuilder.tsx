import { useMemo, useState } from "react";
import { Check, Music, Sparkles, Wand2 } from "lucide-react";
import { MOMENTS, MUSIC_MOODS, itemTypeLabel, musicMoodLabel } from "@/lib/music/constants";
import type { MusicMood } from "@/lib/music/catalogue";
import {
  type HouseholdContext,
  musicIdeaToSavedFields,
  recommendMusic,
  surpriseMusicItem,
} from "@/lib/music/recommend";
import type { NewMusicItem } from "@/hooks/use-music";

interface SoundtrackBuilderProps {
  context: HouseholdContext;
  savedKeys: string[];
  onAdd: (input: NewMusicItem) => void;
}

export function SoundtrackBuilder({ context, savedKeys, onAdd }: SoundtrackBuilderProps) {
  const [moment, setMoment] = useState("");
  const [moods, setMoods] = useState<MusicMood[]>([]);
  const [limit, setLimit] = useState(12);

  const refinements = useMemo(
    () => ({
      moment: moment || undefined,
      moods: moods.length > 0 ? moods : undefined,
      excludeSavedKeys: savedKeys,
      limit,
    }),
    [moment, moods, savedKeys, limit],
  );

  const { heading, subheading, explanation, items, totalAvailable } = useMemo(
    () => recommendMusic(context, refinements),
    [context, refinements],
  );

  const toggleMood = (m: MusicMood) =>
    setMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const handleSurprise = () => {
    const idea = surpriseMusicItem(context, refinements);
    if (idea) onAdd(musicIdeaToSavedFields(idea, moment || undefined));
  };

  const handleAddAll = () => {
    for (const idea of items) onAdd(musicIdeaToSavedFields(idea, moment || undefined));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 p-4 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">
            What are we creating music for?
          </p>
          <div className="flex flex-wrap gap-2">
            {MOMENTS.filter((m) => m.key !== "any_time").map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMoment((prev) => (prev === m.key ? "" : m.key))}
                className={`px-3 py-2 rounded-full text-xs border min-h-[44px] transition-colors ${
                  moment === m.key
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
          <p className="text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-2">
            What sort of feel? (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {MUSIC_MOODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => toggleMood(m.key as MusicMood)}
                className={`px-3 py-2 rounded-full text-xs border min-h-[44px] transition-colors ${
                  moods.includes(m.key as MusicMood)
                    ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                    : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]/80"
                }`}
              >
                {m.label}
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
        <p className="text-[11px] text-[#2A3A4A]/50">
          A suggested soundtrack to build yourself — we don't create streaming playlists.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#D4AF37]/30 p-6 text-center">
          <p className="text-sm text-[#2A3A4A]/70">
            No suggestions left for those choices. Try a different moment or feel.
          </p>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={handleAddAll}
            className="w-full rounded-full border border-[#D4AF37] bg-white text-[#2A3A4A] text-sm min-h-[44px] px-4 hover:bg-[#D4AF37]/10 transition-colors"
          >
            Add all {items.length} to my music
          </button>

          <div className="grid gap-4">
            {items.map((idea) => (
              <div key={idea.key} className="rounded-2xl bg-white border border-[#D4AF37]/30 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-serif text-[#2A3A4A] text-base leading-tight">{idea.title}</h4>
                    <p className="text-xs text-[#2A3A4A]/60 mt-0.5">
                      {idea.artist ? `${idea.artist} · ` : ""}
                      {itemTypeLabel(idea.type)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAdd(musicIdeaToSavedFields(idea, moment || undefined))}
                    className="flex-shrink-0 px-3 py-2 rounded-full bg-[#D4AF37] text-white text-xs min-h-[44px] hover:bg-[#B5952F] transition-colors"
                  >
                    Add to my music
                  </button>
                </div>
                <p className="text-sm text-[#2A3A4A]/80 mt-3 leading-relaxed">{idea.line}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {idea.moods.slice(0, 3).map((m) => (
                    <span
                      key={m}
                      className="px-2 py-1 rounded-full bg-[#D4AF37]/10 text-[#2A3A4A]/80 text-xs border border-[#D4AF37]/20"
                    >
                      {musicMoodLabel(m)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {totalAvailable > items.length && (
        <button
          type="button"
          onClick={() => setLimit((l) => l + 12)}
          className="w-full flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white text-[#2A3A4A]/80 text-sm min-h-[44px] px-4"
        >
          <Music className="w-4 h-4" />
          Show me more
        </button>
      )}

      {savedKeys.length > 0 && (
        <p className="flex items-center justify-center gap-2 text-center text-xs text-[#2A3A4A]/50">
          <Check className="w-3.5 h-3.5" />
          {savedKeys.length} suggestion{savedKeys.length === 1 ? "" : "s"} already in your music.
        </p>
      )}
    </div>
  );
}
