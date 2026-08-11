import type { LookInspiration } from "@/lib/decorations/inspirations";
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
    </section>
  );
}
