import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import {
  Gift,
  Sparkles,
  UtensilsCrossed,
  PartyPopper,
  Mail,
  Star,
  Home,
  ListChecks,
  ArrowRight,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/")({
  component: PlannerOverview,
});

interface GiftRow extends BaseRow {
  status: "idea" | "bought" | "wrapped" | "given";
}
interface CardRow extends BaseRow { sent: boolean }
interface TodoRow extends BaseRow {
  done: boolean;
  category: string | null;
}

type StepKey =
  | "gifts"
  | "decorations"
  | "food"
  | "events"
  | "cards"
  | "traditions"
  | "home"
  | "checklist";

interface Step {
  key: StepKey;
  number: number;
  title: string;
  tagline: string;
  emoji: string;
  icon: LucideIcon;
  to: string;
  gradient: string;
  border: string;
}

const STEPS: Step[] = [
  {
    key: "gifts",
    number: 1,
    title: "Gifts",
    tagline: "Who's on the list, what to buy, wrapped and ready.",
    emoji: "🎁",
    icon: Gift,
    to: "/planner/list",
    gradient: "linear-gradient(135deg, oklch(0.55 0.18 25), oklch(0.45 0.14 15))",
    border: "oklch(0.80 0.14 25 / 0.45)",
  },
  {
    key: "decorations",
    number: 2,
    title: "Decorations",
    tagline: "Tree, lights, wreaths — every twinkle in one place.",
    emoji: "✨",
    icon: Sparkles,
    to: "/planner/my",
    gradient: "linear-gradient(135deg, oklch(0.80 0.14 85), oklch(0.65 0.12 60))",
    border: "oklch(0.80 0.14 85 / 0.45)",
  },
  {
    key: "food",
    number: 3,
    title: "Food",
    tagline: "Menus, orders, mince pies and Christmas morning fizz.",
    emoji: "🍰",
    icon: UtensilsCrossed,
    to: "/planner/my",
    gradient: "linear-gradient(135deg, oklch(0.50 0.14 30), oklch(0.40 0.10 20))",
    border: "oklch(0.80 0.14 40 / 0.4)",
  },
  {
    key: "events",
    number: 4,
    title: "Events",
    tagline: "Parties, grottos, carols and cosy nights out.",
    emoji: "🎉",
    icon: PartyPopper,
    to: "/planner/my",
    gradient: "linear-gradient(135deg, oklch(0.55 0.16 340), oklch(0.42 0.12 320))",
    border: "oklch(0.75 0.14 340 / 0.4)",
  },
  {
    key: "cards",
    number: 5,
    title: "Cards",
    tagline: "Write, address, pop them in the post in time.",
    emoji: "💌",
    icon: Mail,
    to: "/planner/cards",
    gradient: "linear-gradient(135deg, oklch(0.55 0.12 150), oklch(0.42 0.10 155))",
    border: "oklch(0.75 0.12 150 / 0.4)",
  },
  {
    key: "traditions",
    number: 6,
    title: "Traditions",
    tagline: "Elf, films, family calls — the sparkly bits.",
    emoji: "⭐",
    icon: Star,
    to: "/planner/my",
    gradient: "linear-gradient(135deg, oklch(0.60 0.14 280), oklch(0.42 0.12 265))",
    border: "oklch(0.75 0.14 280 / 0.4)",
  },
  {
    key: "home",
    number: 7,
    title: "Home Preparation",
    tagline: "Guest beds, cosy corners, big clean before the day.",
    emoji: "🏡",
    icon: Home,
    to: "/planner/my",
    gradient: "linear-gradient(135deg, oklch(0.50 0.10 200), oklch(0.38 0.08 220))",
    border: "oklch(0.75 0.12 210 / 0.4)",
  },
  {
    key: "checklist",
    number: 8,
    title: "Final Checklist",
    tagline: "The last-week sweep — nothing forgotten.",
    emoji: "🌟",
    icon: ListChecks,
    to: "/planner/todos",
    gradient: "linear-gradient(135deg, oklch(0.82 0.14 85), oklch(0.62 0.14 55))",
    border: "oklch(0.85 0.14 85 / 0.55)",
  },
];

// Which todo categories count toward each step
const CATEGORY_MAP: Record<StepKey, string[]> = {
  gifts: ["gifts", "wrapping"],
  decorations: ["decorations"],
  food: ["food"],
  events: ["events", "travel"],
  cards: ["cards"],
  traditions: ["elf", "family", "school"],
  home: [],
  checklist: [],
};

function PlannerOverview() {
  const { user } = useAuth();
  const gifts = usePlannerList<GiftRow>("gifts", user?.id);
  const cards = usePlannerList<CardRow>("cards", user?.id);
  const todos = usePlannerList<TodoRow>("todos", user?.id);

  const stepProgress = (key: StepKey): { done: number; total: number; pct: number } => {
    let done = 0;
    let total = 0;

    if (key === "gifts") {
      total += gifts.rows.length;
      done += gifts.rows.filter((g) => g.status !== "idea").length;
    }
    if (key === "cards") {
      total += cards.rows.length;
      done += cards.rows.filter((c) => c.sent).length;
    }
    if (key === "checklist") {
      total += todos.rows.length;
      done += todos.rows.filter((t) => t.done).length;
    } else {
      const cats = CATEGORY_MAP[key];
      if (cats.length) {
        const bucket = todos.rows.filter((t) => t.category && cats.includes(t.category));
        total += bucket.length;
        done += bucket.filter((t) => t.done).length;
      }
    }

    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  };

  const perStep = STEPS.map((s) => ({ step: s, ...stepProgress(s.key) }));
  const completedSteps = perStep.filter((s) => s.total > 0 && s.done >= s.total).length;
  const startedSteps = perStep.filter((s) => s.done > 0).length;
  const overallPct = Math.round(
    perStep.reduce((sum, s) => sum + (s.total ? s.done / s.total : 0), 0) / STEPS.length * 100,
  );
  const nextStep = perStep.find((s) => s.total === 0 || s.done < s.total) ?? perStep[0];

  return (
    <div className="rise-in space-y-10">
      {/* Welcome + overall progress */}
      <section className="relative overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          🎄 Your guided Christmas plan
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
          Christmas, <span className="italic gold-text">one gentle step</span> at a time
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Eight little steps that walk you all the way from first pressie idea to the day itself.
          Do them in order, or hop about — we'll keep everything cosy and saved for you.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.5)] p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">Overall</p>
            <p className="mt-1 font-display text-3xl leading-none gold-text">{overallPct}%</p>
            <p className="mt-1 text-[11px] text-muted-foreground">of the way there</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.5)] p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">Steps sorted</p>
            <p className="mt-1 font-display text-3xl leading-none">
              <span className="gold-text">{completedSteps}</span>
              <span className="text-muted-foreground text-2xl"> / {STEPS.length}</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{startedSteps} in progress</p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.5)] p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">Next up</p>
            <p className="mt-1 truncate font-display text-lg">
              {nextStep.step.emoji} {nextStep.step.title}
            </p>
            <Link
              to={nextStep.step.to}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[color:var(--gold-soft)] hover:text-[color:var(--gold)]"
            >
              Start this step <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-[oklch(0.13_0.03_245_/_0.6)]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${overallPct}%`, background: "var(--gradient-gold)" }}
          />
        </div>
      </section>

      {/* The 8 steps */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl sm:text-3xl">Your eight steps to a lovely Christmas</h2>
          <span className="hidden text-xs text-muted-foreground sm:inline">Tap a step to open it</span>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2">
          {perStep.map(({ step, done, total, pct }) => {
            const Icon = step.icon;
            const complete = total > 0 && done >= total;
            return (
              <li key={step.key}>
                <Link
                  to={step.to}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-[oklch(0.26_0.04_245_/_0.7)] p-5 transition hover:-translate-y-0.5 hover:brightness-110 sm:p-6"
                  style={{ borderColor: step.border }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50"
                    style={{ background: step.gradient }}
                  />

                  <div className="flex items-start gap-4">
                    <div
                      className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[oklch(0.80_0.14_85_/_0.4)] text-[color:var(--midnight-deep)] shadow-lg"
                      style={{ background: step.gradient }}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.5)] bg-[oklch(0.13_0.03_245_/_0.9)] text-[10px] font-semibold text-[color:var(--gold-soft)]">
                        {complete ? <Check className="h-3 w-3 text-[color:var(--gold)]" /> : step.number}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-display text-xl sm:text-2xl">
                          {step.emoji} {step.title}
                        </p>
                        <p className={`shrink-0 text-[11px] ${complete ? "text-[color:var(--gold)]" : "text-muted-foreground"}`}>
                          {total === 0 ? "not started" : `${done}/${total}`}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{step.tagline}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.13_0.03_245_/_0.6)]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: complete ? "var(--gradient-gold)" : step.gradient,
                        }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
                        Step {step.number} of {STEPS.length}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--gold-soft)] transition group-hover:text-[color:var(--gold)]">
                        Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Gentle footer note */}
      <section className="rounded-3xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.4)] p-5 text-center sm:p-6">
        <Sparkles className="mx-auto h-5 w-5 text-[color:var(--gold)]" />
        <p className="mt-2 font-display text-lg">No rush, no stress</p>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground sm:text-sm">
          Everything you tap, tick or type is saved safely to your account — pick it back up
          whenever the fairy lights call.
        </p>
      </section>
    </div>
  );
}
