import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Tradition {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  timing: string;
  event_date: string | null;
  participants: string[];
  participant_note: string | null;
  is_annual: boolean;
  started_year: number | null;
  source: string;
  suggestion_key: string | null;
  done: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type NewTradition = Partial<
  Pick<
    Tradition,
    | "description"
    | "category"
    | "timing"
    | "event_date"
    | "participants"
    | "participant_note"
    | "is_annual"
    | "source"
    | "suggestion_key"
  >
> & { name: string };

/**
 * The single store for Our Christmas Traditions. Manually added traditions
 * and ones accepted from the inspiration catalogue live in the same list.
 */
export function useTraditions(userId: string | undefined) {
  const [traditions, setTraditions] = useState<Tradition[]>([]);
  const [loading, setLoading] = useState(true);
  const pending = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("traditions")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error("[useTraditions] load failed", error);
        toast.error("Couldn't load your traditions");
      } else {
        setTraditions((data ?? []) as Tradition[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const add = useCallback(
    async (input: NewTradition) => {
      if (!userId || !input.name.trim()) return null;
      const sort_order = traditions.length ? Math.max(...traditions.map((t) => t.sort_order)) + 1 : 0;
      const row = {
        user_id: userId,
        sort_order,
        ...input,
        name: input.name.trim(),
      };
      const { data, error } = await supabase.from("traditions").insert(row).select().single();
      if (error) {
        console.error("[useTraditions] add failed", error);
        toast.error("Couldn't save that tradition");
        return null;
      }
      const saved = data as Tradition;
      setTraditions((prev) => [...prev, saved]);
      return saved;
    },
    [userId, traditions],
  );

  /** Optimistic, debounced field save — text inputs feel instant. */
  const update = useCallback(
    <K extends keyof Tradition>(id: string, field: K, value: Tradition[K], delay = 450) => {
      setTraditions((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
      const key = `${id}:${String(field)}`;
      const prevTimer = pending.current.get(key);
      if (prevTimer) clearTimeout(prevTimer);
      const timer = setTimeout(async () => {
        pending.current.delete(key);
        const { error } = await supabase
          .from("traditions")
          .update({ [field]: value } as never)
          .eq("id", id);
        if (error) toast.error("Save failed");
      }, delay);
      pending.current.set(key, timer);
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    setTraditions((prev) => prev.filter((t) => t.id !== id));
    const { error } = await supabase.from("traditions").delete().eq("id", id);
    if (error) toast.error("Couldn't remove that tradition");
  }, []);

  return { traditions, loading, add, update, remove };
}
