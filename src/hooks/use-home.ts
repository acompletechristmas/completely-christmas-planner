import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DEFAULT_AREAS } from "@/lib/home/constants";

export interface HomeArea {
  id: string;
  user_id: string;
  name: string;
  is_hidden: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomeItem {
  id: string;
  user_id: string;
  area_id: string;
  name: string;
  category: string | null;
  status: string;
  already_owned: boolean;
  quantity: number | null;
  estimated_cost: number | null;
  responsible_person_id: string | null;
  responsible_name: string | null;
  look_slug: string | null;
  inspiration_slug: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * The single My Christmas Home store. Areas plus one home_items dataset —
 * "Need to buy" and "Already have" are only different readings of these rows.
 */
export function useHome(userId: string | undefined) {
  const [areas, setAreas] = useState<HomeArea[]>([]);
  const [items, setItems] = useState<HomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const seeded = useRef(false);
  const pending = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const load = useCallback(async () => {
    if (!userId) return;
    const [a, i] = await Promise.all([
      supabase.from("home_areas").select("*").order("sort_order").order("created_at"),
      supabase.from("home_items").select("*").order("sort_order").order("created_at"),
    ]);
    if (a.error || i.error) {
      console.error("[useHome] load failed", a.error ?? i.error);
      toast.error("Couldn't load your Christmas home");
      setLoading(false);
      return;
    }

    let list = (a.data ?? []) as HomeArea[];

    // First visit — create the default areas once, idempotently.
    if (list.length === 0 && !seeded.current) {
      seeded.current = true;
      const { data, error } = await supabase
        .from("home_areas")
        .insert(DEFAULT_AREAS.map((name, index) => ({ user_id: userId, name, sort_order: index })))
        .select();
      if (error) console.error("[useHome] seed failed", error);
      else list = ((data ?? []) as HomeArea[]).sort((x, y) => x.sort_order - y.sort_order);
    }

    setAreas(list);
    setItems((i.data ?? []) as HomeItem[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    void load();
  }, [userId, load]);

  const saveField = useCallback(
    (table: "home_areas" | "home_items", id: string, field: string, value: unknown, delay = 450) => {
      const key = `${table}:${id}:${field}`;
      const prev = pending.current.get(key);
      if (prev) clearTimeout(prev);
      const timer = setTimeout(async () => {
        pending.current.delete(key);
        const { error } = await supabase
          .from(table)
          .update({ [field]: value } as never)
          .eq("id", id);
        if (error) toast.error("Save failed");
      }, delay);
      pending.current.set(key, timer);
    },
    [],
  );

  // ---- Areas ---------------------------------------------------------------
  const addArea = useCallback(
    async (name: string) => {
      if (!userId || !name.trim()) return null;
      const sort_order = areas.length ? Math.max(...areas.map((a) => a.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("home_areas")
        .insert({ user_id: userId, name: name.trim(), sort_order })
        .select()
        .single();
      if (error) {
        toast.error("Couldn't add that area");
        return null;
      }
      const row = data as HomeArea;
      setAreas((p) => [...p, row]);
      return row;
    },
    [areas, userId],
  );

  const updateArea = useCallback(
    <K extends keyof HomeArea>(id: string, field: K, value: HomeArea[K]) => {
      setAreas((p) => p.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
      saveField("home_areas", id, String(field), value, field === "is_hidden" ? 0 : 450);
    },
    [saveField],
  );

  const removeArea = useCallback(async (id: string) => {
    setAreas((p) => p.filter((a) => a.id !== id));
    setItems((p) => p.filter((i) => i.area_id !== id));
    const { error } = await supabase.from("home_areas").delete().eq("id", id);
    if (error) toast.error("Couldn't remove that area");
  }, []);

  // ---- Items ---------------------------------------------------------------
  const addItem = useCallback(
    async (fields: Partial<HomeItem> & { area_id: string; name: string }) => {
      if (!userId || !fields.name.trim()) return null;
      const inArea = items.filter((i) => i.area_id === fields.area_id);
      const sort_order = inArea.length ? Math.max(...inArea.map((i) => i.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("home_items")
        .insert({ ...fields, name: fields.name.trim(), user_id: userId, sort_order })
        .select()
        .single();
      if (error) {
        toast.error("Couldn't add that");
        return null;
      }
      const row = data as HomeItem;
      setItems((p) => [...p, row]);
      return row;
    },
    [items, userId],
  );

  const updateItem = useCallback(
    <K extends keyof HomeItem>(id: string, field: K, value: HomeItem[K]) => {
      setItems((p) => p.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
      const instant = field === "status" || field === "already_owned" || field === "category";
      saveField("home_items", id, String(field), value, instant ? 0 : 450);
    },
    [saveField],
  );

  const removeItem = useCallback(async (id: string) => {
    setItems((p) => p.filter((i) => i.id !== id));
    const { error } = await supabase.from("home_items").delete().eq("id", id);
    if (error) toast.error("Couldn't remove");
  }, []);

  const itemsByArea = useMemo(() => {
    const map = new Map<string, HomeItem[]>();
    for (const i of items) map.set(i.area_id, [...(map.get(i.area_id) ?? []), i]);
    return map;
  }, [items]);

  /** Need to buy is exactly status === "buy" — nothing else. */
  const needToBuy = useMemo(() => items.filter((i) => i.status === "buy"), [items]);
  /** Already have is exactly already_owned === true, whatever the status. */
  const alreadyHave = useMemo(() => items.filter((i) => i.already_owned), [items]);

  return {
    areas,
    items,
    itemsByArea,
    needToBuy,
    alreadyHave,
    loading,
    addArea,
    updateArea,
    removeArea,
    addItem,
    updateItem,
    removeItem,
  };
}

/** An area is complete when it has items and every non-idea item is done. */
export function areaStats(list: HomeItem[]) {
  const total = list.length;
  const active = list.filter((i) => i.status !== "idea");
  const done = list.filter((i) => i.status === "done").length;
  const toDo = active.filter((i) => i.status !== "done").length;
  const toBuy = list.filter((i) => i.status === "buy").length;
  const complete = total > 0 && active.length > 0 && active.every((i) => i.status === "done");
  return { total, done, toDo, toBuy, complete };
}
