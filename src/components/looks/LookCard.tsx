import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { lookImage, type ChristmasLook } from "@/lib/decorations/looks";

export function LookCard({ look, eager = false }: { look: ChristmasLook; eager?: boolean }) {
  const image = lookImage(look);
  return (
    <Link
      to="/inspire/looks/$slug"
      params={{ slug: look.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[oklch(0.80_0.14_85_/_0.28)] bg-[color:var(--surface-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={`${look.name} Christmas decorating style`}
            width={1200}
            height={900}
            loading={eager ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[22px] leading-tight tracking-tight">{look.name}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          {look.shortDescription}
        </p>
        <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[color:var(--gold-soft)]">
          Explore this look <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
