import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { TrendingUp, Wallet, ShieldCheck, PieChart, ArrowRight, Briefcase, FileText, Building2, Landmark, Globe, Shield, Coins, Gem, Users, BarChart3, Factory, Fuel, HardHat, Car, Stethoscope } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

const ICON_MAP = { TrendingUp, Wallet, ShieldCheck, PieChart, Briefcase, FileText, Building2, Landmark, Globe, Shield, Coins, Gem, Users, BarChart3 };

const INDUSTRY_ICONS = { Fuel, HardHat, Factory, Car, Stethoscope };

const ServicesPage = () => {
    const defaultServices = [
        { id: 1, title: 'Business Finance Consulting (Virtual CFO)', summary: 'Financial strategy & forecasting, budgeting & cash flow management, profitability analysis & cost control, investment readiness & capital structuring, financial risk assessment & mitigation, KPI setting & performance monitoring, and board/investor reporting & stakeholder communication.', icon: 'Briefcase', link: '/services/virtual-cfo' },
        { id: 2, title: 'Contract Financing (CF)', summary: 'Liquidity solutions for businesses with secured government or corporate contracts. Specialized in project financing worth RM 20 Billion for eligible awarders including government agencies, GLCs, and MNCs.', icon: 'FileText', link: '/services/contract-financing' },
        { id: 3, title: 'Equity Financing (EF)', summary: 'Strategic capital injection through equity investment for high-growth companies seeking expansion and market leadership.', icon: 'TrendingUp', link: '/services/equity-financing' },
        { id: 4, title: 'Real Estate Financing (REF)', summary: 'Funding for high-yield property developments and real estate acquisitions.', icon: 'Building2', link: '/services/real-estate-financing' },
        { id: 5, title: 'Real Estate Investment Trust (REITs)', summary: 'Service details available upon request.', icon: 'Landmark', link: '/services/reits' },
        { id: 6, title: 'Share Financing (SF)', summary: 'Service details available upon request.', icon: 'BarChart3', link: '/services/share-financing' },
        { id: 7, title: 'Merger & Acquisition (M&A)', summary: 'Service details available upon request.', icon: 'Users', link: '/services/merger-acquisition' },
        { id: 8, title: 'Tokenization', summary: 'Service details available upon request.', icon: 'Coins', link: '/services/tokenization' },
        { id: 9, title: 'Asset Insurance (AI)', summary: 'Service details available upon request.', icon: 'Shield', link: '/services/asset-insurance' },
        { id: 10, title: 'Private Placement Life Insurance (PPLI)', summary: 'Service details available upon request.', icon: 'ShieldCheck', link: '/services/ppli' },
        { id: 11, title: 'Global Investment Gateway (GIG)', summary: 'An exclusive, subscription-based gateway for qualified companies to gain structured access to global investors and strategic partners through IVC\'s international network. Not a marketplace, crowdfunding platform, or brokerage.', icon: 'Globe', link: '/services/gig' },
        { id: 12, title: 'Private Wealth Investment (The Luxury Dubai)', summary: 'Service details available upon request.', icon: 'Gem', link: '/services/private-wealth' },
        { id: 13, title: 'Asset Under Management (AUM)', summary: 'Exclusive AUM mandates for corporations, institutional investors, family offices, and ultra-high-net-worth principals—mandate-driven, disciplined, and globally informed, with transparency and governance at the core.', icon: 'PieChart', link: '/services/aum' }
    ];

    const defaultIndustries = [
        { id: 'ind-1', title: 'Energy & Infrastructure', icon: 'Fuel', image: '' },
        { id: 'ind-2', title: 'Civil & Structural', icon: 'HardHat', image: '' },
        { id: 'ind-3', title: 'Manufacturing', icon: 'Factory', image: '' },
        { id: 'ind-4', title: 'Automotive', icon: 'Car', image: '' },
        { id: 'ind-5', title: 'Healthcare Logistics', icon: 'Stethoscope', image: '' }
    ];

    const { content: servicesContent } = usePageContent('services', { items: defaultServices });
    const services = servicesContent.items || defaultServices;

    const { content: industriesContent } = usePageContent('industries', { items: defaultIndustries });
    const industries = industriesContent.items || defaultIndustries;

    return (
        <div className="page-wrapper">
            <PageHero
                title="Strategic Services"
                subtitle="Comprehensive financial pathways tailored for institutional growth and industrial expansion."
            />

            <div className="container" style={{ padding: '80px 20px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>Our Specialized Services</h2>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '100px' }}>
                    {services.map((s, i) => {
                        const IconComponent = ICON_MAP[s.icon] || Briefcase;
                        const link = s.link || `/services/${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                        const buttonText = s.linkText || 'Learn More';
                        return (
                            <div
                                key={i}
                                className="glass-card"
                                style={{ borderLeft: '4px solid var(--accent-primary)', display: 'flex', flexDirection: 'column' }}
                            >
                                <IconComponent size={32} style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }} />
                                <h3 style={{ marginBottom: '1rem' }}>{s.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', flex: 1 }}>{s.summary}</p>
                                <Link to={link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', color: '#B8860B', fontWeight: '600', fontSize: '0.9rem' }}>
                                    {buttonText} <ArrowRight size={16} />
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>Sector Expertise</h2>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                    {industries.map((ind, i) => {
                        const IndustryIcon = INDUSTRY_ICONS[ind.icon] || Factory;
                        return (
                            <div
                                key={i}
                                style={{
                                    position: 'relative',
                                    height: '200px',
                                    overflow: 'hidden',
                                    borderRadius: '12px',
                                    background: ind.image ? 'none' : 'linear-gradient(135deg, #1A365D 0%, #2D4A6F 100%)',
                                }}
                            >
                                {ind.image ? (
                                    <img src={ind.image} alt={ind.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <IndustryIcon size={48} color="rgba(255,255,255,0.3)" />
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '0',
                                    width: '100%',
                                    padding: '1.5rem',
                                    background: ind.image ? 'linear-gradient(transparent, rgba(0,0,0,0.8))' : 'linear-gradient(transparent, rgba(0,0,0,0.3))'
                                }}>
                                    <h4 style={{ color: 'white', fontSize: '1.1rem' }}>{ind.title}</h4>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
