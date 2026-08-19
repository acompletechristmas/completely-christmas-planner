import { useState } from "react";
import { ChevronDown, Sparkles, Trash2, Users } from "lucide-react";
import type { Tradition } from "@/hooks/use-traditions";
import type { Person } from "@/hooks/use-people";
import { TIMINGS, TRADITION_CATEGORIES, categoryLabel, timingLabel } from "@/lib/traditions/constants";
import { activePlanningYear } from "@/lib/food/constants";

/** One saved tradition. Name only by default; details behind "Add details". */
export function TraditionRow({
  tradition,
  people,
  onUpdate,
  onRemove,
}: {
  tradition: Tradition;
  people: Person[];
  onUpdate: <K extends keyof Tradition>(id: string, field: K, value: Tradition[K], delay?: number) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const named = people.filter((p) => tradition.participants.includes(p.id)).map((p) => p.name);
  const who = tradition.participant_note?.trim()
    ? tradition.participant_note.trim()
    : named.length
      ? named.join(", ")
      : null;

  const togglePerson = (id: string) => {
    const next = tradition.participants.includes(id)
      ? tradition.participants.filter((p) => p !== id)
      : [...tradition.participants, id];
    onUpdate(tradition.id, "participants", next);
  };

  return (
    <li className="rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-card)]">
      <div className="flex items-start gap-2 p-3">
        <div className="min-w-0 flex-1">
          <input
            value={tradition.name}
            onChange={(e) => onUpdate(tradition.id, "name", e.target.value)}
            aria-label="Tradition name"
            className="min-h-[44px] w-full rounded-xl bg-transparent px-2 text-[15px] outline-none focus:bg-white/60"
          />
          {(who || tradition.is_annual || tradition.category) && (
            <div className="flex flex-wrap items-center gap-2 px-2 pb-1 text-[11px] text-[color:var(--muted-foreground)]">
              {who ? (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" aria-hidden="true" />
                  {who}
                </span>
              ) : null}
              {tradition.category ? <span>{categoryLabel(tradition.category)}</span> : null}
              {tradition.is_annual ? (
                <span className="inline-flex items-center gap-1 text-[color:var(--gold-soft)]">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Every Christmas
                </span>
              ) : null}
            </div>
          )}
        </div>
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
          onClick={() => onRemove(tradition.id)}
          aria-label={`Remove ${tradition.name}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-transparent text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)]/30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-[color:var(--gold)]/20 p-3">
          <Field label="Notes">
            <textarea
              value={tradition.description ?? ""}
              onChange={(e) => onUpdate(tradition.id, "description", e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-[color:var(--gold)]/25 bg-white/60 px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="When we do it">
              <select
                value={tradition.timing}
                onChange={(e) => onUpdate(tradition.id, "timing", e.target.value, 0)}
                className="min-h-[44px] w-full rounded-xl border border-[color:var(--gold)]/25 bg-white/60 px-3 text-sm outline-none focus:border-[color:var(--gold)]"
              >
                {TIMINGS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <select
                value={tradition.category ?? ""}
                onChange={(e) => onUpdate(tradition.id, "category", e.target.value || null, 0)}
                className="min-h-[44px] w-full rounded-xl border border-[color:var(--gold)]/25 bg-white/60 px-3 text-sm outline-none focus:border-[color:var(--gold)]"
              >
                <option value="">No category</option>
                {TRADITION_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {tradition.timing === "date" && (
            <Field label={`Date (Christmas ${activePlanningYear()})`}>
              <input
                type="date"
                value={tradition.event_date ?? ""}
                onChange={(e) => onUpdate(tradition.id, "event_date", e.target.value || null, 0)}
                className="min-h-[44px] w-full rounded-xl border border-[color:var(--gold)]/25 bg-white/60 px-3 text-sm outline-none focus:border-[color:var(--gold)]"
              />
            </Field>
          )}

          <Field label="Who takes part">
            <div className="flex flex-wrap gap-2">
              {people.map((p) => {
                const on = tradition.participants.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePerson(p.id)}
                    aria-pressed={on}
                    className={`min-h-[44px] rounded-full border px-4 text-sm transition ${
                      on
                        ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15"
                        : "border-[color:var(--gold)]/30 text-[color:var(--muted-foreground)]"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
              {people.length === 0 && (
                <p className="text-xs text-[color:var(--muted-foreground)]">
                  Add people in your planner and they'll appear here.
                </p>
              )}
            </div>
            <input
              value={tradition.participant_note ?? ""}
              onChange={(e) => onUpdate(tradition.id, "participant_note", e.target.value)}
              placeholder="Or type who, e.g. Everyone"
              aria-label="Who takes part (free text)"
              className="mt-2 min-h-[44px] w-full rounded-xl border border-[color:var(--gold)]/25 bg-white/60 px-3 text-sm outline-none focus:border-[color:var(--gold)]"
            />
          </Field>

          <label className="flex min-h-[44px] items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={tradition.is_annual}
              onChange={(e) => onUpdate(tradition.id, "is_annual", e.target.checked, 0)}
              className="h-5 w-5 accent-[color:var(--gold)]"
            />
            We do this every Christmas
          </label>

          <p className="text-[11px] text-[color:var(--muted-foreground)]">
            {timingLabel(tradition.timing)}
          </p>
        </div>
      )}
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1 block text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
        {label}
      </span>
      {children}
    </div>
  );
}
