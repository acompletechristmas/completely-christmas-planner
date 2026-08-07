CREATE TABLE public.curated_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  blurb text,
  description text,
  type text NOT NULL,
  price_band text NOT NULL DEFAULT 'mid',
  price_from numeric,
  audiences text[] NOT NULL DEFAULT '{}',
  setting text NOT NULL DEFAULT 'indoor',
  time_of_day text[] NOT NULL DEFAULT '{}',
  venue text,
  town text,
  postcode text,
  lat double precision,
  lng double precision,
  start_date date,
  end_date date,
  event_time text,
  image_url text,
  booking_url text,
  source_name text NOT NULL DEFAULT 'A Complete Christmas',
  source_url text,
  rating numeric,
  is_featured boolean NOT NULL DEFAULT false,
  is_sponsored boolean NOT NULL DEFAULT false,
  affiliate_url text,
  is_active boolean NOT NULL DEFAULT true,
  checked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.curated_experiences TO anon;
GRANT SELECT ON public.curated_experiences TO authenticated;
GRANT ALL ON public.curated_experiences TO service_role;

ALTER TABLE public.curated_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active curated experiences are public"
  ON public.curated_experiences FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage curated experiences"
  ON public.curated_experiences FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX curated_experiences_geo_idx ON public.curated_experiences (lat, lng);
CREATE INDEX curated_experiences_dates_idx ON public.curated_experiences (start_date, end_date);

CREATE TRIGGER curated_experiences_updated_at
  BEFORE UPDATE ON public.curated_experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();