
ALTER TABLE public.people
  ADD COLUMN IF NOT EXISTS age_range text,
  ADD COLUMN IF NOT EXISTS dislikes text,
  ADD COLUMN IF NOT EXISTS initial_ideas text,
  ADD COLUMN IF NOT EXISTS needs_stocking boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS needs_card boolean NOT NULL DEFAULT false;

ALTER TABLE public.gifts
  ADD COLUMN IF NOT EXISTS ordered boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS arrived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS hidden_location text;
