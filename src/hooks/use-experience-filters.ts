import { useMemo, useState, useCallback } from "react";
import {
  EXPERIENCES,
  type Audience,
  type Experience,
  type ExperienceType,
  type PriceBand,
  type Setting,
  type TimeOfDay,
} from "@/lib/days-out/experience-data";

export interface ExperienceFilters {
  price: PriceBand[];
  audience: Audience[];
  time: TimeOfDay[];
  setting: Setting[];
  type: ExperienceType[];
}

const EMPTY: ExperienceFilters = { price: [], audience: [], time: [], setting: [], type: [] };

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * Single seam for future live data: swap EXPERIENCES for an API/query result
 * and the whole page keeps working unchanged.
 */
export function useExperienceFilters(source: Experience[] = EXPERIENCES) {
  const [filters, setFilters] = useState<ExperienceFilters>(EMPTY);

  const toggleFilter = useCallback(
    <K extends keyof ExperienceFilters>(group: K, value: ExperienceFilters[K][number]) => {
      setFilters((prev) => ({ ...prev, [group]: toggle(prev[group] as never[], value as never) }));
    },
    [],
  );

  const clear = useCallback(() => setFilters(EMPTY), []);

  const activeCount = useMemo(
    () => Object.values(filters).reduce((n, list) => n + list.length, 0),
    [filters],
  );

  const results = useMemo(
    () =>
      source.filter((e) => {
        if (filters.price.length && !filters.price.includes(e.priceBand)) return false;
        if (filters.setting.length && !filters.setting.includes(e.setting)) return false;
        if (filters.type.length && !filters.type.includes(e.type)) return false;
        if (filters.audience.length && !filters.audience.some((a) => e.audiences.includes(a)))
          return false;
        if (filters.time.length && !filters.time.some((t) => e.timeOfDay.includes(t))) return false;
        return true;
      }),
    [source, filters],
  );

  return { filters, toggleFilter, clear, activeCount, results };
}
