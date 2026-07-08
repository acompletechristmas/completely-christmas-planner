import { useMemo } from "react";

interface SnowfallProps {
  count?: number;
}

/**
 * Gentle CSS-only snowfall. Deterministic seed so SSR + client match.
 */
export function Snowfall({ count = 60 }: SnowfallProps) {
  const flakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // deterministic pseudo-random from index
      const rand = (n: number) => {
        const x = Math.sin(i * 9301 + n * 49297) * 233280;
        return x - Math.floor(x);
      };
      const size = 2 + rand(1) * 6;
      const left = rand(2) * 100;
      const duration = 8 + rand(3) * 14;
      const delay = -rand(4) * duration;
      const drift = (rand(5) - 0.5) * 120;
      const opacity = 0.4 + rand(6) * 0.5;
      return { size, left, duration, delay, drift, opacity, id: i };
    });
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ["--snow-drift" as string]: `${f.drift}px`,
            ["--snow-opacity" as string]: f.opacity,
          }}
        >
          •
        </span>
      ))}
    </div>
  );
}
