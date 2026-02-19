-- =======================================================
-- Add Hero & Introduction Sections to All Service Pages
-- =======================================================
-- Run this in Supabase Dashboard → SQL Editor → New query
-- This adds hero and introduction sections to services that don't have them
-- =======================================================

DO $$
DECLARE
    current_content JSONB;
    updated_pages JSONB := '[]'::JSONB;
    page_item JSONB;
    updated_sections JSONB;
    hero_section JSONB;
    intro_section JSONB;
    has_hero BOOLEAN;
    has_intro BOOLEAN;
BEGIN
    -- Get current content
    SELECT content INTO current_content
    FROM site_content
    WHERE id = 'service_pages';
    
    -- Process each page
    FOR page_item IN SELECT * FROM jsonb_array_elements(current_content->'pages')
    LOOP
        updated_sections := COALESCE(page_item->'sections', '[]'::JSONB);
        has_hero := FALSE;
        has_intro := FALSE;
        
        -- Check if hero/intro sections already exist
        FOR hero_section IN SELECT * FROM jsonb_array_elements(updated_sections)
        LOOP
            IF (hero_section->'styles'->>'layoutType' = 'hero' OR (hero_section->>'isHero')::boolean = TRUE) THEN
                has_hero := TRUE;
            END IF;
            IF hero_section->>'id' = (page_item->>'id' || '-introduction') THEN
                has_intro := TRUE;
            END IF;
        END LOOP;
        
        -- Add hero section if missing
        IF NOT has_hero AND page_item->>'title' IS NOT NULL THEN
            hero_section := jsonb_build_object(
                'id', page_item->>'id' || '-hero',
                'title', page_item->>'title',
                'subtitle', COALESCE(page_item->>'subtitle', page_item->>'introduction', ''),
                'content', '',
                'items', '[]'::JSONB,
                'styles', jsonb_build_object(
                    'layoutType', 'hero',
                    'bgColor', '#1A365D',
                    'textColor', '#FFFFFF',
                    'titleColor', '#FFFFFF',
                    'subtitleColor', 'rgba(255,255,255,0.9)',
                    'textAlign', 'center',
                    'titleFontSize', 48,
                    'subtitleFontSize', 20
                ),
                'isHero', TRUE
            );
            updated_sections := jsonb_build_array(hero_section) || updated_sections;
        END IF;
        
        -- Add introduction section if missing and different from hero subtitle
        IF NOT has_intro AND page_item->>'introduction' IS NOT NULL 
           AND page_item->>'introduction' != COALESCE(page_item->>'subtitle', '') THEN
            intro_section := jsonb_build_object(
                'id', page_item->>'id' || '-introduction',
                'title', '',
                'subtitle', '',
                'content', page_item->>'introduction',
                'items', '[]'::JSONB,
                'styles', jsonb_build_object(
                    'layoutType', 'standard',
                    'bgColor', '#0A3D62',
                    'textColor', '#FFFFFF',
                    'titleColor', '#FFFFFF',
                    'textAlign', 'center',
                    'contentFontSize', 18
                )
            );
            -- Insert after hero (position 1) or at beginning
            IF jsonb_array_length(updated_sections) > 0 THEN
                updated_sections := updated_sections::jsonb || jsonb_build_array(intro_section);
            ELSE
                updated_sections := jsonb_build_array(intro_section);
            END IF;
        END IF;
        
        -- Build updated page with updated sections
        updated_pages := updated_pages || jsonb_set(
            page_item,
            '{sections}',
            updated_sections
        );
    END LOOP;
    
    -- Update the database
    UPDATE site_content
    SET 
        content = jsonb_set(current_content, '{pages}', updated_pages),
        updated_at = NOW()
    WHERE id = 'service_pages';
    
    RAISE NOTICE '✅ Successfully added hero/intro sections to all service pages!';
    RAISE NOTICE '   Updated % pages', jsonb_array_length(updated_pages);
END $$;

-- Verify the update worked
SELECT 
    page->>'id' as service,
    section->>'title' as section_title,
    section->'styles'->>'layoutType' as layout_type,
    CASE WHEN (section->>'isHero')::boolean = TRUE THEN 'YES' ELSE 'NO' END as is_hero
FROM site_content,
    jsonb_array_elements(content->'pages') AS page,
    jsonb_array_elements(page->'sections') AS section
WHERE id = 'service_pages'
ORDER BY page->>'id', 
    CASE WHEN (section->>'isHero')::boolean = TRUE THEN 0 ELSE 1 END,
    (section->>'title')
LIMIT 40;
