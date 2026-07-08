import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { Plus, Trash2, ListChecks } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/todos")({
  component: TodosPage,
});

interface TodoRow extends BaseRow {
  title: string;
  done: boolean;
  due_date: string | null;
  category: string;
}

function TodosPage() {
  const { user } = useAuth();
  const { rows, loading, addRow, removeRow, updateField, saving } = usePlannerList<TodoRow>("todos", user?.id);
  const done = rows.filter((r) => r.done).length;

  return (
    <div className="rise-in space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Tasks" value={String(rows.length)} />
        <Stat label="Done" value={String(done)} />
        <Stat label="To do" value={String(rows.length - done)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => addRow({ title: "" } as Partial<TodoRow>)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Plus className="h-4 w-4" /> Add task
        </button>
        <span className="text-xs text-muted-foreground">{saving ? "Saving…" : "All changes saved"}</span>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] p-10 text-center">
          <ListChecks className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
          <p className="mt-3 text-sm text-muted-foreground">
            Add your first task — try "Order the turkey" or "Book supermarket delivery".
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center gap-3 rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.18_0.025_25_/_0.6)] px-4 py-3 transition hover:border-[oklch(0.80_0.14_85_/_0.35)]"
            >
              <input
                type="checkbox"
                checked={row.done}
                onChange={(e) => updateField(row.id, "done", e.target.checked)}
                className="h-4 w-4 shrink-0 accent-[color:var(--gold)]"
              />
              <input
                value={row.title}
                onChange={(e) => updateField(row.id, "title", e.target.value)}
                placeholder="What needs doing?"
                className={
                  "min-w-0 flex-1 border-none bg-transparent text-sm outline-none " +
                  (row.done ? "text-muted-foreground line-through" : "text-foreground")
                }
              />
              <input
                type="date"
                value={row.due_date ?? ""}
                onChange={(e) => updateField(row.id, "due_date", e.target.value || null)}
                className="shrink-0 rounded-lg border border-transparent bg-[oklch(0.18_0.025_25_/_0.5)] px-2 py-1 text-xs text-muted-foreground outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[oklch(0.80_0.14_85_/_0.6)]"
              />
              <button
                onClick={() => removeRow(row.id)}
                className="shrink-0 text-muted-foreground transition hover:text-[color:var(--ember)]"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
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
