import { useMemo, useState } from "react";
import { Check, Plus, Sparkles } from "lucide-react";
import type { Person } from "@/hooks/use-people";
import type { PlannerSettings } from "@/hooks/use-planner-settings";
import type { NewTradition } from "@/hooks/use-traditions";
import { recommendTraditions, type Refinements } from "@/lib/traditions/recommend";
import type { Audience, Cost, Mood, TraditionIdea } from "@/lib/traditions/catalogue";

const AUDIENCE_CHIPS: { key: Audience; label: string }[] = [
  { key: "young_children", label: "Young children" },
  { key: "teenagers", label: "Teenagers" },
  { key: "young_adults", label: "Young adults" },
  { key: "couple", label: "Just the two of us" },
  { key: "adults_no_children", label: "Adults" },
  { key: "extended", label: "Extended family" },
  { key: "alone", label: "On my own" },
];

const MOOD_CHIPS: { key: Mood; label: string }[] = [
  { key: "magical", label: "Magical" },
  { key: "traditional", label: "Traditional" },
  { key: "cosy", label: "Cosy" },
  { key: "fun", label: "Fun" },
  { key: "sentimental", label: "Sentimental" },
  { key: "romantic", label: "Romantic" },
  { key: "relaxing", label: "Relaxing" },
  { key: "active", label: "Active" },
  { key: "creative", label: "Creative" },
  { key: "meaningful", label: "Meaningful" },
];

const BUDGET_CHIPS: { key: Cost; label: string }[] = [
  { key: "free", label: "Free" },
  { key: "low", label: "Budget friendly" },
  { key: "treat", label: "A real treat" },
];

/**
 * Inspire me — curated ideas ranked for this household. Accepting an idea
 * writes an ordinary tradition into the same saved list.
 */
export function InspireTraditions({
  settings,
  people,
  savedKeys,
  onAdd,
}: {
  settings: PlannerSettings | null;
  people: Person[];
  savedKeys: string[];
  onAdd: (input: NewTradition) => void | Promise<unknown>;
}) {
  const [refinements, setRefinements] = useState<Refinements>({});
  const [refining, setRefining] = useState(false);
  const [added, setAdded] = useState<string[]>([]);

  const result = useMemo(
    () => recommendTraditions({ settings, people, alreadySavedKeys: savedKeys, refinements }),
    [settings, people, savedKeys, refinements],
  );

  const toggle = <K extends "audiences" | "moods">(group: K, value: Audience | Mood) => {
    setRefinements((prev) => {
      const list = (prev[group] ?? []) as string[];
      const next = list.includes(value as string)
        ? list.filter((v) => v !== value)
        : [...list, value as string];
      return { ...prev, [group]: next };
    });
  };

  const accept = async (idea: TraditionIdea) => {
    setAdded((prev) => [...prev, idea.key]);
    await onAdd({
      name: idea.name,
      description: idea.how,
      category: idea.category,
      timing: idea.timing,
      source: "inspiration",
      suggestion_key: idea.key,
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-[26px] leading-tight sm:text-3xl">{result.heading}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--muted-foreground)]">
          {result.because} Add any you love — they become your own traditions, yours to edit.
        </p>
        <button
          type="button"
          onClick={() => setRefining((r) => !r)}
          aria-expanded={refining}
          className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[color:var(--gold)]/40 px-4 text-sm text-[color:var(--gold-soft)]"
        >
          <Sparkles className="h-4 w-4" />
          {refining ? "Hide" : "Tune these ideas"}
        </button>
      </header>

      {refining && (
        <div className="space-y-4 rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-card)] p-4">
          <ChipGroup
            label="Who's Christmas is this?"
            options={AUDIENCE_CHIPS}
            selected={refinements.audiences ?? []}
            onToggle={(v) => toggle("audiences", v as Audience)}
          />
          <ChipGroup
            label="The kind of Christmas you want"
            options={MOOD_CHIPS}
            selected={refinements.moods ?? []}
            onToggle={(v) => toggle("moods", v as Mood)}
          />
          <ChipGroup
            label="Spending"
            options={BUDGET_CHIPS}
            selected={refinements.budget ? [refinements.budget] : []}
            onToggle={(v) =>
              setRefinements((prev) => ({ ...prev, budget: prev.budget === v ? null : (v as Cost) }))
            }
          />
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {result.ideas.map((idea) => {
          const isAdded = added.includes(idea.key);
          return (
            <li
              key={idea.key}
              className="flex flex-col rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-card)] p-4"
            >
              <h3 className="font-display text-[19px] leading-snug">{idea.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-foreground)]">{idea.blurb}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--foreground)]/75">{idea.how}</p>
              {idea.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {idea.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[color:var(--gold)]/30 px-2.5 py-1 text-[11px] text-[color:var(--muted-foreground)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => void accept(idea)}
                disabled={isAdded}
                className={`mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${
                  isAdded
                    ? "border-[color:var(--gold)]/30 text-[color:var(--muted-foreground)]"
                    : "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--foreground)]"
                }`}
              >
                {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isAdded ? "Added to our Christmas" : "Add to our Christmas"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { key: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.key);
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onToggle(o.key)}
              aria-pressed={on}
              className={`min-h-[44px] rounded-full border px-4 text-sm transition ${
                on
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15"
                  : "border-[color:var(--gold)]/30 text-[color:var(--muted-foreground)]"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
