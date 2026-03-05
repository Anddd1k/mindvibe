-- MindVibe: initial schema for users (profiles), challenges, submissions, leaderboard
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor) or via Supabase CLI.

-- Custom types
CREATE TYPE challenge_type AS ENUM ('logic', 'ethical', 'creative');
CREATE TYPE challenge_difficulty AS ENUM ('light', 'moderate', 'deep');

-- Profiles (extends auth.users; one row per user)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level SMALLINT NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  current_streak_days INTEGER NOT NULL DEFAULT 0 CHECK (current_streak_days >= 0),
  longest_streak_days INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak_days >= 0),
  last_streak_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Challenges (daily challenges)
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  type challenge_type NOT NULL,
  difficulty challenge_difficulty NOT NULL,
  active_on DATE NOT NULL UNIQUE
);

-- Submissions (one per user per challenge in practice; you can add a unique constraint later)
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  reasoning TEXT NOT NULL,
  ai_score NUMERIC(4,2),
  ai_verdict TEXT,
  xp_awarded INTEGER CHECK (xp_awarded IS NULL OR xp_awarded >= 0)
);

CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_challenge_id ON public.submissions(challenge_id);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at);

-- Weekly leaderboard: use a SECURITY DEFINER function so anyone can read aggregated results without exposing raw submissions
CREATE OR REPLACE FUNCTION public.get_weekly_leaderboard(week_start_date DATE DEFAULT date_trunc('week', CURRENT_DATE)::DATE)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  week_start DATE,
  weekly_xp INTEGER,
  rank BIGINT
) LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT
    p.id AS user_id,
    p.username,
    date_trunc('week', s.created_at AT TIME ZONE 'UTC')::DATE AS week_start,
    SUM(COALESCE(s.xp_awarded, 0))::INTEGER AS weekly_xp,
    RANK() OVER (ORDER BY SUM(COALESCE(s.xp_awarded, 0)) DESC)
  FROM public.profiles p
  JOIN public.submissions s ON s.user_id = p.id
  WHERE date_trunc('week', s.created_at AT TIME ZONE 'UTC')::DATE = week_start_date
  GROUP BY p.id, p.username;
$$;

-- Optional view for convenience (same as function; call get_weekly_leaderboard() in app for correct RLS bypass)
CREATE OR REPLACE VIEW public.weekly_leaderboard AS
SELECT * FROM public.get_weekly_leaderboard();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own row only
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Challenges: everyone can read
CREATE POLICY "Challenges are readable by everyone"
  ON public.challenges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Challenges are readable by anon"
  ON public.challenges FOR SELECT
  TO anon
  USING (true);

-- Submissions: users can insert own, read own
CREATE POLICY "Users can insert own submission"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Leaderboard: allow everyone to call the function and read the view
GRANT EXECUTE ON FUNCTION public.get_weekly_leaderboard(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_weekly_leaderboard(DATE) TO anon;
GRANT SELECT ON public.weekly_leaderboard TO authenticated;
GRANT SELECT ON public.weekly_leaderboard TO anon;

-- Service role can manage challenges (e.g. seed daily challenge); optional
-- CREATE POLICY "Service can manage challenges" ON public.challenges FOR ALL USING (auth.role() = 'service_role');

-- Optional: seed one challenge for testing
-- INSERT INTO public.challenges (title, prompt, type, difficulty, active_on)
-- VALUES (
--   'The Silent Elevator',
--   'You enter an old elevator with four numbered buttons (1–4) but no floor labels...',
--   'logic',
--   'moderate',
--   CURRENT_DATE
-- );

COMMENT ON TABLE public.profiles IS 'User profiles keyed by auth.users.id; XP, level, streaks.';
COMMENT ON TABLE public.challenges IS 'Daily challenges; active_on determines which is shown for a given day.';
COMMENT ON TABLE public.submissions IS 'User submissions for challenges; AI verdict and XP stored here.';
COMMENT ON FUNCTION public.get_weekly_leaderboard(DATE) IS 'Returns weekly leaderboard for the given week (default current week). SECURITY DEFINER so all users can read.';
COMMENT ON VIEW public.weekly_leaderboard IS 'Current week leaderboard; for custom week use get_weekly_leaderboard(week_start).';
