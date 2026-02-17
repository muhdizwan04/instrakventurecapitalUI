import React from 'react';
import PageHero from '../components/PageHero';
import { Landmark, Building, PieChart, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { isSectionVisible } from '../utils/sectionVisibility';
import ProtectedFormSection from '../components/ProtectedFormSection';
import DynamicServiceForm from '../components/DynamicServiceForm';

const REITs = () => {
    // Fetch content from admin
    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const serviceData = servicePages.pages?.find(p => p.id === 'reits');

    // Default data as fallback
    const defaultData = {
        title: 'REAL ESTATE INVESTMENT TRUST (REITs)',
        subtitle: 'Strategic real estate investment opportunities through structured trusts.',
        introduction: 'Strategic real estate investment opportunities through structured trusts. Our REITs advisory provides institutional investors with access to high-yield property portfolios, professionally managed for consistent returns and long-term capital appreciation.',
        overview: {
            heading: 'REITs & Property Investment',
            description: 'Access diversified real estate portfolios through professionally managed investment vehicles.'
        },
        services: [
            { icon: <Building />, title: 'Asset Selection', desc: 'Rigorous analysis and selection of high-performing commercial and residential properties.' },
            { icon: <Landmark />, title: 'Trust Structuring', desc: 'Expert guidance on the legal and financial structuring of Real Estate Investment Trusts.' },
            { icon: <PieChart />, title: 'Portfolio Management', desc: 'Active management of property assets to maximize occupancy and rental yields.' },
            { icon: <TrendingUp />, title: 'Yield Optimization', desc: 'Strategic improvements and financial modeling to enhance distribution to shareholders.' },
        ]
    };

    const pageContent = serviceData || defaultData;
    const show = (key) => isSectionVisible(pageContent, key);
    const title = pageContent.title || defaultData.title;
    const introduction = pageContent.introduction || pageContent.subtitle || defaultData.introduction;
    const overview = pageContent.overview || defaultData.overview;
    const services = (pageContent.services || defaultData.services).map((s, i) => ({
        ...s,
        icon: defaultData.services[i]?.icon || <CheckCircle />
    }));

    return (
        <div className="page-wrapper">
            <PageHero
                title={title}
                subtitle=""
            />

            {/* Introduction */}
            {show('subtitle') && <section style={{ padding: '80px 20px 40px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.15rem', color: '#4A5568', lineHeight: '1.9' }}>
                            {introduction}
                        </p>
                    </div>
                </div>
            </section>}

            {/* Overview / Services */}
            {show('services') && <section style={{ padding: '40px 20px 80px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 className="section-title">{overview.heading}</h2>
                    <p style={{ textAlign: 'center', color: '#4A5568', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        {overview.description}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {services.map((service, i) => (
                            <div key={i} className="glass-card">
                                <div style={{ color: '#B8860B', marginBottom: '1rem' }}>{service.icon}</div>
                                <h4 style={{ marginBottom: '0.75rem', color: '#1A365D' }}>{service.title}</h4>
                                <p style={{ color: '#4A5568', fontSize: '0.95rem' }}>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>}

            {/* Form Section */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(26, 54, 93, 0.1)', boxShadow: '0 4px 20px rgba(26, 54, 93, 0.08)' }}>
                            <ProtectedFormSection serviceName="REITs">
                                <DynamicServiceForm
                                    serviceId="reits"
                                    title="Inquire About REITs"
                                />
                            </ProtectedFormSection>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default REITs;
