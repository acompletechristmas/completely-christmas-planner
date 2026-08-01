import { Snowflake } from "lucide-react";

export function ExperienceEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--mist)] p-10 text-center">
      <Snowflake className="mx-auto h-8 w-8 text-[color:var(--gold)]" />
      <h3 className="mt-4 font-display text-2xl text-[color:var(--ink)]">
        No festive ideas match just yet
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-[15px] text-[color:var(--muted-foreground)]">
        Loosen a filter or two and the magic will come back.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 min-h-11 rounded-full border border-[color:var(--gold)] px-5 text-sm text-[color:var(--gold-soft)] transition hover:bg-[color:var(--gold)]/10"
      >
        Clear filters
      </button>
    </div>
  );
}
