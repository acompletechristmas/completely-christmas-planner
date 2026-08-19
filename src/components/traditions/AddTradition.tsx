import { useState } from "react";
import { Plus } from "lucide-react";

/** One field, one button. Everything else is progressive disclosure on the row. */
export function AddTradition({ onAdd }: { onAdd: (name: string) => void | Promise<unknown> }) {
  const [name, setName] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) return;
    setName("");
    await onAdd(value);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Christmas Eve takeaway…"
        aria-label="Tradition name"
        className="min-h-[48px] w-full min-w-0 flex-1 rounded-xl border border-[color:var(--gold)]/30 bg-[color:var(--surface-card)] px-4 text-[15px] outline-none focus:border-[color:var(--gold)]"
      />
      <button type="submit" className="btn-planner justify-center sm:w-auto sm:px-6">
        <Plus className="h-4 w-4" />
        Add a tradition
      </button>
    </form>
  );
}
