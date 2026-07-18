import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowfall } from "@/components/Snowfall";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/use-auth";
import { ArrowUpRight, Gift, ChefHat, Sparkles, MapPin, Film, PiggyBank, Bot, PawPrint, BookOpen, BellRing, Gem } from "lucide-react";

import heroTree from "@/assets/hero-tree.jpg";
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
      { title: "A Complete Christmas — Your calm, sorted Christmas" },
      {
        name: "description",
        content:
          "The UK's calm, thoughtful home for everything Christmas. Plan gifts, food, days out and traditions — beautifully, in one place.",
      },
      { property: "og:url", content: "https://acompletechristmas.co.uk/" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/" }],
  }),
  component: Home,
});

function daysToChristmas(): number {
  const now = new Date();
  const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  const xmas = new Date(year, 11, 25);
  return Math.max(0, Math.ceil((xmas.getTime() - now.getTime()) / 86400000));
}

interface Tile {
  image: string;
  eyebrow: string;
  title: string;
  desc: string;
  to: string;
}

function Home() {
  const { user } = useAuth();
  const planLink = user ? "/planner" : "/auth";
  const sleeps = daysToChristmas();

  const starters: Tile[] = [
    { image: cardPlan, eyebrow: "Plan", title: "Gifts, lists & budget", desc: "Everyone you're buying for, every idea, every receipt — in one calm place.", to: planLink },
    { image: cardFood, eyebrow: "Cook", title: "The whole festive menu", desc: "From the shopping list to the leftovers — timed to the minute.", to: "/food" },
    { image: cardMagic, eyebrow: "Do", title: "Days out & magic near you", desc: "Santa, markets, light trails, panto — filtered by postcode.", to: "/days-out" },
  ];

  const explore = [
    { icon: Sparkles, title: "Inspiration", desc: "Trees, tables, traditions.", to: "/inspire", image: cardInspire },
    { icon: Film, title: "Entertainment", desc: "Films, games, quizzes.", to: "/entertainment", image: cardEntertainment },
    { icon: PiggyBank, title: "Save money", desc: "Budgets, deals, clever swaps.", to: "/save", image: cardSave },
    { icon: PawPrint, title: "For pets", desc: "Outfits, treats, cosy tips.", to: "/pets", image: cardPets },
    { icon: BookOpen, title: "For teachers", desc: "Lessons, crafts, assemblies.", to: "/teachers", image: cardTeachers },
    { icon: Bot, title: "AI assistant", desc: "Ask anything, anytime.", to: "/assistant", image: cardAssistant },
    { icon: Gem, title: "Coming soon", desc: "A peek at what's unwrapping next.", to: "/coming-soon", image: cardMagic },
  ];

  const thisWeek = [
    { when: "This week", what: "Book Santa's grotto — the good ones go quickly." },
    { when: "This month", what: "Reserve pantomime tickets before the school-holiday rush." },
    { when: "Soon", what: "Order any personalised gifts — 6-week lead times are normal." },
  ];

  return (
    <div className="relative min-h-screen text-[color:var(--foreground)]">
      <Snowfall count={55} />
      <SiteNav />


      {/* HERO — editorial */}
      <section className="relative mx-auto max-w-7xl px-5 pt-10 pb-16 sm:px-8 sm:pt-16 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6 rise-in">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--forest)]">
              {sleeps} sleeps until Christmas
            </p>
            <h1 className="mt-5 font-display text-[52px] leading-[1.02] tracking-tight sm:text-[68px] md:text-[80px]">
              Your calm,<br />
              sorted, <span className="italic text-[color:var(--forest)]">joyful</span><br />
              Christmas.
            </h1>
            <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-[color:var(--muted-foreground)]">
              The one place for gifts, food, days out and traditions — beautifully organised, gently reminded, all year round.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to={planLink} className="btn-primary">
                {user ? "Open my planner" : "Start planning"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/inspire" className="btn-ghost">Browse inspiration</Link>
            </div>
            <p className="mt-6 text-xs text-[color:var(--muted-foreground)]">
              Free to start · No card needed · Built in the UK
            </p>
          </div>

          <div className="lg:col-span-6 rise-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative overflow-hidden rounded-[28px] shadow-[var(--shadow-lift)]">
              <img
                src={heroTree}
                alt="A softly lit Christmas tree at home"
                className="h-[380px] w-full object-cover sm:h-[560px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* START HERE — 3 tiles */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--forest)]">Start here</p>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              How can we make your Christmas easier?
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-[color:var(--muted-foreground)]">
            Pick where the load is heaviest this year. You can jump between anything, anytime.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {starters.map((t) => (
            <Link
              key={t.title}
              to={t.to}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-[color:var(--mist)] border border-[color:var(--border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={t.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--forest)]">{t.eyebrow}</p>
                <h3 className="font-display text-[26px] leading-tight tracking-tight">{t.title}</h3>
                <p className="text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">{t.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--forest)]">
                  Explore <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEVER MISS — signature feature strip */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="overflow-hidden rounded-[32px] border border-[color:var(--border)] text-[color:var(--cream)]" style={{ background: "linear-gradient(135deg, oklch(0.22 0.06 155) 0%, oklch(0.16 0.04 245) 100%)" }}>
          <div className="grid gap-10 p-10 sm:p-14 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
                <BellRing className="h-3.5 w-3.5" /> Signature feature
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                Never miss a single festive moment.
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[color:var(--cream)]/80">
                The best Santa grottos, panto tickets and afternoon teas sell out in July.
                We'll gently nudge you at exactly the right moment — from booking markets in
                September to posting the last cards in December.
              </p>
              <Link
                to={user ? "/planner/reminders" : "/auth"}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--cream)] px-6 py-3 text-sm font-medium text-[color:var(--forest)] transition hover:bg-[color:var(--mist)]"
              >
                {user ? "See my timeline" : "Set up my reminders"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {thisWeek.concat([
                { when: "Nov", what: "Reserve your supermarket delivery slot." },
                { when: "Dec 8", what: "Post the last second-class Christmas cards." },
                { when: "Dec 20", what: "Collect the turkey. Chill the fizz." },
                { when: "Dec 24", what: "Assemble the Christmas Eve box." },
              ]).map((r) => (
                <li key={r.what} className="rounded-2xl bg-[color:var(--cream)]/6 border border-[color:var(--cream)]/10 p-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">{r.when}</p>
                  <p className="mt-2 text-[15px] leading-snug text-[color:var(--cream)]">{r.what}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--forest)]">Explore</p>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Everything you need.<br />
            <span className="italic text-[color:var(--forest)]">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {explore.map(({ icon: Icon, title, desc, to, image }) => (
            <Link
              key={title}
              to={to}
              className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--mist)] p-4 pr-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[color:var(--forest)]">
                  <Icon className="h-4 w-4" />
                  <h3 className="font-display text-[20px] leading-tight tracking-tight text-[color:var(--ink)]">{title}</h3>
                </div>
                <p className="mt-1 text-[14px] leading-snug text-[color:var(--muted-foreground)]">{desc}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--forest)] opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* Small closing note */}
      <section className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
        <div className="mx-auto mb-6 h-px w-24 bg-[color:var(--gold)]/40" />
        <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          Christmas, done <span className="italic text-[color:var(--forest)]">beautifully</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-[color:var(--muted-foreground)]">
          One quiet, thoughtful home for the season — so the whole family can enjoy it, not just organise it.
        </p>
        <Link to={planLink} className="btn-primary mt-8">
          {user ? "Open my planner" : "Start planning free"}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
