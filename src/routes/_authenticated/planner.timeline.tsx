import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerSettings } from "@/hooks/use-planner-settings";

export const Route = createFileRoute("/_authenticated/planner/timeline")({
  component: TimelinePage,
});

interface Stage {
  months: number[]; // 1-12
  label: string;
  headline: string;
  focus: string[];
}

const STAGES: Stage[] = [
  {
    months: [1, 2, 3],
    label: "January – March",
    headline: "Reflect & set the tone",
    focus: [
      "Review last Christmas — what worked",
      "Start a Christmas savings pot",
      "Set this year's total budget",
      "Save early gift ideas as they come",
      "Check decorations & storage",
    ],
  },
  {
    months: [4, 5, 6],
    label: "April – June",
    headline: "Quietly get ahead",
    focus: [
      "Research festive breaks & hotels",
      "Note popular event release dates",
      "Start gift wish-lists per person",
      "Plan any big purchases",
    ],
  },
  {
    months: [7, 8],
    label: "July – August",
    headline: "Book the things that sell out",
    focus: [
      "Book popular Christmas events (Lapland UK, garden centre Santas)",
      "Book festive breaks & hotels",
      "Start personalised gifts (long lead times)",
      "Draft your gift recipient list",
    ],
  },
  {
    months: [9],
    label: "September",
    headline: "Confirm the plan",
    focus: [
      "Confirm who's coming for Christmas",
      "Finalise the guest list",
      "Book restaurants & experiences",
      "Begin present shopping",
      "Start your Christmas card list",
      "Check international posting deadlines",
    ],
  },
  {
    months: [10],
    label: "October",
    headline: "The shopping month",
    focus: [
      "Buy the biggest presents",
      "Organise Secret Santa",
      "Order personalised items",
      "Plan Christmas meals",
      "Book food delivery slot",
      "Sort teacher gifts",
    ],
  },
  {
    months: [11],
    label: "November",
    headline: "Wrap, write, prepare",
    focus: [
      "Complete most shopping",
      "Write Christmas cards",
      "Buy wrapping supplies",
      "Start wrapping in batches",
      "Confirm event bookings & travel",
      "Prep freezer food",
    ],
  },
  {
    months: [12],
    label: "December",
    headline: "The final stretch",
    focus: [
      "Daily priority list",
      "Last posting dates",
      "Final grocery order",
      "Cooking prep & defrost schedule",
      "Christmas Eve plan",
      "Christmas Day timetable",
    ],
  },
  {
    months: [1], // shown as "after" — see currentMonth logic
    label: "After Christmas",
    headline: "Save memories, reuse next year",
    focus: [
      "Record gifts received",
      "Generate thank-you notes",
      "Rate events & purchases",
      "Save what worked well",
      "Build your Christmas Wrapped",
    ],
  },
];

function TimelinePage() {
  const { user } = useAuth();
  const { settings } = usePlannerSettings(user?.id);
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="rise-in space-y-6">
      <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] p-5">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[color:var(--gold)]" />
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">Your Christmas timeline</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          A year-round rhythm — book the things that sell out early, keep the December stretch calm. Adapts as we learn more about your Christmas.
        </p>
        {!settings?.setup_completed && (
          <Link
            to="/planner/setup"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] px-3 py-1.5 text-xs text-[color:var(--gold-soft)] transition hover:border-[oklch(0.80_0.14_85_/_0.7)]"
          >
            Personalise your timeline →
          </Link>
        )}
      </div>

      <ol className="space-y-3">
        {STAGES.map((stage, idx) => {
          const isNow = stage.months.includes(currentMonth) && stage.label !== "After Christmas";
          const past =
            !isNow &&
            stage.label !== "After Christmas" &&
            Math.max(...stage.months) < currentMonth;
          return (
            <li
              key={idx}
              className={
                "rounded-2xl border p-5 transition " +
                (isNow
                  ? "border-[oklch(0.80_0.14_85_/_0.6)] bg-[oklch(0.80_0.14_85_/_0.08)]"
                  : "border-[oklch(0.80_0.14_85_/_0.18)] bg-[oklch(0.26_0.04_245_/_0.55)]")
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{stage.label}</p>
                  <h3 className="mt-1 font-display text-xl">{stage.headline}</h3>
                </div>
                {isNow ? (
                  <span className="shrink-0 rounded-full bg-[oklch(0.80_0.14_85_/_0.2)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
                    You are here
                  </span>
                ) : past ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--gold-soft)]" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                )}
              </div>
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {stage.focus.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--gold)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
