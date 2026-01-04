-- 1. Add fields to Events for Dynamic Headers & AI Context
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS header_image text DEFAULT 'https://placehold.co/1200x400/0055aa/ffffff?text=Event+Header',
ADD COLUMN IF NOT EXISTS ai_context text;

-- 2. Add fields to Profiles for User Management
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 3. Create a secure function to check if user is admin (optional helper for RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update Policies to restrict banning/admin actions to Admins Only
-- (We keep it loose for now to ensure you can access it, but this adds the strict policy option)

CREATE POLICY "Admins can update any profile (Ban/Unban)"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  public.is_admin() = true
);

-- 5. Allow Admins to View All Profiles (already public usually, but ensures banned status visibility if RLS applied)
-- existing policy is "Public profiles are viewable by everyone.", so that covers it.
