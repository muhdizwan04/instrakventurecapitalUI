import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { Building2, Landmark, Home, Factory, CheckCircle } from 'lucide-react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { Toaster } from 'react-hot-toast';

const RealEstateFinancing = () => {
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
    const financingTypes = [
        { icon: <Building2 />, title: 'Development Loans', desc: 'Capital for new property development projects from land acquisition to completion.' },
        { icon: <Landmark />, title: 'Bridge Financing', desc: 'Short-term funding to bridge gaps between property transactions.' },
        { icon: <Home />, title: 'Acquisition Capital', desc: 'Financing for purchasing existing commercial and residential properties.' },
        { icon: <Factory />, title: 'Industrial Real Estate', desc: 'Specialized funding for warehouses, factories, and logistics facilities.' },
    ];

    const propertyTypes = [
        { type: 'Commercial', examples: 'Office buildings, retail spaces, shopping centers' },
        { type: 'Residential', examples: 'Condominiums, apartments, housing developments' },
        { type: 'Mixed-Use', examples: 'Integrated developments, township projects' },
        { type: 'Industrial', examples: 'Warehouses, manufacturing plants, logistics hubs' },
    ];

    const loanTerms = [
        { label: 'Loan-to-Value (LTV)', value: 'Up to 70%' },
        { label: 'Interest Rate', value: 'From 6.5% p.a.' },
        { label: 'Loan Tenure', value: '12 - 60 months' },
        { label: 'Minimum Loan', value: 'RM 1 Million' },
        { label: 'Maximum Loan', value: 'RM 100 Million' },
    ];

    return (
        <div className="page-wrapper">
            <PageHero 
                title="Real Estate Financing" 
                subtitle="Funding for high-yield property developments and real estate acquisitions."
            />
            
            {/* Financing Types */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 className="section-title">Financing Solutions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {financingTypes.map((item, i) => (
                            <div key={i} className="glass-card">
                                <div style={{ color: '#B8860B', marginBottom: '1rem' }}>{item.icon}</div>
                                <h4 style={{ marginBottom: '0.75rem', color: '#1A365D' }}>{item.title}</h4>
                                <p style={{ color: '#4A5568', fontSize: '0.95rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Property Types & Terms */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1A365D' }}>Property Types We Finance</h2>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {propertyTypes.map((item, i) => (
                                    <div key={i} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', border: '1px solid rgba(26, 54, 93, 0.08)' }}>
                                        <h4 style={{ marginBottom: '0.5rem', color: '#1A365D', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CheckCircle size={18} color="#B8860B" />
                                            {item.type}
                                        </h4>
                                        <p style={{ color: '#4A5568', fontSize: '0.9rem', paddingLeft: '1.6rem' }}>{item.examples}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1A365D' }}>Loan Terms</h2>
                            <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(26, 54, 93, 0.08)' }}>
                                {loanTerms.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: i < loanTerms.length - 1 ? '1px solid rgba(26, 54, 93, 0.08)' : 'none' }}>
                                        <span style={{ color: '#4A5568' }}>{item.label}</span>
                                        <span style={{ fontWeight: '600', color: '#B8860B' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#718096', fontStyle: 'italic' }}>
                                * Terms are indicative and subject to project evaluation and approval.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Submission Form */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1A365D' }}>Submit Your Project</h2>
                        <p style={{ textAlign: 'center', color: '#4A5568', marginBottom: '3rem' }}>
                            Have a real estate project that needs financing? Let's discuss how we can help.
                        </p>
                        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(26, 54, 93, 0.1)', boxShadow: '0 4px 20px rgba(26, 54, 93, 0.08)' }}>
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
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RealEstateFinancing;
