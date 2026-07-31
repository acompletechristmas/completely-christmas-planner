import type { Gift } from "@/hooks/use-person-gifts";

export function CardRow({
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
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={gift.recipient}
          onChange={(e) => onChange("recipient", e.target.value)}
          placeholder="Who is the card for?"
          className="min-h-11 w-full rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
        />
        <textarea
          value={gift.notes ?? ""}
          onChange={(e) => onChange("notes", e.target.value || null)}
          placeholder="Address (optional)"
          rows={2}
          className="w-full resize-y rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={gift.sent} onChange={(e) => onChange("sent", e.target.checked)} />
          Sent
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={gift.delivered} onChange={(e) => onChange("delivered", e.target.checked)} />
          Received
        </label>
        <button
          onClick={onRemove}
          className="ml-auto min-h-11 text-xs text-muted-foreground hover:text-[color:var(--ember)]"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
