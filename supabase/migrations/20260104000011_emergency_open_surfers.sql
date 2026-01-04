-- EMERGENCY UNBLOCK: Disable RLS for Surfers table
-- This allows ANYONE (anon or authenticated) to Read/Write surfers.
-- Use this to unblock the CSV import and Manual Add features.

ALTER TABLE public.surfers DISABLE ROW LEVEL SECURITY;

-- Grant full permissions just in case
GRANT ALL ON public.surfers TO postgres;
GRANT ALL ON public.surfers TO anon;
GRANT ALL ON public.surfers TO authenticated;
GRANT ALL ON public.surfers TO service_role;
