import { useMemo } from "react";

interface SnowfallProps {
  count?: number;
  showStars?: boolean;
}

/**
 * Winter-wonderland snowfall + gentle starfield. Deterministic seed so SSR + client match.
 */
export function Snowfall({ count = 80, showStars = true }: SnowfallProps) {
  const flakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const rand = (n: number) => {
        const x = Math.sin(i * 9301 + n * 49297) * 233280;
        return x - Math.floor(x);
      };
      const size = 2 + rand(1) * 8;
      const left = rand(2) * 100;
      const duration = 10 + rand(3) * 16;
      const delay = -rand(4) * duration;
      const drift = (rand(5) - 0.5) * 160;
      const opacity = 0.35 + rand(6) * 0.55;
      const glyph = rand(7) > 0.82 ? "✦" : rand(7) > 0.55 ? "❋" : "•";
      return { size, left, duration, delay, drift, opacity, glyph, id: i };
    });
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {showStars && (
        <div className="starfield absolute inset-0 opacity-70" />
      )}
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
          {f.glyph}
        </span>
      ))}
    </div>
  );
}
