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
                title: aboutContent.heroTitle || 'About Instrak Venture Capital',
                subtitle: aboutContent.heroSubtitle || 'A global asset and capital management institution.'
            },
            {
                id: 'mission',
                type: 'mission',
                missionTitle: aboutContent.missionTitle || 'Our Mission',
                missionText: aboutContent.missionText || 'To be the catalyst...',
                visionTitle: aboutContent.visionTitle || 'Our Vision',
                visionText: aboutContent.visionText || 'To set the benchmark...',
                values: aboutContent.values || defaultAbout.sections.find(s => s.id === 'mission')?.values
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
                    textColor={styles.textColor}
                    sectionStyles={styles}
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
                        {(section.sectionLabel || section.sectionLabel === undefined) && (
                            <h6 style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                                {section.sectionLabel !== undefined ? section.sectionLabel : 'Leadership'}
                            </h6>
                        )}
                        <h2 className="section-title" style={{
                            marginTop: '0.5rem',
                            color: styles.textColor || '#1A365D',
                            fontWeight: styles.titleFontWeight || 800,
                            fontStyle: styles.titleFontStyle || 'normal',
                            textDecoration: styles.titleTextDecoration || 'none',
                            fontSize: styles.titleFontSize ? `${styles.titleFontSize}px` : undefined
                        }}>{section.title || 'Board of Directors'}</h2>
                        {section.subtitle && (
                            <p style={{
                                maxWidth: '600px',
                                margin: (styles.subtitleAlign === 'left') ? '1rem auto 0 0' : (styles.subtitleAlign === 'right') ? '1rem 0 0 auto' : '1rem auto 0',
                                textAlign: styles.subtitleAlign || 'center',
                                color: styles.textColor ? styles.textColor : '#64748B',
                                opacity: styles.textColor ? 0.8 : 1,
                                fontSize: styles.subtitleFontSize ? `${styles.subtitleFontSize}px` : undefined
                            }}>
                                {section.subtitle}
                            </p>
                        )}
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
                                        {partner.logo ? (
                                            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                                <img src={partner.logo} alt={partner.name} style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain' }} />
                                            </div>
                                        ) : (
                                            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}><ShieldCheck size={24} color="#D4AF37" /></div>
                                        )}
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
                                        {bank.logo ? (
                                            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                                <img src={bank.logo} alt={bank.name} style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain' }} />
                                            </div>
                                        ) : (
                                            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}><Building2 size={24} color="#D4AF37" /></div>
                                        )}
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

    const renderMilestone = (section) => {
        const styles = section.styles || {};
        return (
            <motion.div
                key={section.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                style={{
                    paddingBottom: '100px',
                    scrollMarginTop: '80px'
                }}
            >
                {/* 3b. Investment Feature (Deal Tombstone Style) */}
                <section style={{
                    padding: '80px 0',
                    background: '#0A2540',
                    color: 'white',
                    position: 'relative'
                }}>
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
                                {section.title || 'Investment Milestone'}
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
            </motion.div>
        );
    };




    // Renderer Map
    const renderers = {
        'hero': renderHero,
        'mission': renderMission,
        'board': renderBoard,
        'partners': renderPartners,
        'milestone': renderMilestone,
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
