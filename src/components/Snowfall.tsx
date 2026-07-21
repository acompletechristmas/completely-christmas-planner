import { useMemo } from "react";
import { useSnowfall } from "@/hooks/use-snowfall";

interface SnowfallProps {
  count?: number;
  /** Bypass the user's preference (rarely needed). */
  force?: boolean;
}

/**
 * Luxury editorial snowfall — larger, softly blurred flakes with a slight
 * sideways drift, plus a scatter of warm gold sparkles.
 */
export function Snowfall({ count = 28, force = false }: SnowfallProps) {
  const { enabled } = useSnowfall();

  const flakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const rand = (n: number) => {
        const x = Math.sin(i * 9301 + n * 49297) * 233280;
        return x - Math.floor(x);
      };
      // 4–12px flakes, larger ones fall slower for parallax feel
      const size = 4 + rand(1) * 8;
      const left = rand(2) * 100;
      // Bigger = slower, gentler descent
      const duration = 22 + (12 - size) * 1.6 + rand(3) * 14;
      const delay = -rand(4) * duration;
      const drift = (rand(5) - 0.5) * 160;
      const opacity = 0.55 + rand(6) * 0.4;
      return { size, left, duration, delay, drift, opacity, id: i };
    });
  }, [count]);

  const sparkles = useMemo(() => {
    const n = Math.max(4, Math.round(count * 0.12));
    return Array.from({ length: n }, (_, i) => {
      const rand = (k: number) => {
        const x = Math.sin(i * 7307 + k * 1543) * 100000;
        return x - Math.floor(x);
      };
      const size = 2 + rand(1) * 3;
      const left = rand(2) * 100;
      const duration = 26 + rand(3) * 18;
      const delay = -rand(4) * duration;
      const drift = (rand(5) - 0.5) * 100;
      const opacity = 0.7 + rand(6) * 0.3;
      return { size, left, duration, delay, drift, opacity, id: i };
    });
  }, [count]);

  if (!enabled && !force) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {flakes.map((f) => (
        <span
          key={`s-${f.id}`}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ["--snow-drift" as string]: `${f.drift}px`,
            ["--snow-opacity" as string]: f.opacity,
          }}
        />
      ))}
      {sparkles.map((f) => (
        <span
          key={`g-${f.id}`}
          className="snow-sparkle"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ["--snow-drift" as string]: `${f.drift}px`,
            ["--snow-opacity" as string]: f.opacity,
          }}
        />
      ))}
    </div>
  );
}
