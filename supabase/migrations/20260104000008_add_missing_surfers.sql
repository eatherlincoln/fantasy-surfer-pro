-- Add missing WSL 2025 Men's Roster Surfers
-- Use INSERT ON CONFLICT DO NOTHING to avoid duplicates if run multiple times

INSERT INTO public.surfers (name, country, flag, stance, gender, tier, value, image)
SELECT name, country, flag, stance, gender, tier, value, image
FROM (VALUES
  ('Seth Moniz', 'HAW', '🇺🇸', 'Regular', 'Male', 'B', 6.0, 'https://ui-avatars.com/api/?name=Seth+Moniz&background=random'),
  ('Miguel Pupo', 'BRA', '🇧🇷', 'Goofy', 'Male', 'B', 6.5, 'https://ui-avatars.com/api/?name=Miguel+Pupo&background=random'),
  ('Kauli Vaast', 'FRA', '🇫🇷', 'Goofy', 'Male', 'B', 7.0, 'https://ui-avatars.com/api/?name=Kauli+Vaast&background=random'),
  ('Jake Marshall', 'USA', '🇺🇸', 'Regular', 'Male', 'B', 7.5, 'https://ui-avatars.com/api/?name=Jake+Marshall&background=random'),
  ('Crosby Colapinto', 'USA', '🇺🇸', 'Regular', 'Male', 'A', 8.0, 'https://ui-avatars.com/api/?name=Crosby+Colapinto&background=random'),
  ('Mihimana Braye', 'PYF', '🇵🇫', 'Regular', 'Male', 'C', 4.0, 'https://ui-avatars.com/api/?name=Mihimana+Braye&background=random'),
  ('Yago Dora', 'BRA', '🇧🇷', 'Goofy', 'Male', 'A', 9.0, 'https://ui-avatars.com/api/?name=Yago+Dora&background=random'),
  ('Joel Vaughan', 'AUS', '🇦🇺', 'Regular', 'Male', 'C', 5.0, 'https://ui-avatars.com/api/?name=Joel+Vaughan&background=random'),
  ('Teiva Tairoa', 'PYF', '🇵🇫', 'Goofy', 'Male', 'C', 4.0, 'https://ui-avatars.com/api/?name=Teiva+Tairoa&background=random'),
  ('Cole Houshmand', 'USA', '🇺🇸', 'Goofy', 'Male', 'B', 7.0, 'https://ui-avatars.com/api/?name=Cole+Houshmand&background=random'),
  ('Rio Waida', 'IDN', '🇮🇩', 'Regular', 'Male', 'B', 6.0, 'https://ui-avatars.com/api/?name=Rio+Waida&background=random'),
  ('Alan Cleland', 'MEX', '🇲🇽', 'Regular', 'Male', 'C', 5.0, 'https://ui-avatars.com/api/?name=Alan+Cleland&background=random'),
  ('Connor O''Leary', 'JPN', '🇯🇵', 'Goofy', 'Male', 'B', 7.5, 'https://ui-avatars.com/api/?name=Connor+OLeary&background=random'),
  ('Leonardo Fioravanti', 'ITA', '🇮🇹', 'Regular', 'Male', 'B', 7.0, 'https://ui-avatars.com/api/?name=Leonardo+Fioravanti&background=random'),
  ('Joao Chianca', 'BRA', '🇧🇷', 'Regular', 'Male', 'A', 8.5, 'https://ui-avatars.com/api/?name=Joao+Chianca&background=random'),
  ('Filipe Toledo', 'BRA', '🇧🇷', 'Regular', 'Male', 'A', 9.5, 'https://ui-avatars.com/api/?name=Filipe+Toledo&background=random'),
  ('Barron Mamiya', 'HAW', '🇺🇸', 'Regular', 'Male', 'B', 7.0, 'https://ui-avatars.com/api/?name=Barron+Mamiya&background=random'),
  ('Marco Mignot', 'FRA', '🇫🇷', 'Regular', 'Male', 'C', 5.0, 'https://ui-avatars.com/api/?name=Marco+Mignot&background=random')
) AS s(name, country, flag, stance, gender, tier, value, image)
WHERE NOT EXISTS (
    SELECT 1 FROM public.surfers WHERE name = s.name
);
