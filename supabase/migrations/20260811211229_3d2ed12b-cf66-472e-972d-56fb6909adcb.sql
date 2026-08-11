CREATE TABLE public.look_inspirations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  look_id uuid NOT NULL REFERENCES public.christmas_looks(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  styling_tip text,
  category text NOT NULL DEFAULT 'room',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (look_id, slug)
);

GRANT SELECT ON public.look_inspirations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.look_inspirations TO authenticated;
GRANT ALL ON public.look_inspirations TO service_role;

ALTER TABLE public.look_inspirations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active inspirations are viewable by everyone"
  ON public.look_inspirations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage inspirations"
  ON public.look_inspirations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER look_inspirations_updated_at
  BEFORE UPDATE ON public.look_inspirations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX look_inspirations_look_id_idx ON public.look_inspirations (look_id, sort_order);

CREATE TABLE public.inspiration_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspiration_id uuid NOT NULL REFERENCES public.look_inspirations(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.decor_products(id) ON DELETE CASCADE,
  category text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (inspiration_id, product_id, category)
);

GRANT SELECT ON public.inspiration_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspiration_products TO authenticated;
GRANT ALL ON public.inspiration_products TO service_role;

ALTER TABLE public.inspiration_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspiration products are viewable by everyone"
  ON public.inspiration_products FOR SELECT
  USING (true);

CREATE POLICY "Admins manage inspiration products"
  ON public.inspiration_products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX inspiration_products_inspiration_idx ON public.inspiration_products (inspiration_id, sort_order);