-- =======================================================
-- 🔒 COMPREHENSIVE DATABASE SECURITY MIGRATION
-- =======================================================
-- This migration secures ALL tables with Row-Level Security (RLS)
-- and creates an admin_users whitelist for strict access control.
--
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
--
-- Tables secured:
--   1. admin_users     - Admin whitelist (only service_role can manage)
--   2. site_content    - Public read, admin-only write
--   3. inquiries       - Public insert, admin-only read/update
--   4. client_profiles - User can only access their own profile
-- =======================================================


-- =========================================
-- 1. ADMIN USERS TABLE (Whitelist)
-- =========================================
-- Only emails listed here can access the admin panel
-- and write to protected tables

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS — nobody can tamper with the admin list
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read the admin_users table (to verify their own status)
DROP POLICY IF EXISTS "Admins can read admin list" ON public.admin_users;
CREATE POLICY "Admins can read admin list"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.email() = email);

-- Service role has full access (for manual management via SQL Editor)
DROP POLICY IF EXISTS "Service role manages admin_users" ON public.admin_users;
CREATE POLICY "Service role manages admin_users"
  ON public.admin_users
  FOR ALL
  TO service_role
  USING (true);

GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;

-- ⚡ INSERT YOUR ADMIN EMAILS HERE
-- Change these to your actual admin emails!
INSERT INTO public.admin_users (email) VALUES ('admin@admin.com')
  ON CONFLICT (email) DO NOTHING;



-- =========================================
-- Helper function: Check if current user is admin
-- =========================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = auth.email()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================
-- 2. SITE_CONTENT TABLE
-- =========================================
-- Public can read, only admins can write

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (clean slate)
DROP POLICY IF EXISTS "Public can read site_content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated can read site_content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated can insert site_content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated can update site_content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated can delete site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can insert site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can update site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can delete site_content" ON public.site_content;

-- ✅ PUBLIC READ: Anyone can read content (website needs this)
CREATE POLICY "Public can read site_content"
  ON public.site_content
  FOR SELECT
  USING (true);

-- ✅ ADMIN-ONLY WRITE: Only whitelisted admins can modify content
CREATE POLICY "Admins can insert site_content"
  ON public.site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update site_content"
  ON public.site_content
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete site_content"
  ON public.site_content
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Grant permissions
GRANT SELECT ON public.site_content TO anon;
GRANT ALL ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;


-- =========================================
-- 3. INQUIRIES TABLE
-- =========================================
-- Public can submit, only admins can view/manage

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (clean slate)
DROP POLICY IF EXISTS "Public can insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Authenticated can read inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Authenticated can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Authenticated can delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Authenticated can insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Anon can insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can read inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.inquiries;

-- ✅ PUBLIC INSERT: Anyone can submit a contact form
CREATE POLICY "Anon can insert inquiries"
  ON public.inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert inquiries"
  ON public.inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ✅ ADMIN-ONLY READ: Only whitelisted admins can view inquiries
CREATE POLICY "Admins can read inquiries"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ✅ ADMIN-ONLY UPDATE: Only admins can mark as resolved etc.
CREATE POLICY "Admins can update inquiries"
  ON public.inquiries
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ✅ ADMIN-ONLY DELETE: Only admins can delete inquiries
CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Grant permissions
GRANT INSERT ON public.inquiries TO anon;
GRANT ALL ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;


-- =========================================
-- 4. CLIENT_PROFILES TABLE (reinforced)
-- =========================================
-- Users can only access their own profile
-- Admins can view all profiles (for UsersManager)

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.client_profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.client_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

-- Users can insert their own profile (registration)
CREATE POLICY "Users can insert own profile"
  ON public.client_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.client_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Grant access
GRANT ALL ON public.client_profiles TO authenticated;
GRANT ALL ON public.client_profiles TO service_role;


-- =========================================
-- ✅ VERIFICATION QUERIES
-- =========================================
-- Run these after applying to verify everything works:

-- 1. Check RLS is enabled:
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('site_content', 'inquiries', 'client_profiles', 'admin_users');

-- 2. Check admin users exist:
-- SELECT * FROM admin_users;

-- 3. Test the is_admin() function (run while logged in as admin):
-- SELECT public.is_admin();
