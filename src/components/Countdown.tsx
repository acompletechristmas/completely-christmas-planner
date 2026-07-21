import { useEffect, useMemo, useState } from "react";

function nextChristmas(now: Date) {
  const year = now.getFullYear();
  const thisYear = new Date(year, 11, 25, 0, 0, 0);
  return now > thisYear ? new Date(year + 1, 11, 25) : thisYear;
}

function diff(target: Date) {
  const now = new Date();
  const ms = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms / 3600000) % 24);
  const minutes = Math.floor((ms / 60000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds };
}

interface CountdownProps {
  /** "hero" = big centrepiece with sparkles; "inline" = compact row */
  variant?: "hero" | "inline";
}

export function Countdown({ variant = "inline" }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    const target = nextChristmas(new Date());
    const tick = () => setTime(diff(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const items: Array<[string, number]> = [
    ["Days", time.days],
    ["Hours", time.hours],
    ["Minutes", time.minutes],
    ["Seconds", time.seconds],
  ];

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin(i * 733 + n * 197) * 10000;
          return x - Math.floor(x);
        };
        return {
          id: i,
          top: r(1) * 100,
          left: r(2) * 100,
          size: 2 + r(3) * 4,
          delay: r(4) * 4,
          duration: 3 + r(5) * 4,
        };
      }),
    []
  );

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center gap-2.5 sm:gap-4">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex min-w-[64px] flex-col items-center rounded-2xl border px-3 py-3 sm:min-w-[88px] sm:px-5 sm:py-4"
            style={{
              borderColor: "oklch(0.86 0.11 85 / 0.55)",
              background:
                "linear-gradient(180deg, oklch(0.86 0.11 85 / 0.14), oklch(0.72 0.12 78 / 0.08))",
              boxShadow:
                "inset 0 1px 0 oklch(1 0 0 / 0.18), inset 0 0 24px oklch(0.86 0.11 85 / 0.15), 0 10px 30px -18px oklch(0.82 0.14 85 / 0.5)",
              backdropFilter: "blur(14px) saturate(140%)",
            }}
          >
            <span className="font-display text-3xl leading-none sm:text-5xl gold-text tabular-nums">
              {mounted ? String(value).padStart(2, "0") : "--"}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.24em] sm:text-xs" style={{ color: "oklch(0.88 0.09 85 / 0.85)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // HERO variant
  return (
    <div className="relative">
      {/* soft radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.80 0.14 85 / 0.25), transparent 60%)",
        }}
      />
      {/* sparkles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-[color:var(--gold-soft)]"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: "0 0 8px currentColor",
              animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-6">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="relative flex flex-col items-center rounded-2xl border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.18_0.04_245_/_0.55)] px-2 py-5 backdrop-blur-md sm:rounded-3xl sm:px-6 sm:py-8"
            style={{ boxShadow: "0 20px 60px -30px oklch(0.80 0.14 85 / 0.5)" }}
          >
            <span
              className="font-display gold-text tabular-nums leading-none text-[44px] sm:text-[96px] md:text-[120px]"
              style={{ textShadow: "0 0 40px oklch(0.80 0.14 85 / 0.35)" }}
            >
              {mounted ? String(value).padStart(2, "0") : "--"}
            </span>
            <span className="mt-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] sm:text-xs">
              {label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
