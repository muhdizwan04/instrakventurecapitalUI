-- =======================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- =======================================================
-- This script sets up a "Trigger" that automatically creates a client_profile
-- whenever a new user signs up in Supabase Auth.
-- This works even if email verification is pending.

-- 1. Create the Function that runs on new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.client_profiles (id, email, full_name, company_name, phone)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'company_name', 
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Ensure Table Exists and has Permissions (Just in case)
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    company_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view/update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.client_profiles;
CREATE POLICY "Users can view own profile" ON public.client_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.client_profiles;
CREATE POLICY "Users can update own profile" ON public.client_profiles FOR UPDATE USING (auth.uid() = id);

-- Grant access
GRANT ALL ON public.client_profiles TO authenticated;
GRANT ALL ON public.client_profiles TO service_role;
