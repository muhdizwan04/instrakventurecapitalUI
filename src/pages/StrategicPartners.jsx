import React from 'react';
import PageHero from '../components/PageHero';
import { Shield, Handshake, Building2, Globe, Award } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

const StrategicPartners = () => {
    // Default data (fallback)
    const defaultData = {
        pageHeader: {
            title: 'Strategic Partners & Trust',
            subtitle: 'Building institutional excellence through trusted partnerships and governance.'
        },
        partners: [{
            id: 'p-1',
            category: 'Insurance Partner',
            name: 'Chubb International Insurance',
            logo: '',
            description: 'Global insurance coverage for fund protection and trade credit insurance.',
            partnership: 'Protection of funds through comprehensive insurance policies'
        }],
        banks: [
            {
                id: 'b-1',
                name: 'Maybank Berhad',
                role: 'Origin Bank & Trustees',
                branch: 'Mid Valley Branch',
                swift: 'MBBEMYKL (MT103)',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Maybank_Logo.svg/2560px-Maybank_Logo.svg.png',
                description: 'Primary banking partner for fund management and payment control through Maybank Trustees.'
            },
            {
                id: 'b-2',
                name: 'Emirates Islamic Bank',
                role: 'Nominated Trustees Bank',
                location: 'Dubai, UAE',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Emirates_Islamic_Logo.png',
                description: 'International banking partner for offshore fund management via INSTRAK Project Management Services Est.'
            }
        ],
        trustContent: {
            title: 'Governance & Compliance',
            description: 'All fund management and investment activities are conducted under strict regulatory oversight and compliance with Malaysian financial regulations.',
            regulators: [
                { id: 1, title: 'Securities Commission', subtitle: 'Malaysia (SC)' },
                { id: 2, title: 'Central Bank', subtitle: 'Bank Negara Malaysia' },
                { id: 3, title: 'Trade Credit Insurance', subtitle: 'Fund Protection' }
            ]
        },
        customSections: []
    };

    const { content } = usePageContent('partners', defaultData);
    const pageHeader = content.pageHeader || defaultData.pageHeader;
    const partners = content.partners || defaultData.partners;
    const banks = content.banks || defaultData.banks;
    const trustContent = content.trustContent || defaultData.trustContent;
    const customSections = content.customSections || [];

    const highlights = [
        { icon: <Shield />, title: 'USD 1 Billion', desc: 'Investment commitment signed with strategic partners' },
        { icon: <Handshake />, title: 'Insurance Coverage', desc: 'Chubb International for fund protection' },
        { icon: <Building2 />, title: 'Maybank Trustees', desc: 'Controlled payment and fund management' },
        { icon: <Globe />, title: 'Global Reach', desc: 'International banking through Dubai UAE' },
    ];

    return (
        <div className="page-wrapper">
            <PageHero
                title={pageHeader.title}
                subtitle={pageHeader.subtitle}
            />

            {/* Highlights */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        {highlights.map((item, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '2rem', background: '#F5F7FA', borderRadius: '12px' }}>
                                <div style={{ color: '#B8860B', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', color: '#1A365D', marginBottom: '0.5rem' }}>{item.title}</h3>
                                <p style={{ color: '#4A5568', fontSize: '0.9rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Investment Signed */}
            <section style={{ padding: '80px 20px', background: '#1A365D' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <Award size={48} style={{ color: '#B8860B', marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>USD 1 Billion Investment Signed</h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
                            INSTRAK Venture Capital Berhad has secured strategic investment commitments to support project financing and equity investments across the ASEAN region.
                        </p>
                    </div>
                </div>
            </section>

            {/* Insurance Partner */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 className="section-title">Insurance Partner</h2>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {partners.map((partner, i) => (
                            <div key={partner.id || i} className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                                {partner.logo ? (
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        style={{
                                            maxWidth: '160px',
                                            height: 'auto',
                                            margin: '0 auto 1.5rem',
                                            display: 'block'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        background: 'linear-gradient(135deg, #1A365D, #2D5A8B)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                        color: 'white',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        padding: '1rem',
                                        textAlign: 'center'
                                    }}>
                                        CHUBB
                                    </div>
                                )}
                                <h3 style={{ fontSize: '1.8rem', color: '#1A365D', marginBottom: '0.75rem' }}>{partner.name}</h3>
                                <p style={{ color: '#B8860B', fontWeight: '600', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>{partner.category}</p>
                                <p style={{ color: '#4A5568', lineHeight: '1.7', marginBottom: '1rem' }}>{partner.description}</p>
                                <div style={{ padding: '1rem', background: '#F5F7FA', borderRadius: '8px', borderLeft: '4px solid #B8860B' }}>
                                    <p style={{ color: '#4A5568', fontSize: '0.9rem', fontStyle: 'italic' }}>{partner.partnership}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Banking Partners */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <h2 className="section-title">Banking Partners</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                        {banks.map((bank, i) => (
                            <div key={bank.id || i} className="glass-card" style={{ padding: '2rem' }}>
                                {bank.logo ? (
                                    <img
                                        src={bank.logo}
                                        alt={bank.name}
                                        style={{
                                            maxWidth: '100px',
                                            height: '50px',
                                            objectFit: 'contain',
                                            marginBottom: '1.5rem'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: i === 0 ? '#FFCC00' : '#006747',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem',
                                        color: i === 0 ? '#1A365D' : 'white',
                                        fontWeight: '700',
                                        fontSize: '0.7rem'
                                    }}>
                                        {i === 0 ? 'MAYBANK' : 'EIB'}
                                    </div>
                                )}
                                <h3 style={{ fontSize: '1.3rem', color: '#1A365D', marginBottom: '0.5rem' }}>{bank.name}</h3>
                                <p style={{ color: '#B8860B', fontWeight: '600', fontSize: '0.85rem', marginBottom: '1rem' }}>{bank.role}</p>
                                {bank.branch && (
                                    <p style={{ color: '#4A5568', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        <strong>Branch:</strong> {bank.branch}
                                    </p>
                                )}
                                {bank.swift && (
                                    <p style={{ color: '#4A5568', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        <strong>SWIFT:</strong> {bank.swift}
                                    </p>
                                )}
                                {bank.location && (
                                    <p style={{ color: '#4A5568', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        <strong>Location:</strong> {bank.location}
                                    </p>
                                )}
                                {bank.description && (
                                    <p style={{ color: '#4A5568', fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.6' }}>{bank.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Governance */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1A365D' }}>{trustContent.title}</h2>
                        <p style={{ color: '#4A5568', lineHeight: '1.8', marginBottom: '2rem' }}>
                            {trustContent.description}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            {trustContent.regulators.map((reg, i) => (
                                <div key={reg.id || i} style={{ padding: '1.5rem', background: '#F5F7FA', borderRadius: '8px' }}>
                                    <h4 style={{ color: '#1A365D', marginBottom: '0.5rem' }}>{reg.title}</h4>
                                    <p style={{ color: '#4A5568', fontSize: '0.85rem' }}>{reg.subtitle}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Sections */}
            {customSections.length > 0 && (
                <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                    <div className="container">
                        {customSections.map((sec) => (
                            <div key={sec.id} style={{ maxWidth: '800px', margin: '0 auto 4rem', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1A365D' }}>{sec.title}</h2>
                                <p style={{ color: '#4A5568', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{sec.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default StrategicPartners;
