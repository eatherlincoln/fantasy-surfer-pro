-- Helper function to clear data safely (optional, but good for idempotent runs if filtered)
-- For this migration, we will use INSERT ON CONFLICT or simple INSERTS.
-- Since IDs are serial/uuid, we need to be careful.

-- 1. Insert Surfers
-- We use a temporary table or VALUES to insert.
INSERT INTO public.surfers (name, country, flag, stance, age, value, tier, gender, image, status, current_season_points)
VALUES 
    -- MEN (A)
    ('John John Florence', 'HAW', '🇺🇸', 'Regular', 31, 10.0, 'A', 'Male', 'https://ui-avatars.com/api/?name=John+John+Florence&background=random', 'ACTIVE', 0),
    ('Jack Robinson', 'AUS', '🇦🇺', 'Regular', 26, 9.5, 'A', 'Male', 'https://ui-avatars.com/api/?name=Jack+Robinson&background=random', 'ACTIVE', 0),
    ('Griffin Colapinto', 'USA', '🇺🇸', 'Regular', 25, 9.0, 'A', 'Male', 'https://ui-avatars.com/api/?name=Griffin+Colapinto&background=random', 'ACTIVE', 0),
    ('Ethan Ewing', 'AUS', '🇦🇺', 'Regular', 25, 8.5, 'A', 'Male', 'https://ui-avatars.com/api/?name=Ethan+Ewing&background=random', 'ACTIVE', 0),
    -- MEN (B)
    ('Gabriel Medina', 'BRA', '🇧🇷', 'Goofy', 30, 8.0, 'B', 'Male', 'https://ui-avatars.com/api/?name=Gabriel+Medina&background=random', 'ACTIVE', 0),
    ('Italo Ferreira', 'BRA', '🇧🇷', 'Goofy', 29, 7.5, 'B', 'Male', 'https://ui-avatars.com/api/?name=Italo+Ferreira&background=random', 'ACTIVE', 0),
    ('Jordy Smith', 'RSA', '🇿🇦', 'Regular', 36, 7.0, 'B', 'Male', 'https://ui-avatars.com/api/?name=Jordy+Smith&background=random', 'ACTIVE', 0),
    ('Kanoa Igarashi', 'JPN', '🇯🇵', 'Regular', 26, 6.5, 'B', 'Male', 'https://ui-avatars.com/api/?name=Kanoa+Igarashi&background=random', 'ACTIVE', 0),
    -- MEN (C)
    ('Kelly Slater', 'USA', '🇺🇸', 'Regular', 52, 5.0, 'C', 'Male', 'https://ui-avatars.com/api/?name=Kelly+Slater&background=random', 'ACTIVE', 0),
    -- WOMEN (A)
    ('Caitlin Simmers', 'USA', '🇺🇸', 'Regular', 18, 10.0, 'A', 'Female', 'https://ui-avatars.com/api/?name=Caity+Simmers&background=random', 'ACTIVE', 0),
    ('Caroline Marks', 'USA', '🇺🇸', 'Goofy', 22, 9.5, 'A', 'Female', 'https://ui-avatars.com/api/?name=Caroline+Marks&background=random', 'ACTIVE', 0),
    ('Molly Picklum', 'AUS', '🇦🇺', 'Regular', 21, 9.0, 'A', 'Female', 'https://ui-avatars.com/api/?name=Molly+Picklum&background=random', 'ACTIVE', 0),
    -- WOMEN (B)
    ('Tyler Wright', 'AUS', '🇦🇺', 'Regular', 29, 8.0, 'B', 'Female', 'https://ui-avatars.com/api/?name=Tyler+Wright&background=random', 'ACTIVE', 0),
    ('Stephanie Gilmore', 'AUS', '🇦🇺', 'Regular', 36, 7.5, 'B', 'Female', 'https://ui-avatars.com/api/?name=Steph+Gilmore&background=random', 'ACTIVE', 0);

-- 2. Insert Event
INSERT INTO public.events (name, slug, status, start_date, end_date)
VALUES 
    ('Lexus Pipe Pro', 'lexus-pipe-pro-2024', 'UPCOMING', now(), now() + interval '14 days')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Heats (Dynamically select event ID)
DO $$
DECLARE
    eid uuid;
BEGIN
    SELECT id INTO eid FROM public.events WHERE slug = 'lexus-pipe-pro-2024' LIMIT 1;
    
    INSERT INTO public.heats (event_id, round_number, heat_number, status)
    VALUES
        (eid, 1, 1, 'UPCOMING'),
        (eid, 1, 2, 'UPCOMING'),
        (eid, 1, 3, 'UPCOMING');
END $$;
