import { Gift as GiftIcon, Trash2 } from "lucide-react";
import type { Gift } from "@/hooks/use-person-gifts";

export function IdeaRow({
  gift,
  onChange,
  onConvert,
  onRemove,
}: {
  gift: Gift;
  onChange: <K extends keyof Gift>(field: K, value: Gift[K]) => void;
  onConvert: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.6)] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-center">
        <input
          value={gift.item}
          onChange={(e) => onChange("item", e.target.value)}
          placeholder="An idea…"
          className="min-h-11 truncate rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
        />
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">£</span>
          <input
            type="number"
            value={gift.price == null ? "" : String(gift.price)}
            onChange={(e) => onChange("price", e.target.value === "" ? null : (Number(e.target.value) as never))}
            placeholder="0.00"
            className="min-h-11 w-full rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-self-end">
          <button
            onClick={onConvert}
            disabled={!gift.item.trim()}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)] disabled:opacity-40"
          >
            <GiftIcon className="h-3.5 w-3.5" /> Make it a present
          </button>
          <button
            onClick={onRemove}
            className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-[color:var(--ember)]"
            aria-label="Remove idea"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
