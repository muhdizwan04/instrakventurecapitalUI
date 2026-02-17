import React from 'react';
import PageHero from '../components/PageHero';
import { Calendar, ArrowRight } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

const LatestNews = () => {
    const defaultContent = {
        pageHeader: { title: 'Latest News', subtitle: 'Keeping stakeholders informed on milestones, partnerships, and industrial growth.' },
        articles: []
    };

    const { content, loading } = usePageContent('news', defaultContent);
    const articles = content.articles || [];
    const pageHeader = content.pageHeader || defaultContent.pageHeader;

    return (
        <div className="page-wrapper">
            <PageHero
                title={pageHeader.title}
                subtitle={pageHeader.subtitle}
            />
            <div className="container" style={{ padding: '80px 20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Loading news...</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div
                        className="glass-card"
                        style={{ padding: '4rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
                    >
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontStyle: 'italic' }}>
                            Not available at this moment
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {articles.map((article, i) => (
                            <div key={i} className="glass-card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <Calendar size={16} style={{ color: 'var(--accent-secondary)' }} />
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{article.date}</span>
                                    <span style={{
                                        marginLeft: 'auto',
                                        background: 'var(--accent-primary)',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem'
                                    }}>
                                        {article.category}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--accent-primary)' }}>{article.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>{article.summary}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', cursor: 'pointer' }}>
                                    <span style={{ fontWeight: '600' }}>Read More</span>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestNews;

