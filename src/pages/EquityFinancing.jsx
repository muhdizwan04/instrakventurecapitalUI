import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { TrendingUp, Users, Search, Briefcase, Target, CheckCircle, ArrowRight, DollarSign, PieChart, Clock } from 'lucide-react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { Toaster } from 'react-hot-toast';

const EquityFinancing = () => {
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
    const services = [
        { icon: <TrendingUp />, title: 'Equity Investment', desc: 'Strategic capital injection up to USD 100 Million for high-growth companies.' },
        { icon: <Users />, title: 'Merger & Acquisition', desc: 'Expert guidance through complex M&A transactions and negotiations.' },
        { icon: <Search />, title: 'Due Diligence', desc: 'Comprehensive financial and operational analysis for informed decisions.' },
        { icon: <Briefcase />, title: 'IPO Preparation', desc: 'Preparation and advisory for Initial Public Offering listing.' },
    ];

    const roadmapStages = [
        { 
            stage: '1', 
            title: 'Due Diligence', 
            duration: '3-6 Months',
            items: ['Due Diligence Work', 'Master Planning', 'Opening of Offshore Account', 'Overall Financial Analysis', 'Restructuring Existing Processes'],
            investment: 'Min. USD 110,000'
        },
        { 
            stage: '2', 
            title: 'M&A Environment', 
            duration: '24 Months',
            items: ['Mergers & Acquisition Environment', 'Review Business Plan', 'Debts Consolidation Account', 'Pitching Readiness to Selected VCs'],
            investment: 'USD 124,000'
        },
        { 
            stage: '3', 
            title: 'Funding Readiness', 
            duration: 'Upon Approval',
            items: ['Funding Readiness up to USD 100 Million', '10% Service Fee on Approved Amount', '30-40% Equity Holding by IVCB'],
            investment: '35% Equity'
        },
        { 
            stage: '4', 
            title: 'Performance Monitoring', 
            duration: '2 Years',
            items: ['IVCB will service client within 2 years', 'Progress and update on performance', 'Risk management and monitoring'],
            investment: 'Ongoing'
        },
        { 
            stage: '5', 
            title: 'Exit Strategy', 
            duration: 'Target',
            items: ['At least 6x revenue from capital generated (USD 600M)', 'Preparation of IPO Listing', 'Exit Strategy upon IPO Listed'],
            investment: 'IPO Ready'
        },
    ];

    const financingTerms = [
        { label: 'Facility Line', value: 'USD 100 Million' },
        { label: 'Equity Split', value: '60% Investee / 40% IVCB' },
        { label: 'Margin Financing', value: 'Up to 80%' },
        { label: 'Maximum Tenure', value: '5 Years' },
        { label: 'Service Fee', value: '10% on Approval' },
        { label: 'Target Revenue', value: '6x Capital (USD 600M)' },
    ];

    const sectors = ['Oil & Gas', 'Property Development', 'Education', 'Logistics', 'Automotive', 'Manufacturing', 'Construction', 'Digital Technology'];

    return (
        <div className="page-wrapper">
            <PageHero 
                title="Equity Financing & M&A" 
                subtitle="Strategic growth through equity investment and merger assistance."
            />
            
            {/* Services */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <h2 className="section-title">Our Services</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {services.map((service, i) => (
                            <div key={i} className="glass-card">
                                <div style={{ color: '#B8860B', marginBottom: '1rem' }}>{service.icon}</div>
                                <h4 style={{ marginBottom: '0.75rem', color: '#1A365D' }}>{service.title}</h4>
                                <p style={{ color: '#4A5568', fontSize: '0.95rem' }}>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5-Stage Roadmap */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <h2 className="section-title">Funding Roadmap 2022-2025</h2>
                    <p style={{ textAlign: 'center', color: '#4A5568', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        Our structured 5-stage equity financing roadmap guides companies from due diligence to IPO exit strategy.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                        {roadmapStages.map((stage, i) => (
                            <div key={i} style={{ 
                                flex: '1 1 200px', 
                                maxWidth: '220px',
                                background: '#FFFFFF', 
                                borderRadius: '12px', 
                                padding: '1.5rem',
                                border: '1px solid rgba(26, 54, 93, 0.08)',
                                position: 'relative'
                            }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    background: 'linear-gradient(135deg, #B8860B, #D4A84B)', 
                                    color: 'white', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontWeight: '700',
                                    marginBottom: '1rem'
                                }}>
                                    {stage.stage}
                                </div>
                                <h4 style={{ marginBottom: '0.5rem', color: '#1A365D', fontSize: '1rem' }}>{stage.title}</h4>
                                <p style={{ fontSize: '0.75rem', color: '#B8860B', fontWeight: '600', marginBottom: '1rem' }}>{stage.duration}</p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {stage.items.map((item, j) => (
                                        <li key={j} style={{ fontSize: '0.8rem', color: '#4A5568', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                            <CheckCircle size={12} color="#B8860B" style={{ marginTop: '3px', flexShrink: 0 }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#F5F7FA', borderRadius: '6px', textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1A365D' }}>{stage.investment}</span>
                                </div>
                                {i < roadmapStages.length - 1 && (
                                    <div style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', color: '#B8860B', display: 'none' }}>
                                        <ArrowRight size={20} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Financing Terms */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: '#1A365D' }}>Investment Terms</h2>
                            <p style={{ color: '#4A5568', marginBottom: '2rem', lineHeight: '1.7' }}>
                                INSTRAKVC offers equity financing against secured contracts with guaranteed payment by reputable paymasters. The facility accommodates working capital with secured loan and receivable financing for reimbursement basis.
                            </p>
                            <div style={{ background: '#F5F7FA', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(26, 54, 93, 0.08)' }}>
                                {financingTerms.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: i < financingTerms.length - 1 ? '1px solid rgba(26, 54, 93, 0.08)' : 'none' }}>
                                        <span style={{ color: '#4A5568' }}>{item.label}</span>
                                        <span style={{ fontWeight: '600', color: '#B8860B' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', color: '#1A365D' }}>Focus Sectors</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                                {sectors.map((sector, i) => (
                                    <span key={i} style={{ padding: '0.6rem 1.2rem', background: '#F5F7FA', border: '1px solid rgba(26, 54, 93, 0.1)', borderRadius: '50px', fontSize: '0.9rem', color: '#1A365D' }}>{sector}</span>
                                ))}
                            </div>
                            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #1A365D, #2D5A8B)', borderRadius: '12px', color: 'white' }}>
                                <Target size={32} style={{ marginBottom: '1rem' }} />
                                <h4 style={{ marginBottom: '0.5rem' }}>For Founders</h4>
                                <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '1rem' }}>Partner with us to access strategic capital up to USD 100 Million, industry expertise, and a clear path to IPO listing.</p>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                    <strong>Payment Terms:</strong> Assigned Payment, Escrow Account, Bank Guarantee, Letter of Credit, Insurance Guarantee/Bond, Collateral Asset
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fee Options */}
            <section style={{ padding: '80px 20px', background: '#F5F7FA' }}>
                <div className="container">
                    <h2 className="section-title">Investment Fee Structure</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: '2px solid #B8860B' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <DollarSign size={24} color="#B8860B" />
                                <h3 style={{ color: '#1A365D', margin: 0 }}>Option 1</h3>
                            </div>
                            <p style={{ fontWeight: '600', color: '#1A365D', marginBottom: '1rem' }}>Retainer Fee & Insurance Bond</p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem', color: '#4A5568' }}>
                                    <CheckCircle size={16} color="#B8860B" style={{ marginTop: '3px' }} />
                                    USD 1,000,000 non-refundable retainer fee
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem', color: '#4A5568' }}>
                                    <CheckCircle size={16} color="#B8860B" style={{ marginTop: '3px' }} />
                                    5% insurance bond of facility line approved
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#4A5568' }}>
                                    <CheckCircle size={16} color="#B8860B" style={{ marginTop: '3px' }} />
                                    Excludes stamp duty and government taxes
                                </li>
                            </ul>
                        </div>
                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(26, 54, 93, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <PieChart size={24} color="#1A365D" />
                                <h3 style={{ color: '#1A365D', margin: 0 }}>Option 2</h3>
                            </div>
                            <p style={{ fontWeight: '600', color: '#1A365D', marginBottom: '1rem' }}>Initial Fees Upon Settlement</p>
                            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4A5568' }}>
                                    <span>Registration Fee</span>
                                    <span style={{ fontWeight: '600' }}>USD 5,000</span>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4A5568' }}>
                                    <span>Processing Fee</span>
                                    <span style={{ fontWeight: '600' }}>USD 15,000</span>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4A5568' }}>
                                    <span>Legal Fee</span>
                                    <span style={{ fontWeight: '600' }}>USD 1,500,000</span>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4A5568' }}>
                                    <span>Stamp Duty</span>
                                    <span style={{ fontWeight: '600' }}>USD 500,000</span>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4A5568' }}>
                                    <span>Insurance Bond</span>
                                    <span style={{ fontWeight: '600' }}>USD 5,000,000</span>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', color: '#4A5568' }}>
                                    <span>Due Diligence & M&A (3.6%)</span>
                                    <span style={{ fontWeight: '600' }}>USD 3,600,000</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#718096', fontStyle: 'italic' }}>
                        * Terms & Conditions Apply. All payments must be made through controlled banking accounts.
                    </p>
                </div>
            </section>

            {/* Pitch Form */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1A365D' }}>Pitch Your Company</h2>
                        <p style={{ textAlign: 'center', color: '#4A5568', marginBottom: '3rem' }}>
                            Interested in equity partnership or M&A advisory? Send your Letter of Intent (LOI) to begin the process.
                        </p>
                        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(26, 54, 93, 0.1)', boxShadow: '0 4px 20px rgba(26, 54, 93, 0.08)' }}>
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
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EquityFinancing;
