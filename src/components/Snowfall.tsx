import { useMemo } from "react";
import { useSnowfall } from "@/hooks/use-snowfall";

interface SnowfallProps {
  count?: number;
  /** Bypass the user's preference (rarely needed). */
  force?: boolean;
}

/**
 * Gentle editorial snowfall. Reads the user's preference from localStorage
 * (toggled via the footer control) and quietly renders nothing when off.
 */
export function Snowfall({ count = 28, force = false }: SnowfallProps) {
  const { enabled } = useSnowfall();

  const flakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const rand = (n: number) => {
        const x = Math.sin(i * 9301 + n * 49297) * 233280;
        return x - Math.floor(x);
      };
      const size = 2 + rand(1) * 5;
      const left = rand(2) * 100;
      const duration = 18 + rand(3) * 20;
      const delay = -rand(4) * duration;
      const drift = (rand(5) - 0.5) * 120;
      const opacity = 0.25 + rand(6) * 0.35;
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
