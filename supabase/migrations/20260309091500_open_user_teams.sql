-- Ensure RLS on user_teams allows reading for other users (for Leaderboards and clicking to see team)
ALTER TABLE public.user_teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own team." ON public.user_teams;

CREATE POLICY "user_teams are viewable by everyone"
  ON public.user_teams FOR SELECT
  USING ( true );

GRANT ALL ON TABLE public.user_teams TO authenticated;
GRANT SELECT ON TABLE public.user_teams TO anon;
