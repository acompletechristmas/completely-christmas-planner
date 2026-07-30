export function BudgetSummary({
  budget,
  spent,
  count,
}: {
  budget: number | null;
  spent: number;
  count: number;
}) {
  const remaining = budget == null ? null : budget - spent;
  const pct = budget && budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Budget" value={budget == null ? "Not set" : `£${budget.toFixed(2)}`} />
        <Stat label="Spent" value={`£${spent.toFixed(2)}`} />
        <Stat
          label="Remaining"
          value={remaining == null ? "—" : `£${remaining.toFixed(2)}`}
          tone={remaining != null && remaining < 0 ? "over" : "normal"}
        />
      </div>
      {budget != null && budget > 0 ? (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[oklch(0.26_0.04_245_/_0.8)]">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-gold)" }} />
        </div>
      ) : null}
      <p className="mt-3 text-xs text-muted-foreground">
        {count} present{count === 1 ? "" : "s"} counted this year.
      </p>
    </div>
  );
}

function Stat({ label, value, tone = "normal" }: { label: string; value: string; tone?: "normal" | "over" }) {
  return (
    <div className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.6)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <p
        className={
          "mt-1 font-display text-2xl " +
          (tone === "over" ? "text-[color:var(--ember)]" : "gold-text")
        }
      >
        {value}
      </p>
    </div>
  );
}
