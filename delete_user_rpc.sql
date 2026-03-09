CREATE OR REPLACE FUNCTION delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Manually delete dependencies to avoid FK errors
  DELETE FROM public.league_members WHERE user_id = target_user_id;
  DELETE FROM public.user_teams WHERE user_id = target_user_id;
  DELETE FROM public.leagues WHERE created_by = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  
  -- Finally delete from auth tables
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;
