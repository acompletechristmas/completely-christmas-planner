-- 1. Gifts: add idea/chosen/sent flags + timestamps
ALTER TABLE public.gifts
  ADD COLUMN IF NOT EXISTS is_idea boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_chosen boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS given boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ordered_at timestamptz,
  ADD COLUMN IF NOT EXISTS received_at timestamptz,
  ADD COLUMN IF NOT EXISTS wrapped_at timestamptz,
  ADD COLUMN IF NOT EXISTS sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS given_at timestamptz;

-- Backfill: every existing row is a chosen Present (not an Idea).
UPDATE public.gifts SET is_chosen = true, is_idea = false WHERE is_chosen IS NULL OR is_idea IS NULL;
-- Sync legacy 'given' status into the new boolean.
UPDATE public.gifts SET given = true WHERE status = 'given' AND given = false;

-- 2. Outings table
CREATE TABLE IF NOT EXISTS public.outings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT '',
  event_date date,
  event_time text,
  location text,
  attendees text,
  cost numeric,
  booking_url text,
  planned boolean NOT NULL DEFAULT true,
  booked boolean NOT NULL DEFAULT false,
  paid boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.outings TO authenticated;
GRANT ALL ON public.outings TO service_role;

ALTER TABLE public.outings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own outings"
  ON public.outings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_outings_updated_at
  BEFORE UPDATE ON public.outings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();