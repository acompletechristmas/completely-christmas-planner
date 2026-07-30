import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePerson, calcAge, usePeople } from "@/hooks/use-people";
import { usePersonGifts, type Gift } from "@/hooks/use-person-gifts";
import { SectionShell } from "@/components/planner/SectionShell";
import { ProfileField, ProfileArea } from "@/components/planner/ProfileFields";
import { GiftCard } from "@/components/planner/GiftCard";
import { IdeaRow } from "@/components/planner/IdeaRow";
import { BudgetSummary } from "@/components/planner/BudgetSummary";
import { ArrowLeft, Plus, Sparkles, Stethoscope, Mail, Wand2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/people/$personId")({
  component: PersonDetail,
});

const YEAR = new Date().getFullYear();

function PersonDetail() {
  const { personId } = Route.useParams();
  const { user } = useAuth();
  const { person, loading, updateField } = usePerson(personId, user?.id);
  const { removePerson } = usePeople(user?.id);
  const {
    gifts,
    loading: giftsLoading,
    addGift,
    updateField: updateGift,
    removeGift,
    convertToPresent,
    ideas,
    presents,
    stockingItems,
    cardItems,
  } = usePersonGifts(personId, user?.id);

  const spent = useMemo(
    () => presents.reduce((s, g) => s + (Number(g.price) || 0), 0),
    [presents],
  );

  const memories = useMemo(() => {
    const map = new Map<number, Gift[]>();
    for (const g of gifts) {
      if (g.year === YEAR) continue;
      const arr = map.get(g.year) ?? [];
      arr.push(g);
      map.set(g.year, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [gifts]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!person) return <p className="text-sm text-muted-foreground">Profile not found.</p>;

  const age = calcAge(person.date_of_birth);

  async function add(partial: Partial<Gift>) {
    await addGift({ year: YEAR, recipient: person!.name, status: "idea", ...partial });
  }

  return (
    <div className="rise-in space-y-8">
      <Link
        to="/planner/people"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-[color:var(--gold-soft)]"
      >
        <ArrowLeft className="h-3 w-3" /> All people
      </Link>

      <JustAddedNote personId={person.id} />

      {/* 1 — Person header */}
      <section className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.6)] p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] font-display text-2xl gold-text">
            {person.name?.[0]?.toUpperCase() || "?"}
          </span>
          <div className="min-w-[12rem] flex-1">
            <input
              value={person.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full bg-transparent font-display text-3xl outline-none"
              placeholder="Name"
            />
            <p className="text-xs text-muted-foreground">
              {person.relationship || "Add relationship"}
              {age != null ? ` · ${age} years old` : ""}
            </p>
            <p className="mt-1 text-xs text-[color:var(--gold-soft)]">
              {person.gift_budget == null
                ? `£${spent.toFixed(2)} spent · no budget set`
                : `£${spent.toFixed(2)} of £${Number(person.gift_budget).toFixed(2)} spent`}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => add({ is_idea: true })}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Plus className="h-4 w-4" /> Add idea
          </button>
          <button
            onClick={() => add({ is_idea: false })}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] px-4 py-2 text-sm text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
          >
            <Plus className="h-4 w-4" /> Add present
          </button>
          <button
            onClick={async () => {
              if (confirm(`Remove ${person.name || "this person"}? Their gifts stay in your history.`)) {
                await removePerson(person.id);
                window.history.back();
              }
            }}
            className="min-h-11 rounded-full border border-[oklch(0.80_0.14_85_/_0.2)] px-4 py-2 text-xs text-muted-foreground hover:border-[color:var(--ember)] hover:text-[color:var(--ember)]"
          >
            Remove
          </button>
        </div>
      </section>

      {/* 2 — Gift ideas */}
      <SectionShell
        eyebrow="Brainstorm"
        title="Gift ideas"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled
              title="Coming soon"
              className="inline-flex min-h-11 cursor-not-allowed items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.2)] px-3 py-1.5 text-xs text-muted-foreground opacity-50"
            >
              <Wand2 className="h-3.5 w-3.5" /> Suggest ideas · soon
            </button>
            <button
              onClick={() => add({ is_idea: true })}
              className="min-h-11 rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] px-3 py-1.5 text-xs text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
            >
              + Add idea
            </button>
          </div>
        }
      >
        {giftsLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : ideas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No ideas yet. Jot anything down — nothing here counts as a present until you say so.
          </p>
        ) : (
          <ul className="space-y-3">
            {ideas.map((g) => (
              <IdeaRow
                key={g.id}
                gift={g}
                onChange={(f, v) => updateGift(g.id, f, v)}
                onConvert={() => convertToPresent(g.id)}
                onRemove={() => removeGift(g.id)}
              />
            ))}
          </ul>
        )}
        <div className="mt-4">
          <ProfileArea
            label="Brainstorm notes"
            value={person.initial_ideas ?? ""}
            onChange={(v) => updateField("initial_ideas", v || null)}
          />
        </div>
      </SectionShell>

      {/* 3 — Presents */}
      <SectionShell
        eyebrow={`Christmas ${YEAR}`}
        title="Presents"
        action={
          <button
            onClick={() => add({ is_idea: false })}
            className="min-h-11 rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] px-3 py-1.5 text-xs text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
          >
            + Add present
          </button>
        }
      >
        {giftsLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : presents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing planned yet. Turn an idea into a present, or add one directly.
          </p>
        ) : (
          <ul className="space-y-3">
            {presents.map((g) => (
              <GiftCard
                key={g.id}
                gift={g}
                history={gifts.filter((x) => x.id !== g.id)}
                userId={user?.id ?? ""}
                onChange={(f, v) => updateGift(g.id, f, v)}
                onRemove={() => removeGift(g.id)}
              />
            ))}
          </ul>
        )}
      </SectionShell>

      {/* 4 — Budget */}
      <SectionShell eyebrow="Money" title="Budget">
        <BudgetSummary budget={person.gift_budget} spent={spent} count={presents.length} />
        <div className="mt-4 max-w-xs">
          <ProfileField
            label="Gift budget (£)"
            type="number"
            value={person.gift_budget == null ? "" : String(person.gift_budget)}
            onChange={(v) => updateField("gift_budget", v === "" ? null : Number(v))}
          />
        </div>
      </SectionShell>

      {/* 5 — Notes */}
      <SectionShell eyebrow="Remember" title="Notes">
        <ProfileArea label="General notes" value={person.notes ?? ""} onChange={(v) => updateField("notes", v || null)} />
      </SectionShell>

      {/* 6 — Interests & details */}
      <SectionShell eyebrow="Know them better" title="Interests &amp; details">
        <details className="group">
          <summary className="cursor-pointer list-none text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
            Show all details
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ProfileField label="Relationship" value={person.relationship ?? ""} onChange={(v) => updateField("relationship", v || null)} />
            <ProfileField label="Age or age range" value={person.age_range ?? ""} onChange={(v) => updateField("age_range", v || null)} />
            <ProfileField label="Date of birth" value={person.date_of_birth ?? ""} onChange={(v) => updateField("date_of_birth", v || null)} type="date" />
            <ProfileField label="Clothing size" value={person.clothing_size ?? ""} onChange={(v) => updateField("clothing_size", v || null)} />
            <ProfileField label="Shoe size" value={person.shoe_size ?? ""} onChange={(v) => updateField("shoe_size", v || null)} />
            <ProfileField label="Favourite colours" value={person.favourite_colours ?? ""} onChange={(v) => updateField("favourite_colours", v || null)} />
            <ProfileField label="Favourite shops" value={person.favourite_shops ?? ""} onChange={(v) => updateField("favourite_shops", v || null)} />
            <ProfileField label="Hobbies & interests" value={person.hobbies ?? ""} onChange={(v) => updateField("hobbies", v || null)} />
            <ProfileField label="Favourite films" value={person.favourite_films ?? ""} onChange={(v) => updateField("favourite_films", v || null)} />
            <ProfileField label="Favourite books" value={person.favourite_books ?? ""} onChange={(v) => updateField("favourite_books", v || null)} />
            <ProfileField label="Favourite games" value={person.favourite_games ?? ""} onChange={(v) => updateField("favourite_games", v || null)} />
            <ProfileField label="Favourite characters" value={person.favourite_characters ?? ""} onChange={(v) => updateField("favourite_characters", v || null)} />
          </div>
          <div className="mt-3">
            <ProfileArea label="Wishlist" value={person.wishlist ?? ""} onChange={(v) => updateField("wishlist", v || null)} />
          </div>
        </details>
      </SectionShell>

      {/* 7 — Things to avoid */}
      <SectionShell eyebrow="Careful" title="Things to avoid">
        <ProfileArea
          label="Things to avoid"
          value={person.dislikes ?? ""}
          onChange={(v) => updateField("dislikes", v || null)}
        />
      </SectionShell>

      {/* 8 — Stocking */}
      {person.needs_stocking ? (
        <SectionShell
          eyebrow="Little extras"
          title="Stocking"
          action={
            <button
              onClick={() => add({ is_idea: false, category: "stocking" })}
              className="min-h-11 rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] px-3 py-1.5 text-xs text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
            >
              + Add stocking filler
            </button>
          }
        >
          {stockingItems.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Stethoscope className="h-4 w-4" /> No stocking fillers yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {stockingItems.map((g) => (
                <GiftCard
                  key={g.id}
                  gift={g}
                  history={[]}
                  userId={user?.id ?? ""}
                  onChange={(f, v) => updateGift(g.id, f, v)}
                  onRemove={() => removeGift(g.id)}
                />
              ))}
            </ul>
          )}
        </SectionShell>
      ) : null}

      {/* 9 — Christmas cards */}
      {person.needs_card ? (
        <SectionShell
          eyebrow="Post"
          title="Christmas cards"
          action={
            <button
              onClick={() => add({ is_idea: false, category: "card", item: "Christmas card" })}
              className="min-h-11 rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] px-3 py-1.5 text-xs text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
            >
              + Track a card
            </button>
          }
        >
          {cardItems.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" /> No card tracked yet for {person.name || "them"}.
            </p>
          ) : (
            <ul className="space-y-3">
              {cardItems.map((g) => (
                <li
                  key={g.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.6)] p-4"
                >
                  <input
                    value={g.item}
                    onChange={(e) => updateGift(g.id, "item", e.target.value)}
                    placeholder="Christmas card"
                    className="min-h-11 flex-1 rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none"
                  />
                  <label className="inline-flex min-h-11 items-center gap-2 text-sm">
                    <input type="checkbox" checked={g.wrapped} onChange={(e) => updateGift(g.id, "wrapped", e.target.checked)} />
                    Written
                  </label>
                  <label className="inline-flex min-h-11 items-center gap-2 text-sm">
                    <input type="checkbox" checked={g.delivered} onChange={(e) => updateGift(g.id, "delivered", e.target.checked)} />
                    Sent
                  </label>
                  <button
                    onClick={() => removeGift(g.id)}
                    className="min-h-11 text-xs text-muted-foreground hover:text-[color:var(--ember)]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SectionShell>
      ) : null}

      {/* 10 — Christmas memories */}
      <section>
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">Christmas Memories</p>
          <h2 className="mt-1 font-display text-3xl">{person.name || "Their"} year by year</h2>
        </div>

        {giftsLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading memories…</p>
        ) : memories.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.4)] p-10 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
            <h3 className="mt-3 font-display text-2xl">No past Christmases yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Once this Christmas is done, {person.name || "their"} gifts will live here as a history that grows every year.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {memories.map(([year, list]) => {
              const total = list.reduce((s, g) => s + (Number(g.price) || 0), 0);
              return (
                <div key={year} className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.5)] p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-3xl gold-text">{year}</span>
                      <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {list.length} gift{list.length === 1 ? "" : "s"} · £{total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => add({ is_idea: false, year })}
                      className="min-h-11 rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] px-3 py-1.5 text-xs text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
                    >
                      + Add to {year}
                    </button>
                  </div>
                  <ul className="space-y-3">
                    {list.map((g) => (
                      <GiftCard
                        key={g.id}
                        gift={g}
                        history={gifts.filter((x) => x.id !== g.id)}
                        userId={user?.id ?? ""}
                        onChange={(f, v) => updateGift(g.id, f, v)}
                        onRemove={() => removeGift(g.id)}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function JustAddedNote({ personId }: { personId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let flagged = false;
    try {
      flagged = sessionStorage.getItem("justAddedPerson") === personId;
      if (flagged) sessionStorage.removeItem("justAddedPerson");
    } catch {
      /* ignore */
    }
    if (!flagged) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 6000);
    return () => clearTimeout(t);
  }, [personId]);

  if (!show) return null;

  return (
    <p className="rise-in rounded-xl border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.20_0.04_245_/_0.6)] px-4 py-3 text-sm text-[color:var(--gold-soft)]">
      <Sparkles className="mr-2 inline h-4 w-4" />
      Person added. Start collecting gift ideas whenever you're ready.
    </p>
  );
}
