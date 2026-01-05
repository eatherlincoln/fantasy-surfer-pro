-- Generic Deduplication Script
-- This will look at ALL surfers and remove duplicates based on 'name'.
-- It keeps the one with the lowest ID (the first one created).

DELETE FROM surfers 
WHERE id IN (
    SELECT id 
    FROM (
        SELECT id, ROW_NUMBER() OVER (partition BY name ORDER BY id ASC) AS rnum 
        FROM surfers
    ) t 
    WHERE t.rnum > 1
);
