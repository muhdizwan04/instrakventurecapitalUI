import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageContent } from '../hooks/usePageContent';
import { Toaster } from 'react-hot-toast';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const AssetUnderManagement = () => {
    const [formData, setFormData] = useState({
        legalName: '',
        country: '',
        clientClassification: 'Institution',
        primaryContact: '',
        email: '',
        phone: '',
        beneficialOwners: '',
        isDecisionMaker: 'Yes',
        approvingAuthority: '',
        isBoardInvolved: 'No',
        approvalTimeline: '',
        aumSize: '',
        mandateType: 'Discretionary',
        primaryObjective: 'Growth',
        investmentHorizon: '3-5 Years',
        riskProfile: 'Balanced',
        preferredAssets: [],
        geographicFocus: '',
        liquidityRequirements: '',
        sourceOfFunds: '',
        jurisdictionOfFunds: '',
        hasRestrictions: 'No',
        isPep: 'No',
        isNotIllicit: false,
        collaborationInterests: [],
        declarationConfirmed: false
    });
    const { submitForm, loading } = useFormSubmit('aum');

    const defaultContent = {
        title: 'ASSET UNDER MANAGEMENT (AUM)',
        subtitle: '',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'aum') || defaultContent;

    const { content: settings } = usePageContent('global_settings');
    const siteName = settings?.siteIdentity?.siteName || 'Instrak Venture Capital Berhad';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name === 'preferredAssets' || name === 'collaborationInterests') {
                const updatedList = checked
                    ? [...formData[name], value]
                    : formData[name].filter(item => item !== value);
                setFormData({ ...formData, [name]: updatedList });
            } else {
                setFormData({ ...formData, [name]: checked });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.declarationConfirmed || !formData.isNotIllicit) {
            alert('Please confirm all required declarations.');
            return;
        }
        const submitted = await submitForm({
            name: formData.legalName,
            email: formData.email,
            phone: formData.phone,
            companyName: formData.legalName,
            message: `AUM Intake Form Submission. Mandate: ${formData.mandateType}, Profile: ${formData.riskProfile}`,
            subject: 'AUM Client Intake Form'
        }, formData);

        if (submitted) {
            setFormData({
                legalName: '', country: '', clientClassification: 'Institution', primaryContact: '', email: '', phone: '',
                beneficialOwners: '', isDecisionMaker: 'Yes', approvingAuthority: '', isBoardInvolved: 'No', approvalTimeline: '',
                aumSize: '', mandateType: 'Discretionary', primaryObjective: 'Growth', investmentHorizon: '3-5 Years', riskProfile: 'Balanced',
                preferredAssets: [], geographicFocus: '', liquidityRequirements: '',
                sourceOfFunds: '', jurisdictionOfFunds: '', hasRestrictions: 'No', isPep: 'No', isNotIllicit: false,
                collaborationInterests: [], declarationConfirmed: false
            });
        }
    };

    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1A365D', fontSize: '0.9rem' };
    const inputStyle = { width: '100%', padding: '0.9rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1rem', color: '#1A365D', background: '#FFFFFF', transition: 'border-color 0.2s' };

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} lightBandIndex={idx} />
            ))}

            {/* Contact Form */}
            <StyledFormSection
                serviceId="aum"
                serviceName="Asset Under Management"
                title={pageContent?.formStyles?.sectionTitle || 'AUM CLIENT INTAKE FORM & DECLARATION'}
                subtitle={pageContent?.formStyles?.sectionSubtitle || 'CONFIDENTIAL | INSTITUTIONAL USE ONLY'}
                sectionId="application-form"
                maxWidth="1000px"
                fallbackForm={
                                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '3rem' }}>
                                    <Toaster position="top-right" />

                                    {/* Section A */}
                                    <div className="form-section">
                                        <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION A — CLIENT PROFILE</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div className="form-group">
                                                <label style={labelStyle}>Legal Name of Entity / Individual *</label>
                                                <input type="text" name="legalName" value={formData.legalName} onChange={handleChange} style={inputStyle} required />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Country of Incorporation / Residence *</label>
                                                <input type="text" name="country" value={formData.country} onChange={handleChange} style={inputStyle} required />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Client Classification *</label>
                                                <select name="clientClassification" value={formData.clientClassification} onChange={handleChange} style={inputStyle}>
                                                    <option value="Institution">Institution</option>
                                                    <option value="Corporation">Corporation</option>
                                                    <option value="Family Office">Family Office</option>
                                                    <option value="UHNW / Principal">UHNW / Principal</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Primary Contact Person & Designation *</label>
                                                <input type="text" name="primaryContact" value={formData.primaryContact} onChange={handleChange} style={inputStyle} required />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Email Address *</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Contact Number *</label>
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} required />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section B */}
                                    <div className="form-section">
                                        <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION B — OWNERSHIP & GOVERNANCE</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                <label style={labelStyle}>Ultimate Beneficial Owner(s) *</label>
                                                <textarea name="beneficialOwners" value={formData.beneficialOwners} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} required />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Are you the final investment decision-maker? *</label>
                                                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input type="radio" name="isDecisionMaker" value="Yes" checked={formData.isDecisionMaker === 'Yes'} onChange={handleChange} /> Yes
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input type="radio" name="isDecisionMaker" value="No" checked={formData.isDecisionMaker === 'No'} onChange={handleChange} /> No
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>If No, please specify approving authority</label>
                                                <input type="text" name="approvingAuthority" value={formData.approvingAuthority} onChange={handleChange} style={inputStyle} />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Board / Investment Committee involved? *</label>
                                                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input type="radio" name="isBoardInvolved" value="Yes" checked={formData.isBoardInvolved === 'Yes'} onChange={handleChange} /> Yes
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input type="radio" name="isBoardInvolved" value="No" checked={formData.isBoardInvolved === 'No'} onChange={handleChange} /> No
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Expected internal approval timeline</label>
                                                <input type="text" name="approvalTimeline" value={formData.approvalTimeline} onChange={handleChange} style={inputStyle} placeholder="e.g. 2-4 weeks" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section C */}
                                    <div className="form-section">
                                        <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION C — AUM MANDATE OVERVIEW</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div className="form-group">
                                                <label style={labelStyle}>Indicative AUM Size (USD) *</label>
                                                <input type="text" name="aumSize" value={formData.aumSize} onChange={handleChange} style={inputStyle} required />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Intended Mandate Type *</label>
                                                <select name="mandateType" value={formData.mandateType} onChange={handleChange} style={inputStyle}>
                                                    <option value="Discretionary">Discretionary</option>
                                                    <option value="Advisory">Advisory</option>
                                                    <option value="Co-Investment">Co-Investment</option>
                                                    <option value="Structured">Structured</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Primary Objective *</label>
                                                <select name="primaryObjective" value={formData.primaryObjective} onChange={handleChange} style={inputStyle}>
                                                    <option value="Capital Preservation">Capital Preservation</option>
                                                    <option value="Growth">Growth</option>
                                                    <option value="Income">Income</option>
                                                    <option value="Strategic Allocation">Strategic Allocation</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Investment Horizon *</label>
                                                <select name="investmentHorizon" value={formData.investmentHorizon} onChange={handleChange} style={inputStyle}>
                                                    <option value="<1 Year">&lt;1 Year</option>
                                                    <option value="1–3 Years">1–3 Years</option>
                                                    <option value="3–5 Years">3–5 Years</option>
                                                    <option value="Long-Term">Long-Term</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Risk Profile *</label>
                                                <select name="riskProfile" value={formData.riskProfile} onChange={handleChange} style={inputStyle}>
                                                    <option value="Conservative">Conservative</option>
                                                    <option value="Balanced">Balanced</option>
                                                    <option value="Growth">Growth</option>
                                                    <option value="Opportunistic">Opportunistic</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section D */}
                                    <div className="form-section">
                                        <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION D — ASSET & STRATEGY PREFERENCE</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                <label style={labelStyle}>Preferred Asset Classes (Select all that apply) *</label>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
                                                    {['Public Markets', 'Private Equity', 'Private Credit', 'Structured Finance', 'Special Situations', 'Stock Loan'].map(asset => (
                                                        <label key={asset} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                                            <input type="checkbox" name="preferredAssets" value={asset} checked={formData.preferredAssets.includes(asset)} onChange={handleChange} /> {asset}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Geographic Focus</label>
                                                <input type="text" name="geographicFocus" value={formData.geographicFocus} onChange={handleChange} style={inputStyle} />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Liquidity Requirements</label>
                                                <input type="text" name="liquidityRequirements" value={formData.liquidityRequirements} onChange={handleChange} style={inputStyle} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section E */}
                                    <div className="form-section">
                                        <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION E — COMPLIANCE & SOURCE OF FUNDS</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div className="form-group">
                                                <label style={labelStyle}>Source of Funds (Business / Investment / Treasury / Other) *</label>
                                                <input type="text" name="sourceOfFunds" value={formData.sourceOfFunds} onChange={handleChange} style={inputStyle} required />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Jurisdiction of Funds *</label>
                                                <input type="text" name="jurisdictionOfFunds" value={formData.jurisdictionOfFunds} onChange={handleChange} style={inputStyle} required />
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Any regulatory, legal, or sanction restrictions? *</label>
                                                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input type="radio" name="hasRestrictions" value="Yes" checked={formData.hasRestrictions === 'Yes'} onChange={handleChange} /> Yes
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input type="radio" name="hasRestrictions" value="No" checked={formData.hasRestrictions === 'No'} onChange={handleChange} /> No
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label style={labelStyle}>Politically Exposed Person (PEP) status? *</label>
                                                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input type="radio" name="isPep" value="Yes" checked={formData.isPep === 'Yes'} onChange={handleChange} /> Yes
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                        <input type="radio" name="isPep" value="No" checked={formData.isPep === 'No'} onChange={handleChange} /> No
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: '#FFF5F5', borderRadius: '8px', border: '1px solid #FED7D7', color: '#C53030', fontWeight: '500' }}>
                                                    <input type="checkbox" name="isNotIllicit" checked={formData.isNotIllicit} onChange={handleChange} required />
                                                    Confirmation that funds are not derived from illicit activities *
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section F */}
                                    <div className="form-section">
                                        <h3 style={{ borderBottom: '2px solid #1A365D', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#1A365D', fontSize: '1.25rem' }}>SECTION F — STRATEGIC COLLABORATION (OPTIONAL)</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            {[
                                                'Capital Deployment',
                                                'Strategic Projects / Joint Ventures',
                                                'Stock Loan / Structured Finance',
                                                'Advisory / Balance Sheet Optimisation',
                                                'Global Network & Deal Access'
                                            ].map(item => (
                                                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', padding: '0.75rem', background: '#F7FAFC', borderRadius: '6px' }}>
                                                    <input type="checkbox" name="collaborationInterests" value={item} checked={formData.collaborationInterests.includes(item)} onChange={handleChange} /> {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Declaration */}
                                    <div className="form-section" style={{ background: '#F0F4F8', padding: '2.5rem', borderRadius: '12px', border: '1px solid #D1D5DB' }}>
                                        <h3 style={{ marginBottom: '1.5rem', color: '#1A365D', textAlign: 'center' }}>CLIENT DECLARATION & ACKNOWLEDGEMENT</h3>
                                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                                            {[
                                                'All information provided is true, complete, and accurate.',
                                                `I understand that ${siteName} operates on a selective, mandate-based model.`,
                                                `${siteName} does not guarantee investment performance or returns.`,
                                                'I consent to full KYC, AML, and regulatory due diligence as required.',
                                                `${siteName} reserves the absolute right to accept or decline any mandate.`
                                            ].map((msg, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#4A5568', lineHeight: '1.5' }}>
                                                    <CheckCircle size={18} color="#22C55E" style={{ flexShrink: 0 }} />
                                                    {msg}
                                                </div>
                                            ))}
                                        </div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1.5rem', background: '#FFFFFF', borderRadius: '8px', border: '2px solid #1A365D', fontWeight: '700', color: '#1A365D' }}>
                                            <input type="checkbox" name="declarationConfirmed" checked={formData.declarationConfirmed} onChange={handleChange} required />
                                            I ACCEPT THE ABOVE DECLARATIONS & TERMS *
                                        </label>
                                    </div>

                                    <button className="btn-solid" type="submit" style={{ width: '100%', padding: '1.5rem', fontSize: '1.25rem', background: '#B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                                        {loading ? 'Processing Submission...' : 'Submit Intitutional Inquiry'}
                                    </button>
                                </form>
                            }
                        />

        </div>
    );
};

export default AssetUnderManagement;
