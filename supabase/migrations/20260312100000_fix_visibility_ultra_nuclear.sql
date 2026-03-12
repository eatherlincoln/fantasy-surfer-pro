-- ULTRA NUCLEAR RLS RESET & DATA DEDUPLICATION
-- Run this in your Supabase SQL Editor

-- 1. DATA DEDUPLICATION
-- This removes any duplicate entries in user_teams (like Lincoln's 125 rows)
-- keeping only one record per user+event+surfer combination.
DELETE FROM public.user_teams a USING public.user_teams b
WHERE a.id < b.id 
  AND a.user_id = b.user_id 
  AND a.event_id = b.event_id 
  AND a.surfer_id = b.surfer_id;

-- 2. DISABLE RLS ON CORE TABLES
ALTER TABLE public.user_teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.surfers DISABLE ROW LEVEL SECURITY;

-- 3. DROP ALL POSSIBLE CONFLICTING POLICIES
-- We drop a wide list of names to ensure no "rogue" policies remain.
DROP POLICY IF EXISTS "user_teams_public_select" ON public.user_teams;
DROP POLICY IF EXISTS "unbreakable_user_teams_select" ON public.user_teams;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_teams;
DROP POLICY IF EXISTS "Users can view their own team." ON public.user_teams;
DROP POLICY IF EXISTS "Users can view their own teams." ON public.user_teams;
DROP POLICY IF EXISTS "Admins can update user_teams" ON public.user_teams;

DROP POLICY IF EXISTS "profiles_public_select" ON public.profiles;
DROP POLICY IF EXISTS "unbreakable_profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

DROP POLICY IF EXISTS "surfers_public_select" ON public.surfers;
DROP POLICY IF EXISTS "unbreakable_surfers_select" ON public.surfers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.surfers;
DROP POLICY IF EXISTS "Surfers are viewable by everyone" ON public.surfers;

-- 4. RE-ENABLE RLS WITH A SINGLE UNIVERSAL POLICY
ALTER TABLE public.user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "unbreakable_user_teams_select" ON public.user_teams FOR SELECT USING (true);
CREATE POLICY "unbreakable_profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "unbreakable_surfers_select" ON public.surfers FOR SELECT USING (true);

-- 5. ENSURE GRANTS ARE APPLIED TO ALL ROLES
GRANT SELECT ON public.user_teams TO public, anon, authenticated;
GRANT SELECT ON public.profiles TO public, anon, authenticated;
GRANT SELECT ON public.surfers TO public, anon, authenticated;
GRANT SELECT ON public.events TO public, anon, authenticated;
