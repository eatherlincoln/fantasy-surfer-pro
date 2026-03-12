-- TEAM TRIMMER & UNIQUE CONSTRAINT
-- Run this in your Supabase SQL Editor

-- 1. TRIM TEAMS TO EXACTLY 10 SURFERS
-- If a user has more than 10, this keeps the 10 most recently added ones.
WITH ranked_teams AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id, event_id ORDER BY created_at DESC) as rank
  FROM public.user_teams
)
DELETE FROM public.user_teams
WHERE id IN (SELECT id FROM ranked_teams WHERE rank > 10);

-- 2. PREVENT FUTURE DUPLICATES
-- Adds a unique constraint so the same surfer can't be added twice to the same team/event.
-- We use 'DROP CONSTRAINT IF EXISTS' first just in case.
ALTER TABLE public.user_teams DROP CONSTRAINT IF EXISTS unique_user_event_surfer;
ALTER TABLE public.user_teams ADD CONSTRAINT unique_user_event_surfer UNIQUE (user_id, event_id, surfer_id);

-- 3. FINAL VERIFICATION LOG
-- (This just lets you see the new counts in the results panel)
SELECT user_id, count(*) as surfer_count
FROM public.user_teams
GROUP BY user_id, event_id
ORDER BY surfer_count DESC;
