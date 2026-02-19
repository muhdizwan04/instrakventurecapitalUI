import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { Toaster } from 'react-hot-toast';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';
import { usePageContent } from '../hooks/usePageContent';

const RealEstateFinancing = () => {
    const { content: servicePages } = usePageContent('service_pages', { pages: [] });

    const defaultContent = {
        title: 'REAL ESTATE FINANCING',
        subtitle: 'Funding for high-yield property developments and real estate acquisitions.',
        sections: []
    };

    const pageContent = servicePages.pages?.find(p => p.id === 'real-estate-financing') || defaultContent;

    const [formData, setFormData] = useState({
        companyName: '', contactPerson: '', email: '', phone: '', propertyType: '',
        financingType: '', projectLocation: '', projectValue: '', financingRequired: '', description: ''
    });
    const { submitForm, loading } = useFormSubmit('realestate');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitted = await submitForm({
            name: formData.contactPerson, email: formData.email, phone: formData.phone,
            companyName: formData.companyName, message: formData.description,
            subject: 'Real Estate Financing Project'
        }, { propertyType: formData.propertyType, financingType: formData.financingType, projectLocation: formData.projectLocation, projectValue: formData.projectValue, financingRequired: formData.financingRequired });
        if (submitted) setFormData({ companyName: '', contactPerson: '', email: '', phone: '', propertyType: '', financingType: '', projectLocation: '', projectValue: '', financingRequired: '', description: '' });
    };

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} />
            ))}

            {/* Project Submission Form */}
            <StyledFormSection
                serviceId="real-estate-financing"
                serviceName="Real Estate Financing"
                title="Submit Your Project"
                subtitle="Have a real estate project that needs financing? Let's discuss how we can help."
                fallbackForm={
                    <form onSubmit={handleSubmit}>
                        <Toaster position="top-right" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Developer/Company Name *</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company name" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Contact Person *</label>
                                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Your name" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Phone Number *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+60 12-345-6789" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Property Type *</label>
                            <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', color: '#1A365D' }} required>
                                <option value="">Select property type</option>
                                <option value="commercial">Commercial</option>
                                <option value="residential">Residential</option>
                                <option value="mixed">Mixed-Use</option>
                                <option value="industrial">Industrial</option>
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Financing Type *</label>
                                <select name="financingType" value={formData.financingType} onChange={handleChange} style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', color: '#1A365D' }} required>
                                    <option value="">Select type</option>
                                    <option value="development">Development Loan</option>
                                    <option value="bridge">Bridge Financing</option>
                                    <option value="acquisition">Acquisition Capital</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Project Location *</label>
                                <input type="text" name="projectLocation" value={formData.projectLocation} onChange={handleChange} placeholder="City/State" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Project Value (RM) *</label>
                                <input type="text" name="projectValue" value={formData.projectValue} onChange={handleChange} placeholder="Total project value" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Financing Required (RM) *</label>
                                <input type="text" name="financingRequired" value={formData.financingRequired} onChange={handleChange} placeholder="Amount needed" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Project Description *</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe your project including size, timeline, current status, and expected returns..." style={{ width: '100%', padding: '1rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', resize: 'vertical' }} required></textarea>
                        </div>
                        <button className="btn-solid" type="submit" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Submitting...' : 'Submit Project'}</button>
                    </form>
                }
            />
        </div>
    );
};

export default RealEstateFinancing;
