import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { Gift, Mail, ListChecks, PoundSterling, PackageCheck, ArrowRight, BellRing } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/")({
  component: PlannerOverview,
});

interface GiftRow extends BaseRow {
  price: number | null;
  status: "idea" | "bought" | "wrapped" | "given";
}
interface CardRow extends BaseRow { sent: boolean }
interface TodoRow extends BaseRow { done: boolean }
interface ReminderRow extends BaseRow { done: boolean; remind_on: string }

function PlannerOverview() {
  const { user } = useAuth();
  const gifts = usePlannerList<GiftRow>("gifts", user?.id);
  const cards = usePlannerList<CardRow>("cards", user?.id);
  const todos = usePlannerList<TodoRow>("todos", user?.id);
  const reminders = usePlannerList<ReminderRow>("reminders", user?.id);

  const totalSpent = gifts.rows
    .filter((g) => g.status !== "idea")
    .reduce((sum, g) => sum + (Number(g.price) || 0), 0);
  const wrapped = gifts.rows.filter((g) => g.status === "wrapped" || g.status === "given").length;
  const bought = gifts.rows.filter((g) => g.status !== "idea").length;

  const todayIso = new Date().toISOString().slice(0, 10);
  const remindersUpcoming = reminders.rows.filter((r) => !r.done);
  const remindersDueSoon = remindersUpcoming.filter((r) => r.remind_on <= todayIso).length;

  const stats: Array<{
    label: string;
    value: string | number;
    sub: string;
    icon: typeof Gift;
    to?: string;
  }> = [
    {
      label: "Never Miss",
      value: remindersUpcoming.length,
      sub: remindersDueSoon
        ? `${remindersDueSoon} due now`
        : remindersUpcoming.length
          ? "reminders on your timeline"
          : "add the classic set",
      icon: BellRing,
      to: "/planner/reminders",
    },
    {
      label: "Gifts planned",
      value: gifts.rows.length,
      sub: `${bought} bought · ${wrapped} wrapped`,
      icon: Gift,
      to: "/planner/gifts",
    },
    {
      label: "Cards sent",
      value: cards.rows.filter((c) => c.sent).length,
      sub: `of ${cards.rows.length} on your list`,
      icon: Mail,
      to: "/planner/cards",
    },
    {
      label: "To-do done",
      value: todos.rows.filter((t) => t.done).length,
      sub: `of ${todos.rows.length} tasks`,
      icon: ListChecks,
      to: "/planner/todos",
    },
    {
      label: "Spent so far",
      value: `£${totalSpent.toFixed(2)}`,
      sub: "on bought / wrapped gifts",
      icon: PoundSterling,
    },
  ];


  return (
    <div className="rise-in space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, to }) => {
          const inner = (
            <div className="group flex h-full flex-col justify-between rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.18_0.025_25_/_0.7)] p-5 transition hover:-translate-y-0.5 hover:border-[oklch(0.80_0.14_85_/_0.5)]">
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-[oklch(0.80_0.14_85_/_0.3)]">
                  <Icon className="h-4 w-4 text-[color:var(--gold)]" />
                </span>
                {to ? <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[color:var(--gold-soft)]" /> : null}
              </div>
              <div className="mt-6">
                <p className="font-display text-4xl gold-text">{value}</p>
                <p className="mt-1 text-sm text-foreground">{label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          );
          return to ? (
            <Link key={label} to={to}>
              {inner}
            </Link>
          ) : (
            <div key={label}>{inner}</div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <QuickStart
          title="Start your gift list"
          body="Add everyone you're buying for, jot down ideas as they come, track what you've bought and wrapped, and see the budget update as you go."
          to="/planner/gifts"
          icon={Gift}
        />
        <QuickStart
          title="Card tracker"
          body="Never send a card twice — or forget the ones you owe. Tick as you write, seal and send."
          to="/planner/cards"
          icon={PackageCheck}
        />
      </div>
    </div>
  );
}

function QuickStart({ title, body, to, icon: Icon }: { title: string; body: string; to: string; icon: typeof Gift }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.18_0.025_25_/_0.7)] p-6 transition hover:border-[oklch(0.80_0.14_85_/_0.5)]"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-gold)" }}>
          <Icon className="h-5 w-5 text-[color:var(--primary-foreground)]" />
        </span>
        <h3 className="font-display text-2xl">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
      <p className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
        Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}
