-- Run this in your Supabase SQL Editor to fix the "Client Access Only" issue

-- 1. Create the client_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    company_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies

-- Policy: Allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.client_profiles;
CREATE POLICY "Users can view own profile" 
ON public.client_profiles FOR SELECT 
USING (auth.uid() = id);

-- Policy: Allow users to insert their own profile (Critical for Registration)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.client_profiles;
CREATE POLICY "Users can insert own profile" 
ON public.client_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policy: Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.client_profiles;
CREATE POLICY "Users can update own profile" 
ON public.client_profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. Grant access to authenticated users
GRANT ALL ON public.client_profiles TO authenticated;
GRANT ALL ON public.client_profiles TO service_role;
