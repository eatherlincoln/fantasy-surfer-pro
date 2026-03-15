-- SECURE RLS REINFORCEMENT
-- 2026-03-15: Final security lockdown

-- 1. Ensure RLS is ENABLED on all core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heat_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;

-- 2. RESET POLICIES (Clean slate)
DO $$ 
DECLARE 
    tbl text;
BEGIN
    FOR tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('profiles', 'surfers', 'events', 'heats', 'heat_assignments', 'scores', 'user_teams', 'leagues', 'league_members')) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "unbreakable_%I_select" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "admin_all_%I" ON public.%I', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "owner_manage_%I" ON public.%I', tbl, tbl);
        -- Catch-all for any other common names used in previous migrations
        EXECUTE format('DROP POLICY IF EXISTS "Enable read access for all users" ON public.%I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Public %I are viewable by everyone" ON public.%I', tbl, tbl);
    END LOOP;
END $$;

-- 3. DEFINE GLOBAL READ ACCESS (Everyone can see game data)
CREATE POLICY "unbreakable_profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "unbreakable_surfers_select" ON public.surfers FOR SELECT USING (true);
CREATE POLICY "unbreakable_events_select" ON public.events FOR SELECT USING (true);
CREATE POLICY "unbreakable_heats_select" ON public.heats FOR SELECT USING (true);
CREATE POLICY "unbreakable_heat_assignments_select" ON public.heat_assignments FOR SELECT USING (true);
CREATE POLICY "unbreakable_scores_select" ON public.scores FOR SELECT USING (true);
CREATE POLICY "unbreakable_leagues_select" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "unbreakable_league_members_select" ON public.league_members FOR SELECT USING (true);
CREATE POLICY "unbreakable_user_teams_select" ON public.user_teams FOR SELECT USING (true);

-- 4. DEFINE ADMIN ACCESS (is_admin = true in profiles table)
-- Helper function to check admin status without recursive policy lookups
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND is_admin = true
    );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "admin_all_profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin_all_surfers" ON public.surfers FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin_all_events" ON public.events FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin_all_heats" ON public.heats FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin_all_heat_assignments" ON public.heat_assignments FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin_all_scores" ON public.scores FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin_all_leagues" ON public.leagues FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin_all_league_members" ON public.league_members FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin_all_user_teams" ON public.user_teams FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 5. DEFINE OWNER ACCESS (Manage own data)

-- Users can update their own profile (EXCLUDING is_admin and is_banned handled by separate logic or triggers if needed)
-- Note: RLS doesn't easily restrict specific columns on UPDATE, but we can use a TRIGGER or just trust the DB schema/Service Role for those fields.
-- A better way: Profiles update policy
CREATE POLICY "owner_manage_profiles" ON public.profiles FOR UPDATE TO authenticated 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users manage their own teams
CREATE POLICY "owner_manage_user_teams" ON public.user_teams FOR ALL TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users manage their own leagues (Created by)
CREATE POLICY "owner_manage_leagues" ON public.leagues FOR UPDATE TO authenticated 
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- Users manage their own league memberships
CREATE POLICY "owner_manage_league_members" ON public.league_members FOR ALL TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. ADDITIONAL GRANTS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_teams TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.league_members TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.leagues TO authenticated;
-- 7. SECURITY TRIGGER: Prevent users from self-promoting to admin
CREATE OR REPLACE FUNCTION public.protect_admin_flag()
RETURNS TRIGGER AS $$
BEGIN
    -- Only allow is_admin/is_banned changes if the caller IS ALREADY an admin
    IF (NEW.is_admin IS DISTINCT FROM OLD.is_admin OR NEW.is_banned IS DISTINCT FROM OLD.is_banned) THEN
        IF NOT public.is_admin(auth.uid()) THEN
            -- Revert the changes to these specific columns if not an admin
            NEW.is_admin := OLD.is_admin;
            NEW.is_banned := OLD.is_banned;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_update_security ON public.profiles;
CREATE TRIGGER on_profile_update_security
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_admin_flag();
