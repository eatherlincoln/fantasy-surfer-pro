-- Fix RLS completely for local testing of admin features
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.events;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.events;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.events;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.events;

CREATE POLICY "Enable all for authenticated users" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also for heats
ALTER TABLE public.heats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.heats;
CREATE POLICY "Enable all access for authenticated users" ON public.heats FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also for surfers
ALTER TABLE public.surfers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.surfers;
CREATE POLICY "Enable all access for authenticated users" ON public.surfers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also for heat assignments
ALTER TABLE public.heat_assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.heat_assignments;
CREATE POLICY "Enable all access for authenticated users" ON public.heat_assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);
