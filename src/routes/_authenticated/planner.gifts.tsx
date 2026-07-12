import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
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
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  History,
  PoundSterling,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/planner/gifts")({
  component: BuyingForPage,
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
const LAST_YEAR = CURRENT_YEAR - 1;

function BuyingForPage() {
  const { user } = useAuth();
  const { people, loading: peopleLoading } = usePeople(user?.id);
  const { rows: gifts, loading: giftsLoading, addRow, removeRow, updateField, saving } = usePlannerList<GiftRow>("gifts", user?.id);

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

  const orphanGifts = useMemo(() => gifts.filter((g) => !g.person_id), [gifts]);

  return (
    <div className="rise-in space-y-8">
      <header className="rounded-3xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">Let's begin</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">
          Who are you <span className="gold-text">buying for</span> this year?
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Everyone you love, all on one page. Set a little budget, jot down ideas (or let Santa's helper suggest some),
          peek at what you gave last year, and tick things off as you wrap them up.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/planner/people"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Plus className="h-4 w-4" /> Add someone
          </Link>
          <span className="ml-auto self-center text-xs text-muted-foreground">{saving ? "Saving…" : "All saved"}</span>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading your list…</p>
      ) : people.length === 0 ? (
        <EmptyPeople />
      ) : (
        <div className="space-y-4">
          {people.map((person) => (
            <PersonBuyingRow
              key={person.id}
              person={person}
              thisYear={(giftsByPerson.get(person.id) ?? []).filter((g) => g.year === CURRENT_YEAR)}
              lastYear={(giftsByPerson.get(person.id) ?? []).filter((g) => g.year === LAST_YEAR)}
              onAddIdea={(item) =>
                addRow({
                  recipient: person.name,
                  person_id: person.id,
                  item,
                  status: "idea",
                  year: CURRENT_YEAR,
                } as Partial<GiftRow>)
              }
              onUpdateGift={updateField}
              onRemoveGift={removeRow}
            />
          ))}
        </div>
      )}

      {orphanGifts.length > 0 && (
        <section className="rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.4)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Gifts without a person</p>
          <ul className="mt-3 space-y-2">
            {orphanGifts.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="text-muted-foreground">{g.recipient || "—"}:</span> {g.item || "(untitled)"}
                </span>
                <button onClick={() => removeRow(g.id)} className="text-muted-foreground hover:text-[color:var(--cranberry)]">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function EmptyPeople() {
  return (
    <div className="rounded-3xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.4)] p-10 text-center">
      <Users className="mx-auto h-8 w-8 text-[color:var(--gold)]" />
      <h3 className="mt-4 font-display text-2xl">Start with the people you love</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Add each person you're buying for and their Christmas list will build itself — budget, ideas, memories, all in one place.
      </p>
      <Link
        to="/planner/people"
        className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
        style={{ background: "var(--gradient-gold)" }}
      >
        <Plus className="h-4 w-4" /> Add your first person
      </Link>
    </div>
  );
}

function PersonBuyingRow({
  person,
  thisYear,
  lastYear,
  onAddIdea,
  onUpdateGift,
  onRemoveGift,
}: {
  person: Person;
  thisYear: GiftRow[];
  lastYear: GiftRow[];
  onAddIdea: (item: string) => void;
  onUpdateGift: <K extends keyof GiftRow>(id: string, field: K, value: GiftRow[K]) => void;
  onRemoveGift: (id: string) => void;
}) {
  const [budget, setBudget] = useState<string>(person.gift_budget != null ? String(person.gift_budget) : "");
  const [ideaText, setIdeaText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const age = calcAge(person.date_of_birth);

  const bought = thisYear.filter((g) => g.status !== "idea");
  const wrappedCount = thisYear.filter((g) => g.status === "wrapped" || g.status === "given").length;
  const allWrapped = bought.length > 0 && wrappedCount === bought.length;
  const spent = bought.reduce((s, g) => s + (Number(g.price) || 0), 0);

  const saveBudget = async (value: string) => {
    setBudget(value);
    const num = value === "" ? null : Number(value);
    if (value !== "" && Number.isNaN(num as number)) return;
    const { error } = await supabase.from("people").update({ gift_budget: num }).eq("id", person.id);
    if (error) toast.error("Couldn't save budget");
  };

  const submitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;
    onAddIdea(ideaText.trim());
    setIdeaText("");
  };

  const toggleAllWrapped = () => {
    const target: GiftStatus = allWrapped ? "bought" : "wrapped";
    bought.forEach((g) => onUpdateGift(g.id, "status", target));
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.65)] transition hover:border-[oklch(0.80_0.14_85_/_0.4)]">
      {/* Top summary row */}
      <div className="grid gap-4 p-5 md:grid-cols-[1.2fr_0.9fr_1.6fr_1fr_auto] md:items-center">
        {/* Person */}
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] font-display text-lg gold-text">
            {person.name?.[0]?.toUpperCase() || "?"}
          </span>
          <div>
            <p className="font-display text-lg leading-tight">{person.name || "Untitled"}</p>
            <p className="text-xs text-muted-foreground">
              {person.relationship || "—"}
              {age != null ? ` · ${age}` : ""}
            </p>
          </div>
        </div>

        {/* Budget */}
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Budget</span>
          <div className="mt-1 flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] px-3 py-1.5">
            <PoundSterling className="h-3.5 w-3.5 text-[color:var(--gold-soft)]" />
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={budget}
              onChange={(e) => saveBudget(e.target.value)}
              placeholder="—"
              className="w-full bg-transparent text-sm outline-none"
            />
            {person.gift_budget != null && spent > 0 && (
              <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                £{spent.toFixed(0)} spent
              </span>
            )}
          </div>
        </label>

        {/* Ideas summary */}
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Ideas & gifts this year</span>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {thisYear.length === 0 ? (
              <span className="text-xs text-muted-foreground">Nothing yet — start below</span>
            ) : (
              thisYear.slice(0, 3).map((g) => (
                <span
                  key={g.id}
                  className={
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs " +
                    (g.status === "idea"
                      ? "border-[oklch(0.80_0.14_85_/_0.25)] text-muted-foreground"
                      : "border-[color:var(--pine)] text-[color:var(--pine)]")
                  }
                >
                  {g.status !== "idea" && <Check className="h-3 w-3" />}
                  <span className="max-w-[10rem] truncate">{g.item || "(untitled)"}</span>
                </span>
              ))
            )}
            {thisYear.length > 3 && (
              <span className="text-[11px] text-muted-foreground">+{thisYear.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Wrapped state */}
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Wrapped</span>
          <button
            onClick={toggleAllWrapped}
            disabled={bought.length === 0}
            className={
              "mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition disabled:opacity-40 " +
              (allWrapped
                ? "border-[color:var(--pine)] bg-[oklch(0.55_0.14_150_/_0.15)] text-[color:var(--pine)]"
                : "border-[oklch(0.80_0.14_85_/_0.3)] text-muted-foreground hover:border-[oklch(0.80_0.14_85_/_0.6)]")
            }
            title={bought.length === 0 ? "Nothing bought yet" : allWrapped ? "Mark as un-wrapped" : "Mark all as wrapped"}
          >
            {allWrapped ? <Check className="h-3.5 w-3.5" /> : <GiftIcon className="h-3.5 w-3.5" />}
            {bought.length === 0 ? "—" : `${wrappedCount}/${bought.length}`}
          </button>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="justify-self-end rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] p-2 text-muted-foreground transition hover:border-[oklch(0.80_0.14_85_/_0.6)] hover:text-foreground"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.13_0.03_245_/_0.4)] p-5">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Ideas + this year gifts */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-display text-base">Ideas & gifts this year</h4>
                <button
                  onClick={() => setAiOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] px-3 py-1.5 text-xs text-[color:var(--gold-soft)] transition hover:bg-[oklch(0.80_0.14_85_/_0.12)]"
                >
                  <Sparkles className="h-3.5 w-3.5" /> AI ideas
                </button>
              </div>

              <form onSubmit={submitIdea} className="mt-3 flex gap-2">
                <input
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Add an idea or gift…"
                  className="flex-1 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] px-4 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
                />
                <button
                  type="submit"
                  disabled={!ideaText.trim()}
                  className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110 disabled:opacity-50"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </form>

              <ul className="mt-4 space-y-2">
                {thisYear.length === 0 ? (
                  <li className="text-xs text-muted-foreground">Nothing yet. Add an idea above or ask Santa's helper ✨</li>
                ) : (
                  thisYear.map((g) => (
                    <li
                      key={g.id}
                      className="flex items-center gap-2 rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.6)] p-2.5"
                    >
                      <select
                        value={g.status}
                        onChange={(e) => onUpdateGift(g.id, "status", e.target.value as GiftStatus)}
                        className="rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] px-2 py-1 text-[11px]"
                      >
                        <option value="idea">Idea</option>
                        <option value="bought">Bought</option>
                        <option value="wrapped">Wrapped</option>
                        <option value="given">Given</option>
                      </select>
                      <input
                        value={g.item ?? ""}
                        onChange={(e) => onUpdateGift(g.id, "item", e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="£"
                        value={g.price ?? ""}
                        onChange={(e) => onUpdateGift(g.id, "price", e.target.value === "" ? null : Number(e.target.value))}
                        className="w-16 rounded-md border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.13_0.03_245_/_0.5)] px-2 py-1 text-xs outline-none"
                      />
                      <button
                        onClick={() => onRemoveGift(g.id)}
                        className="text-muted-foreground transition hover:text-[color:var(--cranberry)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Last year */}
            <div>
              <h4 className="flex items-center gap-2 font-display text-base">
                <History className="h-4 w-4 text-[color:var(--gold-soft)]" />
                Last year ({LAST_YEAR})
              </h4>
              {lastYear.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  No memory saved for last Christmas yet. Add one from{" "}
                  <Link to="/planner/people/$personId" params={{ personId: person.id }} className="text-[color:var(--gold-soft)] underline">
                    {person.name}'s profile
                  </Link>
                  .
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {lastYear.map((g) => (
                    <li
                      key={g.id}
                      className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.5)] p-2.5 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{g.item || "(untitled)"}</span>
                        {g.price != null && (
                          <span className="text-xs text-muted-foreground">£{Number(g.price).toFixed(0)}</span>
                        )}
                      </div>
                      {g.notes && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{g.notes}</p>}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to="/planner/people/$personId"
                params={{ personId: person.id }}
                className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[color:var(--gold-soft)]"
              >
                Open {person.name}'s Christmas history →
              </Link>
            </div>
          </div>
        </div>
      )}

      {aiOpen && (
        <AiIdeasPanel
          person={person}
          existingItems={[...thisYear, ...lastYear].map((g) => g.item).filter(Boolean)}
          onClose={() => setAiOpen(false)}
          onPick={(idea) => {
            onAddIdea(idea.item);
            toast.success(`Added "${idea.item}" to ${person.name}'s ideas`);
          }}
        />
      )}
    </article>
  );
}

function AiIdeasPanel({
  person,
  existingItems,
  onClose,
  onPick,
}: {
  person: Person;
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
          notes: person.notes,
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.20_0.04_245)]">
        <div className="flex items-center justify-between border-b border-[oklch(0.80_0.14_85_/_0.15)] p-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">Santa's helper</p>
            <h3 className="font-display text-xl">Ideas for {person.name}</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {!ideas && !loading && !error && (
            <div className="text-center">
              <Sparkles className="mx-auto h-8 w-8 text-[color:var(--gold)]" />
              <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
                We'll suggest gift ideas based on {person.name}'s profile, budget and last year's gifts.
              </p>
              <button
                onClick={run}
                className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
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
            <div className="rounded-xl border border-[color:var(--cranberry)] bg-[oklch(0.55_0.15_25_/_0.15)] p-3 text-sm text-[color:var(--cranberry)]">
              {error}
            </div>
          )}
          {ideas && (
            <ul className="space-y-3">
              {ideas.map((idea, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.7)] p-4"
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
                      className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] px-3 py-1.5 text-xs text-[color:var(--gold-soft)] transition hover:bg-[oklch(0.80_0.14_85_/_0.12)]"
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
                  className="w-full rounded-full border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] py-2 text-xs text-muted-foreground transition hover:border-[oklch(0.80_0.14_85_/_0.6)]"
                >
                  Get more ideas
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
