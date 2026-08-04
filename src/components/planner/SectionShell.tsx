import type { ComponentType, ReactNode, SVGProps } from "react";

export function SectionShell({
  eyebrow,
  title,
  icon: Icon,
  action,
  children,
}: {
  eyebrow?: string;
  title?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.6)] p-6">
      {(eyebrow || title || action) && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            {eyebrow ? (
              <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2 className="mt-1 flex items-center gap-2.5 font-display text-2xl">
                {Icon ? <SectionIcon icon={Icon} /> : null}
                <span>{title}</span>
              </h2>
            ) : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Elegant gold line icon with a soft glow, sized to sit beside a section title. */
export function SectionIcon({
  icon: Icon,
  className = "",
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
}) {
  return (
    <Icon
      aria-hidden="true"
      strokeWidth={1.4}
      className={
        "h-[1.05em] w-[1.05em] shrink-0 text-[color:var(--gold)] [filter:drop-shadow(0_0_6px_oklch(0.82_0.14_85_/_0.45))] " +
        className
      }
    />
  );
}
