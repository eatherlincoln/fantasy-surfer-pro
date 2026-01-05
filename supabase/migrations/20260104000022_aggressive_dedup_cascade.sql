-- ADVANCED DEDUPLICATION WITH MERGE
-- This script handles Foreign Key constraints by re-pointing dependencies to the "Survivor"
-- before deleting the "Victims".

DO $$
DECLARE
    r RECORD;
    survivor_id UUID;
BEGIN
    -- Loop through every unique name that has duplicates
    FOR r IN 
        SELECT lower(trim(name)) as clean_name
        FROM surfers
        GROUP BY lower(trim(name))
        HAVING count(*) > 1
    LOOP
        -- 1. Identify Survivor (Oldest Record)
        SELECT id INTO survivor_id
        FROM surfers
        WHERE lower(trim(name)) = r.clean_name
        ORDER BY created_at ASC NULLS LAST, id::text ASC
        LIMIT 1;

        RAISE NOTICE 'Merging duplicates for % into %', r.clean_name, survivor_id;

        -- 2. Update References (Point everything to Survivor)
        
        -- Heat Assignments
        UPDATE heat_assignments 
        SET surfer_id = survivor_id 
        WHERE surfer_id IN (
            SELECT id FROM surfers 
            WHERE lower(trim(name)) = r.clean_name AND id != survivor_id
        )
        -- Handle potential conflict if survivor is already in that heat?
        -- For now, we assume simple update. If conflict occurs (unique constraint), we might need delete.
        AND heat_id NOT IN (SELECT heat_id FROM heat_assignments WHERE surfer_id = survivor_id);

        -- Scores
        UPDATE scores
        SET surfer_id = survivor_id
        WHERE surfer_id IN (
            SELECT id FROM surfers 
            WHERE lower(trim(name)) = r.clean_name AND id != survivor_id
        );

        -- User Teams
        UPDATE user_teams
        SET surfer_id = survivor_id
        WHERE surfer_id IN (
            SELECT id FROM surfers 
            WHERE lower(trim(name)) = r.clean_name AND id != survivor_id
        );

        -- 3. Delete Victims
        DELETE FROM surfers
        WHERE lower(trim(name)) = r.clean_name 
        AND id != survivor_id;
        
    END LOOP;
END $$;
