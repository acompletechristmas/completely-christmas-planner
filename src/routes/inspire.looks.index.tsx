import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { LookCard } from "@/components/looks/LookCard";
import { listChristmasLooks } from "@/lib/decorations/looks.functions";

const looksQuery = queryOptions({
  queryKey: ["christmas-looks"],
  queryFn: () => listChristmasLooks(),
});

export const Route = createFileRoute("/inspire/looks/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(looksQuery);
  },
  head: () => ({
    meta: [
      { title: "Choose Your Christmas Look — A Complete Christmas" },
      {
        name: "description",
        content:
          "Twelve Christmas decorating styles, from traditional red and gold to Nordic, woodland and winter wonderland. Find a look you love and everything you need to create it.",
      },
      { property: "og:title", content: "Choose Your Christmas Look — A Complete Christmas" },
      {
        property: "og:description",
        content: "Find a Christmas style you love, then create the look at home.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://acompletechristmas.co.uk/inspire/looks" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/inspire/looks" }],
  }),
  component: LooksGallery,
  errorComponent: () => (
    <PageShell eyebrow="Decorations" title="Christmas looks">
      <p className="text-[color:var(--muted-foreground)]">
        We couldn't load the Christmas looks just now. Please try again in a moment.
      </p>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell eyebrow="Decorations" title="Not found">
      <p className="text-[color:var(--muted-foreground)]">That page doesn't exist.</p>
    </PageShell>
  ),
});

function LooksGallery() {
  const { data } = useSuspenseQuery(looksQuery);
  return (
    <PageShell
      eyebrow="Decorations"
      title={
        <>
          <span className="block">Choose your</span>
          <span className="block gold-text">Christmas look</span>
        </>
      }
      intro="Find a Christmas style you love, then discover everything you need to create the look at home."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.looks.map((look, index) => (
          <LookCard key={look.id} look={look} eager={index < 2} />
        ))}
      </div>
    </PageShell>
  );
}
