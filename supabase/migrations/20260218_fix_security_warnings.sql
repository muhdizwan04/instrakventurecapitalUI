-- =======================================================
-- FIX SUPABASE SECURITY LINTER WARNINGS
-- =======================================================
-- Run this in Supabase Dashboard > SQL Editor
--
-- Issues fixed:
--   1. handle_verified_user() missing SET search_path
--   2. is_admin() missing SET search_path
--   3. Stale permissive RLS policies on inquiries
--   4. Stale permissive RLS policies on site_content
-- =======================================================


-- =========================================
-- 1. FIX: handle_verified_user search_path
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_verified_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL THEN
      INSERT INTO public.client_profiles (id, email, full_name, company_name, phone)
      VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'company_name',
        NEW.raw_user_meta_data->>'phone'
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.client_profiles.full_name),
        company_name = COALESCE(EXCLUDED.company_name, public.client_profiles.company_name),
        phone = COALESCE(EXCLUDED.phone, public.client_profiles.phone),
        updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- =========================================
-- 2. FIX: is_admin() search_path
-- =========================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = auth.email()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- =========================================
-- 3. FIX: Drop stale OLD policies on inquiries
-- =========================================
-- These are the old permissive policies that weren't cleaned up
DROP POLICY IF EXISTS "Allow authenticated delete"  ON public.inquiries;
DROP POLICY IF EXISTS "Allow authenticated update"  ON public.inquiries;
DROP POLICY IF EXISTS "Allow public insert"         ON public.inquiries;

-- Replace the overly-permissive INSERT policies with validated ones
DROP POLICY IF EXISTS "Anon can insert inquiries"           ON public.inquiries;
DROP POLICY IF EXISTS "Authenticated can insert inquiries"  ON public.inquiries;

CREATE POLICY "Anon can insert inquiries"
  ON public.inquiries
  FOR INSERT
  TO anon
  WITH CHECK (
    email IS NOT NULL AND email <> ''
    AND type IS NOT NULL AND type <> ''
  );

CREATE POLICY "Authenticated can insert inquiries"
  ON public.inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    email IS NOT NULL AND email <> ''
    AND type IS NOT NULL AND type <> ''
  );


-- =========================================
-- 4. FIX: Drop stale OLD policies on site_content
-- =========================================
DROP POLICY IF EXISTS "Allow authenticated insert"  ON public.site_content;
DROP POLICY IF EXISTS "Allow authenticated update"  ON public.site_content;

-- The secure replacements already exist from secure_all_tables.sql:
--   "Admins can insert site_content" → WITH CHECK (public.is_admin())
--   "Admins can update site_content" → USING/WITH CHECK (public.is_admin())
--   "Admins can delete site_content" → USING (public.is_admin())


-- =========================================
-- VERIFY: Run these after to confirm fixes
-- =========================================
-- Check remaining policies:
-- SELECT policyname, tablename, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
