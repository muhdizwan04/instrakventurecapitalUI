import React from 'react';
import PageHero from '../components/PageHero';
import { Coins, Shield, Globe, TrendingUp, Cpu, CheckCircle } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { isSectionVisible } from '../utils/sectionVisibility';
import ProtectedFormSection from '../components/ProtectedFormSection';
import DynamicServiceForm from '../components/DynamicServiceForm';

const Tokenization = () => {
    // Fetch content from admin
    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const serviceData = servicePages.pages?.find(p => p.id === 'tokenization');

    // Default data as fallback
    const defaultData = {
        title: 'TOKENIZATION',
        subtitle: 'Digital asset tokenization solutions for modern investment structures.',
        introduction: 'Digital asset tokenization solutions for modern investment structures. Fractionalize and digitize value through our institutional-grade tokenization platform, enabling liquidity and accessibility for traditionally illiquid assets.',
        overview: {
            heading: 'Digital Asset Tokenization',
            description: 'Fractionalize and digitize value through our institutional-grade tokenization platform.'
        },
        services: [
            { icon: <Cpu />, title: 'Asset Digitization', desc: 'Convert physical or traditional assets into secure digital tokens on the blockchain.' },
            { icon: <TrendingUp />, title: 'Fractional Ownership', desc: 'Enable smaller investment increments to increase market participation and liquidity.' },
            { icon: <Shield />, title: 'Compliant Structure', desc: 'Rigorous regulatory adherence and smart contract security for peace of mind.' },
            { icon: <Globe />, title: 'Global Accessibility', desc: 'Connect with a worldwide network of investors through digital marketplaces.' },
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
                            <ProtectedFormSection serviceName="Tokenization">
                                <DynamicServiceForm
                                    serviceId="tokenization"
                                    title="Inquire About Tokenization Solutions"
                                />
                            </ProtectedFormSection>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Tokenization;
