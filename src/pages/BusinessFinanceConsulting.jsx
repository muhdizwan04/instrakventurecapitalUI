import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { TrendingUp, Target, Shield, BarChart3, CheckCircle, Users, DollarSign, Briefcase, LineChart, ArrowRight, Clock, Award } from 'lucide-react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageContent } from '../hooks/usePageContent';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const BusinessFinanceConsulting = () => {
    const [formData, setFormData] = useState({
        fullName: '', email: '', companyName: '', phone: '',
        servicesInterested: '', annualRevenue: '', needs: ''
    });
    const { submitForm, loading } = useFormSubmit('consulting');

    // Default content (used as fallback)
    const defaultContent = {
        title: 'Business Finance Consulting – Virtual CFO',
        subtitle: 'Dedicated finance leadership to support funding readiness, reporting discipline, and decision-making—without the overhead of a full-time in-house CFO.',
        ourRole: [
            'Financial strategy & forecasting',
            'Budgeting & cash flow management',
            'Profitability analysis & cost control',
            'Investment readiness & capital structuring',
            'Financial risk assessment & mitigation',
            'KPI setting & performance monitoring',
            'Board/investor reporting & stakeholder communication'
        ],
        whoNeeds: [
            'Startups needing financial structure for investor confidence',
            'SME preparing for funding rounds or market expansion',
            'Scale-ups lacking in-house finance leadership',
            'Companies facing cash flow challenges or rapid growth'
        ],
        keyBenefits: [
            'Access to world-class financial leadership',
            'No fixed salary or long-term employment contracts',
            'Real-time insights for better decision-making',
            'Improved investor trust and funding potential',
            'Scalable support as your business grows'
        ],
        approach: [
            { step: '01', title: 'Initial Assessment', desc: 'We evaluate your current financial position, challenges, and goals.' },
            { step: '02', title: 'Tailored Financial Roadmap', desc: 'We create a customized strategy aligned with your business objectives.' },
            { step: '03', title: 'Execution & Monitoring', desc: 'We implement the plan and track progress with regular reporting.' },
            { step: '04', title: 'Continuous Improvement', desc: 'We adapt and refine strategies as your business evolves.' }
        ]
    };

    // Fetch content from admin
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

    // Get content values with fallbacks
    const title = pageContent.title || defaultContent.title;
    const subtitle = pageContent.subtitle || defaultContent.subtitle;
    const ourRole = pageContent.ourRole || defaultContent.ourRole;
    const whoNeeds = pageContent.whoNeeds || defaultContent.whoNeeds;
    const keyBenefits = pageContent.keyBenefits || defaultContent.keyBenefits;
    const approach = pageContent.approach || defaultContent.approach;

    return (
        <div className="page-wrapper">
            {/* Enhanced Hero */}
            <div style={{ background: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)', padding: '100px 20px 80px', color: '#FFFFFF', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem', color: '#FFFFFF' }}>{title}</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2.5rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>{subtitle}</p>
                    <a href="#consultation-form" className="btn-solid" style={{ background: '#B8860B', color: '#FFFFFF', padding: '1rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        Schedule Consultation <ArrowRight size={18} />
                    </a>
                </div>
            </div>

            {/* Why Virtual CFO / Benefits Grid */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.2rem', color: '#1A365D', marginBottom: '1rem' }}>Expert Financial Leadership</h2>
                        <p style={{ color: '#4A5568', maxWidth: '600px', margin: '0 auto' }}>Navigate complex financial landscapes with the strategic guidance of a seasoned CFO, at a fraction of the cost.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Benefit Cards */}
                        {keyBenefits.map((benefit, i) => (
                            <div key={i} style={{ padding: '2rem', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.3s ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#B8860B'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                            >
                                <div style={{ width: '48px', height: '48px', background: 'rgba(184, 134, 11, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    {[<Award key={0} />, <Clock key={1} />, <LineChart key={2} />, <Shield key={3} />, <TrendingUp key={4} />][i % 5] || <CheckCircle />}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', color: '#1A365D', marginBottom: '0.75rem' }}>{benefit.split(' ').slice(0, 3).join(' ')}...</h3>
                                <p style={{ color: '#4A5568', lineHeight: '1.6' }}>{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Role & Who Needs Grid */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        {/* Left: Our Role */}
                        <div>
                            <h3 style={{ fontSize: '1.8rem', color: '#1A365D', marginBottom: '2rem' }}>Our Role & Deliverables</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {ourRole.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: '#FFFFFF', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                                        <Briefcase size={20} color="#B8860B" style={{ marginTop: '3px', flexShrink: 0 }} />
                                        <span style={{ color: '#2D3748', fontWeight: '500' }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Who Needs */}
                        <div>
                            <h3 style={{ fontSize: '1.8rem', color: '#1A365D', marginBottom: '2rem' }}>Who Is This For?</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {whoNeeds.map((item, i) => (
                                    <div key={i} style={{ padding: '1.5rem', borderLeft: '4px solid #1A365D', background: '#FFFFFF', borderRadius: '0 8px 8px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                                        <h4 style={{ color: '#2D3748', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Target size={18} color="#1A365D" /> Ideal For
                                        </h4>
                                        <p style={{ color: '#4A5568', margin: 0 }}>{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Approach Steps */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '2.2rem', color: '#1A365D', marginBottom: '4rem' }}>Strategic Implementation Process</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', position: 'relative' }}>
                        {/* Connecting Line (Desktop) */}
                        <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '2px', background: '#E2E8F0', zIndex: 0, display: window.innerWidth > 768 ? 'block' : 'none' }}></div>
                        
                        {approach.map((step, i) => (
                            <div key={i} style={{ flex: '1 1 200px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                <div style={{ width: '50px', height: '50px', background: '#1A365D', borderRadius: '50%', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', margin: '0 auto 1.5rem', border: '4px solid #FFFFFF', boxShadow: '0 0 0 2px #E2E8F0' }}>
                                    {step.step}
                                </div>
                                <h4 style={{ color: '#2D3748', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{step.title}</h4>
                                <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: '1.5' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Consultation Form */}
            <section id="consultation-form" style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center', maxWidth: '1100px', margin: '0 auto' }}>
                        {/* Form Context */}
                        <div style={{ color: '#FFFFFF' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Secure Your Financial Future</h2>
                            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', lineHeight: '1.7' }}>
                                Speak with our strategic advisors to assess your eligibility and define the optimal roadmap for growth and capital efficiency.
                            </p>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <CheckCircle color="#B8860B" /> <span>Confidential Assessment</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <CheckCircle color="#B8860B" /> <span>Tailored Strategy</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <CheckCircle color="#B8860B" /> <span>No Obligation</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                            <h3 style={{ color: '#1A365D', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Request Consultation</h3>
                            <form onSubmit={handleSubmit}>
                                <Toaster position="top-right" />
                                <div style={{ display: 'grid', gap: '1.25rem' }}>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name *" style={{ width: '100%', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC' }} required />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Work Email *" style={{ padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC' }} required />
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" style={{ padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC' }} />
                                    </div>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name *" style={{ width: '100%', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC' }} required />
                                    
                                    <select name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} style={{ width: '100%', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC', color: '#4A5568' }}>
                                        <option value="">Annual Revenue Range</option>
                                        <option value="<1m">Below RM 1 Million</option>
                                        <option value="1-5m">RM 1 - 5 Million</option>
                                        <option value="5-20m">RM 5 - 20 Million</option>
                                        <option value="20-50m">RM 20 - 50 Million</option>
                                        <option value=">50m">Above RM 50 Million</option>
                                    </select>

                                    <textarea name="needs" value={formData.needs} onChange={handleChange} rows="3" placeholder="How can we help?" style={{ width: '100%', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC' }}></textarea>
                                    
                                    <button className="btn-solid" type="submit" style={{ width: '100%', padding: '1rem', background: '#B8860B', color: '#FFFFFF', fontSize: '1.1rem', marginTop: '0.5rem' }} disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BusinessFinanceConsulting;
