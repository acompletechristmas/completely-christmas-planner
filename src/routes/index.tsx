import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowfall } from "@/components/Snowfall";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Countdown } from "@/components/Countdown";
import { useAuth } from "@/hooks/use-auth";
import { ArrowUpRight, Gift, Star, Bell, Heart } from "lucide-react";

import heroRoom from "@/assets/hero-room.jpg";
import cardGifts from "@/assets/card-gifts.jpg";
import cardDecorations from "@/assets/card-decorations.jpg";
import cardSanta from "@/assets/card-santa.jpg";
import cardFood from "@/assets/card-food-new.jpg";
import cardFilms from "@/assets/card-films.jpg";
import cardMusic from "@/assets/card-music.jpg";
import cardDaysOut from "@/assets/card-daysout.jpg";
import cardCrafts from "@/assets/card-crafts.jpg";
import cardPlanner from "@/assets/card-planner.jpg";
import cardBudget from "@/assets/card-save.jpg";
import cardParty from "@/assets/card-party.jpg";
import cardTraditions from "@/assets/card-traditions.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Complete Christmas — Plan gifts, food, budget & days out" },
      {
        name: "description",
        content:
          "Your Christmas control centre. Plan gifts, budget, food, decorations, cards and days out — all in one calm, organised place.",
      },
      { property: "og:title", content: "A Complete Christmas — Your Christmas control centre" },
      {
        property: "og:description",
        content:
          "Plan gifts, budget, food, decorations, cards and days out — all in one calm, organised place.",
      },
      { property: "og:url", content: "https://acompletechristmas.co.uk/" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/" }],
  }),
  component: Home,
});

interface Tile {
  image: string;
  title: string;
  desc: string;
  to: string;
}

function Home() {
  const { user } = useAuth();
  const planLink = user ? "/planner" : "/auth";

  const tiles: Tile[] = [
    { image: cardPlanner, title: "My Christmas Planner", desc: "Your personal Christmas HQ — gifts, budgets and everything in one place.", to: planLink },
    { image: cardDecorations, title: "Decorations", desc: "Ideas to make your home feel magical this year.", to: "/inspire" },
    { image: cardFood, title: "Food & Recipes", desc: "Menus, timings and festive recipes to cook with love.", to: "/food" },
    { image: cardDaysOut, title: "Christmas Activities", desc: "Markets, grottos, walks and days out near you.", to: "/days-out" },
    { image: cardFilms, title: "Films & Music", desc: "Cosy films and playlists for every moment.", to: "/entertainment" },
    { image: cardTraditions, title: "Traditions & Ideas", desc: "Little rituals that make Christmas feel like home.", to: "/inspire" },
    { image: cardCrafts, title: "Teachers' Corner", desc: "Festive lessons, worksheets and classroom ideas.", to: "/teachers" },
    { image: cardParty, title: "Christmas with Pets", desc: "Safe, joyful ways to include your furry family.", to: "/pets" },
    { image: cardBudget, title: "Budget & Savings", desc: "Stay in control with clear budgets and gentle saving.", to: "/save" },
    { image: cardSanta, title: "Advent & Countdown", desc: "Daily magic as we count down to the big day.", to: "/coming-soon" },
    { image: cardMusic, title: "More Christmas Magic", desc: "New surprises unwrapping soon.", to: "/coming-soon" },
  ];

  return (
    <div className="relative min-h-screen text-[color:var(--cream)]">
      <SiteNav />

      {/* ============ HERO ============ */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <img
          src={heroRoom}
          alt="A magnificent Christmas tree glowing with warm gold lights beside a roaring fireplace, presents stacked underneath"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        {/* Warm cinematic vignette + magical gold bloom over the tree */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 72% 45%, oklch(0.86 0.13 82 / 0.28), transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.12) 60%, rgba(10,20,15,0.85) 100%), radial-gradient(ellipse at 20% 40%, rgba(0,0,0,0.5), transparent 55%)",
          }}
        />
        <Snowfall count={120} force />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pt-32 pb-16 sm:px-10 sm:pt-40">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-[color:var(--gold)]">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-[11px] font-medium uppercase tracking-[0.32em]">
                A Complete Christmas
              </span>
            </div>

            <h1
              className="font-display text-[46px] leading-[0.98] tracking-tight sm:text-[72px] md:text-[88px]"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.6)" }}
            >
              Christmas
              <br />
              is coming.
              <br />
              <span className="italic gold-text">Let's make it magical.</span>
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[color:var(--cream)]/90 sm:text-[17px]" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}>
              Everything you need for the perfect Christmas — all in one beautiful place.
            </p>

            {/* Countdown card — frosted champagne-gold glass */}
            <div className="mt-10 max-w-lg">
              <div
                className="relative overflow-hidden rounded-3xl px-5 py-5 sm:px-7 sm:py-6"
                style={{
                  border: "1px solid oklch(0.86 0.11 85 / 0.5)",
                  background:
                    "linear-gradient(180deg, oklch(0.88 0.11 85 / 0.16), oklch(0.70 0.12 78 / 0.08) 60%, oklch(0.55 0.10 70 / 0.10))",
                  backdropFilter: "blur(20px) saturate(160%)",
                  boxShadow:
                    "inset 0 1px 0 oklch(1 0 0 / 0.22), inset 0 0 60px oklch(0.86 0.11 85 / 0.18), 0 30px 80px -30px rgba(0,0,0,0.75), 0 0 60px -10px oklch(0.82 0.14 85 / 0.45)",
                }}
              >
                {/* soft inner bloom */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, oklch(0.92 0.12 85 / 0.22), transparent 60%)",
                  }}
                />
                <div className="relative mb-4 flex items-center justify-center gap-3 text-[color:var(--gold)]">
                  <span className="text-xs">✦</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.32em] sm:text-[11px]">
                    Countdown to Christmas
                  </span>
                  <span className="text-xs">✦</span>
                </div>
                <div className="relative">
                  <Countdown variant="inline" />
                </div>
              </div>


              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to={planLink} className="btn-festive">
                  Start Planning Christmas
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade for smooth transition */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-32 z-[5]"
          style={{
            background: "linear-gradient(180deg, transparent, var(--midnight))",
          }}
        />
      </section>

      {/* ============ EVERYTHING FOR CHRISTMAS ============ */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-14 text-center">
          <div className="mb-3 flex items-center justify-center gap-3 text-[color:var(--gold)]">
            <span className="text-xs">✦</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.28em]">
              Explore
            </span>
            <span className="text-xs">✦</span>
          </div>
          <h2 className="font-display text-[34px] leading-tight tracking-tight sm:text-[48px]">
            Everything for your <span className="italic gold-text">perfect Christmas</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
          {tiles.map((t) => (
            <TileCard key={t.title} {...t} />
          ))}
        </div>
      </section>

      {/* ============ IVORY PROMISE STRIP ============ */}
      <section className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="rounded-3xl px-6 py-8 sm:px-10 sm:py-10" style={{ background: "linear-gradient(180deg, oklch(0.96 0.015 85), oklch(0.94 0.02 82))" }}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {[
              { icon: Gift, title: "Save time & stress", desc: "Everything in one place" },
              { icon: Star, title: "Curated inspiration", desc: "Handpicked ideas you'll love" },
              { icon: Bell, title: "Never miss a moment", desc: "Reminders for what matters most" },
              { icon: Heart, title: "Make it magical", desc: "Create memories to treasure" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ background: "oklch(0.30 0.08 155 / 0.08)" }}>
                  <Icon className="h-5 w-5" style={{ color: "oklch(0.55 0.14 40)" }} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-[17px] leading-tight" style={{ color: "oklch(0.25 0.05 30)" }}>
                    {title}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug" style={{ color: "oklch(0.40 0.03 30)" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLOSING ============ */}
      <section className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          Christmas, done <span className="italic gold-text">beautifully</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-[color:var(--muted-foreground)]">
          One calm, thoughtful home for the season — so the whole family can enjoy it, not just organise it.
        </p>
        <Link to={planLink} className="btn-festive mt-8">
          {user ? "Open my planner" : "Start planning free"}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}

function TileCard({ image, title, desc, to }: Tile) {
  return (
    <Link
      to={to}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl border border-[color:var(--gold)]/30 transition-all duration-500 hover:border-[color:var(--gold)]/70 hover:-translate-y-1.5"
      style={{ boxShadow: "0 24px 50px -24px rgba(0,0,0,0.55)" }}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
        loading="lazy"
        width={1024}
        height={1024}
      />
      {/* Base gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.20) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {/* Frosted gold hover wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.88 0.11 85 / 0.10), transparent 55%)",
          backdropFilter: "blur(1px)",
        }}
      />
      {/* Top gold hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.88 0.11 88 / 0.85), transparent)",
        }}
      />

      {/* Frosted caption panel */}
      <div className="relative z-10 m-3 rounded-2xl px-5 pb-5 pt-4 text-center sm:m-4"
        style={{
          background:
            "linear-gradient(180deg, oklch(0 0 0 / 0.28), oklch(0 0 0 / 0.55))",
          border: "1px solid oklch(0.86 0.11 85 / 0.28)",
          backdropFilter: "blur(10px) saturate(140%)",
          boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.10)",
        }}
      >
        <h3
          className="font-display text-[18px] leading-tight tracking-tight text-[color:var(--cream)] sm:text-[20px]"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
        >
          {title}
        </h3>
        <p
          className="mt-1.5 text-[12.5px] leading-snug text-[color:var(--cream)]/85 sm:text-[13px]"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
        >
          {desc}
        </p>
      </div>
    </Link>
  );
}
