-- =======================================================
-- Update Background Colors for All Service Detail Pages
-- =======================================================
-- Run this in Supabase Dashboard → SQL Editor → New query
-- This script updates all sections to use dark blue backgrounds like About Us
-- =======================================================

-- Update function to set dark blue backgrounds
DO $$
DECLARE
    service_record RECORD;
    section_record RECORD;
    section_index INTEGER;
    colors TEXT[] := ARRAY['#1A365D', '#0A3D62', '#1A365D', '#0F2942'];
    bg_color TEXT;
    updated_content JSONB;
    updated_pages JSONB := '[]'::JSONB;
    updated_sections JSONB;
BEGIN
    -- Get current service_pages content
    SELECT content INTO updated_content
    FROM site_content
    WHERE id = 'service_pages';
    
    -- Loop through each service page
    FOR service_record IN 
        SELECT * FROM jsonb_array_elements(updated_content->'pages') AS page
    LOOP
        updated_sections := '[]'::JSONB;
        section_index := 0;
        
        -- Loop through each section in the service
        FOR section_record IN
            SELECT * FROM jsonb_array_elements(service_record.value->'sections') AS section
        LOOP
            -- Determine background color (alternating pattern)
            bg_color := colors[(section_index % array_length(colors, 1)) + 1];
            
            -- Update section with new bgColor and white text
            updated_sections := updated_sections || jsonb_set(
                section_record.value,
                '{styles,bgColor}',
                to_jsonb(bg_color)
            ) || jsonb_set(
                jsonb_set(
                    section_record.value,
                    '{styles,bgColor}',
                    to_jsonb(bg_color)
                ),
                '{styles,textColor}',
                to_jsonb('#FFFFFF')
            ) || jsonb_set(
                jsonb_set(
                    jsonb_set(
                        section_record.value,
                        '{styles,bgColor}',
                        to_jsonb(bg_color)
                    ),
                    '{styles,textColor}',
                    to_jsonb('#FFFFFF')
                ),
                '{styles,titleColor}',
                to_jsonb('#FFFFFF')
            );
            
            section_index := section_index + 1;
        END LOOP;
        
        -- Update the service page with updated sections
        updated_pages := updated_pages || jsonb_set(
            service_record.value,
            '{sections}',
            updated_sections
        );
    END LOOP;
    
    -- Update the database
    UPDATE site_content
    SET 
        content = jsonb_set(content, '{pages}', updated_pages),
        updated_at = NOW()
    WHERE id = 'service_pages';
    
    RAISE NOTICE '✅ Successfully updated all service pages with dark blue backgrounds!';
END $$;

-- Verify the update
SELECT 
    page->>'id' as service_id,
    section->>'title' as section_title,
    section->'styles'->>'bgColor' as background_color
FROM site_content,
    jsonb_array_elements(content->'pages') AS page,
    jsonb_array_elements(page->'sections') AS section
WHERE id = 'service_pages'
ORDER BY page->>'id', (section->>'title')
LIMIT 20;
