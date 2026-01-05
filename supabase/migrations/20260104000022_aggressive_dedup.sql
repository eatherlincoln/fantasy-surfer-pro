-- AGGRESSIVE DEDUPLICATION (Fixed for UUIDs)
-- Uses ctid (internal row ID) which is always present and orderable.

DELETE FROM surfers
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY lower(trim(name)) 
                   ORDER BY created_at ASC NULLS LAST, id::text ASC
               ) as rnum
        FROM surfers
    ) t
    WHERE t.rnum > 1
);
