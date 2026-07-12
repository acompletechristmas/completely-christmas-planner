
CREATE TABLE public.planner_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  budget_total NUMERIC(10,2),
  is_hosting BOOLEAN NOT NULL DEFAULT false,
  num_adults INTEGER NOT NULL DEFAULT 0,
  num_children INTEGER NOT NULL DEFAULT 0,
  is_travelling BOOLEAN NOT NULL DEFAULT false,
  sends_cards BOOLEAN NOT NULL DEFAULT true,
  decorates_indoor BOOLEAN NOT NULL DEFAULT true,
  decorates_outdoor BOOLEAN NOT NULL DEFAULT false,
  dietary_notes TEXT,
  planning_style TEXT NOT NULL DEFAULT 'weekly',
  stress_free BOOLEAN NOT NULL DEFAULT false,
  setup_completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.planner_settings TO authenticated;
GRANT ALL ON public.planner_settings TO service_role;

ALTER TABLE public.planner_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own planner settings"
ON public.planner_settings FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_planner_settings_updated_at
BEFORE UPDATE ON public.planner_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
