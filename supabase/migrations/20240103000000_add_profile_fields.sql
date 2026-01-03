-- Add team_name and full_name to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
