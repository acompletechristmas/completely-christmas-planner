import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  inspirationCategoryLabel,
  inspirationImage,
  type LookInspiration,
} from "@/lib/decorations/inspirations";

export function InspirationCard({
  lookSlug,
  inspiration,
  feature = false,
}: {
  lookSlug: string;
  inspiration: LookInspiration;
  feature?: boolean;
}) {
  const image = inspirationImage(lookSlug, inspiration);

  return (
    <Link
      to="/inspire/looks/$slug/$inspiration"
      params={{ slug: lookSlug, inspiration: inspiration.slug }}
      className={`group flex min-h-11 flex-col overflow-hidden rounded-[18px] border border-[oklch(0.80_0.14_85_/_0.22)] bg-[color:var(--surface-card)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${
        feature ? "sm:col-span-2" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${feature ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {image ? (
          <img
            src={image}
            alt={inspiration.title}
            width={1200}
            height={900}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : null}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] bg-[color:var(--card)]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gold-soft)]">
          {inspirationCategoryLabel(inspiration.category)}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-[19px] leading-tight tracking-tight text-[color:var(--foreground)]">
          {inspiration.title}
        </h3>
        {inspiration.description ? (
          <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[color:var(--muted-foreground)]">
            {inspiration.description}
          </p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[color:var(--gold-soft)]">
          See this look <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
