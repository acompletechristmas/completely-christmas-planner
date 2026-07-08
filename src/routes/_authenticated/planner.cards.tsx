import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { Plus, Trash2, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/cards")({
  component: CardsPage,
});

interface CardRow extends BaseRow {
  recipient: string;
  address: string | null;
  sent: boolean;
  received: boolean;
  notes: string | null;
}

function CardsPage() {
  const { user } = useAuth();
  const { rows, loading, addRow, removeRow, updateField, saving } = usePlannerList<CardRow>("cards", user?.id);

  const sent = rows.filter((r) => r.sent).length;

  return (
    <div className="rise-in space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="On your list" value={String(rows.length)} />
        <Stat label="Sent" value={String(sent)} />
        <Stat label="Received back" value={String(rows.filter((r) => r.received).length)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => addRow({ recipient: "" } as Partial<CardRow>)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Plus className="h-4 w-4" /> Add card
        </button>
        <span className="text-xs text-muted-foreground">{saving ? "Saving…" : "All changes saved"}</span>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] p-10 text-center">
          <Mail className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
          <p className="mt-3 text-sm text-muted-foreground">Add your first card recipient.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.14_0.02_25_/_0.6)]">
          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                className="grid grid-cols-1 gap-3 border-b border-[oklch(0.80_0.14_85_/_0.1)] px-4 py-3 last:border-b-0 md:grid-cols-[1fr_1.4fr_auto_auto_auto] md:items-center"
              >
                <input
                  value={row.recipient}
                  onChange={(e) => updateField(row.id, "recipient", e.target.value)}
                  placeholder="Recipient"
                  className="rounded-lg border border-transparent bg-[oklch(0.18_0.025_25_/_0.5)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[oklch(0.80_0.14_85_/_0.6)]"
                />
                <input
                  value={row.address ?? ""}
                  onChange={(e) => updateField(row.id, "address", e.target.value)}
                  placeholder="Address (optional)"
                  className="rounded-lg border border-transparent bg-[oklch(0.18_0.025_25_/_0.5)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[oklch(0.80_0.14_85_/_0.6)]"
                />
                <Checkbox
                  label="Sent"
                  checked={row.sent}
                  onChange={(v) => updateField(row.id, "sent", v)}
                />
                <Checkbox
                  label="Received"
                  checked={row.received}
                  onChange={(v) => updateField(row.id, "received", v)}
                />
                <button
                  onClick={() => removeRow(row.id)}
                  className="justify-self-end text-muted-foreground transition hover:text-[color:var(--ember)]"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.18_0.025_25_/_0.6)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl gold-text">{value}</p>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[color:var(--gold)]"
      />
      <span className="text-muted-foreground">{label}</span>
    </label>
  );
}
