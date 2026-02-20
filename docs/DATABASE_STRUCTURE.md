# Database Structure & Color Storage

## Overview

The application uses **PostgreSQL/Supabase** with a `site_content` table that stores all page content, structure, and styling information as **JSONB** (JSON Binary) data.

## Table Structure

```sql
CREATE TABLE site_content (
    id TEXT PRIMARY KEY,           -- e.g., 'service_pages', 'about', 'home'
    content JSONB NOT NULL,       -- All content, structure, and styles stored here
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Service Pages Structure

For service detail pages, the data is stored under `id = 'service_pages'` with this structure:

```json
{
  "pages": [
    {
      "id": "virtual-cfo",
      "title": "Business Finance Consulting – Virtual CFO",
      "subtitle": "Strategic financial guidance...",
      "introduction": "...",
      
      // ═══════════════════════════════════════════════════════
      // CONTENT SECTIONS (Dynamic, editable sections)
      // ═══════════════════════════════════════════════════════
      "sections": [
        {
          "id": "virtual-cfo-hero",
          "title": "Business Finance Consulting",
          "subtitle": "Strategic financial guidance...",
          "content": "...",
          "items": [],
          "isHero": true,
          
          // ═══════════════════════════════════════════════════
          // STYLES OBJECT - All colors and appearance settings
          // ═══════════════════════════════════════════════════
          "styles": {
            "layoutType": "hero",              // Layout type: hero, standard, grid, etc.
            "bgColor": "#1A365D",              // Background color
            "textColor": "#FFFFFF",            // Main text color
            "titleColor": "#FFFFFF",           // Title color
            "subtitleColor": "rgba(255,255,255,0.9)",  // Subtitle color
            "itemTitleColor": "#FFFFFF",       // Item title color
            "itemDescColor": "rgba(255,255,255,0.85)", // Item description color
            "iconColor": "#C9A227",            // Icon color (gold accent)
            
            // Typography
            "titleFontSize": 48,               // Title font size in pixels
            "subtitleFontSize": 20,            // Subtitle font size
            "contentFontSize": 16,             // Content font size
            "titleFontFamily": "var(--font-heading)",  // Font family for titles
            "subtitleFontFamily": "var(--font-main)",   // Font family for subtitles
            "contentFontFamily": "var(--font-main)",   // Font family for content
            
            // Layout & Alignment
            "textAlign": "center",             // Text alignment: left, center, right
            "subtitleAlign": "center",
            "contentAlign": "center",
            
            // Card/Box Styling
            "cardStyle": "glass",              // glass or solid
            "cardColor": "#FFFFFF",            // Card background color
            
            // Background Image (optional)
            "backgroundImage": "https://...",  // Background image URL
            "backgroundSize": "cover",          // cover, contain, etc.
            "overlayOpacity": 0.4              // Overlay opacity (0-1)
          }
        },
        {
          "id": "virtual-cfo-introduction",
          "title": "Introduction",
          "subtitle": "...",
          "content": "...",
          "items": [],
          "styles": {
            "layoutType": "standard",
            "bgColor": "#0A3D62",
            "textColor": "#FFFFFF",
            // ... same structure as above
          }
        }
        // ... more sections
      ],
      
      // ═══════════════════════════════════════════════════════
      // FORM STYLES - Form appearance customization
      // ═══════════════════════════════════════════════════════
      "formStyles": {
        // Section Wrapper
        "sectionBg": "#1A365D",                    // Form section background
        "sectionTitle": "Request a Consultation",   // Form section title
        "sectionSubtitle": "Tell us about...",      // Form section subtitle
        "sectionTitleColor": "#FFFFFF",             // Title color
        "sectionSubtitleColor": "rgba(255,255,255,0.85)",  // Subtitle color
        
        // Form Card
        "cardBg": "#FFFFFF",                        // Form card background
        "cardBorderColor": "rgba(255,255,255,0.15)", // Card border color
        "cardRadius": "lg",                         // Border radius: none, sm, md, lg, xl
        "cardShadow": "strong",                     // Shadow: none, subtle, medium, strong
        
        // Labels & Inputs
        "labelColor": "#1A365D",                    // Label text color
        "inputBg": "#FFFFFF",                       // Input background
        "inputBorderColor": "rgba(26,54,93,0.2)",   // Input border color
        "inputFocusColor": "#C9A227",               // Focus ring color (gold)
        "placeholderColor": "#9CA3AF",              // Placeholder text color
        "inputRadius": "md",                        // Input border radius
        
        // Headings
        "headingColor": "#1A365D",                  // Section heading color
        "headingSeparator": true,                    // Show separator line
        
        // Submit Button
        "btnBg": "#C9A227",                         // Button background
        "btnText": "#FFFFFF",                       // Button text color
        "btnHoverBg": "#B8860B",                    // Button hover background
        "btnLabel": "Submit Inquiry",               // Button label text
        "btnRadius": "md",                          // Button border radius
        "btnStyle": "solid"                         // Button style: solid, outline, gradient
      },
      
      // ═══════════════════════════════════════════════════════
      // FORM FIELDS - Form field definitions
      // ═══════════════════════════════════════════════════════
      "fields": [
        {
          "id": "fullName",
          "label": "Full Name",
          "type": "text",                           // text, email, tel, textarea, select, checkbox
          "required": true,
          "width": "half",                          // half or full
          "placeholder": "Enter your full name"     // Placeholder text
        },
        {
          "id": "services",
          "label": "Services Interested In",
          "type": "select",
          "required": true,
          "width": "full",
          "placeholder": "Select a service...",
          "options": ["Service 1", "Service 2", "Service 3"]
        }
        // ... more fields
      ]
    }
    // ... more service pages
  ]
}
```

## Color Storage Format

### Colors are stored as:
- **Hex codes**: `"#1A365D"`, `"#FFFFFF"`, `"#C9A227"`
- **RGBA strings**: `"rgba(255,255,255,0.85)"` for transparency
- **CSS variables**: `"var(--font-heading)"` for font families

### Color Properties in `styles` object:
```json
{
  "bgColor": "#1A365D",              // Section background
  "textColor": "#FFFFFF",            // Main text
  "titleColor": "#FFFFFF",           // Titles
  "subtitleColor": "rgba(255,255,255,0.9)",  // Subtitles
  "itemTitleColor": "#FFFFFF",       // Item titles
  "itemDescColor": "rgba(255,255,255,0.85)", // Item descriptions
  "iconColor": "#C9A227"             // Icons (gold accent)
}
```

## How Data is Updated

### 1. Via Admin Interface
- Changes made in admin panel → Saved via `useContent` hook
- Updates the `content` JSONB column directly
- Uses Supabase client library

### 2. Via SQL Scripts
- Direct JSONB manipulation using PostgreSQL functions:
  - `jsonb_set()` - Update nested values
  - `jsonb_build_object()` - Create JSON objects
  - `jsonb_array_elements()` - Iterate arrays
  - `COALESCE()` - Handle null values

### Example SQL Update:
```sql
UPDATE site_content
SET content = jsonb_set(
    content,
    '{pages}',
    updated_pages_array
)
WHERE id = 'service_pages';
```

## Querying the Data

### Get all service pages:
```sql
SELECT content->'pages' 
FROM site_content 
WHERE id = 'service_pages';
```

### Get specific page:
```sql
SELECT page
FROM site_content,
     jsonb_array_elements(content->'pages') AS page
WHERE id = 'service_pages' 
  AND page->>'id' = 'virtual-cfo';
```

### Get section styles:
```sql
SELECT 
    section->'styles'->>'bgColor' as background_color,
    section->'styles'->>'textColor' as text_color
FROM site_content,
     jsonb_array_elements(content->'pages') AS page,
     jsonb_array_elements(page->'sections') AS section
WHERE id = 'service_pages';
```

### Get form styles:
```sql
SELECT 
    page->'formStyles'->>'sectionBg' as form_background,
    page->'formStyles'->>'btnBg' as button_color
FROM site_content,
     jsonb_array_elements(content->'pages') AS page
WHERE id = 'service_pages';
```

## Benefits of JSONB Storage

1. **Flexible Schema**: Easy to add new properties without migrations
2. **Nested Structure**: Store complex hierarchical data
3. **Query Support**: PostgreSQL JSONB operators for efficient queries
4. **Type Safety**: Can validate JSON structure in application layer
5. **Performance**: JSONB is binary, indexed, and fast

## Key Points

- ✅ All colors stored as **hex codes** or **RGBA strings**
- ✅ All structure (sections, items) stored as **nested JSON arrays/objects**
- ✅ Styles are **per-section** (in `sections[].styles`)
- ✅ Form styles are **per-page** (in `pages[].formStyles`)
- ✅ Updates use **JSONB functions** for safe manipulation
- ✅ No separate color tables - everything in one JSONB column
