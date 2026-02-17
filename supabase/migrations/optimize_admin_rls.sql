-- OPTIMIZE ADMIN USERS RLS
-- The previous policy used is_admin() which queries admin_users, creating a potential recursion loop
-- even with SECURITY DEFINER if not handled perfectly.
-- We switch to a direct email check which is O(1) and zero recursion.

BEGIN;

-- 1. Drop the potentially recursive policy
DROP POLICY IF EXISTS "Admins can read admin list" ON public.admin_users;

-- 2. Create a specific, non-recursive policy for users to check their OWN status
CREATE POLICY "Users can check own admin status"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  email = auth.jwt() ->> 'email'
);

-- 3. Ensure index exists for this lookup (crucial for performance)
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);

COMMIT;
