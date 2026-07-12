-- People profiles
CREATE TABLE public.people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT '',
  relationship text,
  date_of_birth date,
  clothing_size text,
  shoe_size text,
  favourite_colours text,
  favourite_shops text,
  hobbies text,
  favourite_films text,
  favourite_books text,
  favourite_games text,
  favourite_characters text,
  wishlist text,
  notes text,
  gift_budget numeric,
  avatar_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.people TO authenticated;
GRANT ALL ON public.people TO service_role;

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own people"
  ON public.people FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON public.people
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extend gifts with year-by-year memory fields
ALTER TABLE public.gifts
  ADD COLUMN person_id uuid REFERENCES public.people(id) ON DELETE SET NULL,
  ADD COLUMN year integer NOT NULL DEFAULT EXTRACT(year FROM now())::int,
  ADD COLUMN shop text,
  ADD COLUMN purchase_date date,
  ADD COLUMN wrapped boolean NOT NULL DEFAULT false,
  ADD COLUMN delivered boolean NOT NULL DEFAULT false,
  ADD COLUMN photo_url text,
  ADD COLUMN opening_photo_url text,
  ADD COLUMN post_notes text,
  ADD COLUMN rating text,
  ADD COLUMN given_by text,
  ADD COLUMN category text;

CREATE INDEX gifts_person_year_idx ON public.gifts (person_id, year DESC);
CREATE INDEX people_user_idx ON public.people (user_id, sort_order);
