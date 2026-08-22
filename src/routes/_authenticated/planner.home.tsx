import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Home, Palette, ShoppingBasket, Sparkles, PackageCheck, ArrowRight } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { usePeople } from "@/hooks/use-people";
import { areaStats, useHome, type HomeItem } from "@/hooks/use-home";
import { AreaCard } from "@/components/home/AreaCard";
import { AddArea } from "@/components/home/AddArea";
import { HomeItemRow } from "@/components/home/HomeItemRow";

export const Route = createFileRoute("/_authenticated/planner/home")({
  head: () => ({
    meta: [
      { title: "My Christmas Home — A Complete Christmas" },
      {
        name: "description",
        content:
          "Plan your Christmas decorating room by room: what to put up, what to buy, what you already have and who's doing it.",
      },
      { property: "og:title", content: "My Christmas Home — A Complete Christmas" },
      {
        property: "og:description",
        content: "Your Christmas decorating, organised area by area.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HomePlannerPage,
});

type TabKey = "home" | "buy" | "have";

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "My home", icon: Home },
  { key: "buy", label: "Need to buy", icon: ShoppingBasket },
  { key: "have", label: "Already have", icon: PackageCheck },
];

function HomePlannerPage() {
  const { user } = useAuth();
  const { people } = usePeople(user?.id);
  const home = useHome(user?.id);
  const [tab, setTab] = useState<TabKey>("home");
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const visibleAreas = useMemo(
    () => home.areas.filter((a) => showHidden || !a.is_hidden),
    [home.areas, showHidden],
  );
  const hiddenCount = home.areas.filter((a) => a.is_hidden).length;

  const areaName = (id: string) => home.areas.find((a) => a.id === id)?.name ?? "";

  const stillToDo = home.items.filter((i) => i.status !== "idea" && i.status !== "done").length;

  return (
    <div className="space-y-8">
      {/* Cream & gold header */}
      <header className="rounded-3xl border border-[color:var(--gold)]/40 bg-[color:var(--surface-card)] p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
          Home &amp; Decorations
        </p>
        <h1 className="mt-2 font-display text-[34px] leading-tight sm:text-5xl">My Christmas Home</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          Room by room, what you'd love to do this Christmas. Jot down a job, an idea or something to buy —
          a name on its own is plenty.
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[color:var(--muted-foreground)]">
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {visibleAreas.length} areas
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {home.items.length} items
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {stillToDo} still to do
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {home.needToBuy.length} to buy
          </span>
        </div>

        {/* Straight into the existing inspiration system — nothing duplicated here */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/inspire/looks" className="btn-planner justify-center sm:w-auto sm:px-6">
            <Palette className="h-4 w-4" />
            Choose your Christmas look
          </Link>
          <Link
            to="/inspire"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[color:var(--gold)]/40 px-5 text-sm text-[color:var(--foreground)]"
          >
            <Sparkles className="h-4 w-4" />
            Browse Christmas home inspiration
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-2" aria-label="Home planner sections">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={on ? "page" : undefined}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm transition ${
                on
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--foreground)]"
                  : "border-[color:var(--gold)]/30 text-[color:var(--muted-foreground)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {home.loading ? (
        <p className="text-sm text-[color:var(--muted-foreground)]">Loading your Christmas home…</p>
      ) : tab === "home" ? (
        <div className="space-y-4">
          {visibleAreas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              items={home.itemsByArea.get(area.id) ?? []}
              people={people}
              open={openArea === area.id}
              onToggle={() => setOpenArea((cur) => (cur === area.id ? null : area.id))}
              onRenameArea={(name) => home.updateArea(area.id, "name", name)}
              onHideArea={() => {
                home.updateArea(area.id, "is_hidden", !area.is_hidden);
                setOpenArea(null);
              }}
              onRemoveArea={() => home.removeArea(area.id)}
              onAddItem={(name) => void home.addItem({ area_id: area.id, name })}
              onUpdateItem={home.updateItem}
              onRemoveItem={home.removeItem}
            />
          ))}

          <AddArea onAdd={(name) => void home.addArea(name)} />

          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowHidden((s) => !s)}
              className="inline-flex min-h-[44px] items-center text-sm text-[color:var(--muted-foreground)] underline"
            >
              {showHidden ? "Hide tucked-away areas" : `Show ${hiddenCount} hidden area${hiddenCount === 1 ? "" : "s"}`}
            </button>
          )}
        </div>
      ) : (
        <FilteredList
          items={tab === "buy" ? home.needToBuy : home.alreadyHave}
          people={people}
          areaName={areaName}
          onUpdate={home.updateItem}
          onRemove={home.removeItem}
          empty={
            tab === "buy"
              ? "Nothing to buy yet. Set an item's status to \"Need to buy\" and it will appear here."
              : "Nothing recorded yet. Tick \"I already have this\" on an item to keep track of what's in the loft."
          }
        />
      )}
    </div>
  );
}

function FilteredList({
  items,
  people,
  areaName,
  onUpdate,
  onRemove,
  empty,
}: {
  items: HomeItem[];
  people: ReturnType<typeof usePeople>["people"];
  areaName: (id: string) => string;
  onUpdate: <K extends keyof HomeItem>(id: string, field: K, value: HomeItem[K]) => void;
  onRemove: (id: string) => void;
  empty: string;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-3xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-card)] p-6 text-sm text-[color:var(--muted-foreground)]">
        {empty}
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <HomeItemRow
          key={i.id}
          item={i}
          people={people}
          areaName={areaName(i.area_id)}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}

export { areaStats };
