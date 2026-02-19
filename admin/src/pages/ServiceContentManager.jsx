import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Briefcase, FileText, TrendingUp, Building2, GripVertical, ChevronDown, ChevronUp, Loader2, Globe, Shield, Landmark, Coins, Gem, Users, ShieldCheck, PieChart, BarChart3, Settings2, X, Palette, Eye } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import FormBuilder from '../components/FormBuilder';
import LayoutPicker from '../components/LayoutPicker';
import AppearanceEditor from '../components/AppearanceEditor';
import { ColorField } from '../components/AppearanceEditor';
import IconPicker from '../components/IconPicker';
import ImageUpload from '../components/ImageUpload';

// ──────────────────────────────────────────────
// Migration: convert legacy flat service data → universal sections[]
// ──────────────────────────────────────────────
const legacyToSections = (svc) => {
    if (svc.sections?.length) return svc.sections;
    const sections = [];
    const L = svc.sectionLabels || {};
    const sec = (id, title, opts = {}) => ({
        id: `${svc.id}-${id}`, title: L[id] || title, subtitle: opts.subtitle || '', content: opts.content || '',
        items: opts.items || [],
        styles: { layoutType: opts.layout || 'standard', bgColor: opts.bg || '#FFFFFF', textColor: '#1A365D', textAlign: opts.align || 'center' },
        ...(opts.extra || {})
    });

    // Hero section (page title) - FIRST
    if (svc.title) {
        sections.push({
            id: `${svc.id}-hero`,
            title: svc.title,
            subtitle: svc.subtitle || svc.introduction || '',
            content: '',
            items: [],
            styles: {
                layoutType: 'hero',
                bgColor: '#1A365D',
                textColor: '#FFFFFF',
                titleColor: '#FFFFFF',
                subtitleColor: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                titleFontSize: 48,
                subtitleFontSize: 20
            },
            isHero: true
        });
    }

    // Introduction section - SECOND (if exists and different from hero subtitle)
    if (svc.introduction && svc.introduction !== (svc.subtitle || '')) {
        sections.push({
            id: `${svc.id}-introduction`,
            title: '',
            subtitle: '',
            content: svc.introduction,
            items: [],
            styles: {
                layoutType: 'standard',
                bgColor: '#0A3D62',
                textColor: '#FFFFFF',
                titleColor: '#FFFFFF',
                textAlign: 'center',
                contentFontSize: 18
            }
        });
    }

    if (svc.overview) sections.push(sec('overview', svc.overview.heading || 'Overview', { content: svc.overview.description, bg: '#F8FAFC' }));
    if (svc.ourRole?.length) sections.push(sec('ourRole', 'Our Role', { layout: 'list', items: svc.ourRole.map((r, i) => ({ id: `r${i}`, title: r, icon: 'CheckCircle' })) }));
    if (svc.whoNeeds?.length) sections.push(sec('whoNeeds', 'Who Needs This', { layout: 'list', bg: '#F8FAFC', items: svc.whoNeeds.map((r, i) => ({ id: `wn${i}`, title: r, icon: 'Users' })) }));
    if (svc.keyBenefits?.length) sections.push(sec('keyBenefits', 'Key Benefits', { layout: 'icon-group', items: svc.keyBenefits.map((r, i) => ({ id: `kb${i}`, title: r, icon: 'Star' })) }));
    if (svc.approach?.length) sections.push(sec('approach', 'Our Approach', { layout: 'list', bg: '#F8FAFC', items: svc.approach.map((a, i) => ({ id: `ap${i}`, title: a.title, description: a.desc, icon: 'CheckCircle' })) }));
    if (svc.services?.length) sections.push(sec('services', 'Services / Key Features', { layout: 'cards', items: svc.services.map((s, i) => ({ id: `sv${i}`, title: s.title, description: s.desc, icon: 'Briefcase' })) }));
    if (svc.philosophy?.length) sections.push(sec('philosophy', 'Our Philosophy', { layout: 'cards', bg: '#F8FAFC', items: svc.philosophy.map((p, i) => ({ id: `ph${i}`, title: p.title, description: p.desc, icon: 'Target' })) }));
    if (svc.whoWeServe?.length) sections.push(sec('whoWeServe', 'Who We Serve', { layout: 'grid', items: svc.whoWeServe.map((w, i) => ({ id: `ws${i}`, title: w.title, description: w.desc, icon: 'Users' })) }));
    if (svc.whyChoose?.length) sections.push(sec('whyChoose', 'Why Choose Us', { layout: 'cards', bg: '#F8FAFC', items: svc.whyChoose.map((w, i) => ({ id: `wc${i}`, title: w.title, description: w.desc, icon: 'Star' })) }));
    if (svc.roadmapStages?.length) sections.push(sec('roadmapStages', 'Funding Roadmap', { layout: 'list', items: svc.roadmapStages.map((r, i) => ({ id: `rs${i}`, title: `Stage ${r.stage}: ${r.title}`, description: `Duration: ${r.duration} | Investment: ${r.investment}`, icon: 'Target' })) }));
    if (svc.financingTypes?.length) sections.push(sec('financingTypes', 'Financing Types', { layout: 'grid', items: svc.financingTypes.map((f, i) => ({ id: `ft${i}`, title: f.title, description: f.desc, icon: 'Building2' })) }));
    if (svc.propertyTypes?.length) sections.push(sec('propertyTypes', 'Property Types', { layout: 'grid', bg: '#F8FAFC', items: svc.propertyTypes.map((p, i) => ({ id: `pt${i}`, title: p.type, description: p.examples, icon: 'Building2' })) }));
    if (svc.financingTerms?.length) sections.push(sec('financingTerms', 'Financing Terms', { layout: 'list', items: svc.financingTerms.map((f, i) => ({ id: `fterm${i}`, title: `${f.label}: ${f.value}`, icon: 'FileText' })) }));
    if (svc.loanTerms?.length) sections.push(sec('loanTerms', 'Loan Terms', { layout: 'list', bg: '#F8FAFC', items: svc.loanTerms.map((l, i) => ({ id: `lt${i}`, title: `${l.label}: ${l.value}`, icon: 'FileText' })) }));
    if (svc.sectors?.length) sections.push(sec('sectors', 'Sectors', { layout: 'icon-group', items: svc.sectors.map((s, i) => ({ id: `sec${i}`, title: s, icon: 'Globe' })) }));
    if (svc.executiveOverview) sections.push(sec('executiveOverview', 'Executive Overview', { content: svc.executiveOverview, bg: '#F8FAFC' }));
    if (svc.eligibility?.length) sections.push(sec('eligibility', 'Eligibility', { layout: 'list', items: svc.eligibility.map((e, i) => ({ id: `el${i}`, title: typeof e === 'string' ? e : (e.criteria || e.title), description: typeof e === 'string' ? '' : (e.description || e.desc || ''), icon: 'CheckCircle' })) }));
    if (svc.valueProposition?.length) sections.push(sec('valueProposition', 'Value Proposition', { layout: 'cards', bg: '#F8FAFC', items: svc.valueProposition.map((v, i) => ({ id: `vp${i}`, title: typeof v === 'string' ? v : v.title, description: typeof v === 'string' ? '' : (v.desc || ''), icon: 'Star' })) }));
    if (svc.subscriptionTiers?.length) sections.push(sec('subscriptionTiers', 'Subscription Tiers', { layout: 'cards', items: svc.subscriptionTiers.map((t, i) => ({ id: `st${i}`, title: `${t.tier || t.name} — ${t.price}`, description: (t.features || []).join('\n'), icon: 'Gem' })) }));
    if (svc.offerings?.length) sections.push(sec('offerings', 'Service Offerings', { layout: 'cards', bg: '#F8FAFC', items: svc.offerings.map((o, i) => ({ id: `of${i}`, title: o.title, description: (o.items || []).join('\n') || o.desc || '', icon: 'Briefcase' })) }));
    if (svc.process?.length) sections.push(sec('process', 'Process', { layout: 'list', items: svc.process.map((p, i) => ({ id: `pr${i}`, title: p.title, description: p.desc, icon: 'CheckCircle' })) }));
    if (svc.disclaimer) sections.push(sec('disclaimer', 'Disclaimer', { content: svc.disclaimer, layout: 'statement-block', bg: '#F8FAFC' }));

    return sections;
};

// ──────────────────────────────────────────────
// Appearance config
// ──────────────────────────────────────────────
const SEC_COLORS = [
    { key: 'bgColor', label: 'Background', default: '#FFFFFF', gradient: true },
    { key: 'textColor', label: 'Text', default: '#1A365D' },
    { key: 'titleColor', label: 'Title', default: '#0A3D62' },
    { key: 'iconColor', label: 'Icon / Accent', default: '#C9A227' },
];
const SEC_FEATURES = ['cardStyle', 'alignment', 'titleSize', 'subtitleSize', 'contentSize'];

const FORM_DEFAULTS = {
    sectionBg: '#F5F7FA', sectionTitle: '', sectionSubtitle: '', sectionTitleColor: '#1A365D', sectionSubtitleColor: '#4A5568',
    cardBg: '#FFFFFF', cardBorderColor: 'rgba(26,54,93,0.1)', cardRadius: 'md', cardShadow: 'subtle',
    labelColor: '#1A365D', inputBg: '#FFFFFF', inputBorderColor: 'rgba(26,54,93,0.2)', inputFocusColor: '#B8860B', inputRadius: 'sm',
    headingColor: '#1A365D', headingSeparator: true,
    btnBg: '#1A365D', btnText: '#FFFFFF', btnLabel: 'Submit Inquiry', btnRadius: 'sm', btnStyle: 'solid',
    btnHoverBg: '#152c4a',
};
const RADIUS_OPTIONS = [{ v: 'none', label: '0' }, { v: 'sm', label: '6' }, { v: 'md', label: '12' }, { v: 'lg', label: '16' }, { v: 'xl', label: '24' }];
const SHADOW_OPTIONS = [{ v: 'none', label: 'None' }, { v: 'subtle', label: 'Subtle' }, { v: 'medium', label: 'Medium' }, { v: 'strong', label: 'Strong' }];

const FormAppearanceEditor = ({ formStyles = {}, onChange }) => {
    const fs = { ...FORM_DEFAULTS, ...formStyles };
    const upd = (key, val) => onChange({ ...fs, [key]: val });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
                <Palette size={16} className="text-purple-500" /> Form Design & Appearance
            </div>

            {/* Section Wrapper */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Form Section Wrapper</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Section Background" value={fs.sectionBg} defaultValue="#F5F7FA" onChange={v => upd('sectionBg', v)} />
                    <ColorField label="Title Color" value={fs.sectionTitleColor} defaultValue="#1A365D" onChange={v => upd('sectionTitleColor', v)} />
                    <ColorField label="Subtitle/Description Color" value={fs.sectionSubtitleColor} defaultValue="#4A5568" onChange={v => upd('sectionSubtitleColor', v)} hint="Color for the subtitle text below the title" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Section Title</label>
                        <input value={fs.sectionTitle || ''} onChange={e => upd('sectionTitle', e.target.value)} className="input-field text-sm" placeholder="e.g. Request a Consultation" />
                        <p className="text-[10px] text-gray-400 mt-1">Main heading above the form</p>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Section Subtitle / Description</label>
                        <textarea 
                            value={fs.sectionSubtitle || ''} 
                            onChange={e => upd('sectionSubtitle', e.target.value)} 
                            className="input-field text-sm min-h-[80px] resize-y" 
                            placeholder="e.g. Tell us about your business and we'll connect you with our Virtual CFO team."
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Descriptive text shown below the title (this is what appears on the page)</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Form Card</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Card Background" value={fs.cardBg} defaultValue="#FFFFFF" onChange={v => upd('cardBg', v)} />
                    <ColorField label="Card Border" value={fs.cardBorderColor} defaultValue="rgba(26,54,93,0.1)" onChange={v => upd('cardBorderColor', v)} />
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Corner Radius</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {RADIUS_OPTIONS.map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('cardRadius', v)}
                                    className={`flex-1 text-[10px] font-bold rounded transition-all ${(fs.cardRadius || 'md') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Shadow</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {SHADOW_OPTIONS.map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('cardShadow', v)}
                                    className={`flex-1 text-[9px] font-bold rounded transition-all ${(fs.cardShadow || 'subtle') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Labels & Inputs */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fields & Labels</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Label Color" value={fs.labelColor} defaultValue="#1A365D" onChange={v => upd('labelColor', v)} />
                    <ColorField label="Input Background" value={fs.inputBg} defaultValue="#FFFFFF" onChange={v => upd('inputBg', v)} />
                    <ColorField label="Input Border" value={fs.inputBorderColor} defaultValue="rgba(26,54,93,0.2)" onChange={v => upd('inputBorderColor', v)} />
                    <ColorField label="Focus Ring" value={fs.inputFocusColor} defaultValue="#B8860B" onChange={v => upd('inputFocusColor', v)} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Heading Color" value={fs.headingColor} defaultValue="#1A365D" onChange={v => upd('headingColor', v)} />
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Input Radius</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {RADIUS_OPTIONS.map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('inputRadius', v)}
                                    className={`flex-1 text-[10px] font-bold rounded transition-all ${(fs.inputRadius || 'sm') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Submit Button</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Button Background" value={fs.btnBg} defaultValue="#1A365D" onChange={v => upd('btnBg', v)} />
                    <ColorField label="Button Text" value={fs.btnText} defaultValue="#FFFFFF" onChange={v => upd('btnText', v)} />
                    <ColorField label="Hover Background" value={fs.btnHoverBg} defaultValue="#152c4a" onChange={v => upd('btnHoverBg', v)} />
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Button Style</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {[{ v: 'solid', label: 'Solid' }, { v: 'outline', label: 'Outline' }, { v: 'gradient', label: 'Gradient' }].map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('btnStyle', v)}
                                    className={`flex-1 text-[10px] font-bold rounded transition-all ${(fs.btnStyle || 'solid') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Button Label</label>
                        <input value={fs.btnLabel || ''} onChange={e => upd('btnLabel', e.target.value)} className="input-field text-sm font-bold" placeholder="Submit Inquiry" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Button Radius</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {RADIUS_OPTIONS.map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('btnRadius', v)}
                                    className={`flex-1 text-[10px] font-bold rounded transition-all ${(fs.btnRadius || 'sm') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Eye size={10} /> Preview</div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex justify-center">
                        <button type="button" style={{
                            padding: '12px 32px', fontWeight: 600, fontSize: '0.95rem', cursor: 'default',
                            borderRadius: { none: 0, sm: 6, md: 12, lg: 16, xl: 24 }[fs.btnRadius || 'sm'] + 'px',
                            ...(fs.btnStyle === 'outline' ? { background: 'transparent', color: fs.btnBg || '#1A365D', border: `2px solid ${fs.btnBg || '#1A365D'}` }
                                : fs.btnStyle === 'gradient' ? { background: `linear-gradient(135deg, ${fs.btnBg || '#1A365D'}, ${fs.btnHoverBg || '#152c4a'})`, color: fs.btnText || '#FFFFFF', border: 'none' }
                                : { background: fs.btnBg || '#1A365D', color: fs.btnText || '#FFFFFF', border: 'none' })
                        }}>
                            {fs.btnLabel || 'Submit Inquiry'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ──────────────────────────────────────────────
// Default data for all 12 service detail pages
// ──────────────────────────────────────────────
const defaultServices = [
    {
        id: 'virtual-cfo',
        title: 'Business Finance Consulting – Virtual CFO',
        subtitle: 'Dedicated finance leadership to support funding readiness, reporting discipline, and decision-making—without the overhead of a full-time in-house CFO.',
        icon: 'Briefcase',
        fields: [
            { id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half', placeholder: 'Enter your full name' },
            { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half', placeholder: 'your@email.com' },
            { id: 'companyName', label: 'Company Name', type: 'text', required: true, width: 'half', placeholder: 'Enter your company name' },
            { id: 'phone', label: 'Phone Number', type: 'tel', required: true, width: 'half', placeholder: '+60 ...' },
            { id: 'servicesInterested', label: 'Services Interested In', type: 'select', required: true, width: 'full', options: ['Financial Strategy', 'Budgeting & Cash Flow', 'Profitability Analysis', 'Investment Readiness', 'Financial Risk Assessment', 'Comprehensive CFO Support'] },
            { id: 'annualRevenueRange', label: 'Annual Revenue Range', type: 'select', required: true, width: 'full', options: ['< RM 1 Million', 'RM 1 - 5 Million', 'RM 5 - 20 Million', 'RM 20 - 50 Million', '> RM 50 Million'] },
            { id: 'needs', label: 'Specific Needs or Challenges', type: 'textarea', required: true, width: 'full', placeholder: 'Tell us how we can help...' }
        ],
        ourRole: ['Financial strategy & forecasting', 'Budgeting & cash flow management', 'Profitability analysis & cost control', 'Investment readiness & capital structuring', 'Financial risk assessment & mitigation', 'KPI setting & performance monitoring', 'Board/investor reporting & stakeholder communication'],
        whoNeeds: ['Startups needing financial structure for investor confidence', 'SME preparing for funding rounds or market expansion', 'Scale-ups lacking in-house finance leadership', 'Companies facing cash flow challenges or rapid growth'],
        keyBenefits: ['Access to world-class financial leadership', 'No fixed salary or long-term employment contracts', 'Real-time insights for better decision-making', 'Improved investor trust and funding potential', 'Scalable support as your business grows'],
        approach: [
            { step: '01', title: 'Initial Assessment', desc: 'We evaluate your current financial position, challenges, and goals.' },
            { step: '02', title: 'Tailored Financial Roadmap', desc: 'We create a customized strategy aligned with your business objectives.' },
            { step: '03', title: 'Execution & Monitoring', desc: 'We implement the plan and track progress with regular reporting.' },
            { step: '04', title: 'Continuous Improvement', desc: 'We adapt and refine strategies as your business evolves.' }
        ],
    },
    {
        id: 'equity-financing', title: 'Equity Financing (EF)', subtitle: 'Strategic capital injection through equity investment for high-growth companies seeking expansion and market leadership.', icon: 'TrendingUp',
        fields: [
            { id: 'companyName', label: 'Company Name', type: 'text', required: true, width: 'half', placeholder: 'Enter company name' },
            { id: 'industrySector', label: 'Industry / Sector', type: 'select', required: true, width: 'half', options: ['Technology', 'Healthcare', 'Energy', 'Real Estate', 'Manufacturing', 'Logistics', 'Education', 'Other'] },
            { id: 'founderName', label: 'Founder / CEO Name', type: 'text', required: true, width: 'half', placeholder: 'Full name' },
            { id: 'email', label: 'Contact Email', type: 'email', required: true, width: 'half', placeholder: 'email@example.com' },
            { id: 'annualRevenue', label: 'Annual Revenue (USD)', type: 'text', required: true, width: 'half', placeholder: 'e.g. 5M' },
            { id: 'fundingSought', label: 'Funding Sought (USD)', type: 'text', required: true, width: 'half', placeholder: 'e.g. 2M' },
            { id: 'lookingFor', label: 'What are you looking for?', type: 'select', required: true, width: 'full', options: ['Equity Investment', 'M&A (Sell-side)', 'M&A (Buy-side)', 'IPO Preparation', 'Due Diligence Service'] },
            { id: 'companyOverview', label: 'Company Overview / Project Brief', type: 'textarea', required: true, width: 'full', placeholder: 'Describe your company and goals...' },
            { id: 'pitchDeckUrl', label: 'Pitch Deck URL (Optional)', type: 'text', required: false, width: 'full', placeholder: 'Link to your deck' }
        ],
        overview: { heading: 'Funding Roadmap 2022-2025', description: 'Our structured 5-stage equity financing roadmap guides companies from due diligence to IPO exit strategy.' },
        services: [
            { title: 'Equity Investment', desc: 'Strategic capital injection up to USD 100 Million for high-growth companies.' },
            { title: 'Merger & Acquisition', desc: 'Expert guidance through complex M&A transactions and negotiations.' },
            { title: 'Due Diligence', desc: 'Comprehensive financial and operational analysis for informed decisions.' },
            { title: 'IPO Preparation', desc: 'Preparation and advisory for Initial Public Offering listing.' }
        ],
        roadmapStages: [
            { stage: '1', title: 'Due Diligence', duration: '3-6 Months', investment: 'Min. USD 110,000' },
            { stage: '2', title: 'M&A Environment', duration: '24 Months', investment: 'USD 124,000' },
            { stage: '3', title: 'Funding Readiness', duration: 'Upon Approval', investment: '35% Equity' },
            { stage: '4', title: 'Performance Monitoring', duration: '2 Years', investment: 'Ongoing' },
            { stage: '5', title: 'Exit Strategy', duration: 'Target', investment: 'IPO Ready' }
        ],
        financingTerms: [
            { label: 'Facility Line', value: 'USD 100 Million' }, { label: 'Equity Split', value: '60% Investee / 40% IVCB' },
            { label: 'Margin Financing', value: 'Up to 80%' }, { label: 'Maximum Tenure', value: '5 Years' },
            { label: 'Service Fee', value: '10% on Approval' }, { label: 'Target Revenue', value: '6x Capital (USD 600M)' }
        ],
        sectors: ['Oil & Gas', 'Property Development', 'Education', 'Logistics', 'Automotive', 'Manufacturing', 'Construction', 'Digital Technology'],
    },
    {
        id: 'real-estate-financing', title: 'Real Estate Financing (REF)', subtitle: 'Funding for high-yield property developments and real estate acquisitions.', icon: 'Building2',
        fields: [
            { id: 'companyName', label: 'Developer/Company Name', type: 'text', required: true, width: 'half' },
            { id: 'contactPerson', label: 'Contact Person', type: 'text', required: true, width: 'half' },
            { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half' },
            { id: 'phone', label: 'Phone Number', type: 'tel', required: true, width: 'half' },
            { id: 'propertyType', label: 'Property Type', type: 'select', required: true, width: 'half', options: ['Commercial', 'Residential', 'Mixed-Use', 'Industrial'] },
            { id: 'financingType', label: 'Financing Type', type: 'select', required: true, width: 'half', options: ['Development Loan', 'Bridge Financing', 'Acquisition Capital'] },
            { id: 'projectLocation', label: 'Project Location', type: 'text', required: true, width: 'full' },
            { id: 'projectValue', label: 'Project Value (RM)', type: 'text', required: true, width: 'half' },
            { id: 'financingRequired', label: 'Financing Required (RM)', type: 'text', required: true, width: 'half' },
            { id: 'projectDescription', label: 'Project Description', type: 'textarea', required: true, width: 'full' }
        ],
        overview: { heading: 'Financing Solutions', description: 'Comprehensive financing solutions for property development, acquisition, and bridge financing.' },
        financingTypes: [
            { title: 'Development Loans', desc: 'Capital for new property development projects from land acquisition to completion.' },
            { title: 'Bridge Financing', desc: 'Short-term funding to bridge gaps between property transactions.' },
            { title: 'Acquisition Capital', desc: 'Financing for purchasing existing commercial and residential properties.' },
            { title: 'Industrial Real Estate', desc: 'Specialized funding for warehouses, factories, and logistics facilities.' }
        ],
        propertyTypes: [
            { type: 'Commercial', examples: 'Office buildings, retail spaces, shopping centers' },
            { type: 'Residential', examples: 'Condominiums, apartments, housing developments' },
            { type: 'Mixed-Use', examples: 'Integrated developments, township projects' },
            { type: 'Industrial', examples: 'Warehouses, manufacturing plants, logistics hubs' }
        ],
        loanTerms: [
            { label: 'Loan-to-Value (LTV)', value: 'Up to 70%' }, { label: 'Interest Rate', value: 'From 6.5% p.a.' },
            { label: 'Loan Tenure', value: '12 - 60 months' }, { label: 'Minimum Loan', value: 'RM 1 Million' }, { label: 'Maximum Loan', value: 'RM 100 Million' }
        ],
    },
    { id: 'reits', title: 'Real Estate Investment Trust (REITs)', subtitle: 'Institutional-grade real estate investment opportunities through structured REIT vehicles.', icon: 'Landmark',
        fields: [{ id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' }, { id: 'email', label: 'Email', type: 'email', required: true, width: 'half' }, { id: 'phone', label: 'Phone', type: 'tel', required: true, width: 'half' }, { id: 'investorType', label: 'Investor Type', type: 'select', required: true, width: 'half', options: ['Individual', 'Institutional', 'Family Office', 'Corporate'] }, { id: 'investmentAmount', label: 'Intended Investment Amount (RM)', type: 'text', required: true, width: 'full' }, { id: 'message', label: 'Additional Requirements', type: 'textarea', required: false, width: 'full' }],
        overview: { heading: 'Institutional REIT Solutions', description: 'Access high-quality real estate portfolios through our managed REIT investment structures.' }
    },
    { id: 'share-financing', title: 'Share Financing (SF)', subtitle: 'Strategic share financing solutions for shareholders and institutional investors.', icon: 'BarChart3',
        fields: [{ id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' }, { id: 'email', label: 'Email', type: 'email', required: true, width: 'half' }, { id: 'phone', label: 'Phone', type: 'tel', required: true, width: 'half' }, { id: 'companyName', label: 'Company Name', type: 'text', required: true, width: 'half' }, { id: 'stockExchange', label: 'Stock Exchange', type: 'select', required: true, width: 'half', options: ['Bursa Malaysia', 'SGX', 'HKEX', 'NYSE', 'NASDAQ', 'LSE', 'Other'] }, { id: 'shareValue', label: 'Estimated Share Value', type: 'text', required: true, width: 'half' }, { id: 'financingAmount', label: 'Financing Amount Required', type: 'text', required: true, width: 'half' }, { id: 'purpose', label: 'Purpose of Financing', type: 'select', required: true, width: 'full', options: ['Working Capital', 'Expansion', 'Debt Restructuring', 'Liquidity Release', 'Other'] }, { id: 'portfolioOverview', label: 'Portfolio Overview', type: 'textarea', required: true, width: 'full' }],
        overview: { heading: 'Strategic Share Financing', description: 'Unlock liquidity from your equity holdings through our structured share financing solutions.' }
    },
    { id: 'merger-acquisition', title: 'Merger & Acquisition (M&A)', subtitle: 'Expert guidance through complex M&A transactions, negotiations, and strategic integrations.', icon: 'Users',
        fields: [{ id: 'companyName', label: 'Company Name', type: 'text', required: true, width: 'half' }, { id: 'contactPerson', label: 'Contact Person', type: 'text', required: true, width: 'half' }, { id: 'email', label: 'Email', type: 'email', required: true, width: 'half' }, { id: 'phone', label: 'Phone', type: 'tel', required: true, width: 'half' }, { id: 'transactionType', label: 'Transaction Interest', type: 'select', required: true, width: 'full', options: ['Sell-side Advisory', 'Buy-side Advisory', 'Merger', 'Strategic Alliance', 'Joint Venture'] }, { id: 'industry', label: 'Industry / Sector', type: 'text', required: true, width: 'half' }, { id: 'valuationRange', label: 'Estimated Company Valuation', type: 'text', required: true, width: 'half' }, { id: 'message', label: 'Transaction Goals', type: 'textarea', required: true, width: 'full' }],
        overview: { heading: 'Expert M&A Advisory', description: 'Strategize and execute complex transactions with our experienced M&A team.' }
    },
    { id: 'tokenization', title: 'Tokenization', subtitle: 'Digital asset tokenization solutions for modern investment structures.', icon: 'Coins',
        fields: [{ id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' }, { id: 'email', label: 'Email', type: 'email', required: true, width: 'half' }, { id: 'assetType', label: 'Asset Type to Tokenize', type: 'select', required: true, width: 'half', options: ['Real Estate', 'Art/Collectibles', 'Corporate Equity', 'Revenue Streams', 'Other'] }, { id: 'assetValue', label: 'Estimated Asset Value', type: 'text', required: true, width: 'half' }, { id: 'message', label: 'Project Description', type: 'textarea', required: true, width: 'full' }],
        overview: { heading: 'Digital Asset Tokenization', description: 'Fractionalize and digitize value through our institutional-grade tokenization platform.' }
    },
    { id: 'asset-insurance', title: 'Asset Insurance (AI)', subtitle: 'Comprehensive asset protection and insurance solutions for institutional clients.', icon: 'Shield',
        fields: [{ id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' }, { id: 'email', label: 'Email', type: 'email', required: true, width: 'half' }, { id: 'assetCategory', label: 'Asset Category', type: 'select', required: true, width: 'half', options: ['Commercial Property', 'High-Value Equipment', 'Financial Assets', 'Marine/Transit', 'Other'] }, { id: 'coverageNeeds', label: 'Coverage Requirements', type: 'textarea', required: true, width: 'full' }],
        overview: { heading: 'Institutional Asset Insurance', description: 'Protect your capital and physical assets with our specialized insurance advisory.' }
    },
    { id: 'ppli', title: 'Private Placement Life Insurance (PPLI)', subtitle: 'Sophisticated life insurance solutions for wealth preservation and estate planning.', icon: 'ShieldCheck',
        fields: [{ id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' }, { id: 'email', label: 'Email', type: 'email', required: true, width: 'half' }, { id: 'wealthGoals', label: 'Primary Wealth Goals', type: 'select', required: true, width: 'full', options: ['Tax Efficiency', 'Estate Planning', 'Asset Protection', 'Investment Flexibility'] }, { id: 'message', label: 'Additional Information', type: 'textarea', required: false, width: 'full' }],
        overview: { heading: 'Private Placement Life Insurance', description: 'Integrate insurance into your global wealth management and tax strategy.' }
    },
    { id: 'gig', title: 'Global Investment Gateway (GIG)', subtitle: 'A Strategic Capital Access & Global Investor Connectivity Platform by Instrak Venture Capital Berhad', icon: 'Globe',
        fields: [
            { id: 'heading_a', label: 'SECTION A — COMPANY PROFILE', type: 'heading' },
            { id: 'companyName', label: 'Legal Company Name', type: 'text', required: true, width: 'half' },
            { id: 'countryOfIncorporation', label: 'Country of Incorporation', type: 'text', required: true, width: 'half' },
            { id: 'regNumber', label: 'Registration Number', type: 'text', required: true, width: 'half' },
            { id: 'yearEstablished', label: 'Year Established', type: 'text', required: true, width: 'half' },
            { id: 'heading_contact', label: 'CONTACT INFORMATION', type: 'heading' },
            { id: 'contactPerson', label: 'Contact Person', type: 'text', required: true, width: 'half' },
            { id: 'email', label: 'Email', type: 'email', required: true, width: 'half' },
            { id: 'phone', label: 'Phone', type: 'tel', required: true, width: 'half' },
            { id: 'message', label: 'Additional Information', type: 'textarea', required: false, width: 'full' }
        ],
        executiveOverview: 'Global Investment Gateway (GIG) is an exclusive, subscription-based platform designed to enable qualified companies to gain structured access to global investors, institutional capital providers, family offices, and strategic partners through the international network of Instrak Venture Capital Berhad (IVC).',
        eligibility: ['Legally incorporated and in good standing', 'Clear, scalable business model', 'Defined capital or strategic growth objectives', 'Acceptable governance and management credibility', 'Agreement to full KYC, AML, and due diligence requirements'],
        valueProposition: ['Access to curated global investor networks', 'Strategic capital positioning and readiness', 'Targeted investor matching (not mass outreach)', "Enhanced global credibility through IVC's institutional lens"],
        subscriptionTiers: [{ tier: 'GIG Essential', price: 'USD __ / year' }, { tier: 'GIG Professional', price: 'USD __ / year' }, { tier: 'GIG Institutional', price: 'USD __ / year' }],
    },
    { id: 'private-wealth', title: 'Private Wealth Investment (The Luxury Dubai)', subtitle: 'Exclusive private wealth investment opportunities in premium real estate.', icon: 'Gem',
        fields: [{ id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' }, { id: 'email', label: 'Email', type: 'email', required: true, width: 'half' }, { id: 'interestType', label: 'Investment Interest', type: 'select', required: true, width: 'full', options: ['Off-Plan Property', 'Secondary Market', 'Luxury Portfolios', 'Commercial/Hotel Assets'] }, { id: 'budget', label: 'Budget Range (USD)', type: 'text', required: true, width: 'half' }, { id: 'message', label: 'Specific Requirements', type: 'textarea', required: false, width: 'full' }],
        overview: { heading: 'The Luxury Dubai Investments', description: "Exclusive access to Dubai's most prestigious real estate and private wealth opportunities." }
    },
    { id: 'aum', title: 'Asset Under Management (AUM)', subtitle: 'Partner with Instrak Venture Capital Berhad to optimise capital, enhance portfolio performance, and achieve long-term strategic objectives.', icon: 'PieChart',
        fields: [
            { id: 'heading_a', label: 'SECTION A — CLIENT PROFILE', type: 'heading' },
            { id: 'legalName', label: 'Legal Name', type: 'text', required: true, width: 'half' },
            { id: 'country', label: 'Country', type: 'text', required: true, width: 'half' },
            { id: 'clientClassification', label: 'Client Classification', type: 'select', required: true, width: 'full', options: ['Institution', 'Corporation', 'Family Office', 'UHNW / Principal'] },
            { id: 'primaryContact', label: 'Primary Contact Person & Designation', type: 'text', required: true, width: 'full' },
            { id: 'email', label: 'Email', type: 'email', required: true, width: 'half' },
            { id: 'phone', label: 'Phone', type: 'tel', required: true, width: 'half' },
            { id: 'heading_b', label: 'SECTION B — OWNERSHIP & GOVERNANCE', type: 'heading' },
            { id: 'beneficialOwners', label: 'Ultimate Beneficial Owner(s)', type: 'textarea', required: true, width: 'full' },
            { id: 'isDecisionMaker', label: 'Are you the final investment decision-maker?', type: 'select', required: true, width: 'half', options: ['Yes', 'No'] },
            { id: 'approvingAuthority', label: 'If No, approving authority', type: 'text', required: false, width: 'half' },
            { id: 'heading_c', label: 'SECTION C — AUM MANDATE', type: 'heading' },
            { id: 'aumSize', label: 'Indicative AUM Size (USD)', type: 'text', required: true, width: 'half' },
            { id: 'mandateType', label: 'Mandate Type', type: 'select', required: true, width: 'half', options: ['Discretionary', 'Advisory', 'Co-Investment', 'Structured'] },
            { id: 'primaryObjective', label: 'Primary Objective', type: 'select', required: true, width: 'half', options: ['Capital Preservation', 'Growth', 'Income', 'Strategic Allocation'] },
            { id: 'riskProfile', label: 'Risk Profile', type: 'select', required: true, width: 'half', options: ['Conservative', 'Balanced', 'Growth', 'Opportunistic'] }
        ],
        introduction: 'Instrak Venture Capital Berhad (IVC) provides exclusive Asset Under Management (AUM) services tailored for corporations, institutional investors, family offices, and ultra-high-net-worth individuals (UHNWIs).',
        philosophy: [{ title: 'Institutional Rigour', desc: 'Decisions guided by robust governance and analytical frameworks.' }, { title: 'Global Insight', desc: 'Access to diverse markets and strategic opportunities.' }, { title: 'Tailored Solutions', desc: 'Portfolios reflecting objectives, risk appetite, and time horizon.' }, { title: 'Alignment of Interests', desc: 'Mandate structures ensure client objectives remain central.' }],
        services: [{ title: 'Portfolio Management', desc: 'Multi-asset strategies, risk-adjusted returns, diversification.' }, { title: 'Capital Structuring', desc: 'Balance sheet optimisation, bespoke financing, strategic allocation.' }, { title: 'Institutional Advisory', desc: 'M&A guidance, exclusive opportunities, risk advisory.' }, { title: 'Reporting & Transparency', desc: 'Performance reports, governance dashboards, compliance oversight.' }],
        whoWeServe: [{ title: 'Global Corporations', desc: 'Capital optimisation & strategic deployment.' }, { title: 'Institutional Investors', desc: 'Pension funds, endowments, sovereign wealth funds.' }, { title: 'Family Offices & UHNWIs', desc: 'Wealth preservation and growth.' }, { title: 'Shareholders & Principals', desc: 'Structured instruments, Stock Loans.' }],
        whyChoose: [{ title: 'Global Reach', desc: 'International markets & opportunities.' }, { title: 'Institutional Discipline', desc: 'Governance & risk management.' }, { title: 'High-Touch Service', desc: 'Dedicated portfolio teams.' }, { title: 'Confidentiality & Trust', desc: 'Strict fiduciary standards & privacy.' }],
        disclaimer: 'IVC provides information for general purposes only. This does not constitute an offer, solicitation, or recommendation for investment.',
    }
];

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
const ServiceContentManager = ({ embedded = false } = {}) => {
    const [activeService, setActiveService] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    const [expandedIdx, setExpandedIdx] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newForm, setNewForm] = useState({ title: '', subtitle: '', layoutType: 'standard' });

    const { content, loading, saving, saveContent } = useContent('service_pages', { pages: defaultServices });
    const [services, setServices] = useState(defaultServices);

    useEffect(() => {
        if (content?.pages && !loading) {
            const mergedServices = defaultServices.map(def => {
                const db = content.pages.find(p => p.id === def.id);
                if (db) {
                    const merged = { ...def, ...db, fields: (db.fields?.length > 0) ? db.fields : (def.fields || []), introduction: db.introduction || db.subtitle || def.subtitle || '' };
                    // Always ensure hero/intro sections exist, even if sections already exist
                    if (!merged.sections?.length) {
                        merged.sections = legacyToSections(merged);
                    } else {
                        // Check if hero section exists, if not add it
                        const hasHero = merged.sections.some(s => s.styles?.layoutType === 'hero' || s.isHero);
                        if (!hasHero && merged.title) {
                            const heroSection = {
                                id: `${merged.id}-hero`,
                                title: merged.title,
                                subtitle: merged.subtitle || merged.introduction || '',
                                content: '',
                                items: [],
                                styles: {
                                    layoutType: 'hero',
                                    bgColor: '#1A365D',
                                    textColor: '#FFFFFF',
                                    titleColor: '#FFFFFF',
                                    subtitleColor: 'rgba(255,255,255,0.9)',
                                    textAlign: 'center',
                                    titleFontSize: 48,
                                    subtitleFontSize: 20
                                },
                                isHero: true
                            };
                            merged.sections = [heroSection, ...merged.sections];
                        }
                        // Check if introduction section exists (if intro is different from hero subtitle)
                        const hasIntro = merged.sections.some(s => s.id === `${merged.id}-introduction`);
                        if (!hasIntro && merged.introduction && merged.introduction !== (merged.subtitle || '')) {
                            const introSection = {
                                id: `${merged.id}-introduction`,
                                title: '',
                                subtitle: '',
                                content: merged.introduction,
                                items: [],
                                styles: {
                                    layoutType: 'standard',
                                    bgColor: '#0A3D62',
                                    textColor: '#FFFFFF',
                                    titleColor: '#FFFFFF',
                                    textAlign: 'center',
                                    contentFontSize: 18
                                }
                            };
                            // Insert after hero
                            const heroIdx = merged.sections.findIndex(s => s.styles?.layoutType === 'hero' || s.isHero);
                            if (heroIdx >= 0) {
                                merged.sections.splice(heroIdx + 1, 0, introSection);
                            } else {
                                merged.sections.unshift(introSection);
                            }
                        }
                    }
                    return merged;
                }
                return { ...def, sections: legacyToSections(def) };
            });
            setServices(mergedServices);
        }
    }, [content, loading]);

    const getIcon = (iconName) => {
        const icons = { Briefcase, FileText, TrendingUp, Building2, Globe, Shield, Landmark, Coins, Gem, Users, ShieldCheck, PieChart, BarChart3 };
        return icons[iconName] || Briefcase;
    };

    const handleSave = async () => {
        // Extract title/subtitle from hero section if it exists, otherwise use service fields
        const cleanPages = services.map(s => {
            const heroSection = s.sections?.find(sec => sec.styles?.layoutType === 'hero' || sec.isHero);
            const introSection = s.sections?.find(sec => sec.id === `${s.id}-introduction`);
            
            return {
                id: s.id,
                title: heroSection?.title || s.title,
                subtitle: heroSection?.subtitle || s.subtitle,
                introduction: introSection?.content || heroSection?.subtitle || s.introduction || s.subtitle,
                icon: s.icon,
                fields: s.fields,
                sections: s.sections || [],
                formStyles: s.formStyles || {}
            };
        });
        await saveContent({ pages: cleanPages });
    };

    const updateService = (serviceId, field, value) => {
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, [field]: value } : s));
    };

    // Section CRUD for active service
    const getSections = () => services.find(s => s.id === activeService)?.sections || [];
    const setSections = (newSections) => updateService(activeService, 'sections', newSections);

    const updateSection = (idx, changes) => setSections(getSections().map((s, i) => i === idx ? { ...s, ...changes } : s));
    const updateSectionStyles = (idx, stylePatch) => {
        const s = getSections()[idx];
        updateSection(idx, { styles: { ...(s.styles || {}), ...stylePatch } });
    };
    const removeSection = (idx) => {
        const s = getSections()[idx];
        const isHero = s.styles?.layoutType === 'hero' || s.isHero;
        if (isHero) {
            toast.error('Hero section cannot be deleted. Edit it instead.');
            return;
        }
        setSections(getSections().filter((_, i) => i !== idx));
    };
    const addSection = () => {
        const sec = {
            id: `svc-sec-${Date.now()}`, title: newForm.title || 'New Section', subtitle: newForm.subtitle || '',
            content: '', items: [],
            styles: { layoutType: newForm.layoutType, bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'center' }
        };
        setSections([...getSections(), sec]);
        setShowAddModal(false);
        setNewForm({ title: '', subtitle: '', layoutType: 'standard' });
        setExpandedIdx(getSections().length);
    };
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const sections = getSections();
        const sourceIdx = result.source.index;
        const destIdx = result.destination.index;
        const movedSection = sections[sourceIdx];
        const isHero = movedSection.styles?.layoutType === 'hero' || movedSection.isHero;
        
        // Prevent hero from being moved away from first position
        if (isHero && destIdx !== 0) {
            toast.error('Hero section must remain first. Moving it to position 1.');
            const next = Array.from(sections);
            const [moved] = next.splice(sourceIdx, 1);
            next.splice(0, 0, moved);
            setSections(next);
            return;
        }
        
        // Prevent non-hero sections from being moved to position 0 if hero exists
        if (!isHero && destIdx === 0 && sections.some(s => s.styles?.layoutType === 'hero' || s.isHero)) {
            toast.error('Hero section must remain first.');
            return;
        }
        
        const next = Array.from(sections);
        const [moved] = next.splice(sourceIdx, 1);
        next.splice(destIdx, 0, moved);
        setSections(next);
    };
    const updateItem = (sIdx, iIdx, field, value) => {
        const s = getSections()[sIdx];
        const items = s.items.map((it, i) => i === iIdx ? { ...it, [field]: value } : it);
        updateSection(sIdx, { items });
    };
    const addItem = (sIdx) => {
        const s = getSections()[sIdx];
        updateSection(sIdx, { items: [...(s.items || []), { id: `item-${Date.now()}`, title: 'New Item', description: '', icon: 'CheckCircle' }] });
    };
    const removeItem = (sIdx, iIdx) => {
        const s = getSections()[sIdx];
        updateSection(sIdx, { items: s.items.filter((_, i) => i !== iIdx) });
    };

    // ──────────────────────────────────────────────
    // Section Editor (one expandable block)
    // ──────────────────────────────────────────────
    const renderSectionEditor = (s, idx) => {
        const lt = s.styles?.layoutType || 'standard';
        const isExpanded = expandedIdx === idx;
        const isHero = lt === 'hero' || s.isHero;
        return (
            <div className={`bg-white rounded-xl border ${isExpanded ? 'border-blue-300 shadow-md' : 'border-gray-200'} transition-all ${isHero ? 'ring-2 ring-blue-200' : ''}`}>
                <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedIdx(isExpanded ? null : idx)}>
                    <span className="text-gray-400 font-mono text-xs w-6 text-center">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{s.title || (isHero ? 'Page Hero' : 'Untitled')}</div>
                        <div className="text-[10px] text-gray-400 uppercase flex items-center gap-2">
                            {lt} {isHero && <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[9px]">HERO</span>}
                        </div>
                    </div>
                    {!isHero && <button onClick={(e) => { e.stopPropagation(); removeSection(idx); }} className="text-gray-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>}
                    {isHero && <span className="text-[9px] text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded">Protected</span>}
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
                {isExpanded && (
                    <div className="px-4 pb-5 space-y-4 border-t border-gray-100 pt-4">
                        {isHero && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Page Hero Section</div>
                                <div className="text-xs text-blue-600">This is the main page title section. It appears at the top of the service page and cannot be deleted.</div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="label">Title {isHero && '(Page Title)'}</label><input value={s.title || ''} onChange={e => updateSection(idx, { title: e.target.value })} className="input-field font-bold" placeholder={isHero ? "e.g. EQUITY FINANCING (EF)" : "Section title"} /></div>
                            <div><label className="label">Subtitle {isHero && '(Hero Subtitle)'}</label><input value={s.subtitle || ''} onChange={e => updateSection(idx, { subtitle: e.target.value })} className="input-field" placeholder={isHero ? "Brief tagline or description" : "Brief description..."} /></div>
                        </div>

                        {!isHero ? (
                            <LayoutPicker value={lt} onChange={v => updateSectionStyles(idx, { layoutType: v })} />
                        ) : (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Layout Type</div>
                                <div className="text-sm text-gray-600">Hero layout (cannot be changed)</div>
                            </div>
                        )}

                        {lt === 'dialog' && (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-4">
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Dialog / Quote Settings</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="label">Person Name</label><input value={s.dialogName || ''} onChange={e => updateSection(idx, { dialogName: e.target.value })} className="input-field font-bold" placeholder="e.g. John Smith" /></div>
                                    <div><label className="label">Person Role / Title</label><input value={s.dialogRole || ''} onChange={e => updateSection(idx, { dialogRole: e.target.value })} className="input-field" placeholder="e.g. CEO, Company" /></div>
                                </div>
                                <div>
                                    <label className="label">Person Photo (optional)</label>
                                    <div className="max-w-[200px]"><ImageUpload value={s.dialogImage || ''} onChange={val => updateSection(idx, { dialogImage: val })} aspectRatio="1/1" maxSizeMB={2} maxWidth={400} folder="dialog" previewFit="contain" /></div>
                                </div>
                            </div>
                        )}

                        {lt === 'boxed-group' && (
                            <div><label className="label">Group Header</label><input value={s.groupTitle || ''} onChange={e => updateSection(idx, { groupTitle: e.target.value })} className="input-field font-bold" placeholder="e.g. STRATEGIC PILLARS" /></div>
                        )}

                        <div>
                            <label className="label">Content / Text {lt !== 'standard' ? '(optional)' : ''}</label>
                            <textarea rows={lt === 'standard' ? 6 : 3} value={s.content || ''} onChange={e => updateSection(idx, { content: e.target.value })} className="input-field text-sm" placeholder="Enter text content..." />
                        </div>

                        {lt !== 'standard' && lt !== 'dialog' && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="label mb-0">Items</label>
                                    <button onClick={() => addItem(idx)} className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold border border-blue-100"><Plus size={12} /> Add Item</button>
                                </div>
                                <div className="space-y-2">
                                    {(s.items || []).map((item, iIdx) => (
                                        <div key={item.id || iIdx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex gap-3 items-start">
                                            <IconPicker value={item.icon || 'CheckCircle'} onChange={icon => updateItem(idx, iIdx, 'icon', icon)} />
                                            <div className="flex-1 space-y-2">
                                                <input value={item.title || ''} onChange={e => updateItem(idx, iIdx, 'title', e.target.value)} className="input-field text-sm font-bold py-1.5" placeholder="Item title" />
                                                <input value={item.description || ''} onChange={e => updateItem(idx, iIdx, 'description', e.target.value)} className="input-field text-xs py-1.5" placeholder="Description (optional)" />
                                            </div>
                                            <button onClick={() => removeItem(idx, iIdx)} className="text-gray-300 hover:text-red-500 pt-1"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    {(!s.items || s.items.length === 0) && <p className="text-xs text-gray-400 italic">No items yet. Add items for structured layouts.</p>}
                                </div>
                            </div>
                        )}

                        <AppearanceEditor
                            styles={s.styles || {}}
                            onChange={newStyles => updateSection(idx, { styles: newStyles })}
                            colorFields={SEC_COLORS}
                            features={SEC_FEATURES}
                        />
                    </div>
                )}
            </div>
        );
    };

    // ──────────────────────────────────────────────
    // Loading state
    // ──────────────────────────────────────────────
    if (loading) {
        return (
            <div className={embedded ? 'p-6' : 'max-w-6xl mx-auto p-6'}>
                <div className="flex items-center justify-center py-20 text-gray-400"><Loader2 size={24} className="animate-spin mr-3" /> Loading service pages...</div>
            </div>
        );
    }

    // ──────────────────────────────────────────────
    // Service List View
    // ──────────────────────────────────────────────
    if (!activeService) {
        return (
            <div className={embedded ? 'p-6' : 'max-w-6xl mx-auto p-6'}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Service Pages Manager</h1>
                        <p className="text-[var(--text-secondary)]">Manage content and inquiry forms for each service detail page.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(service => {
                        const Icon = getIcon(service.icon);
                        return (
                            <div key={service.id} className="glass-card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => { setActiveService(service.id); setActiveTab('content'); setExpandedIdx(null); }}>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-[var(--accent-primary)] rounded-lg flex items-center justify-center"><Icon size={24} /></div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">{service.title}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{service.subtitle}</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded text-gray-500">{(service.sections || []).length} Sections</span>
                                            <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded text-gray-500">{service.fields?.length || 0} Form Fields</span>
                                            <span className="text-xs text-[var(--accent-primary)] font-medium group-hover:underline">Edit →</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ──────────────────────────────────────────────
    // Edit View
    // ──────────────────────────────────────────────
    const service = services.find(s => s.id === activeService);
    if (!service) return null;
    const Icon = getIcon(service.icon);
    const sections = service.sections || [];

    return (
        <div className={embedded ? 'p-6 space-y-6' : 'max-w-6xl mx-auto p-6 space-y-6'}>
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActiveService(null)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-gray-100 rounded-lg transition-all"><ArrowLeft size={20} /></button>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--accent-primary)]">{service.title}</h1>
                        <p className="text-sm text-[var(--text-secondary)]">Manage page content sections and inquiry form</p>
                    </div>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-save px-6">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-2 overflow-x-auto">
                <button onClick={() => setActiveTab('content')}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === 'content' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    Page Content & Sections
                </button>
                <button onClick={() => setActiveTab('form')}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === 'form' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    Inquiry Form Builder
                </button>
            </div>

            {activeTab === 'content' ? (
                <div className="space-y-6">
                    {/* Sections Editor */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Content Sections</h3>
                            <button onClick={() => setShowAddModal(true)} className="btn-save px-4 py-2.5 text-sm"><Plus size={16} /> Add Section</button>
                        </div>

                        {sections.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm font-medium">No content sections yet</p>
                                <p className="text-xs mt-1">Click "Add Section" to create rich content blocks.</p>
                            </div>
                        ) : (
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="serviceSections">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                            {sections.map((s, idx) => (
                                                <Draggable key={s.id} draggableId={s.id} index={idx}>
                                                    {(prov, snap) => (
                                                        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                                                            className={`transition-all ${snap.isDragging ? 'opacity-90 scale-[1.01] z-50' : ''}`}>
                                                            {renderSectionEditor(s, idx)}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="glass-card p-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Service Inquiry Form</h2>
                                <p className="text-[var(--text-secondary)]">Customize the fields your potential clients need to fill out for this specific service.</p>
                            </div>
                            <FormBuilder fields={service.fields || []} onChange={newFields => updateService(service.id, 'fields', newFields)} />
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <div className="max-w-4xl mx-auto">
                            <FormAppearanceEditor
                                formStyles={service.formStyles || {}}
                                onChange={newStyles => updateService(service.id, 'formStyles', newStyles)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Add Section Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold">Add Content Section</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="label">Section Title</label><input value={newForm.title} onChange={e => setNewForm(p => ({ ...p, title: e.target.value }))} className="input-field font-bold" placeholder="e.g. Why Choose Us" /></div>
                                <div><label className="label">Subtitle</label><input value={newForm.subtitle} onChange={e => setNewForm(p => ({ ...p, subtitle: e.target.value }))} className="input-field" placeholder="Brief description..." /></div>
                            </div>
                            <LayoutPicker value={newForm.layoutType} onChange={v => setNewForm(p => ({ ...p, layoutType: v }))} />
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
                            <button onClick={addSection} className="btn-save px-5 py-2.5 text-sm">Create Section</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceContentManager;
