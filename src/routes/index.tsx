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
        style={{ height: "min(72svh, 760px)", minHeight: "72svh" }}
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
   Countdown gift tag — luxury parchment tag: clipped top corners,
   parchment texture, brass eyelet at top, satin ribbon threaded
   through eyelet, gold hairline border, wax seal, soft drop shadow
   ============================================================ */
function CountdownGiftTag() {
  const { d, h, m, s, ready } = useCountdown();
  const parts: Array<[string, number]> = [
    ["DAYS", d],
    ["HRS", h],
    ["MINS", m],
    ["SECS", s],
  ];

  // Tag silhouette: rounded rectangle with both top corners clipped at 45°
  const CLIP =
    "polygon(22% 0, 78% 0, 100% 14%, 100% 96%, 96% 100%, 4% 100%, 0 96%, 0 14%)";

  return (
    <div
      className="relative inline-block"
      style={{ width: "min(20rem, 88vw)" }}
    >
      {/* Ribbon threaded through the eyelet, draping to the sides */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-30"
        style={{
          top: "-18px",
          width: "200px",
          height: "56px",
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))",
        }}
      >
        <SatinRibbon />
      </div>

      {/* Parchment tag body */}
      <div
        className="relative pt-9 pb-5 px-5 sm:pt-10 sm:pb-6 sm:px-6"
        style={{
          clipPath: CLIP,
          background:
            "radial-gradient(ellipse at 30% 20%, oklch(0.97 0.024 82) 0%, oklch(0.93 0.04 82) 55%, oklch(0.86 0.06 76) 100%)",
          color: "oklch(0.32 0.14 30)",
          filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.55))",
        }}
      >
        {/* Parchment grain texture */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ mixBlendMode: "multiply", opacity: 0.35 }}
        >
          <defs>
            <filter id="parchment-grain">
              <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.10  0 0 0 0.55 0"
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#parchment-grain)" />
        </svg>

        {/* Subtle warm vignette on the parchment */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, oklch(0.55 0.10 55 / 0.18), transparent 60%)",
          }}
        />

        {/* Gold hairline inner border following the clipped tag shape */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[6px]"
          style={{
            clipPath: CLIP,
            boxShadow: "inset 0 0 0 1px oklch(0.72 0.13 78 / 0.75)",
          }}
        />

        {/* Brass eyelet at the top centre */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{
            top: "10px",
            width: "16px",
            height: "16px",
            borderRadius: "999px",
            background:
              "radial-gradient(circle at 35% 30%, oklch(0.35 0.05 60) 0%, oklch(0.18 0.03 60) 65%, oklch(0.10 0.02 60) 100%)",
            boxShadow:
              "inset 0 1px 2px rgba(0,0,0,0.8), 0 0 0 1.5px oklch(0.68 0.12 78 / 0.95), 0 0 0 2.5px oklch(0.42 0.08 78 / 0.55), 0 1px 2px rgba(0,0,0,0.4)",
          }}
        />

        {/* Header line */}
        <div
          className="relative text-center font-display italic text-[13px] sm:text-[15px]"
          style={{ color: "oklch(0.36 0.16 30)" }}
        >
          Christmas is coming
        </div>

        {/* Countdown numbers */}
        <div className="relative mt-2 grid grid-cols-4 gap-1 text-center">
          {parts.map(([label, val]) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className="font-display tabular-nums text-[26px] leading-none sm:text-[32px]"
                style={{ color: "oklch(0.36 0.18 30)" }}
              >
                {ready ? String(val).padStart(2, "0") : "--"}
              </span>
              <span
                className="mt-1 text-[9px] tracking-[0.22em] sm:text-[10px]"
                style={{ color: "oklch(0.46 0.10 30)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer line + wax seal at lower right */}
        <p
          className="relative mt-3 pr-10 text-center font-display italic text-[11px] leading-tight sm:text-[13px]"
          style={{ color: "oklch(0.42 0.10 30)" }}
        >
          A little planning today
          <br />
          means more magic in December.
        </p>

        <div
          aria-hidden
          className="absolute z-10"
          style={{
            right: "10px",
            bottom: "10px",
            filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.45))",
          }}
        >
          <WaxSeal />
        </div>
      </div>
    </div>
  );
}

function SatinRibbon() {
  return (
    <svg width="200" height="56" viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="satin-red" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.68 0.22 25)" />
          <stop offset="0.5" stopColor="oklch(0.48 0.22 25)" />
          <stop offset="1" stopColor="oklch(0.30 0.18 25)" />
        </linearGradient>
        <linearGradient id="satin-sheen" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.90 0.15 25 / 0)" />
          <stop offset="0.5" stopColor="oklch(0.88 0.16 25 / 0.55)" />
          <stop offset="1" stopColor="oklch(0.90 0.15 25 / 0)" />
        </linearGradient>
      </defs>
      {/* Left tail draping down */}
      <path
        d="M92 22 C 70 26, 40 30, 18 52 L 4 46 C 30 22, 60 14, 90 12 Z"
        fill="url(#satin-red)"
      />
      <path
        d="M90 15 C 60 17, 32 24, 10 45"
        stroke="url(#satin-sheen)"
        strokeWidth="2"
        fill="none"
      />
      {/* Right tail draping down */}
      <path
        d="M108 22 C 130 26, 160 30, 182 52 L 196 46 C 170 22, 140 14, 110 12 Z"
        fill="url(#satin-red)"
      />
      <path
        d="M110 15 C 140 17, 168 24, 190 45"
        stroke="url(#satin-sheen)"
        strokeWidth="2"
        fill="none"
      />
      {/* Center knot around the eyelet */}
      <rect x="90" y="10" width="20" height="20" rx="3" fill="oklch(0.42 0.22 25)" />
      <rect x="90" y="12" width="20" height="4" fill="url(#satin-sheen)" opacity="0.9" />
      <rect x="90" y="26" width="20" height="2" fill="oklch(0.22 0.15 25)" opacity="0.7" />
    </svg>
  );
}

function WaxSeal() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
      <defs>
        <radialGradient id="wax" cx="35%" cy="30%">
          <stop offset="0" stopColor="oklch(0.68 0.22 25)" />
          <stop offset="0.55" stopColor="oklch(0.46 0.22 25)" />
          <stop offset="1" stopColor="oklch(0.24 0.16 25)" />
        </radialGradient>
      </defs>
      {/* Irregular drips */}
      <path
        d="M17 2 C 22 2, 30 4, 31 12 C 32 20, 28 30, 20 31 C 12 32, 4 27, 3 18 C 2 9, 10 2, 17 2 Z"
        fill="url(#wax)"
        stroke="oklch(0.20 0.14 25)"
        strokeWidth="0.5"
      />
      {/* Embossed snowflake */}
      <g
        stroke="oklch(0.22 0.14 25)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.75"
        fill="none"
      >
        <path d="M17 8 v18 M8 17 h18 M11 11 l12 12 M23 11 l-12 12" />
      </g>
      <g stroke="oklch(0.88 0.12 25 / 0.35)" strokeWidth="0.6" strokeLinecap="round" fill="none">
        <path d="M17 8 v18 M8 17 h18" transform="translate(0.5 -0.5)" />
      </g>
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
