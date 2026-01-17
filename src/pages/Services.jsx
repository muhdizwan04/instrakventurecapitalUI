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
            {/* Enhanced Hero with CTA */}
            <div style={{
                background: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)',
                color: '#FFFFFF',
                padding: '120px 20px 80px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '700', 
                        marginBottom: '1.5rem', 
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '-1px',
                        color: '#FFFFFF'
                    }}>
                        Strategic Financial Services
                    </h1>
                    <p style={{ 
                        fontSize: '1.25rem', 
                        maxWidth: '700px', 
                        margin: '0 auto 2.5rem', 
                        color: 'rgba(255,255,255,0.85)', 
                        lineHeight: '1.6' 
                    }}>
                        Comprehensive financial pathways tailored for institutional growth, industrial expansion, and global capital access.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/contact" className="btn-solid" style={{ 
                            background: '#B8860B', 
                            color: '#FFFFFF', 
                            padding: '1rem 2rem', 
                            fontSize: '1.1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            Speak to an Advisor <ArrowRight size={18} />
                        </Link>
                        <a href="#services-list" className="btn-outline" style={{ 
                            borderColor: 'rgba(255,255,255,0.3)', 
                            color: '#FFFFFF', 
                            padding: '1rem 2rem', 
                            fontSize: '1.1rem' 
                        }}>
                            Explore Solutions
                        </a>
                    </div>
                </div>
            </div>

            <div id="services-list" className="container" style={{ padding: '80px 20px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontFamily: 'var(--font-heading)', color: '#1A365D' }}>Our Specialized Solutions</h2>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '100px' }}>
                    {services.map((s, i) => {
                        const IconComponent = ICON_MAP[s.icon] || Briefcase;
                        const link = s.link || `/services/${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                        const buttonText = s.linkText || 'Learn More';
                        return (
                            <Link 
                                to={link}
                                key={i}
                                className="glass-card service-card-hover"
                                style={{ 
                                    border: '1px solid rgba(26, 54, 93, 0.1)',
                                    borderRadius: '16px',
                                    padding: '2.5rem',
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    background: 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.borderColor = '#B8860B';
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
                                    <IconComponent size={32} style={{ color: '#1A365D' }} />
                                </div>
                                
                                <h3 style={{ marginBottom: '1rem', color: '#1A365D', fontSize: '1.4rem' }}>{s.title}</h3>
                                <p style={{ color: '#4A5568', lineHeight: '1.7', flex: 1, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{s.summary}</p>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B8860B', fontWeight: '600', fontSize: '0.95rem' }}>
                                    {buttonText} <ArrowRight size={16} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Lead Magnet / Interstitial */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #F8FAFC, #EDF2F7)', 
                    borderRadius: '20px', 
                    padding: '4rem 2rem', 
                    textAlign: 'center',
                    marginBottom: '100px',
                    border: '1px solid rgba(26, 54, 93, 0.05)'
                }}>
                    <h3 style={{ fontSize: '2rem', color: '#1A365D', marginBottom: '1rem' }}>Unsure which solution fits your needs?</h3>
                    <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: '#4A5568', fontSize: '1.1rem' }}>
                        Our analysts can assess your current financial position and recommend the optimal funding or restructuring strategy.
                    </p>
                    <Link to="/contact" className="btn-solid" style={{ background: '#1A365D', color: '#FFFFFF', padding: '1rem 2.5rem' }}>
                        Get a Free Assessment
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontFamily: 'var(--font-heading)', color: '#1A365D' }}>Sector Expertise</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
                    {industries.map((ind, i) => {
                        const IndustryIcon = INDUSTRY_ICONS[ind.icon] || Factory;
                        return (
                            <div
                                key={i}
                                style={{
                                    position: 'relative',
                                    width: '260px',
                                    height: '320px',
                                    borderRadius: '16px',
                                    background: ind.image ? 'none' : 'linear-gradient(135deg, #0F2942 0%, #1A365D 100%)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    transition: 'all 0.4s ease',
                                    cursor: 'default',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(26, 54, 93, 0.2)';
                                    e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1.1) rotate(5deg)';
                                    e.currentTarget.querySelector('.card-overlay').style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                                    e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1) rotate(0deg)';
                                    e.currentTarget.querySelector('.card-overlay').style.opacity = '0';
                                }}
                            >
                                {/* Background Image or Gradient Pattern */}
                                {ind.image ? (
                                    <img src={ind.image} alt={ind.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}>
                                        {/* Abstract geometric circle */}
                                        <div style={{
                                            position: 'absolute',
                                            width: '200px',
                                            height: '200px',
                                            borderRadius: '50%',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            top: '10%',
                                            left: '50%',
                                            transform: 'translateX(-50%)'
                                        }}></div>
                                        
                                        <div className="icon-container" style={{ 
                                            padding: '1.5rem', 
                                            background: 'rgba(255,255,255,0.1)', 
                                            borderRadius: '50%',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                        }}>
                                            <IndustryIcon size={48} color="#B8860B" />
                                        </div>
                                    </div>
                                )}

                                {/* Hover Overlay (Gold Gradient) */}
                                <div className="card-overlay" style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(to top, rgba(184, 134, 11, 0.9), rgba(26, 54, 93, 0.4))',
                                    opacity: 0,
                                    transition: 'opacity 0.4s ease',
                                    zIndex: 1
                                }}></div>

                                {/* Content */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '0',
                                    width: '100%',
                                    padding: '2rem 1.5rem',
                                    background: 'linear-gradient(to top, rgba(15, 41, 66, 0.95), transparent)',
                                    zIndex: 2,
                                    textAlign: 'center'
                                }}>
                                    <h4 style={{ 
                                        color: '#FFFFFF', 
                                        fontSize: '1.25rem', 
                                        fontWeight: '600', 
                                        letterSpacing: '0.5px',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {ind.title}
                                    </h4>
                                    <div style={{ height: '2px', width: '40px', background: '#B8860B', margin: '0 auto' }}></div>
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
