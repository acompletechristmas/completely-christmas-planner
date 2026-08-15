import { Search, Sparkles } from "lucide-react";

export type DiscoveryMode = "find" | "inspire";

interface Props {
  mode: DiscoveryMode;
  onChange: (mode: DiscoveryMode) => void;
}

const OPTIONS: { value: DiscoveryMode; label: string; hint: string; icon: typeof Search }[] = [
  {
    value: "find",
    label: "Find something",
    hint: "You know roughly what you're after",
    icon: Search,
  },
  {
    value: "inspire",
    label: "Inspire me",
    hint: "Tell us who's going and we'll suggest",
    icon: Sparkles,
  },
];

export function DiscoveryModeSwitch({ mode, onChange }: Props) {
  return (
    <div role="group" aria-label="How would you like to discover Christmas activities?" className="mb-6 grid gap-3 sm:grid-cols-2">
      {OPTIONS.map((o) => {
        const active = mode === o.value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`flex min-h-[68px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
              active
                ? "border-[color:var(--gold)] bg-[color:var(--gold)]/12"
                : "border-[oklch(0.80_0.14_85_/_0.22)] bg-[oklch(0.26_0.04_245_/_0.6)] hover:border-[color:var(--gold)]"
            }`}
          >
            <Icon
              aria-hidden
              className="pointer-events-none h-5 w-5 shrink-0 text-[color:var(--gold)]"
            />
            <span className="min-w-0">
              <span className="block font-display text-lg leading-tight text-[color:var(--gold-soft)]">
                {o.label}
              </span>
              <span className="block text-[12px] text-[color:var(--muted-foreground)]">
                {o.hint}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
