-- =======================================================
-- Update Form Styles for All Service Detail Pages
-- =======================================================
-- Run this in Supabase Dashboard → SQL Editor → New query
-- This updates formStyles to match the dark blue theme (#1A365D, #0A3D62, #0F2942)
-- and improves form design with modern, professional styling
-- =======================================================

DO $$
DECLARE
    current_content JSONB;
    updated_pages JSONB := '[]'::JSONB;
    page_item JSONB;
    updated_page JSONB;
    form_styles JSONB;
BEGIN
    -- Get current content
    SELECT content INTO current_content
    FROM site_content
    WHERE id = 'service_pages';
    
    -- Process each page
    FOR page_item IN SELECT * FROM jsonb_array_elements(current_content->'pages')
    LOOP
        updated_page := page_item;
        
        -- Build improved formStyles object matching dark blue theme
        form_styles := jsonb_build_object(
            -- Section Wrapper (matches page background)
            'sectionBg', '#1A365D',  -- Dark blue background matching service pages
            'sectionTitle', COALESCE((page_item->'formStyles'->>'sectionTitle'), 'Submit Your Inquiry'),
            'sectionSubtitle', COALESCE((page_item->'formStyles'->>'sectionSubtitle'), 'Fill out the form below and our team will get back to you shortly.'),
            'sectionTitleColor', '#FFFFFF',  -- White text on dark background
            'sectionSubtitleColor', 'rgba(255,255,255,0.85)',  -- Light gray/white text for subtitle on dark background
            
            -- Form Card (light card on dark background for contrast)
            'cardBg', '#FFFFFF',  -- White card for readability
            'cardBorderColor', 'rgba(255,255,255,0.15)',  -- Subtle white border
            'cardRadius', 'lg',  -- Rounded corners (16px)
            'cardShadow', 'strong',  -- Strong shadow for depth
            
            -- Labels & Inputs
            'labelColor', '#1A365D',  -- Dark blue labels
            'inputBg', '#FFFFFF',  -- White input background
            'inputBorderColor', 'rgba(26,54,93,0.2)',  -- Subtle border
            'inputFocusColor', '#C9A227',  -- Gold focus ring (brand accent)
            'placeholderColor', '#9CA3AF',  -- Gray placeholder text
            'inputRadius', 'md',  -- Medium rounded inputs (12px)
            
            -- Headings
            'headingColor', '#1A365D',  -- Dark blue headings
            'headingSeparator', true,  -- Show separator line
            
            -- Submit Button (prominent CTA)
            'btnBg', '#C9A227',  -- Gold button (brand accent)
            'btnText', '#FFFFFF',  -- White text
            'btnHoverBg', '#B8860B',  -- Darker gold on hover
            'btnLabel', COALESCE((page_item->'formStyles'->>'btnLabel'), 'Submit Inquiry'),
            'btnRadius', 'md',  -- Medium rounded button (12px)
            'btnStyle', 'solid'  -- Solid button style
        );
        
        -- Merge with existing formStyles to preserve any custom values
        IF page_item->'formStyles' IS NOT NULL THEN
            form_styles := (page_item->'formStyles') || form_styles;
        END IF;
        
        -- Update the page with new formStyles
        updated_page := jsonb_set(updated_page, '{formStyles}', form_styles);
        
        -- Add to updated pages array
        updated_pages := updated_pages || updated_page;
    END LOOP;
    
    -- Update the database
    UPDATE site_content
    SET 
        content = jsonb_set(current_content, '{pages}', updated_pages),
        updated_at = NOW()
    WHERE id = 'service_pages';
    
    RAISE NOTICE '✅ Successfully updated form styles for all service pages!';
    RAISE NOTICE '   Updated % pages', jsonb_array_length(updated_pages);
END $$;

-- Verify the update worked
SELECT 
    page->>'id' as service,
    page->'formStyles'->>'sectionBg' as section_background,
    page->'formStyles'->>'sectionTitleColor' as title_color,
    page->'formStyles'->>'cardBg' as card_background,
    page->'formStyles'->>'btnBg' as button_background,
    page->'formStyles'->>'btnStyle' as button_style,
    page->'formStyles'->>'cardRadius' as card_radius,
    page->'formStyles'->>'cardShadow' as card_shadow
FROM site_content,
    jsonb_array_elements(content->'pages') AS page
WHERE id = 'service_pages'
ORDER BY page->>'id'
LIMIT 20;
