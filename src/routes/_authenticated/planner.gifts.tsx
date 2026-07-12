import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { usePeople } from "@/hooks/use-people";
import { Plus, Trash2, ExternalLink, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/gifts")({
  component: GiftsPage,
});

type GiftStatus = "idea" | "bought" | "wrapped" | "given";
interface GiftRow extends BaseRow {
  recipient: string;
  item: string;
  url: string | null;
  price: number | null;
  status: GiftStatus;
  notes: string | null;
  person_id: string | null;
  year: number;
}

const statuses: { value: GiftStatus; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "bought", label: "Bought" },
  { value: "wrapped", label: "Wrapped" },
  { value: "given", label: "Given" },
];

function GiftsPage() {
  const { user } = useAuth();
  const { rows, loading, addRow, removeRow, updateField, saving } = usePlannerList<GiftRow>("gifts", user?.id);

  const total = rows.reduce((s, r) => s + (Number(r.price) || 0), 0);
  const spent = rows
    .filter((r) => r.status !== "idea")
    .reduce((s, r) => s + (Number(r.price) || 0), 0);

  return (
    <div className="rise-in space-y-6">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Gifts" value={String(rows.length)} />
        <Stat label="Bought" value={String(rows.filter((r) => r.status !== "idea").length)} />
        <Stat label="Planned" value={`£${total.toFixed(2)}`} />
        <Stat label="Spent" value={`£${spent.toFixed(2)}`} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => addRow({ recipient: "", item: "", status: "idea" } as Partial<GiftRow>)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Plus className="h-4 w-4" />
          Add gift
        </button>
        <span className="text-xs text-muted-foreground">
          {saving ? "Saving…" : "All changes saved"}
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading your gifts…</p>
      ) : rows.length === 0 ? (
        <EmptyState onAdd={() => addRow({ recipient: "", item: "", status: "idea" } as Partial<GiftRow>)} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.6)]">
          <div className="hidden grid-cols-[1.2fr_1.6fr_0.9fr_1fr_2fr_auto] gap-3 border-b border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.13_0.03_245_/_0.6)] px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground md:grid">
            <span>Recipient</span>
            <span>Gift</span>
            <span>Price</span>
            <span>Status</span>
            <span>Notes / link</span>
            <span />
          </div>
          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                className="grid grid-cols-1 gap-3 border-b border-[oklch(0.80_0.14_85_/_0.1)] px-4 py-3 last:border-b-0 md:grid-cols-[1.2fr_1.6fr_0.9fr_1fr_2fr_auto] md:items-center"
              >
                <FieldInput
                  value={row.recipient}
                  placeholder="Who is it for?"
                  onChange={(v) => updateField(row.id, "recipient", v)}
                />
                <FieldInput
                  value={row.item}
                  placeholder="What are you giving?"
                  onChange={(v) => updateField(row.id, "item", v)}
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">£</span>
                  <FieldInput
                    type="number"
                    value={row.price == null ? "" : String(row.price)}
                    placeholder="0.00"
                    onChange={(v) => updateField(row.id, "price", v === "" ? null : Number(v))}
                  />
                </div>
                <select
                  value={row.status}
                  onChange={(e) => updateField(row.id, "status", e.target.value as GiftStatus)}
                  className="rounded-lg border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.8)] px-3 py-2 text-sm text-foreground outline-none focus:border-[oklch(0.80_0.14_85_/_0.6)]"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <FieldInput
                    value={row.notes ?? ""}
                    placeholder="Notes or paste a link"
                    onChange={(v) => {
                      updateField(row.id, "notes", v);
                      if (v.startsWith("http")) updateField(row.id, "url", v);
                    }}
                  />
                  {row.url ? (
                    <a href={row.url} target="_blank" rel="noreferrer" className="text-[color:var(--gold)] hover:text-[color:var(--gold-soft)]">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
                <button
                  onClick={() => removeRow(row.id)}
                  className="justify-self-end text-muted-foreground transition hover:text-[color:var(--ember)]"
                  aria-label="Remove gift"
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
    <div className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.6)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl gold-text">{value}</p>
    </div>
  );
}

function FieldInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-transparent bg-[oklch(0.26_0.04_245_/_0.5)] px-3 py-2 text-sm text-foreground outline-none transition hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[oklch(0.80_0.14_85_/_0.6)] focus:bg-[oklch(0.26_0.04_245_/_0.9)]"
    />
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.4)] p-10 text-center">
      <Sparkles className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
      <h3 className="mt-3 font-display text-2xl">Your gift list is empty</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Add the first person you're buying for. You can leave the gift blank and come back with ideas later — everything saves as you type.
      </p>
      <button
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)]"
        style={{ background: "var(--gradient-gold)" }}
      >
        <Plus className="h-4 w-4" /> Add your first gift
      </button>
    </div>
  );
}
