-- NUCLEAR RLS RESET: Fix League Visibility
-- Run this in Supabase SQL Editor to ensure public read access

-- 1. Reset user_teams policies
ALTER TABLE public.user_teams DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_teams are viewable by everyone" ON public.user_teams;
DROP POLICY IF EXISTS "Users can view their own team." ON public.user_teams;
DROP POLICY IF EXISTS "Users can view their own teams." ON public.user_teams;
DROP POLICY IF EXISTS "Admins can update user_teams" ON public.user_teams;
ALTER TABLE public.user_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_teams_public_select" ON public.user_teams 
FOR SELECT TO public, anon, authenticated 
USING ( true );

CREATE POLICY "user_teams_owner_all" ON public.user_teams 
FOR ALL TO authenticated 
USING ( auth.uid() = user_id ) 
WITH CHECK ( auth.uid() = user_id );

GRANT SELECT ON TABLE public.user_teams TO public, anon, authenticated;

-- 2. Reset profiles policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_select" ON public.profiles 
FOR SELECT TO public, anon, authenticated 
USING ( true );

CREATE POLICY "profiles_owner_update" ON public.profiles 
FOR UPDATE TO authenticated 
USING ( auth.uid() = id );

GRANT SELECT ON TABLE public.profiles TO public, anon, authenticated;

-- 3. Ensure Team Names are clean
UPDATE public.profiles SET team_name = 'New Team' WHERE team_name IS NULL OR team_name = '';

-- 4. Verify grants for surfers just in case
GRANT SELECT ON TABLE public.surfers TO public, anon, authenticated;
GRANT SELECT ON TABLE public.events TO public, anon, authenticated;
