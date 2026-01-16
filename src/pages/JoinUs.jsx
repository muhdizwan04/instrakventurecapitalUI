import React from 'react';
import PageHero from '../components/PageHero';
import { usePageContent } from '../hooks/usePageContent';
import { MapPin, Clock, Briefcase, ArrowRight, Mail } from 'lucide-react';

const JoinUs = () => {
    const defaultContent = {
        pageSettings: {
            pageTitle: 'Join Our Elite Team',
            pageSubtitle: 'Building a legacy of financial excellence and industrial leadership.',
            mainHeading: 'Career at Instrak',
            description: 'We look for professionals who embody our values of integrity, transparency, and strategic foresight.\n\nTo those who are interested, kindly drop your resume by direct email.',
            contactEmail: 'vacancy@instrakventurecapital.com'
        },
        jobs: []
    };

    const { content, loading } = usePageContent('career', defaultContent);
    const settings = content.pageSettings || defaultContent.pageSettings;
    const jobs = content.jobs || [];

    return (
        <div className="page-wrapper">
            <PageHero
                title={settings.pageTitle}
                subtitle={settings.pageSubtitle}
            />
            <div className="container" style={{ padding: '80px 20px' }}>

                {/* Open Positions Section - FIRST */}
                {jobs.length > 0 && (
                    <div style={{ marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1A365D', textAlign: 'center' }}>Open Positions</h2>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '3rem' }}>Current opportunities at Instrak Venture Capital</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {jobs.map((job, i) => (
                                <div key={i} className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid #B8860B' }}>
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
                                                onClick={() => window.location.href = `mailto:${settings.contactEmail}?subject=Application for ${job.title}`}
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
                )}

                {/* No Jobs Message */}
                {jobs.length === 0 && !loading && (
                    <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                        <div className="glass-card" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
                            <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                            <h3 style={{ color: '#1A365D', marginBottom: '0.5rem' }}>No Open Positions</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                We don't have any open positions at the moment, but we're always looking for talented professionals.
                            </p>
                            <button className="btn-solid" onClick={() => window.location.href = `mailto:${settings.contactEmail}?subject=General Application`}>
                                Send General Application
                            </button>
                        </div>
                    </div>
                )}

                {/* Career at Instrak Section - SECOND */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#1A365D' }}>{settings.mainHeading}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', whiteSpace: 'pre-line' }}>
                            {settings.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            <Mail size={18} />
                            <a href={`mailto:${settings.contactEmail}`} style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{settings.contactEmail}</a>
                        </div>
                        <button className="btn-solid" onClick={() => window.location.href = `mailto:${settings.contactEmail}`}>Email Resume</button>
                    </div>
                    <div className="glass-card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)' }}>
                        <p style={{ fontStyle: 'italic', color: 'var(--accent-secondary)', textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>"Integrity is the bedrock of our institutional success."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinUs;
