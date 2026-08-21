import { useState } from "react";
import { Plus } from "lucide-react";
import { ITEM_TYPES, MOMENTS } from "@/lib/music/constants";
import type { MusicItemType, NewMusicItem } from "@/hooks/use-music";

interface AddMusicItemProps {
  onAdd: (input: NewMusicItem) => void;
}

export function AddMusicItem({ onAdd }: AddMusicItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [itemType, setItemType] = useState<MusicItemType>("song");
  const [moment, setMoment] = useState("any_time");
  const [more, setMore] = useState(false);

  const reset = () => {
    setTitle("");
    setArtist("");
    setItemType("song");
    setMoment("any_time");
    setMore(false);
    setExpanded(false);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      artist: artist.trim() || null,
      item_type: itemType,
      moment,
    });
    reset();
  };

  return (
    <div className="rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 p-4 shadow-sm">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="btn-planner w-full flex items-center justify-center gap-2 min-h-[44px]"
          aria-label="Add music"
        >
          <Plus className="w-5 h-5" />
          <span>Add music</span>
        </button>
      ) : (
        <div className="space-y-3">
          <label htmlFor="music-title" className="sr-only">
            Title
          </label>
          <input
            id="music-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") reset();
            }}
            placeholder="A song, album or playlist idea"
            className="w-full rounded-xl border border-[#D4AF37]/40 bg-white px-4 py-3 text-sm placeholder:text-[#2A3A4A]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
            autoFocus
          />

          {!more ? (
            <button
              type="button"
              onClick={() => setMore(true)}
              className="text-xs text-[#2A3A4A]/60 underline min-h-[44px]"
            >
              Add artist, type or moment
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist (optional)"
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-white px-3 py-2.5 text-sm"
              />
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as MusicItemType)}
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-white px-3 py-2.5 text-sm"
                aria-label="Type"
              >
                {ITEM_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
              <select
                value={moment}
                onChange={(e) => setMoment(e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-white px-3 py-2.5 text-sm sm:col-span-2"
                aria-label="Moment"
              >
                {MOMENTS.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="btn-planner flex-1 min-h-[44px] disabled:opacity-50"
            >
              Add to my music
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 text-sm text-[#2A3A4A]/70 hover:text-[#2A3A4A] min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
