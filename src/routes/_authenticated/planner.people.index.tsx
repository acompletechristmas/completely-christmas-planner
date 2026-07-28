import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePeople } from "@/hooks/use-people";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { Plus, Users, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/people/")({
  component: PeopleIndex,
});

interface GiftRow extends BaseRow {
  person_id: string | null;
  item: string;
  price: number | null;
  is_chosen: boolean;
  is_idea: boolean;
  ordered: boolean;
  wrapped: boolean;
  sent: boolean;
  given: boolean;
  year: number;
}

const CURRENT_YEAR = new Date().getFullYear();
const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

function PeopleIndex() {
  const { user } = useAuth();
  const { people, loading, addPerson } = usePeople(user?.id);
  const { rows: gifts } = usePlannerList<GiftRow>("gifts", user?.id);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [adding, setAdding] = useState(false);

  const giftsByPerson = useMemo(() => {
    const map = new Map<string, GiftRow[]>();
    for (const g of gifts) {
      if (!g.person_id) continue;
      if ((g.item ?? "").trim().length === 0) continue;
      if (g.year !== CURRENT_YEAR) continue;
      const arr = map.get(g.person_id) ?? [];
      arr.push(g);
      map.set(g.person_id, arr);
    }
    return map;
  }, [gifts]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const created = await addPerson(name.trim(), relationship.trim() || undefined);
    setAdding(false);
    if (created) {
      setName("");
      setRelationship("");
    }
  }

  return (
    <div className="rise-in space-y-8">
      <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.6)] p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-gold)" }}>
            <Users className="h-5 w-5 text-[color:var(--primary-foreground)]" />
          </span>
          <div>
            <h2 className="font-display text-2xl">The people you love</h2>
            <p className="text-sm text-muted-foreground">Build a Christmas history for each of them, year after year.</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (e.g. Oliver)"
            className="flex-1 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] px-4 py-2.5 text-sm outline-none focus:border-[color:var(--gold)]"
          />
          <input
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="Relationship (Son, Mum…)"
            className="flex-1 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] px-4 py-2.5 text-sm outline-none focus:border-[color:var(--gold)]"
          />
          <button
            type="submit"
            disabled={adding || !name.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110 disabled:opacity-50"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : people.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.4)] p-10 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
          <h3 className="mt-3 font-display text-2xl">No one on your list yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Add the people you buy for. Each gets a profile and a Christmas Memories timeline that grows every year.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <SummaryPersonCard
              key={p.id}
              id={p.id}
              name={p.name || "Unnamed"}
              relationship={p.relationship}
              budget={p.gift_budget != null ? Number(p.gift_budget) : null}
              gifts={giftsByPerson.get(p.id) ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryPersonCard({
  id,
  name,
  relationship,
  budget,
  gifts,
}: {
  id: string;
  name: string;
  relationship: string | null;
  budget: number | null;
  gifts: GiftRow[];
}) {
  const presents = gifts.filter((g) => g.is_chosen);
  const boughtCount = presents.filter((g) => g.ordered).length;
  const wrappedCount = presents.filter((g) => g.wrapped).length;
  const sentOrGivenCount = presents.filter((g) => g.sent || g.given).length;
  const planned = presents.reduce((s, g) => s + (Number(g.price) || 0), 0);
  const spent = presents.filter((g) => g.ordered).reduce((s, g) => s + (Number(g.price) || 0), 0);

  const hasPresents = presents.length > 0;
  const allBought = hasPresents && boughtCount === presents.length;
  const allWrapped = allBought && wrappedCount === presents.length;
  const allCompleted = allWrapped && sentOrGivenCount === presents.length;

  const stage: 1 | 2 | 3 | 4 = allCompleted ? 4 : allWrapped ? 3 : allBought ? 2 : 1;
  const isGold = stage >= 2;

  const budgetPct = budget && budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const budgetTone =
    budget == null ? "neutral" : spent > budget ? "over" : spent === budget && spent > 0 ? "exact" : "under";
  const barColor =
    budgetTone === "over"
      ? "oklch(0.55 0.19 25)"
      : budgetTone === "exact"
        ? "oklch(0.72 0.14 82)"
        : "oklch(0.58 0.13 155)";

  const cardBg = isGold
    ? "linear-gradient(160deg, oklch(0.94 0.07 88) 0%, oklch(0.88 0.10 82) 55%, oklch(0.84 0.11 78) 100%)"
    : "oklch(0.985 0.006 85)";
  const borderCol = isGold ? "oklch(0.65 0.14 75 / 0.85)" : "oklch(0.78 0.10 82 / 0.55)";
  const textInk = "oklch(0.22 0.04 260)";
  const textMuted = "oklch(0.42 0.03 260)";

  return (
    <article
      className={
        "group relative overflow-hidden rounded-[26px] border shadow-[0_20px_50px_-24px_oklch(0_0_0_/_0.75)] transition-all duration-500 " +
        (isGold ? "sparkle-once" : "")
      }
      style={{ background: cardBg, borderColor: borderCol, color: textInk }}
    >
      {isGold && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 22%, oklch(1 0 0 / 0.9) 0 1.2px, transparent 1.6px), radial-gradient(circle at 78% 18%, oklch(1 0 0 / 0.7) 0 1px, transparent 1.4px), radial-gradient(circle at 40% 78%, oklch(1 0 0 / 0.7) 0 1px, transparent 1.4px), radial-gradient(circle at 88% 68%, oklch(1 0 0 / 0.8) 0 1.4px, transparent 1.8px)",
            backgroundSize: "180px 180px",
          }}
        />
      )}

      {stage >= 3 && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-14 top-6 z-[1] w-56 rotate-45 select-none text-center"
        >
          <span
            className="block py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[oklch(0.98_0.02_60)] shadow-[0_6px_14px_-6px_oklch(0.25_0.15_25_/_0.7)]"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.52 0.20 22) 0%, oklch(0.42 0.22 22) 50%, oklch(0.36 0.20 22) 100%)",
              borderTop: "1px solid oklch(0.82 0.14 82 / 0.9)",
              borderBottom: "1px solid oklch(0.72 0.14 82 / 0.9)",
            }}
          >
            Ready for Christmas
          </span>
        </span>
      )}

      {stage >= 4 && (
        <span
          aria-hidden
          className="absolute right-4 top-16 z-[2] grid h-14 w-14 place-items-center rounded-full text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-[oklch(0.98_0.03_60)] shadow-[0_6px_14px_-4px_oklch(0.25_0.15_25_/_0.6),inset_0_2px_3px_oklch(1_0_0_/_0.3),inset_0_-3px_5px_oklch(0.2_0.12_25_/_0.5)]"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, oklch(0.58 0.22 22) 0%, oklch(0.38 0.22 22) 60%, oklch(0.28 0.18 22) 100%)",
            border: "2px solid oklch(0.78 0.14 82)",
          }}
        >
          <span className="px-1 text-center">
            Christmas
            <br />
            Complete ❤
          </span>
        </span>
      )}

      <div className="relative z-[1] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-semibold"
            style={{
              background: isGold ? "oklch(1 0 0 / 0.55)" : "oklch(0.96 0.02 85)",
              color: "oklch(0.30 0.06 60)",
              border: "1px solid oklch(0.72 0.12 82 / 0.5)",
            }}
          >
            {name?.[0]?.toUpperCase() || "?"}
          </span>
          <div className="min-w-0 flex-1">
            <h3
              className="truncate font-display text-[24px] font-semibold leading-tight tracking-tight"
              style={{ color: textInk }}
            >
              {name}
            </h3>
            <p className="mt-0.5 text-[12px] font-medium" style={{ color: textMuted }}>
              {relationship || "Christmas list"}
              {allCompleted && (
                <span className="ml-1.5 italic" style={{ color: "oklch(0.42 0.20 22)" }}>
                  · All done!
                </span>
              )}
              {!allCompleted && allBought && (
                <span className="ml-1.5 font-semibold" style={{ color: "oklch(0.42 0.14 65)" }}>
                  · {allWrapped ? "Wrapped & ready" : "All presents bought"}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Budget bar */}
        <div className="mt-5">
          <div
            className="flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: textMuted }}
          >
            <span>Budget</span>
            <span style={{ color: textInk }}>
              {budget != null ? (
                <>
                  <span className="font-display text-[15px] tracking-normal normal-case">{gbp(spent)}</span>
                  <span className="mx-1 opacity-60">of</span>
                  <span className="font-display text-[15px] tracking-normal normal-case">{gbp(budget)}</span>
                </>
              ) : (
                <span className="font-display text-[15px] tracking-normal normal-case">{gbp(spent)} spent</span>
              )}
            </span>
          </div>
          <div
            className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "oklch(0.90 0.02 85 / 0.85)" }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{ width: `${budget != null ? budgetPct : 0}%`, background: barColor }}
            />
          </div>
          {planned > 0 && (
            <p className="mt-1 text-[11px]" style={{ color: textMuted }}>
              Planned {gbp(planned)}
            </p>
          )}
        </div>

        {/* Progress icons */}
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <Pip icon="🎁" value={presents.length} label="Presents" muted={textMuted} ink={textInk} />
          <Pip icon="✓" value={boughtCount} label="Bought" done={allBought} muted={textMuted} ink={textInk} accent="oklch(0.48 0.14 155)" />
          <Pip icon="🎀" value={wrappedCount} label="Wrapped" done={allWrapped} muted={textMuted} ink={textInk} accent="oklch(0.50 0.20 22)" />
          <Pip icon="❤" value={sentOrGivenCount} label="Sent/Given" done={allCompleted} muted={textMuted} ink={textInk} accent="oklch(0.45 0.22 22)" />
        </div>

        {/* Quick scan line */}
        <p className="mt-3 text-[12px]" style={{ color: textMuted }}>
          {presents.length} {presents.length === 1 ? "present" : "presents"} · {boughtCount} bought · {wrappedCount} wrapped · {sentOrGivenCount} sent/given
        </p>

        <Link
          to="/planner/people/$personId"
          params={{ personId: id }}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] transition hover:shadow-[0_8px_20px_-10px_oklch(0.55_0.14_75_/_0.6)]"
          style={{
            borderColor: "oklch(0.55 0.14 75 / 0.85)",
            color: "oklch(0.35 0.10 60)",
            background: isGold ? "oklch(1 0 0 / 0.35)" : "transparent",
          }}
        >
          View gifts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function Pip({
  icon,
  value,
  label,
  done,
  muted,
  ink,
  accent,
}: {
  icon: string;
  value: number;
  label: string;
  done?: boolean;
  muted: string;
  ink: string;
  accent?: string;
}) {
  const color = done && accent ? accent : ink;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg leading-none" style={{ color }} aria-hidden>
        {icon}
      </span>
      <span className="font-display text-[15px] font-semibold" style={{ color }}>
        {value}
      </span>
      <span className="text-[9px] font-medium uppercase tracking-[0.12em]" style={{ color: muted }}>
        {label}
      </span>
    </div>
  );
}
