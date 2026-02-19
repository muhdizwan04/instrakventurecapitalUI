const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ── Load .env manually ────────────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, '..', '.env');
const env = {};
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            if (key && valueParts.length > 0) {
                env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            }
        }
    });
}

const supabaseUrl = env.VITE_SUPABASE_URL;
// Check for service role key (needed to bypass RLS) - try both naming conventions
const supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const isServiceRole = !!(env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   VITE_SUPABASE_URL');
    console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY');
    console.error('\nPlease check your .env file\n');
    process.exit(1);
}

if (!isServiceRole) {
    console.warn('⚠️  WARNING: Using ANON_KEY - updates may fail due to RLS policies!');
    console.warn('   To update successfully, add SERVICE_ROLE_KEY to your .env file:');
    console.warn('   VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    console.warn('   OR use the SQL script: scripts/update-service-bg-colors-simple.sql\n');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Color schemes - you can customize these
// NOTE: Dark blue colors like About Us page
const COLOR_SCHEMES = {
    // About Us style - DARK BLUE like About Us page
    aboutUs: ['#1A365D', '#0A3D62', '#1A365D', '#0F2942'],
    
    // Alternating dark blue pattern - similar to About Us
    alternating: ['#1A365D', '#0A3D62', '#1A365D', '#0F2942'],
    
    // Dark navy blue variations
    darkNavy: ['#1A2B47', '#1A365D', '#1A2B47', '#0F2942'],
    
    // Professional dark blue gradient
    professional: ['#1A365D', '#152C4A', '#1A365D', '#0F2942'],
    
    // Deep blue tones
    deepBlue: ['#0A3D62', '#1A365D', '#0A3D62', '#152C4A'],
    
    // Light colors (for contrast if needed)
    light: ['#FFFFFF', '#F8FAFC', '#FFFFFF', '#F0F4F8'],
    
    // Custom - modify this array to your preference
    custom: ['#1A365D', '#0A3D62', '#1A365D', '#0F2942']
};

/**
 * Update background colors for all sections in a service
 */
function updateSectionBackgrounds(sections, colorScheme = 'alternating') {
    if (!sections || !Array.isArray(sections)) return sections;
    
    const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.alternating;
    
    return sections.map((section, index) => {
        // Create a deep copy of the section to avoid mutating the original
        const updatedSection = JSON.parse(JSON.stringify(section));
        
        // Ensure styles object exists
        if (!updatedSection.styles) {
            updatedSection.styles = {};
        }
        
        // Apply background color based on index (alternating pattern)
        const colorIndex = index % colors.length;
        updatedSection.styles.bgColor = colors[colorIndex];
        
        // Ensure text color contrasts well with background
        const bgColor = updatedSection.styles.bgColor;
        // Check if background is dark (dark blue/navy colors)
        const isDark = bgColor === '#0A2540' || bgColor === '#0A1628' || bgColor === '#1A365D' || 
                      bgColor === '#0A3D62' || bgColor === '#0F2942' || bgColor === '#152C4A' ||
                      bgColor === '#1A2B47' || (bgColor && bgColor.startsWith('#') && 
                      ['0', '1'].includes(bgColor[1]) && parseInt(bgColor.substring(1, 3), 16) < 50);
        
        // Set default text colors if not already set
        if (!updatedSection.styles.textColor) {
            updatedSection.styles.textColor = isDark ? '#FFFFFF' : '#1A365D';
        }
        if (!updatedSection.styles.titleColor) {
            updatedSection.styles.titleColor = isDark ? '#FFFFFF' : '#0A3D62';
        }
        
        return updatedSection;
    });
}

/**
 * Main function to update all service pages
 */
async function updateServiceBackgroundColors(colorScheme = 'alternating', dryRun = false) {
    console.log('🎨 Updating background colors for all service detail pages...\n');
    console.log(`Color Scheme: ${colorScheme}`);
    console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be saved)' : 'LIVE (changes will be saved)'}\n`);
    
    // Fetch current service_pages content
    const { data: currentData, error: fetchError } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'service_pages')
        .single();
    
    if (fetchError) {
        console.error('❌ Error fetching service_pages:', fetchError);
        process.exit(1);
    }
    
    if (!currentData || !currentData.content || !currentData.content.pages) {
        console.error('❌ No service_pages content found');
        process.exit(1);
    }
    
    const pages = currentData.content.pages;
    console.log(`Found ${pages.length} service pages\n`);
    
    // Update each service page
    let updatedCount = 0;
    const updatedPages = pages.map(page => {
        if (!page.sections || !Array.isArray(page.sections) || page.sections.length === 0) {
            console.log(`⚠️  ${page.id}: No sections found, skipping`);
            return page;
        }
        
        const originalSectionCount = page.sections.length;
        const updatedSections = updateSectionBackgrounds(page.sections, colorScheme);
        
        if (updatedSections.length > 0) {
            updatedCount++;
            console.log(`✅ ${page.id}: Updated ${originalSectionCount} sections`);
            
            // Show first few background colors as preview
            const previewColors = updatedSections.slice(0, 3).map(s => s.styles?.bgColor || 'none');
            console.log(`   Preview colors: ${previewColors.join(', ')}`);
        }
        
        return {
            ...page,
            sections: updatedSections
        };
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Services updated: ${updatedCount}/${pages.length}`);
    console.log(`   Total sections processed: ${updatedPages.reduce((sum, p) => sum + (p.sections?.length || 0), 0)}`);
    
    if (dryRun) {
        console.log('\n🔍 DRY RUN MODE - No changes saved to database');
        console.log('   Run with --save flag to apply changes\n');
        return;
    }
    
    // Save updated content
    console.log('\n💾 Saving changes to database...');
    
    // Verify we have updated sections before saving
    const testPage = updatedPages.find(p => p.id === 'virtual-cfo');
    if (testPage && testPage.sections && testPage.sections[0]) {
        console.log(`   Debug: First section bgColor before save: ${testPage.sections[0].styles?.bgColor}`);
    }
    
    // Use upsert instead of update to ensure it works
    const { data: updateData, error: updateError } = await supabase
        .from('site_content')
        .upsert({
            id: 'service_pages',
            content: { pages: updatedPages },
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'id'
        })
        .select();
    
    if (updateError) {
        console.error('❌ Error updating service_pages:', updateError.message);
        if (updateError.code === '42501') {
            console.error('\n🔒 RLS Policy Error: The ANON_KEY does not have permission to update.');
            console.error('   Solutions:');
            console.error('   1. Add SERVICE_ROLE_KEY to .env:');
            console.error('      VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
            console.error('   2. OR run the SQL script in Supabase Dashboard:');
            console.error('      scripts/update-service-bg-colors-simple.sql\n');
        }
        console.error('   Full error:', JSON.stringify(updateError, null, 2));
        process.exit(1);
    }
    
    // Verify the update worked
    if (updateData && updateData[0]) {
        const savedPage = updateData[0].content.pages.find(p => p.id === 'virtual-cfo');
        if (savedPage && savedPage.sections && savedPage.sections[0]) {
            console.log(`   Debug: First section bgColor after save: ${savedPage.sections[0].styles?.bgColor}`);
        } else {
            console.log('   ⚠️  Warning: Could not verify saved data');
        }
    } else {
        console.log('   ⚠️  Warning: No data returned from update');
    }
    
    console.log('✅ Successfully updated all service pages!\n');
}

/**
 * Preview current background colors
 */
async function previewCurrentColors() {
    const { data: currentData, error: fetchError } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'service_pages')
        .single();
    
    if (fetchError) {
        console.error('❌ Error fetching service_pages:', fetchError);
        process.exit(1);
    }
    
    const pages = currentData.content.pages || [];
    console.log('📋 Current Background Colors by Service:\n');
    
    pages.forEach(page => {
        console.log(`\n${page.id}:`);
        if (!page.sections || page.sections.length === 0) {
            console.log('   No sections');
            return;
        }
        
        page.sections.forEach((section, idx) => {
            const bgColor = section.styles?.bgColor || 'not set';
            const title = section.title || 'Untitled';
            console.log(`   [${idx + 1}] ${title.substring(0, 40).padEnd(40)} → ${bgColor}`);
        });
    });
    
    console.log('\n');
}

// Parse command line arguments
const args = process.argv.slice(2);

// Preview mode
if (args.includes('--preview')) {
    previewCurrentColors()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
    return;
}

const colorScheme = args.find(arg => arg.startsWith('--scheme='))?.split('=')[1] || 'aboutUs';
const dryRun = !args.includes('--save');

// Validate color scheme
if (!COLOR_SCHEMES[colorScheme]) {
    console.error(`❌ Invalid color scheme: ${colorScheme}`);
    console.log(`Available schemes: ${Object.keys(COLOR_SCHEMES).join(', ')}`);
    process.exit(1);
}

// Show help
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🎨 Service Pages Background Color Updater

Usage:
  node scripts/update-service-bg-colors.cjs [options]

Options:
  --preview              Preview current background colors (no changes)
  --scheme=<name>        Color scheme to apply (default: alternating)
  --save                 Actually save changes (default: dry run)
  --help, -h             Show this help message

Available Color Schemes:
  alternating  - Alternating white/light gray (like About Us)
  professional - Professional blue gradient tones
  warm         - Warm neutral tones
  cool         - Cool gray tones
  custom       - Custom colors (edit script to customize)

Examples:
  # Preview current colors
  node scripts/update-service-bg-colors.cjs --preview

  # Dry run with alternating scheme (default)
  node scripts/update-service-bg-colors.cjs

  # Apply alternating scheme
  node scripts/update-service-bg-colors.cjs --scheme=alternating --save

  # Apply professional scheme
  node scripts/update-service-bg-colors.cjs --scheme=professional --save
`);
    process.exit(0);
}

// Run the update
updateServiceBackgroundColors(colorScheme, dryRun)
    .then(() => {
        console.log('✨ Done!\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
