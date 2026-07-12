import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePeople, calcAge } from "@/hooks/use-people";
import { Plus, Users, ArrowRight, Sparkles, Cake, Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/people/")({
  component: PeopleIndex,
});

function PeopleIndex() {
  const { user } = useAuth();
  const { people, loading, addPerson } = usePeople(user?.id);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [adding, setAdding] = useState(false);

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => {
            const age = calcAge(p.date_of_birth);
            return (
              <Link
                key={p.id}
                to="/planner/people/$personId"
                params={{ personId: p.id }}
                className="group flex flex-col justify-between rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.7)] p-5 transition hover:-translate-y-0.5 hover:border-[oklch(0.80_0.14_85_/_0.5)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] font-display text-lg gold-text">
                      {p.name?.[0]?.toUpperCase() || "?"}
                    </span>
                    <div>
                      <p className="font-display text-xl">{p.name || "Untitled"}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.relationship || "—"}
                        {age != null ? ` · ${age}` : ""}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[color:var(--gold-soft)]" />
                </div>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  {p.hobbies ? (
                    <p className="flex items-start gap-1.5"><Heart className="mt-0.5 h-3 w-3 text-[color:var(--gold-soft)]" /><span className="line-clamp-1">{p.hobbies}</span></p>
                  ) : null}
                  {p.date_of_birth ? (
                    <p className="flex items-center gap-1.5"><Cake className="h-3 w-3 text-[color:var(--gold-soft)]" />{new Date(p.date_of_birth).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</p>
                  ) : null}
                  {p.gift_budget != null ? (
                    <p className="text-[color:var(--gold-soft)]">Budget £{Number(p.gift_budget).toFixed(2)}</p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
