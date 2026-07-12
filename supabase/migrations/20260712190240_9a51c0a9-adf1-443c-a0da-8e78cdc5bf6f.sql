CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid,
  title text NOT NULL,
  slug text,
  category text NOT NULL,
  subcategory text,
  description text,
  content_html text,
  file_url text,
  thumbnail_url text,
  year_min integer,
  year_max integer,
  subject text,
  length_minutes integer,
  group_type text,
  setting text,
  printable boolean NOT NULL DEFAULT true,
  digital boolean NOT NULL DEFAULT false,
  difficulty text,
  tags text[] NOT NULL DEFAULT '{}',
  is_premium boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT true,
  source text NOT NULL DEFAULT 'curated',
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.resources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Anyone can read public resources
CREATE POLICY "Public resources are viewable by everyone"
  ON public.resources FOR SELECT
  USING (is_public = true);

-- Signed-in users can insert their own
CREATE POLICY "Users can create their own resources"
  ON public.resources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Signed-in users can update their own
CREATE POLICY "Users can update their own resources"
  ON public.resources FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Signed-in users can delete their own
CREATE POLICY "Users can delete their own resources"
  ON public.resources FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE INDEX resources_category_idx ON public.resources (category, subcategory);
CREATE INDEX resources_public_idx ON public.resources (is_public, created_at DESC);

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a handful of resources so every category has something visible
INSERT INTO public.resources (title, category, subcategory, description, subject, year_min, year_max, length_minutes, group_type, setting, printable, digital, difficulty, tags)
VALUES
  ('Christmas Number Bonds to 20', 'classroom-activities', 'maths', 'Festive number-bond practice with baubles and presents. Perfect starter for KS1 maths.', 'Maths', 1, 2, 20, 'individual', 'indoor', true, false, 'easy', ARRAY['ks1','maths','number-bonds']),
  ('The History of Christmas Around the World', 'classroom-activities', 'history', 'Reading and discussion pack exploring how Christmas is celebrated in five countries.', 'History', 3, 6, 45, 'group', 'indoor', true, true, 'medium', ARRAY['ks2','history','geography']),
  ('Reindeer Mindfulness Colouring', 'colouring', 'mindfulness', 'Detailed reindeer pattern for calm colouring time. A3 printable.', 'Art', 0, 6, 30, 'individual', 'indoor', true, false, 'easy', ARRAY['calm','mindfulness','art']),
  ('Colour by Number: Christmas Tree', 'colouring', 'colour-by-number', 'Numbers 1–10 map to colours. Great for early years maths recognition.', 'Maths', 0, 1, 20, 'individual', 'indoor', true, false, 'easy', ARRAY['eyfs','ks1','maths']),
  ('Christmas Word Search — Easy', 'worksheets', 'word-search', '15 festive words hidden in a 12×12 grid.', 'English', 1, 3, 15, 'individual', 'indoor', true, false, 'easy', ARRAY['ks1','vocabulary']),
  ('Crack the Code: Santa''s Message', 'worksheets', 'crack-the-code', 'A→1, B→2 substitution cipher hiding a festive message.', 'Maths', 2, 4, 20, 'individual', 'indoor', true, false, 'medium', ARRAY['ks2','logic']),
  ('Paper Chain Advent Calendar', 'crafts', 'decorations', '24-link paper chain — pull one off each day. Instructions and templates included.', 'Art', 0, 6, 45, 'individual', 'indoor', true, false, 'easy', ARRAY['craft','advent']),
  ('Recycled Bauble Workshop', 'crafts', 'recycled-crafts', 'Turn old magazines into stunning tree ornaments. Full step-by-step guide.', 'Art', 2, 6, 60, 'group', 'indoor', true, false, 'medium', ARRAY['recycled','sustainability']),
  ('Letter to Santa Template Pack', 'writing', 'letter-to-santa', 'Three differentiated templates from EYFS to Year 6, with sentence starters.', 'English', 0, 6, 30, 'individual', 'indoor', true, false, 'easy', ARRAY['writing','christmas-eve']),
  ('Christmas Newspaper Report', 'writing', 'newspaper-reports', 'Structure planner and success criteria for writing a news report about Christmas Eve at the North Pole.', 'English', 4, 6, 60, 'individual', 'indoor', true, false, 'medium', ARRAY['ks2','journalism','writing']),
  ('Christmas Bingo Class Pack', 'games', 'bingo', '30 unique bingo cards plus caller sheet. Instant-print A4.', 'General', 0, 6, 30, 'group', 'indoor', true, false, 'easy', ARRAY['whole-class','end-of-term']),
  ('Christmas Escape Room: Save the Sleigh', 'games', 'escape-room', 'Five puzzles across maths, English and logic. Runs 45–60 minutes.', 'Cross-curricular', 3, 6, 60, 'group', 'indoor', true, true, 'hard', ARRAY['ks2','escape-room','team']),
  ('General Christmas Quiz — 40 Questions', 'quizzes', 'general', 'Ready-to-run 40-question quiz with answer sheet. Perfect for last day of term.', 'General', 3, 6, 45, 'group', 'indoor', true, true, 'medium', ARRAY['end-of-term','quiz']),
  ('Christmas Films Picture Quiz', 'quizzes', 'films', '20 stills from festive films — name the film. PowerPoint-ready.', 'General', 3, 6, 30, 'group', 'indoor', true, true, 'medium', ARRAY['films','picture-quiz']),
  ('Christmas Countdown Display', 'classroom-extras', 'countdown', 'Printable 24-day advent calendar wall display with pockets for daily challenges.', 'General', 0, 6, 60, 'group', 'indoor', true, false, 'easy', ARRAY['display','advent']),
  ('Christmas Joke of the Day Pack', 'classroom-extras', 'daily', '24 groan-worthy Christmas jokes. Print, cut and go.', 'General', 0, 6, 5, 'group', 'indoor', true, true, 'easy', ARRAY['humour','daily-routine']);
