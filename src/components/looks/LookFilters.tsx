import { LOOK_STYLE_FILTERS } from "@/lib/decorations/looks";

export function LookFilters({
  active,
  onChange,
}: {
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {LOOK_STYLE_FILTERS.map((filter) => {
        const isActive = filter === active;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={isActive}
            className={`inline-flex min-h-11 items-center rounded-full px-5 text-[13px] font-medium transition-all duration-200 ${
              isActive
                ? "border border-[color:var(--gold)] bg-[color:var(--gold)] text-[color:var(--midnight-deep)] shadow-[var(--shadow-glow-gold)]"
                : "border border-[color:var(--border)] bg-[color:var(--surface-card)] text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
