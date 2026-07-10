import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { supabase } from "@/integrations/supabase/client";
import {
  BellRing,
  Plus,
  Trash2,
  Sparkles,
  Check,
  CalendarClock,
} from "lucide-react";
import { toast } from "sonner";
import {
  REMINDER_SEEDS,
  seedDatesFor,
  upcomingChristmasYear,
} from "@/lib/reminder-seeds";

export const Route = createFileRoute("/_authenticated/planner/reminders")({
  head: () => ({
    meta: [
      { title: "Never Miss Christmas — A Complete Christmas" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RemindersPage,
});

interface ReminderRow extends BaseRow {
  title: string;
  category: string;
  remind_on: string;
  target_date: string | null;
  notes: string | null;
  done: boolean;
  source: string;
}

const CATEGORY_STYLE: Record<string, { label: string; tint: string; text: string }> = {
  book: { label: "Book", tint: "oklch(0.42 0.16 20 / 0.3)", text: "oklch(0.97 0.01 240)" },
  order: { label: "Order", tint: "oklch(0.68 0.19 45 / 0.2)", text: "oklch(0.97 0.01 240)" },
  post: { label: "Post", tint: "oklch(0.50 0.10 180 / 0.35)", text: "oklch(0.97 0.01 240)" },
  prepare: { label: "Prep", tint: "oklch(0.80 0.14 85 / 0.2)", text: "oklch(0.88 0.10 88)" },
  family: { label: "Family", tint: "oklch(0.55 0.14 320 / 0.25)", text: "oklch(0.97 0.01 240)" },
  general: { label: "General", tint: "oklch(0.80 0.14 85 / 0.15)", text: "oklch(0.88 0.10 88)" },
};

function formatDay(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function daysBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function statusFor(remindOn: string, done: boolean) {
  if (done) return { label: "Done", tone: "muted" as const };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(remindOn + "T00:00:00");
  const days = daysBetween(today, target);
  if (days < 0) return { label: "Overdue", tone: "ember" as const };
  if (days === 0) return { label: "Today", tone: "gold" as const };
  if (days <= 7) return { label: `In ${days}d`, tone: "gold" as const };
  if (days <= 30) return { label: `In ${days}d`, tone: "pine" as const };
  return { label: formatDay(remindOn), tone: "muted" as const };
}

function RemindersPage() {
  const { user } = useAuth();
  const { rows, loading, addRow, removeRow, updateField, saving } = usePlannerList<ReminderRow>(
    "reminders",
    user?.id,
  );
  const [seeding, setSeeding] = useState(false);

  const sorted = useMemo(() => {
    const active = rows.filter((r) => !r.done).sort((a, b) => a.remind_on.localeCompare(b.remind_on));
    const done = rows.filter((r) => r.done).sort((a, b) => a.remind_on.localeCompare(b.remind_on));
    return [...active, ...done];
  }, [rows]);

  const upcoming = rows.filter((r) => !r.done);
  const overdue = upcoming.filter((r) => new Date(r.remind_on) < new Date(new Date().toDateString()));
  const doneCount = rows.length - upcoming.length;

  async function seedClassics() {
    if (!user?.id || seeding) return;
    setSeeding(true);
    const year = upcomingChristmasYear();
    const rowsToInsert = REMINDER_SEEDS.map((seed, i) => {
      const { remind_on, target_date } = seedDatesFor(year, seed);
      return {
        user_id: user.id,
        title: seed.title,
        category: seed.category,
        remind_on,
        target_date,
        notes: seed.notes,
        source: `seed:${seed.slug}:${year}`,
        sort_order: i,
      };
    });
    // Skip any seeds we've already added for this year.
    const { data: existing } = await supabase
      .from("reminders")
      .select("source")
      .eq("user_id", user.id)
      .like("source", `seed:%:${year}`);
    const have = new Set((existing ?? []).map((r) => r.source));
    const fresh = rowsToInsert.filter((r) => !have.has(r.source));
    if (fresh.length === 0) {
      toast("Your classic reminders are already loaded for this year.");
      setSeeding(false);
      return;
    }
    const { error } = await supabase.from("reminders").insert(fresh);
    setSeeding(false);
    if (error) {
      toast.error("Couldn't add the classic reminders.");
    } else {
      toast.success(`Added ${fresh.length} classic reminder${fresh.length === 1 ? "" : "s"}.`);
    }
  }

  return (
    <div className="rise-in space-y-6">
      {/* Header card */}
      <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.75)] p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
          style={{ background: "oklch(0.80 0.14 85 / 0.2)" }}
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
              Signature feature
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
              Never Miss <span className="gold-text">Christmas</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Timely nudges from September through Christmas Eve — so grottos, pantos and the turkey
              are booked long before they sell out.
            </p>
          </div>
          <button
            onClick={seedClassics}
            disabled={seeding}
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110 disabled:opacity-60"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Sparkles className="h-4 w-4" />
            {seeding ? "Adding…" : "Add the classic set"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Upcoming" value={String(upcoming.length)} />
        <Stat label="Overdue" value={String(overdue.length)} tone={overdue.length ? "ember" : "muted"} />
        <Stat label="Done" value={String(doneCount)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() =>
            addRow({
              title: "",
              category: "general",
              remind_on: new Date().toISOString().slice(0, 10),
              source: "personal",
            } as Partial<ReminderRow>)
          }
          className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] px-4 py-2 text-sm text-[color:var(--gold-soft)] transition hover:bg-[oklch(0.80_0.14_85_/_0.08)]"
        >
          <Plus className="h-4 w-4" /> Add your own reminder
        </button>
        <span className="text-xs text-muted-foreground">{saving ? "Saving…" : "All changes saved"}</span>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] p-10 text-center">
          <BellRing className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
          <p className="mt-3 text-sm text-muted-foreground">
            Tap <span className="text-foreground">Add the classic set</span> to load our curated
            Christmas timeline — or add your own first reminder.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {sorted.map((row) => (
            <ReminderItem
              key={row.id}
              row={row}
              onToggle={(v) => updateField(row.id, "done", v)}
              onTitle={(v) => updateField(row.id, "title", v)}
              onDate={(v) => updateField(row.id, "remind_on", v)}
              onNotes={(v) => updateField(row.id, "notes", v)}
              onRemove={() => removeRow(row.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ReminderItem({
  row,
  onToggle,
  onTitle,
  onDate,
  onNotes,
  onRemove,
}: {
  row: ReminderRow;
  onToggle: (v: boolean) => void;
  onTitle: (v: string) => void;
  onDate: (v: string) => void;
  onNotes: (v: string | null) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORY_STYLE[row.category] ?? CATEGORY_STYLE.general;
  const status = statusFor(row.remind_on, row.done);

  // Auto-open freshly added blank reminders so users know what to type.
  useEffect(() => {
    if (!row.title) setExpanded(true);
  }, [row.title]);

  return (
    <li
      className={
        "rounded-xl border bg-[oklch(0.26_0.04_245_/_0.6)] transition " +
        (row.done
          ? "border-[oklch(0.80_0.14_85_/_0.1)] opacity-70"
          : "border-[oklch(0.80_0.14_85_/_0.18)] hover:border-[oklch(0.80_0.14_85_/_0.4)]")
      }
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => onToggle(!row.done)}
          aria-label={row.done ? "Mark as not done" : "Mark done"}
          className={
            "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition " +
            (row.done
              ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-[color:var(--primary-foreground)]"
              : "border-[oklch(0.80_0.14_85_/_0.4)] hover:border-[color:var(--gold)]")
          }
        >
          {row.done ? <Check className="h-3.5 w-3.5" /> : null}
        </button>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="min-w-0 flex-1 text-left"
        >
          <p
            className={
              "truncate font-display text-lg " +
              (row.done ? "text-muted-foreground line-through" : "text-foreground")
            }
          >
            {row.title || "New reminder"}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <CalendarClock className="h-3 w-3" />
            <span>{formatDay(row.remind_on)}</span>
            <span
              className="rounded-full px-2 py-0.5"
              style={{ background: cat.tint, color: cat.text }}
            >
              {cat.label}
            </span>
          </div>
        </button>

        <span
          className="hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider sm:inline"
          style={{
            background:
              status.tone === "ember"
                ? "oklch(0.68 0.19 45 / 0.25)"
                : status.tone === "gold"
                  ? "oklch(0.80 0.14 85 / 0.2)"
                  : status.tone === "pine"
                    ? "oklch(0.50 0.10 180 / 0.35)"
                    : "oklch(0.26 0.04 245 / 0.8)",
            color:
              status.tone === "gold" ? "oklch(0.88 0.10 88)" : "oklch(0.97 0.01 240)",
          }}
        >
          {status.label}
        </span>

        <button
          onClick={onRemove}
          className="shrink-0 text-muted-foreground transition hover:text-[color:var(--ember)]"
          aria-label="Remove reminder"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {expanded ? (
        <div className="grid gap-3 border-t border-[oklch(0.80_0.14_85_/_0.12)] px-4 py-3 sm:grid-cols-[1fr_auto]">
          <input
            value={row.title}
            onChange={(e) => onTitle(e.target.value)}
            placeholder="What do you need to remember?"
            className="min-w-0 rounded-lg border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.7)] px-3 py-2 text-sm outline-none focus:border-[oklch(0.80_0.14_85_/_0.6)]"
          />
          <input
            type="date"
            value={row.remind_on}
            onChange={(e) => onDate(e.target.value)}
            className="rounded-lg border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.7)] px-3 py-2 text-sm text-muted-foreground outline-none focus:border-[oklch(0.80_0.14_85_/_0.6)]"
          />
          <textarea
            value={row.notes ?? ""}
            onChange={(e) => onNotes(e.target.value || null)}
            placeholder="Notes (links, options you're considering, who's booking)…"
            rows={2}
            className="sm:col-span-2 rounded-lg border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.20_0.04_245_/_0.5)] px-3 py-2 text-sm outline-none focus:border-[oklch(0.80_0.14_85_/_0.6)]"
          />
        </div>
      ) : null}
    </li>
  );
}

function Stat({ label, value, tone = "muted" }: { label: string; value: string; tone?: "muted" | "ember" }) {
  return (
    <div
      className={
        "rounded-xl border bg-[oklch(0.26_0.04_245_/_0.6)] px-4 py-3 " +
        (tone === "ember"
          ? "border-[oklch(0.68_0.19_45_/_0.5)]"
          : "border-[oklch(0.80_0.14_85_/_0.15)]")
      }
    >
      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <p
        className={
          "mt-1 font-display text-2xl " +
          (tone === "ember" ? "text-[color:var(--ember)]" : "gold-text")
        }
      >
        {value}
      </p>
    </div>
  );
}
