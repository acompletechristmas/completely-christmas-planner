import type { ReactNode } from "react";

export function SectionShell({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow?: string;
  title?: string;
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
            {title ? <h2 className="mt-1 font-display text-2xl">{title}</h2> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
