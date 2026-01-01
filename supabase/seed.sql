
-- Clear existing data
TRUNCATE TABLE public.surfers CASCADE;

-- Insert Men (Placeholder Data maintained)
-- Insert Men
INSERT INTO public.surfers (name, country, flag, stance, age, value, tier, image, gender) VALUES
('John John Florence', 'HAW', '🇺🇸', 'Regular', 31, 10.0, 'A', 'https://ui-avatars.com/api/?name=John+John+Florence&background=random&size=200', 'Male'),
('Griffin Colapinto', 'USA', '🇺🇸', 'Regular', 25, 9.5, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/0e6877764_Griffin-Colapinto.png', 'Male'),
('Jack Robinson', 'AUS', '🇦🇺', 'Regular', 26, 9.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/4f62274f0_Jack-Robinson.png', 'Male'),
('Ethan Ewing', 'AUS', '🇦🇺', 'Regular', 25, 8.5, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/53aa937f5_Ethan-Ewing.png', 'Male'),
('Italo Ferreira', 'BRA', '🇧🇷', 'Goofy', 29, 8.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/3ddea78af_Italo-Ferraria.png', 'Male'),
('Gabriel Medina', 'BRA', '🇧🇷', 'Goofy', 30, 7.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/aebc31dff_Gabby-Medina.png', 'Male'),
('Jordy Smith', 'RSA', '🇿🇦', 'Regular', 36, 7.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/d589c0194_Jordy-Smith.png', 'Male'),
('Jake Marshall', 'USA', '🇺🇸', 'Regular', 25, 6.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/a9c534c51_Jake-Marshall.png', 'Male'),
('Barron Mamiya', 'HAW', '🇺🇸', 'Regular', 24, 6.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/649ca6fb4_Barron-Mamiya.png', 'Male'),
('Cole Houshmand', 'USA', '🇺🇸', 'Goofy', 23, 6.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/466443c69_Cole-Houshmand.png', 'Male'),
('Kanoa Igarashi', 'JPN', '🇯🇵', 'Regular', 26, 6.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/552a8cfc5_kanoa-Igarashi.png', 'Male'),
('Ryan Callinan', 'AUS', '🇦🇺', 'Goofy', 31, 5.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/a76d045f8_Ryan-Callinan.png', 'Male'),
('Rio Waida', 'INA', '🇮🇩', 'Regular', 24, 5.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/f65c34ae8_Rio-M.png', 'Male'),
('Liam O''Brien', 'AUS', '🇦🇺', 'Regular', 24, 5.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/8cf75c02b_Laim-Obrien.png', 'Male'),
('Leonardo Fioravanti', 'ITA', '🇮🇹', 'Regular', 26, 5.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/b4e9a0f31_Leo-Fivo.png', 'Male'),
('Matthew McGillivray', 'RSA', '🇿🇦', 'Regular', 26, 4.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/71246df27_Matt-Mcgillvary.png', 'Male'),
('Connor O''Leary', 'JPN', '🇯🇵', 'Goofy', 30, 4.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/8bc34ac4c_Connor-Oleary.png', 'Male'),
('Yago Dora', 'BRA', '🇧🇷', 'Goofy', 27, 4.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/c97a7e74e_Yago-Dora.png', 'Male'),
('Imaikalani deVault', 'HAW', '🇺🇸', 'Regular', 26, 4.0, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/90096d2c3_Imaikalani.png', 'Male'),
('Seth Moniz', 'HAW', '🇺🇸', 'Regular', 26, 4.0, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/5c838d264_Seth-Moniz.png', 'Male'),
('Ramzi Boukhiam', 'MOR', '🇲🇦', 'Goofy', 30, 3.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/60acda1fa_Ramzi-Boukhaim.png', 'Male'),
('Crosby Colapinto', 'USA', '🇺🇸', 'Regular', 22, 3.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/3d429d86a_Crosby-Colapinto.png', 'Male');

-- Insert Women (Updated with User Data)
INSERT INTO public.surfers (name, country, flag, stance, age, value, tier, image, gender) VALUES
('Molly Picklum', 'AUS', '🇦🇺', 'Regular', 21, 11.0, 'A', 'https://ui-avatars.com/api/?name=Molly+Picklum&background=random&size=200', 'Female'),
('Caitlin Simmers', 'USA', '🇺🇸', 'Regular', 18, 10.0, 'A', 'https://ui-avatars.com/api/?name=Caitlin+Simmers&background=random&size=200', 'Female'),
('Caroline Marks', 'USA', '🇺🇸', 'Goofy', 22, 9.5, 'A', 'https://ui-avatars.com/api/?name=Caroline+Marks&background=random&size=200', 'Female'),
('Betty Lou Sakura Johnson', 'HAW', '🇺🇸', 'Regular', 19, 8.0, 'A', 'https://ui-avatars.com/api/?name=Betty+Lou+Sakura+Johnson&background=random&size=200', 'Female'),
('Gabriela Bryan', 'HAW', '🇺🇸', 'Regular', 22, 6.5, 'B', 'https://ui-avatars.com/api/?name=Gabriela+Bryan&background=random&size=200', 'Female'),
('Isabella Nichols', 'AUS', '🇦🇺', 'Regular', 26, 4.0, 'B', 'https://ui-avatars.com/api/?name=Isabella+Nichols&background=random&size=200', 'Female'),
('Tyler Wright', 'AUS', '🇦🇺', 'Regular', 29, 6.5, 'B', 'https://ui-avatars.com/api/?name=Tyler+Wright&background=random&size=200', 'Female'),
('Erin Brooks', 'CAN', '🇨🇦', 'Goofy', 17, 7.0, 'B', 'https://ui-avatars.com/api/?name=Erin+Brooks&background=random&size=200', 'Female'),
('Lakey Peterson', 'USA', '🇺🇸', 'Regular', 29, 5.0, 'B', 'https://ui-avatars.com/api/?name=Lakey+Peterson&background=random&size=200', 'Female'),
('Luana Silva', 'BRA', '🇧🇷', 'Regular', 19, 4.5, 'B', 'https://ui-avatars.com/api/?name=Luana+Silva&background=random&size=200', 'Female'),
('Sawyer Lindblad', 'USA', '🇺🇸', 'Goofy', 18, 4.0, 'B', 'https://ui-avatars.com/api/?name=Sawyer+Lindblad&background=random&size=200', 'Female'),
('Johanne Defay', 'FRA', '🇫🇷', 'Regular', 30, 1.5, 'C', 'https://ui-avatars.com/api/?name=Johanne+Defay&background=random&size=200', 'Female'),
('Vahine Fierro', 'FRA', '🇫🇷', 'Goofy', 24, 1.0, 'C', 'https://ui-avatars.com/api/?name=Vahine+Fierro&background=random&size=200', 'Female'),
('Bella Kenworthy', 'USA', '🇺🇸', 'Regular', 17, 2.0, 'C', 'https://ui-avatars.com/api/?name=Bella+Kenworthy&background=random&size=200', 'Female'),
('Sally Fitzgibbons', 'AUS', '🇦🇺', 'Regular', 33, 4.5, 'B', 'https://ui-avatars.com/api/?name=Sally+Fitzgibbons&background=random&size=200', 'Female'),
('Tatiana Weston-Webb', 'BRA', '🇧🇷', 'Goofy', 27, 1.5, 'C', 'https://ui-avatars.com/api/?name=Tatiana+Weston-Webb&background=random&size=200', 'Female'),
('Nadia Erostarbe', 'EUS', '🇪🇸', 'Goofy', 23, 0.5, 'C', 'https://ui-avatars.com/api/?name=Nadia+Erostarbe&background=random&size=200', 'Female'),
('Brisa Hennessy', 'CRC', '🇨🇷', 'Regular', 24, 5.0, 'B', 'https://ui-avatars.com/api/?name=Brisa+Hennessy&background=random&size=200', 'Female');
