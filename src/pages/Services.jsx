import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Wallet, ShieldCheck, PieChart, ArrowRight, Briefcase, FileText, Building2, Landmark, Globe, Shield, Coins, Gem, Users, BarChart3 } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import UniversalSection from '../components/UniversalSection';

const ICON_MAP = { TrendingUp, Wallet, ShieldCheck, PieChart, Briefcase, FileText, Building2, Landmark, Globe, Shield, Coins, Gem, Users, BarChart3 };

const ServicesPage = () => {
    const defaultServices = [
        { id: 1, title: 'Business Finance Consulting (Virtual CFO)', summary: 'Strategic financial expertise without a full-time CFO. Planning, reporting, and investor relations.', icon: 'Briefcase', link: '/services/virtual-cfo' },
        { id: 3, title: 'Equity Financing (EF)', summary: 'Strategic equity investment for growth-stage and established companies across global markets.', icon: 'TrendingUp', link: '/services/equity-financing' },
        { id: 4, title: 'Real Estate Financing (REF)', summary: 'Global property financing for developers, asset owners, and institutional investors.', icon: 'Building2', link: '/services/real-estate-financing' },
        { id: 5, title: 'Real Estate Investment Trust (REITs)', summary: 'Institutional-grade REITs for diversified exposure to income-generating real estate.', icon: 'Landmark', link: '/services/reits' },
        { id: 6, title: 'Share Financing (SF)', summary: 'Unlock liquidity using listed shares as collateral. Non-dilutive financing for companies and shareholders.', icon: 'BarChart3', link: '/services/share-financing' },
        { id: 7, title: 'Merger & Acquisition (M&A)', summary: 'Strategic advisory for mergers, acquisitions, and corporate restructuring.', icon: 'Users', link: '/services/merger-acquisition' },
        { id: 8, title: 'Tokenization', summary: 'Tokenize real-world assets for fractional ownership and global investor access.', icon: 'Coins', link: '/services/tokenization' },
        { id: 9, title: 'Asset Insurance (AI)', summary: 'Structured protection for high-value assets, investment portfolios, and strategic holdings.', icon: 'Shield', link: '/services/asset-insurance' },
        { id: 10, title: 'Private Placement Life Insurance (PPLI)', summary: 'Wealth preservation and estate planning through life insurance and tax-efficient structures.', icon: 'ShieldCheck', link: '/services/ppli' },
        { id: 11, title: 'Global Investment Gateway (GIG)', summary: 'Curated access to global investors and strategic partners for qualified companies.', icon: 'Globe', link: '/services/gig' },
        { id: 12, title: 'Private Wealth Investment (The Luxury Dubai)', summary: 'Exclusive investment and lifestyle platform for ultra-high-net-worth individuals.', icon: 'Gem', link: '/services/private-wealth' },
        { id: 13, title: 'Asset Under Management (AUM)', summary: 'Discretionary and advisory asset management for institutions, family offices, and high-net-worth clients.', icon: 'PieChart', link: '/services/aum' }
    ];

    const { content: servicesContent } = usePageContent('services', { items: defaultServices });
    const services = servicesContent.items || defaultServices;

    const defaultPageContent = {
        heroTitle: 'Strategic Financial Services',
        heroSubtitle: 'Comprehensive financial pathways tailored for institutional growth, industrial expansion, and global capital access.',
        heroBackground: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)',
        heroTextColor: '#FFFFFF',
        heroTextAlign: 'center',
        heroSubtitleAlign: 'center',
        heroFontFamily: 'var(--font-heading)',
        heroTitleFontSize: '3.5rem',
        heroSubtitleFontSize: '1.25rem',
        heroFontWeight: '700',
        ctaPrimaryText: 'Speak to an Advisor',
        ctaPrimaryLink: '/contact',
        ctaSecondaryText: 'Explore Solutions',
        sectionSolutionsTitle: 'Our Specialized Solutions',
        sectionTitleFontFamily: 'var(--font-heading)',
        sectionTitleFontSize: '2.5rem',
        sectionTitleColor: '#1A365D',
        sectionTitleAlign: 'center',
        sectionTitleFontWeight: '700',
        solutionsCardStyle: 'glass',
        heroShowPrimaryCta: true,
        heroShowSecondaryCta: true,
        ctaSecondaryLink: '#services-list',
        tileTitleFontFamily: 'var(--font-heading)',
        tileTitleFontSize: '1.4rem',
        tileTitleColor: '#1A365D',
        tileDescFontSize: '0.95rem',
        tileDescColor: '#4A5568',
        tileButtonShow: true,
        tileButtonText: 'Learn More',
        tileButtonLink: '',
        tileButtonColor: '#B8860B',
        tileButtonFontSize: '0.95rem',
        tileIconColor: '#1A365D',
        tileCardBg: '#FFFFFF',
        leadMagnetTitle: 'Unsure which solution fits your needs?',
        leadMagnetDescription: 'Our analysts can assess your current financial position and recommend the optimal funding or restructuring strategy.',
        leadMagnetButtonText: 'Get a Free Assessment',
        leadMagnetButtonLink: '/contact',
        leadMagnetTextAlign: 'center',
        leadMagnetFontFamily: 'var(--font-heading)',
        leadMagnetTitleFontSize: '2rem',
        leadMagnetDescFontSize: '1.1rem',
        leadMagnetTitleColor: '#1A365D',
        leadMagnetDescColor: '#4A5568',
        pageContentOrder: ['solutions', 'leadMagnet'],
        customSections: []
    };
    const { content: pageContent } = usePageContent('services_page', defaultPageContent);
    const p = { ...defaultPageContent, ...pageContent };
    const isGlass = (p.solutionsCardStyle || 'glass') !== 'solid';
    const PAGE_SECTION_IDS = ['solutions', 'leadMagnet'];
    const customIds = (p.customSections || []).map(s => s.id);
    const orderedIds = Array.isArray(p.pageContentOrder) && p.pageContentOrder.length
        ? p.pageContentOrder.filter(id => PAGE_SECTION_IDS.includes(id) || customIds.includes(id))
        : [...PAGE_SECTION_IDS];

    return (
        <div className="page-wrapper">
            {/* Enhanced Hero with CTA (from services_page content) */}
            <div style={{
                background: p.heroBackground || 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)',
                color: p.heroTextColor || '#FFFFFF',
                padding: '120px 20px 80px',
                textAlign: p.heroTextAlign || 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{ 
                        fontSize: p.heroTitleFontSize || '3.5rem', 
                        fontWeight: p.heroFontWeight || '700', 
                        marginBottom: '1.5rem', 
                        fontFamily: p.heroFontFamily || 'var(--font-heading)',
                        letterSpacing: '-1px',
                        color: p.heroTextColor || '#FFFFFF',
                        textAlign: p.heroTextAlign || 'center'
                    }}>
                        {p.heroTitle}
                    </h1>
                    <p style={{ 
                        fontSize: p.heroSubtitleFontSize || '1.25rem', 
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        margin: (p.heroSubtitleAlign || p.heroTextAlign || 'center') === 'center' ? '0 0 2.5rem 0' : ((p.heroSubtitleAlign || p.heroTextAlign) === 'right' ? '0 0 2.5rem 0' : '0 0 2.5rem 0'), 
                        color: p.heroTextColor ? `${p.heroTextColor}dd` : 'rgba(255,255,255,0.85)', 
                        lineHeight: '1.6',
                        fontFamily: p.heroFontFamily || 'var(--font-heading)',
                        textAlign: p.heroSubtitleAlign || p.heroTextAlign || 'center',
                        whiteSpace: 'pre-line'
                    }}>
                        {p.heroSubtitle}
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        justifyContent: p.heroTextAlign === 'center' ? 'center' : (p.heroTextAlign === 'right' ? 'flex-end' : 'flex-start'), 
                        flexWrap: 'wrap' 
                    }}>
                        {p.heroShowPrimaryCta !== false && (
                            <Link to={p.ctaPrimaryLink || '/contact'} className="btn-solid" style={{ 
                                background: '#B8860B', 
                                color: '#FFFFFF', 
                                padding: '1rem 2rem', 
                                fontSize: '1.1rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                {p.ctaPrimaryText} <ArrowRight size={18} />
                            </Link>
                        )}
                        {p.heroShowSecondaryCta !== false && (
                            <a href={p.ctaSecondaryLink || '#services-list'} className="btn-outline" style={{ 
                                borderColor: 'rgba(255,255,255,0.3)', 
                                color: p.heroTextColor || '#FFFFFF', 
                                padding: '1rem 2rem', 
                                fontSize: '1.1rem' 
                            }}>
                                {p.ctaSecondaryText}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div id="services-list" className="container" style={{ padding: '80px 20px' }}>
                {orderedIds.map((sectionId) => {
                    if (sectionId === 'solutions') {
                        return (
                            <React.Fragment key="solutions">
                                <h2 style={{ fontSize: p.sectionTitleFontSize || '2.5rem', marginBottom: '3rem', textAlign: p.sectionTitleAlign || 'center', fontFamily: p.sectionTitleFontFamily || 'var(--font-heading)', color: p.sectionTitleColor || '#1A365D', fontWeight: p.sectionTitleFontWeight || '700' }}>{p.sectionSolutionsTitle}</h2>
                                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '100px' }}>
                                    {services.map((s, i) => {
                        const IconComponent = ICON_MAP[s.icon] || Briefcase;
                        const link = s.link || p.tileButtonLink || `/services/${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                        const buttonText = s.linkText || p.tileButtonText || 'Learn More';
                        const showTileButton = p.tileButtonShow !== false;
                        return (
                            <Link 
                                to={link}
                                key={i}
                                className={isGlass ? 'glass-card service-card-hover' : 'service-card-hover'}
                                style={{ 
                                    border: '1px solid rgba(26, 54, 93, 0.1)',
                                    borderRadius: '16px',
                                    padding: '2.5rem',
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    background: isGlass ? (() => { const c = (p.tileCardBg || '#FFFFFF').replace(/^#/, ''); if (c.length === 6) { const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16); return `rgba(${r},${g},${b},0.6)`; } return 'rgba(255,255,255,0.6)'; })() : (p.tileCardBg || 'linear-gradient(145deg, #FFFFFF, #F8FAFC)'),
                                    backdropFilter: isGlass ? 'blur(12px)' : undefined,
                                    WebkitBackdropFilter: isGlass ? 'blur(12px)' : undefined,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.borderColor = p.tileButtonColor || '#B8860B';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(26, 54, 93, 0.1)';
                                }}
                            >
                                <div style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    background: 'rgba(26, 54, 93, 0.05)', 
                                    borderRadius: '12px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    marginBottom: '1.5rem' 
                                }}>
                                    <IconComponent size={32} style={{ color: p.tileIconColor || '#1A365D' }} />
                                </div>
                                
                                <h3 style={{ marginBottom: '1rem', color: p.tileTitleColor || '#1A365D', fontSize: p.tileTitleFontSize || '1.4rem', fontFamily: p.tileTitleFontFamily || 'var(--font-heading)' }}>{s.title}</h3>
                                <p style={{ color: p.tileDescColor || '#4A5568', lineHeight: '1.7', flex: 1, marginBottom: '1.5rem', fontSize: p.tileDescFontSize || '0.95rem' }}>{s.summary}</p>
                                
                                {showTileButton && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: p.tileButtonColor || '#B8860B', fontWeight: '600', fontSize: p.tileButtonFontSize || '0.95rem' }}>
                                        {buttonText} <ArrowRight size={16} />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                                </div>
                            </React.Fragment>
                        );
                    }
                    if (sectionId === 'leadMagnet') {
                        return (
                            <React.Fragment key="leadMagnet">
                                <div style={{ 
                    background: 'linear-gradient(135deg, #F8FAFC, #EDF2F7)', 
                    borderRadius: '20px', 
                    padding: '4rem 2rem', 
                    textAlign: p.leadMagnetTextAlign || 'center',
                    marginBottom: '100px',
                    border: '1px solid rgba(26, 54, 93, 0.05)'
                }}>
                    <h3 style={{ 
                        fontSize: p.leadMagnetTitleFontSize || '2rem', 
                        color: p.leadMagnetTitleColor || '#1A365D', 
                        marginBottom: '1rem',
                        fontFamily: p.leadMagnetFontFamily || 'var(--font-heading)',
                        textAlign: p.leadMagnetTextAlign || 'center'
                    }}>{p.leadMagnetTitle}</h3>
                    <p style={{ 
                        maxWidth: '600px', 
                        margin: p.leadMagnetTextAlign === 'center' ? '0 auto 2rem' : (p.leadMagnetTextAlign === 'right' ? '0 0 2rem auto' : '0 auto 2rem 0'), 
                        color: p.leadMagnetDescColor || '#4A5568', 
                        fontSize: p.leadMagnetDescFontSize || '1.1rem',
                        fontFamily: p.leadMagnetFontFamily || 'var(--font-heading)',
                        textAlign: p.leadMagnetTextAlign || 'center'
                    }}>
                        {p.leadMagnetDescription}
                    </p>
                    <Link to={p.leadMagnetButtonLink || '/contact'} className="btn-solid" style={{ background: '#1A365D', color: '#FFFFFF', padding: '1rem 2.5rem' }}>
                        {p.leadMagnetButtonText}
                    </Link>
                </div>
                            </React.Fragment>
                        );
                    }
                    const customSection = (p.customSections || []).find(s => s.id === sectionId);
                    if (customSection) {
                        return (
                            <div key={sectionId} className="container" style={{ paddingBottom: '3rem' }}>
                                <UniversalSection section={customSection} containerClass="container" />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default ServicesPage;
