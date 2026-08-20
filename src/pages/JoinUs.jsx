import React from 'react';
import PageHero from '../components/PageHero';
import { usePageContent } from '../hooks/usePageContent';
import { MapPin, Clock, Briefcase, ArrowRight, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { isDarkHexColor, isLikelyLightTextColor } from '../theme/clientThemeDefaults';
import { lightBandAt } from '../theme/lightBands';
import ScrollReveal from '../components/ScrollReveal';

const JoinUs = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const resolveSectionSurface = (styles) => {
        const bg = styles.bgColor;
        if (!isLight) return bg || 'transparent';
        if (bg && isDarkHexColor(bg)) return 'transparent';
        return bg || 'transparent';
    };

    const resolveSectionInk = (styles, fallbackDark = '#1e293b') => {
        const t = styles.textColor;
        if (!isLight) return t || 'inherit';
        if (!t) return fallbackDark;
        return isLikelyLightTextColor(t) ? fallbackDark : t;
    };

    const careerLightBandClass = (idx, section) => {
        if (!isLight) return '';
        if (section?.styles?.backgroundImage) return '';
        return `lm-band-${lightBandAt(idx)}`;
    };
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

    const renderHero = (section, idx) => {
        const styles = section.styles || {};
        const bandCls = careerLightBandClass(idx, section);
        const heroBg = resolveSectionSurface(styles);
        const heroText = isLight
            ? (styles.textColor && !isLikelyLightTextColor(styles.textColor) ? styles.textColor : undefined)
            : (styles.textColor || (styles.bgColor === '#1A365D' ? '#FFFFFF' : undefined));
        return (
            <div key={section.id} className={bandCls} style={{
                backgroundColor: bandCls ? 'transparent' : heroBg,
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
                    textColor={heroText}
                    style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
                />
            </div>
        );
    };

    const renderJobs = (section, idx) => {
        const styles = section.styles || {};
        const bandCls = careerLightBandClass(idx, section);
        const rawTitleColor = styles.titleColor || styles.textColor || '#1A365D';
        const titleColor = isLight && isLikelyLightTextColor(rawTitleColor) ? '#1A365D' : rawTitleColor;
        const sectionInk = resolveSectionInk(styles, '#1e293b');
        const sublineColor = isLight ? '#64748b' : (styles.textColor ? styles.textColor : 'var(--text-secondary)');
        const cardHeadingColor = isLight ? '#0f172a' : (styles.textColor || titleColor);
        const cardBodyColor = isLight ? '#475569' : (styles.textColor ? styles.textColor : 'var(--text-secondary)');
        const jobsSurfaceBg = bandCls ? 'transparent' : resolveSectionSurface(styles);
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
        const cardBg = isLight
            ? (isCardGlass ? '#ffffff' : (styles.cardColor || '#FFFFFF'))
            : (isCardGlass ? hexToRgba(cardColorHex, 0.42) : (styles.cardColor || '#FFFFFF'));
        const glassStyle = isLight ? {} : (isCardGlass ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } : {});
        const iconColor = styles.iconColor || '#1A365D';
        const buttonColor = styles.buttonColor || styles.iconColor || '#1A365D';
        const buttonIconColor = styles.buttonIconColor || '#B8860B';
        const buttonOutlineColor = styles.buttonOutlineColor || styles.buttonIconColor || '#B8860B';
        const buttonBgColor = styles.buttonBgColor || 'transparent';
        return (
            <div key={section.id} className={['container-wrapper', 'editorial-section', bandCls].filter(Boolean).join(' ')} style={{
                padding: '80px 20px',
                backgroundColor: jobsSurfaceBg,
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: isLight ? sectionInk : (styles.textColor || 'inherit')
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
                            <ScrollReveal>
                                <div className="editorial-section-heading" data-kicker="02 / Current Opportunities">
                                    <h2 style={{ fontSize: `${titleSizePx}px`, marginBottom: '0.5rem', color: titleColor, textAlign: styles.textAlign || 'center' }}>{section.title || 'Open Positions'}</h2>
                                    <p style={{ color: sublineColor, opacity: isLight ? 1 : 0.8, textAlign: styles.textAlign || 'center', marginBottom: '3rem' }}>Current opportunities at Instrak Venture Capital</p>
                                </div>
                            </ScrollReveal>

                            <div className="editorial-career-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                {jobs.map((job, i) => (
                                    <ScrollReveal key={`${job.title}-${i}`} staggerIndex={i}>
                                    <div className="glass-card editorial-career-card" style={{ padding: '2rem', borderLeft: `4px solid ${iconColor}`, background: cardBg, border: '1px solid rgba(0,0,0,0.06)', ...glassStyle }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Briefcase size={24} color="white" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: cardHeadingColor, fontWeight: '700' }}>{job.title}</h3>
                                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: cardBodyColor, opacity: 0.95 }}>
                                                        <MapPin size={14} color={iconColor} /> {job.location || 'Location TBD'}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: cardBodyColor, opacity: 0.95 }}>
                                                        <Clock size={14} color={iconColor} /> {job.type || 'Full-time'}
                                                    </span>
                                                </div>
                                                <p style={{ color: cardBodyColor, opacity: 0.95, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>{job.summary}</p>
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
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    ) : !loading && (
                        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                            <div className="glass-card editorial-career-empty" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', background: cardBg, border: '1px solid rgba(0,0,0,0.06)', ...glassStyle }}>
                                <Briefcase size={48} style={{ color: iconColor, marginBottom: '1rem' }} />
                                <h3 style={{ color: titleColor, marginBottom: '0.5rem' }}>No Open Positions</h3>
                                <p style={{ color: cardBodyColor, marginBottom: '1.5rem' }}>
                                    We don't have any open positions at the moment, but we're always looking for talented professionals.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderIntro = (section, idx) => {
        const styles = section.styles || {};
        const bandCls = careerLightBandClass(idx, section);
        const introBg = bandCls ? 'transparent' : resolveSectionSurface(styles);
        const introInk = resolveSectionInk(styles, '#1e293b');
        const introHeading = isLight
            ? (styles.textColor && !isLikelyLightTextColor(styles.textColor) ? styles.textColor : '#1A365D')
            : (styles.textColor || '#1A365D');
        const introBody = isLight ? '#475569' : (styles.textColor ? styles.textColor : 'var(--text-secondary)');
        return (
            <div key={section.id} className={['editorial-section', bandCls].filter(Boolean).join(' ')} style={{
                padding: '80px 20px',
                backgroundColor: introBg,
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: isLight ? introInk : (styles.textColor || 'inherit')
            }}>
                {styles.backgroundImage && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'black',
                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                        zIndex: 0, pointerEvents: 'none'
                    }} />
                )}
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
                    <ScrollReveal>
                    <div className="editorial-career-intro" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div className="editorial-career-copy" style={{ textAlign: styles.textAlign || 'left' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: introHeading }}>{section.title}</h2>
                            <p style={{ color: introBody, fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', whiteSpace: 'pre-wrap', opacity: isLight ? 1 : (styles.textColor ? 0.9 : 1) }}>
                                {section.description}
                            </p>
                            {section.email && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: introBody, justifyContent: styles.textAlign === 'center' ? 'center' : 'flex-start' }}>
                                        <Mail size={18} />
                                        <a href={`mailto:${section.email}`} style={{ color: isLight ? 'var(--accent-primary)' : (styles.textColor || 'var(--accent-primary)'), fontWeight: 'bold' }}>{section.email}</a>
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
                            const glassStyle = isLight
                                ? (isGlass ? { border: '1px solid rgba(15, 23, 42, 0.1)' } : {})
                                : (isGlass ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' } : {});
                            const defaultQuoteBg = isLight && isGlass ? '#ffffff' : (isGlass ? 'rgba(255,255,255,0.42)' : 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)');
                            const quoteSurfaceBg = isLight && isGlass ? '#ffffff' : ((styles.rightBoxBgColor != null && styles.rightBoxBgColor !== '') ? boxBg : defaultQuoteBg);
                            return (
                                <div
                                    className="glass-card editorial-career-quote"
                                    style={{
                                        minHeight: '300px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: quoteSurfaceBg,
                                        color: isLight
                                            ? ((styles.rightBoxTextColor != null && styles.rightBoxTextColor !== '' && !isLikelyLightTextColor(styles.rightBoxTextColor))
                                                ? styles.rightBoxTextColor
                                                : '#B8860B')
                                            : ((styles.rightBoxTextColor != null && styles.rightBoxTextColor !== '') ? styles.rightBoxTextColor : 'var(--accent-secondary)'),
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
                    </ScrollReveal>
                </div>
            </div>
        );
    };

    const renderCustom = (section, idx) => {
        const styles = section.styles || {};
        const bandCls = careerLightBandClass(idx, section);
        const customBg = bandCls
            ? 'transparent'
            : (isLight && styles.bgColor && isDarkHexColor(styles.bgColor)
                ? 'transparent'
                : (styles.bgColor || '#FFFFFF'));
        const customInk = resolveSectionInk(styles, '#1e293b');
        return (
            <section key={section.id} className={['editorial-section', bandCls].filter(Boolean).join(' ')} style={{
                padding: '80px 20px',
                backgroundColor: customBg,
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: isLight ? customInk : (styles.textColor || 'inherit')
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
                        {section.title && <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: isLight ? (styles.textColor && !isLikelyLightTextColor(styles.textColor) ? styles.textColor : '#1A365D') : (styles.textColor || '#1A365D') }}>{section.title}</h2>}
                        <div style={{ color: isLight ? '#475569' : (styles.textColor || '#4A5568'), lineHeight: '1.8', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
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
        <div className="page-wrapper editorial-page editorial-page--career">
            {sections.map((section, idx) => {
                const RenderFn = renderers[section.type] || renderCustom;
                return RenderFn(section, idx);
            })}
        </div>
    );
};

export default JoinUs;
