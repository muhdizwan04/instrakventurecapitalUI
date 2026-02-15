import React from 'react';
import PageHero from '../components/PageHero';
import { Users, TrendingUp, Search, Briefcase, Target, CheckCircle } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import ProtectedFormSection from '../components/ProtectedFormSection';
import DynamicServiceForm from '../components/DynamicServiceForm';

const MergerAcquisition = () => {
    // Fetch content from admin
    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const serviceData = servicePages.pages?.find(p => p.id === 'merger-acquisition');

    // Default data as fallback
    const defaultData = {
        title: 'MERGER & ACQUISITION (M&A)',
        subtitle: 'Expert guidance through complex M&A transactions, negotiations, and strategic integrations.',
        introduction: 'Expert guidance through complex M&A transactions, negotiations, and strategic integrations. Our dedicated team provides end-to-end support for companies seeking to scale through acquisition or realize value through strategic divestiture.',
        overview: {
            heading: 'Expert M&A Advisory',
            description: 'Strategize and execute complex transactions with our experienced M&A team.'
        },
        services: [
            { icon: <Target />, title: 'Sell-Side Advisory', desc: 'Maximize value and ensure smooth transitions through structured exit strategies.' },
            { icon: <Search />, title: 'Buy-Side Advisory', desc: 'Identify and execute strategic acquisitions to fuel inorganic growth.' },
            { icon: <Briefcase />, title: 'Transaction Support', desc: 'Comprehensive due diligence and negotiation leadership for successful outcomes.' },
            { icon: <TrendingUp />, title: 'Integration Planning', desc: 'Ensure post-merger success with detailed operational and cultural integration.' },
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
                            <ProtectedFormSection serviceName="Merger & Acquisition">
                                <DynamicServiceForm
                                    serviceId="merger-acquisition"
                                    title="Inquire About M&A Advisory"
                                />
                            </ProtectedFormSection>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MergerAcquisition;
