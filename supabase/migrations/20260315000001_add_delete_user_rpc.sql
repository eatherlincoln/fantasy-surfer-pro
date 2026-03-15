-- RPC: delete_user
-- Allows admins to permanently delete a user and their data
-- This is a SECURITY DEFINER function to allow deleting from auth.users

CREATE OR REPLACE FUNCTION public.delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- 1. Verify the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- 2. Manually delete dependencies to avoid FK errors
  DELETE FROM public.league_members WHERE user_id = target_user_id;
  DELETE FROM public.user_teams WHERE user_id = target_user_id;
  DELETE FROM public.leagues WHERE created_by = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  
  -- 3. Finally delete from auth tables (Requires SECURITY DEFINER)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;
