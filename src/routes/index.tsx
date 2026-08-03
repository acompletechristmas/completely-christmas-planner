
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Snowfall } from "@/components/Snowfall";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Gift, Sparkles, Music, type LucideIcon } from "lucide-react";

import heroVillage from "@/assets/hero-village.jpg";
import bowSatin from "@/assets/bow-satin.png.asset.json";

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

  const navLinks: Array<{ to: string; label: string; Icon: LucideIcon }> = [
    { to: "/planner", label: "Plan", Icon: Gift },
    { to: "/inspire", label: "Inspire", Icon: Sparkles },
    { to: "/entertainment", label: "Share & Play", Icon: Music },
  ];


  return (
    <div className="relative min-h-[100svh] text-[color:var(--cream)] overflow-hidden">
      <SiteNav />

      {/* =============== HERO =============== */}
      <section
        className="relative w-full"
        style={{ height: "min(78svh, 780px)", minHeight: "620px" }}
      >
        <img
          src={heroVillage}
          alt="A magnificent Christmas tree lit with gold lights in a snowy European village at night, with a street lamp adorned with a red bow"
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center"
          fetchPriority="high"
        />
        {/* Cinematic vignette to keep text legible on the left */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,10,20,0.48) 0%, rgba(4,10,20,0.10) 34%, rgba(4,10,20,0.04) 58%, rgba(4,10,20,0.62) 100%), linear-gradient(90deg, rgba(4,10,20,0.78) 0%, rgba(4,10,20,0.58) 28%, rgba(4,10,20,0.16) 48%, transparent 68%)",
          }}
        />
        <Snowfall count={60} force />

        {/* Hero content: text on the left */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-start px-5 pt-24 sm:px-10 sm:pt-32">
          <div className="max-w-[21rem] sm:max-w-xl lg:max-w-2xl">
            <h1
              className="font-display leading-[1.02] tracking-tight text-[31px] sm:text-[48px] lg:text-[60px]"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.75)" }}
            >
              Plan your perfect
            </h1>
            <div
              className="script-gold leading-[0.85] text-[72px] sm:text-[120px] lg:text-[150px] -mt-1 sm:-mt-2"
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

          </div>
        </div>

        {/* Primary CTA: locked below the tree, just above the cream planner section */}
        <div className="absolute inset-x-0 bottom-[96px] z-30 flex justify-center px-5 sm:bottom-[118px]">
          <Link
            to={startLink}
            className="btn-luxury min-h-[88px] w-[218px] justify-center px-6 py-4 text-center text-[14px] leading-snug sm:min-h-0 sm:w-auto sm:px-8 sm:py-4"
          >
            <span aria-hidden style={{ color: "oklch(0.30 0.10 55)" }}>✦</span>
            <span className="flex flex-col items-center leading-[1.65]">
              <span>Let's start</span>
              <span>Christmas</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>

        {/* Countdown gift tag: smaller side element, matching the approved mockup composition */}
        <div className="absolute left-1 top-[334px] z-20 origin-top-left -rotate-[5deg] scale-[0.64] sm:left-[8%] sm:top-[42%] sm:scale-[0.78] lg:left-[10%] lg:top-[44%] lg:scale-90">
          <CountdownGiftTag />
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
        className="relative z-10 -mt-14 sm:-mt-12"
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

        <div className="mx-auto max-w-7xl px-5 pt-3 pb-8 sm:px-10 sm:pt-8 sm:pb-12">
          <div className="text-center">
            <div
              className="mx-auto flex items-center justify-center gap-3"
              style={{ color: "oklch(0.42 0.16 30)" }}
            >
              <GoldLaurel side="left" />
              <span className="font-display tracking-[0.22em] text-[11px] sm:text-[13px] uppercase" style={{ color: "oklch(0.42 0.16 30)" }}>
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

            {/* Compact primary navigation row */}
            <nav className="mx-auto mt-1.5 flex items-stretch justify-between gap-0 sm:mt-3 sm:max-w-lg">
              {navLinks.map((l, i) => (
                <div key={l.label} className="contents">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="my-1 w-px shrink-0 self-stretch"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent, oklch(0.72 0.14 78 / 0.55), transparent)",
                      }}
                    />
                  )}
                  <Link
                    to={l.to}
                    className="group flex min-w-0 flex-1 flex-col items-center gap-1 px-1 transition-transform hover:-translate-y-0.5"
                  >
                    <span className="relative grid h-9 w-9 place-items-center sm:h-11 sm:w-11">
                      <span
                        aria-hidden
                        className="absolute -inset-1.5 rounded-full blur-[6px] transition-opacity group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(circle, oklch(0.80 0.14 85 / 0.55), transparent 68%)",
                          opacity: 0.8,
                        }}
                      />
                      <span
                        className="relative grid h-9 w-9 place-items-center rounded-full sm:h-11 sm:w-11"
                        style={{
                          background:
                            "linear-gradient(180deg, oklch(0.99 0.008 85), oklch(0.955 0.02 82))",
                          border: "1px solid oklch(0.72 0.12 78 / 0.5)",
                          boxShadow:
                            "inset 0 1px 0 oklch(1 0 0 / 0.75), 0 8px 18px -12px rgba(60,30,10,0.4)",
                        }}
                      >
                        <l.Icon
                          className="h-[18px] w-[18px] sm:h-5 sm:w-5"
                          strokeWidth={1.3}
                          style={{ color: "oklch(0.68 0.13 78)" }}
                        />
                      </span>
                    </span>
                    <span
                      className="whitespace-nowrap font-display text-[10.5px] uppercase tracking-[0.1em] sm:text-[13px] sm:tracking-[0.14em]"
                      style={{ color: "oklch(0.42 0.18 28)" }}
                    >
                      {l.label}
                    </span>
                  </Link>
                </div>
              ))}
            </nav>


            <p
              className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed sm:text-[15px]"
              style={{ color: "oklch(0.35 0.03 30)" }}
            >
              Everything in one place to plan, organise and enjoy every magical moment.
            </p>
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
      style={{ width: "clamp(16.75rem, 28vw, 19.5rem)" }}
    >
      {/* Red satin bow tied through the eyelet */}
      <img
        src={bowSatin.url}
        alt=""
        draggable={false}
        width={1024}
        height={1024}
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 z-30"
        style={{
          top: "-4px",
          width: "140px",
          height: "46px",
          objectFit: "contain",
          filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.55))",
        }}
      />

      {/* Parchment tag body */}
      <div
        className="relative px-4 pb-4 pt-8 sm:px-5 sm:pb-5 sm:pt-9"
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
            width: "14px",
            height: "14px",
            borderRadius: "999px",
            background:
              "radial-gradient(circle at 35% 30%, oklch(0.35 0.05 60) 0%, oklch(0.18 0.03 60) 65%, oklch(0.10 0.02 60) 100%)",
            boxShadow:
              "inset 0 1px 2px rgba(0,0,0,0.8), 0 0 0 1.5px oklch(0.68 0.12 78 / 0.95), 0 0 0 2.5px oklch(0.42 0.08 78 / 0.55), 0 1px 2px rgba(0,0,0,0.4)",
          }}
        />

        {/* Header line */}
        <div
          className="relative text-center font-display italic text-[13px] sm:text-[14px]"
          style={{ color: "oklch(0.36 0.16 30)" }}
        >
          Christmas is coming
        </div>

        {/* Countdown numbers */}
        <div className="relative mt-2 grid grid-cols-4 gap-1 text-center">
          {parts.map(([label, val]) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className="font-display tabular-nums text-[25px] leading-none sm:text-[30px]"
                style={{ color: "oklch(0.36 0.18 30)" }}
              >
                {ready ? String(val).padStart(2, "0") : "--"}
              </span>
              <span
                className="mt-1 text-[8px] tracking-[0.2em] sm:text-[9px]"
                style={{ color: "oklch(0.46 0.10 30)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer line + wax seal at lower right */}
        <p
          className="relative mt-3 pr-8 text-center font-display italic text-[10px] leading-tight sm:text-[12px]"
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
    <svg width="160" height="64" viewBox="0 0 160 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="satin-red" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.68 0.22 25)" />
          <stop offset="0.5" stopColor="oklch(0.48 0.22 25)" />
          <stop offset="1" stopColor="oklch(0.30 0.18 25)" />
        </linearGradient>
        <linearGradient id="satin-sheen" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.92 0.14 25 / 0)" />
          <stop offset="0.5" stopColor="oklch(0.90 0.16 25 / 0.7)" />
          <stop offset="1" stopColor="oklch(0.92 0.14 25 / 0)" />
        </linearGradient>
        <radialGradient id="knot-red" cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="oklch(0.52 0.22 25)" />
          <stop offset="1" stopColor="oklch(0.28 0.18 25)" />
        </radialGradient>
      </defs>

      {/* Left tail draping down with V-notch */}
      <path
        d="M74 30 L 60 62 L 52 56 L 56 46 L 46 52 L 44 40 Z"
        fill="url(#satin-red)"
      />
      {/* Right tail draping down with V-notch */}
      <path
        d="M86 30 L 100 62 L 108 56 L 104 46 L 114 52 L 116 40 Z"
        fill="url(#satin-red)"
      />

      {/* Left loop */}
      <path
        d="M78 30 C 60 12, 20 12, 12 26 C 6 36, 24 42, 46 40 C 62 38, 74 34, 78 30 Z"
        fill="url(#satin-red)"
      />
      {/* Left loop inner shadow */}
      <path
        d="M74 32 C 58 30, 36 34, 22 32"
        stroke="oklch(0.24 0.16 25 / 0.55)"
        strokeWidth="1.2"
        fill="none"
      />
      {/* Left loop sheen */}
      <path
        d="M74 26 C 56 18, 30 20, 18 28"
        stroke="url(#satin-sheen)"
        strokeWidth="2.2"
        fill="none"
      />

      {/* Right loop */}
      <path
        d="M82 30 C 100 12, 140 12, 148 26 C 154 36, 136 42, 114 40 C 98 38, 86 34, 82 30 Z"
        fill="url(#satin-red)"
      />
      {/* Right loop inner shadow */}
      <path
        d="M86 32 C 102 30, 124 34, 138 32"
        stroke="oklch(0.24 0.16 25 / 0.55)"
        strokeWidth="1.2"
        fill="none"
      />
      {/* Right loop sheen */}
      <path
        d="M86 26 C 104 18, 130 20, 142 28"
        stroke="url(#satin-sheen)"
        strokeWidth="2.2"
        fill="none"
      />

      {/* Centre knot covering the eyelet */}
      <rect x="70" y="22" width="20" height="18" rx="4" fill="url(#knot-red)" />
      <rect x="70" y="24" width="20" height="3.5" rx="1.5" fill="url(#satin-sheen)" opacity="0.9" />
      <rect x="70" y="37" width="20" height="1.6" fill="oklch(0.22 0.15 25)" opacity="0.7" />
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
