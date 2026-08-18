import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Check, ChevronLeft, Plus, Sparkles, X } from "lucide-react";
import { MENU_STYLES, COURSE_ORDER, type MenuStyleKey, type Suggestion } from "@/lib/food/curated-menus";
import {
  alternativesFor,
  buildMenu,
  buildRecommendationContext,
  courseDefaultMeal,
  type CustomItem,
  type RecommendationContext,
} from "@/lib/food/recommend";
import type { FoodOccasion, FoodGuest } from "@/lib/food/types";
import type { Person } from "@/hooks/use-people";
import type { PlannerSettings } from "@/hooks/use-planner-settings";
import { dietaryLabel } from "@/lib/food/constants";

/**
 * Guided planning journey. Curated suggestions only — no paid AI. Accepting
 * suggestions writes ordinary dishes into the chosen occasion, so there is
 * never a second food plan.
 */
export function HelpMePlan({
  occasions,
  guests,
  people,
  settings,
  onClose,
  onAccept,
  onUpdateOccasion,
}: {
  occasions: FoodOccasion[];
  guests: FoodGuest[];
  people: Person[];
  settings: PlannerSettings | null;
  onClose: () => void;
  onAccept: (
    occasionId: string,
    chosen: Suggestion[],
    custom: CustomItem[],
    servings: number,
    styleKey: MenuStyleKey,
  ) => Promise<void>;
  onUpdateOccasion: (id: string, field: "num_adults" | "num_children", value: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [occasionId, setOccasionId] = useState(occasions[0]?.id ?? "");
  const [styleKey, setStyleKey] = useState<MenuStyleKey>(
    (MENU_STYLES.find((s) => settings?.celebration_style?.includes(s.key))?.key as MenuStyleKey) ?? "traditional",
  );
  const [saving, setSaving] = useState(false);

  const occasion = useMemo(
    () => occasions.find((o) => o.id === occasionId) ?? occasions[0],
    [occasions, occasionId],
  );
  const occasionGuests = useMemo(
    () => guests.filter((g) => g.occasion_id === occasion?.id),
    [guests, occasion?.id],
  );

  const ctx = useMemo(() => {
    if (!occasion) return null;
    return buildRecommendationContext(occasion, occasionGuests, people, settings, styleKey);
  }, [occasion, occasionGuests, people, settings, styleKey]);

  const menu = useMemo(() => (ctx ? buildMenu(ctx) : null), [ctx]);

  const initialSlots = useMemo(() => {
    if (!menu) return [];
    const slots: { id: string; course: string; suggestion: Suggestion }[] = [];
    let idx = 0;
    for (const [course, list] of menu.groups) {
      for (const s of list) {
        slots.push({ id: `${course}-${idx}`, course, suggestion: s });
        idx++;
      }
    }
    return slots;
  }, [menu]);

  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [swapped, setSwapped] = useState<Record<string, Suggestion>>({});
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [customInput, setCustomInput] = useState<Record<string, string>>({});
  const [swapOpenId, setSwapOpenId] = useState<string | null>(null);

  const menuKey = useMemo(() => (menu ? `${styleKey}-${menu.intro}` : ""), [menu, styleKey]);

  useEffect(() => {
    if (!menu) return;
    setRemoved(new Set());
    setSwapped({});
    setAcceptedIds(new Set(initialSlots.map((s) => s.id)));
    setCustomItems([]);
    setCustomInput({});
    setSwapOpenId(null);
  }, [menuKey, initialSlots, menu]);

  const displayedSlots = useMemo(() => {
    return initialSlots
      .filter((s) => !removed.has(s.id))
      .map((s) => ({ ...s, suggestion: swapped[s.id] ?? s.suggestion }));
  }, [initialSlots, removed, swapped]);

  const grouped = useMemo(() => {
    const map = new Map<string, { slotId: string; suggestion: Suggestion }[]>();
    for (const s of displayedSlots) {
      map.set(s.course, [...(map.get(s.course) ?? []), { slotId: s.id, suggestion: s.suggestion }]);
    }
    return [...map.entries()].sort((a, b) => COURSE_ORDER.indexOf(a[0]) - COURSE_ORDER.indexOf(b[0]));
  }, [displayedSlots]);

  const acceptedSuggestions = useMemo(
    () => displayedSlots.filter((s) => acceptedIds.has(s.id)),
    [displayedSlots, acceptedIds],
  );
  const acceptedCount = acceptedSuggestions.length + customItems.length;

  const toggleAccepted = (id: string) => {
    setAcceptedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeSlot = (id: string) => {
    setRemoved((prev) => new Set([...prev, id]));
    setAcceptedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const swap = (id: string, suggestion: Suggestion) => {
    setSwapped((prev) => ({ ...prev, [id]: suggestion }));
    setSwapOpenId(null);
  };

  const addCustom = (course: string) => {
    const name = customInput[course]?.trim();
    if (!name) return;
    const id = `${course}-custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setCustomItems((prev) => [...prev, { id, name, meal: courseDefaultMeal(course), course }]);
    setCustomInput((prev) => ({ ...prev, [course]: "" }));
  };

  const removeCustom = (id: string) => {
    setCustomItems((prev) => prev.filter((c) => c.id !== id));
  };

  const save = async () => {
    if (!occasion || !menu) return;
    setSaving(true);
    await onAccept(
      occasion.id,
      acceptedSuggestions.map((s) => s.suggestion),
      customItems,
      menu.servings,
      styleKey,
    );
    setSaving(false);
    onClose();
  };

  return (
    <div className="rounded-3xl border border-[color:var(--gold)]/40 bg-[color:var(--surface-card)] p-5 shadow-[0_20px_50px_-30px_oklch(0.6_0.12_70/0.6)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">Help me plan</p>
          <h2 className="font-display text-2xl">A gentle place to start</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close help me plan"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--gold)]/30"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-sm text-[color:var(--muted-foreground)]"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
      )}

      {step === 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-[color:var(--muted-foreground)]">Which occasion are we planning?</p>
          {occasions.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOccasionId(o.id);
                setStep(1);
              }}
              className="flex min-h-[56px] w-full items-center justify-between rounded-2xl border border-[color:var(--gold)]/30 px-4 text-left text-[15px] hover:border-[color:var(--gold)]"
            >
              {o.name}
              {o.occasion_date && (
                <span className="text-xs text-[color:var(--muted-foreground)]">{o.occasion_date}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {step === 1 && occasion && ctx && (
        <div className="mt-4 space-y-5">
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Let's check who you're feeding so the menu fits your occasion.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
                Adults
              </label>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={occasion.num_adults}
                onChange={(e) => onUpdateOccasion(occasion.id, "num_adults", Number(e.target.value))}
                className="input-food"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
                Children
              </label>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={occasion.num_children}
                onChange={(e) => onUpdateOccasion(occasion.id, "num_children", Number(e.target.value))}
                className="input-food"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--gold)]/25 p-4">
            <p className="text-sm text-[color:var(--muted-foreground)]">
              This looks like{" "}
              <span className="font-medium text-[color:var(--foreground)]">{groupLabel(ctx.groupType)}</span>
              {occasionGuests.length > 0 && (
                <span>
                  {" "}
                  with{" "}
                  <span className="font-medium text-[color:var(--foreground)]">
                    {occasionGuests.length} {occasionGuests.length === 1 ? "guest" : "guests"}
                  </span>
                </span>
              )}
              .
            </p>

            {occasionGuests.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {occasionGuests.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full border border-[color:var(--gold)]/25 px-3 py-1 text-xs text-[color:var(--muted-foreground)]"
                  >
                    {g.guest_name ?? people.find((p) => p.id === g.person_id)?.name ?? "Guest"}
                  </span>
                ))}
              </div>
            )}

            {ctx.dietaryTags.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-[color:var(--muted-foreground)]">Dietary needs recorded for this occasion:</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {ctx.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[color:var(--gold)]/30 px-2.5 py-1 text-xs text-[color:var(--foreground)]"
                    >
                      {dietaryLabel(tag)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-3 text-xs text-[color:var(--muted-foreground)]">
              Edit guests and their dietary needs in the Guests tab.
            </p>
          </div>

          <button type="button" onClick={() => setStep(2)} className="btn-planner w-full justify-center">
            Looks right — choose a style
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-[color:var(--muted-foreground)]">What kind of Christmas food would you like?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {MENU_STYLES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  setStyleKey(s.key);
                  setStep(3);
                }}
                className="min-h-[64px] rounded-2xl border border-[color:var(--gold)]/30 p-4 text-left hover:border-[color:var(--gold)]"
              >
                <span className="block text-[15px] font-medium">{s.label}</span>
                <span className="block text-xs text-[color:var(--muted-foreground)]">{s.blurb}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && menu && ctx && (
        <div className="mt-4 space-y-5">
          <div className="rounded-2xl border border-[color:var(--gold)]/25 p-4">
            <p className="text-sm leading-relaxed text-[color:var(--foreground)]">{menu.intro}</p>
            <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">{menu.warnings[0]}</p>
          </div>

          {grouped.map(([course, list]) => (
            <div key={course}>
              <h3 className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">{course}</h3>
              <ul className="space-y-2">
                {list.map(({ slotId, suggestion }) => {
                  const on = acceptedIds.has(slotId);
                  const alternatives = alternativesFor(suggestion, ctx);
                  const open = swapOpenId === slotId;
                  return (
                    <li key={slotId} className="rounded-xl border border-[color:var(--gold)]/20 p-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleAccepted(slotId)}
                          aria-pressed={on}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            on
                              ? "border-[color:var(--gold)] bg-[color:var(--gold)]/30"
                              : "border-[color:var(--gold)]/40"
                          }`}
                        >
                          {on && <Check className="h-3.5 w-3.5" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`text-[15px] ${on ? "text-[color:var(--foreground)]" : "text-[color:var(--muted-foreground)] line-through"}`}>
                            {suggestion.name}
                          </p>
                          <p className="text-xs text-[color:var(--muted-foreground)]">
                            Serves about {menu.servings}
                            {suggestion.note ? ` · ${suggestion.note}` : ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSwapOpenId(open ? null : slotId)}
                          aria-label="Swap this dish"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[color:var(--gold)]/25"
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSlot(slotId)}
                          aria-label="Remove this dish"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[color:var(--gold)]/25"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {open && alternatives.length > 0 && (
                        <div className="mt-2 space-y-1 pl-8">
                          <p className="text-xs text-[color:var(--muted-foreground)]">Swap for:</p>
                          {alternatives.slice(0, 4).map((alt) => (
                            <button
                              key={alt.key}
                              type="button"
                              onClick={() => swap(slotId, alt)}
                              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[color:var(--foreground)] hover:bg-[color:var(--gold)]/10"
                            >
                              {alt.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-2 flex gap-2">
                <input
                  value={customInput[course] ?? ""}
                  onChange={(e) => setCustomInput((prev) => ({ ...prev, [course]: e.target.value }))}
                  placeholder={`Add your own ${course.toLowerCase()} dish…`}
                  aria-label={`Add your own ${course.toLowerCase()} dish`}
                  className="input-food"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustom(course);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addCustom(course)}
                  aria-label={`Add custom ${course.toLowerCase()} dish`}
                  className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl border border-[color:var(--gold)]/40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {customItems
                .filter((c) => c.course === course)
                .map((c) => (
                  <div
                    key={c.id}
                    className="mt-2 flex items-center gap-2 rounded-xl border border-[color:var(--gold)]/20 px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 text-sm text-[color:var(--foreground)]">{c.name}</span>
                    <span className="text-xs text-[color:var(--muted-foreground)]">Custom</span>
                    <button
                      type="button"
                      onClick={() => removeCustom(c.id)}
                      aria-label="Remove custom dish"
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          ))}

          {menu.warnings.length > 1 && (
            <div className="space-y-1 rounded-2xl border border-[color:var(--gold)]/25 p-4">
              {menu.warnings.slice(1).map((w, i) => (
                <p key={i} className="text-xs text-[color:var(--muted-foreground)]">
                  {w}
                </p>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={saving || acceptedCount === 0}
            onClick={save}
            className="btn-planner w-full justify-center disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {saving ? "Adding…" : `Add ${acceptedCount} ${acceptedCount === 1 ? "dish" : "dishes"} to my plan`}
          </button>
        </div>
      )}
    </div>
  );
}

function groupLabel(groupType: RecommendationContext["groupType"]): string {
  switch (groupType) {
    case "solo":
      return "just you";
    case "couple":
      return "a couple";
    case "adults":
      return "adults only";
    case "family_young":
      return "a family with young children";
    case "family_teens":
      return "a family with teenagers";
    case "family_adult_children":
      return "a family with adult children";
    case "multigenerational":
      return "a multigenerational group";
    case "large_group":
      return "a large group";
    default:
      return "your group";
  }
}
