import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, TreePine } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageShell } from "@/components/PageShell";
import { LookCard } from "@/components/looks/LookCard";
import { LookFilters } from "@/components/looks/LookFilters";
import { listChristmasLooks } from "@/lib/decorations/looks.functions";
import { lookMatchesFilter } from "@/lib/decorations/looks";
import heroLooks from "@/assets/hero-room.webp";
import giftsBand from "@/assets/gifts.webp";

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
    <PageShell eyebrow="Decorations" title="Christmas looks" backTo="/inspire" backLabel="Back to Get Inspired">
      <p className="text-[color:var(--muted-foreground)]">
        We couldn't load the Christmas looks just now. Please try again in a moment.
      </p>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell eyebrow="Decorations" title="Not found" backTo="/inspire" backLabel="Back to Get Inspired">
      <p className="text-[color:var(--muted-foreground)]">That page doesn't exist.</p>
    </PageShell>
  ),
});

function LooksGallery() {
  const { data } = useSuspenseQuery(looksQuery);
  const [filter, setFilter] = useState("All Looks");
  const looks = data.looks.filter((look) => lookMatchesFilter(look.slug, filter));

  return (
    <div className="planner-light relative min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <SiteNav />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroLooks}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.20 0.03 250 / 0.15) 0%, oklch(0.18 0.03 250 / 0.35) 42%, oklch(0.16 0.03 250 / 0.78) 68%, oklch(0.14 0.03 250 / 0.88) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto flex min-h-[360px] max-w-6xl flex-col px-5 py-16 sm:min-h-[420px] sm:px-8">
          <Link
            to="/inspire"
            className="rise-in inline-flex w-fit items-center gap-2 pt-8 text-xs uppercase tracking-[0.2em] text-[oklch(0.93_0.01_90_/_0.7)] transition hover:text-[oklch(0.86_0.11_86)]"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Get Inspired
          </Link>
          <div className="flex flex-1 items-center justify-center sm:justify-end">
          <div className="max-w-lg text-center sm:text-right">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[oklch(0.86_0.11_86)]">
              Christmas Decorations
            </p>
            <h1 className="mt-4 font-display text-[38px] leading-[1.05] tracking-tight text-[oklch(0.99_0.008_90)] sm:text-[54px]">
              <span className="block">Choose Your</span>
              <span className="block">Christmas Look</span>
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-[oklch(0.93_0.01_90_/_0.85)] sm:text-[16px]">
              Discover the perfect festive style for your home, then see everything you need to
              create the look.
            </p>
            <div className="mt-7 flex items-center justify-center gap-4 sm:justify-end">
              <span className="h-px w-16 bg-[oklch(0.86_0.11_86_/_0.6)] sm:w-24" />
              <TreePine className="h-4 w-4 text-[oklch(0.86_0.11_86)]" aria-hidden="true" />
              <span className="h-px w-16 bg-[oklch(0.86_0.11_86_/_0.6)] sm:w-24" />
            </div>
            <p className="mt-5 font-display text-[15px] italic text-[oklch(0.94_0.01_90_/_0.9)]">
              Find your style &middot; Get inspired &middot; Shop the look
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <main id="looks-grid" className="relative mx-auto max-w-6xl scroll-mt-28 px-4 py-12 sm:px-8 sm:py-16">
        <h2 className="text-center font-display text-[26px] leading-tight tracking-tight sm:text-[30px]">
          What style speaks to you?
        </h2>
        <div className="mt-6">
          <LookFilters active={filter} onChange={setFilter} />
        </div>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {looks.map((look, index) => (
            <LookCard key={look.id} look={look} eager={index < 4} />
          ))}
        </div>
      </main>

      {/* Closing band */}
      <section className="mx-auto mb-16 max-w-6xl px-4 sm:px-8">
        <div className="relative isolate overflow-hidden rounded-[18px] border border-[color:var(--border)] bg-[color:var(--surface-card)]">
          <img
            src={giftsBand}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute inset-y-0 left-0 -z-10 h-full w-1/2 object-cover sm:w-2/5"
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.99 0.008 90 / 0.25) 0%, oklch(0.985 0.010 88 / 0.85) 34%, oklch(0.985 0.010 88) 55%, oklch(0.985 0.010 88) 100%)",
            }}
          />
          <div className="relative px-6 py-10 text-center sm:px-10 sm:py-12">
            <h2 className="font-display text-[24px] leading-tight tracking-tight sm:text-[30px]">
              Not sure which look to choose?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[color:var(--muted-foreground)]">
              Explore them all for inspiration and find the style that makes your Christmas feel
              truly magical.
            </p>
            <a
              href="#looks-grid"
              onClick={() => setFilter("All Looks")}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[oklch(0.68_0.12_78_/_0.75)] bg-[linear-gradient(160deg,oklch(0.86_0.10_86)_0%,oklch(0.78_0.12_80)_55%,oklch(0.72_0.13_74)_100%)] px-6 text-[13px] font-semibold text-[color:var(--midnight-deep)] shadow-[0_1px_0_oklch(1_0_0_/_0.5)_inset]"
            >
              Start exploring <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
