-- =======================================================
-- VERIFIED-ONLY PROFILE CREATION TRIGGER
-- =======================================================
-- This script sets up a Trigger that automatically creates a client_profile
-- ONLY when the user's email is verified (email_confirmed_at is not null).

-- 1. Create the Function
CREATE OR REPLACE FUNCTION public.handle_verified_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if email is confirmed
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the Triggers

-- Trigger for NEW users (in case they are auto-verified or created by admin)
DROP TRIGGER IF EXISTS on_auth_user_created_verified ON auth.users;
CREATE TRIGGER on_auth_user_created_verified
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_verified_user();

-- Trigger for UPDATED users (when they click the verification link)
DROP TRIGGER IF EXISTS on_auth_user_verified ON auth.users;
CREATE TRIGGER on_auth_user_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW 
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE PROCEDURE public.handle_verified_user();

-- 3. Cleanup previous trigger if it exists (to avoid duplicates)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Ensure Permissions
GRANT ALL ON public.client_profiles TO authenticated;
GRANT ALL ON public.client_profiles TO service_role;
