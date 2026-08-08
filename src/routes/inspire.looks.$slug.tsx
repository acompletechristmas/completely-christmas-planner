import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PalettePreview } from "@/components/looks/PalettePreview";
import { LookCategorySection } from "@/components/looks/LookCategorySection";
import { AffiliateDisclosure } from "@/components/looks/AffiliateDisclosure";
import { getChristmasLook } from "@/lib/decorations/looks.functions";
import { lookImage } from "@/lib/decorations/looks";

const lookQuery = (slug: string) =>
  queryOptions({
    queryKey: ["christmas-look", slug],
    queryFn: async () => {
      const result = await getChristmasLook({ data: { slug } });
      if (!result.look) throw notFound();
      return result;
    },
  });

export const Route = createFileRoute("/inspire/looks/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(lookQuery(params.slug)),

  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Christmas look — A Complete Christmas" }, { name: "robots", content: "noindex" }],
      };
    }
    const look = loaderData.look!;
    return {
      meta: [
        { title: `${look.name} — Christmas decorating look` },
        { name: "description", content: look.shortDescription },
        { property: "og:title", content: `${look.name} — Christmas decorating look` },
        { property: "og:description", content: look.shortDescription },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: `https://acompletechristmas.co.uk/inspire/looks/${params.slug}` },
      ],
      links: [
        { rel: "canonical", href: `https://acompletechristmas.co.uk/inspire/looks/${params.slug}` },
      ],
    };
  },
  component: LookDetail,
  errorComponent: () => (
    <PageShell eyebrow="Decorations" title="Christmas look">
      <p className="text-[color:var(--muted-foreground)]">
        We couldn't load this look just now. Please try again in a moment.
      </p>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell eyebrow="Decorations" title="Look not found">
      <p className="text-[color:var(--muted-foreground)]">
        We couldn't find that Christmas look.{" "}
        <Link to="/inspire/looks" className="text-[color:var(--gold-soft)] underline">
          Browse all looks
        </Link>
        .
      </p>
    </PageShell>
  ),
});

function LookDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(lookQuery(slug));
  const look = data.look!;
  const image = lookImage(look);
  const hasAffiliate = data.products.some((p) => p.isAffiliate);

  return (
    <PageShell
      heroImage={image}
      eyebrow="Choose your Christmas look"
      title={<span className="block gold-text">{look.name}</span>}
      intro={look.longDescription ?? look.shortDescription}
    >
      <Link
        to="/inspire/looks"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-[color:var(--gold-soft)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All Christmas looks
      </Link>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.22)] bg-[color:var(--surface-card)] p-6">
          <h2 className="font-display text-2xl">The colour palette</h2>
          <div className="mt-4">
            <PalettePreview palette={look.palette} />
          </div>
        </div>
        <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.22)] bg-[color:var(--surface-card)] p-6">
          <h2 className="font-display text-2xl">Key elements to recreate the look</h2>
          <ul className="mt-4 space-y-2">
            {look.keyElements.map((element) => (
              <li key={element} className="flex gap-3 text-[15px] leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--gold)]"
                />
                <span className="text-[color:var(--muted-foreground)]">{element}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-14">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
          Shop the look
        </p>
        <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight sm:text-4xl">
          Everything you need for {look.name.toLowerCase()}
        </h2>
        {look.categories.map((category) => (
          <LookCategorySection
            key={category}
            category={category}
            products={data.products.filter((p) => p.category === category)}
          />
        ))}
        {hasAffiliate ? <AffiliateDisclosure /> : null}
      </section>
    </PageShell>
  );
}
