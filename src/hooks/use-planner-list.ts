import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TableName = "gifts" | "cards" | "todos" | "reminders";

export interface BaseRow {
  id: string;
  user_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Live list backed by a Supabase table + realtime channel.
 * Provides an optimistic `updateField` that debounces writes per row/field
 * so text inputs feel instant and save silently.
 */
export function usePlannerList<T extends BaseRow>(table: TableName, userId: string | undefined) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const pending = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Initial load
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) toast.error(`Couldn't load ${table}`);
      else setRows((data ?? []) as unknown as T[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [table, userId]);

  // Realtime — pick up changes made in other tabs/devices
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`${table}-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter: `user_id=eq.${userId}` },
        (payload) => {
          setRows((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as unknown as T;
              if (prev.some((r) => r.id === row.id)) return prev;
              return [...prev, row];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as unknown as T;

              return prev.map((r) => (r.id === row.id ? { ...r, ...row } : r));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as { id: string };
              return prev.filter((r) => r.id !== row.id);
            }
            return prev;
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, userId]);

  const addRow = useCallback(
    async (fields: Partial<T>) => {
      if (!userId) return;
      const nextSort = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from(table)
        .insert({ user_id: userId, sort_order: nextSort, ...fields } as never)
        .select()
        .single();
      if (error) {
        toast.error(`Couldn't add`);
        return;
      }
      setRows((prev) => (prev.some((r) => r.id === (data as unknown as T).id) ? prev : [...prev, data as unknown as T]));
    },
    [rows, table, userId],
  );

  const removeRow = useCallback(
    async (id: string) => {
      // optimistic
      setRows((prev) => prev.filter((r) => r.id !== id));
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) toast.error("Couldn't remove");
    },
    [table],
  );

  const updateField = useCallback(
    <K extends keyof T>(id: string, field: K, value: T[K]) => {
      // optimistic
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
      const key = `${id}:${String(field)}`;
      const prevTimer = pending.current.get(key);
      if (prevTimer) clearTimeout(prevTimer);
      const timer = setTimeout(async () => {
        setSaving(true);
        const { error } = await supabase
          .from(table)
          .update({ [field]: value } as never)
          .eq("id", id);
        setSaving(false);
        pending.current.delete(key);
        if (error) toast.error("Save failed");
      }, 450);
      pending.current.set(key, timer);
    },
    [table],
  );

  return { rows, loading, saving, addRow, removeRow, updateField };
}
