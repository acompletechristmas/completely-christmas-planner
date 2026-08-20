import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type WatchlistContentType =
  | "film"
  | "tv_special"
  | "episode"
  | "series"
  | "other";

export interface WatchlistItem {
  id: string;
  user_id: string;
  title: string;
  content_type: WatchlistContentType | null;
  year: number | null;
  short_note: string | null;
  age_guidance: string | null;
  participants: string[];
  participant_note: string | null;
  timing: string | null;
  mood_tags: string[];
  watched: boolean;
  favourite: boolean;
  annual_tradition: boolean;
  source: string;
  recommendation_key: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type NewWatchlistItem = Partial<
  Pick<
    WatchlistItem,
    | "content_type"
    | "year"
    | "short_note"
    | "age_guidance"
    | "participants"
    | "participant_note"
    | "timing"
    | "mood_tags"
    | "watched"
    | "favourite"
    | "annual_tradition"
    | "source"
    | "recommendation_key"
  >
> & { title: string };

/**
 * Single source of truth for My Christmas Watchlist.
 * Manually added titles and recommendations accepted from the catalogue
 * live in the same dataset, fully editable.
 */
export function useWatchlist(userId: string | undefined) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pending = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("watchlist_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error("[useWatchlist] load failed", error);
        toast.error("Couldn't load your watchlist");
      } else {
        setItems((data ?? []) as WatchlistItem[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const add = useCallback(
    async (input: NewWatchlistItem) => {
      if (!userId || !input.title.trim()) return null;
      const sort_order = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
      const row = {
        user_id: userId,
        sort_order,
        content_type: null,
        year: null,
        short_note: null,
        age_guidance: null,
        participants: [],
        participant_note: null,
        timing: null,
        mood_tags: [],
        watched: false,
        favourite: false,
        annual_tradition: false,
        source: "manual",
        recommendation_key: null,
        ...input,
        title: input.title.trim(),
      };
      const { data, error } = await supabase.from("watchlist_items").insert(row).select().single();
      if (error) {
        console.error("[useWatchlist] add failed", error);
        toast.error("Couldn't save that title");
        return null;
      }
      const saved = data as WatchlistItem;
      setItems((prev) => [...prev, saved]);
      return saved;
    },
    [userId, items],
  );

  /** Optimistic, debounced field save. */
  const update = useCallback(
    <K extends keyof WatchlistItem>(id: string, field: K, value: WatchlistItem[K], delay = 450) => {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
      const key = `${id}:${String(field)}`;
      const prevTimer = pending.current.get(key);
      if (prevTimer) clearTimeout(prevTimer);
      const timer = setTimeout(async () => {
        pending.current.delete(key);
        const { error } = await supabase
          .from("watchlist_items")
          .update({ [field]: value } as never)
          .eq("id", id);
        if (error) {
          console.error("[useWatchlist] update failed", error);
          toast.error("Save failed");
        }
      }, delay);
      pending.current.set(key, timer);
    },
    [],
  );

  /** Immediate save for booleans (watched, favourite, annual). */
  const toggle = useCallback(async <K extends "watched" | "favourite" | "annual_tradition">(
    id: string,
    field: K,
    value: boolean,
  ) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    const { error } = await supabase
      .from("watchlist_items")
      .update({ [field]: value } as never)
      .eq("id", id);
    if (error) {
      console.error("[useWatchlist] toggle failed", error);
      toast.error("Save failed");
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("watchlist_items").delete().eq("id", id);
    if (error) {
      console.error("[useWatchlist] remove failed", error);
      toast.error("Couldn't remove that title");
    }
  }, []);

  return { items, loading, add, update, toggle, remove };
}
