import { ChevronDown, EyeOff, Sparkles, Trash2 } from "lucide-react";
import { HomeItemRow } from "@/components/home/HomeItemRow";
import { AddHomeItem } from "@/components/home/AddHomeItem";
import { areaStats, type HomeArea, type HomeItem } from "@/hooks/use-home";
import type { Person } from "@/hooks/use-people";

export function AreaCard({
  area,
  items,
  people,
  open,
  onToggle,
  onRenameArea,
  onHideArea,
  onRemoveArea,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: {
  area: HomeArea;
  items: HomeItem[];
  people: Person[];
  open: boolean;
  onToggle: () => void;
  onRenameArea: (name: string) => void;
  onHideArea: () => void;
  onRemoveArea: () => void;
  onAddItem: (name: string) => void;
  onUpdateItem: <K extends keyof HomeItem>(id: string, field: K, value: HomeItem[K]) => void;
  onRemoveItem: (id: string) => void;
}) {
  const stats = areaStats(items);

  return (
    <section
      className={`rounded-3xl border bg-[color:var(--surface-card)] p-4 sm:p-5 ${
        stats.complete ? "border-[color:var(--gold)]/70" : "border-[color:var(--gold)]/30"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-[44px] w-full items-center gap-3 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[20px] leading-tight">{area.name}</span>
          <span className="mt-1 block text-[12px] text-[color:var(--muted-foreground)]">
            {stats.total === 0
              ? "Nothing here yet"
              : stats.complete
                ? "All done"
                : `${stats.total} item${stats.total === 1 ? "" : "s"} · ${stats.toDo} to do${
                    stats.toBuy ? ` · ${stats.toBuy} to buy` : ""
                  }`}
          </span>
        </span>
        {stats.complete && (
          <Sparkles className="h-4 w-4 shrink-0 text-[color:var(--gold)]" aria-hidden="true" />
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[color:var(--gold-soft)] transition ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-soft)]">
              Area name
            </span>
            <input
              value={area.name}
              onChange={(e) => onRenameArea(e.target.value)}
              className="input-food"
              aria-label="Area name"
            />
          </label>

          {items.length > 0 && (
            <ul className="space-y-2">
              {items.map((i) => (
                <HomeItemRow
                  key={i.id}
                  item={i}
                  people={people}
                  onUpdate={onUpdateItem}
                  onRemove={onRemoveItem}
                />
              ))}
            </ul>
          )}

          <AddHomeItem onAdd={onAddItem} />

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={onHideArea}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[color:var(--muted-foreground)]"
            >
              <EyeOff className="h-4 w-4" /> Hide this area
            </button>
            <button
              type="button"
              onClick={onRemoveArea}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[color:var(--muted-foreground)]"
            >
              <Trash2 className="h-4 w-4" /> Remove area
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
