CREATE TABLE public.home_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.home_areas TO authenticated;
GRANT ALL ON public.home_areas TO service_role;

ALTER TABLE public.home_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own home areas"
  ON public.home_areas FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER home_areas_updated_at
  BEFORE UPDATE ON public.home_areas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.home_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES public.home_areas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'idea',
  already_owned BOOLEAN NOT NULL DEFAULT false,
  quantity INTEGER,
  estimated_cost NUMERIC,
  responsible_person_id UUID REFERENCES public.people(id) ON DELETE SET NULL,
  responsible_name TEXT,
  look_slug TEXT,
  inspiration_slug TEXT,
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.home_items TO authenticated;
GRANT ALL ON public.home_items TO service_role;

ALTER TABLE public.home_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own home items"
  ON public.home_items FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER home_items_updated_at
  BEFORE UPDATE ON public.home_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX home_items_area_idx ON public.home_items(area_id);
CREATE INDEX home_items_user_idx ON public.home_items(user_id);
CREATE INDEX home_areas_user_idx ON public.home_areas(user_id);