import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChefHat,
  Plus,
  ShoppingBasket,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  Users,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { usePeople } from "@/hooks/use-people";
import { useFood } from "@/hooks/use-food";
import { DishRow, Field } from "@/components/food/DishRow";
import { HelpMePlan } from "@/components/food/HelpMePlan";
import {
  MEALS,
  SHOP_CATEGORIES,
  activePlanningYear,
  dietaryLabel,
  formatDayLabel,
  mealLabel,
  shopCategoryLabel,
  DIETARY_TAGS,
} from "@/lib/food/constants";
import type { FoodItem } from "@/lib/food/types";
import type { Suggestion } from "@/lib/food/curated-menus";

export const Route = createFileRoute("/_authenticated/planner/food")({
  head: () => ({
    meta: [
      { title: "My Christmas Food — A Complete Christmas" },
      {
        name: "description",
        content:
          "Plan every Christmas meal in one place: occasions, menus, guests and dietary needs, one shopping list and a calm preparation plan.",
      },
      { property: "og:title", content: "My Christmas Food — A Complete Christmas" },
      {
        property: "og:description",
        content: "Occasions, menus, guests, one shopping list and a calm preparation plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FoodPlannerPage,
});

type TabKey = "menu" | "guests" | "shopping" | "prep";

const TABS: { key: TabKey; label: string; icon: typeof ChefHat }[] = [
  { key: "menu", label: "Menus", icon: UtensilsCrossed },
  { key: "guests", label: "Guests", icon: Users },
  { key: "shopping", label: "Shopping", icon: ShoppingBasket },
  { key: "prep", label: "Prep plan", icon: CalendarDays },
];

function FoodPlannerPage() {
  const { user } = useAuth();
  const { people } = usePeople(user?.id);
  const food = useFood(user?.id);
  const [tab, setTab] = useState<TabKey>("menu");
  const [helping, setHelping] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const occasions = food.occasions;
  const activeOccasion = occasions.find((o) => o.id === activeId) ?? occasions[0] ?? null;

  const acceptSuggestions = async (occasionId: string, chosen: Suggestion[]) => {
    for (const s of chosen) {
      await food.addItem({
        occasion_id: occasionId,
        name: s.name,
        meal: s.meal,
        dietary_tags: s.dietary_tags ?? [],
        source: "suggested",
        suggestion_key: s.key,
      });
    }
    setActiveId(occasionId);
    setTab("menu");
  };

  const totalDishes = food.items.length;
  const toBuy = food.shopping.filter((s) => !s.bought).length;

  return (
    <div className="space-y-8">
      {/* Cream & gold header */}
      <header className="rounded-3xl border border-[color:var(--gold)]/40 bg-[color:var(--surface-card)] p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
          Christmas {activePlanningYear()}
        </p>
        <h1 className="mt-2 font-display text-[34px] leading-tight sm:text-5xl">My Christmas Food</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          Every meal, every guest, one shopping list. Add as little or as much as you like — a dish name on its
          own is a perfectly good plan.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[color:var(--muted-foreground)]">
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">
            {occasions.length} occasions
          </span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">{totalDishes} dishes</span>
          <span className="rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5">{toBuy} still to buy</span>
        </div>
        {!helping && (
          <button type="button" onClick={() => setHelping(true)} className="btn-planner mt-6 justify-center sm:w-auto sm:px-8">
            <Sparkles className="h-4 w-4" />
            Help me plan my Christmas food
          </button>
        )}
      </header>

      {helping && occasions.length > 0 && (
        <HelpMePlan occasions={occasions} onClose={() => setHelping(false)} onAccept={acceptSuggestions} />
      )}

      {/* Tabs */}
      <nav className="flex flex-wrap gap-2" aria-label="Food planner sections">
        {TABS.map((t) => {
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

      {food.loading ? (
        <p className="text-sm text-[color:var(--muted-foreground)]">Loading your food plan…</p>
      ) : (
        <>
          {tab === "menu" && (
            <MenuTab food={food} people={people} activeId={activeOccasion?.id ?? null} setActiveId={setActiveId} />
          )}
          {tab === "guests" && <GuestsTab food={food} people={people} occasionId={activeOccasion?.id ?? null} setActiveId={setActiveId} />}
          {tab === "shopping" && <ShoppingTab food={food} />}
          {tab === "prep" && <PrepTab food={food} />}
        </>
      )}
    </div>
  );
}

type Food = ReturnType<typeof useFood>;
type People = ReturnType<typeof usePeople>["people"];

/* ------------------------------------------------------------------ Menus */

function MenuTab({
  food,
  people,
  activeId,
  setActiveId,
}: {
  food: Food;
  people: People;
  activeId: string | null;
  setActiveId: (id: string) => void;
}) {
  const [newOccasion, setNewOccasion] = useState("");
  const occasion = food.occasions.find((o) => o.id === activeId) ?? food.occasions[0] ?? null;
  const items = occasion ? food.itemsByOccasion.get(occasion.id) ?? [] : [];

  const byMeal = useMemo(() => {
    const map = new Map<string, FoodItem[]>();
    for (const i of items) map.set(i.meal, [...(map.get(i.meal) ?? []), i]);
    return map;
  }, [items]);

  const addToShopping = async (item: FoodItem) => {
    await food.addShopping({ item: item.name, food_item_id: item.id, category: null });
    food.updateItem(item.id, "needs_shopping", true);
  };

  return (
    <div className="space-y-6">
      {/* Occasion switcher */}
      <div className="flex flex-wrap gap-2">
        {food.occasions.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setActiveId(o.id)}
            className={`min-h-[44px] rounded-full border px-4 text-sm ${
              o.id === occasion?.id
                ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15"
                : "border-[color:var(--gold)]/30 text-[color:var(--muted-foreground)]"
            }`}
          >
            {o.name}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const created = await food.addOccasion(newOccasion);
          if (created) {
            setNewOccasion("");
            setActiveId(created.id);
          }
        }}
      >
        <input
          value={newOccasion}
          onChange={(e) => setNewOccasion(e.target.value)}
          placeholder="Add another occasion (e.g. Christmas buffet)"
          aria-label="New occasion name"
          className="input-food"
        />
        <button type="submit" aria-label="Add occasion" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl border border-[color:var(--gold)]/40">
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {occasion && (
        <section className="space-y-5 rounded-3xl border border-[color:var(--gold)]/30 bg-[color:var(--surface-card)] p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Occasion">
              <input
                value={occasion.name}
                onChange={(e) => food.updateOccasion(occasion.id, "name", e.target.value)}
                className="input-food"
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={occasion.occasion_date ?? ""}
                onChange={(e) => food.updateOccasion(occasion.id, "occasion_date", e.target.value || null)}
                className="input-food"
              />
            </Field>
            <Field label="Notes">
              <input
                value={occasion.notes ?? ""}
                onChange={(e) => food.updateOccasion(occasion.id, "notes", e.target.value)}
                placeholder="Timings, who's hosting…"
                className="input-food"
              />
            </Field>
          </div>

          {MEALS.map((meal) => {
            const list = byMeal.get(meal.key) ?? [];
            return (
              <div key={meal.key}>
                <h3 className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
                  {meal.label}
                </h3>
                <ul className="space-y-2">
                  {list.map((i) => (
                    <DishRow
                      key={i.id}
                      item={i}
                      people={people}
                      onUpdate={food.updateItem}
                      onRemove={food.removeItem}
                      onAddToShopping={addToShopping}
                    />
                  ))}
                </ul>
                <AddDish onAdd={(name) => food.addItem({ occasion_id: occasion.id, name, meal: meal.key })} />
              </div>
            );
          })}

          {!occasion.is_default && (
            <button
              type="button"
              onClick={() => food.removeOccasion(occasion.id)}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[color:var(--muted-foreground)]"
            >
              <Trash2 className="h-4 w-4" /> Remove this occasion
            </button>
          )}
        </section>
      )}
    </div>
  );
}

function AddDish({ onAdd }: { onAdd: (name: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onAdd(value);
        setValue("");
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a dish…"
        aria-label="Add a dish"
        className="input-food"
      />
      <button
        type="submit"
        aria-label="Add dish"
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl border border-[color:var(--gold)]/40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
}

/* ----------------------------------------------------------------- Guests */

function GuestsTab({
  food,
  people,
  occasionId,
  setActiveId,
}: {
  food: Food;
  people: People;
  occasionId: string | null;
  setActiveId: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const occasion = food.occasions.find((o) => o.id === occasionId) ?? food.occasions[0] ?? null;
  const guests = occasion ? food.guests.filter((g) => g.occasion_id === occasion.id) : [];
  const alreadyAdded = new Set(guests.map((g) => g.person_id).filter(Boolean));

  if (!occasion) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {food.occasions.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setActiveId(o.id)}
            className={`min-h-[44px] rounded-full border px-4 text-sm ${
              o.id === occasion.id
                ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15"
                : "border-[color:var(--gold)]/30 text-[color:var(--muted-foreground)]"
            }`}
          >
            {o.name}
          </button>
        ))}
      </div>

      <section className="space-y-4 rounded-3xl border border-[color:var(--gold)]/30 bg-[color:var(--surface-card)] p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Adults">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={occasion.num_adults}
              onChange={(e) => food.updateOccasion(occasion.id, "num_adults", Number(e.target.value))}
              className="input-food"
            />
          </Field>
          <Field label="Children">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={occasion.num_children}
              onChange={(e) => food.updateOccasion(occasion.id, "num_children", Number(e.target.value))}
              className="input-food"
            />
          </Field>
        </div>

        {people.length > 0 && (
          <div>
            <h3 className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
              From my people
            </h3>
            <div className="flex flex-wrap gap-2">
              {people
                .filter((p) => !alreadyAdded.has(p.id))
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => food.addGuest({ occasion_id: occasion.id, person_id: p.id, guest_name: p.name })}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[color:var(--gold)]/30 px-4 text-sm"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {p.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim()) return;
            await food.addGuest({ occasion_id: occasion.id, guest_name: name.trim() });
            setName("");
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add someone else…"
            aria-label="Guest name"
            className="input-food"
          />
          <button type="submit" aria-label="Add guest" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl border border-[color:var(--gold)]/40">
            <Plus className="h-4 w-4" />
          </button>
        </form>

        <ul className="space-y-3">
          {guests.map((g) => (
            <li key={g.id} className="rounded-2xl border border-[color:var(--gold)]/25 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={g.guest_name ?? ""}
                  onChange={(e) => food.updateGuest(g.id, "guest_name", e.target.value)}
                  aria-label="Guest name"
                  className="min-h-[44px] flex-1 rounded-xl bg-transparent px-2 text-[15px] outline-none focus:bg-white/60"
                />
                <button
                  type="button"
                  onClick={() => food.removeGuest(g.id)}
                  aria-label={`Remove ${g.guest_name ?? "guest"}`}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-[color:var(--muted-foreground)]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {DIETARY_TAGS.map((t) => {
                  const on = g.dietary_tags.includes(t.key);
                  return (
                    <button
                      key={t.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        food.updateGuest(
                          g.id,
                          "dietary_tags",
                          on ? g.dietary_tags.filter((x) => x !== t.key) : [...g.dietary_tags, t.key],
                        )
                      }
                      className={`min-h-[44px] rounded-full border px-3 text-xs ${
                        on
                          ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15"
                          : "border-[color:var(--gold)]/25 text-[color:var(--muted-foreground)]"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <input
                value={g.dietary_notes ?? ""}
                onChange={(e) => food.updateGuest(g.id, "dietary_notes", e.target.value)}
                placeholder="Anything else to remember…"
                aria-label="Dietary notes"
                className="input-food mt-2"
              />
            </li>
          ))}
        </ul>

        <DietarySummary
          tags={[...new Set(guests.flatMap((g) => g.dietary_tags))]}
        />
      </section>
    </div>
  );
}

function DietarySummary({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <p className="rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/8 p-4 text-sm">
      <span className="font-medium">Remember: </span>
      {tags.map(dietaryLabel).join(", ")}.
    </p>
  );
}

/* --------------------------------------------------------------- Shopping */

function ShoppingTab({ food }: { food: Food }) {
  const [item, setItem] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, typeof food.shopping>();
    for (const s of food.shopping) {
      const key = s.category ?? "other";
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return [...map.entries()].sort(
      (a, b) =>
        SHOP_CATEGORIES.findIndex((c) => c.key === a[0]) - SHOP_CATEGORIES.findIndex((c) => c.key === b[0]),
    );
  }, [food.shopping]);

  const missing = food.items.filter(
    (i) => i.needs_shopping && !food.shopping.some((s) => s.food_item_id === i.id),
  );

  return (
    <div className="space-y-5">
      <p className="text-sm text-[color:var(--muted-foreground)]">
        One list for all your Christmas food, grouped so you can shop it in one trip.
      </p>

      {missing.length > 0 && (
        <div className="rounded-2xl border border-[color:var(--gold)]/40 bg-[color:var(--surface-card)] p-4">
          <p className="text-sm">
            {missing.length} dish{missing.length === 1 ? "" : "es"} marked "needs shopping" aren't on the list yet.
          </p>
          <button
            type="button"
            onClick={async () => {
              for (const m of missing) await food.addShopping({ item: m.name, food_item_id: m.id });
            }}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[color:var(--gold)]/50 px-4 text-sm"
          >
            <ShoppingBasket className="h-4 w-4" /> Add them all
          </button>
        </div>
      )}

      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!item.trim()) return;
          await food.addShopping({ item });
          setItem("");
        }}
      >
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Add something to buy…"
          aria-label="Shopping item"
          className="input-food"
        />
        <button type="submit" aria-label="Add shopping item" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl border border-[color:var(--gold)]/40">
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {food.shopping.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[color:var(--gold)]/40 p-6 text-center text-sm text-[color:var(--muted-foreground)]">
          Your shopping list is empty. Add dishes to your menus and send them here, or add anything you need directly.
        </p>
      ) : (
        grouped.map(([cat, list]) => (
          <section key={cat}>
            <h3 className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
              {shopCategoryLabel(cat)}
            </h3>
            <ul className="space-y-2">
              {list.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-2 rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--surface-card)] p-2"
                >
                  <label className="flex h-11 w-11 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={s.bought}
                      onChange={(e) => food.updateShopping(s.id, "bought", e.target.checked)}
                      aria-label={`Bought ${s.item}`}
                      className="h-5 w-5 accent-[color:var(--gold)]"
                    />
                  </label>
                  <input
                    value={s.item}
                    onChange={(e) => food.updateShopping(s.id, "item", e.target.value)}
                    aria-label="Item"
                    className={`min-h-[44px] min-w-0 flex-1 rounded-xl bg-transparent px-2 text-[15px] outline-none focus:bg-white/60 ${
                      s.bought ? "text-[color:var(--muted-foreground)] line-through" : ""
                    }`}
                  />
                  <select
                    value={s.category ?? ""}
                    onChange={(e) => food.updateShopping(s.id, "category", e.target.value || null)}
                    aria-label="Category"
                    className="h-11 max-w-[9rem] rounded-xl border border-[color:var(--gold)]/25 bg-transparent px-2 text-xs"
                  >
                    <option value="">Uncategorised</option>
                    {SHOP_CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => food.removeShopping(s.id)}
                    aria-label={`Remove ${s.item}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[color:var(--muted-foreground)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Prep plan */

function PrepTab({ food }: { food: Food }) {
  const dated = food.items.filter((i) => i.prep_date);
  const undated = food.items.filter((i) => !i.prep_date);

  const byDate = useMemo(() => {
    const map = new Map<string, FoodItem[]>();
    for (const i of dated) map.set(i.prep_date!, [...(map.get(i.prep_date!) ?? []), i]);
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [dated]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-[color:var(--muted-foreground)]">
        The same dishes, arranged by when you plan to make them. Give a dish a preparation date on its menu card and
        it appears here.
      </p>

      {byDate.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[color:var(--gold)]/40 p-6 text-center text-sm text-[color:var(--muted-foreground)]">
          Nothing scheduled yet. Nothing to worry about either.
        </p>
      )}

      {byDate.map(([date, list]) => (
        <section key={date} className="rounded-3xl border border-[color:var(--gold)]/30 bg-[color:var(--surface-card)] p-5">
          <h3 className="font-display text-xl">{formatDayLabel(date)}</h3>
          <ul className="mt-3 space-y-2">
            {list.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-[15px]">
                <input
                  type="checkbox"
                  checked={i.status === "prepared" || i.status === "served"}
                  onChange={(e) => food.updateItem(i.id, "status", e.target.checked ? "prepared" : "to_prepare")}
                  aria-label={`${i.name} prepared`}
                  className="h-5 w-5 accent-[color:var(--gold)]"
                />
                <span className={i.status === "prepared" || i.status === "served" ? "line-through opacity-60" : ""}>
                  {i.name}
                </span>
                <span className="ml-auto text-xs text-[color:var(--muted-foreground)]">
                  {mealLabel(i.meal)}
                  {i.responsible_name ? ` · ${i.responsible_name}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {undated.length > 0 && (
        <section>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
            No preparation date yet
          </h3>
          <ul className="space-y-2">
            {undated.map((i) => (
              <li
                key={i.id}
                className="flex items-center gap-3 rounded-2xl border border-[color:var(--gold)]/20 p-3 text-[15px]"
              >
                <ChefHat className="h-4 w-4 text-[color:var(--gold-soft)]" />
                {i.name}
                <input
                  type="date"
                  value=""
                  onChange={(e) => food.updateItem(i.id, "prep_date", e.target.value || null)}
                  aria-label={`Preparation date for ${i.name}`}
                  className="ml-auto h-11 rounded-xl border border-[color:var(--gold)]/25 bg-transparent px-2 text-xs"
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
