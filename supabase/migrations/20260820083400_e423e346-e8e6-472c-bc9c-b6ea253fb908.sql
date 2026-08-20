CREATE TABLE public.watchlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_type text,
  release_year integer,
  note text,
  age_guidance text,
  participants uuid[] NOT NULL DEFAULT '{}',
  participant_note text,
  timing text NOT NULL DEFAULT 'any_time',
  moods text[] NOT NULL DEFAULT '{}',
  watched boolean NOT NULL DEFAULT false,
  is_favourite boolean NOT NULL DEFAULT false,
  is_annual boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'manual',
  suggestion_key text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.watchlist_items TO authenticated;
GRANT ALL ON public.watchlist_items TO service_role;

ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watchlist items"
ON public.watchlist_items
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER watchlist_items_updated_at
BEFORE UPDATE ON public.watchlist_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();