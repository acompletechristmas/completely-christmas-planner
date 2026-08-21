import { useState } from "react";
import { ChevronDown, ChevronUp, Heart, RotateCcw, Trash2 } from "lucide-react";
import { ITEM_TYPES, MOMENTS, itemTypeLabel, momentLabel, musicMoodLabel } from "@/lib/music/constants";
import type { MusicItem } from "@/hooks/use-music";

interface MusicRowProps {
  item: MusicItem;
  people: { id: string; name: string }[];
  onUpdate: <K extends keyof MusicItem>(id: string, field: K, value: MusicItem[K]) => void;
  onToggle: <K extends "is_favourite" | "is_annual">(id: string, field: K, value: boolean) => void;
  onRemove: (id: string) => void;
}

export function MusicRow({ item, people, onUpdate, onToggle, onRemove }: MusicRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm overflow-hidden">
      <div className="p-4 flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-[#2A3A4A] text-base leading-tight">{item.title}</h3>
          <p className="text-xs text-[#2A3A4A]/60 mt-0.5 truncate">
            {item.artist ? `${item.artist} · ` : ""}
            {itemTypeLabel(item.item_type)}
            {item.moment && item.moment !== "any_time" ? ` · ${momentLabel(item.moment)}` : ""}
          </p>
          {item.moods.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.moods.slice(0, 3).map((m) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#2A3A4A]/80 text-[11px] border border-[#D4AF37]/20"
                >
                  {musicMoodLabel(m)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onToggle(item.id, "is_favourite", !item.is_favourite)}
            className={`p-2 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${
              item.is_favourite ? "text-[#D4AF37]" : "text-[#2A3A4A]/30 hover:text-[#D4AF37]"
            }`}
            aria-label={item.is_favourite ? "Remove favourite" : "Mark as favourite"}
          >
            <Heart className={`w-5 h-5 ${item.is_favourite ? "fill-current" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="p-2 rounded-full text-[#2A3A4A]/60 hover:text-[#2A3A4A] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={open ? "Hide details" : "Show details"}
          >
            {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#D4AF37]/20 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">Artist</label>
              <input
                type="text"
                value={item.artist ?? ""}
                onChange={(e) => onUpdate(item.id, "artist", e.target.value || null)}
                placeholder="Artist or choir"
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">Type</label>
              <select
                value={item.item_type}
                onChange={(e) => onUpdate(item.id, "item_type", e.target.value as MusicItem["item_type"])}
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] px-3 py-2 text-sm"
              >
                {ITEM_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">
                When it's for
              </label>
              <select
                value={item.moment ?? "any_time"}
                onChange={(e) => onUpdate(item.id, "moment", e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] px-3 py-2 text-sm"
              >
                {MOMENTS.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">Who it's for</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {people.map((p) => {
                const selected = item.participants.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? item.participants.filter((id) => id !== p.id)
                        : [...item.participants, p.id];
                      onUpdate(item.id, "participants", next);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs border min-h-[36px] transition-colors ${
                      selected
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#2A3A4A]"
                        : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]/70"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={item.participant_note ?? ""}
              onChange={(e) => onUpdate(item.id, "participant_note", e.target.value || null)}
              placeholder="e.g. Everyone, or just the children"
              className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">Notes</label>
            <textarea
              value={item.notes ?? ""}
              onChange={(e) => onUpdate(item.id, "notes", e.target.value || null)}
              placeholder="Where it fits, who loves it, what to play it on..."
              rows={2}
              className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] px-3 py-2 text-sm resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onToggle(item.id, "is_annual", !item.is_annual)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs border min-h-[44px] transition-colors ${
                item.is_annual
                  ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#2A3A4A]"
                  : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]/70"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              We play this every Christmas
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="ml-auto flex items-center gap-2 px-3 py-2 rounded-full text-xs border border-red-200 text-red-600 min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
