CREATE TABLE public.music_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  artist text,
  item_type text NOT NULL DEFAULT 'song',
  moment text NOT NULL DEFAULT 'any_time',
  moods text[] NOT NULL DEFAULT '{}',
  participants text[] NOT NULL DEFAULT '{}',
  participant_note text,
  is_favourite boolean NOT NULL DEFAULT false,
  is_annual boolean NOT NULL DEFAULT false,
  notes text,
  source text NOT NULL DEFAULT 'manual',
  suggestion_key text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.music_items TO authenticated;
GRANT ALL ON public.music_items TO service_role;

ALTER TABLE public.music_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own music items"
  ON public.music_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER music_items_updated_at
  BEFORE UPDATE ON public.music_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX music_items_user_sort_idx ON public.music_items (user_id, sort_order);