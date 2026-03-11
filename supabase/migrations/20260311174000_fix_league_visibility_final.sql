-- Final "Nuclear" RLS Fix for League Visibility
-- Ensuring both profiles and user_teams are fully readable by everyone for leaderboard and scouting features.

-- 1. Profiles Table RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING ( true );

-- Ensure team_name has a default to avoid "Unknown"
ALTER TABLE public.profiles ALTER COLUMN team_name SET DEFAULT 'New Team';

-- 2. User Teams Table RLS
ALTER TABLE public.user_teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own team." ON public.user_teams;
DROP POLICY IF EXISTS "user_teams are viewable by everyone" ON public.user_teams;

CREATE POLICY "user_teams are viewable by everyone"
  ON public.user_teams FOR SELECT
  USING ( true );

-- 3. Grants
GRANT SELECT ON TABLE public.profiles TO anon, authenticated;
GRANT SELECT ON TABLE public.user_teams TO anon, authenticated;

-- 4. Cleanup any profiles with null team_names to the new default
UPDATE public.profiles SET team_name = 'New Team' WHERE team_name IS NULL;
