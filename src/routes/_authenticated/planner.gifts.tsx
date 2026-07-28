import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
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
  Package,
  ShoppingBag,
  CheckCircle2,
  Truck,
  MapPin,
  History,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/planner/gifts")({
  head: () => ({
    meta: [
      { title: "Step 1 · Who are you buying for? — A Complete Christmas" },
      {
        name: "description",
        content:
          "The gentle first step: add everyone on your Christmas list and plan their presents, budgets, cards and stockings — beautifully organised, all in one place.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BuyingForPage,
});

const CURRENT_YEAR = new Date().getFullYear();
const LAST_YEAR = CURRENT_YEAR - 1;

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
  shop: string | null;
  wrapped: boolean;
  ordered: boolean;
  arrived: boolean;
  hidden_location: string | null;
}

/* Extra fields we added to the people table via migration. */
type PersonExtras = Person & {
  age_range: string | null;
  dislikes: string | null;
  initial_ideas: string | null;
  needs_stocking: boolean;
  needs_card: boolean;
};

function BuyingForPage() {
  const { user } = useAuth();
  const { people, loading: peopleLoading, removePerson } = usePeople(user?.id);
  const {
    rows: gifts,
    loading: giftsLoading,
    addRow,
    removeRow,
    updateField,
    saving,
  } = usePlannerList<GiftRow>("gifts", user?.id);

  const [addOpen, setAddOpen] = useState(false);
  const [openPersonId, setOpenPersonId] = useState<string | null>(null);
  const [editPersonId, setEditPersonId] = useState<string | null>(null);

  const loading = peopleLoading || giftsLoading;

  const giftsByPerson = useMemo(() => {
    const map = new Map<string, GiftRow[]>();
    for (const g of gifts) {
      if (!g.person_id) continue;
      const arr = map.get(g.person_id) ?? [];
      arr.push(g);
      map.set(g.person_id, arr);
    }
    return map;
  }, [gifts]);

  const openPerson = openPersonId ? (people.find((p) => p.id === openPersonId) as PersonExtras | undefined) : null;
  const editPerson = editPersonId ? (people.find((p) => p.id === editPersonId) as PersonExtras | undefined) : null;

  return (
    <div className="rise-in space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl border border-[color:var(--gold)]/30 bg-gradient-to-br from-[color:var(--forest-deep)]/80 via-[oklch(0.22_0.05_155)]/70 to-[color:var(--burgundy)]/40 p-6 sm:p-8 shadow-[0_20px_60px_-20px_oklch(0.15_0.05_155_/_0.6)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
        <p className="relative text-[11px] uppercase tracking-[0.32em] text-[color:var(--gold-soft)]">
          Step 1 of your Christmas plan
        </p>
        <h1 className="relative mt-2 font-display text-3xl leading-tight sm:text-4xl">
          Who are you <span className="gold-text italic">buying for</span>?
        </h1>
        <p className="relative mt-3 max-w-2xl text-sm text-[color:var(--cream)]/85 sm:text-base">
          Start by adding everyone you may need to buy for. You can organise presents, budgets, cards and stocking
          fillers for each person — and we'll keep it all safe for next Christmas too.
        </p>

        <div className="relative mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--forest-deep)] shadow-[0_10px_30px_-10px_oklch(0.82_0.14_85_/_0.7)] transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Plus className="h-4 w-4" /> Add a person
          </button>
          {people.length > 0 && (
            <p className="text-xs text-[color:var(--cream)]/70">
              {people.length} {people.length === 1 ? "person" : "people"} on your list
            </p>
          )}
          <span className="ml-auto text-[11px] text-[color:var(--cream)]/60">
            {saving ? "Saving…" : "Everything's saved ✨"}
          </span>
        </div>
      </header>

      {/* Recipient grid */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading your list…</p>
      ) : people.length === 0 ? (
        <EmptyState onAdd={() => setAddOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {people.map((p) => (
            <RecipientCard
              key={p.id}
              person={p as PersonExtras}
              gifts={(giftsByPerson.get(p.id) ?? []).filter((g) => g.year === CURRENT_YEAR)}
              onOpen={() => setOpenPersonId(p.id)}
              onEdit={() => setEditPersonId(p.id)}
              onDelete={() => {
                if (confirm(`Remove ${p.name || "this person"} from your list? Their gifts stay in your history.`)) {
                  void removePerson(p.id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {addOpen && user && (
        <PersonForm
          title="Add a person to your Christmas list"
          submitLabel="Add to my list"
          userId={user.id}
          onClose={() => setAddOpen(false)}
          onSaved={() => setAddOpen(false)}
        />
      )}
      {editPerson && (
        <PersonForm
          title={`Edit ${editPerson.name || "person"}`}
          submitLabel="Save changes"
          userId={editPerson.user_id}
          initial={editPerson}
          onClose={() => setEditPersonId(null)}
          onSaved={() => setEditPersonId(null)}
        />
      )}
      {openPerson && (
        <PersonDrawer
          person={openPerson}
          allGifts={giftsByPerson.get(openPerson.id) ?? []}
          onClose={() => setOpenPersonId(null)}
          onEdit={() => {
            setEditPersonId(openPerson.id);
            setOpenPersonId(null);
          }}
          addRow={addRow}
          updateField={updateField}
          removeRow={removeRow}
        />
      )}
    </div>
  );
}

/* ---------------------- Empty state ---------------------- */

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
        Add your first person and we'll help you organise their presents, budget, card and stocking — one calm step at
        a time.
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

/* ---------------------- Recipient card ---------------------- */

function RecipientCard({
  person,
  gifts,
  onOpen,
  onEdit,
  onDelete,
}: {
  person: PersonExtras;
  gifts: GiftRow[];
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const age = calcAge(person.date_of_birth) ?? person.age_range;
  const budget = person.gift_budget != null ? Number(person.gift_budget) : null;
  const bought = gifts.filter((g) => g.status !== "idea" || g.ordered);
  const spent = bought.reduce((s, g) => s + (Number(g.price) || 0), 0);
  const remaining = budget != null ? Math.max(0, budget - spent) : null;
  const over = budget != null && spent > budget;

  const boughtCount = gifts.filter((g) => g.status === "bought" || g.status === "wrapped" || g.status === "given").length;
  const arrivedCount = gifts.filter((g) => g.arrived).length;
  const wrappedCount = gifts.filter((g) => g.wrapped || g.status === "wrapped" || g.status === "given").length;
  const total = gifts.length;

  const budgetPct = budget && budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-[color:var(--gold)]/25 bg-[color:var(--forest-deep)]/70 p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--gold)]/60 hover:shadow-[0_20px_50px_-20px_oklch(0.15_0.05_155_/_0.7)]"
    >
      <button onClick={onOpen} className="absolute inset-0" aria-label={`Open ${person.name}`} />

      <div className="relative flex items-start gap-3">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-display text-lg text-[color:var(--forest-deep)]"
          style={{ background: "var(--gradient-gold)" }}
        >
          {person.name?.[0]?.toUpperCase() || "?"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg leading-tight">{person.name || "Untitled"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {person.relationship || "Christmas list"}
            {age != null && age !== "" ? ` · ${age}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {person.needs_stocking && <Tag icon={<Stamp className="h-3 w-3" />} label="Stocking" />}
            {person.needs_card && <Tag icon={<GiftIcon className="h-3 w-3" />} label="Card" />}
          </div>
        </div>
        <div className="relative z-10 flex shrink-0 gap-1 opacity-70 transition group-hover:opacity-100">
          <IconBtn onClick={onEdit} label="Edit person">
            <Pencil className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={onDelete} label="Remove person" danger>
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>

      {/* Budget line */}
      <div className="relative mt-4">
        <div className="flex items-baseline justify-between text-[11px]">
          <span className="uppercase tracking-[0.22em] text-muted-foreground">Budget</span>
          <span className={over ? "text-[color:var(--burgundy)]" : "text-[color:var(--gold-soft)]"}>
            £{spent.toFixed(0)}
            {budget != null ? ` / £${budget.toFixed(0)}` : ""}
            {over ? " · over" : ""}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/25">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${budget ? budgetPct : 0}%`,
              background: over ? "var(--gradient-burgundy)" : "var(--gradient-gold)",
            }}
          />
        </div>
        {remaining != null && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {over ? "Over budget" : `£${remaining.toFixed(0)} still to spend`}
          </p>
        )}
      </div>

      {/* Progress chips */}
      <div className="relative mt-4 grid grid-cols-4 gap-2 text-center">
        <Stat label="Planned" value={total} icon={<GiftIcon className="h-3.5 w-3.5" />} />
        <Stat label="Bought" value={boughtCount} of={total} icon={<ShoppingBag className="h-3.5 w-3.5" />} />
        <Stat label="Arrived" value={arrivedCount} of={total} icon={<Truck className="h-3.5 w-3.5" />} />
        <Stat label="Wrapped" value={wrappedCount} of={total} icon={<Package className="h-3.5 w-3.5" />} />
      </div>
    </article>
  );
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--gold-soft)]">
      {icon}
      {label}
    </span>
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
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={
        "rounded-full border border-[color:var(--gold)]/30 bg-black/20 p-1.5 text-muted-foreground transition hover:text-foreground " +
        (danger ? "hover:border-[color:var(--burgundy)] hover:text-[color:var(--burgundy)]" : "hover:border-[color:var(--gold)]/70")
      }
    >
      {children}
    </button>
  );
}

function Stat({
  label,
  value,
  of,
  icon,
}: {
  label: string;
  value: number;
  of?: number;
  icon: React.ReactNode;
}) {
  const done = of != null && of > 0 && value >= of;
  return (
    <div
      className={
        "rounded-xl border p-2 text-[10px] uppercase tracking-[0.14em] transition " +
        (done
          ? "border-[color:var(--pine-bright)]/60 bg-[color:var(--pine-bright)]/10 text-[color:var(--pine-bright)]"
          : "border-[color:var(--gold)]/20 bg-black/20 text-muted-foreground")
      }
    >
      <span className="mx-auto mb-1 grid h-5 w-5 place-items-center">{icon}</span>
      <p className="font-display text-sm normal-case tracking-normal text-foreground">
        {value}
        {of != null ? <span className="text-muted-foreground">/{of}</span> : null}
      </p>
      <p>{label}</p>
    </div>
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
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [relationship, setRelationship] = useState(initial?.relationship ?? "");
  const [ageRange, setAgeRange] = useState(initial?.age_range ?? "");
  const [budget, setBudget] = useState<string>(initial?.gift_budget != null ? String(initial.gift_budget) : "");
  const [interests, setInterests] = useState(initial?.hobbies ?? "");
  const [dislikes, setDislikes] = useState(initial?.dislikes ?? "");
  const [initialIdeas, setInitialIdeas] = useState(initial?.initial_ideas ?? "");
  const [needsStocking, setNeedsStocking] = useState(initial?.needs_stocking ?? false);
  const [needsCard, setNeedsCard] = useState(initial?.needs_card ?? false);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    let error;
    if (initial) {
      ({ error } = await supabase.from("people").update(payload as never).eq("id", initial.id));
    } else {
      ({ error } = await supabase
        .from("people")
        .insert({ user_id: userId, ...payload } as never));
    }
    setSaving(false);
    if (error) {
      toast.error("Couldn't save — please try again");
      return;
    }
    toast.success(initial ? "Saved" : `${payload.name} added to your list ✨`);
    onSaved();
  };

  return (
    <Modal onClose={onClose} title={title} eyebrow="A person on your list">
      <form onSubmit={submit} className="space-y-4">
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
          <Field label="Relationship">
            <input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Sister, Nephew, Best friend…"
              className={inputCls}
            />
          </Field>
          <Field label="Age or age range">
            <input
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              placeholder="8, or 30s, or grown-up"
              className={inputCls}
            />
          </Field>
          <Field label="Overall gift budget">
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

        <Field label="Interests">
          <input
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Baking, hiking, mystery novels…"
            className={inputCls}
          />
        </Field>

        <Field label="Dislikes or things to avoid">
          <input
            value={dislikes}
            onChange={(e) => setDislikes(e.target.value)}
            placeholder="No perfume, allergic to nuts, doesn't drink…"
            className={inputCls}
          />
        </Field>

        <Field label="Initial gift ideas">
          <textarea
            value={initialIdeas}
            onChange={(e) => setInitialIdeas(e.target.value)}
            rows={3}
            placeholder="A cosy scarf, that recipe book she mentioned, tickets to the pantomime…"
            className={inputCls + " resize-none"}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Rough notes are fine — you can turn them into proper gifts later.
          </p>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Needs a stocking" checked={needsStocking} onChange={setNeedsStocking} icon={<Stamp className="h-3.5 w-3.5" />} />
          <Toggle label="Needs a Christmas card" checked={needsCard} onChange={setNeedsCard} icon={<GiftIcon className="h-3.5 w-3.5" />} />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[color:var(--gold)]/25 px-4 py-2 text-xs text-muted-foreground transition hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-[color:var(--forest-deep)] transition hover:brightness-110 disabled:opacity-60"
            style={{ background: "var(--gradient-gold)" }}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const inputCls =
  "w-full rounded-xl border border-[color:var(--gold)]/25 bg-black/20 px-3 py-2 text-sm outline-none transition focus:border-[color:var(--gold)]/70";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
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

/* ---------------------- Person drawer (detail view) ---------------------- */

function PersonDrawer({
  person,
  allGifts,
  onClose,
  onEdit,
  addRow,
  updateField,
  removeRow,
}: {
  person: PersonExtras;
  allGifts: GiftRow[];
  onClose: () => void;
  onEdit: () => void;
  addRow: (fields: Partial<GiftRow>) => Promise<void> | void;
  updateField: <K extends keyof GiftRow>(id: string, field: K, value: GiftRow[K]) => void;
  removeRow: (id: string) => void;
}) {
  const [aiOpen, setAiOpen] = useState(false);
  const thisYear = allGifts.filter((g) => g.year === CURRENT_YEAR);
  const previousYears = allGifts.filter((g) => g.year < CURRENT_YEAR);

  const addBlank = () =>
    addRow({
      recipient: person.name,
      person_id: person.id,
      item: "",
      status: "idea",
      year: CURRENT_YEAR,
    } as Partial<GiftRow>);

  return (
    <Modal onClose={onClose} title={person.name || "Person"} eyebrow={person.relationship || "Christmas list"} wide>
      <div className="flex flex-wrap items-center gap-2 pb-4">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5 text-xs text-[color:var(--gold-soft)] transition hover:bg-[color:var(--gold)]/10"
        >
          <Pencil className="h-3 w-3" /> Edit details
        </button>
        <button
          onClick={() => setAiOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--gold)]/40 px-3 py-1.5 text-xs text-[color:var(--gold-soft)] transition hover:bg-[color:var(--gold)]/12"
        >
          <Sparkles className="h-3 w-3" /> AI gift ideas
        </button>
        <Link
          to="/planner/people/$personId"
          params={{ personId: person.id }}
          onClick={onClose}
          className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[color:var(--gold-soft)]"
        >
          Full Christmas history <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Person summary */}
      <div className="grid gap-3 rounded-2xl border border-[color:var(--gold)]/20 bg-black/20 p-4 sm:grid-cols-2">
        <SummaryLine label="Age" value={calcAge(person.date_of_birth)?.toString() || person.age_range || "—"} />
        <SummaryLine label="Budget" value={person.gift_budget != null ? `£${Number(person.gift_budget).toFixed(0)}` : "—"} />
        <SummaryLine label="Interests" value={person.hobbies || "—"} />
        <SummaryLine label="Avoid" value={person.dislikes || "—"} />
        {person.initial_ideas && (
          <div className="sm:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Initial ideas</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{person.initial_ideas}</p>
          </div>
        )}
      </div>

      {/* Gifts this year */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">Gifts for {CURRENT_YEAR}</h3>
          <button
            onClick={addBlank}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-[color:var(--forest-deep)] transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Plus className="h-3.5 w-3.5" /> Add a gift
          </button>
        </div>

        {thisYear.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-[color:var(--gold)]/30 p-6 text-center text-sm text-muted-foreground">
            No gifts yet. Add your first idea, or ask Santa's helper for suggestions ✨
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {thisYear.map((g) => (
              <GiftEditor key={g.id} gift={g} onUpdate={updateField} onRemove={removeRow} />
            ))}
          </ul>
        )}
      </div>

      {/* Previous years */}
      {previousYears.length > 0 && (
        <div className="mt-6">
          <h3 className="flex items-center gap-2 font-display text-lg">
            <History className="h-4 w-4 text-[color:var(--gold-soft)]" /> Previous presents
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            So you never accidentally give the same thing twice.
          </p>
          <ul className="mt-3 space-y-2">
            {previousYears.map((g) => (
              <li
                key={g.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[color:var(--gold)]/15 bg-black/20 p-3 text-sm"
              >
                <div>
                  <p className="text-foreground">{g.item || "(untitled)"}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {g.year}
                    {g.shop ? ` · ${g.shop}` : ""}
                    {g.price != null ? ` · £${Number(g.price).toFixed(0)}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {aiOpen && (
        <AiIdeasPanel
          person={person}
          existingItems={allGifts.map((g) => g.item).filter(Boolean)}
          onClose={() => setAiOpen(false)}
          onPick={(idea) => {
            addRow({
              recipient: person.name,
              person_id: person.id,
              item: idea.item,
              status: "idea",
              year: CURRENT_YEAR,
              price: idea.estimatedPrice ?? null,
              notes: idea.reason ?? null,
            } as Partial<GiftRow>);
            toast.success(`Added "${idea.item}" to ${person.name}'s list`);
          }}
        />
      )}
    </Modal>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  );
}

/* ---------------------- Gift editor row ---------------------- */

function GiftEditor({
  gift,
  onUpdate,
  onRemove,
}: {
  gift: GiftRow;
  onUpdate: <K extends keyof GiftRow>(id: string, field: K, value: GiftRow[K]) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="rounded-2xl border border-[color:var(--gold)]/20 bg-[color:var(--forest-deep)]/60 p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={gift.item ?? ""}
          onChange={(e) => onUpdate(gift.id, "item", e.target.value)}
          placeholder="Gift idea"
          className="w-full rounded-xl border border-[color:var(--gold)]/25 bg-black/25 px-3 py-2 text-sm font-medium outline-none focus:border-[color:var(--gold)]/70"
        />
        <button
          onClick={() => onRemove(gift.id)}
          className="justify-self-end rounded-full border border-[color:var(--gold)]/25 p-2 text-muted-foreground transition hover:border-[color:var(--burgundy)] hover:text-[color:var(--burgundy)]"
          aria-label="Delete gift"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input
          value={gift.shop ?? ""}
          onChange={(e) => onUpdate(gift.id, "shop", e.target.value || null)}
          placeholder="Shop or website"
          className={inputCls}
        />
        <input
          value={gift.url ?? ""}
          onChange={(e) => onUpdate(gift.id, "url", e.target.value || null)}
          placeholder="Link (optional)"
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
            placeholder="Price"
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <StatusChip
          active={gift.status === "bought" || gift.status === "wrapped" || gift.status === "given"}
          onClick={() =>
            onUpdate(
              gift.id,
              "status",
              gift.status === "idea" ? "bought" : gift.status === "bought" ? "idea" : gift.status,
            )
          }
          icon={<ShoppingBag className="h-3.5 w-3.5" />}
          label="Bought"
        />
        <StatusChip
          active={gift.ordered}
          onClick={() => onUpdate(gift.id, "ordered", !gift.ordered)}
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Ordered"
        />
        <StatusChip
          active={gift.arrived}
          onClick={() => onUpdate(gift.id, "arrived", !gift.arrived)}
          icon={<Truck className="h-3.5 w-3.5" />}
          label="Arrived"
        />
        <StatusChip
          active={gift.wrapped}
          onClick={() => {
            const next = !gift.wrapped;
            onUpdate(gift.id, "wrapped", next);
            if (next && gift.status === "bought") onUpdate(gift.id, "status", "wrapped");
          }}
          icon={<Package className="h-3.5 w-3.5" />}
          label="Wrapped"
        />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-1 rounded-xl border border-[color:var(--gold)]/25 bg-black/20 px-3">
          <MapPin className="h-3.5 w-3.5 text-[color:var(--gold-soft)]" />
          <input
            value={gift.hidden_location ?? ""}
            onChange={(e) => onUpdate(gift.id, "hidden_location", e.target.value || null)}
            placeholder="Hidden or stored where?"
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
        </div>
        <input
          value={gift.notes ?? ""}
          onChange={(e) => onUpdate(gift.id, "notes", e.target.value || null)}
          placeholder="Notes"
          className={inputCls}
        />
      </div>
    </li>
  );
}

function StatusChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition " +
        (active
          ? "border-[color:var(--pine-bright)]/70 bg-[color:var(--pine-bright)]/15 text-[color:var(--pine-bright)]"
          : "border-[color:var(--gold)]/25 text-muted-foreground hover:border-[color:var(--gold)]/60")
      }
    >
      {icon}
      {label}
    </button>
  );
}

/* ---------------------- Reusable modal ---------------------- */

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
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          "flex h-[100dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-[color:var(--gold)]/30 bg-gradient-to-b from-[color:var(--forest-deep)] to-[oklch(0.18_0.04_155)] sm:h-auto sm:max-h-[92dvh] sm:rounded-3xl " +
          (wide ? "sm:max-w-3xl" : "sm:max-w-xl")
        }
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[color:var(--gold)]/15 p-5">
          <div>
            {eyebrow && (
              <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">{eyebrow}</p>
            )}
            <h2 className="mt-0.5 font-display text-2xl">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-[color:var(--gold)]/25 p-2 text-muted-foreground transition hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">{children}</div>
        {footer && (
          <div
            className="shrink-0 border-t border-[color:var(--gold)]/15 bg-[color:var(--forest-deep)]/90 px-5 py-3 backdrop-blur"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
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
          notes: [person.notes, person.dislikes ? `Avoid: ${person.dislikes}` : null].filter(Boolean).join(" · ") || null,
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
            We'll suggest thoughtful gifts based on {person.name}'s profile, budget and previous years.
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
            <li
              key={i}
              className="rounded-2xl border border-[color:var(--gold)]/25 bg-black/20 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base">{idea.item}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{idea.reason}</p>
                  {idea.estimatedPrice != null && (
                    <p className="mt-1 text-[11px] text-[color:var(--gold-soft)]">≈ £{idea.estimatedPrice}</p>
                  )}
                </div>
                <button
                  onClick={() => onPick(idea)}
                  className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[color:var(--gold)]/40 px-3 py-1.5 text-xs text-[color:var(--gold-soft)] transition hover:bg-[color:var(--gold)]/12"
                >
                  <Plus className="h-3 w-3" /> Add
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
