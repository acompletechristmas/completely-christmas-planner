import { useState } from "react";
import { Plus } from "lucide-react";
import type { NewWatchlistItem } from "@/hooks/use-watchlist";

interface AddWatchItemProps {
  onAdd: (input: NewWatchlistItem) => void;
}

export function AddWatchItem({ onAdd }: AddWatchItemProps) {
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim() });
    setTitle("");
    setExpanded(false);
  };

  return (
    <div className="rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 p-4 shadow-sm">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="btn-planner w-full flex items-center justify-center gap-2 min-h-[44px]"
          aria-label="Add something to watch"
        >
          <Plus className="w-5 h-5" />
          <span>Add something to watch</span>
        </button>
      ) : (
        <div className="space-y-3">
          <label htmlFor="watch-title" className="sr-only">
            Title
          </label>
          <input
            id="watch-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") {
                setTitle("");
                setExpanded(false);
              }
            }}
            placeholder="What do you want to watch?"
            className="w-full rounded-xl border border-[#D4AF37]/40 bg-white px-4 py-3 text-sm placeholder:text-[#2A3A4A]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="btn-planner flex-1 min-h-[44px] disabled:opacity-50"
            >
              Add to watchlist
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setExpanded(false);
              }}
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
