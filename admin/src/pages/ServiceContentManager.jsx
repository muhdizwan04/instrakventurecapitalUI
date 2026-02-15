import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Edit2, Plus, Trash2, Briefcase, FileText, TrendingUp, Building2, GripVertical, ChevronDown, ChevronUp, Loader2, Globe, Shield, Landmark, Coins, Gem, Users, ShieldCheck, PieChart, BarChart3, Settings2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import FormBuilder from '../components/FormBuilder';

const ServiceContentManager = () => {
    const [activeService, setActiveService] = useState(null);
    const [activeTab, setActiveTab] = useState('content');

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

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const arrayName = source.droppableId;

        setServices(prev => prev.map(s => {
            if (s.id !== activeService) return s;
            const newArray = Array.from(s[arrayName]);
            const [reorderedItem] = newArray.splice(source.index, 1);
            newArray.splice(destination.index, 0, reorderedItem);
            return { ...s, [arrayName]: newArray };
        }));
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

                            {/* Overview Section */}
                            <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                                <h3 className="font-bold text-[var(--text-primary)]">Overview Section</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Heading</label>
                                        <input
                                            type="text"
                                            value={service.overview?.heading || ''}
                                            onChange={(e) => handleUpdateOverview(service.id, 'heading', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                                        <textarea
                                            rows={4}
                                            value={service.overview?.description || ''}
                                            onChange={(e) => handleUpdateOverview(service.id, 'description', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Sections based on service type */}
                            {service.offerings && (
                                <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-[var(--text-primary)]">Service Offerings</h3>
                                        <button
                                            onClick={() => handleAddArrayItem(service.id, 'offerings', { title: 'New Offering', desc: 'Description...' })}
                                            className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                                        >
                                            <Plus size={14} /> Add Offering
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <Droppable droppableId="offerings">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                                    {service.offerings.map((item, index) => (
                                                        <Draggable key={index} draggableId={`offering-${index}`} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 ${snapshot.isDragging ? 'shadow-lg border-[var(--accent-primary)]' : 'border border-transparent'}`}
                                                                >
                                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab pt-2">
                                                                        <GripVertical size={16} />
                                                                    </div>
                                                                    <div className="flex-1 space-y-2">
                                                                        <input
                                                                            type="text"
                                                                            value={item.title}
                                                                            onChange={(e) => handleUpdateArrayItem(service.id, 'offerings', index, 'title', e.target.value)}
                                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium"
                                                                            placeholder="Title"
                                                                        />
                                                                        <textarea
                                                                            rows={2}
                                                                            value={item.desc}
                                                                            onChange={(e) => handleUpdateArrayItem(service.id, 'offerings', index, 'desc', e.target.value)}
                                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                                            placeholder="Description"
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleDeleteArrayItem(service.id, 'offerings', index)}
                                                                        className="text-gray-400 hover:text-red-500 self-start pt-2"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
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
                            )}

                            {service.process && (
                                <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                                    <h3 className="font-bold text-[var(--text-primary)]">Process Steps</h3>
                                    <div className="space-y-3">
                                        <Droppable droppableId="process">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                                    {service.process.map((item, index) => (
                                                        <Draggable key={index} draggableId={`process-${index}`} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 items-center ${snapshot.isDragging ? 'shadow-lg border-[var(--accent-primary)]' : 'border border-transparent'}`}
                                                                >
                                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                                        <GripVertical size={16} />
                                                                    </div>
                                                                    <span className="w-10 h-10 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{item.step || item.num || index + 1}</span>
                                                                    <div className="flex-1 space-y-2">
                                                                        <input
                                                                            type="text"
                                                                            value={item.title}
                                                                            onChange={(e) => handleUpdateArrayItem(service.id, 'process', index, 'title', e.target.value)}
                                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={item.desc}
                                                                            onChange={(e) => handleUpdateArrayItem(service.id, 'process', index, 'desc', e.target.value)}
                                                                            className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                                        />
                                                                    </div>
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
                            )}

                            {/* Modular Sections Area */}
                            <div className="space-y-6 pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)]">Advanced Layout Sections</h3>
                                        <p className="text-xs text-gray-500">Add accordions, grids, or custom text blocks to further detail this service.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newSection = {
                                                id: `sec-${Date.now()}`,
                                                title: 'New Section',
                                                subtitle: '',
                                                type: 'custom',
                                                items: [],
                                                styles: { layoutType: 'standard', textAlign: 'left' }
                                            };
                                            handleUpdateService(service.id, 'sections', [...(service.sections || []), newSection]);
                                        }}
                                        className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                                    >
                                        <Plus size={14} /> Add Advanced Section
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {(service.sections || []).map((section, sIdx) => (
                                        <div key={section.id} className="p-6 bg-white rounded-xl border-2 border-dashed border-gray-200 relative group">
                                            {/* Section Controls */}
                                            <div className="absolute -top-3 right-4 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        const newSections = service.sections.filter(s => s.id !== section.id);
                                                        handleUpdateService(service.id, 'sections', newSections);
                                                    }}
                                                    className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 border border-red-100"
                                                    title="Delete Section"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400">Section Title</label>
                                                        <input
                                                            value={section.title}
                                                            onChange={(e) => {
                                                                const newSections = [...service.sections];
                                                                newSections[sIdx] = { ...section, title: e.target.value };
                                                                handleUpdateService(service.id, 'sections', newSections);
                                                            }}
                                                            className="w-full px-3 py-2 text-sm font-bold border rounded-lg"
                                                            placeholder="e.g. Key Features"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400">Layout Type</label>
                                                        <select
                                                            value={section.styles?.layoutType || 'standard'}
                                                            onChange={(e) => {
                                                                const newSections = [...service.sections];
                                                                newSections[sIdx] = { ...section, styles: { ...section.styles, layoutType: e.target.value } };
                                                                handleUpdateService(service.id, 'sections', newSections);
                                                            }}
                                                            className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50"
                                                        >
                                                            <option value="standard">Standard (Text/HTML)</option>
                                                            <option value="list">Professional List</option>
                                                            <option value="grid">Feature Grid</option>
                                                            <option value="cards">Interactive Cards</option>
                                                            <option value="accordion">Accordion (Collapse)</option>
                                                            <option value="image-grid">Premium Image Grid</option>
                                                            <option value="icon-group">Icon Connectivity Group</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-bold uppercase text-gray-400">Subtitle (Optional)</label>
                                                    <input
                                                        value={section.subtitle}
                                                        onChange={(e) => {
                                                            const newSections = [...service.sections];
                                                            newSections[sIdx] = { ...section, subtitle: e.target.value };
                                                            handleUpdateService(service.id, 'sections', newSections);
                                                        }}
                                                        className="w-full px-3 py-1.5 text-xs border rounded-lg"
                                                        placeholder="Small descriptive text below title"
                                                    />
                                                </div>

                                                {/* Content Editor based on Layout */}
                                                {(section.styles?.layoutType === 'standard' || !section.styles?.layoutType) ? (
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400">Content (HTML/Markdown)</label>
                                                        <textarea
                                                            rows={6}
                                                            value={section.content || ''}
                                                            onChange={(e) => {
                                                                const newSections = [...service.sections];
                                                                newSections[sIdx] = { ...section, content: e.target.value };
                                                                handleUpdateService(service.id, 'sections', newSections);
                                                            }}
                                                            className="w-full px-3 py-2 text-xs font-mono border rounded-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-[10px] font-bold uppercase text-gray-400">Structured Items</label>
                                                            <button
                                                                onClick={() => {
                                                                    const newItem = { id: Date.now(), title: 'New Item', description: '', icon: 'CheckCircle' };
                                                                    const newSections = [...service.sections];
                                                                    newSections[sIdx] = { ...section, items: [...(section.items || []), newItem] };
                                                                    handleUpdateService(service.id, 'sections', newSections);
                                                                }}
                                                                className="text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                                                            >
                                                                + Add Item
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {(section.items || []).map((item, iIdx) => (
                                                                <div key={item.id || iIdx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex gap-3 relative group/item">
                                                                    <button
                                                                        onClick={() => {
                                                                            const newItems = section.items.filter((_, i) => i !== iIdx);
                                                                            const newSections = [...service.sections];
                                                                            newSections[sIdx] = { ...section, items: newItems };
                                                                            handleUpdateService(service.id, 'sections', newSections);
                                                                        }}
                                                                        className="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="w-8 h-8 bg-white border rounded flex items-center justify-center text-gray-400">
                                                                            <Settings2 size={14} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 space-y-1">
                                                                        <input
                                                                            value={item.title}
                                                                            onChange={(e) => {
                                                                                const newItems = [...section.items];
                                                                                newItems[iIdx] = { ...item, title: e.target.value };
                                                                                const newSections = [...service.sections];
                                                                                newSections[sIdx] = { ...section, items: newItems };
                                                                                handleUpdateService(service.id, 'sections', newSections);
                                                                            }}
                                                                            className="w-full px-2 py-1 text-xs font-bold border-b bg-transparent"
                                                                            placeholder="Item Title"
                                                                        />
                                                                        <textarea
                                                                            value={item.description}
                                                                            onChange={(e) => {
                                                                                const newItems = [...section.items];
                                                                                newItems[iIdx] = { ...item, description: e.target.value };
                                                                                const newSections = [...service.sections];
                                                                                newSections[sIdx] = { ...section, items: newItems };
                                                                                handleUpdateService(service.id, 'sections', newSections);
                                                                            }}
                                                                            className="w-full px-2 py-1 text-[10px] bg-transparent resize-none h-10"
                                                                            placeholder="Brief description..."
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {(service.sections || []).length === 0 && (
                                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed text-gray-400 text-sm">
                                            No advanced layout sections added yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Live Preview and other lists */}
                        <div className="space-y-8">
                            {/* Other Lists (REITs, Terms etc.) */}
                            <div className="glass-card p-6">
                                {service.financingTerms && (
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-[var(--text-primary)]">Financing Terms</h3>
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
