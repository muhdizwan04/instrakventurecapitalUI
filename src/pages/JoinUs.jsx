import React from 'react';
import PageHero from '../components/PageHero';
import { usePageContent } from '../hooks/usePageContent';
import { MapPin, Clock, Briefcase, ArrowRight, Mail } from 'lucide-react';

const JoinUs = () => {
    const defaultContent = {
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

    const { content, loading } = usePageContent('career', defaultContent);
    const jobs = content.jobs || [];

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
                    textColor={styles.textColor || (styles.bgColor === '#1A365D' ? '#FFFFFF' : undefined)}
                    style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
                />
            </div>
        );
    };

    const renderJobs = (section) => {
        const styles = section.styles || {};
        const titleColor = styles.titleColor || styles.textColor || '#1A365D';
        const titleSizePx = styles.titleFontSize != null ? styles.titleFontSize : 32;
        const cardStyle = styles.cardStyle || 'glass';
        const isCardGlass = cardStyle !== 'solid';
        const cardColorHex = (styles.cardColor || '#FFFFFF').replace(/^#/, '');
        const hexToRgba = (hex, a) => {
            if (hex.length === 6) {
                const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
                return `rgba(${r},${g},${b},${a})`;
            }
            return 'rgba(255,255,255,0.9)';
        };
        const cardBg = isCardGlass ? hexToRgba(cardColorHex, 0.42) : (styles.cardColor || '#FFFFFF');
        const glassStyle = isCardGlass ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } : {};
        const iconColor = styles.iconColor || '#1A365D';
        const buttonColor = styles.buttonColor || styles.iconColor || '#1A365D';
        const buttonIconColor = styles.buttonIconColor || '#B8860B';
        const buttonOutlineColor = styles.buttonOutlineColor || styles.buttonIconColor || '#B8860B';
        const buttonBgColor = styles.buttonBgColor || 'transparent';
        return (
            <div key={section.id} className="container-wrapper" style={{
                padding: '80px 20px',
                backgroundColor: styles.bgColor || 'transparent',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: styles.textColor || 'inherit'
            }}>
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
                    {jobs.length > 0 ? (
                        <div style={{ marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: `${titleSizePx}px`, marginBottom: '0.5rem', color: titleColor, textAlign: styles.textAlign || 'center' }}>{section.title || 'Open Positions'}</h2>
                            <p style={{ color: styles.textColor ? styles.textColor : 'var(--text-secondary)', opacity: 0.8, textAlign: styles.textAlign || 'center', marginBottom: '3rem' }}>Current opportunities at Instrak Venture Capital</p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                {jobs.map((job, i) => (
                                    <div key={i} className="glass-card" style={{ padding: '2rem', borderLeft: `4px solid ${iconColor}`, background: cardBg, border: '1px solid rgba(0,0,0,0.06)', ...glassStyle }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Briefcase size={24} color="white" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: styles.textColor || titleColor, fontWeight: '700' }}>{job.title}</h3>
                                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: styles.textColor ? styles.textColor : 'var(--text-secondary)', opacity: 0.9 }}>
                                                        <MapPin size={14} color={iconColor} /> {job.location || 'Location TBD'}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: styles.textColor ? styles.textColor : 'var(--text-secondary)', opacity: 0.9 }}>
                                                        <Clock size={14} color={iconColor} /> {job.type || 'Full-time'}
                                                    </span>
                                                </div>
                                                <p style={{ color: styles.textColor ? styles.textColor : 'var(--text-secondary)', opacity: 0.9, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>{job.summary}</p>
                                                {(() => {
                                                    const introSection = content?.sections?.find(s => s.type === 'intro');
                                                    const applyUrl = job.applyLink || styles.defaultApplyLink || (introSection?.email ? `mailto:${introSection.email}?subject=Application for ${encodeURIComponent(job.title || '')}` : '');
                                                    const applyLabel = styles.applyButtonLabel || 'Apply Now';
                                                    const openNewTab = !!styles.openApplyInNewTab;
                                                    if (!applyUrl) return null;
                                                    return (
                                                        <a
                                                            href={applyUrl}
                                                            target={openNewTab ? '_blank' : undefined}
                                                            rel={openNewTab ? 'noopener noreferrer' : undefined}
                                                            className="career-apply-btn"
                                                            style={{
                                                                color: buttonColor,
                                                                borderColor: buttonOutlineColor,
                                                                backgroundColor: buttonBgColor,
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {applyLabel} <ArrowRight size={16} color={buttonIconColor} />
                                                        </a>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : !loading && (
                        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                            <div className="glass-card" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', background: cardBg, border: '1px solid rgba(0,0,0,0.06)', ...glassStyle }}>
                                <Briefcase size={48} style={{ color: iconColor, marginBottom: '1rem' }} />
                                <h3 style={{ color: titleColor, marginBottom: '0.5rem' }}>No Open Positions</h3>
                                <p style={{ color: styles.textColor ? styles.textColor : 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    We don't have any open positions at the moment, but we're always looking for talented professionals.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderIntro = (section) => {
        const styles = section.styles || {};
        return (
            <div key={section.id} style={{
                padding: '80px 20px',
                backgroundColor: styles.bgColor || 'transparent',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: styles.textColor || 'inherit'
            }}>
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div style={{ textAlign: styles.textAlign || 'left' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: styles.textColor || '#1A365D' }}>{section.title}</h2>
                            <p style={{ color: styles.textColor ? styles.textColor : 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', whiteSpace: 'pre-wrap', opacity: styles.textColor ? 0.9 : 1 }}>
                                {section.description}
                            </p>
                            {section.email && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: styles.textColor ? styles.textColor : 'var(--text-secondary)', justifyContent: styles.textAlign === 'center' ? 'center' : 'flex-start' }}>
                                        <Mail size={18} />
                                        <a href={`mailto:${section.email}`} style={{ color: styles.textColor || 'var(--accent-primary)', fontWeight: 'bold' }}>{section.email}</a>
                                    </div>
                                    <button className="btn-solid" onClick={() => window.location.href = `mailto:${section.email}`}>Email Resume</button>
                                </>
                            )}
                        </div>
                        {(() => {
                            const boxText = (section.rightBoxContent != null && section.rightBoxContent.trim() !== '')
                                ? section.rightBoxContent.trim()
                                : (section.rightBoxContent === undefined ? '"Integrity is the bedrock of our institutional success."' : null);
                            if (!boxText) return null;
                            const isGlass = styles.rightBoxStyle === 'glass';
                            const bgHex = (styles.rightBoxBgColor != null && styles.rightBoxBgColor !== '') ? styles.rightBoxBgColor.replace(/^#/, '') : 'FFFFFF';
                            const hexToRgba = (hex, a) => {
                                if (hex.length === 6) {
                                    const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
                                    return `rgba(${r},${g},${b},${a})`;
                                }
                                return 'rgba(255,255,255,0.42)';
                            };
                            const boxBg = isGlass ? hexToRgba(bgHex, 0.42) : (styles.rightBoxBgColor || 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)');
                            const glassStyle = isGlass ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' } : {};
                            return (
                                <div
                                    className="glass-card"
                                    style={{
                                        minHeight: '300px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: (styles.rightBoxBgColor != null && styles.rightBoxBgColor !== '') ? boxBg : (isGlass ? 'rgba(255,255,255,0.42)' : 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)'),
                                        color: (styles.rightBoxTextColor != null && styles.rightBoxTextColor !== '') ? styles.rightBoxTextColor : 'var(--accent-secondary)',
                                        ...glassStyle
                                    }}
                                >
                                    <p style={{ fontStyle: 'italic', textAlign: 'center', padding: '2rem', fontSize: '1.2rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                                        {boxText}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        );
    };

    const renderCustom = (section) => {
        const styles = section.styles || {};
        return (
            <section key={section.id} style={{
                padding: '80px 20px',
                backgroundColor: styles.bgColor || '#FFFFFF',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: styles.textColor || 'inherit'
            }}>
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: section.title ? (styles.textAlign || 'center') : 'left' }}>
                        {section.title && <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: styles.textColor || '#1A365D' }}>{section.title}</h2>}
                        <div style={{ color: styles.textColor || '#4A5568', lineHeight: '1.8', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                            {section.content}
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    // Main Content
    let sections = [];
    if (content.sections) {
        sections = content.sections;
    } else {
        sections = defaultContent.sections;
    }

    const renderers = {
        'hero': renderHero,
        'intro': renderIntro,
        'jobs': renderJobs,
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

export default JoinUs;
