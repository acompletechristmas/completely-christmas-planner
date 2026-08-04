import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { CalendarDays, Plus, Trash2, PoundSterling, ExternalLink, Sparkles, Lamp } from "lucide-react";
import { SectionIcon } from "@/components/planner/SectionShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/planner/outings")({
  head: () => ({
    meta: [
      { title: "Festive Activities — A Complete Christmas" },
      { name: "description", content: "Keep every festive activity — markets, panto, parties, meals out, trips and family gatherings — in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OutingsPage,
});

/** One saved festive activity. Stored in the existing `outings` table. */
interface OutingRow extends BaseRow {
  name: string;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  attendees: string | null;
  cost: number | null;
  booking_url: string | null;
  planned: boolean;
  booked: boolean;
  paid: boolean;
  completed: boolean;
  notes: string | null;
}

export function OutingsPage() {
  const { user } = useAuth();
  const { rows, loading, addRow, removeRow, updateField } = usePlannerList<OutingRow>(
    "outings",
    user?.id,
  );
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Give it a name ✨");
      return;
    }
    await addRow({ name: name.trim(), event_date: date || null, planned: true } as Partial<OutingRow>);
    setName("");
    setDate("");
    setAdding(false);
  };

  return (
    <div className="rise-in space-y-6 pb-28 sm:pb-16">
      <header className="rounded-3xl border border-[color:var(--gold)]/30 bg-gradient-to-br from-[color:var(--forest-deep)]/80 to-[color:var(--burgundy)]/40 p-5 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          Festive Activities
        </p>
        <h1 className="mt-2 flex items-center gap-2.5 font-display text-3xl leading-tight sm:text-4xl">
          <SectionIcon icon={Lamp} />
          <span>Every festive plan, in one place.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--cream)]/85">
          Markets, panto, skating, parties, meals out, trips and family gatherings — track dates,
          cost and who's coming.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setAdding(true)}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-[color:var(--forest-deep)] transition hover:brightness-110"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Plus className="h-4 w-4" /> Add an activity
        </button>
        <Link
          to="/days-out"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-[color:var(--gold)]/40 px-4 py-2 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)]"
        >
          <Sparkles className="h-4 w-4" /> Find ideas near me
        </Link>
      </div>

      {adding && (
        <div className="rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--forest-deep)]/70 p-4">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Christmas market at York, Boxing Day at Mum's…"
              className="w-full rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-sunk)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]/70"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-sunk)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]/70"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setAdding(false)}
                className="rounded-xl border border-[color:var(--gold)]/25 px-4 py-2 text-sm text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-[color:var(--forest-deep)]"
                style={{ background: "var(--gradient-gold)" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[color:var(--gold)]/40 bg-[color:var(--forest-deep)]/40 p-10 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-[color:var(--gold)]" />
          <h3 className="mt-3 font-display text-2xl">No festive activities yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Add your first — a market, panto, party, meal out, family gathering or trip to the
            lights.
          </p>
          <Link
            to="/days-out"
            className="mt-5 inline-flex min-h-11 items-center rounded-full border border-[color:var(--gold)]/40 px-5 text-sm text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)]"
          >
            Browse Christmas Magic Near Me
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((o) => (
            <OutingCard key={o.id} outing={o} onUpdate={updateField} onRemove={removeRow} />
          ))}
        </ul>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-sunk)] px-3 py-2 text-sm outline-none transition focus:border-[color:var(--gold)]/70";

function OutingCard({
  outing,
  onUpdate,
  onRemove,
}: {
  outing: OutingRow;
  onUpdate: <K extends keyof OutingRow>(id: string, field: K, value: OutingRow[K]) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--forest-deep)]/70 p-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          value={outing.name}
          onChange={(e) => onUpdate(outing.id, "name", e.target.value)}
          placeholder="Activity name"
          className="w-full rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-sunk)] px-3 py-2 text-sm font-medium outline-none focus:border-[color:var(--gold)]/70"
        />
        <button
          onClick={() => confirm(`Remove "${outing.name || "this activity"}"?`) && onRemove(outing.id)}
          className="rounded-full border border-[color:var(--gold)]/25 p-2 text-muted-foreground transition hover:border-[color:var(--burgundy)] hover:text-[color:var(--burgundy)]"
          aria-label="Delete activity"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <input
          type="date"
          value={outing.event_date ?? ""}
          onChange={(e) => onUpdate(outing.id, "event_date", e.target.value || null)}
          className={inputCls}
        />
        <input
          value={outing.event_time ?? ""}
          onChange={(e) => onUpdate(outing.id, "event_time", e.target.value || null)}
          placeholder="Time (e.g. 6pm)"
          className={inputCls}
        />
        <input
          value={outing.location ?? ""}
          onChange={(e) => onUpdate(outing.id, "location", e.target.value || null)}
          placeholder="Location"
          className={inputCls}
        />
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <input
          value={outing.attendees ?? ""}
          onChange={(e) => onUpdate(outing.id, "attendees", e.target.value || null)}
          placeholder="Who's going?"
          className={inputCls}
        />
        <div className="flex items-center gap-1 rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-sunk)] px-3">
          <PoundSterling className="h-3.5 w-3.5 text-[color:var(--gold-soft)]" />
          <input
            type="number"
            min={0}
            value={outing.cost ?? ""}
            onChange={(e) =>
              onUpdate(outing.id, "cost", e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="Cost"
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-sunk)] px-3">
          <ExternalLink className="h-3.5 w-3.5 text-[color:var(--gold-soft)]" />
          <input
            value={outing.booking_url ?? ""}
            onChange={(e) => onUpdate(outing.id, "booking_url", e.target.value || null)}
            placeholder="Booking link"
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {(["planned", "booked", "paid", "completed"] as const).map((k) => {
          const active = Boolean(outing[k]);
          return (
            <button
              key={k}
              type="button"
              role="checkbox"
              aria-checked={active}
              onClick={() => onUpdate(outing.id, k, !active)}
              className={
                "flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-medium capitalize transition " +
                (active
                  ? "border-[color:var(--pine-bright)]/70 bg-[color:var(--pine-bright)]/15 text-[color:var(--pine-bright)]"
                  : "border-[color:var(--gold)]/25 text-muted-foreground hover:border-[color:var(--gold)]/60")
              }
            >
              <span
                className={
                  "grid h-4 w-4 place-items-center rounded border " +
                  (active
                    ? "border-[color:var(--pine-bright)] bg-[color:var(--pine-bright)]/30"
                    : "border-[color:var(--gold)]/40")
                }
              >
                {active ? "✓" : ""}
              </span>
              {k}
            </button>
          );
        })}
      </div>
      <input
        value={outing.notes ?? ""}
        onChange={(e) => onUpdate(outing.id, "notes", e.target.value || null)}
        placeholder="Notes"
        className={inputCls + " mt-3"}
      />
    </li>
  );
}
