import React, { useMemo } from 'react';
import PageHero from '../components/PageHero';
import { ShieldCheck, Eye, Scale } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

const ICON_MAP = { ShieldCheck, Eye, Scale };

const MissionVisionValues = () => {
    const defaultContent = {
        sections: [
            {
                id: 'hero',
                title: 'Mission, Vision & Values',
                subtitle: 'The foundational pillars of Instrak Venture Capital Berhad.'
            },
            {
                id: 'mission',
                missionTitle: 'Our Mission',
                missionText: 'To be the catalyst for sustainable growth in the ASEAN region, bridging the gap between visionary entrepreneurs and strategic capital through disciplined governance and ethical excellence.',
                visionTitle: 'Our Vision',
                visionText: 'To set the benchmark for venture capital integrity, becoming the trusted partner of choice for institutional investors and high-growth industrial leaders worldwide.',
                values: [
                    { id: 1, title: 'Governance', text: 'We adhere to the highest standards of corporate governance to ensure long-term stability and stakeholder value.', icon: 'ShieldCheck' },
                    { id: 2, title: 'Transparency', text: 'Open communication and clear, disciplined reporting are at the heart of our institutional operations.', icon: 'Eye' },
                    { id: 3, title: 'Integrity', text: 'Honesty and unwavering moral principles guide our investment decisions and sustainable partnerships.', icon: 'Scale' }
                ]
            }
        ]
    };

    const { content } = usePageContent('about', defaultContent);
    const { content: settings } = usePageContent('global_settings');

    // Extract Sections
    const heroSection = useMemo(() =>
        content?.sections?.find(s => s.id === 'hero') || defaultContent.sections[0],
        [content]);

    const missionSection = useMemo(() =>
        content?.sections?.find(s => s.id === 'mission') || defaultContent.sections[1],
        [content]);

    // Override subtitle if site name is available and not customized
    const heroSubtitle = (!heroSection.subtitle || heroSection.subtitle === defaultContent.sections[0].subtitle) && settings?.siteIdentity?.siteName
        ? `The foundational pillars of ${settings.siteIdentity.siteName}.`
        : heroSection.subtitle;

    return (
        <div className="page-wrapper">
            <PageHero
                title={heroSection.title}
                subtitle={heroSubtitle}
            />

            <div className="container" style={{ padding: '80px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '80px' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                            {missionSection.missionTitle || 'Our Mission'}
                        </h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                            {missionSection.missionText}
                        </p>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                            {missionSection.visionTitle || 'Our Vision'}
                        </h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                            {missionSection.visionText}
                        </p>
                    </div>
                </div>

                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    {(missionSection.values || []).map((v, i) => {
                        const IconComponent = ICON_MAP[v.icon] || ShieldCheck;
                        return (
                            <div key={i} className="glass-card">
                                <IconComponent size={32} style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }} />
                                <h3 style={{ marginBottom: '1rem' }}>{v.title}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{v.text}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MissionVisionValues;

