import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import heroEntertainment from "@/assets/card-entertainment.webp";
import { Film, Music, Gamepad2, BookOpen, Tv, Sparkles, PartyPopper } from "lucide-react";

export const Route = createFileRoute("/entertainment")({
  head: () => ({
    meta: [
      { title: "Christmas Entertainment — A Complete Christmas" },
      { name: "description", content: "Films, TV, playlists, family games and quiz packs to make festive evenings sparkle." },
      { property: "og:title", content: "Christmas Entertainment — A Complete Christmas" },
      { property: "og:description", content: "Curated evenings for cosy nights, big family gatherings and everything between." },
      { property: "og:url", content: "https://acompletechristmas.co.uk/entertainment" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/entertainment" }],
  }),
  component: EntertainmentPage,
});

const liveFeatures = [
  {
    icon: Film,
    heading: "Christmas Films & TV",
    body: "Save your festive favourites and let us help you choose what to watch.",
    cta: "Open my Christmas Watchlist",
    to: "/planner/watchlist",
  },
  {
    icon: Music,
    heading: "Christmas Music & Playlists",
    body: "Save your festive favourites and create the perfect soundtrack for Christmas.",
    cta: "Plan my Christmas Music",
    to: "/planner/music",
  },
];

const comingSoonBits = [
  { icon: Tv, title: "Festive TV guide", body: "Christmas specials worth staying up for — plus the Boxing Day box-sets to binge." },
  { icon: Gamepad2, title: "Family games", body: "Living-room games and party ideas by group size — from toddlers to grandparents." },
  { icon: BookOpen, title: "Christmas reads", body: "Books to gift, books to read on Christmas Eve, and audiobooks for wrapping evenings." },
  { icon: PartyPopper, title: "Quiz builder", body: "Auto-generate a Christmas quiz pack for the family — themed rounds, printable answer sheets." },
];

function EntertainmentPage() {
  return (
    <PageShell
      heroImage={heroEntertainment}
      eyebrow="Christmas Entertainment"
      title={<><span className="block">Evenings that</span><span className="block gold-text">sparkle</span></>}
      intro="Films, playlists, games and quiz packs — curated for cosy nights and full-house gatherings."
    >
      <section className="grid gap-5 sm:grid-cols-2">
        {liveFeatures.map((feature) => (
          <article
            key={feature.heading}
            className="flex flex-col rounded-2xl border border-[color:var(--gold)]/40 bg-[color:var(--surface-card)] p-6 sm:p-8"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--gold)]/12 text-[color:var(--gold)]">
              <feature.icon className="h-5.5 w-5.5" />
            </span>
            <h2 className="mt-5 font-display text-[26px] leading-tight tracking-tight sm:text-[28px]">
              {feature.heading}
            </h2>
            <p className="mt-2 flex-grow text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
              {feature.body}
            </p>
            <Link
              to={feature.to}
              className="btn-primary mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 sm:w-fit"
            >
              <feature.icon className="h-4 w-4" />
              {feature.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <div className="mb-5 flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-[color:var(--gold-soft)]" />
          <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
            More entertainment ideas
          </h2>
        </div>
        <div className="grid gap-5 opacity-80 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoonBits.map((b) => (
            <div key={b.title} className="relative">
              <div className="pointer-events-none absolute right-3 top-3 z-10">
                <ComingSoonBadge />
              </div>
              <FeatureCard icon={b.icon} title={b.title} body={b.body} />
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
