import { categoryLabel } from "@/lib/decorations/looks";
import type { LookProduct } from "@/lib/decorations/looks";
import { ProductCard } from "./ProductCard";
import { ProductsEmptyState } from "./ProductsEmptyState";

export function LookCategorySection({
  category,
  products,
}: {
  category: string;
  products: LookProduct[];
}) {
  const label = categoryLabel(category);
  return (
    <section className="mt-8">
      <h3 className="font-display text-[20px] leading-tight tracking-tight">{label}</h3>
      {products.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <ProductsEmptyState label={label} />
        </div>
      )}
    </section>
  );
}
