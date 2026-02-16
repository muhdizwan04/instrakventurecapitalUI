import React from 'react';
import PageHero from '../components/PageHero';
import { Globe, Users, Landmark, Briefcase, Shield, CheckCircle } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import ProtectedFormSection from '../components/ProtectedFormSection';
import DynamicServiceForm from '../components/DynamicServiceForm';

const GlobalInvestmentGateway = () => {
    // Fetch content from admin
    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const serviceData = servicePages.pages?.find(p => p.id === 'gig');

    // Default data as fallback
    const defaultData = {
        title: 'GLOBAL INVESTMENT GATEWAY (GIG)',
        subtitle: 'Your structured entry point to global capital markets and strategic partners.',
        introduction: "An exclusive, subscription-based gateway for qualified companies to gain structured access to global investors and strategic partners through IVC's international network. GIG provides the tools, visibility, and connections necessary to scale your business on a global stage.",
        overview: {
            heading: 'Global Market Expansion',
            description: 'Bridging the gap between ambitious companies and international capital flows.'
        },
        services: [
            { icon: <Globe />, title: 'International Network', desc: 'Direct access to institutional investors and family offices across key global financial hubs.' },
            { icon: <Users />, title: 'Strategic Partnerships', desc: 'Facilitated introductions to potential joint venture partners and strategic collaborators.' },
            { icon: <Landmark />, title: 'Capital Structuring', desc: 'Advisory on optimizing your business structure for international investment readiness.' },
            { icon: <Briefcase />, title: 'Market Positioning', desc: 'Enhancing your business profile to resonate with global investment standards and expectations.' },
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
                            <ProtectedFormSection serviceName="Global Investment Gateway">
                                <DynamicServiceForm
                                    serviceId="gig"
                                    title="Inquire About GIG"
                                />
                            </ProtectedFormSection>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GlobalInvestmentGateway;
