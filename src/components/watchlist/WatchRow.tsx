import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  RotateCcw,
  Star,
  Trash2,
} from "lucide-react";
import { CONTENT_TYPES, TIMINGS, moodLabel, typeLabel } from "@/lib/watchlist/constants";
import type { WatchlistItem } from "@/hooks/use-watchlist";

interface WatchRowProps {
  item: WatchlistItem;
  people: { id: string; name: string }[];
  onUpdate: <K extends keyof WatchlistItem>(id: string, field: K, value: WatchlistItem[K]) => void;
  onToggle: <K extends "watched" | "is_favourite" | "is_annual">(
    id: string,
    field: K,
    value: boolean,
  ) => void;
  onRemove: (id: string) => void;
}

export function WatchRow({ item, people, onUpdate, onToggle, onRemove }: WatchRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm overflow-hidden">
      <div className="p-4 flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(item.id, "watched", !item.watched)}
          className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px] ${
            item.watched
              ? "bg-[#D4AF37] border-[#D4AF37] text-white"
              : "border-[#D4AF37]/40 text-transparent hover:border-[#D4AF37]"
          }`}
          aria-label={item.watched ? "Mark not watched" : "Mark watched"}
        >
          {item.watched && <span className="text-sm">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className={`font-serif text-[#2A3A4A] text-base leading-tight ${
                  item.watched ? "line-through opacity-60" : ""
                }`}
              >
                {item.title}
              </h3>
              <p className="text-xs text-[#2A3A4A]/60 mt-0.5 truncate">
                {item.release_year ? `${item.release_year} · ` : ""}
                {typeLabel(item.content_type)}
                {item.timing && item.timing !== "any_time" ? ` · ${TIMINGS.find((t) => t.key === item.timing)?.label ?? item.timing}` : ""}
              </p>
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
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#D4AF37]/20 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">
                Content type
              </label>
              <select
                value={item.content_type ?? ""}
                onChange={(e) =>
                  onUpdate(
                    item.id,
                    "content_type",
                    e.target.value ? (e.target.value as WatchlistItem["content_type"]) : null,
                  )
                }
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] px-3 py-2 text-sm"
              >
                <option value="">—</option>
                {CONTENT_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">
                Year
              </label>
              <input
                type="number"
                value={item.release_year ?? ""}
                onChange={(e) =>
                  onUpdate(
                    item.id,
                    "release_year",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                placeholder="Year"
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">
                When to watch
              </label>
              <select
                value={item.timing ?? "any_time"}
                onChange={(e) => onUpdate(item.id, "timing", e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] px-3 py-2 text-sm"
              >
                {TIMINGS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">
                Age guidance
              </label>
              <input
                type="text"
                value={item.age_guidance ?? ""}
                onChange={(e) => onUpdate(item.id, "age_guidance", e.target.value || null)}
                placeholder="e.g. U, PG, 12+"
                className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#FAF7F2] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">
              Participants
            </label>
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
            <label className="block text-xs uppercase tracking-wide text-[#2A3A4A]/50 mb-1.5">
              Notes
            </label>
            <textarea
              value={item.note ?? ""}
              onChange={(e) => onUpdate(item.id, "note", e.target.value || null)}
              placeholder="Streaming service, mood, why you want to watch it..."
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
              We watch this every Christmas
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
