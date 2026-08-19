import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Sparkles } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { usePeople } from "@/hooks/use-people";
import { usePlannerSettings } from "@/hooks/use-planner-settings";
import { useTraditions } from "@/hooks/use-traditions";
import { AddTradition } from "@/components/traditions/AddTradition";
import { TraditionRow } from "@/components/traditions/TraditionRow";
import { InspireTraditions } from "@/components/traditions/InspireTraditions";
import { TIMING_ORDER, timingLabel } from "@/lib/traditions/constants";
import { activePlanningYear } from "@/lib/food/constants";

export const Route = createFileRoute("/_authenticated/planner/traditions")({
  head: () => ({
    meta: [
      { title: "Our Christmas Traditions — A Complete Christmas" },
      {
        name: "description",
        content:
          "Keep every Christmas tradition your family loves in one warm place — and discover new ones that suit your household.",
      },
      { property: "og:title", content: "Our Christmas Traditions — A Complete Christmas" },
      {
        property: "og:description",
        content: "Record the traditions you already have and find new ones made for your Christmas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TraditionsPage,
});

type TabKey = "ours" | "inspire";

function TraditionsPage() {
  const { user } = useAuth();
  const { people } = usePeople(user?.id);
  const { settings } = usePlannerSettings(user?.id);
  const { traditions, loading, add, update, remove } = useTraditions(user?.id);
  const [tab, setTab] = useState<TabKey>("ours");

  const savedKeys = useMemo(
    () => traditions.map((t) => t.suggestion_key).filter((k): k is string => Boolean(k)),
    [traditions],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof traditions>();
    for (const t of traditions) {
      const key = t.timing || "flexible";
      map.set(key, [...(map.get(key) ?? []), t]);
    }
    return TIMING_ORDER.filter((k) => map.has(k)).map((k) => ({ key: k, rows: map.get(k)! }));
  }, [traditions]);

  const annual = traditions.filter((t) => t.is_annual).length;

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-[color:var(--gold)]/40 bg-[color:var(--surface-card)] p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
          Christmas {activePlanningYear()}
        </p>
        <h1 className="mt-2 font-display text-[34px] leading-tight sm:text-5xl">Our Christmas Traditions</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          The little things you do every year — the ones that make Christmas yours. Write them down, or find a new
          one to start this year.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[color:var(--muted-foreground)]">
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {traditions.length} {traditions.length === 1 ? "tradition" : "traditions"}
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {annual} every Christmas
          </span>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Traditions sections">
        {[
          { key: "ours" as const, label: "Our traditions", icon: Heart },
          { key: "inspire" as const, label: "Inspire me", icon: Sparkles },
        ].map((t) => {
          const Icon = t.icon;
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={on ? "page" : undefined}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm transition ${
                on
                  ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--foreground)]"
                  : "border-[color:var(--gold)]/30 text-[color:var(--muted-foreground)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {tab === "ours" ? (
        <section className="space-y-6">
          <AddTradition onAdd={(name) => add({ name })} />

          {loading ? (
            <p className="text-sm text-[color:var(--muted-foreground)]">Loading your traditions…</p>
          ) : traditions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--gold)]/40 p-6 text-center">
              <p className="text-sm text-[color:var(--muted-foreground)]">
                Nothing written down yet. Add one above — a name on its own is plenty — or try{" "}
                <button
                  type="button"
                  onClick={() => setTab("inspire")}
                  className="underline decoration-[color:var(--gold)] underline-offset-4"
                >
                  Inspire me
                </button>
                .
              </p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.key}>
                <h2 className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
                  {timingLabel(group.key)}
                </h2>
                <ul className="space-y-2">
                  {group.rows.map((t) => (
                    <TraditionRow
                      key={t.id}
                      tradition={t}
                      people={people}
                      onUpdate={update}
                      onRemove={remove}
                    />
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      ) : (
        <InspireTraditions
          settings={settings}
          people={people}
          savedKeys={savedKeys}
          onAdd={(input) => add(input)}
        />
      )}
    </div>
  );
}
