import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageContent } from '../hooks/usePageContent';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import ProtectedFormSection from '../components/ProtectedFormSection';

const Investors = () => {
    // Default content
    const defaultContent = {
        pageHero: {
            title: 'FOR INVESTORS',
            subtitle: '',
            styles: { titleColor: '#FFFFFF', textAlign: 'center', bgColor: '#0b1120' }
        },
        mainContent: {
            headline: 'The Institutional Advantage',
            description: 'Instrak Venture Capital Berhad offers qualified investors access to a curated portfolio of high-growth industrial assets in the ASEAN region. Our approach is defined by rigorous due diligence and institutional-grade governance.'
        },
        onboarding: {
            title: 'Investor Onboarding Workflow',
            subtitle: 'A clear, institutional journey from registration to reporting.',
            steps: [
                {
                    id: 'step-1',
                    title: 'Step 1 — Investor Registration',
                    description: 'Submit basic investor and organisation information to initiate the relationship.'
                },
                {
                    id: 'step-2',
                    title: 'Step 2 — AI Investor Profiling',
                    description: 'We collect investment ticket size, risk tolerance, sector preferences, and geographic focus.'
                },
                {
                    id: 'step-3',
                    title: 'Step 3 — Compliance Verification',
                    description: 'Institutional KYC and AML checks to verify identity, source of funds, and regulatory eligibility.'
                },
                {
                    id: 'step-4',
                    title: 'Step 4 — Secure Investor Portal',
                    description: 'Approved investors receive access to a secure deal room, curated opportunities, and key reports.'
                },
                {
                    id: 'step-5',
                    title: 'Step 5 — Capital Allocation',
                    description: 'Investor selects funds, projects, and investment programmes aligned to their mandate.'
                },
                {
                    id: 'step-6',
                    title: 'Step 6 — Portfolio Dashboard',
                    description: 'View capital deployed, performance reports, and institutional updates in one dashboard.'
                }
            ]
        },
        portfolioSection: {
            title: 'Institutional Portfolio',
            items: [
                { id: 'port-1', text: 'Energy & Infrastructure' },
                { id: 'port-2', text: 'Advanced Manufacturing' },
                { id: 'port-3', text: 'Logistics & Distribution' }
            ]
        },
        formSettings: {
            title: 'Investment Inquiry',
            submitButtonText: 'Submit Inquiry',
            interestOptions: ['Investment', 'Loan', 'Partnership', 'Others']
        }
    };

    const { content, loading: contentLoading } = usePageContent('investors', defaultContent);
    const { content: settings } = usePageContent('global_settings');

    const mainDescription = settings?.siteIdentity?.siteName
        ? content.mainContent?.description?.replace('Instrak Venture Capital Berhad', settings.siteIdentity.siteName) || defaultContent.mainContent.description.replace('Instrak Venture Capital Berhad', settings.siteIdentity.siteName)
        : content?.mainContent?.description || defaultContent.mainContent.description;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        companyWebsite: '',
        interestType: 'Investment',
        message: ''
    });
    const { submitForm, loading } = useFormSubmit('investor');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitted = await submitForm({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            companyName: formData.companyName,
            subject: `Investment Inquiry - ${formData.interestType}`,
            message: formData.message
        }, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyWebsite: formData.companyWebsite,
            interestType: formData.interestType
        });
        if (submitted) {
            setFormData({
                firstName: '', lastName: '', email: '', phone: '',
                companyName: '', companyWebsite: '', interestType: 'Investment', message: ''
            });
        }
    };

    const inputStyle = { width: '100%', padding: '0.9rem', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#F1F5F9', borderRadius: '8px', fontSize: '0.95rem' };
    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'rgba(241, 245, 249, 0.95)' };

    // Use loaded content or defaults
    const pageHero = content?.pageHero || defaultContent.pageHero;
    const mainContent = content?.mainContent || defaultContent.mainContent;
    const onboarding = content?.onboarding || defaultContent.onboarding;
    const portfolioSection = content?.portfolioSection || defaultContent.portfolioSection;
    const formSettings = content?.formSettings || defaultContent.formSettings;

    if (contentLoading) {
        return (
            <div className="page-wrapper flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={48} />
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Toaster position="top-right" />
            <PageHero
                title={pageHero.title}
                subtitle={pageHero.subtitle || ''}
                style={{ backgroundColor: pageHero.styles?.bgColor }}
                sectionStyles={{
                    titleColor: pageHero.styles?.titleColor,
                    titleAlign: pageHero.styles?.textAlign,
                    textAlign: pageHero.styles?.textAlign,
                    subtitleColor: pageHero.styles?.titleColor
                }}
                textColor={pageHero.styles?.titleColor}
            />
            <div className="container" style={{ padding: '80px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'start' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{mainContent.headline}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                            {mainDescription}
                        </p>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>{portfolioSection.title}</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                                {portfolioSection.items.map(item => (
                                    <li key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                                        <span style={{ color: 'var(--text-secondary)' }}>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '3rem', background: 'rgba(15, 23, 42, 0.42)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(148, 163, 184, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }}>
                        <ProtectedFormSection>
                            <>
                            <h3 style={{ marginBottom: '2rem', color: '#F1F5F9' }}>{formSettings.title}</h3>
                            <form className="investors-form-glass" onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" style={inputStyle} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" style={inputStyle} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Company Website</label>
                                    <input type="text" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="Company Website" style={inputStyle} required />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Nature of Interest</label>
                                <select name="interestType" value={formData.interestType} onChange={handleChange} style={inputStyle} required>
                                    {formSettings.interestOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={labelStyle}>Other Details / Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="How can we assist you today?" style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                            </div>
                            <button className="btn-solid" type="submit" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                                {loading ? 'Submitting...' : formSettings.submitButtonText}
                            </button>
                            </form>
                            </>
                        </ProtectedFormSection>
                    </div>
                </div>

                {onboarding && Array.isArray(onboarding.steps) && onboarding.steps.length > 0 && (
                    <div style={{ marginTop: '4rem' }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{onboarding.title}</h3>
                        {onboarding.subtitle && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', maxWidth: '720px' }}>
                                {onboarding.subtitle}
                            </p>
                        )}
                        <div
                            style={{
                                marginTop: '2rem',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '1.5rem'
                            }}
                        >
                            {onboarding.steps.map((step, idx) => (
                                <div
                                    key={step.id || idx}
                                    className="glass-card"
                                    style={{
                                        padding: '1.5rem',
                                        borderRadius: '1rem',
                                        border: '1px solid rgba(148,163,184,0.35)',
                                        background: 'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))',
                                        boxShadow: '0 10px 30px rgba(15,23,42,0.55)'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '999px',
                                            background: 'rgba(248, 250, 252, 0.06)',
                                            border: '1px solid rgba(250, 204, 21, 0.7)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#facc15',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            marginBottom: '0.75rem'
                                        }}
                                    >
                                        {idx + 1}
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.5rem' }}>
                                        {step.title}
                                    </h4>
                                    {step.description && (
                                        <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: '1.6' }}>
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Investors;
