-- Add is_on_tour column to control visibility in Draft/Team Builder
ALTER TABLE surfers ADD COLUMN IF NOT EXISTS is_on_tour BOOLEAN DEFAULT TRUE;

-- Hide Kelly Slater by default (he is a wildcard/semi-retired)
UPDATE surfers 
SET is_on_tour = FALSE 
WHERE name = 'Kelly Slater';

-- Ensure RLS allows everyone to read (already covered by public/anon policy, but good to be safe)
-- Existing policies likely cover 'SELECT' for all authenticated/anon users.
