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
    <li className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[color:var(--surface-card)] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,2fr)_auto_auto] sm:items-center">
        <input
          value={gift.item}
          onChange={(e) => onChange("item", e.target.value)}
          placeholder="An idea…"
          className="min-h-11 w-full min-w-0 rounded-lg border border-transparent bg-[color:var(--surface-card)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[color:var(--gold)]"
        />
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">£</span>
          <input
            type="number"
            inputMode="decimal"
            value={gift.price == null ? "" : String(gift.price)}
            onChange={(e) => onChange("price", e.target.value === "" ? null : (Number(e.target.value) as never))}
            placeholder="0.00"
            className="min-h-11 w-full min-w-0 rounded-lg border border-transparent bg-[color:var(--surface-card)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[color:var(--gold)] sm:w-28"
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
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:text-[color:var(--ember)]"
            aria-label="Remove idea"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
