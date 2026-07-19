import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowfall } from "@/components/Snowfall";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Countdown } from "@/components/Countdown";
import { useAuth } from "@/hooks/use-auth";
import { ArrowUpRight, Gem } from "lucide-react";

import cardPlan from "@/assets/card-plan.jpg";
import cardInspire from "@/assets/card-inspire.jpg";
import cardMagic from "@/assets/card-magic.jpg";
import cardSave from "@/assets/card-save.jpg";
import cardEntertainment from "@/assets/card-entertainment.jpg";
import cardFood from "@/assets/card-food.jpg";
import cardTeachers from "@/assets/card-teachers.jpg";
import cardPets from "@/assets/card-pets.jpg";
import cardAssistant from "@/assets/card-assistant.jpg";

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

interface Section {
  image: string;
  title: string;
  desc: string;
  to: string;
  badge?: string;
}

function Home() {
  const { user } = useAuth();
  const planLink = user ? "/planner" : "/auth";

  // Primary planning tools
  const planningTools: Section[] = [
    {
      image: cardPlan,
      title: "Gift Planner",
      desc: "Track gift ideas, purchases, wrapping and who you've bought for.",
      to: planLink,
    },
    {
      image: cardSave,
      title: "Christmas Budget",
      desc: "Plan your spending, track costs and stay within your Christmas budget.",
      to: planLink,
    },
    {
      image: cardFood,
      title: "Food & Recipes",
      desc: "Menus, shopping lists and a cooking timeline for the big day.",
      to: "/food",
    },
    {
      image: cardMagic,
      title: "Christmas Events & Days Out",
      desc: "Santa's grottos, markets, panto and light trails near you.",
      to: "/days-out",
    },
  ];

  // Everything else — magical extras & inspiration
  const everythingElse: Section[] = [
    {
      image: cardInspire,
      title: "Decorations & Traditions",
      desc: "Ideas for the tree, the table and traditions to make your own.",
      to: "/inspire",
    },
    {
      image: cardEntertainment,
      title: "Films, Music & Games",
      desc: "Family films, festive playlists, quizzes and activities for every age.",
      to: "/entertainment",
    },
    {
      image: cardPets,
      title: "Christmas for Pets",
      desc: "Safe treats, cosy tips and gentle ways to include your animals.",
      to: "/pets",
    },
    {
      image: cardTeachers,
      title: "Teachers & Schools",
      desc: "Lesson plans, crafts and assembly ideas for the festive term.",
      to: "/teachers",
    },
    {
      image: cardAssistant,
      title: "AI Christmas Assistant",
      desc: "Ask any Christmas question and get a helpful, festive answer.",
      to: "/assistant",
    },
    {
      image: cardMagic,
      title: "What's Coming Next",
      desc: "A peek at the features unwrapping soon — join the list to hear first.",
      to: "/coming-soon",
      badge: "Soon",
    },
  ];

  return (
    <div className="home-magical relative min-h-screen text-[color:var(--foreground)]">
      <Snowfall count={90} />
      <SiteNav />

      {/* HERO — Countdown as centrepiece */}
      <section className="relative mx-auto max-w-5xl px-5 pt-6 pb-16 text-center sm:px-8 sm:pt-10 sm:pb-24">
        <div aria-hidden className="fairy-strand mx-auto mb-4 max-w-3xl" />
        <p className="rise-in text-[11px] font-medium uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          <span className="holly-divider"><Gem className="h-3 w-3" /> A Complete Christmas</span>
        </p>
        <h1 className="rise-in mt-5 font-display text-[38px] leading-[1.02] tracking-tight sm:text-[56px] md:text-[64px]" style={{ animationDelay: "0.05s" }}>
          Christmas is coming.
          <br />
          <span className="italic gold-text">Let's make it magical.</span>
        </h1>

        <div className="rise-in countdown-halo mt-10 sm:mt-14" style={{ animationDelay: "0.15s" }}>
          <Countdown variant="hero" />
          <p className="mt-6 text-[13px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)] sm:text-sm">
            Until Christmas Day
          </p>
        </div>

        <div className="rise-in mt-12 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.25s" }}>
          <Link to={planLink} className="btn-festive">
            {user ? "Open my planner" : "Start planning free"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link to="/inspire" className="btn-festive-ghost">Browse inspiration</Link>
        </div>

        <p className="rise-in mt-6 text-xs text-[color:var(--muted-foreground)]" style={{ animationDelay: "0.3s" }}>
          Your Christmas control centre — gifts, budget, food, days out and more.
        </p>
      </section>

      {/* WHAT THIS SITE IS — 3 pillars */}
      <section className="relative mx-auto max-w-5xl px-5 pb-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { t: "Organised", d: "Everything in one place — gifts, budget, food and lists." },
            { t: "Reminded", d: "Gentle nudges so you never miss booking or posting deadlines." },
            { t: "Magical", d: "Ideas, traditions and inspiration to make it feel special." },
          ].map((x) => (
            <div key={x.t} className="pillar-card rounded-2xl p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">{x.t}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--cream)]/85">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANNING TOOLS */}
      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--gold-soft)]"><span className="holly-divider">Plan your Christmas</span></p>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Your <span className="italic gold-text">planning tools</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-[color:var(--muted-foreground)]">
            Tap any section to get started. Everything saves automatically to your account.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {planningTools.map((t) => (
            <SectionCard key={t.title} {...t} />
          ))}
        </div>
      </section>

      {/* EVERYTHING ELSE */}
      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--gold-soft)]"><span className="holly-divider">Explore</span></p>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Everything else <span className="italic gold-text">festive</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-[color:var(--muted-foreground)]">
            Ideas, entertainment and helpful extras to round out the season.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {everythingElse.map((t) => (
            <SectionCard key={t.title} {...t} compact />
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <div aria-hidden className="fairy-strand mx-auto mb-6 max-w-md" />
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

function SectionCard({
  image,
  title,
  desc,
  to,
  badge,
  compact,
}: Section & { compact?: boolean }) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--mist)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className={`relative overflow-hidden ${compact ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {badge ? (
          <span className="absolute right-3 top-3 rounded-full border border-[color:var(--gold)]/50 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[color:var(--gold-soft)] backdrop-blur-sm">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="font-display text-[22px] leading-tight tracking-tight text-[color:var(--ink)] sm:text-[24px]">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">{desc}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--forest)]">
          Open <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
