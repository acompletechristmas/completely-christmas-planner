import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Gift {
  id: string;
  user_id: string;
  person_id: string | null;
  recipient: string;
  item: string;
  url: string | null;
  price: number | null;
  status: "idea" | "bought" | "wrapped" | "given";
  notes: string | null;
  year: number;
  shop: string | null;
  purchase_date: string | null;
  wrapped: boolean;
  delivered: boolean;
  photo_url: string | null;
  opening_photo_url: string | null;
  post_notes: string | null;
  rating: string | null;
  given_by: string | null;
  category: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function usePersonGifts(personId: string | undefined, userId: string | undefined) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!personId) return;
    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .eq("person_id", personId)
      .order("year", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) toast.error("Couldn't load memories");
    else setGifts((data ?? []) as unknown as Gift[]);
    setLoading(false);
  }, [personId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`gifts-person-${personId ?? "none"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gifts", filter: `user_id=eq.${userId}` },
        () => {
          void refetch();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [personId, userId, refetch]);

  const addGift = useCallback(
    async (fields: Partial<Gift>) => {
      if (!userId || !personId) return;
      const { error } = await supabase.from("gifts").insert({
        user_id: userId,
        person_id: personId,
        recipient: fields.recipient ?? "",
        item: fields.item ?? "",
        year: fields.year ?? new Date().getFullYear(),
        status: fields.status ?? "idea",
        ...fields,
      } as never);
      if (error) toast.error("Couldn't add");
      else void refetch();
    },
    [personId, userId, refetch],
  );

  const updateField = useCallback(
    async <K extends keyof Gift>(id: string, field: K, value: Gift[K]) => {
      setGifts((prev) => prev.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
      const { error } = await supabase
        .from("gifts")
        .update({ [field]: value } as never)
        .eq("id", id);
      if (error) toast.error("Save failed");
    },
    [],
  );

  const removeGift = useCallback(async (id: string) => {
    setGifts((prev) => prev.filter((g) => g.id !== id));
    const { error } = await supabase.from("gifts").delete().eq("id", id);
    if (error) toast.error("Couldn't remove");
  }, []);

  return { gifts, loading, addGift, updateField, removeGift, refetch };
}

/** Upload a photo to the private gift-photos bucket and return a signed URL good for ~1 year. */
export async function uploadGiftPhoto(
  userId: string,
  file: File,
): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("gift-photos").upload(key, file, {
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) {
    toast.error("Photo upload failed");
    return null;
  }
  const { data, error: signErr } = await supabase.storage
    .from("gift-photos")
    .createSignedUrl(key, 60 * 60 * 24 * 365);
  if (signErr || !data) {
    toast.error("Couldn't get photo link");
    return null;
  }
  return data.signedUrl;
}
