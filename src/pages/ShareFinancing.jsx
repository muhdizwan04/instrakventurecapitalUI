import React from 'react';
import PageHero from '../components/PageHero';
import { BarChart3, TrendingUp, DollarSign, Shield, Briefcase, CheckCircle } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import ProtectedFormSection from '../components/ProtectedFormSection';
import DynamicServiceForm from '../components/DynamicServiceForm';

const ShareFinancing = () => {
    // Fetch content from admin
    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const serviceData = servicePages.pages?.find(p => p.id === 'share-financing');

    // Default data as fallback
    const defaultData = {
        title: 'SHARE FINANCING (SF)',
        subtitle: 'Liquidity solutions through strategic share-backed financing.',
        introduction: 'Liquidity solutions through strategic share-backed financing. We provide bespoke financing structures that allow stockholders to unlock capital from their equity positions without immediate divestment, supporting both personal and corporate liquidity needs.',
        overview: {
            heading: 'Share-Backed Liquidity',
            description: 'Unlock the value of your equity holdings with flexible financing solutions.'
        },
        services: [
            { icon: <DollarSign />, title: 'Liquidity Access', desc: 'Quick access to capital based on the value of listed or private equity holdings.' },
            { icon: <TrendingUp />, title: 'Margin Optimization', desc: 'Secure financing with competitive loan-to-value ratios and flexible repayment terms.' },
            { icon: <Shield />, title: 'Risk Management', desc: 'Structured solutions to protect against market volatility while maintaining equity exposure.' },
            { icon: <Briefcase />, title: 'Corporate Solutions', desc: 'Financing for corporate stock repossession, ESOP funding, and strategic equity maneuvers.' },
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
                            <ProtectedFormSection serviceName="Share Financing">
                                <DynamicServiceForm
                                    serviceId="share-financing"
                                    title="Inquire About Share Financing"
                                />
                            </ProtectedFormSection>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShareFinancing;
