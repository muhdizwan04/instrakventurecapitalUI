-- site_content revision history: each UPDATE to site_content archives the previous JSONB
-- before the new value is written. Admins can list and restore from site_content_revisions.
--
-- Run in Supabase Dashboard → SQL Editor. Idempotent where possible.
-- Requires public.is_admin() (same pattern as scripts/allow-admin-delete-chat-conversations.sql).

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id TEXT NOT NULL REFERENCES public.site_content (id) ON DELETE CASCADE,
    content JSONB NOT NULL,
    previous_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_content_revisions_content_id_created_at
    ON public.site_content_revisions (content_id, created_at DESC);

COMMENT ON TABLE public.site_content_revisions IS
    'Archived site_content JSON before each UPDATE; used for admin restore / audit.';

-- ---------------------------------------------------------------------------
-- Trigger: archive old row on UPDATE when content actually changes; prune extras
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.archive_site_content_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.content IS DISTINCT FROM NEW.content THEN
        INSERT INTO public.site_content_revisions (content_id, content, previous_updated_at)
        VALUES (OLD.id, OLD.content, OLD.updated_at);

        DELETE FROM public.site_content_revisions r
        WHERE r.id IN (
            SELECT s.id
            FROM public.site_content_revisions s
            WHERE s.content_id = OLD.id
            ORDER BY s.created_at DESC
            OFFSET 50
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS site_content_archive_on_update ON public.site_content;
CREATE TRIGGER site_content_archive_on_update
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW
    EXECUTE PROCEDURE public.archive_site_content_revision();

-- ---------------------------------------------------------------------------
-- RLS: admins may read history; inserts only via trigger (SECURITY DEFINER)
-- ---------------------------------------------------------------------------
ALTER TABLE public.site_content_revisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS site_content_revisions_admin_select ON public.site_content_revisions;
CREATE POLICY site_content_revisions_admin_select
    ON public.site_content_revisions
    FOR SELECT
    TO authenticated
    USING (public.is_admin());
