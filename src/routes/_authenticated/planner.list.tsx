import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { usePeople } from "@/hooks/use-people";
import {
  ArrowLeft,
  Check,
  Gift as GiftIcon,
  Search,
  Sparkles,
  Trash2,
  Package,
  Ribbon,
  Lightbulb,
  PartyPopper,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/list")({
  component: FullGiftListPage,
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

const CURRENT_YEAR = new Date().getFullYear();

type Filter = "all" | "idea" | "bought" | "wrapped" | "given";

const FILTERS: { key: Filter; label: string; emoji: string }[] = [
  { key: "all", label: "Everything", emoji: "🎄" },
  { key: "idea", label: "Ideas", emoji: "💭" },
  { key: "bought", label: "Bought", emoji: "🛍" },
  { key: "wrapped", label: "Wrapped", emoji: "🎀" },
  { key: "given", label: "Given", emoji: "✨" },
];

const NEXT_STATUS: Record<GiftStatus, GiftStatus> = {
  idea: "bought",
  bought: "wrapped",
  wrapped: "given",
  given: "idea",
};

function FullGiftListPage() {
  const { user } = useAuth();
  const { people } = usePeople(user?.id);
  const { rows: gifts, loading, updateField, removeRow, saving } = usePlannerList<GiftRow>("gifts", user?.id);

  const [filter, setFilter] = useState<Filter>("all");
  const [personFilter, setPersonFilter] = useState<string>("all");
  const [q, setQ] = useState("");

  const thisYear = useMemo(() => gifts.filter((g) => g.year === CURRENT_YEAR), [gifts]);

  const counts = useMemo(() => {
    const c = { all: thisYear.length, idea: 0, bought: 0, wrapped: 0, given: 0 } as Record<Filter, number>;
    for (const g of thisYear) c[g.status]++;
    return c;
  }, [thisYear]);

  const boughtOrBetter = counts.bought + counts.wrapped + counts.given;
  const wrappedOrGiven = counts.wrapped + counts.given;
  const totalSpent = thisYear
    .filter((g) => g.status !== "idea")
    .reduce((s, g) => s + (Number(g.price) || 0), 0);
  const pct = thisYear.length ? Math.round((boughtOrBetter / thisYear.length) * 100) : 0;

  const personMap = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    return thisYear
      .filter((g) => (filter === "all" ? true : g.status === filter))
      .filter((g) => (personFilter === "all" ? true : g.person_id === personFilter))
      .filter((g) => {
        if (!query) return true;
        const person = g.person_id ? personMap.get(g.person_id)?.name ?? "" : g.recipient ?? "";
        return `${g.item ?? ""} ${person}`.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        // group by person for readability
        const na = a.person_id ? personMap.get(a.person_id)?.name ?? a.recipient ?? "" : a.recipient ?? "";
        const nb = b.person_id ? personMap.get(b.person_id)?.name ?? b.recipient ?? "" : b.recipient ?? "";
        return na.localeCompare(nb) || a.created_at.localeCompare(b.created_at);
      });
  }, [thisYear, filter, personFilter, q, personMap]);

  return (
    <div className="rise-in space-y-6">
      {/* Back */}
      <Link
        to="/planner"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to my Christmas
      </Link>

      {/* Header */}
      <header className="rounded-3xl border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">🎁 The whole gift list</p>
            <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
              <span className="gold-text">{boughtOrBetter}</span> of {thisYear.length} pressies sorted
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {wrappedOrGiven} wrapped · £{totalSpent.toFixed(0)} spent · {counts.idea} ideas floating about
            </p>
          </div>
          <span className="self-center text-[11px] text-muted-foreground">
            {saving ? "Saving…" : "All saved ✨"}
          </span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[oklch(0.13_0.03_245_/_0.6)]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: "var(--gradient-gold)" }}
          />
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition " +
                (active
                  ? "border-[color:var(--gold)] bg-[oklch(0.80_0.14_85_/_0.15)] text-[color:var(--gold-soft)]"
                  : "border-[oklch(0.80_0.14_85_/_0.25)] text-muted-foreground hover:border-[oklch(0.80_0.14_85_/_0.5)] hover:text-foreground")
              }
            >
              <span>{f.emoji}</span>
              {f.label}
              <span className={"rounded-full px-1.5 py-0.5 text-[10px] " + (active ? "bg-[oklch(0.13_0.03_245_/_0.6)]" : "bg-[oklch(0.13_0.03_245_/_0.5)]")}>
                {counts[f.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Person filter + search */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.6)] px-3.5 py-1.5 text-xs">
          <span className="text-muted-foreground">For:</span>
          <select
            value={personFilter}
            onChange={(e) => setPersonFilter(e.target.value)}
            className="bg-transparent text-xs outline-none"
          >
            <option value="all">Anyone</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.6)] px-3.5 py-1.5 text-xs sm:max-w-xs">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a name or a pressie…"
            className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading your list…</p>
      ) : thisYear.length === 0 ? (
        <EmptyState />
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.25)] p-8 text-center text-sm text-muted-foreground">
          Nothing matches those filters — try a different one? 🎄
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((g) => {
            const person = g.person_id ? personMap.get(g.person_id) : null;
            const name = person?.name ?? g.recipient ?? "Someone lovely";
            return (
              <li
                key={g.id}
                className="group flex items-center gap-3 rounded-2xl border border-[oklch(0.80_0.14_85_/_0.18)] bg-[oklch(0.26_0.04_245_/_0.65)] p-3 transition hover:border-[oklch(0.80_0.14_85_/_0.4)]"
              >
                {/* Status ring */}
                <button
                  onClick={() => updateField(g.id, "status", NEXT_STATUS[g.status])}
                  title={`Mark as ${NEXT_STATUS[g.status]}`}
                  className={
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition " +
                    statusRingClass(g.status)
                  }
                >
                  <StatusIcon status={g.status} />
                </button>

                {/* Body */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-display text-base">{g.item || "(untitled)"}</p>
                    {g.price != null && (
                      <p className="shrink-0 text-xs text-muted-foreground">£{Number(g.price).toFixed(0)}</p>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">
                    for{" "}
                    {person ? (
                      <Link
                        to="/planner/people/$personId"
                        params={{ personId: person.id }}
                        className="text-[color:var(--gold-soft)] hover:underline"
                      >
                        {name}
                      </Link>
                    ) : (
                      <span>{name}</span>
                    )}{" "}
                    · <span className={statusTextClass(g.status)}>{statusLabel(g.status)}</span>
                  </p>
                </div>

                {/* Quick status pill */}
                <select
                  value={g.status}
                  onChange={(e) => updateField(g.id, "status", e.target.value as GiftStatus)}
                  className="rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] px-2 py-1 text-[11px] outline-none"
                >
                  <option value="idea">Idea</option>
                  <option value="bought">Bought</option>
                  <option value="wrapped">Wrapped</option>
                  <option value="given">Given</option>
                </select>

                <button
                  onClick={() => removeRow(g.id)}
                  className="text-muted-foreground opacity-0 transition hover:text-[color:var(--cranberry)] group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer nudge */}
      {thisYear.length > 0 && (
        <div className="rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.25)] p-4 text-center text-xs text-muted-foreground">
          Want to add more? Head over to{" "}
          <Link to="/planner/gifts" className="text-[color:var(--gold-soft)] hover:underline">
            per-person view
          </Link>{" "}
          to jot ideas or ask Santa's helper ✨
        </div>
      )}
    </div>
  );
}

function statusRingClass(s: GiftStatus): string {
  switch (s) {
    case "idea":
      return "border-[oklch(0.80_0.14_85_/_0.3)] text-[color:var(--gold-soft)] hover:border-[oklch(0.80_0.14_85_/_0.6)]";
    case "bought":
      return "border-[color:var(--cranberry)] bg-[oklch(0.55_0.18_20_/_0.15)] text-[color:var(--cranberry)]";
    case "wrapped":
      return "border-[color:var(--pine)] bg-[oklch(0.55_0.14_150_/_0.15)] text-[color:var(--pine)]";
    case "given":
      return "border-[color:var(--gold)] bg-[oklch(0.80_0.14_85_/_0.2)] text-[color:var(--gold)]";
  }
}

function statusTextClass(s: GiftStatus): string {
  switch (s) {
    case "idea":
      return "text-[color:var(--gold-soft)]";
    case "bought":
      return "text-[color:var(--cranberry)]";
    case "wrapped":
      return "text-[color:var(--pine)]";
    case "given":
      return "text-[color:var(--gold)]";
  }
}

function statusLabel(s: GiftStatus): string {
  return s === "idea" ? "just an idea" : s === "bought" ? "bought" : s === "wrapped" ? "wrapped & ready" : "given ✨";
}

function StatusIcon({ status }: { status: GiftStatus }) {
  if (status === "idea") return <Lightbulb className="h-4 w-4" />;
  if (status === "bought") return <Package className="h-4 w-4" />;
  if (status === "wrapped") return <Ribbon className="h-4 w-4" />;
  return <PartyPopper className="h-4 w-4" />;
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.4)] p-10 text-center">
      <Sparkles className="mx-auto h-8 w-8 text-[color:var(--gold)]" />
      <h3 className="mt-4 font-display text-2xl">Your list is a blank canvas</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Pop some ideas in from the per-person view and they'll all show up here — tick them off as you go.
      </p>
      <Link
        to="/planner/gifts"
        className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
        style={{ background: "var(--gradient-gold)" }}
      >
        <GiftIcon className="h-4 w-4" /> Start adding ideas
      </Link>
    </div>
  );
}

// silence unused import warning for Check if tree-shaken
void Check;
