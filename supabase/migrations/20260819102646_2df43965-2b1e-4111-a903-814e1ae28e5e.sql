CREATE TABLE public.traditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,
  timing text NOT NULL DEFAULT 'flexible',
  event_date date,
  participants uuid[] NOT NULL DEFAULT '{}',
  participant_note text,
  is_annual boolean NOT NULL DEFAULT false,
  started_year integer,
  source text NOT NULL DEFAULT 'manual',
  suggestion_key text,
  done boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.traditions TO authenticated;
GRANT ALL ON public.traditions TO service_role;

ALTER TABLE public.traditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own traditions"
  ON public.traditions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX traditions_user_idx ON public.traditions (user_id, sort_order);

CREATE TRIGGER traditions_updated_at
  BEFORE UPDATE ON public.traditions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();