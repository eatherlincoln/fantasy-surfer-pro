-- Fix metadata for specific surfers reported as missing data
UPDATE public.surfers
SET country = 'AUS', flag = '🇦🇺', image = 'https://ui-avatars.com/api/?name=Joel+Vaughan&background=random'
WHERE name = 'Joel Vaughan';

-- Ensure all 'UNK' surfers get at least a random avatar if missing
UPDATE public.surfers
SET image = 'https://ui-avatars.com/api/?name=' || replace(name, ' ', '+') || '&background=random'
WHERE image IS NULL OR image = '';
