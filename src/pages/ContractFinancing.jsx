import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { FileText, Clock, Shield, Banknote, CheckCircle, Building2, Globe, Landmark, Users } from 'lucide-react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { Toaster } from 'react-hot-toast';

const ContractFinancing = () => {
    const [formData, setFormData] = useState({
        companyName: '', registrationNo: '', contactPerson: '', email: '',
        contractAwarderType: '', contractValue: '', financingNeeded: '', description: ''
    });
    const { submitForm, loading } = useFormSubmit('contract');
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitted = await submitForm({
            name: formData.contactPerson, email: formData.email,
            companyName: formData.companyName, message: formData.description,
            subject: 'Contract Financing Application'
        }, { registrationNo: formData.registrationNo, contractAwarderType: formData.contractAwarderType, contractValue: formData.contractValue, financingNeeded: formData.financingNeeded });
        if (submitted) setFormData({ companyName: '', registrationNo: '', contactPerson: '', email: '', contractAwarderType: '', contractValue: '', financingNeeded: '', description: '' });
    };
    const eligibleAwarders = [
        { icon: <Landmark />, title: 'Government Agencies', desc: 'State and Federal government contracts' },
        { icon: <Building2 />, title: 'Government-Linked Companies', desc: 'GLCs with established track records' },
        { icon: <Globe />, title: 'Multi-National Companies', desc: 'MNCs with proven payment history' },
        { icon: <Users />, title: 'Reputable Entities', desc: 'Entities with proven paymaster credentials' },
    ];

    const benefits = [
        { icon: <Shield />, title: 'Secured Financing', desc: 'Your contract serves as collateral with assigned payment through Maybank Trustees.' },
        { icon: <FileText />, title: 'Performance Guarantee', desc: 'Bank Guarantee (BG) or Bank Acceptance (BA) for contract assignments.' },
        { icon: <Banknote />, title: 'Assigned Payment', desc: 'All payments from paymaster are assigned directly to Maybank Trustees headed by INSTRAKVC.' },
        { icon: <Landmark />, title: 'Full Payment Control', desc: 'No cash transactions allowed - all payments via controlled banking accounts for security.' },
    ];


    const eligibility = [
        'Valid government, GLC, MNC, or reputable corporate contract',
        'Contract with guaranteed payment by reputable paymaster',
        'International trades with Bank Acceptance (BA) eligible',
        'Registered Malaysian company with clean financial record',
        'Assigned payment capability through banking trustees',
        'No cash transactions - all payments via controlled accounts',
    ];

    const processSteps = [
        { num: 'P1', title: 'Document Submission', desc: 'Submit contract documents, Letter of Award (LA), and Purchase Order (PO)' },
        { num: 'P2', title: 'Credit Evaluation', desc: 'INSTRAKVC evaluates and verifies credit background and capability of executor/paymaster' },
        { num: 'P3', title: 'Letter of Undertaking', desc: 'Upon meeting prerequisites, INSTRAKVC issues LOU for facility readiness' },
        { num: 'P4', title: 'Proposal Submission', desc: 'Executor submits proposal/quotation for the specific contract offer' },
        { num: 'P5', title: 'Project Execution', desc: 'Upon job completion, payment assigned to Maybank Trustees headed by INSTRAKVC' },
        { num: 'P6', title: 'Settlement', desc: 'Reimbursement and clearance for final settlement to all relevant parties' },
    ];

    return (
        <div className="page-wrapper">
            <PageHero 
                title="Contract Financing" 
                subtitle="Liquidity solutions for businesses with secured government or corporate contracts."
            />
            
            {/* Overview */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: '#1A365D' }}>Project Financing Worth RM 20 Billion</h2>
                        <p style={{ color: '#4A5568', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            Most companies are capable of managing their projects but lack the capacity to fulfill the financial needs required by contract awarders. INSTRAKVC as a venture capital company takes the position in helping companies grow with their current projects to succeed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Eligible Awarders */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <h2 className="section-title">Eligible Contract Awarders</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {eligibleAwarders.map((item, i) => (
                            <div key={i} className="glass-card">
                                <div style={{ color: '#B8860B', marginBottom: '1rem' }}>{item.icon}</div>
                                <h4 style={{ marginBottom: '0.75rem', color: '#1A365D' }}>{item.title}</h4>
                                <p style={{ color: '#4A5568', fontSize: '0.95rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Funding Process */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 className="section-title">Funding Ecosystem</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {processSteps.map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', background: '#F5F7FA', borderRadius: '12px', border: '1px solid rgba(26, 54, 93, 0.08)' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #1A365D, #2D5A8B)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>{step.num}</div>
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem', color: '#1A365D' }}>{step.title}</h4>
                                    <p style={{ color: '#4A5568', fontSize: '0.9rem', lineHeight: '1.6' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <h2 className="section-title">Why Choose Contract Financing</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {benefits.map((benefit, i) => (
                            <div key={i} className="glass-card">
                                <div style={{ color: '#B8860B', marginBottom: '1rem' }}>{benefit.icon}</div>
                                <h4 style={{ marginBottom: '0.75rem', color: '#1A365D' }}>{benefit.title}</h4>
                                <p style={{ color: '#4A5568', fontSize: '0.95rem' }}>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Eligibility & Form */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'start' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1A365D' }}>Eligibility Criteria</h2>
                            <p style={{ color: '#4A5568', marginBottom: '2rem', lineHeight: '1.7' }}>
                                To qualify for contract financing, your business must meet the following requirements:
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {eligibility.map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', color: '#4A5568' }}>
                                        <CheckCircle size={20} color="#B8860B" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#F5F7FA', borderRadius: '12px', borderLeft: '4px solid #B8860B' }}>
                                <p style={{ fontSize: '0.9rem', color: '#4A5568', fontStyle: 'italic' }}>
                                    <strong>Banking Partner:</strong> All payments are managed through Maybank Trustees with full control by INSTRAKVC for security and compliance.
                                </p>
                            </div>
                        </div>

                        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(26, 54, 93, 0.1)', boxShadow: '0 4px 20px rgba(26, 54, 93, 0.08)' }}>
                            <h3 style={{ marginBottom: '1.5rem', color: '#1A365D' }}>Apply for Contract Financing</h3>
                            <form onSubmit={handleSubmit}>
                                <Toaster position="top-right" />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Company Name *</label>
                                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your company" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Registration No. *</label>
                                        <input type="text" name="registrationNo" value={formData.registrationNo} onChange={handleChange} placeholder="Company reg. number" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Contact Person *</label>
                                        <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Full name" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Email Address *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Contract Awarder Type *</label>
                                    <select name="contractAwarderType" value={formData.contractAwarderType} onChange={handleChange} style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', color: '#1A365D' }} required>
                                        <option value="">Select type</option>
                                        <option value="government">Government Agency (State/Federal)</option>
                                        <option value="glc">Government-Linked Company (GLC)</option>
                                        <option value="mnc">Multi-National Company (MNC)</option>
                                        <option value="reputable">Reputable Entity with Proven Paymaster</option>
                                        <option value="international">International Trade with Bank Acceptance</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Contract Value (RM) *</label>
                                        <input type="text" name="contractValue" value={formData.contractValue} onChange={handleChange} placeholder="e.g., 2,000,000" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Financing Needed (RM) *</label>
                                        <input type="text" name="financingNeeded" value={formData.financingNeeded} onChange={handleChange} placeholder="Amount required" style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px' }} required />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1A365D' }}>Contract Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Brief description of the contract, paymaster details, and project scope..." style={{ width: '100%', padding: '1rem', border: '1px solid rgba(26, 54, 93, 0.2)', borderRadius: '6px', resize: 'vertical' }}></textarea>
                                </div>
                                <button className="btn-solid" type="submit" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContractFinancing;
