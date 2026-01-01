ALTER TABLE public.surfers ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('Male', 'Female'));
