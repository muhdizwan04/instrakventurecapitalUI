-- =====================================================
-- FORM FIELDS MIGRATION SCRIPT (SIMPLE VERSION)
-- =====================================================
-- Run each section separately in Supabase SQL Editor
-- =====================================================

-- Step 1: First, check what service pages exist
SELECT id, content->'pages' as pages FROM site_content WHERE id = 'service_pages';

-- Step 2: If service_pages doesn't exist, create it first with basic structure
-- (Skip this if it already exists)
INSERT INTO site_content (id, content, updated_at)
VALUES (
    'service_pages',
    '{"pages": []}'::jsonb,
    NOW()
)
ON CONFLICT (id) DO NOTHING;
