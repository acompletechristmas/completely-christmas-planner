import { Search } from "lucide-react";

export type MusicFilterKey =
  | "all"
  | "songs"
  | "albums"
  | "playlists"
  | "favourites"
  | "annual";

interface MusicFiltersProps {
  value: MusicFilterKey;
  onChange: (value: MusicFilterKey) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const FILTERS: { key: MusicFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "songs", label: "Songs" },
  { key: "albums", label: "Albums" },
  { key: "playlists", label: "Playlist ideas" },
  { key: "favourites", label: "Favourites" },
  { key: "annual", label: "Every Christmas" },
];

export function MusicFilters({ value, onChange, search, onSearchChange }: MusicFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A3A4A]/40 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your music"
          className="w-full rounded-xl border border-[#D4AF37]/30 bg-white pl-9 pr-3 py-2.5 text-sm placeholder:text-[#2A3A4A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            className={`flex-shrink-0 px-3 py-2 rounded-full text-xs border min-h-[44px] transition-colors ${
              value === f.key
                ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                : "bg-white border-[#D4AF37]/30 text-[#2A3A4A]/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
