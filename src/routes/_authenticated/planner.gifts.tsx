import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { usePeople, calcAge, type Person } from "@/hooks/use-people";
import { supabase } from "@/integrations/supabase/client";
import { suggestGiftIdeas, type GiftIdea } from "@/lib/gift-ideas.functions";
import {
  Plus,
  Trash2,
  Sparkles,
  Users,
  Gift as GiftIcon,
  Loader2,
  PoundSterling,
  X,
  Pencil,
  Stamp,
  ExternalLink,
  Lightbulb,
  Package,
  ShoppingBag,
  Send,
  Snowflake,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/planner/gifts")({
  head: () => ({
    meta: [
      { title: "People & Presents — A Complete Christmas" },
      {
        name: "description",
        content:
          "Your luxury People & Presents board with budgets, gift ideas, presents, wrapping progress and Christmas completion states.",
      },
      { property: "og:title", content: "People & Presents — A Complete Christmas" },
      {
        property: "og:description",
        content:
          "Your luxury People & Presents board with budgets, gift ideas, presents, wrapping progress and Christmas completion states.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BuyingForPage,
});

const CURRENT_YEAR = new Date().getFullYear();

interface GiftRow extends BaseRow {
  recipient: string;
  item: string;
  url: string | null;
  price: number | null;
  status: string;
  notes: string | null;
  person_id: string | null;
  year: number;
  shop: string | null;
  is_idea: boolean;
  is_chosen: boolean;
  ordered: boolean;
  arrived: boolean;
  wrapped: boolean;
  sent: boolean;
  given: boolean;
  hidden_location: string | null;
}

type PersonExtras = Person & {
  age_range: string | null;
  dislikes: string | null;
  initial_ideas: string | null;
  needs_stocking: boolean;
  needs_card: boolean;
};

type FilterKey = "all" | "ideas" | "tobuy" | "ordered" | "received" | "wrapped" | "sentgiven";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ideas", label: "Ideas" },
  { key: "tobuy", label: "To buy" },
  { key: "ordered", label: "Ordered / Bought" },
  { key: "received", label: "Received" },
  { key: "wrapped", label: "Wrapped" },
  { key: "sentgiven", label: "Sent / Given" },
];

function matchesFilter(g: GiftRow, f: FilterKey): boolean {
  switch (f) {
    case "all":
      return true;
    case "ideas":
      return g.is_idea === true;
    case "tobuy":
      return g.is_chosen && !g.ordered;
    case "ordered":
      return g.ordered;
    case "received":
      return g.arrived;
    case "wrapped":
      return g.wrapped;
    case "sentgiven":
      return g.sent || g.given;
  }
}

export function BuyingForPage() {
  const { user } = useAuth();
  const { people, loading: peopleLoading, removePerson, upsertLocal, refetch: refetchPeople } =
    usePeople(user?.id);
  const {
    rows: gifts,
    loading: giftsLoading,
    addRow,
    removeRow,
    updateField,
    saving,
  } = usePlannerList<GiftRow>("gifts", user?.id);

  const [addOpen, setAddOpen] = useState(false);
  const [addGiftOpen, setAddGiftOpen] = useState(false);
  const [addGiftMode, setAddGiftMode] = useState<"idea" | "present">("present");
  const [lockedGiftPersonId, setLockedGiftPersonId] = useState<string | null>(null);
  const [editPersonId, setEditPersonId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [aiPersonId, setAiPersonId] = useState<string | null>(null);

  const loading = peopleLoading || giftsLoading;

  // Days until Christmas
  const sleeps = useMemo(() => {
    const now = new Date();
    const xmas = new Date(now.getFullYear(), 11, 25);
    if (now > xmas) xmas.setFullYear(xmas.getFullYear() + 1);
    return Math.max(0, Math.ceil((xmas.getTime() - now.getTime()) / 86_400_000));
  }, []);

  const namedGifts = useMemo(
    () => gifts.filter((g) => (g.item ?? "").trim().length > 0 && g.year === CURRENT_YEAR),
    [gifts],
  );

  const giftsByPerson = useMemo(() => {
    const map = new Map<string, GiftRow[]>();
    for (const g of namedGifts) {
      if (!g.person_id) continue;
      const arr = map.get(g.person_id) ?? [];
      arr.push(g);
      map.set(g.person_id, arr);
    }
    return map;
  }, [namedGifts]);

  const orphanGifts = useMemo(
    () => namedGifts.filter((g) => !g.person_id),
    [namedGifts],
  );

  const totalPresents = namedGifts.filter((g) => g.is_chosen).length;
  const totalBought = namedGifts.filter((g) => g.is_chosen && g.ordered).length;
  const totalReceived = namedGifts.filter((g) => g.is_chosen && g.arrived).length;
  const totalWrapped = namedGifts.filter((g) => g.is_chosen && g.wrapped).length;
  const totalSentGiven = namedGifts.filter((g) => g.is_chosen && (g.sent || g.given)).length;
  const totalSpent = namedGifts
    .filter((g) => g.is_chosen && g.ordered)
    .reduce((s, g) => s + (Number(g.price) || 0), 0);
  const totalComplete =
    totalPresents > 0
      ? Math.round(((totalBought + totalReceived + totalWrapped + totalSentGiven) / (totalPresents * 4)) * 100)
      : 0;

  const filteredPeople = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = people;
    if (q) {
      list = list.filter(
        (p) =>
          (p.name ?? "").toLowerCase().includes(q) ||
          (p.relationship ?? "").toLowerCase().includes(q),
      );
    }
    if (filter !== "all") {
      list = list.filter((p) =>
        (giftsByPerson.get(p.id) ?? []).some((g) => matchesFilter(g, filter)),
      );
    }
    return list;
  }, [people, search, filter, giftsByPerson]);

  const editPerson = editPersonId
    ? (people.find((p) => p.id === editPersonId) as PersonExtras | undefined)
    : null;
  const aiPerson = aiPersonId
    ? (people.find((p) => p.id === aiPersonId) as PersonExtras | undefined)
    : null;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAddGift = (mode: "idea" | "present", personId?: string) => {
    setAddGiftMode(mode);
    setLockedGiftPersonId(personId ?? null);
    setAddGiftOpen(true);
  };

  return (
    <div className="rise-in space-y-6 pb-28 sm:pb-16">
      <header className="relative overflow-hidden rounded-[28px] border border-[color:var(--gold)]/35 shadow-[0_24px_60px_-32px_oklch(0_0_0_/_0.85)]">
        {/* Snowy village banner — matches approved v2 mockup */}
        <div className="relative h-40 overflow-hidden bg-[linear-gradient(180deg,oklch(0.16_0.05_245)_0%,oklch(0.10_0.04_245)_100%)] sm:h-48">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-between px-6 opacity-70">
            <div className="relative h-16 w-14 rounded-t-sm bg-[oklch(0.09_0.02_245)] border-b-2 border-white/5">
              <span className="absolute left-2 top-3 h-1.5 w-1.5 bg-[oklch(0.88_0.14_88_/_0.55)]" />
              <span className="absolute left-2 top-7 h-1.5 w-1.5 bg-[oklch(0.88_0.14_88_/_0.35)]" />
            </div>
            <div className="relative h-20 w-16 rounded-t-md bg-[oklch(0.08_0.02_245)] border-b-2 border-white/5">
              <span className="absolute left-4 top-4 h-2 w-2 bg-[oklch(0.90_0.16_88_/_0.75)] shadow-[0_0_10px_oklch(0.90_0.16_88_/_0.7)]" />
              <span className="absolute left-2 top-10 h-1.5 w-1.5 bg-[oklch(0.88_0.14_88_/_0.4)]" />
            </div>
            <div className="h-12 w-10 rounded-t-sm bg-[oklch(0.09_0.02_245)] border-b-2 border-white/5" />
          </div>
          <div className="pointer-events-none absolute bottom-4 left-6 flex flex-col items-center">
            <span className="h-10 w-[3px] bg-[oklch(0.06_0.01_245)]" />
            <span className="-mt-12 h-3 w-3 rounded-full bg-[oklch(0.90_0.16_88)] shadow-[0_0_18px_6px_oklch(0.90_0.16_88_/_0.55)]" />
          </div>
          <div className="pointer-events-none absolute bottom-2 right-8">
            <span
              className="block h-0 w-0"
              style={{
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderBottom: "40px solid oklch(0.28 0.08 155)",
              }}
            />
            <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[oklch(0.90_0.16_88)] shadow-[0_0_10px_oklch(0.90_0.16_88_/_0.9)]" />
            <span className="absolute top-4 left-2 h-1 w-1 rounded-full bg-[oklch(0.65_0.20_25)]" />
            <span className="absolute top-8 right-2 h-1 w-1 rounded-full bg-[oklch(0.90_0.14_88)]" />
          </div>
          <div className="relative z-[1] flex flex-col items-center pt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
              {sleeps} sleeps until Christmas
            </p>
          </div>
        </div>

        {/* Header body — navy */}
        <div className="relative bg-[oklch(0.09_0.04_245)] p-5 sm:p-7">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
            <Users className="h-4 w-4" /> People &amp; Presents
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">My People &amp; Presents</h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--cream)]/82 sm:text-base">
            Everyone on your list — with every idea, present and price in one beautiful place.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-[color:var(--midnight-deep)] shadow-[0_10px_30px_-10px_oklch(0.82_0.14_85_/_0.7)] transition hover:brightness-110 sm:text-base"
              style={{ background: "var(--gradient-gold)" }}
            >
              <Plus className="h-5 w-5" /> Add person
            </button>
            <button
              onClick={() => openAddGift("present")}
              disabled={people.length === 0}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-[color:var(--gold)]/55 bg-[color:var(--midnight-deep)]/60 px-3 py-3 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)] hover:bg-[color:var(--midnight-deep)]/80 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
            >
              <Package className="h-5 w-5" /> Add present
            </button>
            <Link
              to="/gift-finder"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-[color:var(--gold)]/45 bg-[color:var(--midnight-deep)]/60 px-3 py-3 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)] hover:bg-[color:var(--midnight-deep)]/80 sm:text-base"
            >
              <Sparkles className="h-5 w-5" /> Gift Finder
            </Link>
            <Link
              to="/gift-finder/secret-santa"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-[color:var(--gold)]/45 bg-[color:var(--midnight-deep)]/60 px-3 py-3 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)] hover:bg-[color:var(--midnight-deep)]/80 sm:text-base"
            >
              <Snowflake className="h-5 w-5" /> Secret Santa
            </Link>
          </div>
        </div>
      </header>

      {people.length === 0 && (
        <p className="-mt-2 text-center text-xs text-muted-foreground">
          Add someone first, then you can add presents for them.
        </p>
      )}

      {/* Summary */}
      {people.length > 0 && (
        <div className="rounded-[24px] border border-[color:var(--gold)]/25 bg-[color:var(--midnight-deep)]/70 p-4 shadow-[0_18px_48px_-30px_oklch(0_0_0_/_0.8)] sm:p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <SummaryStat icon={<GiftIcon className="h-4 w-4" />} value={totalPresents} label={totalPresents === 1 ? "present" : "presents"} />
            <SummaryStat icon={<ShoppingBag className="h-4 w-4" />} value={totalBought} label="bought" />
            <SummaryStat icon={<RibbonMark className="h-4 w-4" />} value={totalWrapped} label="wrapped" />
            <SummaryStat icon={<Send className="h-4 w-4" />} value={totalSentGiven} label="sent / given" />
            <div className="col-span-2 grid place-items-center rounded-2xl border border-[color:var(--gold)]/18 bg-[color:var(--cream)]/5 py-3 sm:col-span-1">
              <CircularGiftProgress value={totalComplete} />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">{`Spent so far: £${totalSpent.toFixed(0)}`}</p>
        </div>
      )}

      {/* Filters */}
      {people.length > 0 && (
        <div className="-mx-1 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={
                  "snap-start whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition " +
                  (active
                    ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--gold-soft)]"
                    : "border-[color:var(--gold)]/25 text-muted-foreground hover:border-[color:var(--gold)]/60")
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Search */}
      {people.length > 3 && (
        <label className="flex items-center gap-2 rounded-2xl border border-[color:var(--gold)]/25 bg-black/20 px-4 py-3">
          <span className="text-[color:var(--gold-soft)]">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      )}

      {/* Orphan gifts — must be assigned to a person */}
      {orphanGifts.length > 0 && people.length > 0 && (
        <section className="rounded-2xl border border-[color:var(--burgundy)]/60 bg-[color:var(--burgundy)]/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--burgundy)]">
            Needs a person
          </p>
          <p className="mt-1 text-xs text-[color:var(--cream)]/85">
            These gifts aren't linked to anyone yet. Pick who each one is for.
          </p>
          <ul className="mt-3 space-y-2">
            {orphanGifts.map((g) => (
              <li
                key={g.id}
                className="flex flex-col gap-2 rounded-xl border border-[color:var(--burgundy)]/40 bg-black/25 p-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{g.item}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {g.is_idea ? "Idea" : "Present"}
                    {g.price != null ? ` · £${Number(g.price).toFixed(0)}` : ""}
                  </p>
                </div>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const pid = e.target.value;
                    if (!pid) return;
                    const person = people.find((pp) => pp.id === pid);
                    updateField(g.id, "person_id", pid);
                    if (person) updateField(g.id, "recipient", person.name);
                    toast.success(`Assigned to ${person?.name ?? "person"}`);
                  }}
                  className="rounded-lg border border-[color:var(--gold)]/30 bg-black/40 px-3 py-2 text-sm"
                >
                  <option value="">Assign to…</option>
                  {people.map((pp) => (
                    <option key={pp.id} value={pp.id}>
                      {pp.name || "Unnamed"}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${g.item}"?`)) void removeRow(g.id);
                  }}
                  className="rounded-lg border border-[color:var(--burgundy)]/50 px-3 py-2 text-xs text-[color:var(--burgundy)] hover:bg-[color:var(--burgundy)]/20"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading your list…</p>
      ) : people.length === 0 ? (
        <EmptyState onAdd={() => setAddOpen(true)} />
      ) : filteredPeople.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[color:var(--gold)]/25 p-6 text-center text-sm text-muted-foreground">
          No one matches that filter or search.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredPeople.map((p) => (
            <RecipientCard
              key={p.id}
              person={p as PersonExtras}
              gifts={giftsByPerson.get(p.id) ?? []}
              filter={filter}
              expanded={expanded.has(p.id)}
              onToggle={() => toggleExpand(p.id)}
              onEdit={() => setEditPersonId(p.id)}
              onDelete={() => {
                if (
                  confirm(
                    `Remove ${p.name || "this person"} from your list? Their gifts stay in your history.`,
                  )
                ) {
                  void removePerson(p.id);
                }
              }}
              onAddPresent={() => openAddGift("present", p.id)}
              onAddIdea={() => openAddGift("idea", p.id)}
              onFindIdeas={() => setAiPersonId(p.id)}
              updateField={updateField}
              removeRow={removeRow}
            />
          ))}
        </div>
      )}

      <p className="pt-2 text-center text-[11px] text-muted-foreground">
        {saving ? "Saving…" : "Everything is saved"}
      </p>

      {/* Modals */}
      {addOpen && user && (
        <PersonForm
          title="Add a person to your Christmas list"
          submitLabel="Add person"
          userId={user.id}
          onClose={() => setAddOpen(false)}
          onSaved={(row) => {
            if (row) upsertLocal(row);
            void refetchPeople();
            setAddOpen(false);
          }}
        />
      )}
      {editPerson && (
        <PersonForm
          title={`Edit ${editPerson.name || "person"}`}
          submitLabel="Save changes"
          userId={editPerson.user_id}
          initial={editPerson}
          onClose={() => setEditPersonId(null)}
          onSaved={(row) => {
            if (row) upsertLocal(row);
            void refetchPeople();
            setEditPersonId(null);
          }}
        />
      )}
      {addGiftOpen && user && (
        <QuickGiftForm
          people={people as PersonExtras[]}
          lockedPersonId={lockedGiftPersonId}
          initialMode={addGiftMode}
          onClose={() => {
            setAddGiftOpen(false);
            setLockedGiftPersonId(null);
          }}
          onSave={async (fields) => {
            await addRow(fields);
            setAddGiftOpen(false);
            setLockedGiftPersonId(null);
          }}
        />
      )}
      {aiPerson && (
        <AiIdeasPanel
          person={aiPerson}
          existingItems={(giftsByPerson.get(aiPerson.id) ?? []).map((g) => g.item).filter(Boolean)}
          onClose={() => setAiPersonId(null)}
          onPick={(idea) => {
            void addRow({
              recipient: aiPerson.name,
              person_id: aiPerson.id,
              item: idea.item,
              status: "idea",
              is_idea: true,
              is_chosen: false,
              year: CURRENT_YEAR,
              price: idea.estimatedPrice ?? null,
              notes: idea.reason ?? null,
            } as Partial<GiftRow>);
            toast.success(`Added "${idea.item}" to ${aiPerson.name}'s ideas`);
          }}
        />
      )}
    </div>
  );
}

/* ---------------------- Small pieces ---------------------- */

function SummaryStat({ value, label, icon }: { value: number | string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[color:var(--gold)]/18 bg-[color:var(--cream)]/5 p-3 text-center">
      {icon && <span className="mx-auto mb-1 block w-fit text-[color:var(--gold-soft)]">{icon}</span>}
      <p className="font-display text-2xl text-[color:var(--gold-soft)]">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function CircularGiftProgress({ value }: { value: number }) {
  const radius = 27;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * value) / 100;

  return (
    <div className="relative grid h-[78px] w-[78px] place-items-center">
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
        <circle cx="36" cy="36" r={radius} stroke="oklch(0.80 0.14 85 / 0.16)" strokeWidth="7" fill="none" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke="oklch(0.82 0.14 85)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-lg leading-none text-[color:var(--gold-soft)]">{value}%</p>
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">complete</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-[color:var(--gold)]/40 bg-[color:var(--forest-deep)]/40 p-10 text-center">
      <span
        className="mx-auto grid h-14 w-14 place-items-center rounded-2xl"
        style={{ background: "var(--gradient-gold)" }}
      >
        <Users className="h-6 w-6 text-[color:var(--forest-deep)]" />
      </span>
      <h3 className="mt-4 font-display text-2xl">Your list is a blank Christmas card</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Add your first person to start collecting gift ideas and choosing presents.
      </p>
      <button
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--forest-deep)] transition hover:brightness-110"
        style={{ background: "var(--gradient-gold)" }}
      >
        <Plus className="h-4 w-4" /> Add your first person
      </button>
    </div>
  );
}

/* ---------------------- Recipient card (expandable) ---------------------- */

function RecipientCard({
  person,
  gifts,
  filter,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onAddPresent,
  onAddIdea,
  onFindIdeas,
  updateField,
  removeRow,
}: {
  person: PersonExtras;
  gifts: GiftRow[];
  filter: FilterKey;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddPresent: () => void;
  onAddIdea: () => void;
  onFindIdeas: () => void;
  updateField: <K extends keyof GiftRow>(id: string, field: K, value: GiftRow[K]) => void;
  removeRow: (id: string) => void;
}) {
  const budget = person.gift_budget != null ? Number(person.gift_budget) : null;
  const ideas = gifts.filter((g) => g.is_idea);
  const presents = gifts.filter((g) => g.is_chosen);

  const planned = presents.reduce((s, g) => s + (Number(g.price) || 0), 0);
  const spent = presents.filter((g) => g.ordered).reduce((s, g) => s + (Number(g.price) || 0), 0);
  

  const boughtCount = presents.filter((g) => g.ordered).length;
  const receivedCount = presents.filter((g) => g.arrived).length;
  const wrappedCount = presents.filter((g) => g.wrapped).length;
  const givenCount = presents.filter((g) => g.given || g.sent).length;

  const filteredIdeas =
    filter === "all" ? ideas : ideas.filter((g) => matchesFilter(g, filter));
  const filteredPresents =
    filter === "all" ? presents : presents.filter((g) => matchesFilter(g, filter));

  const chooseIdea = (g: GiftRow) => {
    updateField(g.id, "is_idea", false);
    updateField(g.id, "is_chosen", true);
    toast.success(`Added to ${person.name || "this person"}'s presents`);
  };

  // Stage detection — only counts when there's at least one chosen present
  const hasPresents = presents.length > 0;
  const allBought = hasPresents && boughtCount === presents.length;
  const allWrapped = hasPresents && wrappedCount === presents.length;
  const allGiven = hasPresents && givenCount === presents.length;

  const stage: 1 | 2 | 3 | 4 = allGiven ? 4 : allWrapped ? 3 : allBought ? 2 : 1;
  const isGold = stage >= 2;

  const budgetPct = budget && budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const budgetTone =
    budget == null
      ? "neutral"
      : spent > budget
        ? "over"
        : spent === budget
          ? "exact"
          : "under";
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
        "group/card relative overflow-hidden rounded-[26px] border shadow-[0_20px_50px_-24px_oklch(0_0_0_/_0.75)] transition-all duration-500 " +
        (isGold ? "sparkle-once" : "")
      }
      style={{ background: cardBg, borderColor: borderCol, color: textInk }}
    >
      {/* Subtle snowflake texture on gold stages */}
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

      {/* Stage 3+: red satin ribbon with gold-edged bow in the top-right corner */}
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

      {/* Stage 4: wax-seal badge */}
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
            Complete
          </span>
        </span>
      )}

      <div className="relative z-[1] p-5 sm:p-6">
        {/* Header row: small avatar + name/relationship */}
        <div className="flex items-start gap-3">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-semibold"
            style={{
              background: isGold ? "oklch(1 0 0 / 0.55)" : "oklch(0.96 0.02 85)",
              color: "oklch(0.30 0.06 60)",
              border: "1px solid oklch(0.72 0.12 82 / 0.5)",
            }}
          >
            {person.name?.[0]?.toUpperCase() || "?"}
          </span>
          <div className="min-w-0 flex-1">
            <h3
              className="truncate font-display text-[26px] font-semibold leading-tight tracking-tight sm:text-[28px]"
              style={{ color: textInk }}
            >
              {person.name || "Unnamed"}
            </h3>
            <p className="mt-0.5 text-[13px] font-medium" style={{ color: textMuted }}>
              {person.relationship || "Christmas list"}
              {allGiven && <span className="ml-1.5 italic" style={{ color: "oklch(0.42 0.20 22)" }}>· All done!</span>}
              {!allGiven && allBought && (
                <span className="ml-1.5 font-semibold" style={{ color: "oklch(0.42 0.14 65)" }}>
                  · {allWrapped ? "Wrapped & ready" : "All presents bought"}
                </span>
              )}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <IconBtn onClick={onEdit} label="Edit person">
              <Pencil className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn onClick={onDelete} label="Remove person" danger>
              <Trash2 className="h-3.5 w-3.5" />
            </IconBtn>
          </div>
        </div>

        {/* Budget bar */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: textMuted }}>
            <span>Budget</span>
            <span style={{ color: textInk }}>
              {budget != null ? (
                <>
                  <span className="font-display text-[15px] tracking-normal normal-case">£{spent.toFixed(0)}</span>
                  <span className="mx-1 opacity-60">of</span>
                  <span className="font-display text-[15px] tracking-normal normal-case">£{budget.toFixed(0)}</span>
                </>
              ) : (
                <span className="font-display text-[15px] tracking-normal normal-case">£{spent.toFixed(0)} spent</span>
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
        </div>

        {/* Progress icons row */}
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <ProgressPip icon={<GiftIcon className="h-4 w-4" />} value={presents.length} label="Presents" muted={textMuted} ink={textInk} />
          <ProgressPip icon={<ShoppingBag className="h-4 w-4" />} value={boughtCount} label="Bought" done={allBought} muted={textMuted} ink={textInk} accent="oklch(0.48 0.14 155)" />
          <ProgressPip icon={<RibbonMark className="h-4 w-4" />} value={wrappedCount} label="Wrapped" done={allWrapped} muted={textMuted} ink={textInk} accent="oklch(0.50 0.20 22)" />
          <ProgressPip icon={<Stamp className="h-4 w-4" />} value={givenCount} label="Given" done={allGiven} muted={textMuted} ink={textInk} accent="oklch(0.45 0.22 22)" />
        </div>

        {/* View Gifts — premium outlined button */}
        <button
          onClick={onToggle}
          aria-expanded={expanded}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] transition hover:shadow-[0_8px_20px_-10px_oklch(0.55_0.14_75_/_0.6)]"
          style={{
            borderColor: "oklch(0.55 0.14 75 / 0.85)",
            color: "oklch(0.35 0.10 60)",
            background: isGold ? "oklch(1 0 0 / 0.35)" : "transparent",
          }}
        >
          {expanded ? "Hide gifts" : "View gifts"}
          <span aria-hidden className="text-base leading-none">→</span>
        </button>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="space-y-5 border-t border-[color:var(--gold)]/15 bg-black/25 p-5">
          {/* Card actions */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <SmallAction onClick={onAddPresent} icon={<Package className="h-4 w-4" />} label="+ Add present" primary />
            <SmallAction onClick={onAddIdea} icon={<Lightbulb className="h-4 w-4" />} label="+ Add gift idea" />
            <SmallAction onClick={onFindIdeas} icon={<Sparkles className="h-4 w-4" />} label="Find ideas" />
            <SmallAction onClick={onEdit} icon={<Pencil className="h-4 w-4" />} label="Edit person" />
          </div>

          {/* Gift Ideas — pale champagne "suggestion" tint, dark text */}
          <section
            className="rounded-2xl border p-4"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.94 0.05 88 / 0.96), oklch(0.90 0.06 88 / 0.92))",
              borderColor: "oklch(0.75 0.13 82 / 0.55)",
              color: "oklch(0.20 0.03 245)",
            }}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" style={{ color: "oklch(0.42 0.14 65)" }} />
              <h4
                className="font-sans text-sm font-bold uppercase tracking-[0.14em]"
                style={{ color: "oklch(0.30 0.05 60)" }}
              >
                Gift Ideas
              </h4>
              <span className="text-[11px]" style={{ color: "oklch(0.35 0.03 60)" }}>
                ({ideas.length}
                {filter !== "all" && filteredIdeas.length !== ideas.length
                  ? ` · ${filteredIdeas.length} showing`
                  : ""}
                )
              </span>
              <span
                className="ml-auto rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]"
                style={{
                  borderColor: "oklch(0.55 0.10 60 / 0.5)",
                  color: "oklch(0.40 0.08 60)",
                }}
              >
                Still deciding
              </span>
            </div>
            <p className="mt-0.5 text-[11px]" style={{ color: "oklch(0.35 0.02 60)" }}>
              Possibilities — nothing here counts as bought until you choose it.
            </p>
            {filteredIdeas.length === 0 ? (
              <p
                className="mt-2 rounded-xl border border-dashed p-4 text-center text-xs"
                style={{
                  borderColor: "oklch(0.65 0.08 60 / 0.5)",
                  color: "oklch(0.40 0.05 60)",
                }}
              >
                {ideas.length === 0 ? "No ideas saved yet." : "No ideas match this filter."}
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {filteredIdeas.map((g) => (
                  <IdeaRow
                    key={g.id}
                    gift={g}
                    onChoose={() => chooseIdea(g)}
                    onUpdate={updateField}
                    onRemove={removeRow}
                  />
                ))}
              </ul>
            )}
          </section>

          {/* Presents — deep forest, active/managed items */}
          <section
            className="rounded-2xl border p-4"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.24 0.08 155 / 0.9), oklch(0.18 0.07 155 / 0.95))",
              borderColor: "oklch(0.55 0.14 155 / 0.45)",
              boxShadow: "0 10px 30px -18px oklch(0 0 0 / 0.7)",
            }}
          >
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[color:var(--gold-soft)]" />
              <h4 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--gold-soft)]">
                Presents
              </h4>
              <span className="text-[11px] text-[color:var(--cream)]/60">
                ({presents.length}
                {filter !== "all" && filteredPresents.length !== presents.length
                  ? ` · ${filteredPresents.length} showing`
                  : ""}
                )
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-[color:var(--cream)]/60">
              What you've chosen to buy. Tick each stage as it happens.
            </p>
            {filteredPresents.length === 0 ? (
              <p className="mt-2 rounded-xl border border-dashed border-[color:var(--gold)]/25 p-4 text-center text-xs text-[color:var(--cream)]/60">
                {presents.length === 0 ? "No presents chosen yet." : "No presents match this filter."}
              </p>
            ) : (
              <ul className="mt-2 space-y-3">
                {filteredPresents.map((g, i) => (
                  <PresentEditor
                    key={g.id}
                    gift={g}
                    zebra={i % 2 === 1}
                    onUpdate={updateField}
                    onRemove={removeRow}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </article>
  );
}

function SmallAction({
  onClick,
  icon,
  label,
  primary,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold transition " +
        (primary
          ? "text-[color:var(--forest-deep)] hover:brightness-110"
          : "border border-[color:var(--gold)]/30 text-[color:var(--cream)] hover:border-[color:var(--gold)] hover:bg-black/20")
      }
      style={primary ? { background: "var(--gradient-gold)" } : undefined}
    >
      {icon}
      {label}
    </button>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={
        "rounded-full border border-[color:var(--gold)]/30 bg-black/20 p-1.5 text-muted-foreground transition hover:text-foreground " +
        (danger
          ? "hover:border-[color:var(--burgundy)] hover:text-[color:var(--burgundy)]"
          : "hover:border-[color:var(--gold)]/70")
      }
    >
      {children}
    </button>
  );
}

function ProgressPip({
  icon,
  value,
  label,
  done,
  muted,
  ink,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  done?: boolean;
  muted: string;
  ink: string;
  accent?: string;
}) {
  const active = done && value > 0;
  return (
    <div
      className="rounded-2xl border px-1 py-2 transition"
      style={{
        borderColor: active ? (accent ?? "oklch(0.55 0.14 75 / 0.6)") : "oklch(0.78 0.06 85 / 0.55)",
        background: active ? "oklch(1 0 0 / 0.55)" : "oklch(1 0 0 / 0.35)",
      }}
    >
      <div
        className="flex items-center justify-center gap-1 text-[15px] leading-none"
        style={{ color: active ? (accent ?? ink) : ink }}
      >
        <span aria-hidden>{icon}</span>
        <span className="font-display text-[17px] font-semibold">{value}</span>
      </div>
      <p
        className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: active ? (accent ?? ink) : muted }}
      >
        {label}
      </p>
    </div>
  );
}

function RibbonMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 11c-2.2-2.8-5.2-3.8-7.1-2.6-1 .6-1 2.1 0 3 1.5 1.4 4.5 1 7.1-.4Z" />
      <path d="M12 11c2.2-2.8 5.2-3.8 7.1-2.6 1 .6 1 2.1 0 3-1.5 1.4-4.5 1-7.1-.4Z" />
      <circle cx="12" cy="11" r="1.6" />
      <path d="M10.8 12.4 8.8 20l3.2-1.6 3.2 1.6-2-7.6" />
    </svg>
  );
}


/* ---------------------- Idea row ---------------------- */

function IdeaRow({
  gift,
  onChoose,
  onUpdate,
  onRemove,
}: {
  gift: GiftRow;
  onChoose: () => void;
  onUpdate: <K extends keyof GiftRow>(id: string, field: K, value: GiftRow[K]) => void;
  onRemove: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [item, setItem] = useState(gift.item);
  useEffect(() => setItem(gift.item), [gift.item]);

  const save = () => {
    const trimmed = item.trim();
    if (trimmed.length === 0) {
      toast.error("Give the idea a name");
      setItem(gift.item);
      return;
    }
    if (trimmed !== gift.item) onUpdate(gift.id, "item", trimmed);
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete idea "${gift.item}"?`)) onRemove(gift.id);
  };

  return (
    <li
      className="rounded-xl border p-3"
      style={{
        background: "oklch(0.99 0.01 88 / 0.95)",
        borderColor: "oklch(0.65 0.11 70 / 0.5)",
        color: "oklch(0.20 0.03 245)",
      }}
    >
      {editing ? (
        <div className="space-y-2">
          <input
            autoFocus
            value={item}
            onChange={(e) => setItem(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className={inputCls}
            placeholder="Idea name"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={gift.url ?? ""}
              onChange={(e) => onUpdate(gift.id, "url", e.target.value || null)}
              placeholder="Product link"
              className={inputCls}
            />
            <div className="flex items-center gap-1 rounded-xl border border-[color:var(--gold)]/25 bg-black/20 px-3">
              <PoundSterling className="h-3.5 w-3.5 text-[color:var(--gold-soft)]" />
              <input
                type="number"
                min={0}
                value={gift.price ?? ""}
                onChange={(e) =>
                  onUpdate(gift.id, "price", e.target.value === "" ? null : Number(e.target.value))
                }
                placeholder="Estimated price"
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
            </div>
          </div>
          <input
            value={gift.notes ?? ""}
            onChange={(e) => onUpdate(gift.id, "notes", e.target.value || null)}
            placeholder="Notes"
            className={inputCls}
          />
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold" style={{ color: "oklch(0.18 0.03 245)" }}>
              {gift.item}
            </p>
            <p className="mt-0.5 text-[11px]" style={{ color: "oklch(0.35 0.03 60)" }}>
              {gift.price != null ? `≈ £${Number(gift.price).toFixed(0)}` : "No price yet"}
              {gift.shop ? ` · ${gift.shop}` : ""}
            </p>
            {gift.notes && (
              <p className="mt-1 line-clamp-2 text-[12px]" style={{ color: "oklch(0.30 0.02 60)" }}>
                {gift.notes}
              </p>
            )}
            {gift.url && (
              <a
                href={gift.url.startsWith("http") ? gift.url : `https://${gift.url}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium hover:underline"
                style={{ color: "oklch(0.40 0.14 65)" }}
              >
                <ExternalLink className="h-3 w-3" /> Open link
              </a>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <button
              onClick={onChoose}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-[color:var(--forest-deep)] shadow-sm transition hover:brightness-110"
              style={{ background: "var(--gradient-gold)" }}
            >
              Choose this present
            </button>
            <div className="flex justify-end gap-1">
              <button
                onClick={() => setEditing(true)}
                aria-label="Edit"
                className="rounded-full border p-1.5 text-[11px] transition hover:bg-black/5"
                style={{
                  borderColor: "oklch(0.55 0.08 60 / 0.4)",
                  color: "oklch(0.35 0.04 60)",
                }}
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={handleDelete}
                aria-label="Delete"
                className="rounded-full border p-1.5 text-[11px] transition hover:bg-black/5"
                style={{
                  borderColor: "oklch(0.55 0.14 25 / 0.5)",
                  color: "oklch(0.42 0.14 25)",
                }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

/* ---------------------- Present editor (5 independent toggles) ---------------------- */

const PROGRESS: { key: "ordered" | "arrived" | "wrapped" | "sent" | "given"; label: string }[] = [
  { key: "ordered", label: "Ordered / Bought" },
  { key: "arrived", label: "Received" },
  { key: "wrapped", label: "Wrapped" },
  { key: "sent", label: "Sent" },
  { key: "given", label: "Given" },
];

function PresentEditor({
  gift,
  zebra,
  onUpdate,
  onRemove,
}: {
  gift: GiftRow;
  zebra?: boolean;
  onUpdate: <K extends keyof GiftRow>(id: string, field: K, value: GiftRow[K]) => void;
  onRemove: (id: string) => void;
}) {
  const [item, setItem] = useState(gift.item);
  useEffect(() => setItem(gift.item), [gift.item]);

  const commitItem = () => {
    const trimmed = item.trim();
    if (trimmed.length === 0) {
      toast.error("Give the present a name ✨");
      setItem(gift.item);
      return;
    }
    if (trimmed !== gift.item) onUpdate(gift.id, "item", trimmed);
  };

  const toggle = (key: "ordered" | "arrived" | "wrapped" | "sent" | "given") => {
    const next = !gift[key];
    onUpdate(gift.id, key, next);
    // Keep legacy `status` roughly in sync so older views still show something sensible.
    if (key === "given" && next) onUpdate(gift.id, "status", "given");
    else if (key === "wrapped" && next) onUpdate(gift.id, "status", "wrapped");
    else if (key === "ordered" && next && (gift.status === "idea" || !gift.status)) {
      onUpdate(gift.id, "status", "bought");
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete present "${gift.item}"?`)) onRemove(gift.id);
  };

  return (
    <li
      className="rounded-2xl border p-4"
      style={{
        background: zebra
          ? "oklch(0.22 0.06 155 / 0.65)"
          : "oklch(0.16 0.05 155 / 0.75)",
        borderColor: "oklch(0.55 0.14 155 / 0.35)",
      }}
    >
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          onBlur={commitItem}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          placeholder="Present name (required)"
          className="w-full rounded-xl border border-[color:var(--gold)]/25 bg-black/25 px-3 py-2 text-sm font-medium outline-none focus:border-[color:var(--gold)]/70"
        />
        <div className="flex items-center gap-2 justify-self-end">
          {gift.url && (
            <a
              href={gift.url.startsWith("http") ? gift.url : `https://${gift.url}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="rounded-full border border-[color:var(--gold)]/25 p-2 text-muted-foreground transition hover:border-[color:var(--gold)]/60 hover:text-[color:var(--gold-soft)]"
              aria-label="Open product link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            onClick={handleDelete}
            className="rounded-full border border-[color:var(--gold)]/25 p-2 text-muted-foreground transition hover:border-[color:var(--burgundy)] hover:text-[color:var(--burgundy)]"
            aria-label="Delete present"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <input
          value={gift.shop ?? ""}
          onChange={(e) => onUpdate(gift.id, "shop", e.target.value || null)}
          placeholder="Shop or website"
          className={inputCls}
        />
        <input
          value={gift.url ?? ""}
          onChange={(e) => onUpdate(gift.id, "url", e.target.value || null)}
          placeholder="Product link"
          className={inputCls}
        />
        <div className="flex items-center gap-1 rounded-xl border border-[color:var(--gold)]/25 bg-black/20 px-3">
          <PoundSterling className="h-3.5 w-3.5 text-[color:var(--gold-soft)]" />
          <input
            type="number"
            min={0}
            value={gift.price ?? ""}
            onChange={(e) =>
              onUpdate(gift.id, "price", e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="Price paid"
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
        </div>
      </div>

      {/* 5 independent progress controls */}
      <div className="mt-3">
        <p className="mb-1.5 text-[10px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
          Progress
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
          {PROGRESS.map((p) => {
            const active = Boolean(gift[p.key]);
            return (
              <button
                key={p.key}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => toggle(p.key)}
                className={
                  "flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-medium transition " +
                  (active
                    ? "border-[color:var(--pine-bright)]/70 bg-[color:var(--pine-bright)]/15 text-[color:var(--pine-bright)]"
                    : "border-[color:var(--gold)]/25 text-muted-foreground hover:border-[color:var(--gold)]/60")
                }
              >
                <span
                  className={
                    "grid h-4 w-4 place-items-center rounded border " +
                    (active
                      ? "border-[color:var(--pine-bright)] bg-[color:var(--pine-bright)]/30"
                      : "border-[color:var(--gold)]/40")
                  }
                  aria-hidden
                >
                  {active ? "✓" : ""}
                </span>
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <input
        value={gift.notes ?? ""}
        onChange={(e) => onUpdate(gift.id, "notes", e.target.value || null)}
        placeholder="Notes"
        className={inputCls + " mt-3"}
      />
    </li>
  );
}

/* ---------------------- Add / Edit person form ---------------------- */

function PersonForm({
  title,
  submitLabel,
  userId,
  initial,
  onClose,
  onSaved,
}: {
  title: string;
  submitLabel: string;
  userId: string;
  initial?: PersonExtras;
  onClose: () => void;
  onSaved: (row: Person | null) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [relationship, setRelationship] = useState(initial?.relationship ?? "");
  const [ageRange, setAgeRange] = useState(initial?.age_range ?? "");
  const [budget, setBudget] = useState<string>(
    initial?.gift_budget != null ? String(initial.gift_budget) : "",
  );
  const [interests, setInterests] = useState(initial?.hobbies ?? "");
  const [dislikes, setDislikes] = useState(initial?.dislikes ?? "");
  const [initialIdeas, setInitialIdeas] = useState(initial?.initial_ideas ?? "");
  const [needsStocking, setNeedsStocking] = useState(initial?.needs_stocking ?? false);
  const [needsCard, setNeedsCard] = useState(initial?.needs_card ?? false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name.trim()) {
      toast.error("A name would be lovely ✨");
      return;
    }
    setSaving(true);
    const payload = {
      name: name.trim(),
      relationship: relationship.trim() || null,
      age_range: ageRange.trim() || null,
      gift_budget: budget === "" ? null : Number(budget),
      hobbies: interests.trim() || null,
      dislikes: dislikes.trim() || null,
      initial_ideas: initialIdeas.trim() || null,
      needs_stocking: needsStocking,
      needs_card: needsCard,
    };
    let row: Person | null = null;
    let error;
    if (initial) {
      const res = await supabase
        .from("people")
        .update(payload as never)
        .eq("id", initial.id)
        .select()
        .single();
      error = res.error;
      row = (res.data as Person) ?? null;
    } else {
      const res = await supabase
        .from("people")
        .insert({ user_id: userId, ...payload } as never)
        .select()
        .single();
      error = res.error;
      row = (res.data as Person) ?? null;
    }
    setSaving(false);
    if (error) {
      const msg = error.message || "Couldn't save — please try again";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    toast.success(initial ? "Saved" : `${payload.name} added to your list ✨`);
    onSaved(row);
  };

  return (
    <Modal
      onClose={onClose}
      title={title}
      eyebrow="A person on your list"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[color:var(--gold)]/25 px-4 py-2 text-xs text-muted-foreground transition hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="person-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-[color:var(--forest-deep)] transition hover:brightness-110 disabled:opacity-60"
            style={{ background: "var(--gradient-gold)" }}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitLabel}
          </button>
        </div>
      }
    >
      <form id="person-form" onSubmit={submit} className="space-y-4">
        {errorMsg && (
          <div className="rounded-xl border border-[color:var(--burgundy)] bg-[color:var(--burgundy)]/10 p-3 text-xs text-[color:var(--burgundy)]">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" required>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Auntie Rose"
              className={inputCls}
            />
          </Field>
          <Field label="Budget (optional)">
            <div className="flex items-center gap-1 rounded-xl border border-[color:var(--gold)]/25 bg-black/20 px-3">
              <PoundSterling className="h-3.5 w-3.5 text-[color:var(--gold-soft)]" />
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="50"
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
            </div>
          </Field>
        </div>

        <Field label="Relationship (optional)">
          <input
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="Sister, Nephew, Best friend…"
            className={inputCls}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {RELATIONSHIP_SUGGESTIONS.map((r) => {
              const active = relationship.trim().toLowerCase() === r.toLowerCase();
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRelationship(active ? "" : r)}
                  className={
                    "rounded-full border px-3 py-1 text-[11px] transition " +
                    (active
                      ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--gold-soft)]"
                      : "border-[color:var(--gold)]/25 text-muted-foreground hover:border-[color:var(--gold)]/60 hover:text-foreground")
                  }
                >
                  {r}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            label="Needs a stocking"
            checked={needsStocking}
            onChange={setNeedsStocking}
            icon={<Stamp className="h-3.5 w-3.5" />}
          />
          <Toggle
            label="Needs a Christmas card"
            checked={needsCard}
            onChange={setNeedsCard}
            icon={<GiftIcon className="h-3.5 w-3.5" />}
          />
        </div>

      </form>
    </Modal>
  );
}

const inputCls =
  "w-full rounded-xl border border-[color:var(--gold)]/25 bg-black/20 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--gold)]/70";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
        {label}
        {required && <span className="text-[color:var(--burgundy)]"> *</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition " +
        (checked
          ? "border-[color:var(--gold)]/70 bg-[color:var(--gold)]/12 text-[color:var(--gold-soft)]"
          : "border-[color:var(--gold)]/20 bg-black/20 text-muted-foreground hover:border-[color:var(--gold)]/50")
      }
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={
          "grid h-5 w-9 place-items-start rounded-full p-0.5 transition " +
          (checked ? "bg-[color:var(--gold)]" : "bg-white/15")
        }
      >
        <span
          className={
            "h-4 w-4 rounded-full bg-white transition " + (checked ? "translate-x-4" : "translate-x-0")
          }
        />
      </span>
    </button>
  );
}

/* ---------------------- Quick add-a-gift ---------------------- */

function QuickGiftForm({
  people,
  lockedPersonId,
  initialMode,
  onClose,
  onSave,
}: {
  people: PersonExtras[];
  lockedPersonId?: string | null;
  initialMode: "idea" | "present";
  onClose: () => void;
  onSave: (fields: Partial<GiftRow>) => Promise<void> | void;
}) {
  const [personId, setPersonId] = useState<string>(lockedPersonId ?? people[0]?.id ?? "");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState<string>("");
  const [shop, setShop] = useState("");
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"idea" | "present">(initialMode);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!personId) {
      toast.error("Pick a person first");
      return;
    }
    if (!item.trim()) {
      toast.error("Give it a name ✨");
      return;
    }
    const person = people.find((p) => p.id === personId);
    setSaving(true);
    try {
      await onSave({
        recipient: person?.name ?? "",
        person_id: personId,
        item: item.trim(),
        shop: shop.trim() || null,
        url: url.trim() || null,
        price: price === "" ? null : Number(price),
        year: CURRENT_YEAR,
        status: mode === "idea" ? "idea" : "bought",
        is_idea: mode === "idea",
        is_chosen: mode === "present",
      } as Partial<GiftRow>);
      toast.success(mode === "idea" ? "Idea saved ✨" : "Present added ✨");
    } finally {
      setSaving(false);
    }
  };

  const lockedPerson = lockedPersonId ? people.find((p) => p.id === lockedPersonId) : null;

  return (
    <Modal
      onClose={onClose}
      title={mode === "idea" ? "Add a gift idea" : "Add a present"}
      eyebrow="Quick add"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] rounded-full border border-[color:var(--gold)]/25 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="quick-gift-form"
            disabled={saving}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-[color:var(--forest-deep)] transition hover:brightness-110 disabled:opacity-60"
            style={{ background: "var(--gradient-gold)" }}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </button>
        </div>
      }
    >
      <form id="quick-gift-form" onSubmit={submit} className="space-y-4">
        <Field label="Type">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("idea")}
              className={
                "min-h-[44px] rounded-xl border px-3 py-2 text-sm font-medium transition " +
                (mode === "idea"
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--gold-soft)]"
                  : "border-[color:var(--gold)]/25 text-muted-foreground hover:border-[color:var(--gold)]/60")
              }
            >
              <Lightbulb className="mr-1.5 inline h-4 w-4" /> Idea
            </button>
            <button
              type="button"
              onClick={() => setMode("present")}
              className={
                "min-h-[44px] rounded-xl border px-3 py-2 text-sm font-medium transition " +
                (mode === "present"
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--gold-soft)]"
                  : "border-[color:var(--gold)]/25 text-muted-foreground hover:border-[color:var(--gold)]/60")
              }
            >
              <Package className="mr-1.5 inline h-4 w-4" /> Present
            </button>
          </div>
        </Field>

        <Field label="For">
          {lockedPerson ? (
            <div className={inputCls + " flex items-center bg-black/30 text-[color:var(--gold-soft)]"}>
              {lockedPerson.name}
            </div>
          ) : (
            <select value={personId} onChange={(e) => setPersonId(e.target.value)} className={inputCls}>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name || "Unnamed"}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label={mode === "idea" ? "Idea" : "Present"} required>
          <input
            autoFocus
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder={mode === "idea" ? "A cosy scarf…" : "The exact thing you're buying"}
            className={inputCls}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Shop">
            <input
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              placeholder="Amazon, John Lewis…"
              className={inputCls}
            />
          </Field>
          <Field label={mode === "idea" ? "Estimated price" : "Price"}>
            <div className="flex items-center gap-1 rounded-xl border border-[color:var(--gold)]/25 bg-black/20 px-3">
              <PoundSterling className="h-3.5 w-3.5 text-[color:var(--gold-soft)]" />
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="20"
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
            </div>
          </Field>
        </div>
        <Field label="Product link (optional)">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className={inputCls}
          />
        </Field>
      </form>
    </Modal>
  );
}

/* ---------------------- Modal ---------------------- */

function Modal({
  children,
  onClose,
  title,
  eyebrow,
  wide,
  footer,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  wide?: boolean;
  footer?: React.ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          "flex h-full max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-[color:var(--gold)]/30 bg-gradient-to-b from-[color:var(--forest-deep)] to-[oklch(0.18_0.04_155)] sm:h-auto sm:max-h-[90dvh] sm:rounded-3xl " +
          (wide ? "sm:max-w-3xl" : "sm:max-w-xl")
        }
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[color:var(--gold)]/15 p-5">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">{eyebrow}</p>
            )}
            <h2 className="mt-0.5 truncate font-display text-2xl">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full border border-[color:var(--gold)]/25 p-2 text-muted-foreground transition hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
          {children}
        </div>
        {footer && (
          <div
            className="shrink-0 border-t border-[color:var(--gold)]/15 bg-[color:var(--forest-deep)]/90 px-5 py-3 backdrop-blur"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/* ---------------------- AI ideas panel ---------------------- */

function AiIdeasPanel({
  person,
  existingItems,
  onClose,
  onPick,
}: {
  person: PersonExtras;
  existingItems: string[];
  onClose: () => void;
  onPick: (idea: GiftIdea) => void;
}) {
  const [ideas, setIdeas] = useState<GiftIdea[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suggest = useServerFn(suggestGiftIdeas);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await suggest({
        data: {
          name: person.name,
          relationship: person.relationship,
          age: calcAge(person.date_of_birth),
          hobbies: person.hobbies,
          favouriteShops: person.favourite_shops,
          favouriteColours: person.favourite_colours,
          favouriteFilms: person.favourite_films,
          favouriteBooks: person.favourite_books,
          favouriteGames: person.favourite_games,
          favouriteCharacters: person.favourite_characters,
          clothingSize: person.clothing_size,
          shoeSize: person.shoe_size,
          wishlist: person.wishlist,
          notes:
            [person.notes, person.dislikes ? `Avoid: ${person.dislikes}` : null]
              .filter(Boolean)
              .join(" · ") || null,
          budget: person.gift_budget,
          avoid: existingItems,
        },
      });
      setIdeas(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title={`Ideas for ${person.name}`} eyebrow="Santa's helper">
      {!ideas && !loading && !error && (
        <div className="text-center">
          <Sparkles className="mx-auto h-8 w-8 text-[color:var(--gold)]" />
          <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
            Suggestions save into {person.name}'s Gift Ideas — nothing is marked bought.
          </p>
          <button
            onClick={run}
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--forest-deep)] transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Sparkles className="h-4 w-4" /> Sprinkle some ideas
          </button>
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Whispering to Santa…
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-[color:var(--burgundy)] bg-[color:var(--burgundy)]/10 p-3 text-sm text-[color:var(--burgundy)]">
          {error}
        </div>
      )}
      {ideas && (
        <ul className="space-y-3">
          {ideas.map((idea, i) => (
            <li key={i} className="rounded-2xl border border-[color:var(--gold)]/25 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base">{idea.item}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{idea.reason}</p>
                  {idea.estimatedPrice != null && (
                    <p className="mt-1 text-[11px] text-[color:var(--gold-soft)]">
                      ≈ £{idea.estimatedPrice}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onPick(idea)}
                  className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[color:var(--gold)]/40 px-3 py-1.5 text-xs text-[color:var(--gold-soft)] transition hover:bg-[color:var(--gold)]/12"
                >
                  <Plus className="h-3 w-3" /> Save as idea
                </button>
              </div>
            </li>
          ))}
          <li>
            <button
              onClick={run}
              disabled={loading}
              className="w-full rounded-full border border-dashed border-[color:var(--gold)]/30 py-2 text-xs text-muted-foreground transition hover:border-[color:var(--gold)]/60"
            >
              Get more ideas
            </button>
          </li>
        </ul>
      )}
    </Modal>
  );
}
