import { useMemo, useState } from "react";
import { Check, ChevronLeft, Sparkles, X } from "lucide-react";
import { MENU_STYLES, COURSE_ORDER, suggestionsFor, type Suggestion } from "@/lib/food/curated-menus";
import type { FoodOccasion } from "@/lib/food/types";

/**
 * Guided planning journey. Curated suggestions only — no paid AI. Accepting
 * suggestions writes ordinary dishes into the chosen occasion, so there is
 * never a second food plan.
 */
export function HelpMePlan({
  occasions,
  onClose,
  onAccept,
}: {
  occasions: FoodOccasion[];
  onClose: () => void;
  onAccept: (occasionId: string, chosen: Suggestion[]) => Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [occasionId, setOccasionId] = useState(occasions[0]?.id ?? "");
  const [style, setStyle] = useState("traditional");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const suggestions = useMemo(() => suggestionsFor(style), [style]);

  const grouped = useMemo(() => {
    const map = new Map<string, Suggestion[]>();
    for (const s of suggestions) map.set(s.course, [...(map.get(s.course) ?? []), s]);
    return [...map.entries()].sort(
      (a, b) => COURSE_ORDER.indexOf(a[0]) - COURSE_ORDER.indexOf(b[0]),
    );
  }, [suggestions]);

  const startStyle = (key: string) => {
    setStyle(key);
    setSelected(new Set(suggestionsFor(key).map((s) => s.key)));
    setStep(2);
  };

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    await onAccept(occasionId, suggestions.filter((s) => selected.has(s.key)));
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

      {step === 1 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-[color:var(--muted-foreground)]">What kind of Christmas food would you like?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {MENU_STYLES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => startStyle(s.key)}
                className="min-h-[64px] rounded-2xl border border-[color:var(--gold)]/30 p-4 text-left hover:border-[color:var(--gold)]"
              >
                <span className="block text-[15px] font-medium">{s.label}</span>
                <span className="block text-xs text-[color:var(--muted-foreground)]">{s.blurb}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 space-y-5">
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Here's a suggested menu. Keep what you like, tap anything to remove it — nothing is saved until you say so.
          </p>
          {grouped.map(([course, list]) => (
            <div key={course}>
              <h3 className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">{course}</h3>
              <ul className="space-y-2">
                {list.map((s) => {
                  const on = selected.has(s.key);
                  return (
                    <li key={s.key}>
                      <button
                        type="button"
                        onClick={() => toggle(s.key)}
                        aria-pressed={on}
                        className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-3 text-left text-[15px] ${
                          on
                            ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10"
                            : "border-[color:var(--gold)]/20 text-[color:var(--muted-foreground)]"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            on ? "border-[color:var(--gold)] bg-[color:var(--gold)]/30" : "border-[color:var(--gold)]/40"
                          }`}
                        >
                          {on && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="min-w-0">
                          {s.name}
                          {s.note && (
                            <span className="block text-xs text-[color:var(--muted-foreground)]">{s.note}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <button type="button" disabled={saving || selected.size === 0} onClick={save} className="btn-planner justify-center disabled:opacity-60">
            <Sparkles className="h-4 w-4" />
            {saving ? "Adding…" : `Add ${selected.size} dishes to my plan`}
          </button>
        </div>
      )}
    </div>
  );
}
