#!/usr/bin/env node
/**
 * Seed Investment Platforms content into every service page.
 * Reads DB from Supabase (or from --backup file), builds sections from
 * scripts/investment-platforms-content.json, applies matching design (dark blue theme),
 * and optionally saves back to DB.
 *
 * Usage:
 *   node scripts/seed-investment-platforms-content.cjs --preview     # Show what would be done
 *   node scripts/seed-investment-platforms-content.cjs --save        # Fetch from Supabase, update, save
 *   node scripts/seed-investment-platforms-content.cjs --backup path/to/backup.json --preview
 *   node scripts/seed-investment-platforms-content.cjs --backup path/to/backup.json --save
 *
 * Backup: If you have supabase/Backupinstrak20feb (or similar), use:
 *   --backup supabase/Backupinstrak20feb
 * File must be JSON with either { "pages": [...] } or { "content": { "pages": [...] } }.
 */

const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.resolve(__dirname, '..', '.env');
const env = {};
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
        const t = line.trim();
        if (t && !t.startsWith('#')) {
            const [k, ...v] = t.split('=');
            if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

// Design configuration (match existing dark blue theme)
const DARK = {
    bg: '#1A365D',
    bg2: '#0A3D62',
    bg3: '#0F2942',
    text: '#FFFFFF',
    subtitle: 'rgba(255,255,255,0.9)',
    muted: 'rgba(255,255,255,0.85)',
    accent: '#C9A227',
};
const LIGHT_BG = '#F8FAFC';
const LIGHT_TEXT = '#1A365D';
const LIGHT_TITLE = '#0A3D62';

function section(id, title, subtitle, content, items, layoutType = 'standard', bg = DARK.bg, textColor = DARK.text, titleColor = DARK.text, extra = {}) {
    const styles = {
        layoutType,
        bgColor: bg,
        textColor: textColor || DARK.text,
        titleColor: titleColor || DARK.text,
        subtitleColor: DARK.subtitle,
        itemTitleColor: textColor || DARK.text,
        itemDescColor: DARK.muted,
        iconColor: DARK.accent,
        textAlign: 'center',
        contentFontSize: 18,
        titleFontSize: 32,
        subtitleFontSize: 18,
        titleFontFamily: 'var(--font-heading)',
        subtitleFontFamily: 'var(--font-main)',
        contentFontFamily: 'var(--font-main)',
        ...extra.styles,
    };
    return {
        id,
        title: title || '',
        subtitle: subtitle || '',
        content: content || '',
        items: items || [],
        styles,
        ...extra,
    };
}

function listItems(titles, icon = 'CheckCircle2') {
    return (titles || []).map((t, i) => ({ id: `item-${i}`, title: t, icon }));
}

/**
 * Build sections for a service from the platform content and intro.
 */
function buildSectionsForService(serviceId, pageTitle, platformData, introData) {
    const prefix = serviceId;
    const sections = [];

    // 1. Hero
    const heroTitle = platformData ? platformData.title : pageTitle;
    const heroSubtitle = platformData ? platformData.intro : introData?.subtitle || '';
    sections.push({
        id: `${prefix}-hero`,
        title: heroTitle,
        subtitle: heroSubtitle,
        content: '',
        items: [],
        styles: {
            layoutType: 'hero',
            bgColor: DARK.bg,
            textColor: DARK.text,
            titleColor: DARK.text,
            subtitleColor: DARK.subtitle,
            textAlign: 'center',
            titleFontSize: 48,
            subtitleFontSize: 20,
            titleFontFamily: 'var(--font-heading)',
            subtitleFontFamily: 'var(--font-main)',
        },
        isHero: true,
    });

    // 2. Introduction (intro paragraphs)
    if (introData && introData.paragraphs && introData.paragraphs.length) {
        sections.push(section(
            `${prefix}-introduction`,
            '',
            '',
            introData.paragraphs.join('\n\n'),
            [],
            'standard',
            DARK.bg2,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    if (!platformData) {
        return sections;
    }

    // 3. Focus / Key areas (list)
    if (platformData.focusItems && platformData.focusItems.length) {
        sections.push(section(
            `${prefix}-focus`,
            platformData.focus || 'Our platform focuses on',
            '',
            '',
            listItems(platformData.focusItems),
            'list',
            DARK.bg3,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // 4. Key Features (list or icon-group)
    if (platformData.keyFeatures && platformData.keyFeatures.length) {
        sections.push(section(
            `${prefix}-key-features`,
            'Key Features',
            '',
            '',
            listItems(platformData.keyFeatures, 'Star'),
            'list',
            DARK.bg2,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Key Offerings (Private Wealth)
    if (platformData.keyOfferings && platformData.keyOfferings.length) {
        sections.push(section(
            `${prefix}-key-offerings`,
            'Key Offerings',
            '',
            '',
            listItems(platformData.keyOfferings, 'Briefcase'),
            'list',
            DARK.bg3,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Key Benefits (Share Financing)
    if (platformData.keyBenefits && platformData.keyBenefits.length) {
        sections.push(section(
            `${prefix}-key-benefits`,
            'Key Benefits',
            '',
            '',
            listItems(platformData.keyBenefits, 'CheckCircle2'),
            'list',
            DARK.bg2,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Services Include (Equity, Virtual CFO)
    if (platformData.servicesInclude && platformData.servicesInclude.length) {
        sections.push(section(
            `${prefix}-services-include`,
            'Services Include',
            '',
            '',
            listItems(platformData.servicesInclude, 'FileText'),
            'list',
            DARK.bg3,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Use Cases
    if (platformData.useCases && platformData.useCases.length) {
        sections.push(section(
            `${prefix}-use-cases`,
            'Use Cases',
            '',
            '',
            listItems(platformData.useCases, 'Target'),
            'list',
            DARK.bg2,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Scope (REF)
    if (platformData.scope && platformData.scope.length) {
        sections.push(section(
            `${prefix}-scope`,
            'Scope',
            '',
            '',
            listItems(platformData.scope, 'Globe'),
            'list',
            DARK.bg3,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Target Segments / Target Clients / Ideal For
    const targetList = platformData.targetSegments || platformData.targetClients || platformData.idealFor;
    if (targetList && targetList.length) {
        sections.push(section(
            `${prefix}-target`,
            'Ideal For',
            '',
            '',
            listItems(targetList, 'Users'),
            'list',
            DARK.bg2,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Capabilities (M&A)
    if (platformData.capabilities && platformData.capabilities.length) {
        sections.push(section(
            `${prefix}-capabilities`,
            'Capabilities',
            '',
            '',
            listItems(platformData.capabilities, 'Zap'),
            'list',
            DARK.bg3,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Platform Highlights (GIG)
    if (platformData.highlights && platformData.highlights.length) {
        sections.push(section(
            `${prefix}-highlights`,
            'Platform Highlights',
            '',
            '',
            listItems(platformData.highlights, 'Globe'),
            'list',
            DARK.bg2,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Coverage Areas (Asset Insurance)
    if (platformData.coverageAreas && platformData.coverageAreas.length) {
        sections.push(section(
            `${prefix}-coverage`,
            'Coverage Areas',
            '',
            '',
            listItems(platformData.coverageAreas, 'Shield'),
            'list',
            DARK.bg3,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Applications (Tokenization)
    if (platformData.applications && platformData.applications.length) {
        sections.push(section(
            `${prefix}-applications`,
            'Applications',
            '',
            '',
            listItems(platformData.applications, 'Layers'),
            'list',
            DARK.bg2,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    // Benefits (Tokenization)
    if (platformData.benefits && platformData.benefits.length) {
        sections.push(section(
            `${prefix}-benefits`,
            'Benefits',
            '',
            '',
            listItems(platformData.benefits, 'TrendingUp'),
            'list',
            DARK.bg3,
            DARK.text,
            DARK.text,
            {}
        ));
    }

    return sections;
}

// Service ID to platform key mapping (order preserved for SQL output)
const SERVICE_IDS = [
    'virtual-cfo', 'equity-financing', 'real-estate-financing', 'reits',
    'share-financing', 'merger-acquisition', 'tokenization', 'asset-insurance',
    'ppli', 'gig', 'private-wealth', 'aum'
];
const SERVICE_TO_PLATFORM = {
    'aum': 'aum',
    'private-wealth': 'private-wealth',
    'share-financing': 'share-financing',
    'equity-financing': 'equity-financing',
    'real-estate-financing': 'real-estate-financing',
    'merger-acquisition': 'merger-acquisition',
    'gig': 'gig',
    'virtual-cfo': 'virtual-cfo',
    'asset-insurance': 'asset-insurance',
    'tokenization': 'tokenization',
    'reits': 'reits',
    'ppli': 'ppli',
};

async function main() {
    const args = process.argv.slice(2);
    const preview = args.includes('--preview');
    const save = args.includes('--save');
    const outputSql = args.includes('--output-sql');
    const backupIdx = args.indexOf('--backup');
    const backupPath = backupIdx >= 0 && args[backupIdx + 1] ? args[backupIdx + 1] : null;

    if (outputSql) {
        const contentPath = path.resolve(__dirname, 'investment-platforms-content.json');
        if (!fs.existsSync(contentPath)) {
            console.error('Missing scripts/investment-platforms-content.json');
            process.exit(1);
        }
        const platformContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
        const intro = platformContent.intro || {};
        const platforms = platformContent.platforms || {};
        const pages = [];
        for (const sid of SERVICE_IDS) {
            const platformKey = SERVICE_TO_PLATFORM[sid];
            const platformData = platforms[platformKey] || null;
            const title = platformData ? platformData.title : sid;
            const subtitle = platformData ? (platformData.intro || '') : '';
            const newSections = buildSectionsForService(sid, title, platformData, intro);
            pages.push({
                id: sid,
                title,
                subtitle,
                introduction: subtitle,
                sections: newSections,
                fields: [],
                formStyles: {},
            });
        }
        const content = { pages };
        const jsonStr = JSON.stringify(content);
        const sqlPath = path.resolve(__dirname, 'seed-investment-platforms-content.sql');
        const sql = `-- =======================================================
-- Investment Platforms content – paste into Supabase SQL Editor
-- =======================================================
-- Generated by: node scripts/seed-investment-platforms-content.cjs --output-sql
-- This replaces the full service_pages content with Investment Platforms sections and design.
-- =======================================================

UPDATE site_content
SET
  content = $payload$${jsonStr}$payload$::jsonb,
  updated_at = NOW()
WHERE id = 'service_pages';

-- Verify
SELECT id, jsonb_array_length(content->'pages') AS page_count
FROM site_content
WHERE id = 'service_pages';
`;
        fs.writeFileSync(sqlPath, sql, 'utf-8');
        console.log('Wrote', sqlPath);
        process.exit(0);
    }

    if (!preview && !save) {
        console.log(`
Usage:
  node scripts/seed-investment-platforms-content.cjs --output-sql
      Generate scripts/seed-investment-platforms-content.sql for pasting into Supabase SQL Editor.

  node scripts/seed-investment-platforms-content.cjs --preview
      Show what sections would be added/updated for each service (no DB write).

  node scripts/seed-investment-platforms-content.cjs --save
      Fetch current content from Supabase, merge in new sections, save back.

  node scripts/seed-investment-platforms-content.cjs --backup <path> --preview
      Use a backup JSON file instead of Supabase for reading. File must have:
      { "pages": [ { "id", "title", "sections", ... } ] }

  node scripts/seed-investment-platforms-content.cjs --backup <path> --save
      Read from backup file, apply content, then save to Supabase.

Backup file format: same as site_content.content for id = 'service_pages'.
Example: { "pages": [ { "id": "aum", "title": "...", "sections": [], "fields": [], "formStyles": {} } ] }
`);
        process.exit(0);
    }

    const contentPath = path.resolve(__dirname, 'investment-platforms-content.json');
    if (!fs.existsSync(contentPath)) {
        console.error('Missing scripts/investment-platforms-content.json');
        process.exit(1);
    }
    const platformContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
    const intro = platformContent.intro || {};
    const platforms = platformContent.platforms || {};

    let currentContent = null;

    if (backupPath) {
        const abs = path.isAbsolute(backupPath) ? backupPath : path.resolve(process.cwd(), backupPath);
        if (!fs.existsSync(abs)) {
            console.error('Backup file not found:', abs);
            process.exit(1);
        }
        const raw = fs.readFileSync(abs, 'utf-8');
        const data = JSON.parse(raw);
        currentContent = data.content || data.pages ? { pages: data.pages } : data;
        if (!currentContent.pages) {
            console.error('Backup file must contain "pages" array or { "content": { "pages": [...] } }');
            process.exit(1);
        }
        console.log('Read backup from:', abs, '\n');
    } else {
        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing VITE_SUPABASE_URL or Supabase key in .env. Use --backup <path> to read from file.');
            process.exit(1);
        }
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.from('site_content').select('content').eq('id', 'service_pages').single();
        if (error || !data) {
            console.error('Failed to fetch service_pages from Supabase:', error?.message || 'No data');
            process.exit(1);
        }
        currentContent = data.content;
        console.log('Fetched service_pages from Supabase.\n');
    }

    const pages = currentContent.pages || [];
    const updatedPages = [];

    for (const page of pages) {
        const sid = page.id;
        const platformKey = SERVICE_TO_PLATFORM[sid];
        const platformData = platformKey ? platforms[platformKey] : null;
        const newSections = buildSectionsForService(sid, page.title, platformData, intro);
        const updatedPage = { ...page, sections: newSections };
        updatedPages.push(updatedPage);

        if (preview) {
            console.log(`Service: ${sid} (${page.title})`);
            console.log(`  Sections: ${newSections.length}`);
            newSections.forEach((s, i) => console.log(`    ${i + 1}. ${s.id} [${s.styles?.layoutType}] ${s.title || '(no title)'}`));
            console.log('');
        }
    }

    if (save) {
        if (!supabaseUrl || !supabaseKey) {
            console.error('Cannot --save: missing VITE_SUPABASE_URL or Supabase key in .env');
            process.exit(1);
        }
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        const newContent = { ...currentContent, pages: updatedPages };
        const { error } = await supabase.from('site_content').update({ content: newContent, updated_at: new Date().toISOString() }).eq('id', 'service_pages');
        if (error) {
            console.error('Failed to update Supabase:', error.message);
            if (error.code === '42501') console.error('Tip: Use VITE_SUPABASE_SERVICE_ROLE_KEY in .env to bypass RLS.');
            process.exit(1);
        }
        console.log('Successfully updated service_pages in Supabase.');
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
