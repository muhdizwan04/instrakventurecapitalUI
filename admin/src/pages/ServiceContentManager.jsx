import React, { useState, useEffect } from 'react';
import { List, Save, ArrowLeft, Edit2, Plus, Trash2, Briefcase, FileText, TrendingUp, Building2, GripVertical, ChevronDown, ChevronUp, Loader2, Globe, Shield, Landmark, Coins, Gem, Users, ShieldCheck, PieChart, BarChart3, Settings2, Eye, EyeOff } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import FormBuilder from '../components/FormBuilder';

const ServiceContentManager = () => {
    const [activeService, setActiveService] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    const [editingLabel, setEditingLabel] = useState(null);

    // Click-to-edit section label component
    const EditableSectionLabel = ({ serviceId, labelKey, defaultText }) => {
        const isEditing = editingLabel === labelKey;
        const currentValue = services.find(s => s.id === serviceId)?.sectionLabels?.[labelKey] || defaultText;
        if (isEditing) {
            return (
                <div className="flex items-center gap-1.5">
                    <input
                        type="text"
                        autoFocus
                        value={currentValue}
                        onChange={(e) => {
                            const svc = services.find(s => s.id === serviceId);
                            handleUpdateService(serviceId, 'sectionLabels', { ...svc?.sectionLabels, [labelKey]: e.target.value });
                        }}
                        onBlur={() => setEditingLabel(null)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setEditingLabel(null); }}
                        className="font-bold text-[var(--text-primary)] bg-white px-2 py-1 rounded border-2 border-[var(--accent-primary)] outline-none text-base"
                    />
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5 group/label cursor-pointer" onClick={() => setEditingLabel(labelKey)}>
                <h3 className="font-bold text-[var(--text-primary)] text-base">{currentValue}</h3>
                <Edit2 size={14} className="text-gray-400 group-hover/label:text-[var(--accent-primary)] transition-colors" />
            </div>
        );
    };

    // Default data for all 12 service detail pages
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
            ],
            formFields: ['fullName', 'email', 'companyName', 'phone', 'servicesInterested', 'annualRevenueRange', 'needs']
        },
        {
            id: 'equity-financing',
            title: 'Equity Financing (EF)',
            subtitle: 'Strategic capital injection through equity investment for high-growth companies seeking expansion and market leadership.',
            icon: 'TrendingUp',
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
            overview: {
                heading: 'Funding Roadmap 2022-2025',
                description: 'Our structured 5-stage equity financing roadmap guides companies from due diligence to IPO exit strategy.'
            },
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
                { label: 'Facility Line', value: 'USD 100 Million' },
                { label: 'Equity Split', value: '60% Investee / 40% IVCB' },
                { label: 'Margin Financing', value: 'Up to 80%' },
                { label: 'Maximum Tenure', value: '5 Years' },
                { label: 'Service Fee', value: '10% on Approval' },
                { label: 'Target Revenue', value: '6x Capital (USD 600M)' }
            ],
            sectors: ['Oil & Gas', 'Property Development', 'Education', 'Logistics', 'Automotive', 'Manufacturing', 'Construction', 'Digital Technology'],
            formFields: ['companyName', 'industrySector', 'founderName', 'email', 'annualRevenue', 'fundingSought', 'lookingFor', 'companyOverview', 'pitchDeckUrl']
        },
        {
            id: 'real-estate-financing',
            title: 'Real Estate Financing (REF)',
            subtitle: 'Funding for high-yield property developments and real estate acquisitions.',
            icon: 'Building2',
            fields: [
                { id: 'companyName', label: 'Developer/Company Name', type: 'text', required: true, width: 'half', placeholder: 'Company name' },
                { id: 'contactPerson', label: 'Contact Person', type: 'text', required: true, width: 'half', placeholder: 'Your name' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half', placeholder: 'your@email.com' },
                { id: 'phone', label: 'Phone Number', type: 'tel', required: true, width: 'half', placeholder: '+60 ...' },
                { id: 'propertyType', label: 'Property Type', type: 'select', required: true, width: 'half', options: ['Commercial', 'Residential', 'Mixed-Use', 'Industrial'] },
                { id: 'financingType', label: 'Financing Type', type: 'select', required: true, width: 'half', options: ['Development Loan', 'Bridge Financing', 'Acquisition Capital'] },
                { id: 'projectLocation', label: 'Project Location', type: 'text', required: true, width: 'full', placeholder: 'City/State' },
                { id: 'projectValue', label: 'Project Value (RM)', type: 'text', required: true, width: 'half', placeholder: 'Total project value' },
                { id: 'financingRequired', label: 'Financing Required (RM)', type: 'text', required: true, width: 'half', placeholder: 'Amount needed' },
                { id: 'projectDescription', label: 'Project Description', type: 'textarea', required: true, width: 'full', placeholder: 'Describe your project...' }
            ],
            overview: {
                heading: 'Financing Solutions',
                description: 'Comprehensive financing solutions for property development, acquisition, and bridge financing.'
            },
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
                { label: 'Loan-to-Value (LTV)', value: 'Up to 70%' },
                { label: 'Interest Rate', value: 'From 6.5% p.a.' },
                { label: 'Loan Tenure', value: '12 - 60 months' },
                { label: 'Minimum Loan', value: 'RM 1 Million' },
                { label: 'Maximum Loan', value: 'RM 100 Million' }
            ],
            formFields: ['companyName', 'contactPerson', 'email', 'phone', 'propertyType', 'financingType', 'projectLocation', 'projectValue', 'financingRequired', 'projectDescription']
        },
        {
            id: 'reits',
            title: 'Real Estate Investment Trust (REITs)',
            subtitle: 'Institutional-grade real estate investment opportunities through structured REIT vehicles.',
            icon: 'Landmark',
            fields: [
                { id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half' },
                { id: 'phone', label: 'Phone Number', type: 'tel', required: true, width: 'half' },
                { id: 'investorType', label: 'Investor Type', type: 'select', required: true, width: 'half', options: ['Individual', 'Institutional', 'Family Office', 'Corporate'] },
                { id: 'investmentAmount', label: 'Intended Investment Amount (RM)', type: 'text', required: true, width: 'full' },
                { id: 'message', label: 'Additional Requirements', type: 'textarea', required: false, width: 'full' }
            ],
            overview: { heading: 'Institutional REIT Solutions', description: 'Access high-quality real estate portfolios through our managed REIT investment structures.' },
            formFields: ['fullName', 'email', 'phone', 'investorType', 'investmentAmount', 'message']
        },
        {
            id: 'share-financing',
            title: 'Share Financing (SF)',
            subtitle: 'Strategic share financing solutions for shareholders and institutional investors.',
            icon: 'BarChart3',
            fields: [
                { id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half', placeholder: 'Enter your full name' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half', placeholder: 'your@email.com' },
                { id: 'phone', label: 'Phone Number', type: 'tel', required: true, width: 'half', placeholder: '+60 ...' },
                { id: 'companyName', label: 'Company Name', type: 'text', required: true, width: 'half' },
                { id: 'stockExchange', label: 'Stock Exchange', type: 'select', required: true, width: 'half', options: ['Bursa Malaysia', 'SGX', 'HKEX', 'NYSE', 'NASDAQ', 'LSE', 'Other'] },
                { id: 'shareValue', label: 'Estimated Share Value (Indicative)', type: 'text', required: true, width: 'half' },
                { id: 'financingAmount', label: 'Financing Amount Required', type: 'text', required: true, width: 'half' },
                { id: 'purpose', label: 'Purpose of Financing', type: 'select', required: true, width: 'full', options: ['Working Capital', 'Expansion', 'Debt Restructuring', 'Liquidity Release', 'Other'] },
                { id: 'portfolioOverview', label: 'Portfolio Overview / Specific Requirements', type: 'textarea', required: true, width: 'full' }
            ],
            overview: { heading: 'Strategic Share Financing', description: 'Unlock liquidity from your equity holdings through our structured share financing solutions.' },
            formFields: ['fullName', 'email', 'phone', 'companyName', 'stockExchange', 'shareValue', 'financingAmount', 'purpose', 'portfolioOverview']
        },
        {
            id: 'merger-acquisition',
            title: 'Merger & Acquisition (M&A)',
            subtitle: 'Expert guidance through complex M&A transactions, negotiations, and strategic integrations.',
            icon: 'Users',
            fields: [
                { id: 'companyName', label: 'Company Name', type: 'text', required: true, width: 'half' },
                { id: 'contactPerson', label: 'Contact Person', type: 'text', required: true, width: 'half' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half' },
                { id: 'phone', label: 'Phone Number', type: 'tel', required: true, width: 'half' },
                { id: 'transactionType', label: 'Transaction Interest', type: 'select', required: true, width: 'full', options: ['Sell-side Advisory', 'Buy-side Advisory', 'Merger', 'Strategic Alliance', 'Joint Venture'] },
                { id: 'industry', label: 'Industry / Sector', type: 'text', required: true, width: 'half' },
                { id: 'valuationRange', label: 'Estimated Company Valuation', type: 'text', required: true, width: 'half' },
                { id: 'message', label: 'Brief Overview of Transaction Goals', type: 'textarea', required: true, width: 'full' }
            ],
            overview: { heading: 'Expert M&A Advisory', description: 'Strategize and execute complex transactions with our experienced M&A team.' },
            formFields: ['companyName', 'contactPerson', 'email', 'phone', 'transactionType', 'industry', 'valuationRange', 'message']
        },
        {
            id: 'tokenization',
            title: 'Tokenization',
            subtitle: 'Digital asset tokenization solutions for modern investment structures.',
            icon: 'Coins',
            fields: [
                { id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half' },
                { id: 'assetType', label: 'Asset Type to Tokenize', type: 'select', required: true, width: 'half', options: ['Real Estate', 'Art/Collectibles', 'Corporate Equity', 'Revenue Streams', 'Other'] },
                { id: 'assetValue', label: 'Estimated Asset Value', type: 'text', required: true, width: 'half' },
                { id: 'message', label: 'Project Description', type: 'textarea', required: true, width: 'full' }
            ],
            overview: { heading: 'Digital Asset Tokenization', description: 'Fractionalize and digitize value through our institutional-grade tokenization platform.' },
            formFields: ['fullName', 'email', 'assetType', 'assetValue', 'message']
        },
        {
            id: 'asset-insurance',
            title: 'Asset Insurance (AI)',
            subtitle: 'Comprehensive asset protection and insurance solutions for institutional clients.',
            icon: 'Shield',
            fields: [
                { id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half' },
                { id: 'assetCategory', label: 'Asset Category', type: 'select', required: true, width: 'half', options: ['Commercial Property', 'High-Value Equipment', 'Financial Assets', 'Marine/Transit', 'Other'] },
                { id: 'coverageNeeds', label: 'Specific Coverage Requirements', type: 'textarea', required: true, width: 'full' }
            ],
            overview: { heading: 'Institutional Asset Insurance', description: 'Protect your capital and physical assets with our specialized insurance advisory.' },
            formFields: ['fullName', 'email', 'assetCategory', 'coverageNeeds']
        },
        {
            id: 'ppli',
            title: 'Private Placement Life Insurance (PPLI)',
            subtitle: 'Sophisticated life insurance solutions for wealth preservation and estate planning.',
            icon: 'ShieldCheck',
            fields: [
                { id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half' },
                { id: 'wealthGoals', label: 'Primary Wealth Goals', type: 'select', required: true, width: 'full', options: ['Tax Efficiency', 'Estate Planning', 'Asset Protection', 'Investment Flexibility'] },
                { id: 'message', label: 'Additional Information', type: 'textarea', required: false, width: 'full' }
            ],
            overview: { heading: 'Private Placement Life Insurance', description: 'Integrate insurance into your global wealth management and tax strategy.' },
            formFields: ['fullName', 'email', 'wealthGoals', 'message']
        },
        {
            id: 'gig',
            title: 'Global Investment Gateway (GIG)',
            subtitle: 'A Strategic Capital Access & Global Investor Connectivity Platform by Instrak Venture Capital Berhad',
            icon: 'Globe',
            fields: [
                { id: 'heading_a', label: 'SECTION A — COMPANY PROFILE', type: 'heading' },
                { id: 'companyName', label: 'Legal Company Name', type: 'text', required: true, width: 'half' },
                { id: 'countryOfIncorporation', label: 'Country of Incorporation', type: 'text', required: true, width: 'half' },
                { id: 'regNumber', label: 'Registration Number', type: 'text', required: true, width: 'half' },
                { id: 'yearEstablished', label: 'Year Established', type: 'text', required: true, width: 'half' },
                { id: 'heading_contact', label: 'CONTACT INFORMATION', type: 'heading' },
                { id: 'contactPerson', label: 'Contact Person', type: 'text', required: true, width: 'half' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half' },
                { id: 'phone', label: 'Phone Number', type: 'tel', required: true, width: 'half' },
                { id: 'message', label: 'Additional Information', type: 'textarea', required: false, width: 'full' }
            ],
            executiveOverview: 'Global Investment Gateway (GIG) is an exclusive, subscription-based platform designed to enable qualified companies to gain structured access to global investors, institutional capital providers, family offices, and strategic partners through the international network of Instrak Venture Capital Berhad (IVC).',
            eligibility: [
                'Legally incorporated and in good standing',
                'Clear, scalable business model',
                'Defined capital or strategic growth objectives',
                'Acceptable governance and management credibility',
                'Agreement to full KYC, AML, and due diligence requirements'
            ],
            valueProposition: [
                'Access to curated global investor networks',
                'Strategic capital positioning and readiness',
                'Targeted investor matching (not mass outreach)',
                "Enhanced global credibility through IVC's institutional lens"
            ],
            subscriptionTiers: [
                { tier: 'GIG Essential', price: 'USD __ / year' },
                { tier: 'GIG Professional', price: 'USD __ / year' },
                { tier: 'GIG Institutional', price: 'USD __ / year' }
            ],
            formFields: ['companyName', 'contactPerson', 'email', 'phone', 'website', 'businessModel', 'capitalObjective', 'message']
        },
        {
            id: 'private-wealth',
            title: 'Private Wealth Investment (The Luxury Dubai)',
            subtitle: 'Exclusive private wealth investment opportunities in premium real estate.',
            icon: 'Gem',
            fields: [
                { id: 'fullName', label: 'Full Name', type: 'text', required: true, width: 'half' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half' },
                { id: 'interestType', label: 'Investment Interest', type: 'select', required: true, width: 'full', options: ['Off-Plan Property', 'Secondary Market', 'Luxury Portfolios', 'Commercial/Hotel Assets'] },
                { id: 'budget', label: 'Budget Range (USD)', type: 'text', required: true, width: 'half' },
                { id: 'message', label: 'Specific Requirements', type: 'textarea', required: false, width: 'full' }
            ],
            overview: { heading: 'The Luxury Dubai Investments', description: 'Exclusive access to Dubai\'s most prestigious real estate and private wealth opportunities.' },
            formFields: ['fullName', 'email', 'interestType', 'budget', 'message']
        },
        {
            id: 'aum',
            title: 'Asset Under Management (AUM)',
            subtitle: 'Partner with Instrak Venture Capital Berhad to optimise capital, enhance portfolio performance, and achieve long-term strategic objectives with a disciplined, mandate-driven investment framework.',
            icon: 'PieChart',
            fields: [
                { id: 'heading_a', label: 'SECTION A — CLIENT PROFILE', type: 'heading' },
                { id: 'legalName', label: 'Legal Name of Entity / Individual', type: 'text', required: true, width: 'half' },
                { id: 'country', label: 'Country of Incorporation / Residence', type: 'text', required: true, width: 'half' },
                { id: 'clientClassification', label: 'Client Classification', type: 'select', required: true, width: 'full', options: ['Institution', 'Corporation', 'Family Office', 'UHNW / Principal'] },
                { id: 'primaryContact', label: 'Primary Contact Person & Designation', type: 'text', required: true, width: 'full' },
                { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half' },
                { id: 'phone', label: 'Contact Number', type: 'tel', required: true, width: 'half' },
                { id: 'heading_b', label: 'SECTION B — OWNERSHIP & GOVERNANCE', type: 'heading' },
                { id: 'beneficialOwners', label: 'Ultimate Beneficial Owner(s)', type: 'textarea', required: true, width: 'full' },
                { id: 'isDecisionMaker', label: 'Are you the final investment decision-maker?', type: 'select', required: true, width: 'half', options: ['Yes', 'No'] },
                { id: 'approvingAuthority', label: 'If No, please specify approving authority', type: 'text', required: false, width: 'half' },
                { id: 'heading_c', label: 'SECTION C — AUM MANDATE OVERVIEW', type: 'heading' },
                { id: 'aumSize', label: 'Indicative AUM Size (USD)', type: 'text', required: true, width: 'half' },
                { id: 'mandateType', label: 'Intended Mandate Type', type: 'select', required: true, width: 'half', options: ['Discretionary', 'Advisory', 'Co-Investment', 'Structured'] },
                { id: 'primaryObjective', label: 'Primary Objective', type: 'select', required: true, width: 'half', options: ['Capital Preservation', 'Growth', 'Income', 'Strategic Allocation'] },
                { id: 'riskProfile', label: 'Risk Profile', type: 'select', required: true, width: 'half', options: ['Conservative', 'Balanced', 'Growth', 'Opportunistic'] }
            ],
            introduction: 'Instrak Venture Capital Berhad (IVC) provides exclusive Asset Under Management (AUM) services tailored for corporations, institutional investors, family offices, and ultra-high-net-worth individuals (UHNWIs). Our approach is mandate-driven, highly disciplined, and globally informed, designed to align capital with strategic priorities, risk management, and long-term value creation.',
            philosophy: [
                { title: 'Institutional Rigour', desc: 'Decisions guided by robust governance and analytical frameworks.' },
                { title: 'Global Insight', desc: 'Access to diverse markets, alternative investments, and strategic opportunities.' },
                { title: 'Tailored Solutions', desc: 'Portfolios designed to reflect objectives, risk appetite, and time horizon.' },
                { title: 'Alignment of Interests', desc: 'Mandate structures ensure client objectives remain central.' }
            ],
            services: [
                { title: 'Portfolio Management', desc: 'Multi-asset strategies, risk-adjusted returns, diversification across public, private, and alternative assets.' },
                { title: 'Capital Structuring & Deployment', desc: 'Balance sheet optimisation, bespoke financing, strategic allocation.' },
                { title: 'Institutional Advisory', desc: 'M&A guidance, exclusive opportunities, risk & regulatory advisory.' },
                { title: 'Reporting & Transparency', desc: 'Regular performance reports, governance dashboards, full compliance oversight.' }
            ],
            whoWeServe: [
                { title: 'Global Corporations', desc: 'Capital optimisation & strategic deployment.' },
                { title: 'Institutional Investors', desc: 'Pension funds, endowments, sovereign wealth funds.' },
                { title: 'Family Offices & UHNWIs', desc: 'Wealth preservation, growth, bespoke investment solutions.' },
                { title: 'Shareholders & Principals', desc: 'Structured instruments, Stock Loans.' }
            ],
            whyChoose: [
                { title: 'Global Reach', desc: 'Access to international markets & opportunities.' },
                { title: 'Institutional Discipline', desc: 'Structured governance & risk management.' },
                { title: 'High-Touch Service', desc: 'Dedicated portfolio teams for every client.' },
                { title: 'Confidentiality & Trust', desc: 'Strict fiduciary standards & privacy.' }
            ],
            disclaimer: 'IVC provides information for general purposes only. This does not constitute an offer, solicitation, or recommendation for investment.',
            formFields: ['fullName', 'email', 'organization', 'phone', 'investorType', 'message']
        }
    ];

    const { content, loading, saving, saveContent } = useContent('service_pages', { pages: defaultServices });
    const [services, setServices] = useState(defaultServices);

    useEffect(() => {
        if (content?.pages && !loading) {
            // Ensure every service has a fields array for the builder and migrate subtitle to introduction if needed
            const mergedServices = defaultServices.map(defaultSvc => {
                const dbSvc = content.pages.find(p => p.id === defaultSvc.id);
                if (dbSvc) {
                    return {
                        ...defaultSvc,
                        ...dbSvc,
                        // Priority to DB fields if they exist, otherwise use defaults
                        fields: (dbSvc.fields && dbSvc.fields.length > 0) ? dbSvc.fields : (defaultSvc.fields || []),
                        introduction: dbSvc.introduction || dbSvc.subtitle || defaultSvc.subtitle || ''
                    };
                }
                return defaultSvc;
            });
            setServices(mergedServices);
        }
    }, [content, loading]);

    const getIcon = (iconName) => {
        const icons = { Briefcase, FileText, TrendingUp, Building2, Globe, Shield, Landmark, Coins, Gem, Users, ShieldCheck, PieChart, BarChart3 };
        return icons[iconName] || Briefcase;
    };

    const handleSave = async () => {
        await saveContent({ pages: services });
    };

    const handleUpdateService = (serviceId, field, value) => {
        setServices(prev => prev.map(s =>
            s.id === serviceId ? { ...s, [field]: value } : s
        ));
    };

    const handleUpdateOverview = (serviceId, field, value) => {
        setServices(prev => prev.map(s =>
            s.id === serviceId ? { ...s, overview: { ...s.overview, [field]: value } } : s
        ));
    };

    const handleUpdateArrayItem = (serviceId, arrayName, index, field, value) => {
        setServices(prev => prev.map(s => {
            if (s.id !== serviceId) return s;
            const newArray = [...s[arrayName]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...s, [arrayName]: newArray };
        }));
    };

    const handleAddArrayItem = (serviceId, arrayName, template) => {
        setServices(prev => prev.map(s => {
            if (s.id !== serviceId) return s;
            return { ...s, [arrayName]: [...s[arrayName], template] };
        }));
    };

    const handleDeleteArrayItem = (serviceId, arrayName, index) => {
        setServices(prev => prev.map(s => {
            if (s.id !== serviceId) return s;
            const newArray = [...s[arrayName]];
            newArray.splice(index, 1);
            return { ...s, [arrayName]: newArray };
        }));
    };

    // All possible section keys
    const ALL_SECTION_KEYS = [
        'subtitle', 'services', 'overview', 'philosophy', 'whoWeServe', 'approach', 'whyChoose', 'disclaimer',
        'ourRole', 'whoNeeds', 'keyBenefits',
        'roadmapStages', 'sectors',
        'financingTerms', 'financingTypes', 'propertyTypes', 'loanTerms',
        'executiveOverview', 'eligibility', 'valueProposition', 'subscriptionTiers',
        'offerings', 'process'
    ];

    // Check if section key exists on a service
    const sectionExists = (svc, key) => {
        if (key === 'subtitle') return true;
        if (key === 'disclaimer') return svc.disclaimer !== undefined || svc.id === 'aum';
        if (key === 'executiveOverview') return svc.executiveOverview !== undefined;
        return !!svc[key];
    };

    // Get the ordered section keys for a service
    const getActiveSectionKeys = (svc) => {
        const available = ALL_SECTION_KEYS.filter(k => sectionExists(svc, k));
        if (svc.sectionOrder) {
            const ordered = svc.sectionOrder.filter(k => available.includes(k));
            const missing = available.filter(k => !ordered.includes(k));
            return [...ordered, ...missing];
        }
        return available;
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const arrayName = source.droppableId;

        // Section-level reordering
        if (arrayName === 'contentSections') {
            setServices(prev => prev.map(s => {
                if (s.id !== activeService) return s;
                const currentOrder = getActiveSectionKeys(s);
                const newOrder = Array.from(currentOrder);
                const [moved] = newOrder.splice(source.index, 1);
                newOrder.splice(destination.index, 0, moved);
                return { ...s, sectionOrder: newOrder };
            }));
            return;
        }

        // Item-level reordering within a section
        setServices(prev => prev.map(s => {
            if (s.id !== activeService) return s;
            const newArray = Array.from(s[arrayName]);
            const [reorderedItem] = newArray.splice(source.index, 1);
            newArray.splice(destination.index, 0, reorderedItem);
            return { ...s, [arrayName]: newArray };
        }));
    };

    // Toggle section visibility (hide/show)
    const toggleSectionVisibility = (serviceId, sectionKey) => {
        setServices(prev => prev.map(s => {
            if (s.id !== serviceId) return s;
            const hidden = s.hiddenSections || [];
            const isHidden = hidden.includes(sectionKey);
            return {
                ...s,
                hiddenSections: isHidden
                    ? hidden.filter(k => k !== sectionKey)
                    : [...hidden, sectionKey]
            };
        }));
    };

    const renderSection = (key, service, dragHandleProps) => {
        const isHidden = (service.hiddenSections || []).includes(key);

        // Helper: wraps section content with drag handle + hide/show toggle
        const wrapSection = (content) => (
            <div className={`space-y-4 border-b border-[var(--border-light)] pb-6 mb-6 p-4 rounded-lg transition-all relative ${isHidden ? 'bg-gray-100/80 opacity-60 border-dashed' : 'bg-white/50 hover:bg-white/80'}`}>
                {/* Drag Handle */}
                <div className="absolute left-2 top-4" {...dragHandleProps}>
                    <div className="text-gray-400 hover:text-[var(--accent-primary)] cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors">
                        <GripVertical size={20} />
                    </div>
                </div>
                {/* Hide/Show Toggle */}
                <div className="absolute right-3 top-3 flex items-center gap-2">
                    {isHidden && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Hidden</span>
                    )}
                    <button
                        onClick={() => toggleSectionVisibility(service.id, key)}
                        className={`p-1.5 rounded-lg transition-all ${isHidden ? 'text-orange-500 hover:bg-orange-100 bg-orange-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                        title={isHidden ? 'Show this section on the website' : 'Hide this section from the website'}
                    >
                        {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                <div className="pl-10 pr-20">
                    {content}
                </div>
            </div>
        );

        switch (key) {
            case 'subtitle':
                return wrapSection(
                    <>
                        <div className="mb-4"><EditableSectionLabel serviceId={service.id} labelKey="subtitle" defaultText="Introduction & Subtitle" /></div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tagline / Subtitle</label>
                                <input
                                    type="text"
                                    value={service.subtitle || ''}
                                    onChange={(e) => handleUpdateService(service.id, 'subtitle', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    placeholder="Short tagline for the service..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Introduction Text</label>
                                <textarea
                                    rows={4}
                                    value={service.introduction || ''}
                                    onChange={(e) => handleUpdateService(service.id, 'introduction', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    placeholder="Detailed introduction paragraph..."
                                />
                            </div>
                        </div>
                    </>
                );
            case 'overview':
                if (!service.overview) return null;
                return wrapSection(
                    <>
                        <div className="mb-4"><EditableSectionLabel serviceId={service.id} labelKey="overview" defaultText="Overview Section" /></div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Heading</label>
                                <input
                                    type="text"
                                    value={service.overview.heading || ''}
                                    onChange={(e) => handleUpdateService(service.id, 'overview', { ...service.overview, heading: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    placeholder="Overview Heading"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={service.overview.description || ''}
                                    onChange={(e) => handleUpdateService(service.id, 'overview', { ...service.overview, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    placeholder="Overview Description..."
                                />
                            </div>
                        </div>
                    </>
                );
            case 'services':
                if (!service.services) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="services" defaultText="Services / Key Features" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'services', { title: 'New Service', desc: 'Description...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Service
                            </button>
                        </div>
                        <Droppable droppableId="services">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {service.services.map((item, index) => (
                                        <Draggable key={index} draggableId={`service-${index}`} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps}
                                                    className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 ${snapshot.isDragging ? 'shadow-lg border-[var(--accent-primary)]' : 'border border-transparent'}`}>
                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab pt-2"><GripVertical size={16} /></div>
                                                    <div className="flex-1 space-y-2">
                                                        <input type="text" value={item.title} onChange={(e) => handleUpdateArrayItem(service.id, 'services', index, 'title', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Title" />
                                                        <textarea rows={2} value={item.desc} onChange={(e) => handleUpdateArrayItem(service.id, 'services', index, 'desc', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Description" />
                                                    </div>
                                                    <button onClick={() => handleDeleteArrayItem(service.id, 'services', index)} className="text-gray-400 hover:text-red-500 self-start pt-2"><Trash2 size={16} /></button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </>
                );
            case 'philosophy':
                if (!service.philosophy) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="philosophy" defaultText="Our Philosophy" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'philosophy', { title: 'New Item', desc: 'Description...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                        <Droppable droppableId="philosophy">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {service.philosophy.map((item, index) => (
                                        <Draggable key={index} draggableId={`philosophy-${index}`} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps}
                                                    className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 ${snapshot.isDragging ? 'shadow-lg border-[var(--accent-primary)]' : 'border border-transparent'}`}>
                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab pt-2"><GripVertical size={16} /></div>
                                                    <div className="flex-1 space-y-2">
                                                        <input type="text" value={item.title} onChange={(e) => handleUpdateArrayItem(service.id, 'philosophy', index, 'title', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Title" />
                                                        <textarea rows={2} value={item.desc} onChange={(e) => handleUpdateArrayItem(service.id, 'philosophy', index, 'desc', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Description" />
                                                    </div>
                                                    <button onClick={() => handleDeleteArrayItem(service.id, 'philosophy', index)} className="text-gray-400 hover:text-red-500 self-start pt-2"><Trash2 size={16} /></button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </>
                );
            case 'whoWeServe':
                if (!service.whoWeServe) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="whoWeServe" defaultText="Who We Serve" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'whoWeServe', { title: 'New Client Type', desc: 'Description...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Target
                            </button>
                        </div>
                        <Droppable droppableId="whoWeServe">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {service.whoWeServe.map((item, index) => (
                                        <Draggable key={index} draggableId={`whoWeServe-${index}`} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps}
                                                    className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 ${snapshot.isDragging ? 'shadow-lg border-[var(--accent-primary)]' : 'border border-transparent'}`}>
                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab pt-2"><GripVertical size={16} /></div>
                                                    <div className="flex-1 space-y-2">
                                                        <input type="text" value={item.title} onChange={(e) => handleUpdateArrayItem(service.id, 'whoWeServe', index, 'title', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Client Type" />
                                                        <input type="text" value={item.desc} onChange={(e) => handleUpdateArrayItem(service.id, 'whoWeServe', index, 'desc', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Description" />
                                                    </div>
                                                    <button onClick={() => handleDeleteArrayItem(service.id, 'whoWeServe', index)} className="text-gray-400 hover:text-red-500 self-start pt-2"><Trash2 size={16} /></button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </>
                );
            case 'approach':
                if (!service.approach) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="approach" defaultText="Our Approach" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'approach', { title: 'New Step', desc: 'Description...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Step
                            </button>
                        </div>
                        <Droppable droppableId="approach">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {service.approach.map((item, index) => (
                                        <Draggable key={index} draggableId={`approach-${index}`} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps}
                                                    className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 items-center ${snapshot.isDragging ? 'shadow-lg border-[var(--accent-primary)]' : 'border border-transparent'}`}>
                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab"><GripVertical size={16} /></div>
                                                    <span className="w-10 h-10 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{index + 1}</span>
                                                    <div className="flex-1 space-y-2">
                                                        <input type="text" value={item.title} onChange={(e) => handleUpdateArrayItem(service.id, 'approach', index, 'title', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Step Title" />
                                                        <input type="text" value={item.desc} onChange={(e) => handleUpdateArrayItem(service.id, 'approach', index, 'desc', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Step Description" />
                                                    </div>
                                                    <button onClick={() => handleDeleteArrayItem(service.id, 'approach', index)} className="text-gray-400 hover:text-red-500 self-start pt-2"><Trash2 size={16} /></button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </>
                );
            case 'whyChoose':
                if (!service.whyChoose) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="whyChoose" defaultText="Why Choose IVC" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'whyChoose', { title: 'New Reason', desc: 'Description...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Reason
                            </button>
                        </div>
                        <Droppable droppableId="whyChoose">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {service.whyChoose.map((item, index) => (
                                        <Draggable key={index} draggableId={`whyChoose-${index}`} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps}
                                                    className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 ${snapshot.isDragging ? 'shadow-lg border-[var(--accent-primary)]' : 'border border-transparent'}`}>
                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab pt-2"><GripVertical size={16} /></div>
                                                    <div className="flex-1 space-y-2">
                                                        <input type="text" value={item.title} onChange={(e) => handleUpdateArrayItem(service.id, 'whyChoose', index, 'title', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Title" />
                                                        <input type="text" value={item.desc} onChange={(e) => handleUpdateArrayItem(service.id, 'whyChoose', index, 'desc', e.target.value)}
                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Description" />
                                                    </div>
                                                    <button onClick={() => handleDeleteArrayItem(service.id, 'whyChoose', index)} className="text-gray-400 hover:text-red-500 self-start pt-2"><Trash2 size={16} /></button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </>
                );
            case 'disclaimer':
                return wrapSection(
                    <>
                        <div className="mb-4"><EditableSectionLabel serviceId={service.id} labelKey="disclaimer" defaultText="Legal Disclaimer" /></div>
                        <textarea
                            rows={3}
                            value={service.disclaimer || ''}
                            onChange={(e) => handleUpdateService(service.id, 'disclaimer', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                            placeholder="Legal disclaimer text..."
                        />
                    </>
                );
            case 'ourRole':
                if (!service.ourRole) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="ourRole" defaultText="Our Role" />
                            <button
                                onClick={() => handleUpdateService(service.id, 'ourRole', [...service.ourRole, 'New role item'])}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Role
                            </button>
                        </div>
                        <div className="space-y-2">
                            {service.ourRole.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <span className="w-6 h-6 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{index + 1}</span>
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => {
                                            const newArr = [...service.ourRole];
                                            newArr[index] = e.target.value;
                                            handleUpdateService(service.id, 'ourRole', newArr);
                                        }}
                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                    />
                                    <button onClick={() => {
                                        const newArr = service.ourRole.filter((_, i) => i !== index);
                                        handleUpdateService(service.id, 'ourRole', newArr);
                                    }} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'whoNeeds':
                if (!service.whoNeeds) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="whoNeeds" defaultText="Who Needs This" />
                            <button
                                onClick={() => handleUpdateService(service.id, 'whoNeeds', [...service.whoNeeds, 'New audience'])}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {service.whoNeeds.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input type="text" value={item}
                                        onChange={(e) => {
                                            const newArr = [...service.whoNeeds];
                                            newArr[index] = e.target.value;
                                            handleUpdateService(service.id, 'whoNeeds', newArr);
                                        }}
                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm" />
                                    <button onClick={() => handleUpdateService(service.id, 'whoNeeds', service.whoNeeds.filter((_, i) => i !== index))}
                                        className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'keyBenefits':
                if (!service.keyBenefits) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="keyBenefits" defaultText="Key Benefits" />
                            <button
                                onClick={() => handleUpdateService(service.id, 'keyBenefits', [...service.keyBenefits, 'New benefit'])}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {service.keyBenefits.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input type="text" value={item}
                                        onChange={(e) => {
                                            const newArr = [...service.keyBenefits];
                                            newArr[index] = e.target.value;
                                            handleUpdateService(service.id, 'keyBenefits', newArr);
                                        }}
                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm" />
                                    <button onClick={() => handleUpdateService(service.id, 'keyBenefits', service.keyBenefits.filter((_, i) => i !== index))}
                                        className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'roadmapStages':
                if (!service.roadmapStages) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="roadmapStages" defaultText="Funding Roadmap Stages" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'roadmapStages', { stage: String(service.roadmapStages.length + 1), title: 'New Stage', duration: '', investment: '', items: [] })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Stage
                            </button>
                        </div>
                        <div className="space-y-3">
                            {service.roadmapStages.map((item, index) => (
                                <div key={index} className="p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 items-start border border-transparent">
                                    <span className="w-10 h-10 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{item.stage}</span>
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-3 gap-2">
                                            <input type="text" value={item.title} placeholder="Stage Title"
                                                onChange={(e) => handleUpdateArrayItem(service.id, 'roadmapStages', index, 'title', e.target.value)}
                                                className="px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" />
                                            <input type="text" value={item.duration} placeholder="Duration"
                                                onChange={(e) => handleUpdateArrayItem(service.id, 'roadmapStages', index, 'duration', e.target.value)}
                                                className="px-3 py-2 rounded border border-[var(--border-light)] text-sm" />
                                            <input type="text" value={item.investment} placeholder="Investment"
                                                onChange={(e) => handleUpdateArrayItem(service.id, 'roadmapStages', index, 'investment', e.target.value)}
                                                className="px-3 py-2 rounded border border-[var(--border-light)] text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Key Items (one per line)</label>
                                            <textarea
                                                rows={3}
                                                value={(item.items || []).join('\n')}
                                                onChange={(e) => handleUpdateArrayItem(service.id, 'roadmapStages', index, 'items', e.target.value.split('\n'))}
                                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-xs"
                                                placeholder="List key items for this stage..."
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteArrayItem(service.id, 'roadmapStages', index)}
                                        className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'financingTerms':
                if (!service.financingTerms) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="financingTerms" defaultText="Financing / Investment Terms" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'financingTerms', { label: 'New Term', value: 'Value' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Term
                            </button>
                        </div>
                        <div className="space-y-2">
                            {service.financingTerms.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => handleUpdateArrayItem(service.id, 'financingTerms', index, 'label', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                        placeholder="Label (e.g. Interest Rate)"
                                    />
                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => handleUpdateArrayItem(service.id, 'financingTerms', index, 'value', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium text-[var(--accent-secondary)]"
                                        placeholder="Value (e.g. 5%)"
                                    />
                                    <button onClick={() => handleDeleteArrayItem(service.id, 'financingTerms', index)}
                                        className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'sectors':
                if (!service.sectors) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="sectors" defaultText="Target Sectors" />
                            <button
                                onClick={() => handleUpdateService(service.id, 'sectors', [...service.sectors, 'New Sector'])}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Sector
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {service.sectors.map((sector, index) => (
                                <div key={index} className="flex items-center gap-1 bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-full border">
                                    <input type="text" value={sector}
                                        onChange={(e) => {
                                            const newArr = [...service.sectors];
                                            newArr[index] = e.target.value;
                                            handleUpdateService(service.id, 'sectors', newArr);
                                        }}
                                        className="bg-transparent text-sm w-auto min-w-[80px] outline-none" />
                                    <button onClick={() => handleUpdateService(service.id, 'sectors', service.sectors.filter((_, i) => i !== index))}
                                        className="text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'financingTypes':
                if (!service.financingTypes) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="financingTypes" defaultText="Financing Types" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'financingTypes', { title: 'New Type', desc: 'Description...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Type
                            </button>
                        </div>
                        <div className="space-y-3">
                            {service.financingTypes.map((item, index) => (
                                <div key={index} className="p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 border border-transparent">
                                    <div className="flex-1 space-y-2">
                                        <input type="text" value={item.title} onChange={(e) => handleUpdateArrayItem(service.id, 'financingTypes', index, 'title', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Type" />
                                        <textarea rows={2} value={item.desc} onChange={(e) => handleUpdateArrayItem(service.id, 'financingTypes', index, 'desc', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Description" />
                                    </div>
                                    <button onClick={() => handleDeleteArrayItem(service.id, 'financingTypes', index)} className="text-gray-400 hover:text-red-500 self-start pt-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'propertyTypes':
                if (!service.propertyTypes) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="propertyTypes" defaultText="Property Types" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'propertyTypes', { type: 'New Type', examples: 'Examples...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Type
                            </button>
                        </div>
                        <div className="space-y-2">
                            {service.propertyTypes.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input type="text" value={item.type}
                                        onChange={(e) => handleUpdateArrayItem(service.id, 'propertyTypes', index, 'type', e.target.value)}
                                        className="w-1/3 px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Type" />
                                    <input type="text" value={item.examples}
                                        onChange={(e) => handleUpdateArrayItem(service.id, 'propertyTypes', index, 'examples', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Examples" />
                                    <button onClick={() => handleDeleteArrayItem(service.id, 'propertyTypes', index)}
                                        className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'loanTerms':
                if (!service.loanTerms) return null;
                return wrapSection(
                    <>
                        <div className="mb-4"><EditableSectionLabel serviceId={service.id} labelKey="loanTerms" defaultText="Loan Terms" /></div>
                        <div className="space-y-2">
                            {service.loanTerms.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input type="text" value={item.label}
                                        onChange={(e) => handleUpdateArrayItem(service.id, 'loanTerms', index, 'label', e.target.value)}
                                        className="w-1/2 px-3 py-2 rounded border border-[var(--border-light)] text-sm" />
                                    <input type="text" value={item.value}
                                        onChange={(e) => handleUpdateArrayItem(service.id, 'loanTerms', index, 'value', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium text-[var(--accent-secondary)]" />
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'executiveOverview':
                return wrapSection(
                    <>
                        <div className="mb-4"><EditableSectionLabel serviceId={service.id} labelKey="executiveOverview" defaultText="Executive Overview" /></div>
                        <textarea
                            rows={3}
                            value={service.executiveOverview || ''}
                            onChange={(e) => handleUpdateService(service.id, 'executiveOverview', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                            placeholder="Executive overview text..."
                        />
                    </>
                );
            case 'eligibility':
                if (!service.eligibility) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="eligibility" defaultText="Eligibility Criteria" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'eligibility', { criteria: 'New Criteria', description: 'Description...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Criteria
                            </button>
                        </div>
                        <div className="space-y-3">
                            {service.eligibility.map((item, index) => (
                                <div key={index} className="p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 border border-transparent">
                                    <div className="flex-1 space-y-2">
                                        <input type="text" value={item.criteria} onChange={(e) => handleUpdateArrayItem(service.id, 'eligibility', index, 'criteria', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Criteria" />
                                        <textarea rows={2} value={item.description} onChange={(e) => handleUpdateArrayItem(service.id, 'eligibility', index, 'description', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Description" />
                                    </div>
                                    <button onClick={() => handleDeleteArrayItem(service.id, 'eligibility', index)} className="text-gray-400 hover:text-red-500 self-start pt-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'valueProposition':
                if (!service.valueProposition) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="valueProposition" defaultText="Value Proposition" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'valueProposition', { title: 'New Prop', desc: 'Description...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Prop
                            </button>
                        </div>
                        <div className="space-y-3">
                            {service.valueProposition.map((item, index) => (
                                <div key={index} className="p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 border border-transparent">
                                    <div className="flex-1 space-y-2">
                                        <input type="text" value={item.title} onChange={(e) => handleUpdateArrayItem(service.id, 'valueProposition', index, 'title', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Title" />
                                        <textarea rows={2} value={item.desc} onChange={(e) => handleUpdateArrayItem(service.id, 'valueProposition', index, 'desc', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Description" />
                                    </div>
                                    <button onClick={() => handleDeleteArrayItem(service.id, 'valueProposition', index)} className="text-gray-400 hover:text-red-500 self-start pt-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'subscriptionTiers':
                if (!service.subscriptionTiers) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="subscriptionTiers" defaultText="Subscription Tiers" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'subscriptionTiers', { name: 'New Tier', price: '$0', features: [] })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Tier
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {service.subscriptionTiers.map((tier, index) => (
                                <div key={index} className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-transparent relative group">
                                    <button onClick={() => handleDeleteArrayItem(service.id, 'subscriptionTiers', index)} 
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                    <div className="space-y-3">
                                        <input type="text" value={tier.name} onChange={(e) => handleUpdateArrayItem(service.id, 'subscriptionTiers', index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-bold" placeholder="Tier Name" />
                                        <input type="text" value={tier.price} onChange={(e) => handleUpdateArrayItem(service.id, 'subscriptionTiers', index, 'price', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm text-[var(--accent-primary)] font-medium" placeholder="Price" />
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold">Features (one per line)</label>
                                            <textarea rows={4} value={tier.features.join('\n')} 
                                                onChange={(e) => handleUpdateArrayItem(service.id, 'subscriptionTiers', index, 'features', e.target.value.split('\n'))}
                                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-xs" placeholder="Features..." />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'offerings':
                if (!service.offerings) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="offerings" defaultText="Service Offerings" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'offerings', { title: 'New Offering', items: [] })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Offering
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {service.offerings.map((offering, index) => (
                                <div key={index} className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-transparent relative group">
                                    <button onClick={() => handleDeleteArrayItem(service.id, 'offerings', index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                    <div className="space-y-3">
                                        <input type="text" value={offering.title} onChange={(e) => handleUpdateArrayItem(service.id, 'offerings', index, 'title', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-bold" placeholder="Offering Title" />
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold">Items (one per line)</label>
                                            <textarea rows={4} value={offering.items.join('\n')}
                                                onChange={(e) => handleUpdateArrayItem(service.id, 'offerings', index, 'items', e.target.value.split('\n'))}
                                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-xs" placeholder="Items..." />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'process':
                if (!service.process) return null;
                return wrapSection(
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <EditableSectionLabel serviceId={service.id} labelKey="process" defaultText="Process Steps" />
                            <button
                                onClick={() => handleAddArrayItem(service.id, 'process', { title: 'New Step', desc: 'Description...' })}
                                className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Plus size={14} /> Add Step
                            </button>
                        </div>
                        <div className="space-y-3">
                            {service.process.map((item, index) => (
                                <div key={index} className="p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 items-center border border-transparent">
                                    <span className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">{index + 1}</span>
                                    <div className="flex-1 space-y-2">
                                        <input type="text" value={item.title} onChange={(e) => handleUpdateArrayItem(service.id, 'process', index, 'title', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium" placeholder="Step Title" />
                                        <input type="text" value={item.desc} onChange={(e) => handleUpdateArrayItem(service.id, 'process', index, 'desc', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" placeholder="Step Description" />
                                    </div>
                                    <button onClick={() => handleDeleteArrayItem(service.id, 'process', index)} className="text-gray-400 hover:text-red-500 self-start pt-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                );
            default: return null;
        }
    };

    // List View
    if (!activeService) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Service Pages Manager</h1>
                        <p className="text-[var(--text-secondary)]">Manage content and inquiry forms for each service detail page.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(service => {
                        const Icon = getIcon(service.icon);
                        return (
                            <div
                                key={service.id}
                                className="glass-card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => {
                                    setActiveService(service.id);
                                    setActiveTab('content');
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">{service.title}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{service.subtitle}</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded text-gray-500">
                                                {service.fields?.length || 0} Dynamic Fields
                                            </span>
                                            <span className="text-xs text-[var(--accent-primary)] font-medium group-hover:underline">Edit Detailed Content →</span>
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

    // Edit View
    const service = services.find(s => s.id === activeService);
    if (!service) return null;
    const Icon = getIcon(service.icon);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setActiveService(null)}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--accent-primary)]">{service.title}</h1>
                        <p className="text-sm text-[var(--text-secondary)]">Manage page content sections and dynamic form fields</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-save px-6"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
            </div>

            <div className="flex border-b border-gray-200 px-2 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === 'content' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Detailed Page Content & Overview
                </button>
                <button
                    onClick={() => setActiveTab('form')}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === 'form' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Inquiry Form Builder
                </button>
            </div>

            {activeTab === 'content' ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        {/* Left Column - Editor */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-50 text-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Hero & Overview</h3>
                                </div>
                            </div>

                            {/* Hero Section */}
                            <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                                <h4 className="font-bold text-[var(--text-primary)]">Page Hero & Introduction</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Page Title</label>
                                        <input
                                            type="text"
                                            value={service.title}
                                            onChange={(e) => handleUpdateService(service.id, 'title', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Introduction</label>
                                        <p className="text-xs text-gray-500 mb-2">This text appears immediately below the hero title.</p>
                                        <textarea
                                            rows={4}
                                            value={service.introduction || ''}
                                            onChange={(e) => handleUpdateService(service.id, 'introduction', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                        />
                                    </div>
                                </div>
                            </div>




                            {/* Draggable Content Sections */}
                            <div className="mt-8 border-t border-[var(--border-light)] pt-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <List size={20} className="text-[var(--accent-primary)]" />
                                    <h4 className="font-bold text-[var(--text-primary)]">Reorderable Content Sections</h4>
                                </div>
                                <Droppable droppableId="contentSections">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6 min-h-[200px]">
                                            {getActiveSectionKeys(service).map((key, index) => (
                                                <Draggable key={key} draggableId={key} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} className={`transition-all duration-200 ${snapshot.isDragging ? 'opacity-90 scale-[1.01] rotate-1 z-50' : ''}`}>
                                                            {renderSection(key, service, provided.dragHandleProps)}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>

                        {/* Right Column - Live Preview and other lists */}
                        <div className="space-y-8">
                            {/* Other Lists (REITs, Terms etc.) */}
                            <div className="glass-card p-6">
                                {service.financingTerms && (
                                    <div className="space-y-4">
                                        <EditableSectionLabel serviceId={service.id} labelKey="financingTerms" defaultText="Financing Terms" />
                                        <Droppable droppableId="financingTerms">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                    {service.financingTerms.map((item, index) => (
                                                        <Draggable key={index} draggableId={`financingTerm-${index}`} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className={`flex gap-2 items-center ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                                >
                                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                                        <GripVertical size={16} />
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        value={item.label}
                                                                        onChange={(e) => handleUpdateArrayItem(service.id, 'financingTerms', index, 'label', e.target.value)}
                                                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={item.value}
                                                                        onChange={(e) => handleUpdateArrayItem(service.id, 'financingTerms', index, 'value', e.target.value)}
                                                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium text-[var(--accent-secondary)]"
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </DragDropContext>
            ) : activeTab === 'form' ? (
                <div className="glass-card p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Service Inquiry Form</h2>
                            <p className="text-[var(--text-secondary)]">Customize the fields your potential clients need to fill out for this specific service.</p>
                        </div>

                        <FormBuilder
                            fields={service.fields || []}
                            onChange={(newFields) => handleUpdateService(service.id, 'fields', newFields)}
                        />

                        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
                            <div className="p-2 bg-blue-100 text-[var(--accent-primary)] rounded-lg">
                                <Settings2 size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[var(--accent-primary)] mb-1">Developer Note</h4>
                                <p className="text-sm text-blue-700 leading-relaxed">
                                    The fields configured here will automatically update the inquiry form on the main website for this service.
                                    Common fields like <strong>Full Name</strong> and <strong>Email</strong> are recommended for all forms.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ServiceContentManager;
