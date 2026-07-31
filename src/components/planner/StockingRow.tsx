import type { Gift } from "@/hooks/use-person-gifts";

export function StockingRow({
  gift,
  onChange,
  onRemove,
}: {
  gift: Gift;
  onChange: <K extends keyof Gift>(field: K, value: Gift[K]) => void;
  onRemove: () => void;
}) {
  return (
    <li className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.6)] p-4">
      <div className="grid gap-3 sm:grid-cols-[2fr_auto_auto_auto_auto] sm:items-center">
        <input
          value={gift.item}
          onChange={(e) => onChange("item", e.target.value)}
          placeholder="What is it?"
          className="min-h-11 w-full rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
        />
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">£</span>
          <input
            type="number"
            inputMode="decimal"
            value={gift.price == null ? "" : String(gift.price)}
            onChange={(e) => onChange("price", e.target.value === "" ? null : (Number(e.target.value) as never))}
            placeholder="0.00"
            className="min-h-11 w-24 rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
          />
        </div>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={gift.ordered}
            onChange={(e) => onChange("ordered", e.target.checked)}
          />
          Purchased
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={gift.wrapped}
            onChange={(e) => onChange("wrapped", e.target.checked)}
          />
          Wrapped
        </label>
        <button
          onClick={onRemove}
          className="min-h-11 justify-self-end text-xs text-muted-foreground hover:text-[color:var(--ember)]"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
