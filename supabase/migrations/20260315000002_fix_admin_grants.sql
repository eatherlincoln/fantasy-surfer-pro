-- SECURITY FIX: Missing Grants
-- The previous migration only granted SELECT to admin tables.
-- We must also grant INSERT, UPDATE, DELETE for the RLS policies to be effective.

GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.surfers TO authenticated;
GRANT ALL ON public.heats TO authenticated;
GRANT ALL ON public.heat_assignments TO authenticated;
GRANT ALL ON public.scores TO authenticated;

-- Ensure sequences are also accessible for inserts
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
