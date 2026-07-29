import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Snowfall } from "@/components/Snowfall";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Gift, TreePine, Snowflake, Heart } from "lucide-react";

import heroRoom from "@/assets/hero-room.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Complete Christmas — Plan your perfect Christmas" },
      {
        name: "description",
        content:
          "Everything you need for a magical, stress-free Christmas — plan gifts, food, decorations and days out in one calm, beautiful place.",
      },
      { property: "og:title", content: "A Complete Christmas — Plan your perfect Christmas" },
      {
        property: "og:description",
        content:
          "Everything you need for a magical, stress-free Christmas — in one calm, beautiful place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://acompletechristmas.co.uk/" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/" }],
  }),
  component: Home,
});

function nextChristmas(now: Date) {
  const y = now.getFullYear();
  const dec25 = new Date(y, 11, 25, 0, 0, 0);
  return now > dec25 ? new Date(y + 1, 11, 25) : dec25;
}

function useCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, ready: false });
  useEffect(() => {
    const target = nextChristmas(new Date());
    const tick = () => {
      const ms = Math.max(0, target.getTime() - Date.now());
      setT({
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms / 3600000) % 24),
        m: Math.floor((ms / 60000) % 60),
        s: Math.floor((ms / 1000) % 60),
        ready: true,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function Home() {
  const { user } = useAuth();
  const startLink = user ? "/planner" : "/build";

  const cards = [
    { to: "/planner", label: "Plan", icon: GiftIcon, tint: "burgundy" as const },
    { to: "/inspire", label: "Experience", icon: TreeIcon, tint: "forest" as const },
    { to: "/inspire", label: "Create", icon: FlakeIcon, tint: "navy" as const },
    { to: "/entertainment", label: "Share & Play", icon: HeartIcon, tint: "burgundy" as const },
  ];

  return (
    <div className="relative min-h-[100svh] text-[color:var(--cream)] overflow-hidden">
      <SiteNav />

      {/* =============== HERO — fills first screen =============== */}
      <section className="relative w-full" style={{ height: "min(100svh, 900px)", minHeight: "100svh" }}>
        {/* Christmas tree / fireplace scene */}
        <img
          src={heroRoom}
          alt="A magnificent Christmas tree glowing beside a warm fireplace"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        {/* Cinematic vignette + gold bloom on the tree */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 78% 45%, oklch(0.86 0.13 82 / 0.28), transparent 55%), linear-gradient(180deg, rgba(4,10,20,0.55) 0%, rgba(4,10,20,0.15) 25%, rgba(4,10,20,0.10) 55%, rgba(4,10,20,0.55) 100%), radial-gradient(ellipse at 15% 40%, rgba(0,0,0,0.55), transparent 60%)",
          }}
        />
        <Snowfall count={70} force />

        {/* Hero content: text left, tree stays visible right */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-5 pt-20 pb-[34vh] sm:px-10 sm:pt-28 sm:pb-[32vh] lg:pb-[30vh]">
          <div className="max-w-xl lg:max-w-2xl">
            <h1
              className="font-display leading-[1.02] tracking-tight text-[32px] sm:text-[52px] lg:text-[68px]"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.75)" }}
            >
              Plan your perfect
              <br />
              <span
                className="italic gold-text block"
                style={{ fontSize: "1.35em", lineHeight: 1, letterSpacing: "-0.01em" }}
              >
                Christmas
              </span>
            </h1>

            {/* small snowflake divider */}
            <div className="mt-3 flex items-center gap-3 text-[color:var(--gold)]/70 sm:mt-4">
              <span className="h-px w-10 bg-[color:var(--gold)]/50" />
              <Snowflake className="h-4 w-4" strokeWidth={1.5} />
              <span className="h-px w-10 bg-[color:var(--gold)]/50" />
            </div>

            <p
              className="mt-3 max-w-[22ch] text-[14px] leading-relaxed text-[color:var(--cream)]/90 sm:mt-5 sm:max-w-md sm:text-[17px]"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              Everything you need for a magical, stress-free Christmas.
            </p>

            {/* Countdown gift tag */}
            <div className="mt-5 sm:mt-8">
              <CountdownGiftTag />
            </div>

            {/* Primary CTA */}
            <div className="mt-5 sm:mt-7">
              <Link to={startLink} className="btn-festive text-[13px] sm:text-[15px]">
                <span className="text-[color:var(--gold)]">✦</span>
                LET'S START CHRISTMAS
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Curved transition into cream planner section */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[32vh] sm:h-[30vh] lg:h-[30vh] z-[5] pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(4,10,20,0.35) 40%, transparent 100%)",
          }}
        />
      </section>

      {/* =============== CREAM PLANNER SECTION (overlaps hero via curve) =============== */}
      <section
        className="relative z-10 -mt-[30vh] sm:-mt-[28vh] lg:-mt-[28vh]"
        style={{
          background: "linear-gradient(180deg, oklch(0.96 0.018 85) 0%, oklch(0.94 0.024 82) 100%)",
          borderTopLeftRadius: "50% 6vh",
          borderTopRightRadius: "50% 6vh",
          boxShadow:
            "0 -1px 0 oklch(0.82 0.14 85 / 0.55) inset, 0 -30px 60px -20px rgba(0,0,0,0.35)",
        }}
      >
        {/* subtle top gold hairline */}
        <div
          aria-hidden
          className="mx-auto h-px w-4/5"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.72 0.14 78 / 0.6), transparent)",
          }}
        />

        <div className="mx-auto max-w-7xl px-5 pt-6 pb-8 sm:px-10 sm:pt-9 sm:pb-12">
          {/* Section header */}
          <div className="text-center">
            <div
              className="mx-auto flex items-center justify-center gap-3"
              style={{ color: "oklch(0.45 0.16 30)" }}
            >
              <Sprig side="left" />
              <span className="font-display tracking-[0.24em] text-[11px] sm:text-[13px] uppercase">
                Your Complete Christmas Planner
              </span>
              <Sprig side="right" />
            </div>
            <div className="mx-auto mt-2 flex items-center justify-center gap-2">
              <span className="h-px w-8" style={{ background: "oklch(0.72 0.14 78 / 0.6)" }} />
              <Heart className="h-3 w-3" style={{ color: "oklch(0.55 0.16 30)" }} fill="currentColor" strokeWidth={0} />
              <span className="h-px w-8" style={{ background: "oklch(0.72 0.14 78 / 0.6)" }} />
            </div>
            <p
              className="mx-auto mt-3 max-w-xl text-[13px] leading-relaxed sm:text-[15px]"
              style={{ color: "oklch(0.35 0.03 30)" }}
            >
              Everything in one place to plan, organise and enjoy every magical moment.
            </p>
          </div>

          {/* 4 planner cards — 2×2 on mobile, 4-across on desktop */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 lg:grid-cols-4">
            {cards.map((c) => (
              <PlannerCard key={c.label} {...c} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   Countdown "gift tag" — parchment card with red satin ribbon
   ============================================================ */
function CountdownGiftTag() {
  const { d, h, m, s, ready } = useCountdown();
  const parts: Array<[string, number]> = [
    ["DAYS", d],
    ["HRS", h],
    ["MINS", m],
    ["SECS", s],
  ];
  return (
    <div className="relative inline-block max-w-[19rem] sm:max-w-sm">
      {/* Red satin ribbon on the left */}
      <div
        aria-hidden
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 sm:-left-4"
        style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.5))" }}
      >
        <RibbonBow />
      </div>

      {/* Parchment tag */}
      <div
        className="relative rounded-[22px] pl-8 pr-4 py-3.5 sm:pl-10 sm:pr-5 sm:py-4"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, oklch(0.97 0.02 82) 0%, oklch(0.93 0.035 82) 55%, oklch(0.88 0.05 78) 100%)",
          border: "1px solid oklch(0.72 0.09 78 / 0.55)",
          boxShadow:
            "inset 0 1px 0 oklch(1 0 0 / 0.6), inset 0 0 40px oklch(0.75 0.08 78 / 0.18), 0 20px 40px -18px rgba(0,0,0,0.7)",
          color: "oklch(0.32 0.14 30)",
        }}
      >
        {/* tag punch hole */}
        <div
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full sm:left-4"
          style={{
            background: "oklch(0.55 0.05 78)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px oklch(0.72 0.09 78 / 0.6)",
          }}
        />

        <div
          className="text-center font-display italic text-[13px] sm:text-[15px]"
          style={{ color: "oklch(0.35 0.14 30)" }}
        >
          Christmas is coming
          <span className="ml-1.5" aria-hidden style={{ color: "oklch(0.45 0.20 145)" }}>❦</span>
        </div>

        <div className="mt-1.5 grid grid-cols-4 gap-1 text-center">
          {parts.map(([label, val]) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className="font-display tabular-nums text-[22px] leading-none sm:text-[28px]"
                style={{ color: "oklch(0.38 0.16 30)" }}
              >
                {ready ? String(val).padStart(2, "0") : "--"}
              </span>
              <span
                className="mt-0.5 text-[8.5px] tracking-[0.18em] sm:text-[9.5px]"
                style={{ color: "oklch(0.45 0.10 30)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-1.5 flex items-center justify-center gap-1.5" aria-hidden>
          <span className="h-px w-6" style={{ background: "oklch(0.55 0.10 30 / 0.5)" }} />
          <Heart className="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} style={{ color: "oklch(0.55 0.20 30)" }} />
          <span className="h-px w-6" style={{ background: "oklch(0.55 0.10 30 / 0.5)" }} />
        </div>

        <p
          className="mt-1 text-center font-display italic text-[10.5px] leading-tight sm:text-[12px]"
          style={{ color: "oklch(0.42 0.10 30)" }}
        >
          A little planning today
          <br />
          means more magic in December.
        </p>
      </div>
    </div>
  );
}

function RibbonBow() {
  return (
    <svg width="54" height="46" viewBox="0 0 54 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ribbon-r" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.62 0.22 25)" />
          <stop offset="0.5" stopColor="oklch(0.50 0.22 25)" />
          <stop offset="1" stopColor="oklch(0.35 0.20 25)" />
        </linearGradient>
        <linearGradient id="ribbon-hi" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="oklch(0.75 0.20 25 / 0.7)" />
          <stop offset="1" stopColor="oklch(0.50 0.22 25 / 0.1)" />
        </linearGradient>
      </defs>
      {/* left loop */}
      <path
        d="M4 6 C 0 14, 4 22, 18 23 L 22 21 L 22 25 L 18 27 C 4 28, 0 36, 6 42 C 12 46, 22 34, 24 26 Z"
        fill="url(#ribbon-r)"
      />
      {/* right loop */}
      <path
        d="M50 6 C 54 14, 50 22, 36 23 L 32 21 L 32 25 L 36 27 C 50 28, 54 36, 48 42 C 42 46, 32 34, 30 26 Z"
        fill="url(#ribbon-r)"
      />
      {/* knot */}
      <rect x="22" y="18" width="10" height="12" rx="2" fill="oklch(0.42 0.22 25)" />
      <rect x="22" y="19" width="10" height="2" fill="url(#ribbon-hi)" opacity="0.8" />
    </svg>
  );
}

/* ============================================================
   Planner cards — cream stationery with elegant line icons
   ============================================================ */
type Tint = "burgundy" | "forest" | "navy";
const TINT: Record<Tint, string> = {
  burgundy: "oklch(0.45 0.18 28)",
  forest: "oklch(0.38 0.10 150)",
  navy: "oklch(0.35 0.10 245)",
};

function PlannerCard({
  to,
  label,
  icon: Icon,
  tint,
}: {
  to: string;
  label: string;
  icon: (p: { color: string }) => JSX.Element;
  tint: Tint;
}) {
  const color = TINT[tint];
  return (
    <Link
      to={to}
      className="group relative flex flex-col items-center justify-between rounded-2xl px-3 py-4 text-center transition-all hover:-translate-y-0.5 sm:px-5 sm:py-6"
      style={{
        background: "linear-gradient(180deg, oklch(0.98 0.012 85), oklch(0.955 0.02 82))",
        border: "1px solid oklch(0.75 0.08 78 / 0.45)",
        boxShadow:
          "inset 0 1px 0 oklch(1 0 0 / 0.6), 0 8px 20px -12px rgba(60,30,10,0.25)",
      }}
    >
      {/* corner accents */}
      <span aria-hidden className="absolute left-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: "oklch(0.72 0.14 78 / 0.6)" }} />
      <span aria-hidden className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: "oklch(0.72 0.14 78 / 0.6)" }} />
      <span aria-hidden className="absolute left-1.5 bottom-1.5 h-2 w-2 rounded-full" style={{ background: "oklch(0.72 0.14 78 / 0.6)" }} />
      <span aria-hidden className="absolute right-1.5 bottom-1.5 h-2 w-2 rounded-full" style={{ background: "oklch(0.72 0.14 78 / 0.6)" }} />

      <div className="mt-1 grid place-items-center">
        <Icon color={color} />
      </div>

      <div
        className="mt-3 font-display tracking-[0.14em] text-[12px] uppercase sm:text-[15px]"
        style={{ color }}
      >
        {label}
      </div>

      <div className="mt-2 flex items-center gap-1.5" aria-hidden>
        <span className="h-px w-4" style={{ background: "oklch(0.72 0.14 78 / 0.6)" }} />
        <Heart className="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} style={{ color: "oklch(0.72 0.14 78)" }} />
        <span className="h-px w-4" style={{ background: "oklch(0.72 0.14 78 / 0.6)" }} />
      </div>

      <ArrowRight
        className="mt-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        style={{ color: "oklch(0.55 0.12 78)" }}
      />
    </Link>
  );
}

/* -------- Elegant line icons (custom, not emoji) -------- */
function GiftIcon({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="18" width="36" height="24" rx="2" />
      <path d="M6 26h36" />
      <path d="M24 18v24" />
      <path d="M24 18c-4-6-12-6-12-2s6 2 12 2z" />
      <path d="M24 18c4-6 12-6 12-2s-6 2-12 2z" />
    </svg>
  );
}
function TreeIcon({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4l-8 12h4l-8 12h5l-9 12h32l-9-12h5l-8-12h4z" />
      <rect x="21" y="40" width="6" height="4" />
      <path d="M24 6l1.2 2-.6.4L24 7l-.6 1.4-.6-.4z" fill={color} />
    </svg>
  );
}
function FlakeIcon({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4v40M4 24h40M9 9l30 30M39 9L9 39" />
      <path d="M24 10l-3 3M24 10l3 3M24 38l-3-3M24 38l3-3M10 24l3-3M10 24l3 3M38 24l-3-3M38 24l-3 3" />
    </svg>
  );
}
function HeartIcon({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 40S8 30 8 18a8 8 0 0 1 16-4 8 8 0 0 1 16 4c0 12-16 22-16 22z" />
    </svg>
  );
}

function Sprig({ side }: { side: "left" | "right" }) {
  const flip = side === "right" ? { transform: "scaleX(-1)" } : undefined;
  return (
    <svg width="28" height="14" viewBox="0 0 40 20" fill="none" style={flip} aria-hidden>
      <path d="M2 10 C 10 10, 18 6, 30 4" stroke="oklch(0.42 0.14 150)" strokeWidth="1.2" fill="none" />
      <path d="M10 10 c 2 -3 6 -4 8 -3" stroke="oklch(0.42 0.14 150)" strokeWidth="1.2" fill="none" />
      <path d="M18 8 c 2 -3 6 -4 8 -3" stroke="oklch(0.42 0.14 150)" strokeWidth="1.2" fill="none" />
      <circle cx="32" cy="4" r="1.8" fill="oklch(0.55 0.20 30)" />
    </svg>
  );
}
