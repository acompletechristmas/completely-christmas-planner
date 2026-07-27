ALTER TABLE public.planner_settings
  ADD COLUMN IF NOT EXISTS household_types text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS celebration_style text[] NOT NULL DEFAULT '{}'::text[];