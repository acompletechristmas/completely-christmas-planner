import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { defaultOccasions } from "@/lib/food/constants";
import type { FoodGuest, FoodItem, FoodOccasion, FoodShoppingItem } from "@/lib/food/types";

/**
 * The single Christmas Food Planner store. Occasions, dishes, guests and the
 * one shopping list all load here — shopping and preparation views are just
 * different readings of this same data.
 */
export function useFood(userId: string | undefined) {
  const [occasions, setOccasions] = useState<FoodOccasion[]>([]);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [guests, setGuests] = useState<FoodGuest[]>([]);
  const [shopping, setShopping] = useState<FoodShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const seeded = useRef(false);
  const pending = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const load = useCallback(async () => {
    if (!userId) return;
    const [o, i, g, s] = await Promise.all([
      supabase.from("food_occasions").select("*").order("sort_order").order("created_at"),
      supabase.from("food_items").select("*").order("sort_order").order("created_at"),
      supabase.from("food_occasion_guests").select("*").order("sort_order").order("created_at"),
      supabase.from("food_shopping_items").select("*").order("sort_order").order("created_at"),
    ]);
    if (o.error || i.error || g.error || s.error) {
      console.error("[useFood] load failed", o.error ?? i.error ?? g.error ?? s.error);
      toast.error("Couldn't load your food plan");
      setLoading(false);
      return;
    }
    let occ = (o.data ?? []) as FoodOccasion[];

    // First visit — create the three default occasions for the active year.
    if (occ.length === 0 && !seeded.current) {
      seeded.current = true;
      const { data, error } = await supabase
        .from("food_occasions")
        .insert(defaultOccasions().map((d) => ({ ...d, user_id: userId, is_default: true })))
        .select();
      if (error) console.error("[useFood] seed failed", error);
      else occ = (data ?? []) as FoodOccasion[];
      occ = [...occ].sort((a, b) => a.sort_order - b.sort_order);
    }

    setOccasions(occ);
    setItems((i.data ?? []) as FoodItem[]);
    setGuests((g.data ?? []) as FoodGuest[]);
    setShopping((s.data ?? []) as FoodShoppingItem[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    void load();
  }, [userId, load]);

  /** Debounced field save shared by every food table. */
  const saveField = useCallback(
    (table: string, id: string, field: string, value: unknown, delay = 450) => {
      const key = `${table}:${id}:${field}`;
      const prev = pending.current.get(key);
      if (prev) clearTimeout(prev);
      const timer = setTimeout(async () => {
        pending.current.delete(key);
        const { error } = await supabase
          .from(table as "food_items")
          .update({ [field]: value } as never)
          .eq("id", id);
        if (error) toast.error("Save failed");
      }, delay);
      pending.current.set(key, timer);
    },
    [],
  );

  // ---- Occasions -----------------------------------------------------------
  const addOccasion = useCallback(
    async (name: string, occasion_date?: string | null) => {
      if (!userId || !name.trim()) return null;
      const sort_order = occasions.length ? Math.max(...occasions.map((o) => o.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("food_occasions")
        .insert({ user_id: userId, name: name.trim(), occasion_date: occasion_date ?? null, sort_order })
        .select()
        .single();
      if (error) {
        toast.error("Couldn't add that occasion");
        return null;
      }
      const row = data as FoodOccasion;
      setOccasions((p) => [...p, row]);
      return row;
    },
    [occasions, userId],
  );

  const updateOccasion = useCallback(
    <K extends keyof FoodOccasion>(id: string, field: K, value: FoodOccasion[K]) => {
      setOccasions((p) => p.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
      saveField("food_occasions", id, String(field), value);
    },
    [saveField],
  );

  const removeOccasion = useCallback(async (id: string) => {
    setOccasions((p) => p.filter((o) => o.id !== id));
    setItems((p) => p.filter((i) => i.occasion_id !== id));
    setGuests((p) => p.filter((g) => g.occasion_id !== id));
    const { error } = await supabase.from("food_occasions").delete().eq("id", id);
    if (error) toast.error("Couldn't remove");
  }, []);

  // ---- Dishes --------------------------------------------------------------
  const addItem = useCallback(
    async (fields: Partial<FoodItem> & { occasion_id: string; name: string }) => {
      if (!userId || !fields.name.trim()) return null;
      const sort_order = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("food_items")
        .insert({ sort_order, ...fields, name: fields.name.trim(), user_id: userId } as never)
        .select()
        .single();
      if (error) {
        toast.error("Couldn't add that dish");
        return null;
      }
      const row = data as FoodItem;
      setItems((p) => [...p, row]);
      return row;
    },
    [items, userId],
  );

  const updateItem = useCallback(
    <K extends keyof FoodItem>(id: string, field: K, value: FoodItem[K]) => {
      setItems((p) => p.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
      saveField("food_items", id, String(field), value);
    },
    [saveField],
  );

  const removeItem = useCallback(async (id: string) => {
    setItems((p) => p.filter((i) => i.id !== id));
    const { error } = await supabase.from("food_items").delete().eq("id", id);
    if (error) toast.error("Couldn't remove");
  }, []);

  // ---- Guests --------------------------------------------------------------
  const addGuest = useCallback(
    async (fields: Partial<FoodGuest> & { occasion_id: string }) => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("food_occasion_guests")
        .insert({ ...fields, user_id: userId } as never)
        .select()
        .single();
      if (error) {
        toast.error("Couldn't add that guest");
        return null;
      }
      const row = data as FoodGuest;
      setGuests((p) => [...p, row]);
      return row;
    },
    [userId],
  );

  const updateGuest = useCallback(
    <K extends keyof FoodGuest>(id: string, field: K, value: FoodGuest[K]) => {
      setGuests((p) => p.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
      saveField("food_occasion_guests", id, String(field), value);
    },
    [saveField],
  );

  const removeGuest = useCallback(async (id: string) => {
    setGuests((p) => p.filter((g) => g.id !== id));
    const { error } = await supabase.from("food_occasion_guests").delete().eq("id", id);
    if (error) toast.error("Couldn't remove");
  }, []);

  // ---- Shopping ------------------------------------------------------------
  const addShopping = useCallback(
    async (fields: Partial<FoodShoppingItem> & { item: string }) => {
      if (!userId || !fields.item.trim()) return null;
      const sort_order = shopping.length ? Math.max(...shopping.map((s) => s.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("food_shopping_items")
        .insert({ sort_order, ...fields, item: fields.item.trim(), user_id: userId } as never)
        .select()
        .single();
      if (error) {
        toast.error("Couldn't add to the list");
        return null;
      }
      const row = data as FoodShoppingItem;
      setShopping((p) => [...p, row]);
      return row;
    },
    [shopping, userId],
  );

  const updateShopping = useCallback(
    <K extends keyof FoodShoppingItem>(id: string, field: K, value: FoodShoppingItem[K]) => {
      setShopping((p) => p.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
      saveField("food_shopping_items", id, String(field), value, field === "bought" ? 0 : 450);
    },
    [saveField],
  );

  const removeShopping = useCallback(async (id: string) => {
    setShopping((p) => p.filter((s) => s.id !== id));
    const { error } = await supabase.from("food_shopping_items").delete().eq("id", id);
    if (error) toast.error("Couldn't remove");
  }, []);

  const itemsByOccasion = useMemo(() => {
    const map = new Map<string, FoodItem[]>();
    for (const i of items) map.set(i.occasion_id, [...(map.get(i.occasion_id) ?? []), i]);
    return map;
  }, [items]);

  return {
    loading,
    occasions,
    items,
    guests,
    shopping,
    itemsByOccasion,
    addOccasion,
    updateOccasion,
    removeOccasion,
    addItem,
    updateItem,
    removeItem,
    addGuest,
    updateGuest,
    removeGuest,
    addShopping,
    updateShopping,
    removeShopping,
    reload: load,
  };
}
