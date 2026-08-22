import { useState } from "react";
import { Plus } from "lucide-react";

export function AddArea({ onAdd }: { onAdd: (name: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onAdd(value);
        setValue("");
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add an area (e.g. Conservatory)"
        aria-label="New area name"
        className="input-food"
      />
      <button
        type="submit"
        aria-label="Add area"
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl border border-[color:var(--gold)]/40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
}
