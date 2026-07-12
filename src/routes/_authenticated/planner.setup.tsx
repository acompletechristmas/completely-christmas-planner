import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerSettings } from "@/hooks/use-planner-settings";
import { Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/setup")({
  component: SetupPage,
});

function SetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { settings, loading, saving, update } = usePlannerSettings(user?.id);

  if (loading || !settings) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  const finish = async () => {
    update("setup_completed", true);
    setTimeout(() => navigate({ to: "/planner" }), 500);
  };

  return (
    <div className="rise-in mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          Personalise your planner
        </p>
        <h2 className="mt-2 font-display text-3xl">Tell us about your Christmas</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every question is optional. Skip anything that doesn't apply — you can change your answers any time.
        </p>
      </div>

      <Section title="Who you're planning for">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Adults" value={settings.num_adults} onChange={(v) => update("num_adults", v)} />
          <NumberField label="Children" value={settings.num_children} onChange={(v) => update("num_children", v)} />
        </div>
      </Section>

      <Section title="The plan">
        <ToggleField label="I'm hosting Christmas Day" value={settings.is_hosting} onChange={(v) => update("is_hosting", v)} />
        <ToggleField label="We're travelling for Christmas" value={settings.is_travelling} onChange={(v) => update("is_travelling", v)} />
        <ToggleField label="I send Christmas cards" value={settings.sends_cards} onChange={(v) => update("sends_cards", v)} />
        <ToggleField label="We decorate inside" value={settings.decorates_indoor} onChange={(v) => update("decorates_indoor", v)} />
        <ToggleField label="We decorate outside" value={settings.decorates_outdoor} onChange={(v) => update("decorates_outdoor", v)} />
      </Section>

      <Section title="Budget & reminders">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Christmas budget (£)</label>
          <input
            type="number"
            min={0}
            value={settings.budget_total ?? ""}
            onChange={(e) => update("budget_total", e.target.value === "" ? null : Number(e.target.value))}
            placeholder="e.g. 1500"
            className="mt-2 w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] px-4 py-2.5 text-sm outline-none focus:border-[oklch(0.80_0.14_85_/_0.6)]"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reminder style</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["daily", "weekly", "milestone"] as const).map((style) => (
              <button
                key={style}
                onClick={() => update("planning_style", style)}
                className={
                  "rounded-full border px-4 py-2 text-sm capitalize transition " +
                  (settings.planning_style === style
                    ? "border-[oklch(0.80_0.14_85_/_0.7)] bg-[oklch(0.80_0.14_85_/_0.12)] text-[color:var(--gold-soft)]"
                    : "border-[oklch(0.80_0.14_85_/_0.2)] text-muted-foreground hover:border-[oklch(0.80_0.14_85_/_0.5)]")
                }
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Anything to remember">
        <textarea
          value={settings.dietary_notes ?? ""}
          onChange={(e) => update("dietary_notes", e.target.value || null)}
          placeholder="Dietary needs, accessibility, family notes…"
          rows={3}
          className="w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] px-4 py-2.5 text-sm outline-none focus:border-[oklch(0.80_0.14_85_/_0.6)]"
        />
      </Section>

      <div className="flex items-center justify-between border-t border-[oklch(0.80_0.14_85_/_0.15)] pt-6">
        <span className="text-xs text-muted-foreground">{saving ? "Saving…" : "All changes saved"}</span>
        <button
          onClick={finish}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Check className="h-4 w-4" />
          {settings.setup_completed ? "Save & return" : "Finish setup"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] p-5">
      <h3 className="flex items-center gap-2 font-display text-lg">
        <Sparkles className="h-4 w-4 text-[color:var(--gold)]" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="mt-2 w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] px-4 py-2.5 text-sm outline-none focus:border-[oklch(0.80_0.14_85_/_0.6)]"
      />
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] px-4 py-3 transition hover:border-[oklch(0.80_0.14_85_/_0.35)]">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[color:var(--gold)]"
      />
    </label>
  );
}
