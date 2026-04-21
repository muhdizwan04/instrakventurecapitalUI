-- Allow admins to delete chat_conversations (and related chat_analytics rows)
-- from the admin panel. Supabase RLS silently blocks delete when no policy
-- matches, which is why deletes appeared to succeed but rows stayed.
--
-- Run in Supabase Dashboard → SQL Editor → New Query → Run. Idempotent.
--
-- Requires the existing public.is_admin() function used by the admin app.
-- If that function does not exist, this will error; see admin/src/context/AuthContext.jsx
-- (rpc('is_admin')) for the canonical check.

-- Ensure RLS is enabled (no-op if already on)
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Drop any old versions before recreating to keep this idempotent
DROP POLICY IF EXISTS chat_conversations_admin_delete ON public.chat_conversations;
DROP POLICY IF EXISTS chat_conversations_admin_select ON public.chat_conversations;

-- Admins can read every row
CREATE POLICY chat_conversations_admin_select
    ON public.chat_conversations
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Admins can delete every row
CREATE POLICY chat_conversations_admin_delete
    ON public.chat_conversations
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- Same for chat_analytics, if the table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'chat_analytics'
    ) THEN
        EXECUTE 'ALTER TABLE public.chat_analytics ENABLE ROW LEVEL SECURITY';
        EXECUTE 'DROP POLICY IF EXISTS chat_analytics_admin_delete ON public.chat_analytics';
        EXECUTE 'DROP POLICY IF EXISTS chat_analytics_admin_select ON public.chat_analytics';
        EXECUTE $q$
            CREATE POLICY chat_analytics_admin_select
                ON public.chat_analytics
                FOR SELECT
                TO authenticated
                USING (public.is_admin())
        $q$;
        EXECUTE $q$
            CREATE POLICY chat_analytics_admin_delete
                ON public.chat_analytics
                FOR DELETE
                TO authenticated
                USING (public.is_admin())
        $q$;
    END IF;
END
$$;
