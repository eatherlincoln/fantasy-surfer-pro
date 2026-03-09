DO $$
DECLARE
    v_event_id UUID;
    v_heat1_id UUID;
    v_heat2_id UUID;
    v_heat3_id UUID;
    v_heat4_id UUID;
    v_heat5_id UUID;
    v_heat6_id UUID;
    v_heat7_id UUID;
    v_heat8_id UUID;
BEGIN
    SELECT id INTO v_event_id FROM events LIMIT 1;
    
    SELECT id INTO v_heat1_id FROM heats WHERE event_id = v_event_id AND round_number = 1 AND heat_number = 1 LIMIT 1;
    SELECT id INTO v_heat2_id FROM heats WHERE event_id = v_event_id AND round_number = 1 AND heat_number = 2 LIMIT 1;
    SELECT id INTO v_heat3_id FROM heats WHERE event_id = v_event_id AND round_number = 1 AND heat_number = 3 LIMIT 1;
    SELECT id INTO v_heat4_id FROM heats WHERE event_id = v_event_id AND round_number = 1 AND heat_number = 4 LIMIT 1;
    SELECT id INTO v_heat5_id FROM heats WHERE event_id = v_event_id AND round_number = 1 AND heat_number = 5 LIMIT 1;
    SELECT id INTO v_heat6_id FROM heats WHERE event_id = v_event_id AND round_number = 1 AND heat_number = 6 LIMIT 1;
    SELECT id INTO v_heat7_id FROM heats WHERE event_id = v_event_id AND round_number = 1 AND heat_number = 7 LIMIT 1;
    SELECT id INTO v_heat8_id FROM heats WHERE event_id = v_event_id AND round_number = 1 AND heat_number = 8 LIMIT 1;

    -- HEAT 1
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat1_id, id, 8.40 FROM surfers WHERE name ILIKE 'Igor Moraes';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat1_id, id, 13.07 FROM surfers WHERE name ILIKE 'Dakoda Walters';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat1_id, id, 11.44 FROM surfers WHERE name ILIKE 'Mihimana Braye';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat1_id, id, 11.27 FROM surfers WHERE name ILIKE 'Dom Thomas';
    
    -- HEAT 2
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat2_id, id, 9.50 FROM surfers WHERE name ILIKE 'Luke Swanson';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat2_id, id, 10.03 FROM surfers WHERE name ILIKE 'Tenshi Iwami';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat2_id, id, 11.34 FROM surfers WHERE name ILIKE 'Lennix Smith';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat2_id, id, 14.07 FROM surfers WHERE name ILIKE 'Caleb Tancred';

    -- HEAT 3
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat3_id, id, 9.27 FROM surfers WHERE name ILIKE 'Dylan Moffat';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat3_id, id, 7.96 FROM surfers WHERE name ILIKE 'Daiki Tanaka';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat3_id, id, 9.00 FROM surfers WHERE name ILIKE 'Rylan Beavers';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat3_id, id, 9.37 FROM surfers WHERE name ILIKE 'Eden Hasson';

    -- HEAT 4
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat4_id, id, 7.57 FROM surfers WHERE name ILIKE 'Maxime Huscenot';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat4_id, id, 13.84 FROM surfers WHERE name ILIKE 'Alister Reginato';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat4_id, id, 8.86 FROM surfers WHERE name ILIKE 'Taj Stokes';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat4_id, id, 10.40 FROM surfers WHERE name ILIKE 'Willem Watson';

    -- HEAT 5
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat5_id, id, 7.20 FROM surfers WHERE name ILIKE 'Jarvis Earle';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat5_id, id, 7.84 FROM surfers WHERE name ILIKE 'Julian Wilson';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat5_id, id, 10.06 FROM surfers WHERE name ILIKE 'Makana Franzmann';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat5_id, id, 11.17 FROM surfers WHERE name ILIKE 'Ocean Lancaster';

    -- HEAT 6
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat6_id, id, 9.70 FROM surfers WHERE name ILIKE 'Joh Azuchi';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat6_id, id, 10.34 FROM surfers WHERE name ILIKE 'Rafael Teixeira';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat6_id, id, 14.50 FROM surfers WHERE name ILIKE 'Reef Heazlewood';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat6_id, id, 6.17 FROM surfers WHERE name ILIKE 'Harley Walters';

    -- HEAT 7
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat7_id, id, 8.10 FROM surfers WHERE name ILIKE 'Luke Tema';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat7_id, id, 8.83 FROM surfers WHERE name ILIKE 'Jose Francisco';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat7_id, id, 8.17 FROM surfers WHERE name ILIKE 'Slade Prestwich';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat7_id, id, 5.04 FROM surfers WHERE name ILIKE 'Oliver Ryssenbeek';

    -- HEAT 8
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat8_id, id, 7.70 FROM surfers WHERE name ILIKE 'Justin Becret';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat8_id, id, 5.20 FROM surfers WHERE name ILIKE 'Tully Wylie';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat8_id, id, 14.23 FROM surfers WHERE name ILIKE 'Hayden Rodgers';
    INSERT INTO scores (heat_id, surfer_id, wave_score) SELECT v_heat8_id, id, 12.03 FROM surfers WHERE name ILIKE 'Ben Lorentson';

    -- Update globally recalculating surfers points
    UPDATE surfers s SET current_season_points = (
        SELECT COALESCE(SUM(wave_score), 0) FROM scores sc 
        WHERE sc.surfer_id = s.id
    )
    WHERE EXISTS (SELECT 1 FROM scores sc WHERE sc.surfer_id = s.id);

    UPDATE user_teams ut SET points = (
        SELECT COALESCE(SUM(wave_score), 0) FROM scores sc 
        WHERE sc.surfer_id = ut.surfer_id
    )
    WHERE EXISTS (SELECT 1 FROM scores sc WHERE sc.surfer_id = ut.surfer_id);

END $$;
