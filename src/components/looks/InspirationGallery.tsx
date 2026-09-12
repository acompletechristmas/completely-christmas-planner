import type { LookInspiration } from "@/lib/decorations/inspirations";
import { Sparkles } from "lucide-react";
import { InspirationCard } from "./InspirationCard";

export function InspirationGallery({
  lookSlug,
  lookName,
  inspirations,
}: {
  lookSlug: string;
  lookName: string;
  inspirations: LookInspiration[];
}) {
  if (!inspirations.length) return null;

  return (
    <section className="mt-14">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
        Inspiration
      </p>
      <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight sm:text-4xl">
        Get Inspired by This Look
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
        Real {lookName.toLowerCase()} rooms, trees, tables and details. Choose the one you love and
        see exactly how to recreate it.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {inspirations.map((inspiration, index) => (
          <InspirationCard
            key={inspiration.id}
            lookSlug={lookSlug}
            inspiration={inspiration}
            feature={index === 0}
          />
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[oklch(0.80_0.14_85_/_0.22)] bg-[color:var(--surface-card)] p-6 shadow-[var(--shadow-soft)]">
        <h3 className="font-display text-2xl">Love this look?</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          Shop pieces to recreate it at home.
        </p>
        <a
          href="#shop-the-look"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--gold)] bg-[color:var(--gold)]/10 px-5 py-2.5 text-sm font-medium text-[color:var(--gold)] transition hover:bg-[color:var(--gold)]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Shop this look ↓
        </a>
      </div>
    </section>
  );
}
