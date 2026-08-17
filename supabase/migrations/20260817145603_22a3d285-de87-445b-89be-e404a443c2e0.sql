CREATE TABLE public.food_occasions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  occasion_date date,
  num_adults integer NOT NULL DEFAULT 0,
  num_children integer NOT NULL DEFAULT 0,
  notes text,
  is_default boolean NOT NULL DEFAULT false,
  default_key text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_occasions TO authenticated;
GRANT ALL ON public.food_occasions TO service_role;
ALTER TABLE public.food_occasions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own food occasions" ON public.food_occasions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occasion_id uuid NOT NULL REFERENCES public.food_occasions(id) ON DELETE CASCADE,
  meal text NOT NULL DEFAULT 'dinner',
  name text NOT NULL,
  servings integer,
  dietary_tags text[] NOT NULL DEFAULT '{}',
  responsible_person_id uuid REFERENCES public.people(id) ON DELETE SET NULL,
  responsible_name text,
  prep_date date,
  notes text,
  status text NOT NULL DEFAULT 'planned',
  needs_shopping boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'manual',
  suggestion_key text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_items TO authenticated;
GRANT ALL ON public.food_items TO service_role;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own food items" ON public.food_items
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX food_items_occasion_idx ON public.food_items (occasion_id);
CREATE INDEX food_items_prep_date_idx ON public.food_items (user_id, prep_date);

CREATE TABLE public.food_occasion_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occasion_id uuid NOT NULL REFERENCES public.food_occasions(id) ON DELETE CASCADE,
  person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
  guest_name text,
  dietary_tags text[] NOT NULL DEFAULT '{}',
  dietary_notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_occasion_guests TO authenticated;
GRANT ALL ON public.food_occasion_guests TO service_role;
ALTER TABLE public.food_occasion_guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own food guests" ON public.food_occasion_guests
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX food_guests_occasion_idx ON public.food_occasion_guests (occasion_id);

CREATE TABLE public.food_shopping_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item text NOT NULL,
  quantity numeric,
  unit text,
  category text,
  bought boolean NOT NULL DEFAULT false,
  food_item_id uuid REFERENCES public.food_items(id) ON DELETE SET NULL,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_shopping_items TO authenticated;
GRANT ALL ON public.food_shopping_items TO service_role;
ALTER TABLE public.food_shopping_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own food shopping items" ON public.food_shopping_items
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX food_shopping_user_idx ON public.food_shopping_items (user_id);

CREATE TRIGGER food_occasions_updated_at BEFORE UPDATE ON public.food_occasions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER food_items_updated_at BEFORE UPDATE ON public.food_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER food_occasion_guests_updated_at BEFORE UPDATE ON public.food_occasion_guests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER food_shopping_items_updated_at BEFORE UPDATE ON public.food_shopping_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();