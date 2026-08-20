import React from 'react';
import PageHero from '../components/PageHero';
import { usePageContent } from '../hooks/usePageContent';
import MagazineBlock from '../components/MagazineBlock';
import { useTheme } from '../context/ThemeContext';
import { lightBandAt } from '../theme/lightBands';

const LatestNews = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    // Default content if none exists in admin
    const defaultContent = {
        hero: {
            title: 'News & Events',
            subtitle: 'Stay updated with the latest insights, announcements, and events from Instrak Venture Capital.',
            buttonLabel: '',
            buttonLink: '',
            styles: {}
        },
        blocks: [
            {
                id: 'block-latest',
                title: 'Latest Updates',
                subtitle: 'Explore our latest news and upcoming events.',
                ctaLabel: '',
                ctaLink: '',
                styles: { bgColor: '#FFFFFF', textColor: '#1A365D' },
                items: []
            }
        ]
    };

    // New schema: `news_events` (admin writes here). We keep legacy fallback support.
    const { content } = usePageContent('news_events', defaultContent);

    const hero = content?.hero || defaultContent.hero;
    const blocks = Array.isArray(content?.blocks) ? content.blocks : null;
    const legacySections = Array.isArray(content?.sections) ? content.sections : null;

    return (
        <div className="page-wrapper editorial-page editorial-page--news">
            <PageHero
                title={hero?.title || defaultContent.hero.title}
                subtitle={hero?.subtitle || defaultContent.hero.subtitle}
                lightBandIndex={0}
                sectionStyles={hero?.styles || {}}
                style={{ backgroundColor: hero?.styles?.bgColor }}
                buttonLabel={hero?.buttonLabel || ''}
                buttonLink={hero?.buttonLink || ''}
            />

            {/* New magazine blocks */}
            {blocks && blocks.length > 0 ? (
                blocks.map((block, i) => (
                    <div key={block.id} className={isLight ? `lm-band-${lightBandAt(i + 1)}` : undefined} style={isLight ? { background: 'transparent' } : undefined}>
                        <MagazineBlock block={block} />
                    </div>
                ))
            ) : (
                // Legacy fallback (old schema: markdown sections)
                <div className={`container section-padding editorial-news-legacy${isLight ? ' lm-band-b' : ''}`} style={isLight ? { background: 'transparent' } : undefined}>
                    <div className="glass-card editorial-callout p-8">
                        {legacySections?.map((section, index) => (
                            <div key={index} className="mb-8 last:mb-0">
                                {section.title && <h2 className="text-2xl font-bold mb-4 text-primary-dark">{section.title}</h2>}
                                <div className="luxury-prose">
                                    <div className="whitespace-pre-wrap">{section.content || 'News updates coming soon.'}</div>
                                </div>
                            </div>
                        ))}
                        {(!legacySections || legacySections.length === 0) && (
                            <div className="text-center py-12">
                                <p className="text-lg text-gray-600">No news articles found at the moment. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LatestNews;
