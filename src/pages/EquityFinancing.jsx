import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { Toaster } from 'react-hot-toast';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';
import { usePageContent } from '../hooks/usePageContent';

const EquityFinancing = () => {
    const { content: servicePages } = usePageContent('service_pages', { pages: [] });

    const defaultContent = {
        title: 'Equity Financing (EF)',
        subtitle: 'Strategic growth through equity investment and merger assistance.',
        sections: []
    };

    const pageContent = servicePages.pages?.find(p => p.id === 'equity-financing') || defaultContent;

    const [formData, setFormData] = useState({
        companyName: '', industrySector: '', founderName: '', email: '',
        annualRevenue: '', fundingSought: '', lookingFor: '', companyOverview: '', pitchDeckUrl: ''
    });
    const { submitForm, loading } = useFormSubmit('equity');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitted = await submitForm({
            name: formData.founderName, email: formData.email,
            companyName: formData.companyName, message: formData.companyOverview,
            subject: 'Equity Financing Letter of Intent'
        }, { industrySector: formData.industrySector, annualRevenue: formData.annualRevenue, fundingSought: formData.fundingSought, lookingFor: formData.lookingFor, pitchDeckUrl: formData.pitchDeckUrl });
        if (submitted) setFormData({ companyName: '', industrySector: '', founderName: '', email: '', annualRevenue: '', fundingSought: '', lookingFor: '', companyOverview: '', pitchDeckUrl: '' });
    };

    const sectors = ['Oil & Gas', 'Property Development', 'Education', 'Logistics', 'Automotive', 'Manufacturing', 'Construction', 'Digital Technology'];

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} lightBandIndex={idx} />
            ))}

            {/* Pitch Form */}
            <StyledFormSection
                serviceId="equity-financing"
                serviceName="Equity Financing"
                title="Pitch Your Company"
                subtitle="Interested in equity partnership or M&A advisory? Send your Letter of Intent (LOI) to begin the process."
                fallbackForm={
                    <form onSubmit={handleSubmit}>
                        <Toaster position="top-right" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Company Name *</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your company" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Industry/Sector *</label>
                                <select name="industrySector" value={formData.industrySector} onChange={handleChange} style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', color: '#1A365D' }} required>
                                    <option value="">Select sector</option>
                                    {sectors.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Founder/CEO Name *</label>
                                <input type="text" name="founderName" value={formData.founderName} onChange={handleChange} placeholder="Your name" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Annual Revenue (USD) *</label>
                                <input type="text" name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} placeholder="Current annual revenue" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Funding Sought (USD)</label>
                                <input type="text" name="fundingSought" value={formData.fundingSought} onChange={handleChange} placeholder="Up to USD 100 Million" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>What are you looking for? *</label>
                            <select name="lookingFor" value={formData.lookingFor} onChange={handleChange} style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', color: '#1A365D' }} required>
                                <option value="">Select option</option>
                                <option value="equity">Equity Investment (Up to USD 100M)</option>
                                <option value="ma-sell">M&A - Sell-side Advisory</option>
                                <option value="ma-buy">M&A - Buy-side Advisory</option>
                                <option value="ipo">IPO Preparation & Listing</option>
                                <option value="due-diligence">Due Diligence & Valuation</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Company Overview / Letter of Intent *</label>
                            <textarea name="companyOverview" value={formData.companyOverview} onChange={handleChange} rows="4" placeholder="Tell us about your company, business model, competitive advantages, growth plans, and investment objectives..." style={{ width: '100%', padding: '1rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', resize: 'vertical' }} required></textarea>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Pitch Deck URL (Optional)</label>
                            <input type="url" name="pitchDeckUrl" value={formData.pitchDeckUrl} onChange={handleChange} placeholder="Link to your pitch deck (Google Drive, Dropbox, etc.)" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} />
                        </div>
                        <button className="btn-solid" type="submit" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Submitting...' : 'Submit Letter of Intent'}</button>
                        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#718096' }}>
                            Or email directly to: <a href="mailto:kahar@instrakventurecapital.com" style={{ color: '#B8860B', fontWeight: '600' }}>kahar@instrakventurecapital.com</a>
                        </p>
                    </form>
                }
            />
        </div>
    );
};

export default EquityFinancing;
