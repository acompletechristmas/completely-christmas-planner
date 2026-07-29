import type { ReactElement } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Snowfall } from "@/components/Snowfall";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight } from "lucide-react";

import heroVillage from "@/assets/hero-village.jpg";

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

      {/* =============== HERO =============== */}
      <section
        className="relative w-full"
        style={{ height: "min(85svh, 820px)", minHeight: "85svh" }}
      >
        <img
          src={heroVillage}
          alt="A magnificent Christmas tree lit with gold lights in a snowy European village at night, with a street lamp adorned with a red bow"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        {/* Cinematic vignette to keep text legible on the left */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,10,20,0.55) 0%, rgba(4,10,20,0.15) 30%, rgba(4,10,20,0.05) 55%, rgba(4,10,20,0.55) 100%), radial-gradient(ellipse at 12% 45%, rgba(4,10,20,0.75), transparent 60%)",
          }}
        />
        <Snowfall count={60} force />

        {/* Hero content: text on the left */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-start px-5 pt-24 sm:px-10 sm:pt-32">
          <div className="max-w-xl lg:max-w-2xl">
            <h1
              className="font-display leading-[1.02] tracking-tight text-[30px] sm:text-[48px] lg:text-[60px]"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.75)" }}
            >
              Plan your perfect
            </h1>
            <div
              className="script-gold leading-[0.85] text-[68px] sm:text-[120px] lg:text-[150px] -mt-1 sm:-mt-2"
              style={{ textShadow: "0 6px 40px rgba(0,0,0,0.6)" }}
            >
              Christmas
            </div>

            {/* Gold divider with centred snowflake */}
            <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
              <span
                className="h-px w-16 sm:w-24"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.82 0.14 85 / 0.8), oklch(0.82 0.14 85 / 0.9))",
                }}
              />
              <SnowflakeGlyph />
              <span
                className="h-px w-16 sm:w-24"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.82 0.14 85 / 0.9), oklch(0.82 0.14 85 / 0.8), transparent)",
                }}
              />
            </div>

            <p
              className="mt-3 max-w-[24ch] text-[14px] leading-relaxed text-[color:var(--cream)]/95 sm:mt-4 sm:max-w-md sm:text-[17px]"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.85)" }}
            >
              Everything you need for a magical, stress-free Christmas.
            </p>

            {/* Countdown gift tag */}
            <div className="mt-5 sm:mt-7">
              <CountdownGiftTag />
            </div>

            {/* Primary CTA */}
            <div className="mt-5 sm:mt-7">
              <Link to={startLink} className="btn-luxury">
                <span aria-hidden style={{ color: "oklch(0.30 0.10 55)" }}>✦</span>
                Let's start Christmas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Soft transition into cream planner section */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 z-[5] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(4,10,20,0.45) 100%)",
          }}
        />
      </section>

      {/* =============== CREAM PLANNER SECTION =============== */}
      <section
        className="relative z-10 -mt-8 sm:-mt-12"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.018 85) 0%, oklch(0.94 0.024 82) 100%)",
          borderTopLeftRadius: "50% 5vh",
          borderTopRightRadius: "50% 5vh",
          boxShadow:
            "0 -1px 0 oklch(0.82 0.14 85 / 0.55) inset, 0 -30px 60px -20px rgba(0,0,0,0.4)",
        }}
      >
        {/* Top gold hairline */}
        <div
          aria-hidden
          className="mx-auto h-px w-4/5"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.72 0.14 78 / 0.7), transparent)",
          }}
        />

        <div className="mx-auto max-w-7xl px-5 pt-5 pb-8 sm:px-10 sm:pt-8 sm:pb-12">
          <div className="text-center">
            <div
              className="mx-auto flex items-center justify-center gap-3"
              style={{ color: "oklch(0.42 0.16 30)" }}
            >
              <GoldLaurel side="left" />
              <span className="font-display tracking-[0.22em] text-[11px] sm:text-[13px] uppercase">
                Your Complete Christmas Planner
              </span>
              <GoldLaurel side="right" />
            </div>
            <div className="mx-auto mt-2 flex items-center justify-center gap-2">
              <span className="h-px w-10" style={{ background: "oklch(0.72 0.14 78 / 0.7)" }} />
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rotate-45"
                style={{
                  background: "oklch(0.55 0.20 25)",
                  boxShadow: "0 1px 3px oklch(0.30 0.15 25 / 0.5)",
                  clipPath:
                    "path('M5 0 C 3 0 0 2 0 5 C 0 7 2 8 5 10 C 8 8 10 7 10 5 C 10 2 7 0 5 0 Z')",
                }}
              />
              <span className="h-px w-10" style={{ background: "oklch(0.72 0.14 78 / 0.7)" }} />
            </div>
            <p
              className="mx-auto mt-3 max-w-xl text-[13px] leading-relaxed sm:text-[15px]"
              style={{ color: "oklch(0.35 0.03 30)" }}
            >
              Everything in one place to plan, organise and enjoy every magical moment.
            </p>
          </div>

          {/* 4 planner cards */}
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
   Snowflake glyph — small, elegant, gold
   ============================================================ */
function SnowflakeGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="oklch(0.82 0.14 85)"
      strokeWidth="1.3"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15" />
      <path d="M12 5l-1.5 1.5M12 5l1.5 1.5M12 19l-1.5-1.5M12 19l1.5-1.5M5 12l1.5-1.5M5 12l1.5 1.5M19 12l-1.5-1.5M19 12l-1.5 1.5" />
    </svg>
  );
}

/* ============================================================
   Countdown gift tag — luxury parchment tag with satin ribbon,
   metal eyelet, holly sprig, wax seal, embossed border
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
    <div className="relative inline-block max-w-[20rem] sm:max-w-sm">
      {/* Satin ribbon threaded through eyelet on the left */}
      <div
        aria-hidden
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 sm:-left-5"
        style={{ filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.55))" }}
      >
        <SatinRibbon />
      </div>

      {/* Parchment tag with shaped corner */}
      <div
        className="relative pl-10 pr-5 py-4 sm:pl-12 sm:pr-6 sm:py-5"
        style={{
          background:
            "radial-gradient(ellipse at 30% 15%, oklch(0.97 0.02 82) 0%, oklch(0.93 0.038 82) 55%, oklch(0.87 0.055 78) 100%)",
          border: "1px solid oklch(0.68 0.10 78 / 0.7)",
          boxShadow:
            "inset 0 1px 0 oklch(1 0 0 / 0.7), inset 0 0 60px oklch(0.72 0.08 78 / 0.22), 0 22px 44px -18px rgba(0,0,0,0.75)",
          color: "oklch(0.32 0.14 30)",
          /* Shaped tag: rounded on the right, angled corner on the top-left near the eyelet */
          clipPath:
            "polygon(6% 0, 100% 0, 100% 100%, 6% 100%, 0 82%, 0 18%)",
          borderRadius: "18px",
        }}
      >
        {/* Embossed inner border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-1.5 rounded-[14px]"
          style={{
            border: "1px dashed oklch(0.60 0.10 78 / 0.35)",
          }}
        />

        {/* Metal eyelet */}
        <div
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 sm:left-4"
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "999px",
            background:
              "radial-gradient(circle at 35% 30%, oklch(0.55 0.05 78) 0%, oklch(0.30 0.04 78) 60%, oklch(0.20 0.03 78) 100%)",
            boxShadow:
              "inset 0 1px 2px rgba(0,0,0,0.7), 0 0 0 1.5px oklch(0.75 0.08 78 / 0.9), 0 0 0 2.5px oklch(0.45 0.05 78 / 0.6)",
          }}
        />

        {/* "Christmas is coming" + holly sprig */}
        <div
          className="flex items-center justify-center gap-1.5 font-display italic text-[13px] sm:text-[15px]"
          style={{ color: "oklch(0.36 0.16 30)" }}
        >
          <span>Christmas is coming</span>
          <HollySprig />
        </div>

        {/* Countdown numbers */}
        <div className="mt-1.5 grid grid-cols-4 gap-1 text-center">
          {parts.map(([label, val]) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className="font-display tabular-nums text-[24px] leading-none sm:text-[30px]"
                style={{ color: "oklch(0.38 0.17 30)" }}
              >
                {ready ? String(val).padStart(2, "0") : "--"}
              </span>
              <span
                className="mt-1 text-[9px] tracking-[0.20em] sm:text-[10px]"
                style={{ color: "oklch(0.46 0.10 30)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Wax seal centred */}
        <div className="mt-2 flex items-center justify-center gap-2" aria-hidden>
          <span className="h-px w-8" style={{ background: "oklch(0.55 0.10 30 / 0.5)" }} />
          <WaxSeal />
          <span className="h-px w-8" style={{ background: "oklch(0.55 0.10 30 / 0.5)" }} />
        </div>

        <p
          className="mt-1.5 text-center font-display italic text-[11px] leading-tight sm:text-[13px]"
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

function SatinRibbon() {
  return (
    <svg width="62" height="54" viewBox="0 0 62 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="satin-red" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.68 0.22 25)" />
          <stop offset="0.45" stopColor="oklch(0.48 0.22 25)" />
          <stop offset="1" stopColor="oklch(0.30 0.18 25)" />
        </linearGradient>
        <linearGradient id="satin-hi" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="oklch(0.85 0.18 25 / 0.85)" />
          <stop offset="1" stopColor="oklch(0.55 0.22 25 / 0.05)" />
        </linearGradient>
      </defs>
      {/* Left loop */}
      <path
        d="M6 8 C 0 18, 4 26, 22 27 L 26 24 L 26 30 L 22 33 C 4 34, 0 44, 8 50 C 16 54, 26 40, 28 30 Z"
        fill="url(#satin-red)"
      />
      <path
        d="M6 8 C 0 18, 4 26, 22 27"
        stroke="url(#satin-hi)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Right loop */}
      <path
        d="M56 8 C 62 18, 58 26, 40 27 L 36 24 L 36 30 L 40 33 C 58 34, 62 44, 54 50 C 46 54, 36 40, 34 30 Z"
        fill="url(#satin-red)"
      />
      {/* Knot */}
      <rect x="26" y="20" width="10" height="14" rx="2.5" fill="oklch(0.40 0.22 25)" />
      <rect x="26" y="21" width="10" height="3" fill="url(#satin-hi)" opacity="0.9" />
      <rect x="26" y="30" width="10" height="1.5" fill="oklch(0.22 0.15 25)" opacity="0.7" />
      {/* Ribbon tail */}
      <path
        d="M28 34 L 26 52 L 34 50 L 36 34 Z"
        fill="url(#satin-red)"
      />
    </svg>
  );
}

function HollySprig() {
  return (
    <svg width="18" height="16" viewBox="0 0 20 18" fill="none" aria-hidden>
      <path
        d="M2 9 C 4 5, 7 4, 9 6 C 8 8, 6 10, 3 11 Z"
        fill="oklch(0.42 0.16 150)"
        stroke="oklch(0.32 0.14 150)"
        strokeWidth="0.5"
      />
      <path
        d="M18 9 C 16 5, 13 4, 11 6 C 12 8, 14 10, 17 11 Z"
        fill="oklch(0.42 0.16 150)"
        stroke="oklch(0.32 0.14 150)"
        strokeWidth="0.5"
      />
      <circle cx="9" cy="11" r="1.6" fill="oklch(0.55 0.22 25)" />
      <circle cx="11" cy="12.5" r="1.4" fill="oklch(0.50 0.22 25)" />
      <circle cx="8" cy="13" r="1.2" fill="oklch(0.55 0.22 25)" />
    </svg>
  );
}

function WaxSeal() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
      <defs>
        <radialGradient id="wax" cx="35%" cy="30%">
          <stop offset="0" stopColor="oklch(0.65 0.22 25)" />
          <stop offset="0.5" stopColor="oklch(0.48 0.22 25)" />
          <stop offset="1" stopColor="oklch(0.28 0.18 25)" />
        </radialGradient>
      </defs>
      <circle cx="10" cy="10" r="8.5" fill="url(#wax)" stroke="oklch(0.22 0.15 25)" strokeWidth="0.5" />
      {/* Embossed heart */}
      <path
        d="M10 14 C 5 11, 5 7, 7.5 6.5 C 9 6.3, 10 7.5, 10 8 C 10 7.5, 11 6.3, 12.5 6.5 C 15 7, 15 11, 10 14 Z"
        fill="oklch(0.28 0.18 25)"
        opacity="0.6"
      />
    </svg>
  );
}

/* ============================================================
   Planner cards — cream stationery with premium line icons
   ============================================================ */
type Tint = "burgundy" | "forest" | "navy";
const TINT: Record<Tint, string> = {
  burgundy: "oklch(0.42 0.18 28)",
  forest: "oklch(0.38 0.11 150)",
  navy: "oklch(0.36 0.10 245)",
};

function PlannerCard({
  to,
  label,
  icon: Icon,
  tint,
}: {
  to: string;
  label: string;
  icon: (p: { color: string }) => ReactElement;
  tint: Tint;
}) {
  const color = TINT[tint];
  return (
    <Link
      to={to}
      className="group relative flex flex-col items-center justify-between rounded-2xl px-3 py-4 text-center transition-all hover:-translate-y-0.5 sm:px-5 sm:py-6"
      style={{
        background: "linear-gradient(180deg, oklch(0.98 0.012 85), oklch(0.955 0.02 82))",
        border: "1px solid oklch(0.72 0.10 78 / 0.55)",
        boxShadow:
          "inset 0 1px 0 oklch(1 0 0 / 0.6), 0 10px 24px -14px rgba(60,30,10,0.28)",
      }}
    >
      {/* corner accents */}
      <span aria-hidden className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.72 0.14 78 / 0.7)" }} />
      <span aria-hidden className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.72 0.14 78 / 0.7)" }} />
      <span aria-hidden className="absolute left-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.72 0.14 78 / 0.7)" }} />
      <span aria-hidden className="absolute right-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.72 0.14 78 / 0.7)" }} />

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
        <span className="h-px w-4" style={{ background: "oklch(0.72 0.14 78 / 0.7)" }} />
        <span
          className="inline-block h-1.5 w-1.5 rotate-45"
          style={{ background: "oklch(0.55 0.20 25)" }}
        />
        <span className="h-px w-4" style={{ background: "oklch(0.72 0.14 78 / 0.7)" }} />
      </div>

      <ArrowRight
        className="mt-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        style={{ color: "oklch(0.55 0.12 78)" }}
      />
    </Link>
  );
}

/* -------- Premium line icons -------- */
function GiftIcon({ color }: { color: string }) {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* box */}
      <rect x="6" y="20" width="36" height="22" rx="1.5" />
      {/* lid */}
      <rect x="4" y="16" width="40" height="6" rx="1.5" />
      {/* vertical ribbon */}
      <path d="M24 16v26" strokeWidth="2" />
      {/* horizontal ribbon */}
      <path d="M4 22h40" strokeWidth="2" />
      {/* bow loops */}
      <path d="M24 16 C 20 10, 12 10, 12 14 C 12 17, 18 18, 24 16 Z" />
      <path d="M24 16 C 28 10, 36 10, 36 14 C 36 17, 30 18, 24 16 Z" />
      {/* bow knot */}
      <circle cx="24" cy="15" r="1.5" fill={color} stroke="none" />
    </svg>
  );
}

function TreeIcon({ color }: { color: string }) {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* star */}
      <path d="M24 3 l1.4 3 3.2.4 -2.3 2.2 .6 3.2 -2.9-1.6 -2.9 1.6 .6-3.2 -2.3-2.2 3.2-.4z" fill={color} stroke="none" />
      {/* tiered branches */}
      <path d="M24 12 l-7 10 h4 l-8 10 h5 l-9 10 h30 l-9-10 h5 l-8-10 h4 z" />
      {/* trunk */}
      <rect x="21" y="42" width="6" height="4" />
      {/* ornaments */}
      <circle cx="20" cy="26" r="0.9" fill={color} stroke="none" />
      <circle cx="28" cy="30" r="0.9" fill={color} stroke="none" />
      <circle cx="18" cy="36" r="0.9" fill={color} stroke="none" />
      <circle cx="30" cy="38" r="0.9" fill={color} stroke="none" />
      <circle cx="24" cy="34" r="0.9" fill={color} stroke="none" />
    </svg>
  );
}

function FlakeIcon({ color }: { color: string }) {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* 6 arms */}
      <g transform="translate(24 24)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <line x1="0" y1="0" x2="0" y2="-20" />
            {/* barbs near tip */}
            <line x1="0" y1="-18" x2="-3.5" y2="-14.5" />
            <line x1="0" y1="-18" x2="3.5" y2="-14.5" />
            {/* mid barbs */}
            <line x1="0" y1="-12" x2="-3" y2="-9" />
            <line x1="0" y1="-12" x2="3" y2="-9" />
            {/* inner barbs */}
            <line x1="0" y1="-6" x2="-2.2" y2="-3.8" />
            <line x1="0" y1="-6" x2="2.2" y2="-3.8" />
          </g>
        ))}
        <circle r="1.6" fill={color} stroke="none" />
      </g>
    </svg>
  );
}

function HeartIcon({ color }: { color: string }) {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M24 41 C 8 30, 6 20, 10 14 C 14 8, 22 10, 24 16 C 26 10, 34 8, 38 14 C 42 20, 40 30, 24 41 Z" />
    </svg>
  );
}

/* ============================================================
   Gold laurel leaves — flanking the planner section heading
   ============================================================ */
function GoldLaurel({ side }: { side: "left" | "right" }) {
  const flip = side === "right" ? { transform: "scaleX(-1)" } : undefined;
  return (
    <svg width="34" height="16" viewBox="0 0 40 20" fill="none" style={flip} aria-hidden>
      <path
        d="M2 10 C 12 10, 22 6, 36 4"
        stroke="oklch(0.68 0.14 78)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* leaves */}
      <path d="M10 10 c 1 -3 4 -4 6 -3 c -1 3 -4 4 -6 3 z" fill="oklch(0.75 0.13 82)" opacity="0.9" />
      <path d="M18 8 c 1 -3 4 -4 6 -3 c -1 3 -4 4 -6 3 z" fill="oklch(0.78 0.13 82)" opacity="0.9" />
      <path d="M26 6 c 1 -3 4 -4 6 -3 c -1 3 -4 4 -6 3 z" fill="oklch(0.80 0.13 82)" opacity="0.95" />
      <circle cx="36" cy="4" r="1.6" fill="oklch(0.85 0.11 85)" />
    </svg>
  );
}
