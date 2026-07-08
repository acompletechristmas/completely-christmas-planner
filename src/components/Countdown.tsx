import { useEffect, useState } from "react";

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

export function Countdown() {
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
    ["Mins", time.minutes],
    ["Secs", time.seconds],
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="flex min-w-[64px] flex-col items-center rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.14_0.02_25_/_0.6)] px-3 py-3 backdrop-blur-sm sm:min-w-[88px] sm:px-5 sm:py-4"
        >
          <span className="font-display text-3xl leading-none sm:text-5xl gold-text tabular-nums">
            {mounted ? String(value).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
