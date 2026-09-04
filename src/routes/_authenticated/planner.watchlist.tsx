import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Film, Sparkles } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { usePeople } from "@/hooks/use-people";
import { usePlannerSettings } from "@/hooks/use-planner-settings";
import { useWatchlist } from "@/hooks/use-watchlist";
import { AddWatchItem } from "@/components/watchlist/AddWatchItem";
import { WatchRow } from "@/components/watchlist/WatchRow";
import { WatchlistFilters } from "@/components/watchlist/WatchlistFilters";
import { ChooseForMe } from "@/components/watchlist/ChooseForMe";
import { SearchCatalogue } from "@/components/watchlist/SearchCatalogue";
import { typeLabel } from "@/lib/watchlist/constants";
import { activePlanningYear } from "@/lib/food/constants";

export const Route = createFileRoute("/_authenticated/planner/watchlist")({
  head: () => ({
    meta: [
      { title: "My Christmas Watchlist — A Complete Christmas" },
      {
        name: "description",
        content:
          "Plan what to watch this Christmas. Save your own festive films and TV, or discover cosy recommendations for your household.",
      },
      { property: "og:title", content: "My Christmas Watchlist — A Complete Christmas" },
      {
        property: "og:description",
        content: "Save your Christmas viewing and find recommendations suited to your household.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WatchlistPage,
});

type TabKey = "watchlist" | "help";
type FilterKey = "all" | "films" | "tv" | "not_watched" | "watched" | "favourites" | "annual";

function WatchlistPage() {
  const { user } = useAuth();
  const { people } = usePeople(user?.id);
  const { settings } = usePlannerSettings(user?.id);
  const { items, loading, add, update, toggle, remove } = useWatchlist(user?.id);
  const [tab, setTab] = useState<TabKey>("watchlist");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const peopleList = useMemo(
    () => people.map((p) => ({ id: p.id, name: p.name })),
    [people],
  );

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
          (i.note ?? "").toLowerCase().includes(q) ||
          i.moods.some((m) => m.toLowerCase().includes(q)),
      );
    }

    switch (filter) {
      case "films":
        result = result.filter((i) => i.content_type === "film");
        break;
      case "tv":
        result = result.filter((i) =>
          ["tv_special", "episode", "series"].includes(i.content_type ?? ""),
        );
        break;
      case "not_watched":
        result = result.filter((i) => !i.watched);
        break;
      case "watched":
        result = result.filter((i) => i.watched);
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

  const watchedCount = items.filter((i) => i.watched).length;
  const favouriteCount = items.filter((i) => i.is_favourite).length;
  const annualCount = items.filter((i) => i.is_annual).length;

  const householdContext = useMemo(
    () => ({
      settings: settings ?? null,
      people: people ?? [],
    }),
    [settings, people],
  );

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-[color:var(--gold)]/40 bg-[color:var(--surface-card)] p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
          Christmas {activePlanningYear()}
        </p>
        <h1 className="mt-2 font-display text-[34px] leading-tight sm:text-5xl">My Christmas Watchlist</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          Save the Christmas films, TV specials and festive episodes you want to watch. Or let us suggest something
          that fits your household.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[color:var(--muted-foreground)]">
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {items.length} {items.length === 1 ? "title" : "titles"}
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {watchedCount} watched
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {favouriteCount} favourite{favouriteCount !== 1 ? "s" : ""}
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {annualCount} every Christmas
          </span>
        </div>
      </header>

      {/* "I know what I want" — shared top-level catalogue search, above the tabs */}
      <SearchCatalogue savedKeys={savedKeys} onAdd={add} />

      <div className="flex gap-2 border-b border-[color:var(--gold)]/30 pb-0">
        <button
          type="button"
          onClick={() => setTab("watchlist")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium min-h-[44px] border-b-2 transition-colors ${
            tab === "watchlist"
              ? "border-[color:var(--gold)] text-[color:var(--foreground)]"
              : "border-transparent text-[color:var(--muted-foreground)]"
          }`}
        >
          <Film className="w-4 h-4" />
          My watchlist
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
          Help me choose
        </button>
      </div>

      {tab === "watchlist" ? (
        <section className="space-y-6">
          <AddWatchItem onAdd={add} />
          <WatchlistFilters
            value={filter}
            onChange={setFilter}
            search={search}
            onSearchChange={setSearch}
          />

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
              <Film className="w-10 h-10 mx-auto text-[color:var(--gold)]/60 mb-3" />
              <h3 className="font-serif text-lg text-[color:var(--foreground)]">Your watchlist is empty</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1 max-w-sm mx-auto">
                Add a Christmas film, TV special or festive episode. Or switch to "Help me choose" for suggestions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <WatchRow
                  key={item.id}
                  item={item}
                  people={peopleList}
                  onUpdate={update}
                  onToggle={toggle}
                  onRemove={remove}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <ChooseForMe
          context={householdContext}
          savedKeys={savedKeys}
          onAdd={add}
        />
      )}
    </div>
  );
}
