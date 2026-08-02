import { Star, Snowflake } from "lucide-react";
import {
  AUDIENCE_LABELS,
  PRICE_LABELS,
  SETTING_LABELS,
  TYPE_LABELS,
  type Experience,
} from "@/lib/days-out/experience-data";

interface ExperienceCardProps {
  experience: Experience;
  /** Reserved for future AI recommendations, e.g. "AI Pick". Unused for now. */
  badge?: string;
  /** Reserved for future recommendation copy, e.g. "Perfect for young children". Unused for now. */
  recommendation?: string;
  showRating?: boolean;
}

export function ExperienceCard({
  experience,
  badge,
  recommendation,
  showRating,
}: ExperienceCardProps) {
  const tags = [
    PRICE_LABELS[experience.priceBand],
    SETTING_LABELS[experience.setting],
    ...experience.audiences.slice(0, 2).map((a) => AUDIENCE_LABELS[a]),
  ];

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--mist)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <Snowflake
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 text-[color:var(--gold)] opacity-[0.06]"
      />

      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[color:var(--forest)]">
        {TYPE_LABELS[experience.type]}
      </p>
      <h3 className="mt-2 font-display text-[21px] leading-tight tracking-tight text-[color:var(--ink)]">
        {experience.name}
      </h3>

      {/* Reserved slot for future AI badges / recommendation copy. Holds its height when empty. */}
      <div className="mt-2 flex min-h-6 flex-wrap items-center gap-2">
        {badge ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--forest)]">
            <Star className="h-3 w-3" /> {badge}
          </span>
        ) : null}
        {recommendation ? (
          <span className="text-[12px] text-[color:var(--muted-foreground)]">{recommendation}</span>
        ) : null}
        {showRating ? (
          <span className="inline-flex items-center gap-1 text-[12px] text-[color:var(--muted-foreground)]">
            <Star className="h-3 w-3 text-[color:var(--gold)]" /> {experience.rating.toFixed(1)}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
        {experience.blurb}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <li
            key={t}
            className="rounded-full border border-[color:var(--border)] px-2.5 py-1 text-[11px] text-[color:var(--muted-foreground)]"
          >
            {t}
          </li>
        ))}
      </ul>

      {/* Reserved footer: future distance, Save to Festive Activities and Add to Calendar.
          Holds its height so adding them later does not change the layout. */}
      <div
        aria-hidden
        className="mt-auto flex min-h-8 items-center justify-between gap-3 pt-4 text-[12px] text-[color:var(--muted-foreground)]"
      />
    </article>
  );
}
