import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowfall } from "@/components/Snowfall";
import { useAuth } from "@/hooks/use-auth";

import { Countdown } from "@/components/Countdown";
import heroTree from "@/assets/hero-tree.jpg";
import inspirationImg from "@/assets/inspiration.jpg";
import giftsImg from "@/assets/gifts.jpg";
import marketImg from "@/assets/market.jpg";
import {
  Gift,
  Sparkles,
  MapPin,
  PiggyBank,
  CalendarClock,
  ListChecks,
  ChefHat,
  Film,
  Bot,
  Crown,
  BellRing,
  TreePine,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Complete Christmas — Your magical, stress-free Christmas" },
      {
        name: "description",
        content:
          "Plan gifts, food and traditions, discover magical festive days out, and never miss a booking again with A Complete Christmas.",
      },
    ],
  }),
  component: Home,
});

const primaryActions = [
  {
    icon: Gift,
    title: "Plan My Christmas",
    desc: "Gifts, budget, food & lists — all in one place.",
    tone: "cranberry",
    to: "planner" as const,
  },
  {
    icon: Sparkles,
    title: "Inspire Me",
    desc: "Trees, tables, traditions & Elf ideas.",
    tone: "pine",
    to: "/inspire" as const,
  },
  {
    icon: MapPin,
    title: "Christmas Magic Near Me",
    desc: "Santa, markets, light trails & panto.",
    tone: "gold",
    to: "/days-out" as const,
  },
  {
    icon: PiggyBank,
    title: "Save Money",
    desc: "Smart budgets, deals & clever swaps.",
    tone: "ember",
    to: "/save" as const,
  },
];

const features = [
  {
    icon: ListChecks,
    title: "Christmas Planner",
    body: "Gift planner, budget, present & wrap tracker, cards, meal planner, shopping lists, family calendar — everything saves automatically.",
    image: giftsImg,
    to: "planner" as const,
  },
  {
    icon: BellRing,
    title: "Never Miss Christmas",
    body: "Timely nudges through the year: book Santa, panto, markets, afternoon teas, order the turkey, post the last cards.",
    tag: "Signature feature",
    to: "planner-reminders" as const,
  },
  {
    icon: Bot,
    title: "AI Gift Finder",
    body: "Answer a few questions and get thoughtful, personal gift ideas — from stocking fillers to luxury.",
    image: giftsImg,
    to: "/gift-finder" as const,
  },
  {
    icon: TreePine,
    title: "Christmas Inspiration",
    body: "Decor themes, table settings, outdoor lights, crafts, DIY gifts, Christmas Eve boxes and Elf ideas.",
    image: inspirationImg,
    to: "/inspire" as const,
  },
  {
    icon: Film,
    title: "Christmas Entertainment",
    body: "Films, TV, playlists, family games and quiz packs to make evenings sparkle.",
    to: "/entertainment" as const,
  },
  {
    icon: ChefHat,
    title: "Christmas Food",
    body: "Recipes, dinner planner, cooking timeline, shopping lists, leftovers and festive drinks.",
    to: "/food" as const,
  },
  {
    icon: MapPin,
    title: "Christmas Days Out",
    body: "Enter your postcode to find Santa experiences, markets, light trails, ice skating and festive stays nearby.",
    image: marketImg,
    to: "/days-out" as const,
  },
  {
    icon: Bot,
    title: "AI Christmas Assistant",
    body: "Ask anything: gift ideas for Dad, dinner plans, film picks, quiz builders, days out — right when you need it.",
    to: "/assistant" as const,
  },
];

function Home() {
  const { user } = useAuth();
  const planLink = user ? "/planner" : "/auth";
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">

      <Snowfall count={70} />

      {/* Ambient warm glow behind content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* NAV */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.20_0.04_245_/_0.6)] twinkle">
            <Sparkles className="h-4 w-4 text-[color:var(--gold)]" />
          </span>
          <span className="font-display text-lg tracking-tight sm:text-xl">
            A Complete <span className="gold-text">Christmas</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link className="transition hover:text-foreground" to={planLink}>Planner</Link>
          <Link className="transition hover:text-foreground" to="/inspire">Inspire</Link>
          <Link className="transition hover:text-foreground" to="/days-out">Days Out</Link>
          <Link className="transition hover:text-foreground" to="/save">Save</Link>
          <Link className="transition hover:text-foreground" to="/vip">VIP</Link>
        </nav>
        <Link
          to={planLink}
          className="hidden rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] px-4 py-2 text-xs font-medium tracking-wide text-[color:var(--gold-soft)] transition hover:bg-[oklch(0.80_0.14_85_/_0.08)] sm:inline-flex"
        >
          {user ? "Open Planner" : "Sign in"}
        </Link>

      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-5 pt-6 pb-20 text-center sm:px-8 sm:pt-10 sm:pb-28">
        <div className="rise-in mb-6 inline-flex items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.5)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)] backdrop-blur-sm">
          <span className="twinkle">✦</span> Your Christmas companion
        </div>

        <h1
          className="rise-in font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl md:text-8xl"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="block text-foreground">A Complete</span>
          <span className="block gold-text">Christmas</span>
        </h1>

        <p
          className="rise-in mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "0.15s" }}
        >
          Everything you need for a magical, stress-free Christmas — beautifully organised in one place, every year.
        </p>

        {/* Hero image with countdown card */}
        <div
          className="rise-in relative mt-12 w-full max-w-4xl"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.25)] shadow-[var(--shadow-warm)]">
            <img
              src={heroTree}
              alt="A luxurious Christmas tree glowing with gold ornaments and deep red velvet ribbons"
              width={1600}
              height={1808}
              className="h-[420px] w-full object-cover sm:h-[560px]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.12 0.03 245 / 0.3) 0%, oklch(0.12 0.03 245 / 0.1) 40%, oklch(0.12 0.03 245 / 0.85) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-6 sm:pb-10">
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)] sm:text-xs">
                Christmas Day arrives in
              </p>
              <Countdown />
            </div>
          </div>
        </div>

        {/* Four primary CTAs */}
        <div
          className="rise-in mt-10 grid w-full max-w-4xl grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-4"
          style={{ animationDelay: "0.35s" }}
        >
          {primaryActions.map(({ icon: Icon, title, desc, tone, to }) => (
            <Link
              key={title}
              to={to === "planner" ? planLink : to}
              className="group relative flex flex-col items-start gap-2 overflow-hidden rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.8)] p-4 text-left backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[oklch(0.80_0.14_85_/_0.6)] hover:shadow-[var(--shadow-glow-gold)] sm:p-5"
            >

              <span
                className={
                  "grid h-10 w-10 place-items-center rounded-xl transition-transform duration-500 group-hover:scale-110 " +
                  (tone === "cranberry"
                    ? "text-[color:var(--ivory)]"
                    : tone === "pine"
                      ? "text-[color:var(--ivory)]"
                      : tone === "gold"
                        ? "text-[color:var(--primary-foreground)]"
                        : "text-[color:var(--ivory)]")
                }
                style={{
                  background:
                    tone === "cranberry"
                      ? "var(--gradient-cranberry)"
                      : tone === "pine"
                        ? "var(--gradient-pine)"
                        : tone === "gold"
                          ? "var(--gradient-gold)"
                          : "linear-gradient(135deg, oklch(0.68 0.19 45), oklch(0.48 0.16 35))",
                }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-display text-lg leading-tight text-foreground sm:text-xl">
                {title}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {desc}
              </span>
            </Link>

          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 mx-auto max-w-6xl px-8">
        <div className="hairline-gold" />
      </div>

      {/* NEVER MISS CHRISTMAS — signature */}
      <section
        id="never-miss"
        className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
              Signature feature
            </p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              Never Miss <span className="gold-text">Christmas</span>
            </h2>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              The best Santa grottos, panto tickets and afternoon teas sell out in July.
              We'll nudge you at exactly the right moment — from booking Christmas markets
              in September to posting the last cards in December.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Book Santa & panto",
                "Reserve markets & light trails",
                "Order personalised gifts",
                "Book supermarket delivery",
                "Order the turkey",
                "Post final Christmas cards",
              ].map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-3 rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.6)] px-4 py-3"
                >
                  <BellRing className="h-4 w-4 shrink-0 text-[color:var(--gold)]" />
                  <span className="text-sm">{r}</span>
                </li>
              ))}
            </ul>
            <Link
              to={user ? "/planner/reminders" : "/auth"}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110"
              style={{ background: "var(--gradient-gold)" }}
            >
              <BellRing className="h-4 w-4" />
              {user ? "Open my timeline" : "Start my timeline"}
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-[oklch(0.80_0.14_85_/_0.08)] blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.8)] p-6 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-[color:var(--gold)]" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Your reminders
                  </span>
                </div>
                <span className="rounded-full bg-[oklch(0.42_0.16_20)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--ivory)]">
                  Live
                </span>
              </div>
              {[
                { when: "This week", what: "Book Santa's Grotto", tag: "Selling fast", tone: "ember" },
                { when: "Sep 28", what: "Reserve pantomime tickets", tag: "3 near you", tone: "pine" },
                { when: "Oct 12", what: "Order personalised gifts", tag: "6-week lead", tone: "gold" },
                { when: "Dec 8", what: "Post last 2nd-class cards", tag: "Royal Mail", tone: "cranberry" },
              ].map((r, i) => (
                <div
                  key={r.what}
                  className="flex items-center justify-between gap-3 border-t border-[oklch(0.80_0.14_85_/_0.15)] py-4 first:border-t-0"
                  style={{ animation: `rise 0.6s ${i * 0.08}s both cubic-bezier(0.22,1,0.36,1)` }}
                >
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {r.when}
                    </p>
                    <p className="mt-1 truncate font-display text-lg text-foreground">
                      {r.what}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider"
                    style={{
                      background:
                        r.tone === "ember"
                          ? "oklch(0.68 0.19 45 / 0.2)"
                          : r.tone === "pine"
                            ? "oklch(0.50 0.10 180 / 0.35)"
                            : r.tone === "gold"
                              ? "oklch(0.80 0.14 85 / 0.2)"
                              : "oklch(0.42 0.16 20 / 0.3)",
                      color:
                        r.tone === "gold"
                          ? "oklch(0.88 0.10 88)"
                          : "oklch(0.97 0.01 240)",
                    }}
                  >
                    {r.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid — the map of the platform */}
      <section id="planner" className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
            One home for every festive plan
          </p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Christmas, <span className="gold-text">completely</span> organised
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            From the first September planning list to Boxing Day leftovers —
            A Complete Christmas keeps every idea, list and reminder in one calm place.
          </p>
        </div>

        <div id="inspire" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body, image, tag, to }, i) => {
            const dest = to === "planner" ? planLink : to === "planner-reminders" ? (user ? "/planner/reminders" : "/auth") : to;
            return (
              <Link
                key={title}
                to={dest}
                className={
                  "group relative flex flex-col overflow-hidden rounded-2xl border border-[oklch(0.80_0.14_85_/_0.18)] bg-[oklch(0.26_0.04_245_/_0.6)] transition-all duration-500 hover:-translate-y-1 hover:border-[oklch(0.80_0.14_85_/_0.5)] hover:shadow-[var(--shadow-card)] " +
                  (i === 0 ? "sm:col-span-2 lg:col-span-2" : "")
                }
              >
                {image ? (
                  <div className="relative h-44 overflow-hidden sm:h-52">
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 40%, oklch(0.20 0.04 245 / 0.85) 100%)",
                      }}
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.8)]">
                      <Icon className="h-5 w-5 text-[color:var(--gold)]" />
                    </span>
                    {tag ? (
                      <span className="rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--gold-soft)]">
                        {tag}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-display text-2xl text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* VIP */}
      <section id="vip" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div
          className="relative overflow-hidden rounded-3xl border border-[oklch(0.80_0.14_85_/_0.35)] p-8 sm:p-14"
          style={{
            background:
              "radial-gradient(ellipse at top left, oklch(0.35 0.10 260 / 0.6) 0%, oklch(0.20 0.04 245) 60%), oklch(0.13 0.03 245)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "oklch(0.80 0.14 85 / 0.25)" }}
          />
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
                <Crown className="h-3 w-3" /> VIP Membership
              </div>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
                The <span className="gold-text">Golden Ticket</span> to Christmas
              </h2>
              <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
                Unlimited AI, exclusive planners, VIP competitions, early booking access,
                members-only printables — and never an advert.
              </p>
              <button
                type="button"
                className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Crown className="h-4 w-4" /> Join VIP — Early access
              </button>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "No adverts, ever",
                "Unlimited AI Assistant",
                "Exclusive planners",
                "VIP competitions",
                "Early booking access",
                "Members-only printables",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 rounded-xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.5)] px-4 py-3 text-sm"
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-[color:var(--gold)]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[oklch(0.80_0.14_85_/_0.15)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--gold)]" />
            <span className="font-display text-sm text-foreground">A Complete Christmas</span>
          </div>
          <p>Made with warmth · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
