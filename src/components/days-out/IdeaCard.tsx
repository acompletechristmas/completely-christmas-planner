import { MapPin, Sparkles } from "lucide-react";
import type { ExperienceIdea } from "@/lib/days-out/ideas";

interface Props {
  idea: ExperienceIdea;
  onFindNearMe: (idea: ExperienceIdea) => void;
}

/**
 * An IDEA card. No price, no date, no venue, no booking link — an idea is
 * never dressed up as a real listing. It only ever starts a genuine search.
 */
export function IdeaCard({ idea, onFindNearMe }: Props) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] p-5 backdrop-blur-sm">
      <div className="flex items-start gap-2">
        <Sparkles aria-hidden className="pointer-events-none mt-1 h-4 w-4 shrink-0 text-[color:var(--gold)]" />
        <h3 className="font-display text-xl leading-tight tracking-tight">{idea.title}</h3>
      </div>

      <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{idea.why}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {idea.tags.map((t) => (
          <li
            key={t}
            className="rounded-full border border-[oklch(0.80_0.14_85_/_0.22)] px-2.5 py-1 text-[11px] text-[color:var(--gold-soft)]"
          >
            {t}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onFindNearMe(idea)}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--gold)] px-5 text-sm font-semibold text-[oklch(0.20_0.03_250)] transition hover:brightness-110"
      >
        <MapPin aria-hidden className="pointer-events-none h-4 w-4" />
        Find this near me
      </button>
    </article>
  );
}
