import React from 'react';
import PageHero from '../components/PageHero';
import { ShieldCheck, Eye, Scale, User, Shield, Handshake, Building2, Globe, Award, CheckCircle2 } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

// --- Icon Map for Dynamic Content ---
const ICON_MAP = { ShieldCheck, Eye, Scale };

const AboutUs = () => {
    // --- Data Fetching ---

    // 1. About Page Content (Master of Layout)
    const defaultAbout = {
        sections: [
            { id: 'hero', type: 'hero', title: 'Mission, Vision & Values', subtitle: 'The foundational pillars of Instrak Venture Capital Berhad.' },
            { id: 'mission', type: 'mission' },
            { id: 'board', type: 'board' },
            { id: 'partners', type: 'partners' },
            { id: 'trust', type: 'trust' }
        ]
    };
    const { content: aboutContent } = usePageContent('about', defaultAbout);

    // 2. Board Content (Source of Truth for Directors)
    const defaultDirectors = [
        { id: 'dir-1', name: 'KAHAR KAMARUDIN, ANS', role: 'GROUP CHIEF EXECUTIVE OFFICER (GCEO)', image: '' },
        { id: 'dir-2', name: 'PROF IR. DR. NORIDAH', role: 'NON-EXECUTIVE DIRECTOR', image: '' },
        { id: 'dir-3', name: "RAFI YA'ACOB", role: 'CHIEF OPERATING OFFICER (COO)', image: '' },
        { id: 'dir-4', name: 'ZALIZA YAHYA, CPA', role: 'CHIEF FINANCIAL OFFICER (CFO)', image: '' },
        { id: 'dir-5', name: 'NORZALIZA ABD GHAFAR', role: 'GENERAL MANAGER', image: '' },
        { id: 'dir-6', name: 'NORLI HIDAYATUL AINI', role: 'GENERAL MANAGER', image: '' },
        { id: 'dir-7', name: 'DR. SUHAILY SHAHIMI', role: 'INTERNAL AUDITOR', image: '' },
    ];
    const { content: boardContent } = usePageContent('board', { directors: defaultDirectors });
    const directors = boardContent.directors || defaultDirectors;

    // 3. Partners Content (Source of Truth for Partners & Trust)
    const defaultPartners = {
        partners: [{
            id: 'p-1', category: 'Insurance Partner', name: 'Chubb International Insurance', logo: '',
            description: 'Global insurance coverage for fund protection and trade credit insurance.',
            partnership: 'Protection of funds through comprehensive insurance policies'
        }],
        banks: [
            {
                id: 'b-1', name: 'Maybank Berhad', role: 'Origin Bank & Trustees', branch: 'Mid Valley Branch', swift: 'MBBEMYKL (MT103)',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Maybank_Logo.svg/2560px-Maybank_Logo.svg.png',
                description: 'Primary banking partner for fund management and payment control through Maybank Trustees.'
            },
            {
                id: 'b-2', name: 'Emirates Islamic Bank', role: 'Nominated Trustees Bank', location: 'Dubai, UAE',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Emirates_Islamic_Logo.png',
                description: 'International banking partner for offshore fund management via INSTRAK Project Management Services Est.'
            }
        ],
        trustContent: {
            title: 'Governance & Compliance',
            description: 'All fund management and investment activities are conducted under strict regulatory oversight and compliance with Malaysian financial regulations.',
            regulators: [
                { id: 1, title: 'Securities Commission', subtitle: 'Malaysia (SC)' },
                { id: 2, title: 'Central Bank', subtitle: 'Bank Negara Malaysia' },
                { id: 3, title: 'Trade Credit Insurance', subtitle: 'Fund Protection' }
            ]
        }
    };
    const { content: partnersContent } = usePageContent('partners', defaultPartners);
    const partners = partnersContent.partners || defaultPartners.partners;
    const banks = partnersContent.banks || defaultPartners.banks;
    const trustContent = partnersContent.trustContent || defaultPartners.trustContent;

    // --- Static Constants ---
    const highlights = [
        { icon: <Shield size={24} />, title: 'USD 1 Billion', desc: 'Committed Capital' },
        { icon: <Handshake size={24} />, title: 'Fund Protection', desc: 'Chubb International' },
        { icon: <Building2 size={24} />, title: 'Trustee Managed', desc: 'Maybank Trustees' },
        { icon: <Globe size={24} />, title: 'Global Reach', desc: 'Dubai / Intl.' },
    ];

    // --- Data Prep: Ensure we have a sections list ---
    let sections;
    if (aboutContent.sections) {
        sections = aboutContent.sections;
    } else {
        // Fallback: Construct sections list from legacy data
        sections = [
            {
                id: 'hero',
                type: 'hero',
                title: aboutContent.heroTitle || 'Mission, Vision & Values',
                subtitle: aboutContent.heroSubtitle || 'The foundational pillars of Instrak Venture Capital Berhad.'
            },
            {
                id: 'mission',
                type: 'mission',
                missionTitle: aboutContent.missionTitle || 'Our Mission',
                missionText: aboutContent.missionText || 'To be the catalyst...',
                visionTitle: aboutContent.visionTitle || 'Our Vision',
                visionText: aboutContent.visionText || 'To set the benchmark...',
                values: aboutContent.values || defaultAbout.sections[1].values
            },
            ...(aboutContent.sectionOrder || ['mission', 'board', 'partners']).filter(id => id !== 'mission').map(id => ({ id, type: id }))
        ];
    }

    // --- Renderers ---

    const renderHero = (section) => {
        const styles = section.styles || {};
        return (
            <div key={section.id} style={{
                backgroundColor: styles.bgColor || 'transparent',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <PageHero
                    title={section.title}
                    subtitle={section.subtitle}
                    style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
                />
            </div>
        );
    };

    const renderMission = (section) => {
        const styles = section.styles || {};
        return (
            <section key={section.id} id="mission" style={{
                padding: '100px 0',
                scrollMarginTop: '60px',
                backgroundColor: styles.bgColor || 'transparent',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    {/* Mission Statement */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1A365D 0%, #0F2445 100%)',
                        borderRadius: '24px',
                        padding: '4rem',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(10, 37, 64, 0.15)',
                        marginBottom: '4rem'
                    }}>
                        {/* Decorative Background Element */}
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, transform: 'scale(1.5)' }}>
                            <Globe size={400} />
                        </div>

                        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
                            <h6 style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '1rem' }}>Our Purpose</h6>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2', color: '#FFFFFF' }}>{section.missionTitle || 'Our Mission'}</h2>
                            <p style={{ fontSize: '1.25rem', lineHeight: '1.8', opacity: 0.9, marginBottom: '2rem' }}>
                                {section.missionText}
                            </p>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', margin: '2rem 0' }}></div>

                            <h3 style={{ fontSize: '1.5rem', color: '#D4AF37', marginBottom: '1rem' }}>{section.visionTitle || 'Our Vision'}</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8 }}>
                                {section.visionText}
                            </p>
                        </div>
                    </div>

                    {/* Core Values Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {(section.values || []).map((v, i) => {
                            const IconComponent = ICON_MAP[v.icon] || ShieldCheck;
                            return (
                                <div key={i} className="glass-card" style={{
                                    padding: '2.5rem',
                                    background: 'white',
                                    borderTop: '4px solid #D4AF37',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'default'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-10px)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: '60px', height: '60px',
                                        background: 'rgba(212, 175, 55, 0.1)',
                                        borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '1.5rem',
                                        color: '#D4AF37'
                                    }}>
                                        <IconComponent size={30} />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1A365D' }}>{v.title}</h3>
                                    <p style={{ color: '#64748B', lineHeight: '1.7' }}>{v.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    };

    const renderBoard = (section) => {
        const styles = section.styles || {};
        return (
            <section key={section.id} id="board" style={{
                padding: '100px 0',
                background: styles.bgColor || '#F8FAFC',
                scrollMarginTop: '60px',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: styles.textAlign || 'left' }}>
                    <div style={{ textAlign: styles.textAlign || 'center', marginBottom: '4rem' }}>
                        <h6 style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Leadership</h6>
                        <h2 className="section-title" style={{ marginTop: '0.5rem', color: styles.textColor || '#1A365D' }}>{section.title || 'Board of Directors'}</h2>
                        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: styles.textColor ? styles.textColor : '#64748B', opacity: styles.textColor ? 0.8 : 1 }}>
                            {section.subtitle || 'Guided by seasoned leaders with a commitment to integrity, compliance, and industrial excellence.'}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        {directors.map((d, i) => (
                            <div
                                key={i}
                                className="glass-card"
                                style={{
                                    background: 'white',
                                    overflow: 'hidden',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'left' // Keep card content left aligned
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                                }}
                            >
                                <div style={{
                                    height: '280px',
                                    background: 'linear-gradient(to bottom, #F1F5F9 0%, #E2E8F0 100%)',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {d.image ? (
                                        <img
                                            src={d.image}
                                            alt={d.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                                        />
                                    ) : (
                                        <div style={{ textAlign: 'center', paddingBottom: '2rem', opacity: 0.4 }}>
                                            <User size={80} color="#1A365D" />
                                        </div>
                                    )}
                                    {/* Gold Accent Line */}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#D4AF37' }}></div>
                                </div>
                                <div style={{ padding: '2rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1A365D', fontWeight: 'bold' }}>{d.name}</h3>
                                    <p style={{ color: '#D4AF37', fontWeight: '600', fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{d.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const renderPartners = (section) => {
        const styles = section.styles || {};
        return (
            <div key={section.id} id="partners" style={{
                scrollMarginTop: '80px',
                backgroundColor: styles.bgColor || 'transparent',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                {/* Background Overlay for the whole section */}
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* 3a. Key Highlights Strip */}
                    <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                        <div className="container">
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {highlights.map((item, i) => (
                                    <div key={i} style={{
                                        flex: 1,
                                        minWidth: '200px',
                                        padding: '2.5rem 2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        borderRight: i !== highlights.length - 1 ? '1px solid #F1F5F9' : 'none',
                                        borderBottom: '1px solid transparent' // Placeholder for mobile wrap
                                    }}>
                                        <div style={{ color: '#D4AF37' }}>{item.icon}</div>
                                        <div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1A365D' }}>{item.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3b. Investment Feature (Deal Tombstone Style) */}
                    <section style={{ padding: '80px 0', background: '#0A2540', color: 'white', position: 'relative' }}>
                        <div className="container">
                            <div style={{
                                maxWidth: '900px',
                                margin: '0 auto',
                                border: '2px solid rgba(212, 175, 55, 0.3)',
                                padding: '4rem',
                                textAlign: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute', top: '-1px', left: '50%', transform: 'translate(-50%, -50%)',
                                    background: '#0A2540', padding: '0 1rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#D4AF37', fontSize: '0.9rem', fontWeight: 'bold'
                                }}>
                                    Investment Milestone
                                </div>

                                <Award size={64} style={{ color: '#D4AF37', margin: '0 auto 2rem' }} />
                                <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: '#FFFFFF', marginBottom: '1rem' }}>USD 1 Billion</h2>
                                <p style={{ fontSize: '1.5rem', color: '#D4AF37', marginBottom: '2rem' }}>Investment Commitment Signed</p>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100px', margin: '0 auto 2rem' }}></div>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
                                    INSTRAK Venture Capital Berhad has secured strategic investment commitments to support project financing and high-growth equity investments across the ASEAN region.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3c. Banking & Insurance Partners - Transparent to show wrapper BG */}
                    <section style={{ padding: '100px 0', background: 'transparent' }}>
                        <div className="container">
                            <div style={{ textAlign: styles.textAlign || 'center', marginBottom: '4rem' }}>
                                <h2 className="section-title" style={{ color: styles.textColor || '#1A365D' }}>{section.title || 'Strategic Banking & Insurance'}</h2>
                                {section.subtitle && <p className="mt-2" style={{ color: styles.textColor ? styles.textColor : '#6b7280', opacity: styles.textColor ? 0.8 : 1 }}>{section.subtitle}</p>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                                {/* Chubb */}
                                {partners.map((partner, i) => (
                                    <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '3rem', position: 'relative', background: 'white' }}>
                                        <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}><ShieldCheck size={24} color="#D4AF37" /></div>
                                        <h3 style={{ fontSize: '1.5rem', color: '#1A365D', fontWeight: 'bold', marginBottom: '0.5rem' }}>{partner.name}</h3>
                                        <span style={{ display: 'inline-block', background: '#F0F9FF', color: '#0369A1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '2rem' }}>
                                            {partner.category}
                                        </span>
                                        <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.6' }}>{partner.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0F172A', fontWeight: '500' }}>
                                            <CheckCircle2 size={18} color="#16A34A" />
                                            <span>{partner.partnership}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Banks */}
                                {banks.map((bank, i) => (
                                    <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '3rem', position: 'relative', background: 'white' }}>
                                        <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}><Building2 size={24} color="#D4AF37" /></div>
                                        <h3 style={{ fontSize: '1.5rem', color: '#1A365D', fontWeight: 'bold', marginBottom: '0.5rem' }}>{bank.name}</h3>
                                        <span style={{ display: 'inline-block', background: '#F0FDF4', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '2rem' }}>
                                            {bank.role}
                                        </span>
                                        <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.6' }}>{bank.description}</p>
                                        <div style={{ display: 'flex', flexDirection: 'col', gap: '0.5rem' }}>
                                            {bank.branch && <div style={{ fontSize: '0.9rem', color: '#64748B' }}>📍 {bank.branch}</div>}
                                            {bank.location && <div style={{ fontSize: '0.9rem', color: '#64748B' }}>📍 {bank.location}</div>}
                                            {bank.swift && <div style={{ fontSize: '0.9rem', color: '#64748B' }}>🌐 SWIFT: {bank.swift}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    };

    const renderTrust = (section) => {
        const styles = section.styles || {};
        return (
            <section key={section.id} style={{
                background: styles.bgColor || '#F1F5F9',
                padding: '60px 0',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                textAlign: styles.textAlign || 'center'
            }}>
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h3 style={{ fontSize: '1.25rem', color: styles.textColor || '#1A365D', marginBottom: '1rem' }}>{section.title || trustContent.title}</h3>
                        <p style={{ color: styles.textColor ? styles.textColor : '#64748B', opacity: styles.textColor ? 0.8 : 1, marginBottom: '2rem', lineHeight: '1.6' }}>{trustContent.description}</p>

                        <div style={{ display: 'flex', justifyContent: styles.textAlign === 'left' ? 'flex-start' : (styles.textAlign === 'right' ? 'flex-end' : 'center'), gap: '1rem', flexWrap: 'wrap' }}>
                            {trustContent.regulators.map((reg, i) => (
                                <span key={i} style={{
                                    padding: '0.5rem 1.5rem',
                                    background: 'white',
                                    borderRadius: '30px',
                                    border: '1px solid #CBD5E1',
                                    color: '#475569',
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                    {reg.title}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const renderCustom = (section) => {
        const styles = section.styles || {};
        return (
            <section key={section.id} style={{
                padding: '80px 20px',
                background: styles.bgColor || '#FFFFFF',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: styles.textAlign || 'center' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: styles.textColor || '#1A365D' }}>{section.title}</h2>
                        {section.subtitle && <p className="text-xl opacity-90 mb-6" style={{ color: styles.textColor || 'inherit' }}>{section.subtitle}</p>}
                        <div style={{ color: styles.textColor || '#4A5568', lineHeight: '1.8', whiteSpace: 'pre-wrap', textAlign: styles.textAlign || 'left' }}>{section.content}</div>
                    </div>
                </div>
            </section>
        );
    };

    // Renderer Map
    const renderers = {
        'hero': renderHero,
        'mission': renderMission,
        'board': renderBoard,
        'partners': renderPartners,
        'trust': renderTrust,
        'custom': renderCustom
    };

    return (
        <div className="page-wrapper bg-gray-50">
            {sections.map(section => {
                const RenderFn = renderers[section.type] || renderCustom;
                return RenderFn(section);
            })}
        </div>
    );
};

export default AboutUs;
