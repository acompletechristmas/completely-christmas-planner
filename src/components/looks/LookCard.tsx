import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { lookImage, type ChristmasLook } from "@/lib/decorations/looks";

export function LookCard({ look, eager = false }: { look: ChristmasLook; eager?: boolean }) {
  const image = lookImage(look);
  const isNew = look.slug === "latest-trends";
  const cta = isNew ? "Start exploring" : "Explore this look";

  return (
    <Link
      to="/inspire/looks/$slug"
      params={{ slug: look.slug }}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-[color:var(--border)] bg-[color:var(--surface-card)] p-2.5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
        {image ? (
          <img
            src={image}
            alt={`${look.name} Christmas decorating style`}
            width={1200}
            height={900}
            loading={eager ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : null}
        {isNew ? (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gold-soft)]">
            New
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col items-center px-3 pb-2 pt-4 text-center">
        <h3 className="font-display text-[21px] leading-tight tracking-tight text-[color:var(--foreground)]">
          {look.name}
        </h3>
        <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[color:var(--muted-foreground)]">
          {look.shortDescription}
        </p>

        {look.palette.length ? (
          <ul className="mt-4 flex items-center justify-center gap-1.5">
            {look.palette.slice(0, 4).map((colour) => (
              <li
                key={colour.hex + colour.name}
                title={colour.name}
                aria-hidden="true"
                className="h-4 w-4 rounded-full border border-[color:var(--border)] shadow-[0_1px_2px_oklch(0.4_0.05_70_/_0.25)]"
                style={{ backgroundColor: colour.hex }}
              />
            ))}
          </ul>
        ) : null}

        <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[oklch(0.68_0.12_78_/_0.75)] bg-[linear-gradient(160deg,oklch(0.86_0.10_86)_0%,oklch(0.78_0.12_80)_55%,oklch(0.72_0.13_74)_100%)] px-4 text-[13px] font-semibold text-[color:var(--midnight-deep)] shadow-[0_1px_0_oklch(1_0_0_/_0.5)_inset] transition-[filter,transform] duration-200 group-hover:brightness-[1.04]">
          {cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
