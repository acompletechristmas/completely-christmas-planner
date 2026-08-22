import { useState } from "react";
import { ChevronDown, Trash2, User, Check } from "lucide-react";
import { HOME_CATEGORIES, HOME_STATUSES, categoryLabel, statusLabel } from "@/lib/home/constants";
import type { HomeItem } from "@/hooks/use-home";
import type { Person } from "@/hooks/use-people";

/** One home item. Name only by default; everything else behind "More details". */
export function HomeItemRow({
  item,
  people,
  areaName,
  onUpdate,
  onRemove,
}: {
  item: HomeItem;
  people: Person[];
  areaName?: string;
  onUpdate: <K extends keyof HomeItem>(id: string, field: K, value: HomeItem[K]) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const done = item.status === "done";

  const responsible =
    item.responsible_name ?? people.find((p) => p.id === item.responsible_person_id)?.name ?? null;

  return (
    <li className="rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-card)]">
      <div className="flex items-start gap-2 p-3">
        <button
          type="button"
          onClick={() => onUpdate(item.id, "status", done ? "todo" : "done")}
          aria-pressed={done}
          aria-label={done ? `Mark ${item.name} as not done` : `Mark ${item.name} as done`}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
            done
              ? "border-[color:var(--gold)] bg-[color:var(--gold)]/20 text-[color:var(--foreground)]"
              : "border-[color:var(--gold)]/30 text-[color:var(--muted-foreground)]"
          }`}
        >
          <Check className="h-4 w-4" />
        </button>
        <input
          value={item.name}
          onChange={(e) => onUpdate(item.id, "name", e.target.value)}
          aria-label="Item name"
          className={`min-h-[44px] min-w-0 flex-1 rounded-xl bg-transparent px-2 text-[15px] outline-none focus:bg-white/60 ${
            done ? "text-[color:var(--muted-foreground)] line-through" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Hide details" : "More details"}
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

      {!open && (areaName || responsible || item.category || item.already_owned || item.status !== "idea") && (
        <div className="flex flex-wrap gap-2 px-4 pb-3 text-[11px] text-[color:var(--muted-foreground)]">
          {areaName && <Chip>{areaName}</Chip>}
          {item.status !== "idea" && <Chip>{statusLabel(item.status)}</Chip>}
          {item.category && <Chip>{categoryLabel(item.category)}</Chip>}
          {item.already_owned && <Chip>Already have it</Chip>}
          {responsible && (
            <Chip>
              <User className="mr-1 inline h-3 w-3" />
              {responsible}
            </Chip>
          )}
        </div>
      )}

      {open && (
        <div className="space-y-3 border-t border-[color:var(--gold)]/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Status">
              <select
                value={item.status}
                onChange={(e) => onUpdate(item.id, "status", e.target.value)}
                className="input-food"
              >
                {HOME_STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <select
                value={item.category ?? ""}
                onChange={(e) => onUpdate(item.id, "category", e.target.value || null)}
                className="input-food"
              >
                <option value="">Not set</option>
                {HOME_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="How many?">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={item.quantity ?? ""}
                onChange={(e) => onUpdate(item.id, "quantity", e.target.value === "" ? null : Number(e.target.value))}
                className="input-food"
              />
            </Field>
            <Field label="Estimated cost (£)">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={item.estimated_cost ?? ""}
                onChange={(e) =>
                  onUpdate(item.id, "estimated_cost", e.target.value === "" ? null : Number(e.target.value))
                }
                className="input-food"
              />
            </Field>
            <Field label="Who's doing it?">
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
          </div>

          <label className="flex min-h-[44px] items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.already_owned}
              onChange={(e) => onUpdate(item.id, "already_owned", e.target.checked)}
              className="h-5 w-5 accent-[color:var(--gold)]"
            />
            I already have this
          </label>

          <Field label="Notes">
            <textarea
              rows={2}
              value={item.notes ?? ""}
              onChange={(e) => onUpdate(item.id, "notes", e.target.value)}
              placeholder="Colours, where it goes, sizes…"
              className="input-food"
            />
          </Field>
        </div>
      )}
    </li>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-[color:var(--gold)]/30 px-2 py-1">{children}</span>;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-soft)]">
        {label}
      </span>
      {children}
    </label>
  );
}
