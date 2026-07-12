import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { usePlannerSettings } from "@/hooks/use-planner-settings";
import {
  Gift,
  Mail,
  ListChecks,
  PoundSterling,
  ArrowRight,
  BellRing,
  Sparkles,
  AlertCircle,
  CalendarRange,
  CheckCircle2,
  Leaf,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/")({
  component: PlannerOverview,
});

interface GiftRow extends BaseRow {
  price: number | null;
  status: "idea" | "bought" | "wrapped" | "given";
  recipient?: string | null;
}
interface CardRow extends BaseRow { sent: boolean }
interface TodoRow extends BaseRow {
  title: string;
  done: boolean;
  due_date: string | null;
  category: string | null;
}
interface ReminderRow extends BaseRow { done: boolean; remind_on: string; title: string }

function daysToChristmas(): number {
  const now = new Date();
  const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  const xmas = new Date(year, 11, 25);
  return Math.max(0, Math.ceil((xmas.getTime() - now.getTime()) / 86400000));
}

function PlannerOverview() {
  const { user } = useAuth();
  const { settings, update } = usePlannerSettings(user?.id);
  const gifts = usePlannerList<GiftRow>("gifts", user?.id);
  const cards = usePlannerList<CardRow>("cards", user?.id);
  const todos = usePlannerList<TodoRow>("todos", user?.id);
  const reminders = usePlannerList<ReminderRow>("reminders", user?.id);

  const totalSpent = gifts.rows
    .filter((g) => g.status !== "idea")
    .reduce((sum, g) => sum + (Number(g.price) || 0), 0);
  const bought = gifts.rows.filter((g) => g.status !== "idea").length;
  const wrapped = gifts.rows.filter((g) => g.status === "wrapped" || g.status === "given").length;
  const giftPct = gifts.rows.length ? Math.round((bought / gifts.rows.length) * 100) : 0;
  const wrapPct = bought ? Math.round((wrapped / bought) * 100) : 0;
  const cardsPct = cards.rows.length ? Math.round((cards.rows.filter((c) => c.sent).length / cards.rows.length) * 100) : 0;
  const tasksDone = todos.rows.filter((t) => t.done).length;
  const tasksPct = todos.rows.length ? Math.round((tasksDone / todos.rows.length) * 100) : 0;

  const budget = settings?.budget_total ?? null;
  const budgetPct = budget && budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : null;
  const budgetLeft = budget != null ? budget - totalSpent : null;

  const todayIso = new Date().toISOString().slice(0, 10);
  const overdue = todos.rows.filter((t) => !t.done && t.due_date && t.due_date < todayIso);
  const dueToday = todos.rows.filter((t) => !t.done && t.due_date === todayIso);
  const dueThisWeek = todos.rows.filter((t) => {
    if (t.done || !t.due_date) return false;
    const d = new Date(t.due_date).getTime();
    const now = Date.now();
    return d >= now && d <= now + 7 * 86400000;
  });
  const remindersUpcoming = reminders.rows.filter((r) => !r.done).sort((a, b) => a.remind_on.localeCompare(b.remind_on));
  const remindersDueSoon = remindersUpcoming.filter((r) => r.remind_on <= todayIso);

  const days = daysToChristmas();
  const stressFree = settings?.stress_free ?? false;

  // Gentle suggestions
  const suggestions: string[] = [];
  if (!settings?.setup_completed) suggestions.push("Complete your quick setup so the planner adapts to your Christmas.");
  if (settings?.is_hosting && todos.rows.filter((t) => t.category === "food").length === 0)
    suggestions.push("You're hosting — try adding a few food tasks to get ahead.");
  if (bought > 0 && wrapped < bought) suggestions.push(`${bought - wrapped} bought gifts still need wrapping.`);
  if (settings?.sends_cards && cards.rows.length === 0) suggestions.push("Your card list is empty — start it while you're thinking about it.");
  if (budget != null && budgetLeft != null && budgetLeft < 0) suggestions.push(`You're £${Math.abs(budgetLeft).toFixed(0)} over budget — worth reviewing.`);

  const overallReady =
    Math.round(((giftPct + wrapPct + cardsPct + tasksPct) / 4) || 0);

  const priorityTasks = stressFree
    ? [...overdue, ...dueToday, ...dueThisWeek].slice(0, 3)
    : [...overdue, ...dueToday, ...dueThisWeek].slice(0, 6);

  return (
    <div className="rise-in space-y-6">
      {/* Countdown + readiness hero */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">Christmas countdown</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-display text-6xl gold-text leading-none">{days}</span>
            <span className="text-sm text-muted-foreground">days to go</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            You're <span className="text-foreground">{overallReady}%</span> ready across gifts, wrapping, cards and tasks.
            {overdue.length === 0 && dueToday.length === 0 && " Nothing urgent today."}
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[oklch(0.13_0.03_245_/_0.6)]">
            <div className="h-full rounded-full transition-all" style={{ width: `${overallReady}%`, background: "var(--gradient-gold)" }} />
          </div>
        </div>

        <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-[color:var(--gold)]" />
              <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">Stress-free mode</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={stressFree}
                onChange={(e) => update("stress_free", e.target.checked)}
                className="peer sr-only"
              />
              <span className="h-5 w-9 rounded-full bg-[oklch(0.13_0.03_245_/_0.8)] transition peer-checked:bg-[color:var(--gold)]" />
              <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
            </label>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {stressFree
              ? "Only your top 3 priorities are shown. Everything else is safe on your list."
              : "Turn on to see only what matters most today."}
          </p>
        </div>
      </div>

      {/* Progress row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ProgressCard
          icon={Gift}
          label="Gifts bought"
          value={`${bought} / ${gifts.rows.length || 0}`}
          sub={`${wrapped} wrapped`}
          pct={giftPct}
          to="/planner/gifts"
        />
        <ProgressCard
          icon={PoundSterling}
          label={budget ? "Budget used" : "Set a budget"}
          value={budget ? `£${totalSpent.toFixed(0)} / £${budget.toFixed(0)}` : "—"}
          sub={budgetLeft != null ? (budgetLeft >= 0 ? `£${budgetLeft.toFixed(0)} left` : `£${Math.abs(budgetLeft).toFixed(0)} over`) : "in Setup"}
          pct={budgetPct ?? 0}
          to="/planner/setup"
          warn={budgetLeft != null && budgetLeft < 0}
        />
        <ProgressCard
          icon={Mail}
          label="Cards sent"
          value={`${cards.rows.filter((c) => c.sent).length} / ${cards.rows.length || 0}`}
          sub={cards.rows.length ? "of your list" : "add your list"}
          pct={cardsPct}
          to="/planner/cards"
        />
        <ProgressCard
          icon={ListChecks}
          label="Tasks done"
          value={`${tasksDone} / ${todos.rows.length || 0}`}
          sub={overdue.length ? `${overdue.length} overdue` : "on track"}
          pct={tasksPct}
          to="/planner/todos"
          warn={overdue.length > 0}
        />
      </div>

      {/* Priorities + reminders */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg">
              <AlertCircle className="h-4 w-4 text-[color:var(--gold)]" />
              {stressFree ? "Focus on these three" : "Your priorities"}
            </h3>
            <Link to="/planner/todos" className="text-xs text-[color:var(--gold-soft)] hover:underline">Open tasks →</Link>
          </div>
          {priorityTasks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              <CheckCircle2 className="mr-1 inline h-4 w-4 text-[color:var(--gold-soft)]" />
              Nothing urgent — you're on top of it.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {priorityTasks.map((t) => {
                const isOverdue = t.due_date && t.due_date < todayIso;
                return (
                  <li key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-[oklch(0.80_0.14_85_/_0.12)] px-3 py-2 text-sm">
                    <span className="truncate">{t.title || "Untitled task"}</span>
                    <span className={"shrink-0 text-xs " + (isOverdue ? "text-[color:var(--ember)]" : "text-muted-foreground")}>
                      {t.due_date ? formatDue(t.due_date, todayIso) : "no date"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg">
              <BellRing className="h-4 w-4 text-[color:var(--gold)]" />
              Never Miss
            </h3>
            <Link to="/planner/reminders" className="text-xs text-[color:var(--gold-soft)] hover:underline">Open →</Link>
          </div>
          {remindersUpcoming.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Add the classic set to catch every deadline that catches people out.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {remindersUpcoming.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-[oklch(0.80_0.14_85_/_0.12)] px-3 py-2 text-sm">
                  <span className="truncate">{r.title}</span>
                  <span className={"shrink-0 text-xs " + (r.remind_on <= todayIso ? "text-[color:var(--ember)]" : "text-muted-foreground")}>
                    {formatDue(r.remind_on, todayIso)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {remindersDueSoon.length > 0 && (
            <p className="mt-3 text-xs text-[color:var(--ember)]">{remindersDueSoon.length} reminder{remindersDueSoon.length === 1 ? "" : "s"} due now.</p>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && !stressFree && (
        <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.5)] p-5">
          <h3 className="flex items-center gap-2 font-display text-lg">
            <Sparkles className="h-4 w-4 text-[color:var(--gold)]" />
            A few gentle nudges
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {suggestions.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--gold)]" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shortcuts */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Shortcut to="/planner/timeline" icon={CalendarRange} title="Your Christmas timeline" body="See what to focus on this month, from January right through to Boxing Day." />
        <Shortcut to="/planner/setup" icon={Sparkles} title={settings?.setup_completed ? "Update your setup" : "Personalise your planner"} body="Answer a few short questions so the planner adapts to your Christmas." />
      </div>
    </div>
  );
}

function formatDue(iso: string, today: string): string {
  if (iso === today) return "today";
  if (iso < today) {
    const days = Math.round((Date.parse(today) - Date.parse(iso)) / 86400000);
    return `${days}d overdue`;
  }
  const days = Math.round((Date.parse(iso) - Date.parse(today)) / 86400000);
  if (days === 1) return "tomorrow";
  return `in ${days}d`;
}

function ProgressCard({
  icon: Icon,
  label,
  value,
  sub,
  pct,
  to,
  warn,
}: {
  icon: typeof Gift;
  label: string;
  value: string;
  sub: string;
  pct: number;
  to?: string;
  warn?: boolean;
}) {
  const body = (
    <div className="group flex h-full flex-col rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.7)] p-4 transition hover:-translate-y-0.5 hover:border-[oklch(0.80_0.14_85_/_0.5)]">
      <div className="flex items-center justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-[oklch(0.80_0.14_85_/_0.3)]">
          <Icon className="h-3.5 w-3.5 text-[color:var(--gold)]" />
        </span>
        {to && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[color:var(--gold-soft)]" />}
      </div>
      <p className="mt-3 font-display text-2xl gold-text">{value}</p>
      <p className="text-xs text-foreground">{label}</p>
      <p className={"mt-0.5 text-[11px] " + (warn ? "text-[color:var(--ember)]" : "text-muted-foreground")}>{sub}</p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.13_0.03_245_/_0.6)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: warn ? "var(--ember)" : "var(--gradient-gold)" }}
        />
      </div>
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

function Shortcut({ to, icon: Icon, title, body }: { to: string; icon: typeof Gift; title: string; body: string }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 transition hover:border-[oklch(0.80_0.14_85_/_0.5)]"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-gold)" }}>
          <Icon className="h-5 w-5 text-[color:var(--primary-foreground)]" />
        </span>
        <h3 className="font-display text-xl">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
      <p className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
        Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}
