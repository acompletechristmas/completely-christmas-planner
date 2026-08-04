import { Trash2 } from "lucide-react";
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
    <li className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[color:var(--surface-card)] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={gift.recipient}
          onChange={(e) => onChange("recipient", e.target.value)}
          placeholder="Who is the card for?"
          className="min-h-11 w-full min-w-0 rounded-lg border border-transparent bg-[color:var(--surface-card)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[color:var(--gold)]"
        />
        <textarea
          value={gift.notes ?? ""}
          onChange={(e) => onChange("notes", e.target.value || null)}
          placeholder="Address (optional)"
          rows={2}
          className="w-full min-w-0 resize-y rounded-lg border border-transparent bg-[color:var(--surface-card)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[color:var(--gold)]"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={gift.sent}
            onChange={(e) => onChange("sent", e.target.checked)}
            className="h-4 w-4 shrink-0 accent-[color:var(--gold)]"
          />
          Sent
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={gift.delivered}
            onChange={(e) => onChange("delivered", e.target.checked)}
            className="h-4 w-4 shrink-0 accent-[color:var(--gold)]"
          />
          Received
        </label>
        <button
          onClick={onRemove}
          className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:text-[color:var(--ember)]"
          aria-label="Delete card"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
