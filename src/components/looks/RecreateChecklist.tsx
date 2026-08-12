import { Sparkles, CircleOff } from "lucide-react";
import type { InspirationProduct } from "@/lib/decorations/inspirations";
import { formatRecreateQuantity } from "@/lib/decorations/inspirations";

export function RecreateChecklist({ products }: { products: InspirationProduct[] }) {
  if (!products.length) return null;

  const essentials = products.filter((p) => p.isEssential);
  const optional = products.filter((p) => !p.isEssential);

  return (
    <section className="mt-14">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
        What you'll need
      </p>
      <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight sm:text-4xl">
        Recreate this look
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
        Everything that goes into this scene, with the approximate quantities and styling notes you
        need to get the same effect.
      </p>

      <div className="mt-6 divide-y divide-[oklch(0.80_0.14_85_/_0.2)] rounded-2xl border border-[oklch(0.80_0.14_85_/_0.22)] bg-[color:var(--surface-card)]">
        {essentials.map((p) => (
          <ChecklistItem key={p.id} product={p} />
        ))}
        {optional.length ? (
          <>
            <div className="flex items-center gap-2 px-5 py-3">
              <CircleOff className="h-3.5 w-3.5 text-[color:var(--muted-foreground)]" aria-hidden="true" />
              <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                Optional finishing touches
              </p>
            </div>
            {optional.map((p) => (
              <ChecklistItem key={p.id} product={p} optional />
            ))}
          </>
        ) : null}
      </div>
    </section>
  );
}

function ChecklistItem({
  product,
  optional = false,
}: {
  product: InspirationProduct;
  optional?: boolean;
}) {
  const quantityText = formatRecreateQuantity(
    product.quantity,
    product.quantityMax,
    product.quantityUnit,
  );

  return (
    <div className="flex items-start gap-3 px-5 py-4 first:rounded-t-2xl last:rounded-b-2xl">
      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--gold)]" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-[color:var(--foreground)]">{product.name}</p>
          {optional ? (
            <span className="rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
              Optional
            </span>
          ) : null}
        </div>
        <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          {quantityText ? <p>{quantityText}</p> : null}
          {product.sizeNote ? <p className="mt-0.5">{product.sizeNote}</p> : null}
          {product.colourFinish ? <p className="mt-0.5">{product.colourFinish}</p> : null}
          {product.stylingNote ? <p className="mt-1.5 italic">{product.stylingNote}</p> : null}
        </div>
      </div>
    </div>
  );
}
