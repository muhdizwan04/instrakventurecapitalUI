/**
 * populate-db.cjs
 *
 * Populates the Supabase `site_content` table with ALL fallback / placeholder
 * content that currently lives in the client-side code.
 *
 * Usage:
 *   node scripts/populate-db.cjs            # dry-run – shows what WOULD be inserted
 *   node scripts/populate-db.cjs --confirm  # actually upserts into the database
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env (bypasses RLS).
 */

const fs = require('fs');
const path = require('path');

// ── Load .env ────────────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
    }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌  Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const CONFIRM = process.argv.includes('--confirm');

// ─────────────────────────────────────────────────────────────────────────────
// 1.  HOME  (from admin/src/pages/HomeManager.jsx defaults)
// ─────────────────────────────────────────────────────────────────────────────
const home = {
    heroBlocks: [
        { id: 'hb-1', type: 'title', content: 'Your Venture\nCapital Partner', color: '#1A365D', highlightColor: '#B8860B' },
        { id: 'hb-2', type: 'subtitle', content: 'Governance • Transparency • Integrity', color: '#B8860B' },
        { id: 'hb-3', type: 'text', content: 'Providing foundational governance and integrity essential for scaling visionary industrial leaders across the ASEAN region.', color: '#4A5568' },
        {
            id: 'hb-4', type: 'buttons', buttons: [
                { id: 1, text: 'Register as Investor', link: '/investors', variant: 'solid' },
                { id: 2, text: 'Potential Project Listing', link: '/project-listings', variant: 'outline' }
            ], solidBg: '#1A365D', outlineColor: '#B8860B'
        }
    ],
    heroBackgroundImage: '',
    heroBgOpacity: 0.25,
    heroOverlayOpacity: 0.92,
    servicesSubtitle: 'Comprehensive financial solutions tailored for your growth',
    servicesTitle: 'Our Portfolio',
    servicesSectionStyles: { backgroundColor: '', textColor: '', boxColor: '' },
    industriesSectionStyles: { backgroundColor: '', textColor: '', boxColor: '' },
    industries: [
        { id: 'ind-1', icon: 'Fuel', name: 'Oil and Gas' },
        { id: 'ind-2', icon: 'GraduationCap', name: 'Education' },
        { id: 'ind-3', icon: 'Car', name: 'Automotive' },
        { id: 'ind-4', icon: 'HardHat', name: 'Construction' },
        { id: 'ind-5', icon: 'Building', name: 'Property Dev' },
        { id: 'ind-6', icon: 'Truck', name: 'Logistics' },
        { id: 'ind-7', icon: 'Factory', name: 'Manufacturing' },
        { id: 'ind-8', icon: 'Cpu', name: 'Digital Tech' }
    ],
    trustTitle: 'Trust & Credibility',
    trustSubtitle: 'Institutional-grade structuring, governance and investor alignment for cross-border capital.',
    trustSignals: [
        { id: 'sig-1', label: 'Cross-border capital structuring' },
        { id: 'sig-2', label: 'Institutional governance framework' },
        { id: 'sig-3', label: 'Global investor network' },
        { id: 'sig-4', label: 'Strategic asset management' }
    ],
    trustMetrics: [
        { id: 'met-1', label: 'Global Investor Network', description: 'Access to institutional investors, family offices, and strategic partners across multiple regions.' },
        { id: 'met-2', label: 'Strategic Investment Mandates', description: 'Customised mandates aligned with institutional risk, governance, and return expectations.' },
        { id: 'met-3', label: 'Cross-Border Transactions Facilitated', description: 'Structured capital flows and transactions executed across ASEAN and global markets.' }
    ],
    trustSectionStyles: {
        backgroundColor: '',
        textColor: '',
        boxColor: '',
        titleFontSize: 32,
        subtitleFontSize: 16,
        signalFontSize: 13,
        metricLabelFontSize: 15,
        metricDescFontSize: 13,
        textAlign: 'left'
    },
    customSections: [],
    tabOrder: ['hero', 'services', 'trust', 'industries']
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.  ABOUT  (from src/pages/AboutUs.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const about = {
    sections: [
        {
            id: 'hero', type: 'hero',
            title: 'About Instrak Venture Capital',
            subtitle: 'A global asset and capital management institution specializing in disciplined portfolio mandates, cross-border wealth structuring, and institutional capital strategies.'
        },
        {
            id: 'identity', type: 'custom',
            title: 'Our Identity',
            content: 'Instrak Venture Capital Berhad (IVC) is a global asset and capital management institution specializing in disciplined portfolio mandates, cross-border wealth structuring, and institutional capital strategies.\n\nOperating across Asia, the Middle East, Europe, and the United States, IVC serves a select group of institutional investors, corporations, family offices, and ultra-high-net-worth individuals.\n\nWe do not operate as a retail investment platform.\nWe operate as a mandate-driven capital institution.',
            items: [],
            styles: { layoutType: 'standard', bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'center' }
        },
        {
            id: 'mission', type: 'mission',
            missionTitle: 'Our Mission',
            missionText: 'To structure, protect, and grow global capital through disciplined asset management, transparent governance, and long-term institutional relationships.',
            visionTitle: 'Our Vision',
            visionText: 'To become a globally respected asset and capital management institution bridging strategic financial corridors between Asia, the Middle East, and major global markets.',
            values: [
                { id: 'val-1', title: 'Governance', text: 'Every mandate is structured under defined legal, financial, and risk oversight frameworks.', icon: 'ShieldCheck' },
                { id: 'val-2', title: 'Transparency', text: 'Investors receive clear reporting, structured fee models, and visibility into portfolio allocation.', icon: 'Eye' },
                { id: 'val-3', title: 'Integrity', text: 'We accept engagements selectively, prioritizing long-term institutional relationships over short-term transactions.', icon: 'Scale' }
            ]
        },
        {
            id: 'philosophy', type: 'custom',
            title: 'Our Philosophy',
            subtitle: 'At IVC, capital is not treated as a speculative instrument. It is treated as a long-term responsibility.',
            items: [
                { id: 'phil-1', title: 'Governance', description: 'Every mandate is structured under defined legal, financial, and risk oversight frameworks.', icon: 'Shield' },
                { id: 'phil-2', title: 'Transparency', description: 'Investors receive clear reporting, structured fee models, and visibility into portfolio allocation.', icon: 'Eye' },
                { id: 'phil-3', title: 'Integrity', description: 'We accept engagements selectively, prioritizing long-term institutional relationships over short-term transactions.', icon: 'Scale' }
            ],
            styles: { layoutType: 'cards', textAlign: 'center', textColor: '#1A365D', bgColor: '#F8FAFC' }
        },
        { id: 'board', type: 'board', title: 'Board of Directors', subtitle: 'Guided by seasoned leaders with a commitment to integrity, compliance, and industrial excellence.' },
        {
            id: 'operating-model', type: 'custom',
            title: 'Our Operating Model',
            subtitle: 'IVC functions through a mandate-based engagement structure. Each client relationship is:',
            content: 'This approach ensures discipline, confidentiality, and long-term capital alignment.',
            items: [
                { id: 'op-1', title: 'Evaluated internally', icon: 'CheckCircle' },
                { id: 'op-2', title: 'Structurally designed', icon: 'CheckCircle' },
                { id: 'op-3', title: 'Risk-assessed', icon: 'CheckCircle' },
                { id: 'op-4', title: 'Legally documented', icon: 'CheckCircle' },
                { id: 'op-5', title: 'Monitored through institutional reporting protocols', icon: 'CheckCircle' }
            ],
            styles: { layoutType: 'boxed-group', textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF', groupTitle: 'OPERATIONAL PROTOCOLS' }
        },
        {
            id: 'capital-corridor', type: 'custom',
            title: 'Our Global Capital Corridor',
            subtitle: 'IVC specializes in cross-border capital structuring across key financial regions:',
            items: [
                { id: 'cap-1', title: 'Asia', description: 'Regional growth hub', icon: 'Globe' },
                { id: 'cap-2', title: 'Middle East', description: 'Strategic capital hub', icon: 'Globe' },
                { id: 'cap-3', title: 'Europe', description: 'Institutional investment hub', icon: 'Globe' },
                { id: 'cap-4', title: 'United States', description: 'Global financial hub', icon: 'Globe' }
            ],
            styles: { layoutType: 'grid', textAlign: 'center', textColor: '#1A365D', bgColor: '#F8FAFC' }
        },
        {
            id: 'who-we-serve', type: 'custom',
            title: 'Who We Serve',
            subtitle: 'IVC works with a select group of global clients. Engagement is subject to internal governance review.',
            items: [
                { id: 'serve-1', title: 'Institutional investors', icon: 'Building2' },
                { id: 'serve-2', title: 'Family offices', icon: 'Users' },
                { id: 'serve-3', title: 'Publicly listed corporations', icon: 'Briefcase' },
                { id: 'serve-4', title: 'Strategic investment groups', icon: 'Target' },
                { id: 'serve-5', title: 'Ultra-high-net-worth individuals', icon: 'UserCheck' },
                { id: 'serve-6', title: 'Sovereign-linked entities', icon: 'Shield' }
            ],
            styles: { layoutType: 'icon-group', textAlign: 'center', textColor: '#1A365D', bgColor: '#FFFFFF' }
        },
        {
            id: 'core-pillars', type: 'custom',
            title: 'Core Business Pillars',
            items: [
                { id: 'pillar-1', title: 'Asset Management', description: 'Institutional portfolio mandates focused on capital preservation, structured yield, and alternative asset allocation.', icon: 'Briefcase' },
                { id: 'pillar-2', title: 'Private Wealth & Family Office', description: 'Cross-border wealth structuring for ultra-high-net-worth individuals and multi-generational families.', icon: 'Users' },
                { id: 'pillar-3', title: 'Institutional Capital Solutions', description: 'Structured financing and capital market strategies supporting corporate growth and asset-backed investments.', icon: 'Building2' }
            ],
            styles: { layoutType: 'cards', textAlign: 'center', textColor: '#1A365D', bgColor: '#F8FAFC' }
        },
        {
            id: 'governance-framework', type: 'custom',
            title: 'Our Governance Framework',
            subtitle: 'IVC operates under institutional-grade governance principles.',
            items: [
                { id: 'gov-1', title: 'Risk Oversight', description: 'Structured portfolio allocation models, exposure limits, counterparty evaluation, periodic mandate review.', icon: 'Shield' },
                { id: 'gov-2', title: 'Legal Structuring', description: 'Institutional-grade documentation, cross-border compliance alignment, mandate-based engagement protocols.', icon: 'FileText' },
                { id: 'gov-3', title: 'Reporting Discipline', description: 'Periodic portfolio reporting, asset allocation transparency, risk exposure summaries.', icon: 'Eye' }
            ],
            styles: { layoutType: 'grid', textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF' }
        },
        {
            id: 'leadership-message', type: 'custom',
            title: 'Leadership Message',
            subtitle: 'From the Office of the Group CEO',
            content: 'Instrak Venture Capital Berhad was established with a singular objective: to build a disciplined capital institution that bridges strategic financial corridors across the world.\n\nIn a global environment where capital often moves faster than governance, we believe discipline, transparency, and integrity are the true foundations of sustainable wealth.\n\nOur approach is simple: We do not chase transactions.\nWe structure mandates.\nWe build long-term capital partnerships.',
            items: [],
            styles: { layoutType: 'standard', textAlign: 'center', textColor: '#FFFFFF', bgColor: '#0A2540' }
        },
        {
            id: 'institutional-conduct', type: 'custom',
            title: 'Institutional Conduct',
            subtitle: 'IVC maintains a selective engagement policy. We do not operate on transaction volume. We operate on mandate integrity.',
            content: 'Each engagement is:',
            items: [
                { id: 'conduct-1', title: 'Confidential', icon: 'Shield' },
                { id: 'conduct-2', title: 'Governance-reviewed', icon: 'ShieldCheck' },
                { id: 'conduct-3', title: 'Structurally designed', icon: 'Target' },
                { id: 'conduct-4', title: 'Institutionally documented', icon: 'FileText' }
            ],
            styles: { layoutType: 'list', textAlign: 'left', textColor: '#1A365D', bgColor: '#F8FAFC' }
        },
        { id: 'partners', type: 'partners' },
        { id: 'milestone', type: 'milestone' },
        {
            id: 'closing', type: 'custom',
            title: 'Closing Statement',
            content: 'IVC exists to serve capital with responsibility.\n\nWe structure wealth with discipline.\nWe govern capital with transparency.\nWe grow institutions with integrity.',
            items: [],
            styles: { layoutType: 'standard', textAlign: 'center', textColor: '#FFFFFF', bgColor: '#0A2540' }
        }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 3.  BOARD  (from src/pages/AboutUs.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const board = {
    directors: [
        { id: 'dir-1', name: 'KAHAR KAMARUDIN, ANS', role: 'GROUP CHIEF EXECUTIVE OFFICER (GCEO)', image: '' },
        { id: 'dir-2', name: 'PROF IR. DR. NORIDAH', role: 'NON-EXECUTIVE DIRECTOR', image: '' },
        { id: 'dir-3', name: "RAFI YA'ACOB", role: 'CHIEF OPERATING OFFICER (COO)', image: '' },
        { id: 'dir-4', name: 'ZALIZA YAHYA, CPA', role: 'CHIEF FINANCIAL OFFICER (CFO)', image: '' },
        { id: 'dir-5', name: 'NORZALIZA ABD GHAFAR', role: 'GENERAL MANAGER', image: '' },
        { id: 'dir-6', name: 'NORLI HIDAYATUL AINI', role: 'GENERAL MANAGER', image: '' },
        { id: 'dir-7', name: 'DR. SUHAILY SHAHIMI', role: 'INTERNAL AUDITOR', image: '' }
    ],
    styleColors: {}
};

// ─────────────────────────────────────────────────────────────────────────────
// 4.  PARTNERS  (merged from StrategicPartners.jsx + AboutUs.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const partners = {
    pageHeader: {
        title: 'Strategic Partners & Trust',
        subtitle: 'Building institutional excellence through trusted partnerships and governance.'
    },
    partners: [{
        id: 'p-1',
        category: 'Insurance Partner',
        name: 'Chubb International Insurance',
        logo: '',
        description: 'Global insurance coverage for fund protection and trade credit insurance.',
        partnership: 'Protection of funds through comprehensive insurance policies'
    }],
    banks: [
        {
            id: 'b-1',
            name: 'Maybank Berhad',
            role: 'Origin Bank & Trustees',
            branch: 'Mid Valley Branch',
            swift: 'MBBEMYKL (MT103)',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Maybank_Logo.svg/2560px-Maybank_Logo.svg.png',
            description: 'Primary banking partner for fund management and payment control through Maybank Trustees.'
        },
        {
            id: 'b-2',
            name: 'Emirates Islamic Bank',
            role: 'Nominated Trustees Bank',
            location: 'Dubai, UAE',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Emirates_Islamic_Logo.png',
            description: 'International banking partner for offshore fund management via INSTRAK Project Management Services Est.'
        }
    ],
    milestone: {
        headline: 'USD 1 Billion',
        subtitle: 'Investment Commitment Signed',
        description: 'INSTRAK Venture Capital Berhad has secured strategic investment commitments to support project financing and high-growth equity investments across the ASEAN region.'
    },
    trustContent: {
        title: 'Governance & Compliance',
        description: 'All fund management and investment activities are conducted under strict regulatory oversight and compliance with Malaysian financial regulations.',
        regulators: [
            { id: 1, title: 'Securities Commission', subtitle: 'Malaysia (SC)' },
            { id: 2, title: 'Central Bank', subtitle: 'Bank Negara Malaysia' },
            { id: 3, title: 'Trade Credit Insurance', subtitle: 'Fund Protection' }
        ]
    },
    customSections: []
};

// ─────────────────────────────────────────────────────────────────────────────
// 5.  NAVIGATION  (from src/components/Navbar.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const navigation = {
    logo: { url: '/logo.png', alt: 'Instrak Venture Capital' },
    items: [
        { id: 'nav-1', label: 'Home', link: '/', isDropdown: false, children: [] },
        {
            id: 'nav-2',
            label: 'About Us',
            link: '/about',
            isDropdown: true,
            children: [
                { id: 'sub-1', label: 'Mission, Vision & Values', link: '/about#mission' },
                { id: 'sub-2', label: 'Board of Directors', link: '/about#board' },
                { id: 'sub-3', label: 'Strategic Partners', link: '/about#partners' }
            ]
        },
        {
            id: 'nav-3',
            label: 'Services',
            link: '/services',
            isDropdown: true,
            children: [
                { id: 'sub-4', label: 'Strategic Financing', link: '/services' },
                { id: 'sub-5', label: 'Institutional Investors', link: '/investors' }
            ]
        },
        { id: 'nav-4', label: 'Career', link: '/join-us', isDropdown: false, children: [] },
        { id: 'nav-5', label: 'News', link: '/latest-news-2', isDropdown: false, children: [] },
        { id: 'nav-6', label: 'Contact Us', link: '/contact', isDropdown: false, isButton: true, children: [] }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 6.  GLOBAL_SETTINGS  (from src/components/Navbar.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const global_settings = {
    siteIdentity: {
        logoUrl: '/logo.png',
        siteName: 'Instrak Venture Capital',
        tagline: ''
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7.  FOOTER  (from src/components/Footer.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const footer = {
    logo: '',
    companyName: 'Instrak Venture Capital Berhad',
    description: 'Disclaimer Testing for disclaimer placement',
    address: 'Level 23, Menara Exchange 106,\nTun Razak Exchange (TRX),\n55188 Kuala Lumpur, Malaysia\n\n1005 & 1006, Ontario Tower,\nBusiness Bay, Dubai,\nUnited Arab Emirates',
    email: 'admin@instrakventurecapital.com',
    quickLinks: [
        { label: 'Home', url: '/' },
        { label: 'About Us', url: '/about' },
        { label: 'Services', url: '/services' },
        { label: 'News', url: '/latest-news-2' },
        { label: 'Contact Us', url: '/contact' }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 8.  NEWS_EVENTS  (from src/pages/LatestNews.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const news_events = {
    hero: {
        title: 'News & Events',
        subtitle: 'Stay updated with the latest insights, announcements, and events from Instrak Venture Capital.',
        buttonLabel: '',
        buttonLink: '',
        styles: {}
    },
    blocks: [
        {
            id: 'block-latest',
            title: 'Latest Updates',
            subtitle: 'Explore our latest news and upcoming events.',
            ctaLabel: '',
            ctaLink: '',
            styles: { bgColor: '#FFFFFF', textColor: '#1A365D' },
            items: []
        }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 9.  SERVICES  (from src/pages/Services.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const services = {
    items: [
        { id: 1, title: 'Business Finance Consulting (Virtual CFO)', summary: 'Financial strategy & forecasting, budgeting & cash flow management, profitability analysis & cost control, investment readiness & capital structuring, financial risk assessment & mitigation, KPI setting & performance monitoring, and board/investor reporting & stakeholder communication.', icon: 'Briefcase', link: '/services/virtual-cfo' },
        { id: 2, title: 'Business Finance Consulting (Virtual CFO)', summary: 'Financial strategy & forecasting, budgeting & cash flow management, profitability analysis & cost control, investment readiness & capital structuring, financial risk assessment & mitigation, KPI setting & performance monitoring, and board/investor reporting & stakeholder communication.', icon: 'Briefcase', link: '/services/virtual-cfo' },
        { id: 3, title: 'Equity Financing (EF)', summary: 'Strategic capital injection through equity investment for high-growth companies seeking expansion and market leadership.', icon: 'TrendingUp', link: '/services/equity-financing' },
        { id: 4, title: 'Real Estate Financing (REF)', summary: 'Funding for high-yield property developments and real estate acquisitions.', icon: 'Building2', link: '/services/real-estate-financing' },
        { id: 5, title: 'Real Estate Investment Trust (REITs)', summary: 'Service details available upon request.', icon: 'Landmark', link: '/services/reits' },
        { id: 6, title: 'Share Financing (SF)', summary: 'Service details available upon request.', icon: 'BarChart3', link: '/services/share-financing' },
        { id: 7, title: 'Merger & Acquisition (M&A)', summary: 'Service details available upon request.', icon: 'Users', link: '/services/merger-acquisition' },
        { id: 8, title: 'Tokenization', summary: 'Service details available upon request.', icon: 'Coins', link: '/services/tokenization' },
        { id: 9, title: 'Asset Insurance (AI)', summary: 'Service details available upon request.', icon: 'Shield', link: '/services/asset-insurance' },
        { id: 10, title: 'Private Placement Life Insurance (PPLI)', summary: 'Service details available upon request.', icon: 'ShieldCheck', link: '/services/ppli' },
        { id: 11, title: 'Global Investment Gateway (GIG)', summary: "An exclusive, subscription-based gateway for qualified companies to gain structured access to global investors and strategic partners through IVC's international network. Not a marketplace, crowdfunding platform, or brokerage.", icon: 'Globe', link: '/services/gig' },
        { id: 12, title: 'Private Wealth Investment (The Luxury Dubai)', summary: 'Service details available upon request.', icon: 'Gem', link: '/services/private-wealth' },
        { id: 13, title: 'Asset Under Management (AUM)', summary: 'Exclusive AUM mandates for corporations, institutional investors, family offices, and ultra-high-net-worth principals—mandate-driven, disciplined, and globally informed, with transparency and governance at the core.', icon: 'PieChart', link: '/services/aum' }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. INDUSTRIES  (from src/pages/Services.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const industries = {
    items: [
        { id: 'ind-1', title: 'Energy & Infrastructure', icon: 'Fuel', image: '' },
        { id: 'ind-2', title: 'Civil & Structural', icon: 'HardHat', image: '' },
        { id: 'ind-3', title: 'Manufacturing', icon: 'Factory', image: '' },
        { id: 'ind-4', title: 'Automotive', icon: 'Car', image: '' },
        { id: 'ind-5', title: 'Healthcare Logistics', icon: 'Stethoscope', image: '' }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. SERVICES_PAGE  (from src/pages/Services.jsx styling/hero)
// ─────────────────────────────────────────────────────────────────────────────
const services_page = {
    heroTitle: 'Strategic Financial Services',
    heroSubtitle: 'Comprehensive financial pathways tailored for institutional growth, industrial expansion, and global capital access.',
    heroBackground: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)',
    heroTextColor: '#FFFFFF',
    heroTextAlign: 'center',
    heroFontFamily: 'var(--font-heading)',
    heroTitleFontSize: '3.5rem',
    heroSubtitleFontSize: '1.25rem',
    heroFontWeight: '700',
    ctaPrimaryText: 'Speak to an Advisor',
    ctaPrimaryLink: '/contact',
    ctaSecondaryText: 'Explore Solutions',
    sectionSolutionsTitle: 'Our Specialized Solutions',
    sectionIndustriesTitle: 'Sector Expertise',
    sectionTitleFontFamily: 'var(--font-heading)',
    sectionTitleFontSize: '2.5rem',
    sectionTitleColor: '#1A365D',
    sectionTitleAlign: 'center',
    sectionTitleFontWeight: '700',
    leadMagnetTitle: 'Unsure which solution fits your needs?',
    leadMagnetDescription: 'Our analysts can assess your current financial position and recommend the optimal funding or restructuring strategy.',
    leadMagnetButtonText: 'Get a Free Assessment',
    leadMagnetButtonLink: '/contact',
    leadMagnetTextAlign: 'center',
    leadMagnetFontFamily: 'var(--font-heading)',
    leadMagnetTitleFontSize: '2rem',
    leadMagnetDescFontSize: '1.1rem',
    leadMagnetTitleColor: '#1A365D',
    leadMagnetDescColor: '#4A5568'
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. SERVICE_PAGES  (combined from all 12 service detail pages)
//     Icon fields use string names (the client remaps to JSX)
// ─────────────────────────────────────────────────────────────────────────────
const service_pages = {
    pages: [
        // ── Virtual CFO (BusinessFinanceConsulting.jsx) ──
        {
            id: 'virtual-cfo',
            title: 'BUSINESS FINANCE CONSULTING',
            subtitle: '',
            introduction: 'Dedicated finance leadership to support funding readiness, reporting discipline, and decision-making—without the overhead of a full-time in-house CFO. We provide strategic financial oversight tailored to your business needs.',
            ourRole: [
                'Financial strategy & forecasting',
                'Budgeting & cash flow management',
                'Profitability analysis & cost control',
                'Investment readiness & capital structuring',
                'Financial risk assessment & mitigation',
                'KPI setting & performance monitoring',
                'Board/investor reporting & stakeholder communication'
            ],
            whoNeeds: [
                'Startups needing financial structure for investor confidence',
                'SME preparing for funding rounds or market expansion',
                'Scale-ups lacking in-house finance leadership',
                'Companies facing cash flow challenges or rapid growth'
            ],
            keyBenefits: [
                'Access to world-class financial leadership',
                'No fixed salary or long-term employment contracts',
                'Real-time insights for better decision-making',
                'Improved investor trust and funding potential',
                'Scalable support as your business grows'
            ],
            approach: [
                { step: '01', title: 'Initial Assessment', desc: 'We evaluate your current financial position, challenges, and goals.' },
                { step: '02', title: 'Tailored Financial Roadmap', desc: 'We create a customized strategy aligned with your business objectives.' },
                { step: '03', title: 'Execution & Monitoring', desc: 'We implement the plan and track progress with regular reporting.' },
                { step: '04', title: 'Continuous Improvement', desc: 'We adapt and refine strategies as your business evolves.' }
            ]
        },
        // ── Equity Financing (EquityFinancing.jsx) ──
        {
            id: 'equity-financing',
            title: 'Equity Financing (EF)',
            subtitle: 'Strategic growth through equity investment and merger assistance.',
            introduction: 'Strategic growth through equity investment and merger assistance. We facilitate strategic capital injection up to USD 100 Million for high-growth companies and provide expert guidance through complex M&A transactions and negotiations.',
            overview: {
                heading: 'Funding Roadmap 2022-2025',
                description: 'Our structured 5-stage equity financing roadmap guides companies from due diligence to IPO exit strategy.'
            },
            services: [
                { icon: 'TrendingUp', title: 'Equity Investment', desc: 'Strategic capital injection up to USD 100 Million for high-growth companies.' },
                { icon: 'Users', title: 'Merger & Acquisition', desc: 'Expert guidance through complex M&A transactions and negotiations.' },
                { icon: 'Search', title: 'Due Diligence', desc: 'Comprehensive financial and operational analysis for informed decisions.' },
                { icon: 'Briefcase', title: 'IPO Preparation', desc: 'Preparation and advisory for Initial Public Offering listing.' }
            ],
            roadmapStages: [
                { stage: '1', title: 'Due Diligence', duration: '3-6 Months', investment: 'Min. USD 110,000', items: ['Due Diligence Work', 'Master Planning', 'Opening of Offshore Account', 'Overall Financial Analysis', 'Restructuring Existing Processes'] },
                { stage: '2', title: 'M&A Environment', duration: '24 Months', investment: 'USD 124,000', items: ['Mergers & Acquisition Environment', 'Review Business Plan', 'Debts Consolidation Account', 'Pitching Readiness to Selected VCs'] },
                { stage: '3', title: 'Funding Readiness', duration: 'Upon Approval', investment: '35% Equity', items: ['Funding Readiness up to USD 100 Million', '10% Service Fee on Approved Amount', '30-40% Equity Holding by IVCB'] },
                { stage: '4', title: 'Performance Monitoring', duration: '2 Years', investment: 'Ongoing', items: ['IVCB will service client within 2 years', 'Progress and update on performance', 'Risk management and monitoring'] },
                { stage: '5', title: 'Exit Strategy', duration: 'Target', investment: 'IPO Ready', items: ['At least 6x revenue from capital generated (USD 600M)', 'Preparation of IPO Listing', 'Exit Strategy upon IPO Listed'] }
            ],
            financingTerms: [
                { label: 'Facility Line', value: 'USD 100 Million' },
                { label: 'Equity Split', value: '60% Investee / 40% IVCB' },
                { label: 'Margin Financing', value: 'Up to 80%' },
                { label: 'Maximum Tenure', value: '5 Years' },
                { label: 'Service Fee', value: '10% on Approval' },
                { label: 'Target Revenue', value: '6x Capital (USD 600M)' }
            ],
            sectors: ['Oil & Gas', 'Property Development', 'Education', 'Logistics', 'Automotive', 'Manufacturing', 'Construction', 'Digital Technology'],
            subscriptionTiers: [
                { name: 'Option 1', price: 'Retainer Fee & Insurance Bond', features: ['USD 1,000,000 non-refundable retainer fee', '5% insurance bond of facility line approved', 'Excludes stamp duty and government taxes'] },
                { name: 'Option 2', price: 'Initial Fees Upon Settlement', features: ['Registration Fee: USD 5,000', 'Processing Fee: USD 15,000', 'Legal Fee: USD 1,500,000', 'Stamp Duty: USD 500,000', 'Insurance Bond: USD 5,000,000', 'Due Diligence & M&A (3.6%): USD 3,600,000'] }
            ]
        },
        // ── Real Estate Financing (RealEstateFinancing.jsx) ──
        {
            id: 'real-estate-financing',
            title: 'REAL ESTATE FINANCING',
            subtitle: 'Funding for high-yield property developments and real estate acquisitions.',
            introduction: 'Funding for high-yield property developments and real estate acquisitions. We provide comprehensive financing solutions for new developments, bridge financing, and acquisition equity.',
            financingTypes: [
                { icon: 'Building2', title: 'Development Loans', desc: 'Capital for new property development projects from land acquisition to completion.' },
                { icon: 'Landmark', title: 'Bridge Financing', desc: 'Short-term funding to bridge gaps between property transactions.' },
                { icon: 'Home', title: 'Acquisition Capital', desc: 'Financing for purchasing existing commercial and residential properties.' },
                { icon: 'Factory', title: 'Industrial Real Estate', desc: 'Specialized funding for warehouses, factories, and logistics facilities.' }
            ],
            propertyTypes: [
                { type: 'Commercial', examples: 'Office buildings, retail spaces, shopping centers' },
                { type: 'Residential', examples: 'Condominiums, apartments, housing developments' },
                { type: 'Mixed-Use', examples: 'Integrated developments, township projects' },
                { type: 'Industrial', examples: 'Warehouses, manufacturing plants, logistics hubs' }
            ],
            loanTerms: [
                { label: 'Loan-to-Value (LTV)', value: 'Up to 70%' },
                { label: 'Interest Rate', value: 'From 6.5% p.a.' },
                { label: 'Loan Tenure', value: '12 - 60 months' },
                { label: 'Minimum Loan', value: 'RM 1 Million' },
                { label: 'Maximum Loan', value: 'RM 100 Million' }
            ]
        },
        // ── REITs (REITs.jsx) ──
        {
            id: 'reits',
            title: 'REAL ESTATE INVESTMENT TRUST (REITs)',
            subtitle: 'Strategic real estate investment opportunities through structured trusts.',
            introduction: 'Strategic real estate investment opportunities through structured trusts. Our REITs advisory provides institutional investors with access to high-yield property portfolios, professionally managed for consistent returns and long-term capital appreciation.',
            overview: {
                heading: 'REITs & Property Investment',
                description: 'Access diversified real estate portfolios through professionally managed investment vehicles.'
            },
            services: [
                { icon: 'Building', title: 'Asset Selection', desc: 'Rigorous analysis and selection of high-performing commercial and residential properties.' },
                { icon: 'Landmark', title: 'Trust Structuring', desc: 'Expert guidance on the legal and financial structuring of Real Estate Investment Trusts.' },
                { icon: 'PieChart', title: 'Portfolio Management', desc: 'Active management of property assets to maximize occupancy and rental yields.' },
                { icon: 'TrendingUp', title: 'Yield Optimization', desc: 'Strategic improvements and financial modeling to enhance distribution to shareholders.' }
            ]
        },
        // ── Share Financing (ShareFinancing.jsx) ──
        {
            id: 'share-financing',
            title: 'SHARE FINANCING (SF)',
            subtitle: 'Liquidity solutions through strategic share-backed financing.',
            introduction: 'Liquidity solutions through strategic share-backed financing. We provide bespoke financing structures that allow stockholders to unlock capital from their equity positions without immediate divestment, supporting both personal and corporate liquidity needs.',
            overview: {
                heading: 'Share-Backed Liquidity',
                description: 'Unlock the value of your equity holdings with flexible financing solutions.'
            },
            services: [
                { icon: 'DollarSign', title: 'Liquidity Access', desc: 'Quick access to capital based on the value of listed or private equity holdings.' },
                { icon: 'TrendingUp', title: 'Margin Optimization', desc: 'Secure financing with competitive loan-to-value ratios and flexible repayment terms.' },
                { icon: 'Shield', title: 'Risk Management', desc: 'Structured solutions to protect against market volatility while maintaining equity exposure.' },
                { icon: 'Briefcase', title: 'Corporate Solutions', desc: 'Financing for corporate stock repossession, ESOP funding, and strategic equity maneuvers.' }
            ]
        },
        // ── Merger & Acquisition (MergerAcquisition.jsx) ──
        {
            id: 'merger-acquisition',
            title: 'MERGER & ACQUISITION (M&A)',
            subtitle: 'Expert guidance through complex M&A transactions, negotiations, and strategic integrations.',
            introduction: 'Expert guidance through complex M&A transactions, negotiations, and strategic integrations. Our dedicated team provides end-to-end support for companies seeking to scale through acquisition or realize value through strategic divestiture.',
            overview: {
                heading: 'Expert M&A Advisory',
                description: 'Strategize and execute complex transactions with our experienced M&A team.'
            },
            services: [
                { icon: 'Target', title: 'Sell-Side Advisory', desc: 'Maximize value and ensure smooth transitions through structured exit strategies.' },
                { icon: 'Search', title: 'Buy-Side Advisory', desc: 'Identify and execute strategic acquisitions to fuel inorganic growth.' },
                { icon: 'Briefcase', title: 'Transaction Support', desc: 'Comprehensive due diligence and negotiation leadership for successful outcomes.' },
                { icon: 'TrendingUp', title: 'Integration Planning', desc: 'Ensure post-merger success with detailed operational and cultural integration.' }
            ]
        },
        // ── Tokenization (Tokenization.jsx) ──
        {
            id: 'tokenization',
            title: 'TOKENIZATION',
            subtitle: 'Digital asset tokenization solutions for modern investment structures.',
            introduction: 'Digital asset tokenization solutions for modern investment structures. Fractionalize and digitize value through our institutional-grade tokenization platform, enabling liquidity and accessibility for traditionally illiquid assets.',
            overview: {
                heading: 'Digital Asset Tokenization',
                description: 'Fractionalize and digitize value through our institutional-grade tokenization platform.'
            },
            services: [
                { icon: 'Cpu', title: 'Asset Digitization', desc: 'Convert physical or traditional assets into secure digital tokens on the blockchain.' },
                { icon: 'TrendingUp', title: 'Fractional Ownership', desc: 'Enable smaller investment increments to increase market participation and liquidity.' },
                { icon: 'Shield', title: 'Compliant Structure', desc: 'Rigorous regulatory adherence and smart contract security for peace of mind.' },
                { icon: 'Globe', title: 'Global Accessibility', desc: 'Connect with a worldwide network of investors through digital marketplaces.' }
            ]
        },
        // ── Asset Insurance (AssetInsurance.jsx) ──
        {
            id: 'asset-insurance',
            title: 'ASSET INSURANCE (AI)',
            subtitle: 'Comprehensive asset protection and insurance solutions for institutional clients.',
            introduction: 'Comprehensive asset protection and insurance solutions for institutional clients. Protect your capital and physical assets with our specialized insurance advisory, ensuring resilience and security in a dynamic global environment.',
            overview: {
                heading: 'Institutional Asset Insurance',
                description: 'Protect your capital and physical assets with our specialized insurance advisory.'
            },
            services: [
                { icon: 'ShieldCheck', title: 'Risk Mitigation', desc: 'Identify and address potential vulnerabilities across your entire asset portfolio.' },
                { icon: 'FileCheck', title: 'Bespoke Coverage', desc: 'Tailored insurance products designed specifically for institutional and corporate needs.' },
                { icon: 'Landmark', title: 'Asset Protection', desc: 'Secure high-value properties, equipment, and financial instruments against unforeseen risks.' },
                { icon: 'Lock', title: 'Strategic Security', desc: 'Integrate insurance into your broader wealth management and business continuity plans.' }
            ]
        },
        // ── PPLI (PPLI.jsx) ──
        {
            id: 'ppli',
            title: 'PRIVATE PLACEMENT LIFE INSURANCE (PPLI)',
            subtitle: 'Sophisticated life insurance solutions for wealth preservation and estate planning.',
            introduction: 'Sophisticated life insurance solutions for wealth preservation and estate planning. Integrate insurance into your global wealth management and tax strategy through our tailored PPLI structures, designed for ultra-high-net-worth individuals and families.',
            overview: {
                heading: 'Private Placement Life Insurance',
                description: 'Integrate insurance into your global wealth management and tax strategy.'
            },
            services: [
                { icon: 'Lock', title: 'Asset Protection', desc: 'Secure your wealth within a robust, legally recognized insurance structure.' },
                { icon: 'ShieldCheck', title: 'Tax Efficiency', desc: 'Optimize your global tax position through strategic life insurance placement.' },
                { icon: 'FileCheck', title: 'Estate Planning', desc: 'Ensure smooth wealth transfer and legacy preservation for future generations.' },
                { icon: 'Globe', title: 'Global Portability', desc: 'Maintain flexibility and compliance across multiple jurisdictions and asset classes.' }
            ]
        },
        // ── Global Investment Gateway (GlobalInvestmentGateway.jsx) ──
        {
            id: 'gig',
            title: 'GLOBAL INVESTMENT GATEWAY (GIG)',
            subtitle: 'Your structured entry point to global capital markets and strategic partners.',
            introduction: "An exclusive, subscription-based gateway for qualified companies to gain structured access to global investors and strategic partners through IVC's international network. GIG provides the tools, visibility, and connections necessary to scale your business on a global stage.",
            overview: {
                heading: 'Global Market Expansion',
                description: 'Bridging the gap between ambitious companies and international capital flows.'
            },
            services: [
                { icon: 'Globe', title: 'International Network', desc: 'Direct access to institutional investors and family offices across key global financial hubs.' },
                { icon: 'Users', title: 'Strategic Partnerships', desc: 'Facilitated introductions to potential joint venture partners and strategic collaborators.' },
                { icon: 'Landmark', title: 'Capital Structuring', desc: 'Advisory on optimizing your business structure for international investment readiness.' },
                { icon: 'Briefcase', title: 'Market Positioning', desc: 'Enhancing your business profile to resonate with global investment standards and expectations.' }
            ]
        },
        // ── Private Wealth Investment (PrivateWealthInvestment.jsx) ──
        {
            id: 'private-wealth',
            title: 'PRIVATE WEALTH INVESTMENT (PWI)',
            subtitle: 'Elite wealth management and bespoke investment solutions.',
            introduction: 'Exclusive wealth management mandates for private principals, family offices, and high-net-worth individuals. Our Private Wealth Investment division focuses on capital preservation, strategic growth, and legacy planning across diversified global asset classes.',
            overview: {
                heading: 'Bespoke Wealth Management',
                description: 'Sophisticated investment strategies tailored to the unique needs of ultra-high-net-worth clients.'
            },
            services: [
                { icon: 'Gem', title: 'Exclusive Access', desc: 'Connectivity to off-market opportunities and elite investment vehicles in Dubai and beyond.' },
                { icon: 'Landmark', title: 'Estate Planning', desc: 'Secure your legacy with comprehensive multi-generational wealth transfer and trust planning.' },
                { icon: 'Shield', title: 'Capital Preservation', desc: 'Rigorous risk management and defensive positioning to protect your core wealth.' },
                { icon: 'TrendingUp', title: 'Growth Strategies', desc: 'Strategic allocation into high-potential global trends and specialized private equity.' }
            ]
        },
        // ── Asset Under Management (AssetUnderManagement.jsx) ──
        {
            id: 'aum',
            title: 'ASSET UNDER MANAGEMENT (AUM)',
            subtitle: '',
            introduction: 'Partner with Instrak Venture Capital Berhad to optimise capital and enhance portfolio performance. We provide exclusive, mandate-driven asset management services tailored for corporations, institutional investors, and family offices, ensuring alignment with strategic priorities and long-term value creation.',
            philosophy: [
                { title: 'Institutional Rigour', desc: 'Decisions guided by robust governance and analytical frameworks.' },
                { title: 'Global Insight', desc: 'Access to diverse markets, alternative investments, and strategic opportunities.' },
                { title: 'Tailored Solutions', desc: 'Portfolios designed to reflect objectives, risk appetite, and time horizon.' },
                { title: 'Alignment of Interests', desc: 'Mandate structures ensure client objectives remain central.' }
            ],
            services: [
                { title: 'Portfolio Management', desc: 'Multi-asset strategies, risk-adjusted returns, diversification across public, private, and alternative assets.' },
                { title: 'Capital Structuring & Deployment', desc: 'Balance sheet optimisation, bespoke financing, strategic allocation.' },
                { title: 'Institutional Advisory', desc: 'M&A guidance, exclusive opportunities, risk & regulatory advisory.' },
                { title: 'Reporting & Transparency', desc: 'Regular performance reports, governance dashboards, full compliance oversight.' }
            ],
            whoWeServe: [
                { title: 'Global Corporations', desc: 'Capital optimisation & strategic deployment.' },
                { title: 'Institutional Investors', desc: 'Pension funds, endowments, sovereign wealth funds.' },
                { title: 'Family Offices & UHNWIs', desc: 'Wealth preservation, growth, bespoke investment solutions.' },
                { title: 'Shareholders & Principals', desc: 'Structured instruments, Stock Loans.' }
            ],
            approach: [
                { title: 'Understanding Objectives', desc: 'Consultation to identify goals, risk tolerance, and strategic priorities.' },
                { title: 'Bespoke Mandates', desc: 'Tailored investment strategies & financing solutions.' },
                { title: 'Execution Excellence', desc: 'Leverage global networks & proprietary frameworks.' },
                { title: 'Ongoing Stewardship', desc: 'Continuous monitoring, governance reporting, proactive adjustments.' }
            ],
            whyChoose: [
                { title: 'Global Reach', desc: 'Access to international markets & opportunities.' },
                { title: 'Institutional Discipline', desc: 'Structured governance & risk management.' },
                { title: 'High-Touch Service', desc: 'Dedicated portfolio teams for every client.' },
                { title: 'Confidentiality & Trust', desc: 'Strict fiduciary standards & privacy.' }
            ],
            disclaimer: 'IVC provides information for general purposes only. This does not constitute an offer, solicitation, or recommendation for investment. Engagements are subject to formal mandate agreements, regulatory approvals, and professional due diligence. Only institutional investors, corporations, shareholders, or high-net-worth individuals are considered for consultation. All discussions and information shared are strictly confidential.'
        }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. INVESTORS  (from src/pages/Investors.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const investors = {
    pageHero: {
        title: 'FOR INVESTORS',
        subtitle: ''
    },
    mainContent: {
        headline: 'The Institutional Advantage',
        description: 'Instrak Venture Capital Berhad offers qualified investors access to a curated portfolio of high-growth industrial assets in the ASEAN region. Our approach is defined by rigorous due diligence and institutional-grade governance.'
    },
    portfolioSection: {
        title: 'Institutional Portfolio',
        items: [
            { id: 'port-1', text: 'Energy & Infrastructure' },
            { id: 'port-2', text: 'Advanced Manufacturing' },
            { id: 'port-3', text: 'Logistics & Distribution' }
        ]
    },
    formSettings: {
        title: 'Investment Inquiry',
        submitButtonText: 'Submit Inquiry',
        interestOptions: ['Investment', 'Loan', 'Partnership', 'Others']
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// 14. CAREER  (from src/pages/JoinUs.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const career = {
    sections: [
        { id: 'hero', type: 'hero', title: 'Join Our Elite Team', subtitle: 'Building a legacy of financial excellence and industrial leadership.' },
        { id: 'jobs', type: 'jobs' },
        {
            id: 'intro',
            type: 'intro',
            title: 'Career at Instrak',
            description: 'We look for professionals who embody our values of integrity, transparency, and strategic foresight.\n\nTo those who are interested, kindly drop your resume by direct email.',
            email: 'vacancy@instrakventurecapital.com'
        }
    ],
    jobs: []
};

// ─────────────────────────────────────────────────────────────────────────────
// 15. CONTACT_PAGE  (from src/pages/Contact.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const contact_page = {
    pageHero: {
        title: 'Contact Us',
        subtitle: 'Inquiries regarding strategic capital, institutional partnerships, and industrial growth.'
    },
    contactInfo: {
        address: {
            title: 'Our Office',
            lines: [
                'Level 27 Penthouse,',
                'Centrepoint North, Mid Valley City,',
                '59200 Kuala Lumpur, Malaysia'
            ]
        },
        phones: {
            title: 'Contact Numbers',
            numbers: ['+603-2022 5208', '+6011-6364 1142']
        },
        email: {
            title: 'Email',
            address: 'admin@instrakventurecapital.com'
        }
    },
    formLabels: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        submitButton: 'Send Message'
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// 16. PROJECT_LISTING  (from src/pages/ProjectListing.jsx)
// ─────────────────────────────────────────────────────────────────────────────
const project_listing = {
    title: 'STRATEGIC PROJECT LISTINGS',
    subtitle: '',
    projects: [
        {
            id: 1,
            title: 'Sustainable Energy Hub Alpha',
            location: 'Kuala Lumpur, Malaysia',
            category: 'Renewable Energy',
            description: 'A cutting-edge renewable energy facility integrating solar-hydrogen production and smart grid management. This project aims to provide sustainable power to the regional industrial corridor.',
            imageUrl: '',
            valuation: 'RM 1.2 Billion',
            status: 'Expansion Phase'
        },
        {
            id: 2,
            title: 'ASEAN Logistics Gateway',
            location: 'Selangor, Malaysia',
            category: 'Infrastructure',
            description: 'A state-of-the-art automated logistics and distribution center designed to optimize cross-border trade and supply chain efficiency in the ASEAN region.',
            imageUrl: '',
            valuation: 'RM 850 Million',
            status: 'Initial Development'
        }
    ]
};

// ═════════════════════════════════════════════════════════════════════════════
// All content entries
// ═════════════════════════════════════════════════════════════════════════════
const ALL_CONTENT = [
    { contentId: 'home', content: home },
    { contentId: 'about', content: about },
    { contentId: 'board', content: board },
    { contentId: 'partners', content: partners },
    { contentId: 'navigation', content: navigation },
    { contentId: 'global_settings', content: global_settings },
    { contentId: 'footer', content: footer },
    { contentId: 'news_events', content: news_events },
    { contentId: 'services', content: services },
    { contentId: 'industries', content: industries },
    { contentId: 'services_page', content: services_page },
    { contentId: 'service_pages', content: service_pages },
    { contentId: 'investors', content: investors },
    { contentId: 'career', content: career },
    { contentId: 'contact_page', content: contact_page },
    { contentId: 'project_listing', content: project_listing },
];

// ═════════════════════════════════════════════════════════════════════════════
// Main
// ═════════════════════════════════════════════════════════════════════════════
async function main() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║        POPULATE site_content  –  Fallback → Database        ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log(`Target:  ${SUPABASE_URL}`);
    console.log(`Mode:    ${CONFIRM ? '🔴  LIVE – will upsert to database' : '🟢  DRY RUN – preview only'}\n`);

    console.log('Content IDs to upsert:\n');
    for (const entry of ALL_CONTENT) {
        const size = JSON.stringify(entry.content).length;
        console.log(`  • ${entry.contentId.padEnd(20)} (${(size / 1024).toFixed(1)} KB)`);
    }
    console.log(`\n  Total: ${ALL_CONTENT.length} rows\n`);

    if (!CONFIRM) {
        console.log('─────────────────────────────────────────────────────────');
        console.log('This is a DRY RUN. No data was written.');
        console.log('To actually insert, run:');
        console.log('  node scripts/populate-db.cjs --confirm');
        console.log('─────────────────────────────────────────────────────────');
        return;
    }

    // ── Upsert each row ──
    let success = 0;
    let failed = 0;

    for (const entry of ALL_CONTENT) {
        const payload = {
            id: entry.contentId,
            content: entry.content
        };

        try {
            const res = await fetch(
                `${SUPABASE_URL}/rest/v1/site_content`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': SERVICE_ROLE_KEY,
                        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates,return=minimal'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {
                const errText = await res.text();
                console.error(`  ❌  ${entry.contentId} – HTTP ${res.status}: ${errText}`);
                failed++;
            } else {
                console.log(`  ✅  ${entry.contentId}`);
                success++;
            }
        } catch (err) {
            console.error(`  ❌  ${entry.contentId} – ${err.message}`);
            failed++;
        }
    }

    console.log(`\n════════════════════════════════════════`);
    console.log(`  Done.  ✅ ${success} succeeded  ❌ ${failed} failed`);
    console.log(`════════════════════════════════════════\n`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
