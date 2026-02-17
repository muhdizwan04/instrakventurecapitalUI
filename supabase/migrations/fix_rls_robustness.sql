-- =======================================================
-- 🛠 FIX: ROBUST ADMIN CHECK & RLS
-- =======================================================

-- 1. RECREATE is_admin FUNCTION WITH ROBUST SETTINGS
-- (We use CREATE OR REPLACE to avoid dropping dependent policies)
-- We use SECURITY DEFINER to ensure it can read admin_users even if RLS blocks it.
-- We Set search_path to public to prevent hijacking.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_email TEXT;
BEGIN
  -- Get current user email
  current_email := auth.email();
  
  -- If no email (not logged in), return false immediately
  IF current_email IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if email exists in admin_users
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE email = current_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. ENSURE ADMIN_USERS RLS ALLOWS THE FUNCTION TO WORK
-- The function is SECURITY DEFINER, so it bypasses RLS on admin_users table.
-- However, we verify the table exists and policies are not interfering.

-- 4. VERIFY SITE_CONTENT POLICIES
-- Ensure the simplified function is used.

-- Re-apply policies just in case (idempotent if they match)
DROP POLICY IF EXISTS "Admins can update site_content" ON public.site_content;
CREATE POLICY "Admins can update site_content"
  ON public.site_content
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert site_content" ON public.site_content;
CREATE POLICY "Admins can insert site_content"
  ON public.site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- 5. RELAX ADMIN_USERS READ POLICY SLIGHTLY FOR DEBUGGING/ROBUSTNESS
-- Allow authenticated users to read the admin list if they are in it.
-- (This was already the case, but let's make sure).

DROP POLICY IF EXISTS "Admins can read admin list" ON public.admin_users;
CREATE POLICY "Admins can read admin list"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- 6. GRANT EXECUTE ON FUNCTION
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
