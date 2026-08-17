import { useState } from "react";
import { ChevronDown, Trash2, ShoppingBasket, CalendarDays, User } from "lucide-react";
import { DIETARY_TAGS, STATUSES, dietaryLabel, statusLabel } from "@/lib/food/constants";
import type { FoodItem } from "@/lib/food/types";
import type { Person } from "@/hooks/use-people";

/** One dish. Name only by default; everything else behind "Add details". */
export function DishRow({
  item,
  people,
  onUpdate,
  onRemove,
  onAddToShopping,
}: {
  item: FoodItem;
  people: Person[];
  onUpdate: <K extends keyof FoodItem>(id: string, field: K, value: FoodItem[K]) => void;
  onRemove: (id: string) => void;
  onAddToShopping?: (item: FoodItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const done = item.status === "served" || item.status === "prepared";

  const toggleTag = (tag: string) => {
    const next = item.dietary_tags.includes(tag)
      ? item.dietary_tags.filter((t) => t !== tag)
      : [...item.dietary_tags, tag];
    onUpdate(item.id, "dietary_tags", next);
  };

  const responsible =
    item.responsible_name ??
    people.find((p) => p.id === item.responsible_person_id)?.name ??
    null;

  return (
    <li className="rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-card)]">
      <div className="flex items-start gap-2 p-3">
        <input
          value={item.name}
          onChange={(e) => onUpdate(item.id, "name", e.target.value)}
          aria-label="Dish name"
          className={`min-h-[44px] min-w-0 flex-1 rounded-xl bg-transparent px-2 text-[15px] outline-none focus:bg-white/60 ${
            done ? "text-[color:var(--muted-foreground)] line-through" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Hide details" : "Add details"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--gold)]/30 text-[color:var(--gold-soft)]"
        >
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-transparent text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)]/30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Quiet summary of whatever has been filled in */}
      {!open && (responsible || item.prep_date || item.status !== "planned" || item.dietary_tags.length > 0) && (
        <div className="flex flex-wrap gap-2 px-4 pb-3 text-[11px] text-[color:var(--muted-foreground)]">
          {item.status !== "planned" && <Chip>{statusLabel(item.status)}</Chip>}
          {responsible && (
            <Chip>
              <User className="mr-1 inline h-3 w-3" />
              {responsible}
            </Chip>
          )}
          {item.prep_date && (
            <Chip>
              <CalendarDays className="mr-1 inline h-3 w-3" />
              {item.prep_date}
            </Chip>
          )}
          {item.dietary_tags.map((t) => (
            <Chip key={t}>{dietaryLabel(t)}</Chip>
          ))}
        </div>
      )}

      {open && (
        <div className="space-y-3 border-t border-[color:var(--gold)]/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Servings">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={item.servings ?? ""}
                onChange={(e) => onUpdate(item.id, "servings", e.target.value === "" ? null : Number(e.target.value))}
                className="input-food"
              />
            </Field>
            <Field label="Status">
              <select
                value={item.status}
                onChange={(e) => onUpdate(item.id, "status", e.target.value)}
                className="input-food"
              >
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Who's responsible?">
              <select
                value={item.responsible_person_id ?? (item.responsible_name ? "__free" : "")}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__free") {
                    onUpdate(item.id, "responsible_person_id", null);
                    onUpdate(item.id, "responsible_name", item.responsible_name ?? "");
                  } else if (v === "") {
                    onUpdate(item.id, "responsible_person_id", null);
                    onUpdate(item.id, "responsible_name", null);
                  } else if (v === "__me") {
                    onUpdate(item.id, "responsible_person_id", null);
                    onUpdate(item.id, "responsible_name", "Me");
                  } else {
                    onUpdate(item.id, "responsible_name", null);
                    onUpdate(item.id, "responsible_person_id", v);
                  }
                }}
                className="input-food"
              >
                <option value="">Not decided</option>
                <option value="__me">Me</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                <option value="__free">Someone else…</option>
              </select>
            </Field>
            <Field label="Preparation date">
              <input
                type="date"
                value={item.prep_date ?? ""}
                onChange={(e) => onUpdate(item.id, "prep_date", e.target.value || null)}
                className="input-food"
              />
            </Field>
          </div>

          {item.responsible_person_id === null && item.responsible_name !== null && (
            <Field label="Name">
              <input
                value={item.responsible_name ?? ""}
                onChange={(e) => onUpdate(item.id, "responsible_name", e.target.value)}
                placeholder="e.g. Mum"
                className="input-food"
              />
            </Field>
          )}

          <Field label="Dietary">
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map((t) => {
                const on = item.dietary_tags.includes(t.key);
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => toggleTag(t.key)}
                    aria-pressed={on}
                    className={`min-h-[44px] rounded-full border px-3 text-xs ${
                      on
                        ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--foreground)]"
                        : "border-[color:var(--gold)]/30 text-[color:var(--muted-foreground)]"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Notes">
            <textarea
              rows={2}
              value={item.notes ?? ""}
              onChange={(e) => onUpdate(item.id, "notes", e.target.value)}
              className="input-food"
            />
          </Field>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex min-h-[44px] items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.needs_shopping}
                onChange={(e) => onUpdate(item.id, "needs_shopping", e.target.checked)}
                className="h-5 w-5 accent-[color:var(--gold)]"
              />
              Needs shopping
            </label>
            {onAddToShopping && (
              <button
                type="button"
                onClick={() => onAddToShopping(item)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[color:var(--gold)]/40 px-4 text-sm text-[color:var(--foreground)]"
              >
                <ShoppingBasket className="h-4 w-4" />
                Add to shopping list
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[color:var(--gold)]/30 px-2 py-1">{children}</span>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-soft)]">{label}</span>
      {children}
    </label>
  );
}
