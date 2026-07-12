import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Person {
  id: string;
  user_id: string;
  name: string;
  relationship: string | null;
  date_of_birth: string | null;
  clothing_size: string | null;
  shoe_size: string | null;
  favourite_colours: string | null;
  favourite_shops: string | null;
  hobbies: string | null;
  favourite_films: string | null;
  favourite_books: string | null;
  favourite_games: string | null;
  favourite_characters: string | null;
  wishlist: string | null;
  notes: string | null;
  gift_budget: number | null;
  avatar_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function calcAge(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export function usePeople(userId: string | undefined) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("people")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) toast.error("Couldn't load people");
      else setPeople((data ?? []) as Person[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`people-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "people", filter: `user_id=eq.${userId}` },
        (payload) => {
          setPeople((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as Person;
              if (prev.some((p) => p.id === row.id)) return prev;
              return [...prev, row];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as Person;
              return prev.map((p) => (p.id === row.id ? row : p));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as { id: string };
              return prev.filter((p) => p.id !== row.id);
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

  const addPerson = useCallback(
    async (name: string, relationship?: string) => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("people")
        .insert({ user_id: userId, name, relationship: relationship ?? null })
        .select()
        .single();
      if (error) {
        toast.error("Couldn't add person");
        return null;
      }
      return data as Person;
    },
    [userId],
  );

  const removePerson = useCallback(async (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from("people").delete().eq("id", id);
    if (error) toast.error("Couldn't remove");
  }, []);

  return { people, loading, addPerson, removePerson };
}

export function usePerson(id: string | undefined, userId: string | undefined) {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from("people").select("*").eq("id", id).maybeSingle();
      if (cancelled) return;
      if (error) toast.error("Couldn't load profile");
      setPerson((data as Person) ?? null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, userId]);

  const updateField = useCallback(
    async <K extends keyof Person>(field: K, value: Person[K]) => {
      if (!id) return;
      setPerson((prev) => (prev ? { ...prev, [field]: value } : prev));
      const { error } = await supabase
        .from("people")
        .update({ [field]: value } as never)
        .eq("id", id);
      if (error) toast.error("Save failed");
    },
    [id],
  );

  return { person, loading, updateField };
}
