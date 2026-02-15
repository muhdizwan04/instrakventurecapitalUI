import React from 'react';
import PageHero from '../components/PageHero';
import { ShieldCheck, Eye, Scale, User, Shield, Handshake, Building2, Globe, Award, CheckCircle2 } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { motion } from 'framer-motion';
import UniversalSection from '../components/UniversalSection';

// --- Icon Map for Dynamic Content ---
const ICON_MAP = { ShieldCheck, Eye, Scale };

const AboutUs = () => {
    // --- Data Fetching ---

    // 1. About Page Content (Master of Layout)
    const defaultAbout = {
        sections: [
            { id: 'hero', type: 'hero', title: 'Mission, Vision & Values', subtitle: 'The foundational pillars of Instrak Venture Capital Berhad.' },
            { id: 'mission', type: 'mission' },
            {
                id: 'philosophy',
                type: 'custom',
                title: 'Our Strategic Philosophy',
                subtitle: 'The principles that guide our investment and advisory mandates.',
                items: [
                    { id: 'phil-1', title: 'Institutional Rigour', description: 'Decisions guided by robust governance and analytical frameworks.', icon: 'Shield' },
                    { id: 'phil-2', title: 'Global Insight', description: 'Access to diverse markets, alternative investments, and strategic opportunities.', icon: 'Globe' },
                    { id: 'phil-3', title: 'Tailored Solutions', description: 'Portfolios designed to reflect objectives, risk appetite, and time horizon.', icon: 'Target' },
                    { id: 'phil-4', title: 'Alignment of Interests', description: 'Mandate structures ensure client objectives remain central.', icon: 'Users' }
                ],
                styles: { layoutType: 'mindmap', textAlign: 'center', textColor: '#1A365D', bgColor: '#F8FAFC' }
            },
            { id: 'board', type: 'board', title: 'Board of Directors', subtitle: 'Guided by seasoned leaders with a commitment to integrity, compliance, and industrial excellence.' },
            {
                id: 'operating-model',
                type: 'custom',
                title: 'Our Operating Model',
                subtitle: 'IVC functions through a mandate-based engagement structure.',
                items: [
                    { id: 'op-1', title: 'Evaluated internally' },
                    { id: 'op-2', title: 'Structurally designed' },
                    { id: 'op-3', title: 'Risk-assessed' },
                    { id: 'op-4', title: 'Legally documented' },
                    { id: 'op-5', title: 'Monitored through institutional reporting protocols' }
                ],
                styles: { layoutType: 'boxed-group', textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF', groupTitle: 'OPERATIONAL PROTOCOLS' }
            },
            {
                id: 'capital-corridor',
                type: 'custom',
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
            { id: 'partners', type: 'partners' },
            { id: 'milestone', type: 'milestone' },
            {
                id: 'closing',
                type: 'custom',
                title: 'Committed to Strategic Excellence',
                subtitle: 'Instrak Venture Capital Berhad remains dedicated to bridging the gap between visionary potential and strategic capital.',
                content: 'Our commitment to excellence, integrity, and sustainable growth drives every partnership we forge. We invite you to join us in shaping the future of global industry.',
                styles: { layoutType: 'standard', textAlign: 'center', textColor: '#1A365D', bgColor: '#FFFFFF' }
            }
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

    // 3. Partners Content (Source of Truth for Partners & Milestone)
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
        milestone: {
            headline: 'USD 1 Billion',
            subtitle: 'Investment Commitment Signed',
            description: 'INSTRAK Venture Capital Berhad has secured strategic investment commitments to support project financing and high-growth equity investments across the ASEAN region.'
        }
    };
    const { content: partnersContent } = usePageContent('partners', defaultPartners);
    const partners = partnersContent.partners || defaultPartners.partners;
    const banks = partnersContent.banks || defaultPartners.banks;
    const milestone = partnersContent.milestone || defaultPartners.milestone;

    // --- Static Constants ---


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

    // --- Animation Variants ---
    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

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
            <motion.section
                key={section.id}
                id="mission"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                style={{
                    padding: '100px 0',
                    scrollMarginTop: '60px',
                    backgroundColor: styles.bgColor || 'transparent',
                    backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                    backgroundSize: styles.backgroundSize || 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}
            >
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: styles.textAlign || 'left' }}>
                    {/* Mission Statement */}
                    <div className="luxury-glass luxury-border-gold overflow-hidden" style={{
                        borderRadius: '24px',
                        padding: '4rem',
                        color: styles.textColor || '#1A365D',
                        position: 'relative',
                        boxShadow: 'var(--shadow-lg)',
                        marginBottom: '4rem'
                    }}>
                        {/* Decorative Background Element */}
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.03, transform: 'scale(1.5)', pointerEvents: 'none' }}>
                            <Globe size={400} color="var(--accent-primary)" />
                        </div>

                        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
                            <h6 style={{ color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Our institutional Mandate</h6>
                            <h2 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: '1.1', color: 'var(--accent-primary)', fontWeight: '900' }}>{section.missionTitle || 'Our Mission'}</h2>
                            <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '3rem', fontWeight: '500' }}>
                                {section.missionText}
                            </p>

                            <div style={{ height: '2px', background: 'var(--gradient-gold)', width: '80px', margin: '3rem 0' }}></div>

                            <h3 style={{ fontSize: '1.75rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontWeight: '700' }}>{section.visionTitle || 'Our Vision'}</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', color: 'var(--text-secondary)', opacity: 0.9 }}>
                                {section.visionText}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>
        );
    };

    const renderBoard = (section) => {
        const styles = section.styles || {};
        return (
            <motion.section
                key={section.id}
                id="board"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                style={{
                    padding: '100px 0',
                    background: styles.bgColor || '#F8FAFC',
                    scrollMarginTop: '60px',
                    backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                    backgroundSize: styles.backgroundSize || 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}
            >
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: styles.textAlign || 'center' }}>
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
                                className="luxury-glass luxury-border-gold group"
                                style={{
                                    overflow: 'hidden',
                                    borderRadius: '24px',
                                    transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{
                                    height: '320px',
                                    background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {d.image ? (
                                        <img
                                            src={d.image}
                                            alt={d.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', transition: 'transform 0.8s ease' }}
                                            className="group-hover:scale-110"
                                        />
                                    ) : (
                                        <div style={{ textAlign: 'center', paddingBottom: '3rem', opacity: 0.2 }}>
                                            <User size={100} color="var(--accent-primary)" />
                                        </div>
                                    )}
                                    {/* Gold Accent Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div style={{ padding: '2rem', position: 'relative' }}>
                                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontWeight: '800', letterSpacing: '-0.01em' }}>{d.name}</h3>
                                    <p style={{ color: 'var(--accent-secondary)', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{d.role}</p>
                                    <div style={{ marginTop: '1.5rem', width: '40px', height: '2px', background: 'var(--gradient-gold)', transition: 'width 0.4s ease' }} className="group-hover:width-[100px]"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>
        );
    };

    const renderPartners = (section) => {
        const styles = section.styles || {};
        return (
            <motion.div
                key={section.id}
                id="partners"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                style={{
                    paddingBottom: '100px',
                    scrollMarginTop: '80px',
                    backgroundColor: styles.bgColor || 'transparent',
                    backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                    backgroundSize: styles.backgroundSize || 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}
            >
                {/* Background Overlay for the whole section */}
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>


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
                                <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: '#FFFFFF', marginBottom: '1rem' }}>{milestone.headline}</h2>
                                <p style={{ fontSize: '1.5rem', color: '#D4AF37', marginBottom: '2rem' }}>{milestone.subtitle}</p>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100px', margin: '0 auto 2rem' }}></div>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
                                    {milestone.description}
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
                                    <div key={partner.id || i} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '3rem', position: 'relative', background: 'white' }}>
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
                                    <div key={bank.id || i} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '3rem', position: 'relative', background: 'white' }}>
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
            </motion.div>
        );
    };




    // Renderer Map
    const renderers = {
        'hero': renderHero,
        'mission': renderMission,
        'board': renderBoard,
        'partners': renderPartners,
        'milestone': renderPartners, // Milestone is rendered within partners section
        'custom': (section) => <UniversalSection key={section.id} section={section} />
    };

    const renderCustom = (section) => <UniversalSection key={section.id} section={section} />;

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
