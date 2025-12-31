
-- Clear existing data
TRUNCATE TABLE public.surfers CASCADE;

-- Insert Men (Placeholder Data maintained)
INSERT INTO public.surfers (name, country, flag, stance, age, value, tier, image) VALUES
('John John Florence', 'HAW', '🇺🇸', 'Regular', 31, 10.0, 'A', 'https://placehold.co/400x400/png?text=JJF'),
('Griffin Colapinto', 'USA', '🇺🇸', 'Regular', 25, 9.5, 'A', 'https://placehold.co/400x400/png?text=Griffin'),
('Jack Robinson', 'AUS', '🇦🇺', 'Regular', 26, 9.0, 'A', 'https://placehold.co/400x400/png?text=Jack'),
('Ethan Ewing', 'AUS', '🇦🇺', 'Regular', 25, 8.5, 'A', 'https://placehold.co/400x400/png?text=Ethan'),
('Italo Ferreira', 'BRA', '🇧🇷', 'Goofy', 29, 8.0, 'A', 'https://placehold.co/400x400/png?text=Italo'),
('Gabriel Medina', 'BRA', '🇧🇷', 'Goofy', 30, 7.5, 'B', 'https://placehold.co/400x400/png?text=Gabe'),
('Jordy Smith', 'RSA', '🇿🇦', 'Regular', 36, 7.0, 'B', 'https://placehold.co/400x400/png?text=Jordy'),
('Jake Marshall', 'USA', '🇺🇸', 'Regular', 25, 6.5, 'B', 'https://placehold.co/400x400/png?text=Jake'),
('Barron Mamiya', 'HAW', '🇺🇸', 'Regular', 24, 6.0, 'B', 'https://placehold.co/400x400/png?text=Barron'),
('Cole Houshmand', 'USA', '🇺🇸', 'Goofy', 23, 6.0, 'B', 'https://placehold.co/400x400/png?text=Cole'),
('Kanoa Igarashi', 'JPN', '🇯🇵', 'Regular', 26, 6.0, 'B', 'https://placehold.co/400x400/png?text=Kanoa'),
('Ryan Callinan', 'AUS', '🇦🇺', 'Goofy', 31, 5.5, 'B', 'https://placehold.co/400x400/png?text=Ryan'),
('Rio Waida', 'INA', '🇮🇩', 'Regular', 24, 5.5, 'B', 'https://placehold.co/400x400/png?text=Rio'),
('Liam O''Brien', 'AUS', '🇦🇺', 'Regular', 24, 5.0, 'B', 'https://placehold.co/400x400/png?text=Liam'),
('Leonardo Fioravanti', 'ITA', '🇮🇹', 'Regular', 26, 5.0, 'B', 'https://placehold.co/400x400/png?text=Leo'),
('Matthew McGillivray', 'RSA', '🇿🇦', 'Regular', 26, 4.5, 'C', 'https://placehold.co/400x400/png?text=Matt'),
('Connor O''Leary', 'JPN', '🇯🇵', 'Goofy', 30, 4.5, 'C', 'https://placehold.co/400x400/png?text=Connor'),
('Yago Dora', 'BRA', '🇧🇷', 'Goofy', 27, 4.5, 'C', 'https://placehold.co/400x400/png?text=Yago'),
('Imaikalani deVault', 'HAW', '🇺🇸', 'Regular', 26, 4.0, 'C', 'https://placehold.co/400x400/png?text=Imai'),
('Seth Moniz', 'HAW', '🇺🇸', 'Regular', 26, 4.0, 'C', 'https://placehold.co/400x400/png?text=Seth'),
('Ramzi Boukhiam', 'MOR', '🇲🇦', 'Goofy', 30, 3.5, 'C', 'https://placehold.co/400x400/png?text=Ramzi'),
('Crosby Colapinto', 'USA', '🇺🇸', 'Regular', 22, 3.5, 'C', 'https://placehold.co/400x400/png?text=Crosby');

-- Insert Women (Updated with User Data)
INSERT INTO public.surfers (name, country, flag, stance, age, value, tier, image) VALUES
('Molly Picklum', 'AUS', '🇦🇺', 'Regular', 21, 11.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/f8218596d_molly-picklum.png'),
('Caitlin Simmers', 'USA', '🇺🇸', 'Regular', 18, 10.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/6cf94906a_caitlyn-simmers.png'),
('Caroline Marks', 'USA', '🇺🇸', 'Goofy', 22, 9.5, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/664d54e46_caroline-marks.png'),
('Betty Lou Sakura Johnson', 'HAW', '🇺🇸', 'Regular', 19, 8.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/dfa6b644b_betty-lou-sakura.png'),
('Gabriela Bryan', 'HAW', '🇺🇸', 'Regular', 22, 6.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/c3a3ce643_gabby-bryant.png'),
('Isabella Nichols', 'AUS', '🇦🇺', 'Regular', 26, 4.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/88b56d5e2_isabella-nichols.png'),
('Tyler Wright', 'AUS', '🇦🇺', 'Regular', 29, 6.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/abf499dea_tyler-wright.png'),
('Erin Brooks', 'CAN', '🇨🇦', 'Goofy', 17, 7.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/5e0fc50ec_erin-brooks.png'),
('Lakey Peterson', 'USA', '🇺🇸', 'Regular', 29, 5.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/bad52d00a_lakey-peterson.png'),
('Luana Silva', 'BRA', '🇧🇷', 'Regular', 19, 4.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/b91cac22b_luana-silva.png'),
('Sawyer Lindblad', 'USA', '🇺🇸', 'Goofy', 18, 4.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/f29351216_sawyer-linblad.png'),
('Johanne Defay', 'FRA', '🇫🇷', 'Regular', 30, 1.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/94b9eedd2_johanne-defay.png'),
('Vahine Fierro', 'FRA', '🇫🇷', 'Goofy', 24, 1.0, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/7e2031507_vahine-fierro.png'),
('Bella Kenworthy', 'USA', '🇺🇸', 'Regular', 17, 2.0, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/326cc8f41_bella-kenworthy.png'),
('Sally Fitzgibbons', 'AUS', '🇦🇺', 'Regular', 33, 4.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/52b4ebf42_sally-fitzgibbons.png'),
('Tatiana Weston-Webb', 'BRA', '🇧🇷', 'Goofy', 27, 1.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/6c42e2917_tatiana-weston-webb.png'),
('Nadia Erostarbe', 'EUS', '🇪🇸', 'Goofy', 23, 0.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/3e8090198_nadia-erostarbe.png'),
('Brisa Hennessy', 'CRC', '🇨🇷', 'Regular', 24, 5.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/18462750c_brisa-hennessy.png');
