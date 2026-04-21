-- Adds last_sign_in tracking to client_profiles so the admin can show
-- when each client last signed in on the public site.
--
-- Run this in the Supabase SQL editor (project > SQL editor > New query),
-- then click Run. It is idempotent and safe to re-run.

ALTER TABLE public.client_profiles
    ADD COLUMN IF NOT EXISTS last_sign_in_at timestamptz,
    ADD COLUMN IF NOT EXISTS sign_in_count integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS client_profiles_last_sign_in_at_idx
    ON public.client_profiles (last_sign_in_at DESC);

-- Allow an authenticated client to update only their own last_sign_in_at /
-- sign_in_count row. Other columns stay protected by existing policies.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'client_profiles'
          AND policyname = 'client_profiles_update_own_sign_in'
    ) THEN
        CREATE POLICY client_profiles_update_own_sign_in
            ON public.client_profiles
            FOR UPDATE
            TO authenticated
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);
    END IF;
END
$$;
