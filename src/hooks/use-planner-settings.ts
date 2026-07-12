import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PlannerSettings {
  user_id: string;
  budget_total: number | null;
  is_hosting: boolean;
  num_adults: number;
  num_children: number;
  is_travelling: boolean;
  sends_cards: boolean;
  decorates_indoor: boolean;
  decorates_outdoor: boolean;
  dietary_notes: string | null;
  planning_style: string;
  stress_free: boolean;
  setup_completed: boolean;
  notes: string | null;
}

const DEFAULTS: Omit<PlannerSettings, "user_id"> = {
  budget_total: null,
  is_hosting: false,
  num_adults: 0,
  num_children: 0,
  is_travelling: false,
  sends_cards: true,
  decorates_indoor: true,
  decorates_outdoor: false,
  dietary_notes: null,
  planning_style: "weekly",
  stress_free: false,
  setup_completed: false,
  notes: null,
};

export function usePlannerSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<PlannerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("planner_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        toast.error("Couldn't load planner settings");
      } else if (!data) {
        const seed = { user_id: userId, ...DEFAULTS };
        await supabase.from("planner_settings").insert(seed);
        setSettings(seed);
      } else {
        setSettings(data as PlannerSettings);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const update = useCallback(
    <K extends keyof PlannerSettings>(field: K, value: PlannerSettings[K]) => {
      if (!userId) return;
      setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
      setSaving(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        const patch = { [field]: value } as unknown as Parameters<
          ReturnType<typeof supabase.from<"planner_settings">>["update"]
        >[0];
        const { error } = await supabase
          .from("planner_settings")
          .update(patch)
          .eq("user_id", userId);
        setSaving(false);
        if (error) toast.error("Couldn't save");
      }, 400);
    },
    [userId],
  );

  return { settings, loading, saving, update };
}
