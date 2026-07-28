import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { ArrowLeft, ExternalLink, Bookmark, Sparkles, Gift, Save, Loader2, X, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePeople } from "@/hooks/use-people";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  filterSecretSantaGifts,
  type GiftStyle,
  type RecipientType,
  type SecretSantaGift,
} from "@/lib/secret-santa-gifts";

export const Route = createFileRoute("/gift-finder/secret-santa")({
  head: () => ({
    meta: [
      { title: "Secret Santa Gift Finder — A Complete Christmas" },
      {
        name: "description",
        content:
          "Find a brilliant Secret Santa gift for any budget in under a minute. Simple, mobile-first and full of festive ideas.",
      },
      { property: "og:title", content: "Secret Santa Gift Finder — A Complete Christmas" },
      { property: "og:description", content: "Find a brilliant Secret Santa present for any budget." },
    ],
  }),
  component: SecretSantaPage,
});

type BudgetChoice = "under5" | "5to10" | "10to20" | "custom";

const BUDGETS: { id: BudgetChoice; label: string; min: number; max: number }[] = [
  { id: "under5", label: "Under £5", min: 0, max: 5 },
  { id: "5to10", label: "£5–£10", min: 5, max: 10 },
  { id: "10to20", label: "£10–£20", min: 10, max: 20 },
  { id: "custom", label: "Set my own budget", min: 0, max: 0 },
];

const RECIPIENTS: { id: RecipientType; label: string }[] = [
  { id: "colleague", label: "Work colleague" },
  { id: "friend", label: "Friend" },
  { id: "family", label: "Family member" },
  { id: "teacher", label: "Teacher" },
  { id: "other", label: "Someone else" },
];

const STYLES: { id: GiftStyle; label: string }[] = [
  { id: "funny", label: "Funny" },
  { id: "thoughtful", label: "Thoughtful" },
  { id: "useful", label: "Useful" },
  { id: "food-drink", label: "Food and drink" },
  { id: "personalised", label: "Personalised" },
  { id: "unusual", label: "Something unusual" },
];

function SecretSantaPage() {
  const { user } = useAuth();
  const { people, addPerson, refetch: refetchPeople } = usePeople(user?.id);
  const [budget, setBudget] = useState<BudgetChoice | null>(null);
  const [customBudget, setCustomBudget] = useState("");
  const [recipient, setRecipient] = useState<RecipientType | null>(null);
  const [styles, setStyles] = useState<GiftStyle[]>([]);
  const [interests, setInterests] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [savedToPlanner, setSavedToPlanner] = useState<Set<string>>(new Set());
  const [saveTarget, setSaveTarget] = useState<SecretSantaGift | null>(null);

  const canSubmit =
    budget !== null &&
    (budget !== "custom" || (customBudget && Number(customBudget) > 0)) &&
    recipient !== null;

  const results = useMemo<SecretSantaGift[]>(() => {
    if (!showResults || budget === null) return [];
    const b = BUDGETS.find((x) => x.id === budget)!;
    const max = budget === "custom" ? Number(customBudget) || 0 : b.max;
    const min = budget === "custom" ? 0 : b.min;
    return filterSecretSantaGifts({
      budgetMax: max,
      budgetMin: min,
      recipient: recipient ?? undefined,
      styles,
      interests,
    });
  }, [showResults, budget, customBudget, recipient, styles, interests]);

  function toggleStyle(id: GiftStyle) {
    setStyles((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function toggleSaved(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (showResults) {
    return (
      <PageShell
        eyebrow="Secret Santa Finder"
        title={<><span className="block">A few ideas</span><span className="block gold-text">just for them</span></>}
        intro="Tap a gift to open it in a new tab, or save the idea for later."
      >
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowResults(false)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--mist)] px-5 text-sm font-medium text-[color:var(--ink)] transition hover:border-[color:var(--forest)]"
          >
            <ArrowLeft className="h-4 w-4" /> Change my answers
          </button>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--mist)] p-8 text-center">
            <p className="text-[16px] text-[color:var(--ink)]">
              We haven’t found the perfect match yet. Try changing the budget or selecting another gift style.
            </p>
            <button
              type="button"
              onClick={() => setShowResults(false)}
              className="btn-primary mt-6 min-h-[44px]"
            >
              Change my answers
            </button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {results.map((g) => {
              const href = g.affiliateUrl ?? g.externalUrl;
              const price =
                g.minPrice === g.maxPrice ? `£${g.minPrice}` : `£${g.minPrice}–£${g.maxPrice}`;
              const isSaved = saved.has(g.id);
              return (
                <li
                  key={g.id}
                  className="flex flex-col rounded-2xl border border-[color:var(--border)] bg-[color:var(--mist)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[20px] leading-tight tracking-tight text-[color:var(--ink)]">
                      {g.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-[color:var(--forest)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--forest)]">
                      {price}
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--muted-foreground)]">
                    {g.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {g.giftStyles.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-[color:var(--border)] px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)]"
                      >
                        {STYLES.find((x) => x.id === s)?.label ?? s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {href && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-[color:var(--primary-foreground)]"
                        style={{ background: "var(--gradient-gold)" }}
                      >
                        View gift <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleSaved(g.id)}
                      aria-pressed={isSaved}
                      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
                        isSaved
                          ? "border-[color:var(--forest)] bg-[color:var(--forest)]/10 text-[color:var(--forest)]"
                          : "border-[color:var(--border)] text-[color:var(--ink)] hover:border-[color:var(--forest)]"
                      }`}
                    >
                      <Bookmark className="h-4 w-4" /> {isSaved ? "Saved" : "Save idea"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10 text-center">
          <Link to="/gift-finder" className="text-sm text-[color:var(--muted-foreground)] underline">
            Back to Gift Finder
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Secret Santa Finder"
      title={<><span className="block">Secret Santa,</span><span className="block gold-text">sorted</span></>}
      intro="Answer four quick questions and we’ll suggest festive gift ideas that suit them."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) setShowResults(true);
        }}
        className="mx-auto flex max-w-2xl flex-col gap-10"
      >
        {/* Q1 Budget */}
        <fieldset>
          <legend className="font-display text-[22px] tracking-tight text-[color:var(--ink)]">
            1. What is your budget?
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {BUDGETS.map((b) => {
              const active = budget === b.id;
              return (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  aria-pressed={active}
                  className={`min-h-[52px] rounded-2xl border px-5 text-left text-[15px] font-medium transition ${
                    active
                      ? "border-[color:var(--gold)] bg-[color:var(--forest)]/10 text-[color:var(--ink)] ring-2 ring-[color:var(--gold)]/40"
                      : "border-[color:var(--border)] bg-[color:var(--mist)] text-[color:var(--ink)] hover:border-[color:var(--forest)]"
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
          {budget === "custom" && (
            <label className="mt-4 block">
              <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                Your budget (£)
              </span>
              <input
                type="number"
                min={1}
                inputMode="decimal"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                placeholder="e.g. 15"
                className="mt-2 min-h-[48px] w-full rounded-full border border-[color:var(--border)] bg-[color:var(--mist)] px-5 text-[15px] focus:border-[color:var(--gold)] focus:outline-none"
              />
            </label>
          )}
        </fieldset>

        {/* Q2 Recipient */}
        <fieldset>
          <legend className="font-display text-[22px] tracking-tight text-[color:var(--ink)]">
            2. Who is it for?
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {RECIPIENTS.map((r) => {
              const active = recipient === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRecipient(r.id)}
                  aria-pressed={active}
                  className={`min-h-[52px] rounded-2xl border px-5 text-left text-[15px] font-medium transition ${
                    active
                      ? "border-[color:var(--gold)] bg-[color:var(--forest)]/10 text-[color:var(--ink)] ring-2 ring-[color:var(--gold)]/40"
                      : "border-[color:var(--border)] bg-[color:var(--mist)] text-[color:var(--ink)] hover:border-[color:var(--forest)]"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Q3 Style */}
        <fieldset>
          <legend className="font-display text-[22px] tracking-tight text-[color:var(--ink)]">
            3. What type of gift would suit them?
          </legend>
          <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">Pick as many as you like.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {STYLES.map((s) => {
              const active = styles.includes(s.id);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleStyle(s.id)}
                  aria-pressed={active}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-medium transition ${
                    active
                      ? "border-[color:var(--gold)] bg-[color:var(--forest)]/10 text-[color:var(--ink)] ring-2 ring-[color:var(--gold)]/40"
                      : "border-[color:var(--border)] bg-[color:var(--mist)] text-[color:var(--ink)] hover:border-[color:var(--forest)]"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Q4 Interests */}
        <fieldset>
          <legend className="font-display text-[22px] tracking-tight text-[color:var(--ink)]">
            4. What do they like?
          </legend>
          <label className="mt-3 block">
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="For example: musicals, football, baking, dogs, gardening or books"
              className="mt-1 min-h-[48px] w-full rounded-full border border-[color:var(--border)] bg-[color:var(--mist)] px-5 text-[15px] focus:border-[color:var(--gold)] focus:outline-none"
            />
          </label>
          <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">Optional — but it helps us pick.</p>
        </fieldset>

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary min-h-[52px] w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" /> Show me Secret Santa ideas
        </button>

        <Link
          to="/gift-finder"
          className="mx-auto inline-flex items-center gap-2 text-sm text-[color:var(--muted-foreground)] hover:text-[color:var(--forest)]"
        >
          <Gift className="h-4 w-4" /> Back to Gift Finder
        </Link>
      </form>
    </PageShell>
  );
}
