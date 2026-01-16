import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { CheckCircle, Globe, Users, Shield, Target, ArrowRight, FileCheck, Briefcase, TrendingUp, Loader2 } from 'lucide-react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageContent } from '../hooks/usePageContent';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const GlobalInvestmentGateway = () => {
    const [formData, setFormData] = useState({
        // Section A
        companyName: '',
        countryOfIncorporation: '',
        regNumber: '',
        yearEstablished: '',
        website: '',
        industry: '',
        // Section B
        keyManagement: '',
        shareholdingStructure: '',
        beneficialOwners: '',
        isAuthorised: 'Yes',
        // Section C
        businessDescription: '',
        coreProducts: '',
        currentMarkets: '',
        competitiveAdvantage: '',
        // Section D
        capitalRequirement: '',
        capitalPurpose: 'Expansion',
        preferredStructure: 'Equity',
        targetTimeline: '',
        // Section E
        annualRevenue: '',
        profitabilityStatus: 'Growth-stage',
        auditedAvailable: 'No',
        // Section F
        primaryJurisdiction: '',
        hasLegalMatters: 'No',
        amlCompliance: false,
        isPep: 'No',
        // Section G
        subscriptionTier: 'GIG Essential',
        // Section H
        declarationConfirmed: false,
        contactPerson: '',
        email: '',
        phone: ''
    });
    const { submitForm, loading } = useFormSubmit('gig');

    const defaultContent = {
        title: 'Global Investment Gateway (GIG)',
        subtitle: 'A Strategic Capital Access & Global Investor Connectivity Platform by Instrak Venture Capital Berhad',
        executiveOverview: 'Global Investment Gateway (GIG) is an exclusive, subscription-based platform designed to enable qualified companies to gain structured access to global investors, institutional capital providers, family offices, and strategic partners through the international network of Instrak Venture Capital Berhad (IVC). GIG is not an open marketplace, crowdfunding platform, or brokerage service. It operates as a curated, mandate-driven gateway, focused on quality, credibility, and institutional alignment.',
        eligibility: [
            'Legally incorporated and in good standing',
            'Clear, scalable business model',
            'Defined capital or strategic growth objectives',
            'Acceptable governance and management credibility',
            'Agreement to full KYC, AML, and due diligence requirements'
        ],
        valueProposition: [
            'Access to curated global investor networks',
            'Strategic capital positioning and readiness',
            'Targeted investor matching (not mass outreach)',
            'Enhanced global credibility through IVC\'s institutional lens'
        ],
        subscriptionTiers: [
            { tier: 'GIG Essential', price: 'USD __ / year', features: ['Basic investor visibility', 'Profile listing access', 'Quarterly investor updates'] },
            { tier: 'GIG Professional', price: 'USD __ / year', features: ['Enhanced investor access', 'Priority matching', 'Monthly strategic updates', 'Dedicated support'] },
            { tier: 'GIG Institutional', price: 'USD __ / year', features: ['Full institutional access', 'Direct investor introductions', 'Bespoke capital strategy', 'Executive support team'] }
        ],
        disclaimer: 'Confidential | Institutional Use Only. Submission does not constitute an offer, engagement, or guarantee of investor introductions.'
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const { content: settings } = usePageContent('global_settings');
    const pageContent = servicePages.pages?.find(p => p.id === 'gig') || defaultContent;
    const content = { ...defaultContent, ...pageContent };

    // Dynamic site name replacement
    const siteName = settings?.siteIdentity?.siteName || 'Instrak Venture Capital Berhad';
    const dynamicSubtitle = (content.subtitle || defaultContent.subtitle).replace('Instrak Venture Capital Berhad', siteName);
    const dynamicOverview = (content.executiveOverview || defaultContent.executiveOverview).replace('Instrak Venture Capital Berhad', siteName);
    const dynamicOverviewFinal = dynamicOverview.replace('IVC', settings?.siteIdentity?.siteName ? settings.siteIdentity.siteName.split(' ').map(w => w[0]).join('') : 'IVC');
    const dynamicValueProposition = content.valueProposition.map(item => item.replace('IVC', settings?.siteIdentity?.siteName ? settings.siteIdentity.siteName.split(' ').map(w => w[0]).join('') : 'IVC'));

    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1A365D', fontSize: '0.9rem' };
    const inputStyle = { width: '100%', padding: '0.9rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1rem', color: '#1A365D', background: '#FFFFFF', transition: 'border-color 0.2s' };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.declarationConfirmed || !formData.amlCompliance) {
            alert('Please confirm all required declarations and AML compliance.');
            return;
        }
        const submitted = await submitForm({
            name: formData.contactPerson,
            email: formData.email,
            phone: formData.phone,
            companyName: formData.companyName,
            message: `GIG Application Form Submission. Tier: ${formData.subscriptionTier}.`,
            subject: 'GIG Application Form'
        }, formData);

        if (submitted) {
            setFormData({
                companyName: '', countryOfIncorporation: '', regNumber: '', yearEstablished: '', website: '', industry: '',
                keyManagement: '', shareholdingStructure: '', beneficialOwners: '', isAuthorised: 'Yes',
                businessDescription: '', coreProducts: '', currentMarkets: '', competitiveAdvantage: '',
                capitalRequirement: '', capitalPurpose: 'Expansion', preferredStructure: 'Equity', targetTimeline: '',
                annualRevenue: '', profitabilityStatus: 'Growth-stage', auditedAvailable: 'No',
                primaryJurisdiction: '', hasLegalMatters: 'No', amlCompliance: false, isPep: 'No',
                subscriptionTier: 'GIG Essential', declarationConfirmed: false,
                contactPerson: '', email: '', phone: ''
            });
        }
    };



    return (
        <div className="page-wrapper">
            <PageHero
                title={content.title}
                subtitle={dynamicSubtitle}
            />

            {/* Executive Overview */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1A365D', textAlign: 'center' }}>Executive Overview</h2>
                        <p style={{ fontSize: '1.1rem', color: '#4A5568', lineHeight: '1.9', textAlign: 'center' }}>
                            {dynamicOverviewFinal}
                        </p>
                    </div>
                </div>
            </section>

            {/* Eligibility */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1A365D' }}>Eligibility Requirements</h2>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {content.eligibility.map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', color: '#4A5568', lineHeight: '1.6' }}>
                                        <CheckCircle size={20} color="#B8860B" style={{ marginTop: '2px', flexShrink: 0 }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(184, 134, 11, 0.1)', borderRadius: '8px', color: '#1A365D', fontWeight: '500', fontSize: '0.95rem' }}>
                                GIG is selective by design.
                            </p>
                        </div>
                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(26, 54, 93, 0.1)' }}>
                            <h3 style={{ color: '#1A365D', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Value Proposition</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {dynamicValueProposition.map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem', color: '#4A5568' }}>
                                        <div style={{ width: '28px', height: '28px', background: '#1A365D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {[<Globe key={0} size={14} color="#B8860B" />, <Target key={1} size={14} color="#B8860B" />, <Users key={2} size={14} color="#B8860B" />, <TrendingUp key={3} size={14} color="#B8860B" />][i]}
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscription Model */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 className="section-title">Subscription Model</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                        {content.subscriptionTiers.map((tier, i) => (
                            <div key={i} style={{
                                background: i === 2 ? 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)' : '#F5F7FA',
                                padding: '2rem',
                                borderRadius: '12px',
                                border: i === 2 ? 'none' : '1px solid rgba(26, 54, 93, 0.1)',
                                color: i === 2 ? '#FFFFFF' : '#1A365D'
                            }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{tier.tier}</h3>
                                <p style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: i === 2 ? '#B8860B' : '#B8860B' }}>{tier.price}</p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {tier.features.map((feature, j) => (
                                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem', color: i === 2 ? 'rgba(255,255,255,0.9)' : '#4A5568' }}>
                                            <CheckCircle size={16} color={i === 2 ? '#B8860B' : '#22C55E'} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(184, 134, 11, 0.1)', borderRadius: '8px', maxWidth: '700px', margin: '0 auto' }}>
                        <p style={{ color: '#1A365D', fontWeight: '500', margin: 0 }}>
                            ⚠️ Subscription fees grant access, positioning, and process — not guaranteed funding.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#FFFFFF', fontSize: '2rem', marginBottom: '1rem' }}>Ready to Join GIG?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem', lineHeight: '1.8' }}>
                        Companies seeking credible global investor access and disciplined capital engagement are invited to submit an application for Global Investment Gateway (GIG) consideration. Access is subject to assessment and approval.
                    </p>
                    <a href="#application-form" className="btn-solid" style={{ background: '#B8860B', color: '#FFFFFF', padding: '1rem 2.5rem', fontSize: '1rem' }}>
                        Start Application
                    </a>
                </div>
            </section>

            {/* Application Form */}
            <section id="application-form" style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '2.5rem', color: '#1A365D', marginBottom: '1rem' }}>GLOBAL INVESTMENT GATEWAY (GIG)</h2>
                            <h3 style={{ fontSize: '1.25rem', color: '#B8860B', marginBottom: '1rem' }}>Application Form & Eligibility Declaration</h3>
                            <p style={{ color: '#1A365D', fontWeight: '600', letterSpacing: '1px' }}>CONFIDENTIAL | INSTITUTIONAL USE ONLY</p>
                            <div style={{ maxWidth: '700px', margin: '1.5rem auto', padding: '1.5rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6' }}>
                                <strong>Purpose of Application:</strong> This application is intended to assess the applicant’s suitability, credibility, and strategic alignment for participation in the Global Investment Gateway (GIG).
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '3rem' }}>
                            <Toaster position="top-right" />

                            {/* Section A */}
                            <div className="form-section">
                                <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION A — COMPANY PROFILE</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Legal Company Name *</label>
                                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Country of Incorporation *</label>
                                        <input type="text" name="countryOfIncorporation" value={formData.countryOfIncorporation} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Registration Number *</label>
                                        <input type="text" name="regNumber" value={formData.regNumber} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Year Established *</label>
                                        <input type="text" name="yearEstablished" value={formData.yearEstablished} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Website *</label>
                                        <input type="url" name="website" value={formData.website} onChange={handleChange} style={inputStyle} placeholder="https://..." required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Industry / Sector *</label>
                                        <input type="text" name="industry" value={formData.industry} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                </div>
                            </div>

                            {/* Section B */}
                            <div className="form-section">
                                <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION B — MANAGEMENT & OWNERSHIP</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Key Management Personnel (Names & Titles) *</label>
                                        <textarea name="keyManagement" value={formData.keyManagement} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Shareholding Structure *</label>
                                        <textarea name="shareholdingStructure" value={formData.shareholdingStructure} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Ultimate Beneficial Owner(s) *</label>
                                        <textarea name="beneficialOwners" value={formData.beneficialOwners} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Is the applicant authorised to seek investment? *</label>
                                        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input type="radio" name="isAuthorised" value="Yes" checked={formData.isAuthorised === 'Yes'} onChange={handleChange} /> Yes
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input type="radio" name="isAuthorised" value="No" checked={formData.isAuthorised === 'No'} onChange={handleChange} /> No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section C */}
                            <div className="form-section">
                                <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION C — BUSINESS & STRATEGIC OVERVIEW</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Brief Company Description *</label>
                                        <textarea name="businessDescription" value={formData.businessDescription} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Core Products / Services *</label>
                                        <textarea name="coreProducts" value={formData.coreProducts} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Current Markets / Geographical Presence *</label>
                                        <textarea name="currentMarkets" value={formData.currentMarkets} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} required />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Competitive Advantage *</label>
                                        <textarea name="competitiveAdvantage" value={formData.competitiveAdvantage} onChange={handleChange} style={{ ...inputStyle, minHeight: '60px' }} required />
                                    </div>
                                </div>
                            </div>

                            {/* Section D */}
                            <div className="form-section">
                                <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION D — CAPITAL & STRATEGIC OBJECTIVES</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Capital Requirement (Indicative Amount & Currency) *</label>
                                        <input type="text" name="capitalRequirement" value={formData.capitalRequirement} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Purpose of Capital *</label>
                                        <select name="capitalPurpose" value={formData.capitalPurpose} onChange={handleChange} style={inputStyle}>
                                            <option value="Expansion">Expansion</option>
                                            <option value="Working Capital">Working Capital</option>
                                            <option value="M&A">M&A</option>
                                            <option value="Restructuring">Restructuring</option>
                                            <option value="Strategic Growth">Strategic Growth</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Preferred Capital Structure *</label>
                                        <select name="preferredStructure" value={formData.preferredStructure} onChange={handleChange} style={inputStyle}>
                                            <option value="Equity">Equity</option>
                                            <option value="Debt">Debt</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="Strategic Partnership">Strategic Partnership</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Target Timeline *</label>
                                        <input type="text" name="targetTimeline" value={formData.targetTimeline} onChange={handleChange} style={inputStyle} placeholder="e.g. 6-12 months" required />
                                    </div>
                                </div>
                            </div>

                            {/* Section E */}
                            <div className="form-section">
                                <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION E — FINANCIAL & OPERATIONAL STATUS</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Latest Annual Revenue *</label>
                                        <input type="text" name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Profitability Status *</label>
                                        <select name="profitabilityStatus" value={formData.profitabilityStatus} onChange={handleChange} style={inputStyle}>
                                            <option value="Profitable">Profitable</option>
                                            <option value="Break-even">Break-even</option>
                                            <option value="Growth-stage">Growth-stage</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Audited Financial Statements Available? *</label>
                                        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input type="radio" name="auditedAvailable" value="Yes" checked={formData.auditedAvailable === 'Yes'} onChange={handleChange} /> Yes
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input type="radio" name="auditedAvailable" value="No" checked={formData.auditedAvailable === 'No'} onChange={handleChange} /> No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section F */}
                            <div className="form-section">
                                <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION F — COMPLIANCE & REGULATORY</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Primary Jurisdiction(s) of Operation *</label>
                                        <input type="text" name="primaryJurisdiction" value={formData.primaryJurisdiction} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Any regulatory, legal, or litigation matters? *</label>
                                        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input type="radio" name="hasLegalMatters" value="Yes" checked={formData.hasLegalMatters === 'Yes'} onChange={handleChange} /> Yes
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input type="radio" name="hasLegalMatters" value="No" checked={formData.hasLegalMatters === 'No'} onChange={handleChange} /> No
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Politically Exposed Person (PEP) status? *</label>
                                        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input type="radio" name="isPep" value="Yes" checked={formData.isPep === 'Yes'} onChange={handleChange} /> Yes
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input type="radio" name="isPep" value="No" checked={formData.isPep === 'No'} onChange={handleChange} /> No
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: '#FFF5F5', borderRadius: '8px', border: '1px solid #FED7D7', color: '#C53030', fontWeight: '500' }}>
                                            <input type="checkbox" name="amlCompliance" checked={formData.amlCompliance} onChange={handleChange} required />
                                            Confirmation that funds and operations comply with AML laws *
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Section G */}
                            <div className="form-section">
                                <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION G — GIG SUBSCRIPTION INTEREST</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    {['GIG Essential', 'GIG Professional', 'GIG Institutional'].map(tier => (
                                        <label key={tier} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', background: formData.subscriptionTier === tier ? '#F0F4F8' : '#FFFFFF', borderRadius: '8px', border: `2px solid ${formData.subscriptionTier === tier ? '#1A365D' : '#E2E8F0'}`, transition: 'all 0.2s' }}>
                                            <input type="radio" name="subscriptionTier" value={tier} checked={formData.subscriptionTier === tier} onChange={handleChange} />
                                            <span style={{ fontWeight: '600', color: '#1A365D' }}>{tier}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Section H */}
                            <div className="form-section" style={{ background: '#F0F4F8', padding: '2.5rem', borderRadius: '12px', border: '1px solid #D1D5DB' }}>
                                <h3 style={{ marginBottom: '1.5rem', color: '#1A365D', textAlign: 'center' }}>SECTION H — DECLARATION & ACKNOWLEDGEMENT</h3>
                                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                                    {[
                                        'All information provided is accurate and complete.',
                                        'I understand that GIG operates on a subscription and assessment basis.',
                                        `${siteName} does not guarantee capital raising or investor commitments.`,
                                        'I consent to due diligence, KYC, AML, and internal assessment procedures.',
                                        `I understand that acceptance into GIG is at ${siteName}’s sole discretion.`
                                    ].map((msg, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#4A5568', lineHeight: '1.5' }}>
                                            <CheckCircle size={18} color="#22C55E" style={{ flexShrink: 0 }} />
                                            {msg}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Authorised Signatory Name *</label>
                                        <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Title / Designation *</label>
                                        <input type="text" name="designation" onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Email Address *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Contact Number *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} required />
                                    </div>
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1.5rem', background: '#FFFFFF', borderRadius: '8px', border: '2px solid #1A365D', fontWeight: '700', color: '#1A365D' }}>
                                    <input type="checkbox" name="declarationConfirmed" checked={formData.declarationConfirmed} onChange={handleChange} required />
                                    I HEREBY CONFIRM AND ACCEPT THE ABOVE DECLARATION *
                                </label>
                            </div>

                            <button className="btn-solid" type="submit" style={{ width: '100%', padding: '1.5rem', fontSize: '1.25rem', background: '#B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                                {loading ? 'Processing Application...' : <ArrowRight />}
                                {loading ? 'Please Wait...' : 'Submit GIG Application'}
                            </button>
                        </form>

                        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#718096' }}>
                            <strong>Legal Disclaimer:</strong> This application does not constitute an offer, solicitation, or investment advice.
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section style={{ padding: '40px 20px', background: '#F5F7FA', borderTop: '1px solid rgba(26, 54, 93, 0.1)' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <p style={{ fontSize: '0.8rem', color: '#718096', lineHeight: '1.7', textAlign: 'center', fontStyle: 'italic' }}>
                            {content.disclaimer}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GlobalInvestmentGateway;
