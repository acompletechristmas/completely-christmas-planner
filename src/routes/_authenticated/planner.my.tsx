import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import {
  Gift,
  UtensilsCrossed,
  Sparkles,
  Mail,
  Package,
  PartyPopper,
  Plane,
  Wand2,
  GraduationCap,
  Users,
  Plus,
  Trash2,
  ChevronDown,
  CalendarDays,
  ListChecks,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/my")({
  head: () => ({
    meta: [
      { title: "My Christmas Planner — A Complete Christmas" },
      { name: "description", content: "Your magical, all-in-one Christmas planner — gifts, food, decorations, travel and every festive to-do in one cosy place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyChristmasPlanner,
});

interface TodoRow extends BaseRow {
  title: string;
  done: boolean;
  due_date: string | null;
  category: string;
  notes: string | null;
}

type SectionKey =
  | "gifts"
  | "food"
  | "decorations"
  | "cards"
  | "wrapping"
  | "events"
  | "travel"
  | "elf"
  | "school"
  | "family";

const SECTIONS: Array<{
  key: SectionKey;
  label: string;
  emoji: string;
  icon: typeof Gift;
  hint: string;
}> = [
  { key: "gifts", label: "Gifts", emoji: "🎁", icon: Gift, hint: "Ideas, shopping, wrapping to-dos" },
  { key: "food", label: "Food", emoji: "🍰", icon: UtensilsCrossed, hint: "Menus, orders, mince pies" },
  { key: "decorations", label: "Decorations", emoji: "✨", icon: Sparkles, hint: "Tree, lights, wreaths" },
  { key: "cards", label: "Cards", emoji: "💌", icon: Mail, hint: "Write, address, pop in the post" },
  { key: "wrapping", label: "Wrapping", emoji: "🎀", icon: Package, hint: "Paper, tags, ribbons" },
  { key: "events", label: "Festive Activities", emoji: "🎉", icon: PartyPopper, hint: "Parties, markets, meals, gatherings" },
  { key: "travel", label: "Travel", emoji: "✈️", icon: Plane, hint: "Trains, packing, presents to take" },
  { key: "elf", label: "Elf", emoji: "🧝", icon: Wand2, hint: "Nightly antics & little notes" },
  { key: "school", label: "School", emoji: "🎓", icon: GraduationCap, hint: "Nativity, jumper day, teacher gifts" },
  { key: "family", label: "Family", emoji: "👪", icon: Users, hint: "Traditions, calls, film nights" },
];

function MyChristmasPlanner() {
  const { user } = useAuth();
  const { rows, loading, addRow, removeRow, updateField, saving } = usePlannerList<TodoRow>("todos", user?.id);

  const todayIso = new Date().toISOString().slice(0, 10);
  const in7Iso = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const total = rows.length;
  const done = rows.filter((r) => r.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const todaysTasks = rows.filter((r) => !r.done && r.due_date === todayIso);
  const upcoming = rows
    .filter((r) => !r.done && r.due_date && r.due_date > todayIso && r.due_date <= in7Iso)
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));

  const grouped = useMemo(() => {
    const map = new Map<SectionKey, TodoRow[]>();
    for (const s of SECTIONS) map.set(s.key, []);
    for (const r of rows) {
      const key = (SECTIONS.find((s) => s.key === r.category)?.key ?? "family") as SectionKey;
      const bucket = map.get(key) ?? [];
      bucket.push(r);
      map.set(key, bucket);
    }
    return map;
  }, [rows]);

  return (
    <div className="rise-in space-y-8">
      {/* Welcome + overall progress */}
      <section className="rounded-3xl border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">🎄 My Christmas Planner</p>
        <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
          Welcome to your <span className="italic text-[color:var(--gold)]">magical</span> Christmas hub
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Every little job in one cosy place. Add, tick, tweak — we'll remember it all for next Christmas too.
        </p>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="font-display text-5xl leading-none gold-text">{pct}%</span>
          <span className="text-sm text-muted-foreground">
            {done} of {total} {total === 1 ? "task" : "tasks"} sorted
          </span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[oklch(0.13_0.03_245_/_0.6)]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: "var(--gradient-gold)" }}
          />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{saving ? "Saving…" : "Everything's saved safely ✨"}</p>
      </section>

      {/* Today + Upcoming */}
      <div className="grid gap-4 md:grid-cols-2">
        <PriorityCard
          title="Today's Christmas tasks"
          emoji="⭐"
          icon={Star}
          empty="A calm day — nothing due today."
          items={todaysTasks}
          onToggle={(id, v) => updateField(id, "done", v)}
          todayIso={todayIso}
        />
        <PriorityCard
          title="Coming up this week"
          emoji="🔔"
          icon={CalendarDays}
          empty="Nothing scheduled in the next 7 days."
          items={upcoming}
          onToggle={(id, v) => updateField(id, "done", v)}
          todayIso={todayIso}
        />
      </div>

      {/* Sections */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl sm:text-3xl">Your festive sections</h2>
          {loading && <span className="text-xs text-muted-foreground">Loading…</span>}
        </div>

        <div className="space-y-3">
          {SECTIONS.map((s) => (
            <SectionAccordion
              key={s.key}
              section={s}
              tasks={grouped.get(s.key) ?? []}
              onAdd={(title) => addRow({ title, category: s.key } as Partial<TodoRow>)}
              onRemove={removeRow}
              onUpdate={updateField}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------- Priority card -------------------- */

function PriorityCard({
  title,
  emoji,
  icon: Icon,
  empty,
  items,
  onToggle,
  todayIso,
}: {
  title: string;
  emoji: string;
  icon: typeof Star;
  empty: string;
  items: TodoRow[];
  onToggle: (id: string, v: boolean) => void;
  todayIso: string;
}) {
  return (
    <div className="rounded-3xl border border-[oklch(0.80_0.14_85_/_0.28)] bg-[oklch(0.26_0.04_245_/_0.7)] p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[color:var(--gold)]" />
        <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          {emoji} {title}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] p-5 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-2xl border border-[oklch(0.80_0.14_85_/_0.18)] bg-[oklch(0.20_0.04_245_/_0.6)] p-3"
            >
              <input
                type="checkbox"
                checked={t.done}
                onChange={(e) => onToggle(t.id, e.target.checked)}
                className="h-4 w-4 shrink-0 accent-[color:var(--gold)]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.title || "Untitled task"}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t.category ? capitalise(t.category) + " · " : ""}
                  {t.due_date ? friendlyDate(t.due_date, todayIso) : "no date"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------- Section accordion -------------------- */

function SectionAccordion({
  section,
  tasks,
  onAdd,
  onRemove,
  onUpdate,
}: {
  section: (typeof SECTIONS)[number];
  tasks: TodoRow[];
  onAdd: (title: string) => void;
  onRemove: (id: string) => void;
  onUpdate: <K extends keyof TodoRow>(id: string, field: K, value: TodoRow[K]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const done = tasks.filter((t) => t.done).length;

  const Icon = section.icon;

  return (
    <div className="overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.22)] bg-[oklch(0.26_0.04_245_/_0.6)] transition hover:border-[oklch(0.80_0.14_85_/_0.4)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left sm:p-5"
        aria-expanded={open}
      >
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[oklch(0.80_0.14_85_/_0.35)]"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Icon className="h-5 w-5 text-[color:var(--midnight-deep)]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg sm:text-xl">
            {section.emoji} {section.label}
          </p>
          <p className="truncate text-[12px] text-muted-foreground">
            {tasks.length === 0 ? section.hint : `${done} of ${tasks.length} sorted · ${section.hint}`}
          </p>
        </div>
        <ChevronDown
          className={"h-4 w-4 shrink-0 text-[color:var(--gold-soft)] transition-transform " + (open ? "rotate-180" : "")}
        />
      </button>

      {open && (
        <div className="border-t border-[oklch(0.80_0.14_85_/_0.15)] p-4 sm:p-5">
          {/* Add form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = draft.trim();
              if (!v) return;
              onAdd(v);
              setDraft("");
            }}
            className="flex items-center gap-2"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Add a ${section.label.toLowerCase()} task…`}
              className="min-w-0 flex-1 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.5)] px-4 py-2 text-sm outline-none focus:border-[oklch(0.80_0.14_85_/_0.6)]"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
              style={{ background: "var(--gradient-gold)" }}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </form>

          {/* Tasks */}
          {tasks.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.25)] p-5 text-center text-xs text-muted-foreground">
              <ListChecks className="mx-auto mb-2 h-5 w-5 text-[color:var(--gold)]" />
              No {section.label.toLowerCase()} tasks yet — add your first one above.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {tasks.map((t) => (
                <TaskRow key={t.id} task={t} onRemove={onRemove} onUpdate={onUpdate} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------- Task row -------------------- */

function TaskRow({
  task,
  onRemove,
  onUpdate,
}: {
  task: TodoRow;
  onRemove: (id: string) => void;
  onUpdate: <K extends keyof TodoRow>(id: string, field: K, value: TodoRow[K]) => void;
}) {
  const [showNotes, setShowNotes] = useState(!!task.notes);

  return (
    <li className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.18)] bg-[oklch(0.20_0.04_245_/_0.55)] p-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.done}
          onChange={(e) => onUpdate(task.id, "done", e.target.checked)}
          className="h-4 w-4 shrink-0 accent-[color:var(--gold)]"
        />
        <input
          value={task.title}
          onChange={(e) => onUpdate(task.id, "title", e.target.value)}
          placeholder="What needs doing?"
          className={
            "min-w-0 flex-1 border-none bg-transparent text-sm outline-none " +
            (task.done ? "text-muted-foreground line-through" : "text-foreground")
          }
        />
        <input
          type="date"
          value={task.due_date ?? ""}
          onChange={(e) => onUpdate(task.id, "due_date", e.target.value || null)}
          className="shrink-0 rounded-lg border border-transparent bg-[oklch(0.26_0.04_245_/_0.5)] px-2 py-1 text-[11px] text-muted-foreground outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[oklch(0.80_0.14_85_/_0.6)]"
        />
        <button
          onClick={() => setShowNotes((v) => !v)}
          className="shrink-0 rounded-full px-2 py-1 text-[11px] text-[color:var(--gold-soft)] transition hover:bg-[oklch(0.80_0.14_85_/_0.12)]"
          aria-label="Toggle notes"
        >
          {showNotes ? "Hide notes" : task.notes ? "Notes" : "+ Notes"}
        </button>
        <button
          onClick={() => onRemove(task.id)}
          className="shrink-0 text-muted-foreground transition hover:text-[color:var(--burgundy,#b3324b)]"
          aria-label="Remove task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {showNotes && (
        <textarea
          value={task.notes ?? ""}
          onChange={(e) => onUpdate(task.id, "notes", e.target.value || null)}
          placeholder="A little note to future you…"
          rows={2}
          className="mt-2 w-full resize-none rounded-xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.13_0.03_245_/_0.5)] p-2 text-xs text-foreground outline-none focus:border-[oklch(0.80_0.14_85_/_0.5)]"
        />
      )}
    </li>
  );
}

/* -------------------- helpers -------------------- */

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function friendlyDate(iso: string, todayIso: string): string {
  if (iso === todayIso) return "Today";
  const target = new Date(iso + "T00:00:00");
  const today = new Date(todayIso + "T00:00:00");
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff <= 7) return `In ${diff} days`;
  if (diff < 0) return `${Math.abs(diff)} days ago`;
  return target.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}
