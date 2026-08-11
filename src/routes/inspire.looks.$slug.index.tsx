import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PalettePreview } from "@/components/looks/PalettePreview";
import { LookCategorySection } from "@/components/looks/LookCategorySection";
import { AffiliateDisclosure } from "@/components/looks/AffiliateDisclosure";
import { InspirationGallery } from "@/components/looks/InspirationGallery";
import { getChristmasLook } from "@/lib/decorations/looks.functions";
import { listLookInspirations } from "@/lib/decorations/inspirations.functions";
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

const inspirationsQuery = (slug: string) =>
  queryOptions({
    queryKey: ["christmas-look-inspirations", slug],
    queryFn: () => listLookInspirations({ data: { lookSlug: slug } }),
  });

export const Route = createFileRoute("/inspire/looks/$slug/")({
  loader: async ({ context, params }) => {
    const [look] = await Promise.all([
      context.queryClient.ensureQueryData(lookQuery(params.slug)),
      context.queryClient.ensureQueryData(inspirationsQuery(params.slug)),
    ]);
    return look;
  },

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
  const { data: inspirationData } = useSuspenseQuery(inspirationsQuery(slug));
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
        <div className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.22)] bg-[color:var(--surface-card)] p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-start gap-2.5">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--gold-soft)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2v20" />
              <path d="M12 6l-2-2" />
              <path d="M12 6l2-2" />
              <path d="M12 18l-2 2" />
              <path d="M12 18l2 2" />
              <path d="M4.5 7.5l15 9" />
              <path d="M4.5 7.5l2-1" />
              <path d="M4.5 7.5l1 2" />
              <path d="M19.5 16.5l-2 1" />
              <path d="M19.5 16.5l-1-2" />
              <path d="M19.5 7.5l-15 9" />
              <path d="M19.5 7.5l-2-1" />
              <path d="M19.5 7.5l-1 2" />
              <path d="M4.5 16.5l2 1" />
              <path d="M4.5 16.5l1-2" />
            </svg>
            <h2 className="font-display text-2xl">Colours of the Look</h2>
          </div>
          <p className="mt-1.5 text-sm text-[color:var(--muted-foreground)]">
            The shades that bring this Christmas style together.
          </p>
          <div className="mt-5">
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

      <InspirationGallery
        lookSlug={slug}
        lookName={look.name}
        inspirations={inspirationData.inspirations}
      />

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
