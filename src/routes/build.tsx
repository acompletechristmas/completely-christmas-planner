import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowfall } from "@/components/Snowfall";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: "Build My Christmas — A Complete Christmas" },
      { name: "description", content: "A gentle, guided journey to help you plan your perfect Christmas — your people, your style, your priorities." },
      { property: "og:title", content: "Build My Christmas — A Complete Christmas" },
      { property: "og:description", content: "A gentle, guided journey to plan your perfect Christmas." },
      { property: "og:url", content: "https://acompletechristmas.co.uk/build" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/build" }],
  }),
  component: BuildJourney,
});

type Choices = { people: string[]; feel: string[]; help: string[] };

const STORAGE_KEY = "acc_build_choices_v1";

const PEOPLE = [
  "Young children",
  "Teenagers",
  "Children of different ages",
  "Grown-up children coming home",
  "Adult family",
  "A couple",
  "Friends",
  "Extended family",
  "Spending Christmas alone",
  "Pets",
  "Something else",
];

const FEEL = [
  "Magical", "Traditional", "Calm and organised", "Cosy", "Fun",
  "Meaningful", "Luxurious", "Budget-friendly", "Full of activities",
  "Simple and relaxed", "Nostalgic", "Different this year",
];

const HELP = [
  "I don't know where to begin",
  "Presents",
  "Budget",
  "Days out and events",
  "Food and hosting",
  "Decorations",
  "Traditions",
  "Films, music and entertainment",
  "Keeping everyone occupied",
  "Planning my time",
  "All of it",
];

const STEP_HEADINGS = [
  { eyebrow: "Step 1 of 3", title: "Who will be part of your Christmas?", sub: "Pick everyone you'll be celebrating with — you can choose more than one." },
  { eyebrow: "Step 2 of 3", title: "How would you like Christmas to feel?", sub: "There are no wrong answers. Pick as many as fit." },
  { eyebrow: "Step 3 of 3", title: "What would you like help with?", sub: "We'll tailor your Christmas around this." },
];

function loadChoices(): Choices {
  if (typeof window === "undefined") return { people: [], feel: [], help: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { people: [], feel: [], help: [] };
}

function BuildJourney() {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<Choices>({ people: [], feel: [], help: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChoices(loadChoices());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choices)); } catch { /* ignore */ }
  }, [choices, hydrated]);

  const toggle = (key: keyof Choices, value: string) => {
    setChoices((c) => {
      const set = new Set(c[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...c, [key]: Array.from(set) };
    });
  };

  const total = 4; // 3 questions + results
  const progress = Math.round(((step + (step === total - 1 ? 1 : 0)) / total) * 100);

  return (
    <div className="relative min-h-screen text-[color:var(--cream)]">
      <SiteNav />
      <Snowfall count={45} />

      <div className="relative z-10 mx-auto max-w-3xl px-5 pt-28 pb-16 sm:px-8 sm:pt-32">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[color:var(--cream)]/60 transition hover:text-[color:var(--gold)]"
        >
          <ArrowLeft className="h-3 w-3" /> Home
        </Link>

        {/* Progress rail */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[color:var(--gold)]/80">
            <span>Build My Christmas</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--cream)]/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, oklch(0.88 0.12 85), oklch(0.72 0.13 78))" }}
            />
          </div>
        </div>

        {step < 3 ? (
          <StepPanel
            key={step}
            heading={STEP_HEADINGS[step]}
            options={step === 0 ? PEOPLE : step === 1 ? FEEL : HELP}
            selected={choices[step === 0 ? "people" : step === 1 ? "feel" : "help"]}
            onToggle={(v) => toggle(step === 0 ? "people" : step === 1 ? "feel" : "help", v)}
            onBack={step > 0 ? () => setStep((s) => s - 1) : undefined}
            onNext={() => setStep((s) => s + 1)}
            canSkip={step > 0}
          />
        ) : (
          <Results choices={choices} onEdit={() => setStep(0)} />
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

function StepPanel({
  heading, options, selected, onToggle, onBack, onNext, canSkip,
}: {
  heading: { eyebrow: string; title: string; sub: string };
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  onBack?: () => void;
  onNext: () => void;
  canSkip: boolean;
}) {
  return (
    <section
      className="mt-8 rounded-3xl p-6 sm:p-10"
      style={{
        background: "linear-gradient(180deg, oklch(0.88 0.11 85 / 0.10), oklch(0.55 0.10 70 / 0.06))",
        border: "1px solid oklch(0.86 0.11 85 / 0.35)",
        backdropFilter: "blur(20px) saturate(160%)",
        boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.10), 0 30px 80px -30px rgba(0,0,0,0.7)",
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--gold)]">
        {heading.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-[30px] leading-tight tracking-tight sm:text-[42px]">
        {heading.title}
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--cream)]/75">
        {heading.sub}
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              aria-pressed={on}
              className={
                "group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13.5px] transition " +
                (on
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--cream)]"
                  : "border-[color:var(--cream)]/20 bg-[color:var(--cream)]/[0.03] text-[color:var(--cream)]/85 hover:border-[color:var(--gold)]/60 hover:bg-[color:var(--gold)]/10")
              }
            >
              <span
                className={
                  "grid h-4 w-4 place-items-center rounded-full border transition " +
                  (on ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-[color:var(--midnight-deep)]" : "border-[color:var(--cream)]/30")
                }
              >
                {on ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cream)]/25 px-4 py-2 text-[12.5px] text-[color:var(--cream)]/80 transition hover:border-[color:var(--gold)]/60 hover:text-[color:var(--gold)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        ) : <span />}
        <div className="flex items-center gap-3">
          {canSkip ? (
            <button
              type="button"
              onClick={onNext}
              className="text-[12px] uppercase tracking-[0.22em] text-[color:var(--cream)]/50 transition hover:text-[color:var(--gold)]"
            >
              Skip
            </button>
          ) : null}
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-[color:var(--midnight-deep)] transition hover:brightness-110"
            style={{
              background: "linear-gradient(180deg, oklch(0.90 0.12 85), oklch(0.72 0.13 78))",
              boxShadow: "0 12px 40px -14px oklch(0.82 0.14 85 / 0.7)",
            }}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Results({ choices, onEdit }: { choices: Choices; onEdit: () => void }) {
  const cards = useMemo(() => buildCards(choices), [choices]);

  return (
    <section
      className="mt-8 rounded-3xl p-6 sm:p-10"
      style={{
        background: "linear-gradient(180deg, oklch(0.88 0.11 85 / 0.10), oklch(0.55 0.10 70 / 0.06))",
        border: "1px solid oklch(0.86 0.11 85 / 0.35)",
        backdropFilter: "blur(20px) saturate(160%)",
        boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.10), 0 30px 80px -30px rgba(0,0,0,0.7)",
      }}
    >
      <div className="flex items-center gap-2 text-[color:var(--gold)]">
        <Sparkles className="h-4 w-4" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em]">Personalised for you</span>
      </div>
      <h1 className="mt-3 font-display text-[32px] leading-tight tracking-tight sm:text-[46px]">
        Your Christmas <span className="italic gold-text">starts here</span>
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--cream)]/80">
        Your Christmas is taking shape. Here are the little corners we've set aside for you —
        open any of them whenever you're ready.
      </p>

      {(choices.people.length + choices.feel.length + choices.help.length) > 0 ? (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {[...choices.people, ...choices.feel, ...choices.help].slice(0, 12).map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/10 px-2.5 py-1 text-[11px] text-[color:var(--cream)]/85"
            >
              <span className="text-[color:var(--gold)]">✦</span> {c}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className="group rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--cream)]/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--gold)]/60 hover:bg-[color:var(--gold)]/[0.06]"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--gold)]/80">{c.tag}</p>
            <h3 className="mt-2 font-display text-[22px] leading-tight text-[color:var(--cream)] group-hover:text-[color:var(--gold)]">
              {c.title}
            </h3>
            <p className="mt-2 text-[13.5px] leading-snug text-[color:var(--cream)]/70">{c.desc}</p>
            <p className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[color:var(--gold)]">
              Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--cream)]/[0.03] p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--gold)]/80">Your Christmas is taking shape</p>
        <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--cream)]/10">
          <div
            className="h-full rounded-full"
            style={{ width: "12%", background: "linear-gradient(90deg, oklch(0.88 0.12 85), oklch(0.72 0.13 78))" }}
          />
        </div>
        <p className="mt-3 text-[13px] text-[color:var(--cream)]/70">
          A gentle start — no pressure, no ticking clocks. Come back whenever the fairy lights call.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          to="/planner"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-[color:var(--midnight-deep)] transition hover:brightness-110"
          style={{
            background: "linear-gradient(180deg, oklch(0.90 0.12 85), oklch(0.72 0.13 78))",
            boxShadow: "0 12px 40px -14px oklch(0.82 0.14 85 / 0.7)",
          }}
        >
          Open my planner <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cream)]/25 px-4 py-2 text-[12.5px] text-[color:var(--cream)]/80 transition hover:border-[color:var(--gold)]/60 hover:text-[color:var(--gold)]"
        >
          Edit my answers
        </button>
      </div>
    </section>
  );
}

function buildCards(choices: Choices): { tag: string; title: string; desc: string; to: string }[] {
  const wants = new Set(choices.help.map((h) => h.toLowerCase()));
  const all = wants.has("all of it") || wants.has("i don't know where to begin");
  const people = choices.people;

  const cards: { tag: string; title: string; desc: string; to: string; priority: number }[] = [];

  const push = (c: { tag: string; title: string; desc: string; to: string }, priority: number) => {
    if (!cards.find((x) => x.title === c.title)) cards.push({ ...c, priority });
  };

  // People & presents — nearly always relevant
  if (all || wants.has("presents") || people.length > 0) {
    push({ tag: "For your people", title: "My People & Presents", desc: "Add everyone you're buying for and keep every gift idea, budget and wrap safely in one place.", to: "/planner" }, 1);
  }

  // Plans
  push({ tag: "The big picture", title: "My Christmas Plans", desc: "A gentle, step-by-step guide from first idea to Christmas morning.", to: "/planner" }, 2);

  // Days out
  if (all || wants.has("days out and events") || wants.has("keeping everyone occupied") || people.includes("Young children") || people.includes("Children of different ages")) {
    push({ tag: "Out & about", title: "Things We'd Love to Do", desc: "Markets, grottos, walks and cosy days out worth putting in the diary.", to: "/days-out" }, 3);
  }

  // Home / decorations
  if (all || wants.has("decorations")) {
    push({ tag: "At home", title: "My Christmas Home", desc: "Ideas for a home that feels warm, welcoming and unmistakably Christmas.", to: "/inspire" }, 4);
  }

  // Food & hosting
  if (all || wants.has("food and hosting")) {
    push({ tag: "Around the table", title: "Food & Hosting", desc: "Menus, timings and cosy recipes for however many people you're feeding.", to: "/food" }, 5);
  }

  // Budget
  if (all || wants.has("budget") || choices.feel.includes("Budget-friendly")) {
    push({ tag: "Kept in check", title: "My Christmas Budget", desc: "Set a gentle total and see who and what it's going towards — no surprises.", to: "/save" }, 6);
  }

  // Traditions & entertainment
  if (all || wants.has("traditions") || wants.has("films, music and entertainment") || choices.feel.includes("Nostalgic") || choices.feel.includes("Traditional")) {
    push({ tag: "The magic", title: "Traditions & Special Moments", desc: "Little rituals, films, music and moments that make it feel like Christmas.", to: "/entertainment" }, 7);
  }

  // Pets
  if (people.includes("Pets")) {
    push({ tag: "Furry family", title: "Christmas with Pets", desc: "Safe, joyful ways to include your four-legged loved ones.", to: "/pets" }, 8);
  }

  return cards.sort((a, b) => a.priority - b.priority).slice(0, 8);
}
