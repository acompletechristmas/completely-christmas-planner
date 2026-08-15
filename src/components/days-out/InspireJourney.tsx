import { Loader2, Shuffle, Sparkles } from "lucide-react";
import { LocationDateSearch, type LocationDateValues } from "./LocationDateSearch";
import { IdeaCard } from "./IdeaCard";
import {
  GROUP_LABELS,
  GROUP_VALUES,
  MOOD_LABELS,
  MOOD_VALUES,
  type ExperienceIdea,
  type IdeaGroup,
  type IdeaMood,
} from "@/lib/days-out/ideas";

interface Props {
  group: IdeaGroup | undefined;
  ages: string;
  moods: IdeaMood[];
  onGroupChange: (group: IdeaGroup) => void;
  onAgesChange: (ages: string) => void;
  onToggleMood: (mood: IdeaMood) => void;

  searchValues: LocationDateValues;
  searching: boolean;
  onSearch: (values: LocationDateValues) => void;

  heading: string;
  ideas: ExperienceIdea[];
  loadingIdeas: boolean;
  onMoreIdeas: () => void;
  onSurpriseMe: () => void;
  onFindNearMe: (idea: ExperienceIdea) => void;
}

export function InspireJourney({
  group,
  ages,
  moods,
  onGroupChange,
  onAgesChange,
  onToggleMood,
  searchValues,
  searching,
  onSearch,
  heading,
  ideas,
  loadingIdeas,
  onMoreIdeas,
  onSurpriseMe,
  onFindNearMe,
}: Props) {
  const showMoods = Boolean(group);
  const showIdeas = Boolean(group) && moods.length > 0;

  return (
    <div className="space-y-8">
      {/* Step 1 — who's going */}
      <section aria-label="Who's going?">
        <StepLabel step="1" title="Who's going?" />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {GROUP_VALUES.map((g) => {
            const active = group === g;
            return (
              <button
                key={g}
                type="button"
                aria-pressed={active}
                onClick={() => onGroupChange(g)}
                className={`min-h-11 w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  active
                    ? "border-[color:var(--gold)] bg-[color:var(--gold)]/12 text-[color:var(--gold-soft)]"
                    : "border-[oklch(0.80_0.14_85_/_0.22)] text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)]"
                }`}
              >
                {GROUP_LABELS[g]}
              </button>
            );
          })}
        </div>

        {showMoods ? (
          <label className="mt-3 block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
              Ages (optional)
            </span>
            <input
              type="text"
              inputMode="text"
              placeholder="e.g. 4 and 7"
              value={ages}
              onChange={(e) => onAgesChange(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.6)] px-4 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--gold)] focus:outline-none"
            />
          </label>
        ) : null}
      </section>

      {/* Step 2 — mood */}
      {showMoods ? (
        <section aria-label="What sort of Christmas experience?">
          <StepLabel step="2" title="What sort of Christmas?" />
          <p className="mt-1 text-[13px] text-[color:var(--muted-foreground)]">
            Pick as many as you like.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {MOOD_VALUES.map((m) => {
              const active = moods.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleMood(m)}
                  className={`min-h-11 rounded-full border px-4 text-sm transition ${
                    active
                      ? "border-[color:var(--gold)] bg-[color:var(--gold)]/12 text-[color:var(--gold-soft)]"
                      : "border-[oklch(0.80_0.14_85_/_0.22)] text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)]"
                  }`}
                >
                  {active ? "✓ " : ""}
                  {MOOD_LABELS[m]}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Step 3 — the existing location/date search, reused as-is */}
      {showIdeas ? (
        <section aria-label="Where and when">
          <StepLabel step="3" title="Where and when" />
          <p className="mt-1 mb-3 text-[13px] text-[color:var(--muted-foreground)]">
            We'll use this the moment you pick an idea to find real things near you.
          </p>
          <LocationDateSearch initial={searchValues} searching={searching} onSearch={onSearch} />
        </section>
      ) : null}

      {/* Ideas */}
      {showIdeas ? (
        <section aria-label="Christmas ideas for you">
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden className="pointer-events-none h-4 w-4 text-[color:var(--gold)]" />
            <h2 className="font-display text-[26px] leading-tight tracking-tight sm:text-3xl">
              {heading}
            </h2>
          </div>
          <p className="mt-1 text-[13px] text-[color:var(--muted-foreground)]">
            Christmas ideas, not listings — pick one and we'll search for the real thing near you.
          </p>

          {loadingIdeas ? (
            <p className="mt-5 flex items-center gap-2 text-sm text-[color:var(--muted-foreground)]">
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
              Thinking of some Christmas ideas…
            </p>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} onFindNearMe={onFindNearMe} />
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onMoreIdeas}
              className="min-h-11 rounded-full border border-[color:var(--gold)] px-5 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:bg-[color:var(--gold)]/10"
            >
              Show me more ideas
            </button>
            <button
              type="button"
              onClick={onSurpriseMe}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] px-5 text-sm text-[color:var(--muted-foreground)] transition hover:border-[color:var(--gold)]"
            >
              <Shuffle aria-hidden className="pointer-events-none h-4 w-4" />
              Surprise me
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function StepLabel({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] text-[12px] text-[color:var(--gold-soft)]">
        {step}
      </span>
      <h2 className="font-display text-xl leading-tight tracking-tight sm:text-2xl">{title}</h2>
    </div>
  );
}
