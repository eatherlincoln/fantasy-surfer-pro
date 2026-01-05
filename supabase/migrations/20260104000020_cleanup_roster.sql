-- 0. Ensure the column exists (Consolidated fix)
ALTER TABLE surfers ADD COLUMN IF NOT EXISTS is_on_tour BOOLEAN DEFAULT TRUE;

-- 1. Updates specifically requested
UPDATE surfers SET is_on_tour = FALSE WHERE name = 'Kelly Slater';
UPDATE surfers SET is_on_tour = FALSE WHERE name = 'Hughie Vaughan';

-- 2. Remove Duplicate John John Florence (Keep the one with the lowest ID - original)
DELETE FROM surfers 
WHERE id IN (
    SELECT id 
    FROM (
        SELECT id, ROW_NUMBER() OVER (partition BY name ORDER BY id ASC) AS rnum 
        FROM surfers 
        WHERE name = 'John John Florence'
    ) t 
    WHERE t.rnum > 1
);

-- 3. Update Profile Phots
UPDATE surfers 
SET image = '/images/surfers/john_john_florence.png'
WHERE name = 'John John Florence';

UPDATE surfers 
SET image = '/images/surfers/stephanie_gilmore.png'
WHERE name = 'Stephanie Gilmore';
