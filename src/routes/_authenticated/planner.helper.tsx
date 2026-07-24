import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePeople, calcAge, type Person } from "@/hooks/use-people";
import { usePersonGifts } from "@/hooks/use-person-gifts";
import { suggestGiftIdeas, type GiftIdea } from "@/lib/gift-ideas.functions";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Wand2, ArrowRight, Check, Loader2, Gift as GiftIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/planner/helper")({
  head: () => ({
    meta: [
      { title: "AI Christmas Helper — A Complete Christmas" },
      { name: "description", content: "Let our AI Christmas helper dream up thoughtful gift ideas for your favourite humans." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HelperPage,
});

function HelperPage() {
  const { user } = useAuth();
  const { people, loading } = usePeople(user?.id);
  const [selectedId, setSelectedId] = useState<string>("");
  const [extraBrief, setExtraBrief] = useState("");
  const [budget, setBudget] = useState<string>("");
  const [ideas, setIdeas] = useState<GiftIdea[]>([]);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<Record<number, boolean>>({});

  const suggest = useServerFn(suggestGiftIdeas);
  const person: Person | undefined = people.find((p) => p.id === selectedId);
  const { addGift } = usePersonGifts(selectedId || undefined, user?.id);

  async function handleGenerate() {
    if (!person && !extraBrief.trim()) {
      toast.error("Pick someone or tell Santa a little about them");
      return;
    }
    setBusy(true);
    setIdeas([]);
    setAdded({});
    try {
      const b = budget ? Number(budget) : person?.gift_budget ?? null;
      const result = await suggest({
        data: {
          name: person?.name ?? "Someone lovely",
          relationship: person?.relationship ?? null,
          age: calcAge(person?.date_of_birth),
          hobbies: person?.hobbies ?? null,
          favouriteShops: person?.favourite_shops ?? null,
          favouriteColours: person?.favourite_colours ?? null,
          favouriteFilms: person?.favourite_films ?? null,
          favouriteBooks: person?.favourite_books ?? null,
          favouriteGames: person?.favourite_games ?? null,
          favouriteCharacters: person?.favourite_characters ?? null,
          clothingSize: person?.clothing_size ?? null,
          shoeSize: person?.shoe_size ?? null,
          wishlist: person?.wishlist ?? null,
          notes: [person?.notes, extraBrief].filter(Boolean).join("\n") || null,
          budget: b,
        },
      });
      setIdeas(result);
      if (!result.length) toast.error("Santa drew a blank — try adding a bit more detail.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wonky — try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAdd(i: number, idea: GiftIdea) {
    if (!selectedId) {
      toast.error("Pick a person first so we know where to save it.");
      return;
    }
    await addGift({
      item: idea.item,
      price: idea.estimatedPrice ?? null,
      notes: idea.reason,
      status: "idea",
    });
    setAdded((s) => ({ ...s, [i]: true }));
    toast.success("Popped into their list ✨");
  }

  return (
    <div className="rise-in space-y-8">
      <section className="rounded-3xl border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">🪄 AI Christmas helper</p>
        <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
          Stuck for ideas? <span className="gold-text">Let's dream some up.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pick a person and Santa's little helper will sprinkle six thoughtful gift ideas — using everything you've saved about them.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">Who's it for?</label>
            {loading ? (
              <p className="mt-2 text-sm text-muted-foreground">Loading your humans…</p>
            ) : people.length === 0 ? (
              <div className="mt-2 rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] p-4 text-sm">
                <p>No one on your list yet.</p>
                <Link to="/planner/people" className="mt-2 inline-flex items-center gap-1.5 text-[color:var(--gold-soft)] hover:text-[color:var(--gold)]">
                  Add someone <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2.5 text-sm outline-none focus:border-[color:var(--gold)]"
              >
                <option value="">— Pick a person —</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.relationship ? ` · ${p.relationship}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">Budget (£, optional)</label>
            <input
              type="number"
              min={0}
              placeholder={person?.gift_budget ? String(person.gift_budget) : "e.g. 25"}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2.5 text-sm outline-none focus:border-[color:var(--gold)]"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">Anything else Santa should know? (optional)</label>
          <textarea
            value={extraBrief}
            onChange={(e) => setExtraBrief(e.target.value)}
            rows={3}
            placeholder="e.g. Just got into pottery, loves cosy nights in, avoid anything scented."
            className="mt-2 w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2.5 text-sm outline-none focus:border-[color:var(--gold)]"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110 disabled:opacity-60"
            style={{ background: "var(--gradient-gold)" }}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {busy ? "Dreaming up ideas…" : "Sprinkle some ideas"}
          </button>
          {person && (
            <Link to="/planner/people/$personId" params={{ personId: person.id }} className="text-xs text-muted-foreground hover:text-[color:var(--gold-soft)]">
              Peek at {person.name}'s profile →
            </Link>
          )}
        </div>
      </section>

      {ideas.length > 0 && (
        <section>
          <h2 className="font-display text-2xl sm:text-3xl">
            A little sprinkle of <span className="gold-text">ideas</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the star to pop one straight onto {person?.name ?? "their"} list.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {ideas.map((idea, i) => (
              <li
                key={i}
                className="relative overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] p-5"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-2xl"
                  style={{ background: "var(--gradient-gold)" }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg leading-snug">{idea.item}</p>
                      {idea.estimatedPrice != null && (
                        <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
                          ~£{Number(idea.estimatedPrice).toFixed(0)}
                        </p>
                      )}
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.13_0.03_245_/_0.6)]">
                      <GiftIcon className="h-4 w-4 text-[color:var(--gold)]" />
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{idea.reason}</p>
                  <button
                    onClick={() => handleAdd(i, idea)}
                    disabled={!selectedId || added[i]}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.5)] px-3.5 py-1.5 text-xs font-medium text-[color:var(--gold-soft)] transition hover:bg-[oklch(0.80_0.14_85_/_0.12)] disabled:opacity-60"
                  >
                    {added[i] ? <><Check className="h-3 w-3" /> On the list</> : <><Sparkles className="h-3 w-3" /> Add to their list</>}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
