import React from 'react';
import PageHero from '../components/PageHero';
import { usePageContent } from '../hooks/usePageContent';
import { User } from 'lucide-react';

const BoardOfDirectors = () => {
    const defaultDirectors = [
        { id: 'dir-1', name: 'KAHAR KAMARUDIN, ANS', role: 'GROUP CHIEF EXECUTIVE OFFICER (GCEO)', image: '' },
        { id: 'dir-2', name: 'PROF IR. DR. NORIDAH', role: 'NON-EXECUTIVE DIRECTOR', image: '' },
        { id: 'dir-3', name: "RAFI YA'ACOB", role: 'CHIEF OPERATING OFFICER (COO)', image: '' },
        { id: 'dir-4', name: 'ZALIZA YAHYA, CPA', role: 'CHIEF FINANCIAL OFFICER (CFO)', image: '' },
        { id: 'dir-5', name: 'NORZALIZA ABD GHAFAR', role: 'GENERAL MANAGER', image: '' },
        { id: 'dir-6', name: 'NORLI HIDAYATUL AINI', role: 'GENERAL MANAGER', image: '' },
        { id: 'dir-7', name: 'DR. SUHAILY SHAHIMI', role: 'INTERNAL AUDITOR', image: '' },
    ];

    const { content } = usePageContent('board', { directors: defaultDirectors });
    const directors = content.directors || defaultDirectors;

    return (
        <div className="page-wrapper">
            <PageHero 
                title="Board of Directors" 
                subtitle="Guided by seasoned leaders with a commitment to integrity and industrial excellence."
            />
            <div className="container" style={{ padding: '80px 20px' }}>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
                    {directors.map((d, i) => (
                        <div 
                            key={i} 
                            className="glass-card"
                            style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <div style={{ 
                                width: '180px', 
                                height: '220px', 
                                marginBottom: '1.5rem', 
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                padding: '10px',
                                background: 'rgba(26, 54, 93, 0.03)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                borderRadius: '8px'
                            }}>
                                {d.image ? (
                                    <img 
                                        src={d.image} 
                                        alt={d.name} 
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                    />
                                ) : (
                                    <div style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'
                                    }}>
                                        <User size={60} color="#94a3b8" />
                                    </div>
                                )}
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>{d.name}</h3>
                            <p style={{ color: 'var(--accent-secondary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>{d.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BoardOfDirectors;
