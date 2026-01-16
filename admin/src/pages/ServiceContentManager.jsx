import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Edit2, Plus, Trash2, Briefcase, FileText, TrendingUp, Building2, GripVertical, ChevronDown, ChevronUp, Loader2, Globe, Shield, Landmark, Coins, Gem, Users, ShieldCheck, PieChart, BarChart3 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const ServiceContentManager = () => {
    const [activeService, setActiveService] = useState(null);

    // Default data for all 12 service detail pages
    const defaultServices = [
        {
            id: 'virtual-cfo',
            title: 'Business Finance Consulting – Virtual CFO',
            subtitle: 'Dedicated finance leadership to support funding readiness, reporting discipline, and decision-making—without the overhead of a full-time in-house CFO.',
            icon: 'Briefcase',
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
            overview: { heading: 'Coming Soon', description: 'Service details available upon request.' },
            formFields: ['companyName', 'email', 'phone', 'message']
        },
        {
            id: 'share-financing',
            title: 'Share Financing (SF)',
            subtitle: 'Strategic share financing solutions for shareholders and institutional investors.',
            icon: 'BarChart3',
            overview: { heading: 'Coming Soon', description: 'Service details available upon request.' },
            formFields: ['companyName', 'email', 'phone', 'message']
        },
        {
            id: 'merger-acquisition',
            title: 'Merger & Acquisition (M&A)',
            subtitle: 'Expert guidance through complex M&A transactions, negotiations, and strategic integrations.',
            icon: 'Users',
            overview: { heading: 'Coming Soon', description: 'Service details available upon request.' },
            formFields: ['companyName', 'email', 'phone', 'message']
        },
        {
            id: 'tokenization',
            title: 'Tokenization',
            subtitle: 'Digital asset tokenization solutions for modern investment structures.',
            icon: 'Coins',
            overview: { heading: 'Coming Soon', description: 'Service details available upon request.' },
            formFields: ['companyName', 'email', 'phone', 'message']
        },
        {
            id: 'asset-insurance',
            title: 'Asset Insurance (AI)',
            subtitle: 'Comprehensive asset protection and insurance solutions for institutional clients.',
            icon: 'Shield',
            overview: { heading: 'Coming Soon', description: 'Service details available upon request.' },
            formFields: ['companyName', 'email', 'phone', 'message']
        },
        {
            id: 'ppli',
            title: 'Private Placement Life Insurance (PPLI)',
            subtitle: 'Sophisticated life insurance solutions for wealth preservation and estate planning.',
            icon: 'ShieldCheck',
            overview: { heading: 'Coming Soon', description: 'Service details available upon request.' },
            formFields: ['companyName', 'email', 'phone', 'message']
        },
        {
            id: 'gig',
            title: 'Global Investment Gateway (GIG)',
            subtitle: 'A Strategic Capital Access & Global Investor Connectivity Platform by Instrak Venture Capital Berhad',
            icon: 'Globe',
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
            overview: { heading: 'Coming Soon', description: 'Service details available upon request.' },
            formFields: ['companyName', 'email', 'phone', 'message']
        },
        {
            id: 'aum',
            title: 'Asset Under Management (AUM)',
            subtitle: 'Partner with Instrak Venture Capital Berhad to optimise capital, enhance portfolio performance, and achieve long-term strategic objectives with a disciplined, mandate-driven investment framework.',
            icon: 'PieChart',
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
            setServices(content.pages);
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
                        <p className="text-[var(--text-secondary)]">Manage content for each service detail page.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(service => {
                        const Icon = getIcon(service.icon);
                        return (
                            <div
                                key={service.id}
                                className="glass-card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => setActiveService(service.id)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">{service.title}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{service.subtitle}</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded">{service.formFields?.length || 0} form fields</span>
                                            <span className="text-xs text-[var(--accent-primary)] font-medium group-hover:underline">Edit Content →</span>
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
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setActiveService(null)}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                >
                    <ArrowLeft size={18} /> Back to Services
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] transition-colors shadow-md font-medium disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Editor */}
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-50 text-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                            <Icon size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--accent-primary)]">{service.title}</h1>
                            <p className="text-sm text-[var(--text-secondary)]">Edit page content and sections</p>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                        <h3 className="font-bold text-[var(--text-primary)]">Page Hero</h3>
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
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Subtitle</label>
                                <textarea
                                    rows={2}
                                    value={service.subtitle}
                                    onChange={(e) => handleUpdateService(service.id, 'subtitle', e.target.value)}
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
                                    className="text-xs bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded hover:bg-[#08304e] flex items-center gap-1"
                                >
                                    <Plus size={14} /> Add
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
                                                            className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 ${snapshot.isDragging ? 'opacity-50' : ''}`}
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
                                                            className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 items-center ${snapshot.isDragging ? 'opacity-50' : ''}`}
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

                    {service.services && (
                        <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-[var(--text-primary)]">Sub-Services</h3>
                                <button
                                    onClick={() => handleAddArrayItem(service.id, 'services', { title: 'New Service', desc: 'Description' })}
                                    className="text-xs bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded hover:bg-[#08304e] flex items-center gap-1"
                                >
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                            <Droppable droppableId="services">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                        {service.services.map((item, index) => (
                                            <Draggable key={index} draggableId={`service-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab pt-2">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <input
                                                                type="text"
                                                                value={item.title}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'services', index, 'title', e.target.value)}
                                                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium"
                                                                placeholder="Service Title"
                                                            />
                                                            <textarea
                                                                rows={2}
                                                                value={item.desc}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'services', index, 'desc', e.target.value)}
                                                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                                placeholder="Description"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteArrayItem(service.id, 'services', index)}
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
                    )}

                    {service.roadmapStages && (
                        <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                            <h3 className="font-bold text-[var(--text-primary)]">Roadmap Stages</h3>
                            <Droppable droppableId="roadmapStages">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                        {service.roadmapStages.map((item, index) => (
                                            <Draggable key={index} draggableId={`stage-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 items-center ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        <span className="w-8 h-8 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">{item.stage}</span>
                                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                                            <input
                                                                type="text"
                                                                value={item.title}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'roadmapStages', index, 'title', e.target.value)}
                                                                className="px-2 py-1 rounded border border-[var(--border-light)] text-sm font-medium"
                                                                placeholder="Stage Title"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={item.duration}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'roadmapStages', index, 'duration', e.target.value)}
                                                                className="px-2 py-1 rounded border border-[var(--border-light)] text-sm"
                                                                placeholder="Duration"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={item.investment}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'roadmapStages', index, 'investment', e.target.value)}
                                                                className="px-2 py-1 rounded border border-[var(--border-light)] text-sm"
                                                                placeholder="Investment/Equity"
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
                    )}

                    {service.eligibleAwarders && (
                        <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                            <h3 className="font-bold text-[var(--text-primary)]">Eligible Contract Awarders</h3>
                            <Droppable droppableId="eligibleAwarders">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 gap-3">
                                        {service.eligibleAwarders.map((item, index) => (
                                            <Draggable key={index} draggableId={`eligibleAwarder-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`p-3 bg-[var(--bg-tertiary)] rounded-lg flex gap-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab pt-1">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={item.title}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'eligibleAwarders', index, 'title', e.target.value)}
                                                                className="w-full px-2 py-1 rounded border border-[var(--border-light)] text-sm font-medium mb-1"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={item.desc}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'eligibleAwarders', index, 'desc', e.target.value)}
                                                                className="w-full px-2 py-1 rounded border border-[var(--border-light)] text-xs"
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
                    )}

                    {service.financingTerms && (
                        <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
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

                    {service.financingTypes && (
                        <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                            <h3 className="font-bold text-[var(--text-primary)]">Financing Types</h3>
                            <Droppable droppableId="financingTypes">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                        {service.financingTypes.map((item, index) => (
                                            <Draggable key={index} draggableId={`fintype-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 items-center ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <input
                                                                type="text"
                                                                value={item.title}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'financingTypes', index, 'title', e.target.value)}
                                                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium"
                                                                placeholder="Title"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={item.desc}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'financingTypes', index, 'desc', e.target.value)}
                                                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                                placeholder="Description"
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
                    )}

                    {service.propertyTypes && (
                        <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                            <h3 className="font-bold text-[var(--text-primary)]">Property Types</h3>
                            <Droppable droppableId="propertyTypes">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                        {service.propertyTypes.map((item, index) => (
                                            <Draggable key={index} draggableId={`proptype-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`p-4 bg-[var(--bg-tertiary)] rounded-lg flex gap-3 items-center ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                                            <input
                                                                type="text"
                                                                value={item.type}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'propertyTypes', index, 'type', e.target.value)}
                                                                className="px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium"
                                                                placeholder="Type"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={item.examples}
                                                                onChange={(e) => handleUpdateArrayItem(service.id, 'propertyTypes', index, 'examples', e.target.value)}
                                                                className="px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                                placeholder="Examples"
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
                    )}

                    {service.loanTerms && (
                        <div className="space-y-4 border-b border-[var(--border-light)] pb-6 mb-6">
                            <h3 className="font-bold text-[var(--text-primary)]">Loan Terms</h3>
                            <Droppable droppableId="loanTerms">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {service.loanTerms.map((item, index) => (
                                            <Draggable key={index} draggableId={`loanTerm-${index}`} index={index}>
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
                                                            onChange={(e) => handleUpdateArrayItem(service.id, 'loanTerms', index, 'label', e.target.value)}
                                                            className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={item.value}
                                                            onChange={(e) => handleUpdateArrayItem(service.id, 'loanTerms', index, 'value', e.target.value)}
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

                    {/* Form Fields Info */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-[var(--text-primary)]">Form Fields (Read-only)</h3>
                        <p className="text-sm text-[var(--text-muted)]">These fields are captured when users submit the form on this page:</p>
                        <div className="flex flex-wrap gap-2">
                            {service.formFields?.map((field, index) => (
                                <span key={index} className="px-3 py-1 bg-[var(--bg-tertiary)] text-sm rounded-full text-[var(--text-secondary)]">{field}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Live Preview */}
                <div className="glass-card p-0 overflow-hidden sticky top-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="bg-gray-100 border-b p-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</div>

                    {/* Hero Preview */}
                    <div className="bg-[#F5F7FA] py-8 px-6 text-center border-b-4 border-[#B8860B]">
                        <h2 className="text-2xl font-bold mb-2 font-heading text-[#1A365D]">{service.title}</h2>
                        <p className="text-sm text-gray-600">{service.subtitle}</p>
                    </div>

                    {/* Overview Preview */}
                    <div className="p-6 bg-white">
                        <h3 className="text-lg font-bold text-[#1A365D] mb-3">{service.overview?.heading || 'Overview'}</h3>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{service.overview?.description?.substring(0, 150)}...</p>

                        {service.overview?.highlights && (
                            <ul className="text-xs text-gray-500 space-y-1">
                                {service.overview.highlights.slice(0, 3).map((h, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="text-[#B8860B]">✓</span> {h}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Offerings Preview */}
                    {service.offerings && (
                        <div className="p-6 bg-[#F5F7FA]">
                            <h3 className="text-sm font-bold text-[#1A365D] mb-3">What We Offer</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {service.offerings.slice(0, 4).map((o, i) => (
                                    <div key={i} className="bg-white p-2 rounded shadow-sm text-[10px]">
                                        <div className="font-medium text-[#1A365D]">{o.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Process Preview */}
                    {service.process && (
                        <div className="p-6 bg-white">
                            <h3 className="text-sm font-bold text-[#1A365D] mb-3">Our Process</h3>
                            <div className="flex gap-2 flex-wrap">
                                {service.process.map((p, i) => (
                                    <div key={i} className="flex items-center gap-1 text-[10px]">
                                        <span className="w-5 h-5 bg-[#B8860B] text-white rounded-full flex items-center justify-center font-bold">{p.step}</span>
                                        <span className="text-[#1A365D]">{p.title}</span>
                                        {i < service.process.length - 1 && <span className="text-gray-300">→</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-[10px] text-center text-gray-400 p-4 bg-gray-50">
                        Changes sync to client after saving
                    </p>
                </div>
            </div>
            </div>
        </DragDropContext>
    );
};

export default ServiceContentManager;
