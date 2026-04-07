import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageContent } from '../hooks/usePageContent';
import { Toaster } from 'react-hot-toast';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const BusinessFinanceConsulting = () => {
    const [formData, setFormData] = useState({
        fullName: '', email: '', companyName: '', phone: '',
        servicesInterested: '', annualRevenue: '', needs: ''
    });
    const { submitForm, loading } = useFormSubmit('consulting');

    const defaultContent = {
        title: 'BUSINESS FINANCE CONSULTING',
        subtitle: '',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'virtual-cfo') || defaultContent;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitted = await submitForm({
            name: formData.fullName, email: formData.email, phone: formData.phone,
            companyName: formData.companyName, message: formData.needs,
            subject: 'Virtual CFO Consultation Request'
        }, { servicesInterested: formData.servicesInterested, annualRevenue: formData.annualRevenue });
        if (submitted) setFormData({ fullName: '', email: '', companyName: '', phone: '', servicesInterested: '', annualRevenue: '', needs: '' });
    };

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} lightBandIndex={idx} />
            ))}

            {/* Form Section */}
            <StyledFormSection
                serviceId="virtual-cfo"
                serviceName="Business Finance Consulting"
                title="Request a Consultation"
                subtitle="Tell us about your business and we'll connect you with our Virtual CFO team."
                fallbackForm={
                    <form onSubmit={handleSubmit}>
                        <Toaster position="top-right" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Full Name *</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your name" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', fontSize: '0.95rem' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', fontSize: '0.95rem' }} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Company Name *</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your company" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', fontSize: '0.95rem' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+60 12-345-6789" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', fontSize: '0.95rem' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Services Interested In *</label>
                            <select name="servicesInterested" value={formData.servicesInterested} onChange={handleChange} style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', fontSize: '0.95rem', color: '#1A365D' }} required>
                                <option value="">Select a service</option>
                                <option value="strategy">Financial Strategy & Forecasting</option>
                                <option value="budgeting">Budgeting & Cash Flow Management</option>
                                <option value="profitability">Profitability Analysis</option>
                                <option value="investment">Investment Readiness</option>
                                <option value="risk">Risk Assessment</option>
                                <option value="comprehensive">Comprehensive Virtual CFO</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Annual Revenue Range</label>
                            <select name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', fontSize: '0.95rem', color: '#1A365D' }}>
                                <option value="">Select range</option>
                                <option value="<1m">Below RM 1 Million</option>
                                <option value="1-5m">RM 1 - 5 Million</option>
                                <option value="5-20m">RM 5 - 20 Million</option>
                                <option value="20-50m">RM 20 - 50 Million</option>
                                <option value=">50m">Above RM 50 Million</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Tell us about your needs</label>
                            <textarea name="needs" value={formData.needs} onChange={handleChange} rows="4" placeholder="Describe your current challenges and what you hope to achieve..." style={{ width: '100%', padding: '1rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', fontSize: '0.95rem', resize: 'vertical' }}></textarea>
                        </div>
                        <button className="btn-solid" type="submit" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Submitting...' : 'Request Consultation'}</button>
                    </form>
                }
            />
        </div>
    );
};

export default BusinessFinanceConsulting;
