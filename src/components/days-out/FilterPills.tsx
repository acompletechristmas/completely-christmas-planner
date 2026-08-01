interface Option<T extends string> {
  value: T;
  label: string;
}

interface FilterPillsProps<T extends string> {
  legend: string;
  options: Option<T>[];
  selected: T[];
  onToggle: (value: T) => void;
}

export function FilterPills<T extends string>({
  legend,
  options,
  selected,
  onToggle,
}: FilterPillsProps<T>) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-[11px] font-medium uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
        {legend}
      </legend>
      <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o.value)}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-sm transition ${
                active
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)]/12 text-[color:var(--gold-soft)]"
                  : "border-[oklch(0.80_0.14_85_/_0.22)] text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)]"
              }`}
            >
              {active ? "✓ " : ""}
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
