export function ProfileField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-transparent bg-[oklch(0.26_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[color:var(--gold)]"
      />
    </label>
  );
}

export function ProfileArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1 w-full resize-none rounded-lg border border-transparent bg-[oklch(0.26_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[color:var(--gold)]"
      />
    </label>
  );
}
