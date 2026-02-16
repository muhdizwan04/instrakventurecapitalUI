import React from 'react';
import PageHero from '../components/PageHero';
import { Gem, Landmark, Shield, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import ProtectedFormSection from '../components/ProtectedFormSection';
import DynamicServiceForm from '../components/DynamicServiceForm';

const PrivateWealthInvestment = () => {
    // Fetch content from admin
    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const serviceData = servicePages.pages?.find(p => p.id === 'private-wealth');

    // Default data as fallback
    const defaultData = {
        title: 'PRIVATE WEALTH INVESTMENT (PWI)',
        subtitle: 'Elite wealth management and bespoke investment solutions.',
        introduction: "Exclusive wealth management mandates for private principals, family offices, and high-net-worth individuals. Our Private Wealth Investment division focuses on capital preservation, strategic growth, and legacy planning across diversified global asset classes.",
        overview: {
            heading: 'Bespoke Wealth Management',
            description: 'Sophisticated investment strategies tailored to the unique needs of ultra-high-net-worth clients.'
        },
        services: [
            { icon: <Gem />, title: 'Exclusive Access', desc: 'Connectivity to off-market opportunities and elite investment vehicles in Dubai and beyond.' },
            { icon: <Landmark />, title: 'Estate Planning', desc: 'Secure your legacy with comprehensive multi-generational wealth transfer and trust planning.' },
            { icon: <Shield />, title: 'Capital Preservation', desc: 'Rigorous risk management and defensive positioning to protect your core wealth.' },
            { icon: <TrendingUp />, title: 'Growth Strategies', desc: 'Strategic allocation into high-potential global trends and specialized private equity.' },
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
                            <ProtectedFormSection serviceName="Private Wealth Investment">
                                <DynamicServiceForm
                                    serviceId="private-wealth"
                                    title="Inquire About Private Wealth"
                                />
                            </ProtectedFormSection>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivateWealthInvestment;
