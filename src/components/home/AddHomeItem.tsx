import { useState } from "react";
import { Plus } from "lucide-react";

/** One field, one tap. Everything else lives behind the item's own details. */
export function AddHomeItem({
  onAdd,
  placeholder = "Add to this area…",
}: {
  onAdd: (name: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  return (
    <form
      className="mt-2 flex gap-2"
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
        placeholder={placeholder}
        aria-label={placeholder}
        className="input-food"
      />
      <button
        type="submit"
        aria-label="Add to this area"
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl border border-[color:var(--gold)]/40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
}
