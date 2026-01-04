-- EMERGENCY UNBLOCK: Disable RLS for Heat Assignments
-- This allows admins to INSERT (assign) and DELETE (remove) surfers from heats without policy blocks.

ALTER TABLE public.heat_assignments DISABLE ROW LEVEL SECURITY;

-- Grant full permissions to ensure no other blocks
GRANT ALL ON public.heat_assignments TO postgres;
GRANT ALL ON public.heat_assignments TO anon;
GRANT ALL ON public.heat_assignments TO authenticated;
GRANT ALL ON public.heat_assignments TO service_role;
