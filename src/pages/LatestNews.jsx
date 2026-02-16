import React from 'react';
import PageHero from '../components/PageHero';
import { usePageContent } from '../hooks/usePageContent';

const LatestNews = () => {
    // Default content if none exists in admin
    const defaultContent = {
        hero: {
            title: 'Latest News',
            subtitle: 'Stay updated with the latest insights and announcements from Instrak Venture Capital.'
        },
        sections: [
            {
                id: 'news-feed',
                type: 'custom',
                content: 'Coming Soon...'
            }
        ]
    };

    const { content, loading } = usePageContent('latest_news', defaultContent);

    return (
        <div className="page-wrapper">
            <PageHero
                title={content.hero?.title || defaultContent.hero.title}
                subtitle={content.hero?.subtitle || defaultContent.hero.subtitle}
            />

            <div className="container section-padding">
                <div className="glass-card p-8">
                    {content.sections?.map((section, index) => (
                        <div key={index} className="mb-8 last:mb-0">
                            {section.title && <h2 className="text-2xl font-bold mb-4 text-primary-dark">{section.title}</h2>}
                            <div className="prose max-w-none">
                                {section.content || 'News updates coming soon.'}
                            </div>
                        </div>
                    ))}
                    {(!content.sections || content.sections.length === 0) && (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-600">No news articles found at the moment. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LatestNews;
