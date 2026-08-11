import type { PaletteColour } from "@/lib/decorations/looks";

export function PalettePreview({ palette }: { palette: PaletteColour[] }) {
  if (!palette.length) return null;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-[oklch(0.82_0.14_85_/_0.35)] shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
        <ul className="flex w-full">
          {palette.map((colour) => (
            <li
              key={colour.hex + colour.name}
              className="flex-1"
              style={{ backgroundColor: colour.hex }}
              aria-label={colour.name}
            >
              <div className="h-8 sm:h-10" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>

      <ul className="flex w-full gap-1">
        {palette.map((colour) => (
          <li
            key={colour.hex + colour.name + "-label"}
            className="flex-1 min-w-0 px-0.5 text-center text-xs font-medium tracking-wide text-[color:var(--muted-foreground)]"
          >
            <span className="block leading-tight">{colour.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
