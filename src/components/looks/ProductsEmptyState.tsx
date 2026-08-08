import { Sparkles } from "lucide-react";

export function ProductsEmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[color:var(--surface-card)] px-6 py-8 text-center">
      <Sparkles className="h-4 w-4 text-[color:var(--gold)]" aria-hidden="true" />
      <p className="text-sm text-[color:var(--muted-foreground)]">
        We're curating the {label.toLowerCase()} for this look — shopping links are coming soon.
      </p>
    </div>
  );
}
