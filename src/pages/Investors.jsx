import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageContent } from '../hooks/usePageContent';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Investors = () => {
    // Default content
    const defaultContent = {
        pageHero: {
            title: 'For Investors',
            subtitle: 'Exclusive opportunities for institutional growth and wealth preservation through strategic capital.'
        },
        mainContent: {
            headline: 'The Institutional Advantage',
            description: 'Instrak Venture Capital Berhad offers qualified investors access to a curated portfolio of high-growth industrial assets in the ASEAN region. Our approach is defined by rigorous due diligence and institutional-grade governance.'
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

    const inputStyle = { width: '100%', padding: '0.9rem', background: '#FFFFFF', border: '1px solid rgba(26, 54, 93, 0.2)', color: '#1A365D', borderRadius: '6px', fontSize: '0.95rem' };
    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#1A365D' };

    // Use loaded content or defaults
    const pageHero = content?.pageHero || defaultContent.pageHero;
    const mainContent = content?.mainContent || defaultContent.mainContent;
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
                subtitle={pageHero.subtitle}
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

                    <div className="glass-card" style={{ padding: '3rem', background: '#FFFFFF', border: '1px solid rgba(26, 54, 93, 0.12)', boxShadow: '0 4px 20px rgba(26, 54, 93, 0.08)' }}>
                        <h3 style={{ marginBottom: '2rem', color: '#1A365D' }}>{formSettings.title}</h3>
                        <form onSubmit={handleSubmit}>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Investors;
