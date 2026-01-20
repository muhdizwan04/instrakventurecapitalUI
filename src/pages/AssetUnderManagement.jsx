import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { CheckCircle, Building2, Users, Briefcase, Shield, Globe, BarChart3, Target, TrendingUp, Lock, Eye, ArrowRight, Loader2 } from 'lucide-react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageContent } from '../hooks/usePageContent';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedFormSection from '../components/ProtectedFormSection';

const AssetUnderManagement = () => {
    const [formData, setFormData] = useState({
        // Section A
        legalName: '',
        country: '',
        clientClassification: 'Institution',
        primaryContact: '',
        email: '',
        phone: '',
        // Section B
        beneficialOwners: '',
        isDecisionMaker: 'Yes',
        approvingAuthority: '',
        isBoardInvolved: 'No',
        approvalTimeline: '',
        // Section C
        aumSize: '',
        mandateType: 'Discretionary',
        primaryObjective: 'Growth',
        investmentHorizon: '3-5 Years',
        riskProfile: 'Balanced',
        // Section D
        preferredAssets: [],
        geographicFocus: '',
        liquidityRequirements: '',
        // Section E
        sourceOfFunds: '',
        jurisdictionOfFunds: '',
        hasRestrictions: 'No',
        isPep: 'No',
        isNotIllicit: false,
        // Section F
        collaborationInterests: [],
        // Declaration
        declarationConfirmed: false
    });
    const { submitForm, loading } = useFormSubmit('aum');

    const defaultContent = {
        title: 'ASSET UNDER MANAGEMENT (AUM)',
        subtitle: '',
        introduction: 'Partner with Instrak Venture Capital Berhad to optimise capital and enhance portfolio performance. We provide exclusive, mandate-driven asset management services tailored for corporations, institutional investors, and family offices, ensuring alignment with strategic priorities and long-term value creation.',
        philosophy: [
            { title: 'Institutional Rigour', desc: 'Decisions guided by robust governance and analytical frameworks.' },
            { title: 'Global Insight', desc: 'Access to diverse markets, alternative investments, and strategic opportunities.' },
            { title: 'Tailored Solutions', desc: 'Portfolios designed to reflect objectives, risk appetite, and time horizon.' },
            { title: 'Alignment of Interests', desc: 'Mandate structures ensure client objectives remain central.' }
        ],
        services: [
            { title: 'Portfolio Management', desc: 'Multi-asset strategies, risk-adjusted returns, diversification across public, private, and alternative assets.' },
            { title: 'Capital Structuring & Deployment', desc: 'Balance sheet optimisation, bespoke financing, strategic allocation.' },
            { title: 'Institutional Advisory', desc: 'M&A guidance, exclusive opportunities, risk & regulatory advisory.' },
            { title: 'Reporting & Transparency', desc: 'Regular performance reports, governance dashboards, full compliance oversight.' }
        ],
        whoWeServe: [
            { title: 'Global Corporations', desc: 'Capital optimisation & strategic deployment.' },
            { title: 'Institutional Investors', desc: 'Pension funds, endowments, sovereign wealth funds.' },
            { title: 'Family Offices & UHNWIs', desc: 'Wealth preservation, growth, bespoke investment solutions.' },
            { title: 'Shareholders & Principals', desc: 'Structured instruments, Stock Loans.' }
        ],
        approach: [
            { title: 'Understanding Objectives', desc: 'Consultation to identify goals, risk tolerance, and strategic priorities.' },
            { title: 'Bespoke Mandates', desc: 'Tailored investment strategies & financing solutions.' },
            { title: 'Execution Excellence', desc: 'Leverage global networks & proprietary frameworks.' },
            { title: 'Ongoing Stewardship', desc: 'Continuous monitoring, governance reporting, proactive adjustments.' }
        ],
        whyChoose: [
            { title: 'Global Reach', desc: 'Access to international markets & opportunities.' },
            { title: 'Institutional Discipline', desc: 'Structured governance & risk management.' },
            { title: 'High-Touch Service', desc: 'Dedicated portfolio teams for every client.' },
            { title: 'Confidentiality & Trust', desc: 'Strict fiduciary standards & privacy.' }
        ],
        disclaimer: 'IVC provides information for general purposes only. This does not constitute an offer, solicitation, or recommendation for investment. Engagements are subject to formal mandate agreements, regulatory approvals, and professional due diligence. Only institutional investors, corporations, shareholders, or high-net-worth individuals are considered for consultation. All discussions and information shared are strictly confidential.'
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'aum') || defaultContent;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name === 'preferredAssets' || name === 'collaborationInterests') {
                const updatedList = checked
                    ? [...formData[name], value]
                    : formData[name].filter(item => item !== value);
                setFormData({ ...formData, [name]: updatedList });
            } else {
                setFormData({ ...formData, [name]: checked });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.declarationConfirmed || !formData.isNotIllicit) {
            alert('Please confirm all required declarations.');
            return;
        }
        const submitted = await submitForm({
            name: formData.legalName,
            email: formData.email,
            phone: formData.phone,
            companyName: formData.legalName,
            message: `AUM Intake Form Submission. Mandate: ${formData.mandateType}, Profile: ${formData.riskProfile}`,
            subject: 'AUM Client Intake Form'
        }, formData);

        if (submitted) {
            setFormData({
                legalName: '', country: '', clientClassification: 'Institution', primaryContact: '', email: '', phone: '',
                beneficialOwners: '', isDecisionMaker: 'Yes', approvingAuthority: '', isBoardInvolved: 'No', approvalTimeline: '',
                aumSize: '', mandateType: 'Discretionary', primaryObjective: 'Growth', investmentHorizon: '3-5 Years', riskProfile: 'Balanced',
                preferredAssets: [], geographicFocus: '', liquidityRequirements: '',
                sourceOfFunds: '', jurisdictionOfFunds: '', hasRestrictions: 'No', isPep: 'No', isNotIllicit: false,
                collaborationInterests: [], declarationConfirmed: false
            });
        }
    };

    const { content: settings } = usePageContent('global_settings');
    const content = { ...defaultContent, ...pageContent };

    // Dynamic site name replacement
    const siteName = settings?.siteIdentity?.siteName || 'Instrak Venture Capital Berhad';
    const dynamicSubtitle = (content.subtitle || defaultContent.subtitle).replace('Instrak Venture Capital Berhad', siteName);
    const dynamicIntro = (content.introduction || defaultContent.introduction).replace('Instrak Venture Capital Berhad', siteName);
    const dynamicDisclaimer = (content.disclaimer || defaultContent.disclaimer).replace('IVC', settings?.siteIdentity?.siteName ? settings.siteIdentity.siteName.split(' ').map(w => w[0]).join('') : 'IVC');

    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1A365D', fontSize: '0.9rem' };
    const inputStyle = { width: '100%', padding: '0.9rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1rem', color: '#1A365D', background: '#FFFFFF', transition: 'border-color 0.2s' };



    return (
        <div className="page-wrapper">
            <PageHero
                title={content.title}
                subtitle=""
            />

            {/* Introduction */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.15rem', color: '#4A5568', lineHeight: '1.9' }}>
                            {dynamicIntro}
                        </p>
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <h2 className="section-title">Our Philosophy</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        {content.philosophy.map((item, i) => (
                            <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #1A365D 0%, #B8860B 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    {[<Shield key={0} size={28} color="#FFF" />, <Globe key={1} size={28} color="#FFF" />, <Target key={2} size={28} color="#FFF" />, <Users key={3} size={28} color="#FFF" />][i]}
                                </div>
                                <h4 style={{ marginBottom: '0.75rem', color: '#1A365D', fontSize: '1.1rem' }}>{item.title}</h4>
                                <p style={{ color: '#4A5568', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Services */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 className="section-title">Our Services</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                        {content.services.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.5rem', padding: '2rem', background: '#F5F7FA', borderRadius: '12px', border: '1px solid rgba(26, 54, 93, 0.08)' }}>
                                <div style={{ width: '50px', height: '50px', background: '#1A365D', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {[<BarChart3 key={0} size={24} color="#B8860B" />, <TrendingUp key={1} size={24} color="#B8860B" />, <Briefcase key={2} size={24} color="#B8860B" />, <Eye key={3} size={24} color="#B8860B" />][i]}
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem', color: '#1A365D', fontSize: '1.1rem' }}>{item.title}</h4>
                                    <p style={{ color: '#4A5568', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who We Serve */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <h2 className="section-title">Who We Serve</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {content.whoWeServe.map((item, i) => (
                            <div key={i} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', borderLeft: '4px solid #B8860B' }}>
                                <h4 style={{ marginBottom: '0.5rem', color: '#1A365D', fontSize: '1rem' }}>{item.title}</h4>
                                <p style={{ color: '#4A5568', fontSize: '0.9rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Approach */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 className="section-title">Our Approach</h2>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {content.approach.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '40px', height: '40px', background: '#B8860B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '700', flexShrink: 0 }}>
                                    {i + 1}
                                </div>
                                <div style={{ paddingTop: '0.25rem' }}>
                                    <h4 style={{ marginBottom: '0.5rem', color: '#1A365D' }}>{item.title}</h4>
                                    <p style={{ color: '#4A5568', fontSize: '0.95rem' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose IVC */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <h2 className="section-title">Why Choose IVC</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {content.whyChoose.map((item, i) => (
                            <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                                <div style={{ color: '#B8860B', marginBottom: '1rem' }}>
                                    {[<Globe key={0} size={32} />, <Shield key={1} size={32} />, <Users key={2} size={32} />, <Lock key={3} size={32} />][i]}
                                </div>
                                <h4 style={{ marginBottom: '0.5rem', color: '#1A365D', fontSize: '1rem' }}>{item.title}</h4>
                                <p style={{ color: '#4A5568', fontSize: '0.85rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#FFFFFF', fontSize: '2rem', marginBottom: '1rem' }}>Partner with {siteName.split(' ').map(w => w[0]).join('')}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem', lineHeight: '1.8' }}>
                        {siteName.split(' ').map(w => w[0]).join('')} partners selectively. If your organisation or family office seeks to explore a strategic Asset Under Management mandate, we invite you to initiate a confidential discussion.
                    </p>
                    <Link to="/contact" className="btn-solid" style={{ background: '#B8860B', color: '#FFFFFF', padding: '1rem 2.5rem', fontSize: '1rem' }}>
                        Schedule a Consultation
                    </Link>
                </div>
            </section>

            {/* Contact Form */}
            <section id="application-form" style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '2.5rem', color: '#1A365D', marginBottom: '1rem' }}>AUM CLIENT INTAKE FORM & DECLARATION</h2>
                            <p style={{ color: '#B8860B', fontWeight: '600', letterSpacing: '1px' }}>CONFIDENTIAL | INSTITUTIONAL USE ONLY</p>
                            <div style={{ maxWidth: '700px', margin: '1.5rem auto', padding: '1.5rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6' }}>
                                <strong>Purpose Statement:</strong> This document serves as a preliminary assessment tool to evaluate strategic fit, governance readiness, regulatory compliance, and investment alignment for potential Asset Under Management (AUM) mandates with {siteName}.
                            </div>
                        </div>

                        <ProtectedFormSection serviceName="Asset Under Management">
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '3rem' }}>
                                <Toaster position="top-right" />

                                {/* Section A */}
                                <div className="form-section">
                                    <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION A — CLIENT PROFILE</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label style={labelStyle}>Legal Name of Entity / Individual *</label>
                                            <input type="text" name="legalName" value={formData.legalName} onChange={handleChange} style={inputStyle} required />
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Country of Incorporation / Residence *</label>
                                            <input type="text" name="country" value={formData.country} onChange={handleChange} style={inputStyle} required />
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Client Classification *</label>
                                            <select name="clientClassification" value={formData.clientClassification} onChange={handleChange} style={inputStyle}>
                                                <option value="Institution">Institution</option>
                                                <option value="Corporation">Corporation</option>
                                                <option value="Family Office">Family Office</option>
                                                <option value="UHNW / Principal">UHNW / Principal</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Primary Contact Person & Designation *</label>
                                            <input type="text" name="primaryContact" value={formData.primaryContact} onChange={handleChange} style={inputStyle} required />
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
                                </div>

                                {/* Section B */}
                                <div className="form-section">
                                    <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION B — OWNERSHIP & GOVERNANCE</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label style={labelStyle}>Ultimate Beneficial Owner(s) *</label>
                                            <textarea name="beneficialOwners" value={formData.beneficialOwners} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} required />
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Are you the final investment decision-maker? *</label>
                                            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input type="radio" name="isDecisionMaker" value="Yes" checked={formData.isDecisionMaker === 'Yes'} onChange={handleChange} /> Yes
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input type="radio" name="isDecisionMaker" value="No" checked={formData.isDecisionMaker === 'No'} onChange={handleChange} /> No
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>If No, please specify approving authority</label>
                                            <input type="text" name="approvingAuthority" value={formData.approvingAuthority} onChange={handleChange} style={inputStyle} />
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Board / Investment Committee involved? *</label>
                                            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input type="radio" name="isBoardInvolved" value="Yes" checked={formData.isBoardInvolved === 'Yes'} onChange={handleChange} /> Yes
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input type="radio" name="isBoardInvolved" value="No" checked={formData.isBoardInvolved === 'No'} onChange={handleChange} /> No
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Expected internal approval timeline</label>
                                            <input type="text" name="approvalTimeline" value={formData.approvalTimeline} onChange={handleChange} style={inputStyle} placeholder="e.g. 2-4 weeks" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section C */}
                                <div className="form-section">
                                    <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION C — AUM MANDATE OVERVIEW</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label style={labelStyle}>Indicative AUM Size (USD) *</label>
                                            <input type="text" name="aumSize" value={formData.aumSize} onChange={handleChange} style={inputStyle} required />
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Intended Mandate Type *</label>
                                            <select name="mandateType" value={formData.mandateType} onChange={handleChange} style={inputStyle}>
                                                <option value="Discretionary">Discretionary</option>
                                                <option value="Advisory">Advisory</option>
                                                <option value="Co-Investment">Co-Investment</option>
                                                <option value="Structured">Structured</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Primary Objective *</label>
                                            <select name="primaryObjective" value={formData.primaryObjective} onChange={handleChange} style={inputStyle}>
                                                <option value="Capital Preservation">Capital Preservation</option>
                                                <option value="Growth">Growth</option>
                                                <option value="Income">Income</option>
                                                <option value="Strategic Allocation">Strategic Allocation</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Investment Horizon *</label>
                                            <select name="investmentHorizon" value={formData.investmentHorizon} onChange={handleChange} style={inputStyle}>
                                                <option value="<1 Year">&lt;1 Year</option>
                                                <option value="1–3 Years">1–3 Years</option>
                                                <option value="3–5 Years">3–5 Years</option>
                                                <option value="Long-Term">Long-Term</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Risk Profile *</label>
                                            <select name="riskProfile" value={formData.riskProfile} onChange={handleChange} style={inputStyle}>
                                                <option value="Conservative">Conservative</option>
                                                <option value="Balanced">Balanced</option>
                                                <option value="Growth">Growth</option>
                                                <option value="Opportunistic">Opportunistic</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section D */}
                                <div className="form-section">
                                    <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION D — ASSET & STRATEGY PREFERENCE</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label style={labelStyle}>Preferred Asset Classes (Select all that apply) *</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
                                                {['Public Markets', 'Private Equity', 'Private Credit', 'Structured Finance', 'Special Situations', 'Stock Loan'].map(asset => (
                                                    <label key={asset} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                                        <input type="checkbox" name="preferredAssets" value={asset} checked={formData.preferredAssets.includes(asset)} onChange={handleChange} /> {asset}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Geographic Focus</label>
                                            <input type="text" name="geographicFocus" value={formData.geographicFocus} onChange={handleChange} style={inputStyle} />
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Liquidity Requirements</label>
                                            <input type="text" name="liquidityRequirements" value={formData.liquidityRequirements} onChange={handleChange} style={inputStyle} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section E */}
                                <div className="form-section">
                                    <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION E — COMPLIANCE & SOURCE OF FUNDS</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label style={labelStyle}>Source of Funds (Business / Investment / Treasury / Other) *</label>
                                            <input type="text" name="sourceOfFunds" value={formData.sourceOfFunds} onChange={handleChange} style={inputStyle} required />
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Jurisdiction of Funds *</label>
                                            <input type="text" name="jurisdictionOfFunds" value={formData.jurisdictionOfFunds} onChange={handleChange} style={inputStyle} required />
                                        </div>
                                        <div className="form-group">
                                            <label style={labelStyle}>Any regulatory, legal, or sanction restrictions? *</label>
                                            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input type="radio" name="hasRestrictions" value="Yes" checked={formData.hasRestrictions === 'Yes'} onChange={handleChange} /> Yes
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input type="radio" name="hasRestrictions" value="No" checked={formData.hasRestrictions === 'No'} onChange={handleChange} /> No
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
                                                <input type="checkbox" name="isNotIllicit" checked={formData.isNotIllicit} onChange={handleChange} required />
                                                Confirmation that funds are not derived from illicit activities *
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Section F */}
                                <div className="form-section">
                                    <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION F — STRATEGIC COLLABORATION (OPTIONAL)</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {[
                                            'Capital Deployment',
                                            'Strategic Projects / Joint Ventures',
                                            'Stock Loan / Structured Finance',
                                            'Advisory / Balance Sheet Optimisation',
                                            'Global Network & Deal Access'
                                        ].map(item => (
                                            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', padding: '0.75rem', background: '#F7FAFC', borderRadius: '6px' }}>
                                                <input type="checkbox" name="collaborationInterests" value={item} checked={formData.collaborationInterests.includes(item)} onChange={handleChange} /> {item}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Declaration */}
                                <div className="form-section" style={{ background: '#F0F4F8', padding: '2.5rem', borderRadius: '12px', border: '1px solid #D1D5DB' }}>
                                    <h3 style={{ marginBottom: '1.5rem', color: '#1A365D', textAlign: 'center' }}>CLIENT DECLARATION & ACKNOWLEDGEMENT</h3>
                                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                                        {[
                                            'All information provided is true, complete, and accurate.',
                                            `I understand that ${siteName} operates on a selective, mandate-based model.`,
                                            `${siteName} does not guarantee investment performance or returns.`,
                                            'I consent to full KYC, AML, and regulatory due diligence as required.',
                                            `${siteName} reserves the absolute right to accept or decline any mandate.`
                                        ].map((msg, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#4A5568', lineHeight: '1.5' }}>
                                                <CheckCircle size={18} color="#22C55E" style={{ flexShrink: 0 }} />
                                                {msg}
                                            </div>
                                        ))}
                                    </div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1.5rem', background: '#FFFFFF', borderRadius: '8px', border: '2px solid #1A365D', fontWeight: '700', color: '#1A365D' }}>
                                        <input type="checkbox" name="declarationConfirmed" checked={formData.declarationConfirmed} onChange={handleChange} required />
                                        I ACCEPT THE ABOVE DECLARATIONS & TERMS *
                                    </label>
                                </div>

                                <button className="btn-solid" type="submit" style={{ width: '100%', padding: '1.5rem', fontSize: '1.25rem', background: '#B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                                    {loading ? 'Processing Submission...' : 'Submit Intitutional Inquiry'}
                                </button>
                            </form>
                        </ProtectedFormSection>

                        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#718096' }}>
                            <strong>Legal Disclaimer:</strong> This document is for preliminary assessment purposes only and does not constitute an offer, solicitation, or investment advice.
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section style={{ padding: '40px 20px', background: '#F5F7FA', borderTop: '1px solid rgba(26, 54, 93, 0.1)' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <p style={{ fontSize: '0.8rem', color: '#718096', lineHeight: '1.7', textAlign: 'center', fontStyle: 'italic' }}>
                            {dynamicDisclaimer}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AssetUnderManagement;
