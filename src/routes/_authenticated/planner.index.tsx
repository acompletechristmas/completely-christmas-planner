import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { usePlannerSettings } from "@/hooks/use-planner-settings";
import {
  Gift,
  Mail,
  ListChecks,
  PoundSterling,
  BellRing,
  Sparkles,
  CalendarRange,
  Users,
  Settings2,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/")({
  component: PlannerOverview,
});

interface GiftRow extends BaseRow {
  price: number | null;
  status: "idea" | "bought" | "wrapped" | "given";
}
interface CardRow extends BaseRow { sent: boolean }
interface TodoRow extends BaseRow {
  title: string;
  done: boolean;
  due_date: string | null;
  category: string | null;
}
interface ReminderRow extends BaseRow { done: boolean; remind_on: string; title: string }

function PlannerOverview() {
  const { user } = useAuth();
  const { settings } = usePlannerSettings(user?.id);
  const gifts = usePlannerList<GiftRow>("gifts", user?.id);
  const cards = usePlannerList<CardRow>("cards", user?.id);
  const todos = usePlannerList<TodoRow>("todos", user?.id);
  const reminders = usePlannerList<ReminderRow>("reminders", user?.id);

  const totalSpent = gifts.rows
    .filter((g) => g.status !== "idea")
    .reduce((sum, g) => sum + (Number(g.price) || 0), 0);
  const bought = gifts.rows.filter((g) => g.status !== "idea").length;
  const wrapped = gifts.rows.filter((g) => g.status === "wrapped" || g.status === "given").length;
  const cardsSent = cards.rows.filter((c) => c.sent).length;
  const tasksDone = todos.rows.filter((t) => t.done).length;

  const giftPct = gifts.rows.length ? Math.round((bought / gifts.rows.length) * 100) : 0;
  const wrapPct = bought ? Math.round((wrapped / bought) * 100) : 0;
  const cardsPct = cards.rows.length ? Math.round((cardsSent / cards.rows.length) * 100) : 0;
  const tasksPct = todos.rows.length ? Math.round((tasksDone / todos.rows.length) * 100) : 0;
  const overallReady = Math.round(((giftPct + wrapPct + cardsPct + tasksPct) / 4) || 0);

  const budget = settings?.budget_total ?? null;
  const budgetLeft = budget != null ? budget - totalSpent : null;

  const todayIso = new Date().toISOString().slice(0, 10);
  const overdue = todos.rows.filter((t) => !t.done && t.due_date && t.due_date < todayIso);
  const nextTask = todos.rows
    .filter((t) => !t.done)
    .sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"))[0];
  const nextReminder = reminders.rows.filter((r) => !r.done).sort((a, b) => a.remind_on.localeCompare(b.remind_on))[0];

  // Warm, celebratory line
  const cheer = pickCheer({ bought, giftsTotal: gifts.rows.length, wrapped, overallReady, overdue: overdue.length });

  return (
    <div className="rise-in space-y-10">
      {/* Celebration hero */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">Look at you go</p>
          <p className="mt-2 font-display text-3xl leading-snug sm:text-4xl">
            {cheer}
          </p>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-5xl gold-text leading-none">{overallReady}%</span>
            <span className="text-sm text-muted-foreground">of the way to a jingly Christmas</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[oklch(0.13_0.03_245_/_0.6)]">
            <div className="h-full rounded-full transition-all" style={{ width: `${overallReady}%`, background: "var(--gradient-gold)" }} />
          </div>
        </div>

        <div className="rounded-3xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">✨ Little nudge</p>
          {nextTask ? (
            <>
              <p className="mt-2 font-display text-xl">{nextTask.title || "A tiny thing waiting for a tick"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {nextTask.due_date ? friendlyDate(nextTask.due_date, todayIso) : "no rush, whenever"}
              </p>
              <Link
                to="/planner/todos"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.5)] px-4 py-2 text-xs font-medium text-[color:var(--gold-soft)] transition hover:bg-[oklch(0.80_0.14_85_/_0.12)]"
              >
                Sort it now <ArrowRight className="h-3 w-3" />
              </Link>
            </>
          ) : (
            <>
              <p className="mt-2 font-display text-xl">Nothing waiting — go you 🌟</p>
              <p className="mt-1 text-xs text-muted-foreground">Fancy dreaming up something festive?</p>
              <Link
                to="/planner/todos"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.5)] px-4 py-2 text-xs font-medium text-[color:var(--gold-soft)] transition hover:bg-[oklch(0.80_0.14_85_/_0.12)]"
              >
                Add a little something <ArrowRight className="h-3 w-3" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Christmas village — feature cards */}
      <section>
        <h2 className="font-display text-2xl sm:text-3xl">
          Have a wander round your <span className="gold-text">Christmas village</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Pop into any corner — there's something lovely in each one.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <VillageCard
            emoji="🎁"
            title="Who am I buying for?"
            body={bought > 0 ? `${bought} sorted already — you legend!` : "Your gift list, one person at a time."}
            to="/planner/gifts"
            gradient="var(--gradient-cranberry)"
          />
          <VillageCard
            emoji="👪"
            title="My favourite humans"
            body="Everyone you love, all in one place."
            to="/planner/people"
            gradient="var(--gradient-aurora)"
          />
          <VillageCard
            emoji="💷"
            title="Where's the money going?"
            body={budget != null && budgetLeft != null
              ? (budgetLeft >= 0 ? `£${budgetLeft.toFixed(0)} left in the pot` : `£${Math.abs(budgetLeft).toFixed(0)} over — oops, worth a peek`)
              : "Set a cosy little budget and we'll keep an eye."}
            to="/planner/setup"
            gradient="var(--gradient-gold)"
          />
          <VillageCard
            emoji="✅"
            title="Little things to do"
            body={overdue.length ? `${overdue.length} waiting patiently — no panic.` : "Your friendly festive to-do list."}
            to="/planner/todos"
            gradient="var(--gradient-pine)"
          />
          <VillageCard
            emoji="✉️"
            title="Cards & lovely notes"
            body={cards.rows.length ? `${cardsSent}/${cards.rows.length} popped in the post` : "Jot them down while they're on your mind."}
            to="/planner/cards"
            gradient="var(--gradient-frost)"
          />
          <VillageCard
            emoji="🔔"
            title="Nudges from Santa's helpers"
            body={nextReminder ? `Next up: ${nextReminder.title}` : "The dates that always sneak up on people."}
            to="/planner/reminders"
            gradient="var(--gradient-aurora)"
          />
          <VillageCard
            emoji="🗓"
            title="Your festive plan-of-attack"
            body="A gentle month-by-month roadmap."
            to="/planner/timeline"
            gradient="var(--gradient-cranberry)"
          />
          <VillageCard
            emoji="🎄"
            title="Make the house twinkle"
            body="Trees, tables and cosy corners."
            to="/inspire"
            gradient="var(--gradient-pine)"
            comingSoon
          />
          <VillageCard
            emoji="🍽"
            title="Feed the whole crew"
            body="Menus, timings, and zero panic at 3pm."
            to="/food"
            gradient="var(--gradient-cranberry)"
            comingSoon
          />
          <VillageCard
            emoji="🎬"
            title="Films, games & silly nights"
            body="Cosy evenings, sorted."
            to="/entertainment"
            gradient="var(--gradient-frost)"
            comingSoon
          />
          <VillageCard
            emoji="📍"
            title="Days out & mini adventures"
            body="Grottos, markets and twinkly walks."
            to="/days-out"
            gradient="var(--gradient-aurora)"
            comingSoon
          />
          <VillageCard
            emoji="✨"
            title="Give me a little inspo"
            body="Ideas, traditions and lovely touches."
            to="/inspire"
            gradient="var(--gradient-gold)"
            comingSoon
          />
        </div>
      </section>


      {/* Quick stats — celebratory */}
      <section>
        <h2 className="font-display text-2xl">Wins so far 🎉</h2>
        <p className="mt-1 text-sm text-muted-foreground">Every little tick counts. Look at all this magic.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Cheer icon={Gift} label="Pressies sorted" value={bought} total={gifts.rows.length} pct={giftPct} />
          <Cheer icon={PoundSterling} label={budget ? "Pot spent" : "Budget"} value={`£${totalSpent.toFixed(0)}`} total={budget ? `£${budget.toFixed(0)}` : "—"} pct={budget ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0} />
          <Cheer icon={Mail} label="Cards posted" value={cardsSent} total={cards.rows.length} pct={cardsPct} />
          <Cheer icon={ListChecks} label="Ticked off" value={tasksDone} total={todos.rows.length} pct={tasksPct} />
        </div>
      </section>

      {/* Tiny secondary links */}
      <section className="flex flex-wrap gap-2 pt-2">
        <TinyLink to="/planner/setup" icon={Settings2}>Tweak my Christmas</TinyLink>
        <TinyLink to="/planner/people" icon={Users}>My humans</TinyLink>
        <TinyLink to="/planner/timeline" icon={CalendarRange}>The plan</TinyLink>
        <TinyLink to="/planner/reminders" icon={BellRing}>Nudges</TinyLink>
      </section>
    </div>
  );
}

function pickCheer({ bought, giftsTotal, wrapped, overallReady, overdue }: { bought: number; giftsTotal: number; wrapped: number; overallReady: number; overdue: number }): string {
  if (overallReady >= 90) return "You're basically Mrs Claus — nearly there 🌟";
  if (overallReady >= 70) return "Miles ahead of the rest of us — absolute legend ✨";
  if (bought >= 10) return `${bought} pressies sorted. You're on fire 🎁`;
  if (wrapped >= 5) return `${wrapped} wrapped and ready to sparkle under the tree 🎀`;
  if (giftsTotal > 0) return "Bit by bit — this Christmas is coming together 🎄";
  if (overdue > 0) return "A couple of gentle nudges — nothing scary, promise 💛";
  return "Right, shall we sprinkle a bit of Christmas magic? ✨";
}

function friendlyDate(iso: string, today: string): string {
  if (iso === today) return "today";
  if (iso < today) {
    const d = Math.round((Date.parse(today) - Date.parse(iso)) / 86400000);
    return `${d} day${d === 1 ? "" : "s"} ago`;
  }
  const d = Math.round((Date.parse(iso) - Date.parse(today)) / 86400000);
  if (d === 1) return "tomorrow";
  if (d < 7) return `in ${d} days`;
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function VillageCard({
  emoji,
  title,
  body,
  to,
  gradient,
  comingSoon,
}: {
  emoji: string;
  title: string;
  body: string;
  to: string;
  gradient: string;
  comingSoon?: boolean;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.7)] p-5 transition hover:-translate-y-0.5 hover:border-[oklch(0.80_0.14_85_/_0.6)] hover:shadow-[var(--shadow-card)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60"
        style={{ background: gradient }}
      />
      {comingSoon && (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] bg-[oklch(0.13_0.03_245_/_0.8)] px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
          <Sparkles className="h-2.5 w-2.5" /> Coming soon
        </span>
      )}
      <div className="relative">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] text-2xl">
          {emoji}
        </span>
        <h3 className="mt-4 font-display text-xl leading-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        <p className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
          {comingSoon ? "Sneak a peek" : "Open"} <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  );
}

function Cheer({
  icon: Icon,
  label,
  value,
  total,
  pct,
}: {
  icon: typeof Gift;
  label: string;
  value: number | string;
  total: number | string;
  pct: number;
}) {
  return (
    <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-[oklch(0.80_0.14_85_/_0.3)]">
          <Icon className="h-3.5 w-3.5 text-[color:var(--gold)]" />
        </span>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="mt-3 font-display text-2xl gold-text">
        {value} <span className="text-sm text-muted-foreground">/ {total}</span>
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.13_0.03_245_/_0.6)]">
        <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: "var(--gradient-gold)" }} />
      </div>
    </div>
  );
}

function TinyLink({ to, icon: Icon, children }: { to: string; icon: typeof Gift; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] px-4 py-2 text-xs text-muted-foreground transition hover:border-[oklch(0.80_0.14_85_/_0.5)] hover:text-foreground"
    >
      <Icon className="h-3.5 w-3.5 text-[color:var(--gold-soft)]" />
      {children}
    </Link>
  );
}
