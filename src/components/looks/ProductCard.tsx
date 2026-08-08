import { ExternalLink } from "lucide-react";
import type { LookProduct } from "@/lib/decorations/looks";

function formatPrice(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function ProductCard({ product }: { product: LookProduct }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[oklch(0.80_0.14_85_/_0.22)] bg-[color:var(--surface-card)]">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
            {product.retailer}
          </p>
          {product.isSponsored ? (
            <span className="rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
              Sponsored
            </span>
          ) : null}
        </div>
        <h4 className="mt-1.5 font-display text-lg leading-tight">{product.name}</h4>
        {product.description ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
            {product.description}
          </p>
        ) : null}
        {product.price != null ? (
          <p className="mt-3 text-sm">
            <span className="font-semibold">{formatPrice(product.price, product.currency)}</span>
            {product.previousPrice != null ? (
              <span className="ml-2 text-[color:var(--muted-foreground)] line-through">
                {formatPrice(product.previousPrice, product.currency)}
              </span>
            ) : null}
          </p>
        ) : null}
        {product.url ? (
          <a
            href={product.url}
            target="_blank"
            rel={product.isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--gold)] px-5 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:bg-[color:var(--gold)]/10"
          >
            View product <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        {product.lastCheckedAt ? (
          <p className="mt-2 text-[11px] text-[color:var(--muted-foreground)]">
            Price checked {new Date(product.lastCheckedAt).toLocaleDateString("en-GB")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
