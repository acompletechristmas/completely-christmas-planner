import type { PaletteColour } from "@/lib/decorations/looks";

export function PalettePreview({ palette }: { palette: PaletteColour[] }) {
  if (!palette.length) return null;
  return (
    <ul className="flex flex-wrap gap-4">
      {palette.map((colour) => (
        <li key={colour.hex + colour.name} className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="h-8 w-8 rounded-full border border-[oklch(0.80_0.14_85_/_0.4)]"
            style={{ backgroundColor: colour.hex }}
          />
          <span className="text-sm text-[color:var(--muted-foreground)]">{colour.name}</span>
        </li>
      ))}
    </ul>
  );
}
