import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type MusicItemType = "song" | "album" | "playlist_idea" | "artist" | "other";

export interface MusicItem {
  id: string;
  user_id: string;
  title: string;
  artist: string | null;
  item_type: MusicItemType;
  moment: string;
  moods: string[];
  /** People ids, exactly as Traditions and Watchlist store them. */
  participants: string[];
  /** Free text only — "Everyone", "just the children", and so on. */
  participant_note: string | null;
  is_favourite: boolean;
  is_annual: boolean;
  notes: string | null;
  source: string;
  suggestion_key: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type NewMusicItem = Partial<
  Pick<
    MusicItem,
    | "artist"
    | "item_type"
    | "moment"
    | "moods"
    | "participants"
    | "participant_note"
    | "is_favourite"
    | "is_annual"
    | "notes"
    | "source"
    | "suggestion_key"
  >
> & { title: string };

/**
 * Single source of truth for My Christmas Music.
 * Manually added music and accepted suggestions live in the same dataset
 * and are equally editable.
 */
export function useMusic(userId: string | undefined) {
  const [items, setItems] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pending = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("music_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error("[useMusic] load failed", error);
        toast.error("Couldn't load your music");
      } else {
        setItems((data ?? []) as unknown as MusicItem[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`music_items-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "music_items", filter: `user_id=eq.${userId}` },
        (payload) => {
          setItems((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as unknown as MusicItem;
              return prev.some((i) => i.id === row.id) ? prev : [...prev, row];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as unknown as MusicItem;
              return prev.map((i) => (i.id === row.id ? { ...i, ...row } : i));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as { id: string };
              return prev.filter((i) => i.id !== row.id);
            }
            return prev;
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const add = useCallback(
    async (input: NewMusicItem) => {
      if (!userId || !input.title.trim()) return null;
      const sort_order = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
      const row = {
        user_id: userId,
        sort_order,
        artist: null,
        item_type: "song" as MusicItemType,
        moment: "any_time",
        moods: [] as string[],
        participants: [] as string[],
        participant_note: null,
        is_favourite: false,
        is_annual: false,
        notes: null,
        source: "manual",
        suggestion_key: null,
        ...input,
        title: input.title.trim(),
      };
      const { data, error } = await supabase.from("music_items").insert(row).select().single();
      if (error) {
        console.error("[useMusic] add failed", error);
        toast.error("Couldn't save that");
        return null;
      }
      const saved = data as unknown as MusicItem;
      setItems((prev) => (prev.some((i) => i.id === saved.id) ? prev : [...prev, saved]));
      return saved;
    },
    [userId, items],
  );

  /** Optimistic, debounced field save. */
  const update = useCallback(
    <K extends keyof MusicItem>(id: string, field: K, value: MusicItem[K], delay = 450) => {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
      const key = `${id}:${String(field)}`;
      const prevTimer = pending.current.get(key);
      if (prevTimer) clearTimeout(prevTimer);
      const timer = setTimeout(async () => {
        pending.current.delete(key);
        const { error } = await supabase
          .from("music_items")
          .update({ [field]: value } as never)
          .eq("id", id);
        if (error) {
          console.error("[useMusic] update failed", error);
          toast.error("Save failed");
        }
      }, delay);
      pending.current.set(key, timer);
    },
    [],
  );

  /** Immediate save for booleans. */
  const toggle = useCallback(
    async <K extends "is_favourite" | "is_annual">(id: string, field: K, value: boolean) => {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
      const { error } = await supabase
        .from("music_items")
        .update({ [field]: value } as never)
        .eq("id", id);
      if (error) {
        console.error("[useMusic] toggle failed", error);
        toast.error("Save failed");
      }
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("music_items").delete().eq("id", id);
    if (error) {
      console.error("[useMusic] remove failed", error);
      toast.error("Couldn't remove that");
    }
  }, []);

  return { items, loading, add, update, toggle, remove };
}
