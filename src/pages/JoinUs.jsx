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
                    style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
                />
            </div>
        );
    };

    const renderJobs = (section) => {
        const styles = section.styles || {};
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
                    {/* Open Positions Section */}
                    {jobs.length > 0 ? (
                        <div style={{ marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: styles.textColor || '#1A365D', textAlign: styles.textAlign || 'center' }}>{section.title || 'Open Positions'}</h2>
                            <p style={{ color: styles.textColor ? styles.textColor : 'var(--text-secondary)', opacity: 0.8, textAlign: styles.textAlign || 'center', marginBottom: '3rem' }}>Current opportunities at Instrak Venture Capital</p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                {jobs.map((job, i) => (
                                    <div key={i} className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid #B8860B', background: 'white' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #1A365D, #2D5A8B)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Briefcase size={24} color="white" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1A365D', fontWeight: '700' }}>{job.title}</h3>
                                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        <MapPin size={14} /> {job.location || 'Location TBD'}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        <Clock size={14} /> {job.type || 'Full-time'}
                                                    </span>
                                                </div>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>{job.summary}</p>
                                                <button
                                                    onClick={() => window.location.href = `mailto:${null}?subject=Application for ${job.title}`}
                                                    // email logic handled in Intro usually, or we can look it up
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B8860B', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                                                >
                                                    Apply Now <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : !loading && (
                        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                            <div className="glass-card" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', background: 'white' }}>
                                <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                <h3 style={{ color: '#1A365D', marginBottom: '0.5rem' }}>No Open Positions</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
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
                        <div className="glass-card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)' }}>
                            <p style={{ fontStyle: 'italic', color: 'var(--accent-secondary)', textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>"Integrity is the bedrock of our institutional success."</p>
                        </div>
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
