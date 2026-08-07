import type { ReactNode } from "react";
import { Star, Snowflake, MapPin, CalendarDays } from "lucide-react";
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
  /** Save / calendar / booking actions, rendered in the card footer. */
  actions?: ReactNode;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function ExperienceCard({
  experience,
  badge,
  recommendation,
  showRating,
  actions,
}: ExperienceCardProps) {
  const tags = [
    PRICE_LABELS[experience.priceBand],
    SETTING_LABELS[experience.setting],
    ...experience.audiences.slice(0, 2).map((a) => AUDIENCE_LABELS[a]),
  ];

  const place = experience.venue ?? experience.town;
  const dateLabel = experience.startDate
    ? experience.endDate && experience.endDate !== experience.startDate
      ? `${formatDate(experience.startDate)} – ${formatDate(experience.endDate)}`
      : formatDate(experience.startDate)
    : null;

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
        {showRating && experience.rating != null ? (
          <span className="inline-flex items-center gap-1 text-[12px] text-[color:var(--muted-foreground)]">
            <Star className="h-3 w-3 text-[color:var(--gold)]" /> {experience.rating.toFixed(1)}
          </span>
        ) : null}
      </div>

      {experience.blurb ? (
        <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          {experience.blurb}
        </p>
      ) : null}

      {place || dateLabel || experience.distanceMiles != null ? (
        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[color:var(--muted-foreground)]">
          {place ? (
            <li className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden className="h-3.5 w-3.5 text-[color:var(--gold)]" />
              {place}
              {experience.distanceMiles != null
                ? ` · ${experience.distanceMiles.toFixed(experience.distanceMiles < 10 ? 1 : 0)} miles`
                : ""}
            </li>
          ) : experience.distanceMiles != null ? (
            <li className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden className="h-3.5 w-3.5 text-[color:var(--gold)]" />
              {experience.distanceMiles.toFixed(experience.distanceMiles < 10 ? 1 : 0)} miles away
            </li>
          ) : null}
          {dateLabel ? (
            <li className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden className="h-3.5 w-3.5 text-[color:var(--gold)]" />
              {dateLabel}
              {experience.time ? ` · ${experience.time}` : ""}
            </li>
          ) : null}
        </ul>
      ) : null}

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

      <div className="mt-auto flex min-h-8 flex-wrap items-center justify-between gap-3 pt-4 text-[12px] text-[color:var(--muted-foreground)]">
        <span>
          {experience.priceFrom != null && experience.priceFrom > 0
            ? `From £${experience.priceFrom.toFixed(experience.priceFrom % 1 === 0 ? 0 : 2)}`
            : experience.priceBand === "free"
              ? "Free"
              : ""}
        </span>
        {actions}
      </div>

      {experience.sourceName ? (
        <p className="mt-2 text-[11px] text-[color:var(--muted-foreground)]">
          via{" "}
          {experience.sourceUrl ? (
            <a
              href={experience.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[color:var(--forest)]"
            >
              {experience.sourceName}
            </a>
          ) : (
            experience.sourceName
          )}
        </p>
      ) : null}
    </article>
  );
}
