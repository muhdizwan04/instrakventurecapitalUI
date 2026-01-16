import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { TrendingUp, Target, Shield, BarChart3, CheckCircle, Users, DollarSign, Briefcase, LineChart } from 'lucide-react';
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
            <PageHero
                title={title}
                subtitle={subtitle}
            />

            {/* Our Role as Your Virtual CFO */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', color: '#1A365D', textAlign: 'center' }}>
                            Our Role as Your Virtual CFO
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            {ourRole.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#F5F7FA', borderRadius: '8px', border: '1px solid rgba(26, 54, 93, 0.08)' }}>
                                    <CheckCircle size={20} color="#B8860B" style={{ flexShrink: 0 }} />
                                    <span style={{ color: '#4A5568' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Who Needs a Virtual CFO */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: '#1A365D' }}>
                                Who Needs a Virtual CFO?
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {whoNeeds.map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', color: '#4A5568', lineHeight: '1.6' }}>
                                        <Target size={18} color="#B8860B" style={{ marginTop: '4px', flexShrink: 0 }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(26, 54, 93, 0.1)' }}>
                            <h3 style={{ color: '#1A365D', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Key Benefits</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {keyBenefits.map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', color: '#4A5568' }}>
                                        <CheckCircle size={18} color="#22C55E" style={{ marginTop: '2px', flexShrink: 0 }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Approach */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 className="section-title">Our Approach</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        {approach.map((step, i) => (
                            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '700', color: '#B8860B', marginBottom: '1rem' }}>{step.step}</div>
                                <h4 style={{ marginBottom: '0.75rem', color: '#1A365D', fontSize: '1.1rem' }}>{step.title}</h4>
                                <p style={{ color: '#4A5568', fontSize: '0.9rem', lineHeight: '1.6' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '60px 20px', background: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#FFFFFF', fontSize: '2rem', marginBottom: '1rem' }}>Ready to Get Started?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Schedule a free initial consultation to discuss how our Virtual CFO services can help your business thrive.
                    </p>
                    <Link to="/contact" className="btn-solid" style={{ background: '#B8860B', color: '#FFFFFF', padding: '1rem 2.5rem', fontSize: '1rem' }}>
                        Schedule a Free Initial Consultation
                    </Link>
                </div>
            </section>

            {/* Form Section */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1A365D' }}>Request a Consultation</h2>
                        <p style={{ textAlign: 'center', color: '#4A5568', marginBottom: '3rem' }}>
                            Tell us about your business and we'll connect you with our Virtual CFO team.
                        </p>
                        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(26, 54, 93, 0.1)', boxShadow: '0 4px 20px rgba(26, 54, 93, 0.06)' }}>
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
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BusinessFinanceConsulting;
