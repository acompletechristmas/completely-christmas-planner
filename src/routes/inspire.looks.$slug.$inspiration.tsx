import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { LookCategorySection } from "@/components/looks/LookCategorySection";
import { AffiliateDisclosure } from "@/components/looks/AffiliateDisclosure";
import { getLookInspiration } from "@/lib/decorations/inspirations.functions";
import { inspirationCategoryLabel, inspirationImage } from "@/lib/decorations/inspirations";
import { RecreateChecklist } from "@/components/looks/RecreateChecklist";

const inspirationQuery = (lookSlug: string, slug: string) =>
  queryOptions({
    queryKey: ["look-inspiration", lookSlug, slug],
    queryFn: async () => {
      const result = await getLookInspiration({ data: { lookSlug, slug } });
      if (!result.inspiration) throw notFound();
      return result;
    },
  });

export const Route = createFileRoute("/inspire/looks/$slug/$inspiration")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(inspirationQuery(params.slug, params.inspiration)),

  head: ({ loaderData, params }) => {
    const url = `https://acompletechristmas.co.uk/inspire/looks/${params.slug}/${params.inspiration}`;
    if (!loaderData?.inspiration) {
      return {
        meta: [
          { title: "Christmas inspiration — A Complete Christmas" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { inspiration, look } = loaderData;
    const description =
      inspiration.description ?? `${inspiration.title} — ${look?.name ?? "Christmas"} inspiration.`;
    return {
      meta: [
        { title: `${inspiration.title} — ${look?.name ?? "Christmas"} inspiration` },
        { name: "description", content: description },
        { property: "og:title", content: `${inspiration.title} — ${look?.name ?? "Christmas"} inspiration` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: InspirationDetail,
  errorComponent: () => (
    <PageShell eyebrow="Decorations" title="Christmas inspiration">
      <p className="text-[color:var(--muted-foreground)]">
        We couldn't load this inspiration just now. Please try again in a moment.
      </p>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell eyebrow="Decorations" title="Inspiration not found">
      <p className="text-[color:var(--muted-foreground)]">
        We couldn't find that inspiration.{" "}
        <Link to="/inspire/looks" className="text-[color:var(--gold-soft)] underline">
          Browse all looks
        </Link>
        .
      </p>
    </PageShell>
  ),
});

function InspirationDetail() {
  const { slug, inspiration: inspirationSlug } = Route.useParams();
  const { data } = useSuspenseQuery(inspirationQuery(slug, inspirationSlug));
  const inspiration = data.inspiration!;
  const look = data.look!;
  const image = inspirationImage(slug, inspiration);
  const categories = Array.from(new Set(data.products.map((p) => p.category)));
  const hasAffiliate = data.products.some((p) => p.isAffiliate);

  return (
    <PageShell
      eyebrow={`${look.name} · ${inspirationCategoryLabel(inspiration.category)}`}
      title={<span className="block gold-text">{inspiration.title}</span>}
      intro={inspiration.description ?? undefined}
      backTo={`/inspire/looks/${slug}`}
      backLabel={`Back to ${look.name}`}
    >

      <Link
        to="/inspire/looks/$slug"
        params={{ slug }}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-[color:var(--gold-soft)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> More {look.name} inspiration
      </Link>

      {image ? (
        <figure className="mt-6 overflow-hidden rounded-[20px] border border-[oklch(0.80_0.14_85_/_0.22)]">
          <img
            src={image}
            alt={inspiration.title}
            width={1200}
            height={900}
            className="w-full object-cover"
          />
        </figure>
      ) : null}

      {inspiration.stylingTip ? (
        <div className="mt-6 flex gap-3 rounded-2xl border border-[oklch(0.80_0.14_85_/_0.28)] bg-[color:var(--surface-card)] p-5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
              Styling tip
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
              {inspiration.stylingTip}
            </p>
          </div>
        </div>
      ) : null}

      <RecreateChecklist products={data.products} />

      <section className="mt-14">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
          Shop this look
        </p>
        <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight sm:text-4xl">
          Recreate this exact scene
        </h2>
        {categories.length ? (
          categories.map((category) => (
            <LookCategorySection
              key={category}
              category={category}
              products={data.products.filter((p) => p.category === category)}
            />
          ))
        ) : (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[color:var(--surface-card)] px-6 py-10 text-center">
            <Sparkles className="h-4 w-4 text-[color:var(--gold)]" aria-hidden="true" />
            <p className="max-w-md text-sm text-[color:var(--muted-foreground)]">
              We're finding the perfect pieces to recreate this look — shopping links are coming
              soon.
            </p>
          </div>
        )}
        {hasAffiliate ? <AffiliateDisclosure /> : null}
      </section>
    </PageShell>
  );
}
