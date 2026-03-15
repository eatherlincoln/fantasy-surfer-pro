-- FINAL SECURITY & SCHEMA FIX
-- 2026-03-15: Fixes missing 'location' column and potential RLS recursion

-- 1. SCHEMA FIX: Add missing 'location' column
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location TEXT;

-- 2. REINFORCE GRANTS (Ensures sequences work for new rows)
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.surfers TO authenticated;
GRANT ALL ON public.heats TO authenticated;
GRANT ALL ON public.heat_assignments TO authenticated;
GRANT ALL ON public.scores TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 3. ROBUST NON-RECURSIVE RLS FOR EVENTS
-- We use EXISTS directly to bypass the SECURITY DEFINER function if it was causing issues
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "unbreakable_events_select" ON public.events;
DROP POLICY IF EXISTS "admin_all_events" ON public.events;

CREATE POLICY "unbreakable_events_select" ON public.events 
    FOR SELECT TO public USING (true);

CREATE POLICY "admin_all_events" ON public.events 
    FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- 4. APPLY SIMILAR ROBUST POLICIES TO OTHER ADMIN TABLES
-- Surfers
DROP POLICY IF EXISTS "unbreakable_surfers_select" ON public.surfers;
DROP POLICY IF EXISTS "admin_all_surfers" ON public.surfers;
CREATE POLICY "unbreakable_surfers_select" ON public.surfers FOR SELECT TO public USING (true);
CREATE POLICY "admin_all_surfers" ON public.surfers FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Heats
DROP POLICY IF EXISTS "unbreakable_heats_select" ON public.heats;
DROP POLICY IF EXISTS "admin_all_heats" ON public.heats;
CREATE POLICY "unbreakable_heats_select" ON public.heats FOR SELECT TO public USING (true);
CREATE POLICY "admin_all_heats" ON public.heats FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Heat Assignments
DROP POLICY IF EXISTS "unbreakable_heat_assignments_select" ON public.heat_assignments;
DROP POLICY IF EXISTS "admin_all_heat_assignments" ON public.heat_assignments;
CREATE POLICY "unbreakable_heat_assignments_select" ON public.heat_assignments FOR SELECT TO public USING (true);
CREATE POLICY "admin_all_heat_assignments" ON public.heat_assignments FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Scores
DROP POLICY IF EXISTS "unbreakable_scores_select" ON public.scores;
DROP POLICY IF EXISTS "admin_all_scores" ON public.scores;
CREATE POLICY "unbreakable_scores_select" ON public.scores FOR SELECT TO public USING (true);
CREATE POLICY "admin_all_scores" ON public.scores FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));
