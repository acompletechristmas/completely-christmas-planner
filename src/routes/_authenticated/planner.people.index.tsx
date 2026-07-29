import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePeople } from "@/hooks/use-people";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import {
  Plus,
  Gift,
  ShoppingBag,
  Send,
  Sparkles,
  Calendar,
  UserPlus,
  ChevronRight,
  Users,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/people/")({
  head: () => ({
    meta: [
      { title: "People & Presents — A Complete Christmas" },
      {
        name: "description",
        content: "Your luxury People & Presents board with budgets, progress, ribbons and Christmas completion states.",
      },
      { property: "og:title", content: "People & Presents — A Complete Christmas" },
      {
        property: "og:description",
        content: "Your luxury People & Presents board with budgets, progress, ribbons and Christmas completion states.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
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

type FilterKey = "all" | "to-buy" | "to-wrap" | "to-send" | "all-done";

interface PersonStats {
  added: number;
  bought: number;
  wrapped: number;
  sentGiven: number;
  spent: number;
  status: "not-started" | "to-buy" | "to-wrap" | "to-send" | "all-done";
}

function computeStats(gifts: GiftRow[]): PersonStats {
  const presents = gifts.filter((g) => g.is_chosen);
  const added = presents.length;
  const bought = presents.filter((g) => g.ordered).length;
  const wrapped = presents.filter((g) => g.wrapped).length;
  const sentGiven = presents.filter((g) => g.sent || g.given).length;
  const spent = presents.filter((g) => g.ordered).reduce((s, g) => s + (Number(g.price) || 0), 0);

  let status: PersonStats["status"] = "not-started";
  if (added === 0) status = "to-buy";
  else if (sentGiven === added) status = "all-done";
  else if (bought < added) status = "to-buy";
  else if (wrapped < added) status = "to-wrap";
  else status = "to-send";

  return { added, bought, wrapped, sentGiven, spent, status };
}

function PeopleIndex() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { people, loading, addPerson } = usePeople(user?.id);
  const { rows: gifts } = usePlannerList<GiftRow>("gifts", user?.id);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [addOpen, setAddOpen] = useState(false);
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

  const withStats = useMemo(
    () =>
      people.map((p) => ({
        person: p,
        stats: computeStats(giftsByPerson.get(p.id) ?? []),
      })),
    [people, giftsByPerson],
  );

  const totals = useMemo(() => {
    let added = 0,
      bought = 0,
      wrapped = 0,
      sentGiven = 0,
      spent = 0,
      budget = 0;
    for (const { person, stats } of withStats) {
      added += stats.added;
      bought += stats.bought;
      wrapped += stats.wrapped;
      sentGiven += stats.sentGiven;
      spent += stats.spent;
      budget += Number(person.gift_budget) || 0;
    }
    const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);
    const complete = added > 0 ? Math.round(((bought + wrapped + sentGiven) / (added * 3)) * 100) : 0;
    return {
      added,
      bought,
      wrapped,
      sentGiven,
      spent,
      budget,
      pctAdded: added > 0 ? 100 : 0,
      pctBought: pct(bought, added),
      pctWrapped: pct(wrapped, added),
      pctSent: pct(sentGiven, added),
      pctSpent: budget > 0 ? Math.min(100, pct(spent, budget)) : 0,
      complete,
    };
  }, [withStats]);

  const counts = useMemo(() => {
    let toBuy = 0,
      toWrap = 0,
      toSend = 0,
      allDone = 0;
    for (const { stats } of withStats) {
      if (stats.status === "to-buy") toBuy++;
      else if (stats.status === "to-wrap") toWrap++;
      else if (stats.status === "to-send") toSend++;
      else if (stats.status === "all-done") allDone++;
    }
    return { all: withStats.length, toBuy, toWrap, toSend, allDone };
  }, [withStats]);

  const filtered = useMemo(() => {
    if (filter === "all") return withStats;
    const key = filter === "to-buy" ? "to-buy" : filter === "to-wrap" ? "to-wrap" : filter === "to-send" ? "to-send" : "all-done";
    return withStats.filter((w) => w.stats.status === key);
  }, [withStats, filter]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const created = await addPerson(name.trim(), relationship.trim() || undefined);
    setAdding(false);
    if (created) {
      setName("");
      setRelationship("");
      setAddOpen(false);
    }
  }

  return (
    <div className="rise-in space-y-6">
      {/* HEADER + ACTIONS */}
      <section
        className="rounded-3xl border p-5 sm:p-7"
        style={{
          background: "linear-gradient(160deg, oklch(0.22 0.05 250) 0%, oklch(0.18 0.05 250) 100%)",
          borderColor: "oklch(0.80 0.14 85 / 0.28)",
        }}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[color:var(--gold)]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold)]">
            People &amp; Presents
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">My People &amp; Presents</h1>
            <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              Everyone on your list — with every idea, present and price in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3">
            <ActionTile
              icon={<UserPlus className="h-5 w-5" />}
              label="Add person"
              primary
              onClick={() => setAddOpen(true)}
            />
            <ActionTile
              icon={<Gift className="h-5 w-5" />}
              label="Add present"
              onClick={() => navigate({ to: "/planner/gifts" })}
            />
            <ActionTile
              icon={<Sparkles className="h-5 w-5" />}
              label="Find gift ideas"
              onClick={() => navigate({ to: "/gift-finder" })}
            />
            <ActionTile
              icon={<Calendar className="h-5 w-5" />}
              label="Find an event"
              onClick={() => navigate({ to: "/planner/outings" })}
            />
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div
          className="mt-6 rounded-2xl border p-4 sm:p-5"
          style={{
            background: "oklch(0.16 0.04 250 / 0.85)",
            borderColor: "oklch(0.80 0.14 85 / 0.2)",
          }}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <SummaryStat icon={<Gift className="h-4 w-4" />} value={String(totals.added)} label="Presents Added" pct={totals.pctAdded} tone="gold" />
            <SummaryStat icon={<ShoppingBag className="h-4 w-4" />} value={String(totals.bought)} label="Bought" pct={totals.pctBought} tone="amber" />
            <SummaryStat icon={<BowIcon />} value={String(totals.wrapped)} label="Wrapped" pct={totals.pctWrapped} tone="rose" />
            <SummaryStat icon={<Send className="h-4 w-4" />} value={String(totals.sentGiven)} label="Sent / Given" pct={totals.pctSent} tone="sky" />
            <SummaryStat
              value={gbp(totals.spent)}
              label="Spent"
              pct={totals.pctSpent}
              tone="gold"
            />
            <div className="flex items-center justify-center">
              <CircularProgress value={totals.complete} />
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")} label="All people" count={counts.all} tone="gold" />
        <FilterPill active={filter === "to-buy"} onClick={() => setFilter("to-buy")} label="To buy" count={counts.toBuy} tone="red" />
        <FilterPill active={filter === "to-wrap"} onClick={() => setFilter("to-wrap")} label="To wrap" count={counts.toWrap} tone="orange" />
        <FilterPill active={filter === "to-send"} onClick={() => setFilter("to-send")} label="To send" count={counts.toSend} tone="blue" />
        <FilterPill active={filter === "all-done"} onClick={() => setFilter("all-done")} label="All done" count={counts.allDone} tone="green" />
      </div>

      {/* PERSON CARDS */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.4)] p-10 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
          <h3 className="mt-3 font-display text-2xl">
            {withStats.length === 0 ? "No one on your list yet" : "Nothing here"}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {withStats.length === 0
              ? "Add the people you buy for. Each gets a Christmas Memories timeline that grows every year."
              : "No people match this filter yet."}
          </p>
          {withStats.length === 0 && (
            <button
              onClick={() => setAddOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)]"
              style={{ background: "var(--gradient-gold)" }}
            >
              <Plus className="h-4 w-4" /> Add your first person
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ person, stats }) => (
            <PersonRow key={person.id} person={person} stats={stats} />
          ))}
        </div>
      )}

      {/* BOTTOM SUMMARY */}
      {withStats.length > 0 && (
        <div
          className="rounded-2xl border p-4 sm:p-5"
          style={{
            background: "oklch(0.16 0.04 250 / 0.85)",
            borderColor: "oklch(0.80 0.14 85 / 0.2)",
          }}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <FootTile
              count={counts.allDone}
              label="ALL DONE"
              caption="Enjoy the magic!"
              icon={<Gift className="h-5 w-5" />}
              tone="green"
            />
            <FootTile
              count={counts.toBuy}
              label="TO BUY"
              caption="Time to shop!"
              icon={<ShoppingBag className="h-5 w-5" />}
              tone="red"
            />
            <FootTile
              count={counts.toWrap}
              label="TO WRAP"
              caption="Almost there!"
              icon={<BowIcon />}
              tone="orange"
            />
            <FootTile
              count={counts.toSend}
              label="TO SEND"
              caption="Don't forget!"
              icon={<Send className="h-5 w-5" />}
              tone="blue"
            />
          </div>
        </div>
      )}

      {/* ADD PERSON MODAL */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[oklch(0.10_0.04_250_/_0.7)] p-4 backdrop-blur-sm"
          onClick={() => setAddOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border p-6"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(160deg, oklch(0.22 0.05 250), oklch(0.16 0.04 250))",
              borderColor: "oklch(0.80 0.14 85 / 0.35)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold)]">
                  New person
                </p>
                <h2 className="mt-1 font-display text-2xl">Add someone to your list</h2>
              </div>
              <button onClick={() => setAddOpen(false)} className="text-muted-foreground hover:text-[color:var(--cream)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (e.g. Oliver)"
                className="w-full rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] px-4 py-2.5 text-sm outline-none focus:border-[color:var(--gold)]"
              />
              <input
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Relationship (Son, Mum…)"
                className="w-full rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] px-4 py-2.5 text-sm outline-none focus:border-[color:var(--gold)]"
              />
              <button
                type="submit"
                disabled={adding || !name.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110 disabled:opacity-50"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Plus className="h-4 w-4" /> Add person
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------ Sub components ------------ */

function ActionTile({
  icon,
  label,
  primary,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-3 text-center transition hover:brightness-110"
      style={
        primary
          ? {
              background: "var(--gradient-gold)",
              borderColor: "oklch(0.80 0.14 85 / 0.6)",
              color: "oklch(0.22 0.05 250)",
            }
          : {
              background: "oklch(0.20 0.04 250 / 0.7)",
              borderColor: "oklch(0.80 0.14 85 / 0.35)",
              color: "oklch(0.92 0.03 85)",
            }
      }
    >
      <span className={primary ? "text-[oklch(0.22_0.05_250)]" : "text-[color:var(--gold)]"}>{icon}</span>
      <span className="text-[11px] font-semibold leading-tight">{label}</span>
    </button>
  );
}

const TONE_BAR: Record<string, string> = {
  gold: "oklch(0.78 0.14 82)",
  amber: "oklch(0.70 0.16 65)",
  rose: "oklch(0.62 0.18 25)",
  sky: "oklch(0.68 0.12 230)",
};

function SummaryStat({
  icon,
  value,
  label,
  pct,
  tone,
}: {
  icon?: React.ReactNode;
  value: string;
  label: string;
  pct: number;
  tone: keyof typeof TONE_BAR;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        {icon && <span className="text-[color:var(--gold)]">{icon}</span>}
        <span className="font-display text-2xl leading-none">{value}</span>
      </div>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[oklch(0.26_0.04_245_/_0.7)]">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%`, background: TONE_BAR[tone] }}
        />
      </div>
      <p className="mt-1 text-[10px] text-[color:var(--muted-foreground)]">{pct}%</p>
    </div>
  );
}

function CircularProgress({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const off = c - (c * value) / 100;
  return (
    <div className="relative grid h-[86px] w-[86px] place-items-center">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="oklch(0.26 0.04 245 / 0.7)" strokeWidth="7" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="url(#g-complete)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 800ms" }}
        />
        <defs>
          <linearGradient id="g-complete" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.80 0.14 85)" />
            <stop offset="100%" stopColor="oklch(0.62 0.15 155)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-lg leading-none gold-text">{value}%</div>
          <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
            Complete
          </div>
        </div>
      </div>
    </div>
  );
}

const TONE_PILL: Record<string, { text: string; count: string; ring: string }> = {
  gold: {
    text: "oklch(0.22 0.05 250)",
    count: "oklch(0.22 0.05 250)",
    ring: "oklch(0.80 0.14 85 / 0.6)",
  },
  red: { text: "oklch(0.92 0.03 85)", count: "oklch(0.65 0.20 25)", ring: "oklch(0.80 0.14 85 / 0.25)" },
  orange: { text: "oklch(0.92 0.03 85)", count: "oklch(0.75 0.15 65)", ring: "oklch(0.80 0.14 85 / 0.25)" },
  blue: { text: "oklch(0.92 0.03 85)", count: "oklch(0.72 0.13 230)", ring: "oklch(0.80 0.14 85 / 0.25)" },
  green: { text: "oklch(0.92 0.03 85)", count: "oklch(0.70 0.16 155)", ring: "oklch(0.80 0.14 85 / 0.25)" },
};

function FilterPill({
  active,
  onClick,
  label,
  count,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tone: keyof typeof TONE_PILL;
}) {
  const t = TONE_PILL[tone];
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
      style={
        active
          ? { background: "var(--gradient-gold)", borderColor: t.ring, color: t.text }
          : {
              background: "oklch(0.20 0.04 250 / 0.6)",
              borderColor: "oklch(0.80 0.14 85 / 0.25)",
              color: "oklch(0.92 0.03 85)",
            }
      }
    >
      <span>{label}</span>
      <span
        className="font-display text-sm"
        style={{ color: active ? t.count : tone === "gold" ? "oklch(0.80 0.14 85)" : t.count }}
      >
        ({count})
      </span>
    </button>
  );
}

function BowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 12c-2-3-5-4-7-3-1 .5-1 2 0 3 1.5 1.5 4.5 1 7 0z" />
      <path d="M12 12c2-3 5-4 7-3 1 .5 1 2 0 3-1.5 1.5-4.5 1-7 0z" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="M12 13v6M10 19l2 2 2-2" />
    </svg>
  );
}

/* ------------ Person Row ------------ */

const PIP_TONE: Record<string, string> = {
  gold: "oklch(0.55 0.14 75)",
  amber: "oklch(0.55 0.16 65)",
  rose: "oklch(0.50 0.18 25)",
  sky: "oklch(0.50 0.14 230)",
  green: "oklch(0.45 0.16 155)",
  muted: "oklch(0.55 0.03 260)",
};

function PersonRow({ person, stats }: { person: { id: string; name: string; relationship: string | null; gift_budget: number | null }; stats: PersonStats }) {
  const { added, bought, wrapped, sentGiven, spent, status } = stats;
  const budget = person.gift_budget != null ? Number(person.gift_budget) : null;

  const pct = (n: number) => (added > 0 ? Math.round((n / added) * 100) : 0);

  const allDone = status === "all-done";
  const wrappedStage = allDone || (added > 0 && bought === added && wrapped === added);
  const boughtStage = wrappedStage || (added > 0 && bought === added);

  const cardBg = allDone
    ? "linear-gradient(160deg, oklch(0.94 0.07 88) 0%, oklch(0.86 0.11 80) 100%)"
    : boughtStage
      ? "linear-gradient(160deg, oklch(0.97 0.03 85) 0%, oklch(0.92 0.06 82) 100%)"
      : "oklch(0.985 0.006 85)";
  const border = allDone
    ? "oklch(0.60 0.14 75 / 0.9)"
    : boughtStage
      ? "oklch(0.72 0.12 80 / 0.7)"
      : "oklch(0.80 0.10 82 / 0.45)";

  const ink = "oklch(0.22 0.04 260)";
  const muted = "oklch(0.42 0.03 260)";

  return (
    <Link
      to="/planner/people/$personId"
      params={{ personId: person.id }}
      className="group relative block overflow-hidden rounded-2xl border shadow-[0_16px_36px_-22px_oklch(0_0_0_/_0.7)] transition-all hover:shadow-[0_20px_44px_-20px_oklch(0_0_0_/_0.8)]"
      style={{ background: cardBg, borderColor: border, color: ink }}
    >
      {/* "For Christmas" corner banner for all-done */}
      {allDone && (
        <span
          aria-hidden
          className="pointer-events-none absolute -left-10 top-3 z-[2] w-40 rotate-[-45deg] py-1 text-center text-[9px] font-bold uppercase tracking-[0.24em] text-[oklch(0.98_0.02_60)] shadow-[0_4px_8px_-4px_oklch(0.25_0.15_25_/_0.6)]"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.52 0.20 22) 0%, oklch(0.38 0.20 22) 100%)",
          }}
        >
          For Christmas
        </span>
      )}

      {/* Wrapped ribbon corner (right side) */}
      {(wrappedStage && !allDone) && <RibbonCorner />}
      {allDone && <RibbonCorner withSeal initial={person.name?.[0]?.toUpperCase() || "?"} />}

      <div className="relative z-[1] grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 pr-6 sm:gap-4 sm:p-5 sm:pr-8">
        {/* Initial */}
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-lg font-semibold sm:h-12 sm:w-12"
          style={{
            background: "oklch(1 0 0 / 0.6)",
            color: "oklch(0.30 0.06 60)",
            border: "1.5px solid oklch(0.62 0.14 78)",
          }}
        >
          {person.name?.[0]?.toUpperCase() || "?"}
        </span>

        {/* Name + relationship */}
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl font-semibold leading-tight sm:text-2xl" style={{ color: ink }}>
            {person.name || "Unnamed"}
          </h3>
          <p className="mt-0.5 truncate text-[12px] font-medium" style={{ color: muted }}>
            {person.relationship || "Christmas list"}
            {budget != null && <span> · {gbp(budget)} budget</span>}
            {allDone && <span className="ml-1 italic" style={{ color: "oklch(0.42 0.20 22)" }}> · Wrapped &amp; ready</span>}
          </p>
        </div>

        {/* Right block */}
        <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
          <div>
            <div className="font-display text-lg leading-none sm:text-xl" style={{ color: ink }}>{gbp(spent)}</div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em] sm:text-[10px] sm:tracking-[0.16em]" style={{ color: muted }}>
              {budget != null && budget > 0 ? <>Of {gbp(budget)} Spent</> : "Spent"}
            </div>
          </div>
          <StatusPill status={status} />
        </div>

        {/* Pips — full-width row spanning under the header */}
        <div className="col-span-3 -mt-1 grid grid-cols-4 gap-2 sm:mt-1 sm:max-w-lg">
          <Pip icon={<Gift className="h-3.5 w-3.5" />} value={added} pct={added > 0 ? 100 : 0} label="Added" tone="gold" ink={ink} muted={muted} />
          <Pip icon={<ShoppingBag className="h-3.5 w-3.5" />} value={bought} pct={pct(bought)} label="Bought" tone={bought === added && added > 0 ? "amber" : "muted"} ink={ink} muted={muted} />
          <Pip icon={<BowIcon className="h-3.5 w-3.5" />} value={wrapped} pct={pct(wrapped)} label="Wrapped" tone={wrapped === added && added > 0 ? "rose" : "muted"} ink={ink} muted={muted} />
          <Pip icon={<Send className="h-3.5 w-3.5" />} value={sentGiven} pct={pct(sentGiven)} label="Sent" tone={sentGiven === added && added > 0 ? "sky" : "muted"} ink={ink} muted={muted} />
        </div>
      </div>
    </Link>
  );
}

function Pip({
  icon,
  value,
  pct,
  label,
  tone,
  ink,
  muted,
}: {
  icon: React.ReactNode;
  value: number;
  pct: number;
  label: string;
  tone: keyof typeof PIP_TONE;
  ink: string;
  muted: string;
}) {
  const color = PIP_TONE[tone];
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span style={{ color }}>{icon}</span>
      <span className="font-display text-base leading-none" style={{ color: ink }}>
        {value}
      </span>
      <span className="text-[8px] font-semibold uppercase tracking-[0.14em]" style={{ color: muted }}>
        {label}
      </span>
      <div className="mt-0.5 h-0.5 w-full overflow-hidden rounded-full" style={{ background: "oklch(0.90 0.02 85 / 0.9)" }}>
        <div className="h-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[8px] font-semibold" style={{ color: muted }}>
        {pct}%
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: PersonStats["status"] }) {
  if (status === "all-done") {
    return (
      <span
        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[oklch(0.98_0.03_60)]"
        style={{ background: "oklch(0.48 0.16 155)" }}
      >
        All done!
      </span>
    );
  }
  if (status === "to-buy") {
    return (
      <span
        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[oklch(0.98_0.03_60)]"
        style={{ background: "oklch(0.55 0.20 25)" }}
      >
        To buy
      </span>
    );
  }
  if (status === "to-wrap") {
    return (
      <span
        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[oklch(0.98_0.03_60)]"
        style={{ background: "oklch(0.62 0.17 65)" }}
      >
        To wrap
      </span>
    );
  }
  if (status === "to-send") {
    return (
      <span
        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[oklch(0.98_0.03_60)]"
        style={{ background: "oklch(0.55 0.13 230)" }}
      >
        To send
      </span>
    );
  }
  return null;
}

function RibbonCorner({ withSeal, initial }: { withSeal?: boolean; initial?: string }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-[1] h-full w-16 sm:w-24"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.78 0.14 82 / 0) 0%, oklch(0.85 0.12 82 / 0.55) 60%, oklch(0.75 0.14 78 / 0.85) 100%)",
        }}
      />
      {withSeal && (
        <span
          aria-hidden
          className="absolute right-3 top-1/2 z-[2] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full font-display text-sm font-bold text-[oklch(0.98_0.03_60)] shadow-[0_4px_10px_-3px_oklch(0.25_0.15_25_/_0.6),inset_0_2px_3px_oklch(1_0_0_/_0.3),inset_0_-3px_5px_oklch(0.2_0.12_25_/_0.5)]"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, oklch(0.58 0.22 22) 0%, oklch(0.38 0.22 22) 60%, oklch(0.28 0.18 22) 100%)",
            border: "1.5px solid oklch(0.78 0.14 82)",
          }}
        >
          {initial || "A"}
        </span>
      )}
    </>
  );
}

/* ------------ Footer tile ------------ */

const FOOT_TONE: Record<string, { bg: string; icon: string; text: string; caption: string }> = {
  green: {
    bg: "oklch(0.22 0.06 155 / 0.55)",
    icon: "oklch(0.72 0.16 155)",
    text: "oklch(0.75 0.16 155)",
    caption: "oklch(0.65 0.12 155)",
  },
  red: {
    bg: "oklch(0.22 0.10 25 / 0.55)",
    icon: "oklch(0.72 0.20 25)",
    text: "oklch(0.75 0.20 25)",
    caption: "oklch(0.66 0.16 25)",
  },
  orange: {
    bg: "oklch(0.22 0.08 65 / 0.55)",
    icon: "oklch(0.75 0.17 65)",
    text: "oklch(0.78 0.17 65)",
    caption: "oklch(0.66 0.14 65)",
  },
  blue: {
    bg: "oklch(0.22 0.06 230 / 0.55)",
    icon: "oklch(0.72 0.13 230)",
    text: "oklch(0.75 0.13 230)",
    caption: "oklch(0.66 0.11 230)",
  },
};

function FootTile({
  count,
  label,
  caption,
  icon,
  tone,
}: {
  count: number;
  label: string;
  caption: string;
  icon: React.ReactNode;
  tone: keyof typeof FOOT_TONE;
}) {
  const t = FOOT_TONE[tone];
  return (
    <div
      className="flex items-center gap-3 rounded-xl border px-3 py-3"
      style={{ background: t.bg, borderColor: "oklch(0.80 0.14 85 / 0.2)" }}
    >
      <span style={{ color: t.icon }}>{icon}</span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl leading-none" style={{ color: t.text }}>
            {count}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: t.text }}>
            {label}
          </span>
        </div>
        <p className="mt-1 text-[11px] italic" style={{ color: t.caption }}>
          {caption}
        </p>
      </div>
    </div>
  );
}
