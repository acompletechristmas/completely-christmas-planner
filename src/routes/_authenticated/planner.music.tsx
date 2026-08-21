import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Music, Sparkles } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { usePeople } from "@/hooks/use-people";
import { usePlannerSettings } from "@/hooks/use-planner-settings";
import { useMusic } from "@/hooks/use-music";
import { AddMusicItem } from "@/components/music/AddMusicItem";
import { MusicRow } from "@/components/music/MusicRow";
import { MusicFilters, type MusicFilterKey } from "@/components/music/MusicFilters";
import { SoundtrackBuilder } from "@/components/music/SoundtrackBuilder";
import { MOMENT_ORDER, momentLabel } from "@/lib/music/constants";
import { activePlanningYear } from "@/lib/food/constants";

export const Route = createFileRoute("/_authenticated/planner/music")({
  head: () => ({
    meta: [
      { title: "My Christmas Music — A Complete Christmas" },
      {
        name: "description",
        content:
          "Save the Christmas songs, albums and playlist ideas you want this year, and build a soundtrack that suits your household and the moment.",
      },
      { property: "og:title", content: "My Christmas Music — A Complete Christmas" },
      {
        property: "og:description",
        content: "Save your Christmas music and build a soundtrack for every moment of the season.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MusicPage,
});

type TabKey = "music" | "help";

function MusicPage() {
  const { user } = useAuth();
  const { people } = usePeople(user?.id);
  const { settings } = usePlannerSettings(user?.id);
  const { items, loading, add, update, toggle, remove } = useMusic(user?.id);
  const [tab, setTab] = useState<TabKey>("music");
  const [filter, setFilter] = useState<MusicFilterKey>("all");
  const [search, setSearch] = useState("");

  const peopleList = useMemo(() => people.map((p) => ({ id: p.id, name: p.name })), [people]);

  const savedKeys = useMemo(
    () => items.map((i) => i.suggestion_key).filter((k): k is string => Boolean(k)),
    [items],
  );

  const filtered = useMemo(() => {
    let result = items;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.artist ?? "").toLowerCase().includes(q) ||
          (i.notes ?? "").toLowerCase().includes(q),
      );
    }

    switch (filter) {
      case "songs":
        result = result.filter((i) => i.item_type === "song");
        break;
      case "albums":
        result = result.filter((i) => i.item_type === "album");
        break;
      case "playlists":
        result = result.filter((i) => i.item_type === "playlist_idea");
        break;
      case "favourites":
        result = result.filter((i) => i.is_favourite);
        break;
      case "annual":
        result = result.filter((i) => i.is_annual);
        break;
    }

    return result;
  }, [items, filter, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const key = item.moment || "any_time";
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return [...map.entries()].sort(
      (a, b) => MOMENT_ORDER.indexOf(a[0]) - MOMENT_ORDER.indexOf(b[0]),
    );
  }, [filtered]);

  const favouriteCount = items.filter((i) => i.is_favourite).length;
  const annualCount = items.filter((i) => i.is_annual).length;

  const householdContext = useMemo(
    () => ({ settings: settings ?? null, people: people ?? [] }),
    [settings, people],
  );

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-[color:var(--gold)]/40 bg-[color:var(--surface-card)] p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
          Christmas {activePlanningYear()}
        </p>
        <h1 className="mt-2 font-display text-[34px] leading-tight sm:text-5xl">My Christmas Music</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          Save the songs, albums and playlist ideas you want this Christmas — then let us suggest a
          soundtrack for decorating, dinner, the party or a quiet evening in.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[color:var(--muted-foreground)]">
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {favouriteCount} favourite{favouriteCount !== 1 ? "s" : ""}
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {annualCount} every Christmas
          </span>
        </div>
      </header>

      <div className="flex gap-2 border-b border-[color:var(--gold)]/30 pb-0">
        <button
          type="button"
          onClick={() => setTab("music")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium min-h-[44px] border-b-2 transition-colors ${
            tab === "music"
              ? "border-[color:var(--gold)] text-[color:var(--foreground)]"
              : "border-transparent text-[color:var(--muted-foreground)]"
          }`}
        >
          <Music className="w-4 h-4" />
          My music
        </button>
        <button
          type="button"
          onClick={() => setTab("help")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium min-h-[44px] border-b-2 transition-colors ${
            tab === "help"
              ? "border-[color:var(--gold)] text-[color:var(--foreground)]"
              : "border-transparent text-[color:var(--muted-foreground)]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Help me create the soundtrack
        </button>
      </div>

      {tab === "music" ? (
        <section className="space-y-6">
          <AddMusicItem onAdd={add} />
          <MusicFilters value={filter} onChange={setFilter} search={search} onSearchChange={setSearch} />

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-[color:var(--surface-card)] border border-[color:var(--gold)]/20 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl bg-[color:var(--surface-card)] border border-[color:var(--gold)]/30 p-8 text-center">
              <Music className="w-10 h-10 mx-auto text-[color:var(--gold)]/60 mb-3" />
              <h3 className="font-serif text-lg text-[color:var(--foreground)]">No music saved yet</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1 max-w-sm mx-auto">
                Add a song, album or playlist idea. Or switch to "Help me create the soundtrack".
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.map(([moment, rows]) => (
                <div key={moment} className="space-y-3">
                  <h2 className="text-xs uppercase tracking-[0.18em] text-[color:var(--gold-soft)]">
                    {momentLabel(moment)}
                  </h2>
                  {rows.map((item) => (
                    <MusicRow
                      key={item.id}
                      item={item}
                      people={peopleList}
                      onUpdate={update}
                      onToggle={toggle}
                      onRemove={remove}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <SoundtrackBuilder context={householdContext} savedKeys={savedKeys} onAdd={add} />
      )}
    </div>
  );
}
