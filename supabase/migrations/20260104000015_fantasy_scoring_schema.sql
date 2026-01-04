-- Add scoring columns for Fantasy Logic

-- 1. Store the calculated heat total for history
ALTER TABLE public.heat_assignments 
ADD COLUMN IF NOT EXISTS heat_score numeric DEFAULT 0;

-- 2. Store points earned by a specific pick (e.g. "I picked Italo, he got me 15.5 points")
ALTER TABLE public.user_teams 
ADD COLUMN IF NOT EXISTS points numeric DEFAULT 0;

-- 3. Store the user's total leaderboard score
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_fantasy_points numeric DEFAULT 0;

-- 4. Enable RLS on these if not already? (Assuming policies exist, just adding cols)
-- Ensure 'heat_assignments' exists (it definitely does based on app usage), but let's be safe.
-- If it was missing from previous dumps, ensure policies allow updates.
ALTER TABLE public.heat_assignments ENABLE ROW LEVEL SECURITY;

-- Allow Admins to UPDATE assignment scores
CREATE POLICY "Admins can update heat_assignments" ON public.heat_assignments FOR UPDATE TO authenticated USING (true); -- Simplified for Admin App usage

-- Allow Admins to update user_teams (to distribute points)
CREATE POLICY "Admins can update user_teams" ON public.user_teams FOR UPDATE TO authenticated USING (true);

-- Allow Admins to update profiles (leaderboard)
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE TO authenticated USING (true);
