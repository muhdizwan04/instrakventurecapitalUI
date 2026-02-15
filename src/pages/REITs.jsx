import React from 'react';
import PageHero from '../components/PageHero';
import { Landmark, Building2, TrendingUp, Users, Shield, CheckCircle } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import ProtectedFormSection from '../components/ProtectedFormSection';
import DynamicServiceForm from '../components/DynamicServiceForm';

const REITs = () => {
    // Fetch content from admin
    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const serviceData = servicePages.pages?.find(p => p.id === 'reits');

    // Default data as fallback
    const defaultData = {
        title: 'REAL ESTATE INVESTMENT TRUST (REITs)',
        subtitle: 'Institutional-grade real estate investment opportunities through structured REIT vehicles.',
        introduction: 'Institutional-grade real estate investment opportunities through structured REIT vehicles. Access high-quality real estate portfolios through our managed REIT investment structures, providing diversified exposure to premium commercial and residential assets.',
        overview: {
            heading: 'Institutional REIT Solutions',
            description: 'Access high-quality real estate portfolios through our managed REIT investment structures.'
        },
        services: [
            { icon: <Building2 />, title: 'Commercial Portfolios', desc: 'Diversified holdings across office buildings, retail centers, and industrial hubs.' },
            { icon: <TrendingUp />, title: 'Stable Yields', desc: 'Consistent income generation through professional property management and leasing.' },
            { icon: <Shield />, title: 'Risk Management', desc: 'Rigorous selection criteria and ongoing oversight to protect investor capital.' },
            { icon: <Users />, title: 'Expert Management', desc: 'Led by seasoned real estate professionals with a track record of performance.' },
        ]
    };

    const pageContent = serviceData || defaultData;
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
            <section style={{ padding: '80px 20px 40px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.15rem', color: '#4A5568', lineHeight: '1.9' }}>
                            {introduction}
                        </p>
                    </div>
                </div>
            </section>

            {/* Overview / Services */}
            <section style={{ padding: '40px 20px 80px', background: '#FFFFFF' }}>
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
            </section>

            {/* Form Section */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(26, 54, 93, 0.1)', boxShadow: '0 4px 20px rgba(26, 54, 93, 0.08)' }}>
                            <ProtectedFormSection serviceName="REITs">
                                <DynamicServiceForm
                                    serviceId="reits"
                                    title="Inquire About REIT Investments"
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
