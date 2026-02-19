-- =======================================================
-- Update Background, Font Colors & Font Types for All Service Detail Pages
-- =======================================================
-- Run this in Supabase Dashboard → SQL Editor → New query
-- This updates sections to use dark blue backgrounds (#1A365D, #0A3D62, #0F2942)
-- and automatically sets appropriate font colors (white for dark backgrounds)
-- Also sets font families: titles use 'var(--font-heading)', content uses 'var(--font-main)'
-- =======================================================

DO $$
DECLARE
    current_content JSONB;
    updated_pages JSONB := '[]'::JSONB;
    page_item JSONB;
    section_item JSONB;
    updated_sections JSONB;
    section_idx INTEGER;
    colors TEXT[] := ARRAY['#1A365D', '#0A3D62', '#1A365D', '#0F2942'];
    bg_color TEXT;
    updated_section JSONB;
    is_dark_bg BOOLEAN;
BEGIN
    -- Get current content
    SELECT content INTO current_content
    FROM site_content
    WHERE id = 'service_pages';
    
    -- Process each page
    FOR page_item IN SELECT * FROM jsonb_array_elements(current_content->'pages')
    LOOP
        updated_sections := '[]'::JSONB;
        section_idx := 0;
        
        -- Process each section in the page
        FOR section_item IN SELECT * FROM jsonb_array_elements(page_item->'sections')
        LOOP
            -- Get color based on index (alternating pattern)
            bg_color := colors[(section_idx % array_length(colors, 1)) + 1];
            
            -- Start with the original section
            updated_section := section_item;
            
            -- Determine if background is dark (dark blue colors)
            is_dark_bg := bg_color IN ('#1A365D', '#0A3D62', '#0F2942', '#152C4A', '#1A2B47', '#0A2540', '#0A1628');
            
            -- Build updated styles object with background, text colors, and font families
            updated_section := jsonb_set(
                updated_section,
                '{styles}',
                COALESCE(updated_section->'styles', '{}'::JSONB) || jsonb_build_object(
                    'bgColor', bg_color,
                    'textColor', CASE WHEN is_dark_bg THEN '#FFFFFF' ELSE COALESCE((updated_section->'styles'->>'textColor'), '#1A365D') END,
                    'titleColor', CASE WHEN is_dark_bg THEN '#FFFFFF' ELSE COALESCE((updated_section->'styles'->>'titleColor'), '#0A3D62') END,
                    'subtitleColor', CASE WHEN is_dark_bg THEN 'rgba(255,255,255,0.9)' ELSE COALESCE((updated_section->'styles'->>'subtitleColor'), '#64748B') END,
                    'itemTitleColor', CASE WHEN is_dark_bg THEN '#FFFFFF' ELSE COALESCE((updated_section->'styles'->>'itemTitleColor'), '#1A365D') END,
                    'itemDescColor', CASE WHEN is_dark_bg THEN 'rgba(255,255,255,0.85)' ELSE COALESCE((updated_section->'styles'->>'itemDescColor'), '#64748B') END,
                    'iconColor', COALESCE((updated_section->'styles'->>'iconColor'), '#C9A227'),
                    'titleFontFamily', COALESCE((updated_section->'styles'->>'titleFontFamily'), 'var(--font-heading)'),
                    'subtitleFontFamily', COALESCE((updated_section->'styles'->>'subtitleFontFamily'), 'var(--font-main)'),
                    'contentFontFamily', COALESCE((updated_section->'styles'->>'contentFontFamily'), 'var(--font-main)')
                )
            );
            
            -- Add to updated sections array
            updated_sections := updated_sections || updated_section;
            
            section_idx := section_idx + 1;
        END LOOP;
        
        -- Build updated page with updated sections (preserve all other page fields)
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
    
    RAISE NOTICE '✅ Successfully updated all service pages with dark blue backgrounds, white font colors, and font families!';
    RAISE NOTICE '   Updated % pages', jsonb_array_length(updated_pages);
END $$;

-- Verify the update worked
SELECT 
    page->>'id' as service,
    section->>'title' as section_title,
    section->'styles'->>'layoutType' as layout_type,
    section->'styles'->>'bgColor' as background_color,
    section->'styles'->>'textColor' as text_color,
    section->'styles'->>'titleColor' as title_color,
    section->'styles'->>'subtitleColor' as subtitle_color,
    section->'styles'->>'titleFontFamily' as title_font_family,
    section->'styles'->>'subtitleFontFamily' as subtitle_font_family,
    section->'styles'->>'contentFontFamily' as content_font_family
FROM site_content,
    jsonb_array_elements(content->'pages') AS page,
    jsonb_array_elements(page->'sections') AS section
WHERE id = 'service_pages'
ORDER BY page->>'id', 
    CASE WHEN (section->>'isHero')::boolean = TRUE THEN 0 ELSE 1 END,
    (section->>'title')
LIMIT 40;
