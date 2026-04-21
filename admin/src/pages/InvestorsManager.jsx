import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Loader2, LayoutTemplate, FileText, Briefcase } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import AppearanceEditor from '../components/AppearanceEditor';
import FormBuilder from '../components/FormBuilder';
import FormAppearanceEditor, { FORM_DEFAULTS } from '../components/FormAppearanceEditor';

// Default content (same shape as frontend expects)
const defaultPageHero = {
    title: 'FOR INVESTORS',
    subtitle: '',
    styles: { titleColor: '#FFFFFF', textAlign: 'center', bgColor: '#1A365D' }
};
const defaultMainContent = {
    headline: 'The Institutional Advantage',
    description: 'Instrak Venture Capital Berhad offers qualified investors access to a curated portfolio of high-growth industrial assets in the ASEAN region. Our approach is defined by rigorous due diligence and institutional-grade governance.'
};
const defaultPortfolioSection = {
    title: 'Institutional Portfolio',
    items: [
        { id: 'port-1', text: 'Energy & Infrastructure' },
        { id: 'port-2', text: 'Advanced Manufacturing' },
        { id: 'port-3', text: 'Logistics & Distribution' }
    ]
};
const defaultOnboarding = {
    title: 'Investor Onboarding Workflow',
    subtitle: 'A clear, institutional journey from registration to reporting.',
    steps: [
        {
            id: 'step-1',
            title: 'Step 1 — Investor Registration',
            description: 'Submit basic investor and organisation information to initiate the relationship.'
        },
        {
            id: 'step-2',
            title: 'Step 2 — AI Investor Profiling',
            description: 'We collect investment ticket size, risk tolerance, sector preferences, and geographic focus.'
        },
        {
            id: 'step-3',
            title: 'Step 3 — Compliance Verification',
            description: 'Institutional KYC and AML checks to verify identity, source of funds, and regulatory eligibility.'
        },
        {
            id: 'step-4',
            title: 'Step 4 — Secure Investor Portal',
            description: 'Approved investors receive access to a secure deal room, curated opportunities, and key reports.'
        },
        {
            id: 'step-5',
            title: 'Step 5 — Capital Allocation',
            description: 'Investor selects funds, projects, and investment programmes aligned to their mandate.'
        },
        {
            id: 'step-6',
            title: 'Step 6 — Portfolio Dashboard',
            description: 'View capital deployed, performance reports, and institutional updates in one dashboard.'
        }
    ]
};
const defaultFormSettings = {
    title: 'Investment Profile',
    submitButtonText: 'Submit profile',
    interestOptions: ['Investment', 'Loan', 'Partnership', 'Others']
};

const defaultFields = [
    { id: 'firstName', label: 'First Name', type: 'text', required: true, width: 'half', placeholder: 'First Name' },
    { id: 'lastName', label: 'Last Name', type: 'text', required: true, width: 'half', placeholder: 'Last Name' },
    { id: 'email', label: 'Email Address', type: 'email', required: true, width: 'half', placeholder: 'Email Address' },
    { id: 'phone', label: 'Phone Number', type: 'tel', required: true, width: 'half', placeholder: 'Phone Number' },
    { id: 'companyName', label: 'Company Name', type: 'text', required: true, width: 'half', placeholder: 'Company Name' },
    { id: 'companyWebsite', label: 'Company Website', type: 'text', required: false, width: 'half', placeholder: 'Company Website' },
    { id: 'interestType', label: 'Nature of Interest', type: 'select', required: true, width: 'full', options: ['Investment', 'Loan', 'Partnership', 'Others'] },
    { id: 'message', label: 'Other Details / Message', type: 'textarea', required: false, width: 'full', placeholder: 'How can we assist you today?' }
];

const defaultData = {
    pageHero: defaultPageHero,
    mainContent: defaultMainContent,
    portfolioSection: defaultPortfolioSection,
    onboarding: defaultOnboarding,
    formSettings: defaultFormSettings,
    fields: defaultFields,
    formStyles: { ...FORM_DEFAULTS, sectionTitle: defaultFormSettings.title, btnLabel: defaultFormSettings.submitButtonText }
};

const CONTENT_SECTIONS = [
    { id: 'hero', label: 'Page Hero', icon: LayoutTemplate },
    { id: 'main', label: 'Main Content', icon: FileText },
    { id: 'portfolio', label: 'Portfolio Section', icon: Briefcase },
    { id: 'onboarding', label: 'Onboarding Workflow', icon: FileText }
];

const InvestorsManager = () => {
    const { content, loading, saving, saveContent } = useContent('investors', defaultData);
    const [formData, setFormData] = useState(defaultData);
    const [activeTab, setActiveTab] = useState('content');
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        if (content && !loading) {
            const merged = {
                ...defaultData,
                ...content,
                pageHero: { ...defaultPageHero, ...content.pageHero },
                mainContent: { ...defaultMainContent, ...content.mainContent },
                portfolioSection: { ...defaultPortfolioSection, ...content.portfolioSection },
                onboarding: {
                    ...defaultOnboarding,
                    ...(content.onboarding || {}),
                    steps: Array.isArray(content.onboarding?.steps) && content.onboarding.steps.length
                        ? content.onboarding.steps
                        : defaultOnboarding.steps
                },
                formSettings: { ...defaultFormSettings, ...content.formSettings },
                fields: Array.isArray(content.fields) && content.fields.length ? content.fields : defaultFields,
                formStyles: { ...FORM_DEFAULTS, ...content.formStyles }
            };
            setFormData(merged);
        }
    }, [content, loading]);

    // Sync formSettings from formStyles + fields (for frontend backward compatibility)
    const buildPayload = () => {
        const payload = { ...formData };
        if (payload.formStyles) {
            payload.formSettings = {
                ...payload.formSettings,
                title: payload.formStyles.sectionTitle || payload.formSettings?.title || defaultFormSettings.title,
                submitButtonText: payload.formStyles.btnLabel || payload.formSettings?.submitButtonText || defaultFormSettings.submitButtonText,
                interestOptions: (payload.fields || []).find(f => f.id === 'interestType' && f.type === 'select')?.options || payload.formSettings?.interestOptions || defaultFormSettings.interestOptions
            };
        }
        return payload;
    };

    const handleSave = async () => {
        const ok = await saveContent(buildPayload());
        if (ok) toast.success('Investors page saved.');
    };

    // Portfolio
    const handleAddPortfolioItem = () => {
        const newItem = { id: `port-${Date.now()}`, text: 'New Portfolio Item' };
        setFormData(prev => ({
            ...prev,
            portfolioSection: { ...prev.portfolioSection, items: [...prev.portfolioSection.items, newItem] }
        }));
    };
    const handleUpdatePortfolioItem = (id, value) => {
        setFormData(prev => ({
            ...prev,
            portfolioSection: {
                ...prev.portfolioSection,
                items: prev.portfolioSection.items.map(item => (item.id === id ? { ...item, text: value } : item))
            }
        }));
    };
    const handleDeletePortfolioItem = (id) => {
        setFormData(prev => ({
            ...prev,
            portfolioSection: { ...prev.portfolioSection, items: prev.portfolioSection.items.filter(item => item.id !== id) }
        }));
    };
    const handlePortfolioDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(formData.portfolioSection.items);
        const [reordered] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordered);
        setFormData(prev => ({ ...prev, portfolioSection: { ...prev.portfolioSection, items } }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full" style={{ height: 'calc(100vh - 56px - 48px)', overflow: 'hidden' }}>
            {/* Action row — same pattern as About / Service */}
            <div className="shrink-0 flex items-center justify-between bg-white px-4 py-2 border-b border-gray-100">
                <div>
                    <h1 className="text-sm font-bold text-gray-700 tracking-wide uppercase">Investors Page Manager</h1>
                    <p className="text-xs text-gray-500">Manage the &quot;For Investors&quot; page content and form.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#22c55e] text-white rounded-lg hover:bg-[#16a34a] text-xs font-bold disabled:opacity-50 shadow-md transition-all"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? 'Saving...' : 'Save All'}
                </button>
            </div>

            {/* Tabs: Page Content | Form */}
            <div className="shrink-0 flex border-b border-gray-200 bg-white">
                {[
                    { id: 'content', label: 'Page Content' },
                    { id: 'form', label: 'Form' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id
                            ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Page Content tab: section list + editor (like AboutManager) */}
            {activeTab === 'content' && (
                <>
                    <div className="shrink-0 bg-white border-b border-gray-200">
                        <div className="flex gap-1 px-2 py-1.5">
                            {CONTENT_SECTIONS.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-bold transition-all
                                        ${activeSection === s.id ? 'bg-white border border-b-white text-blue-700 shadow-sm z-10 -mb-px' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-transparent'}`}
                                >
                                    <s.icon size={14} />
                                    <span>{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50/50 px-4 py-5">
                        {activeSection === 'hero' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm max-w-3xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white border rounded-lg text-blue-700"><LayoutTemplate size={20} /></div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Page Hero</h2>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Hero section</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="label">Title</label>
                                        <input
                                            value={formData.pageHero.title}
                                            onChange={e => setFormData(prev => ({ ...prev, pageHero: { ...prev.pageHero, title: e.target.value } }))}
                                            className="input-field font-bold"
                                            placeholder="e.g. FOR INVESTORS"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Subtitle</label>
                                        <textarea
                                            rows={2}
                                            value={formData.pageHero.subtitle || ''}
                                            onChange={e => setFormData(prev => ({ ...prev, pageHero: { ...prev.pageHero, subtitle: e.target.value } }))}
                                            className="input-field"
                                            placeholder="Optional subtitle"
                                        />
                                    </div>
                                    <AppearanceEditor
                                        styles={formData.pageHero.styles || {}}
                                        onChange={st => setFormData(prev => ({ ...prev, pageHero: { ...prev.pageHero, styles: st } }))}
                                        colorFields={[
                                            { key: 'titleColor', label: 'Font Colour', default: '#FFFFFF' },
                                            { key: 'bgColor', label: 'Background', default: '#1A365D' }
                                        ]}
                                        features={['alignment']}
                                    />
                                </div>
                            </div>
                        )}
                        {activeSection === 'main' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm max-w-3xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white border rounded-lg text-blue-700"><FileText size={20} /></div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Main Content</h2>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Intro block</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="label">Headline</label>
                                        <input
                                            value={formData.mainContent.headline}
                                            onChange={e => setFormData(prev => ({ ...prev, mainContent: { ...prev.mainContent, headline: e.target.value } }))}
                                            className="input-field font-bold"
                                            placeholder="e.g. The Institutional Advantage"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Description</label>
                                        <textarea
                                            rows={6}
                                            value={formData.mainContent.description}
                                            onChange={e => setFormData(prev => ({ ...prev, mainContent: { ...prev.mainContent, description: e.target.value } }))}
                                            className="input-field text-sm"
                                            placeholder="Main paragraph..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === 'portfolio' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm max-w-3xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white border rounded-lg text-blue-700"><Briefcase size={20} /></div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Portfolio Section</h2>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">List of portfolio items</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="label">Section Title</label>
                                        <input
                                            value={formData.portfolioSection.title}
                                            onChange={e => setFormData(prev => ({ ...prev, portfolioSection: { ...prev.portfolioSection, title: e.target.value } }))}
                                            className="input-field font-bold"
                                            placeholder="e.g. Institutional Portfolio"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Items</span>
                                            <button type="button" onClick={handleAddPortfolioItem} className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold border border-blue-100">
                                                <Plus size={14} className="inline mr-1" /> Add Item
                                            </button>
                                        </div>
                                        <DragDropContext onDragEnd={handlePortfolioDragEnd}>
                                            <Droppable droppableId="portfolio-items">
                                                {(provided) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                        {formData.portfolioSection.items.map((item, idx) => (
                                                            <Draggable key={item.id} draggableId={item.id} index={idx}>
                                                                {(prov, snap) => (
                                                                    <div ref={prov.innerRef} {...prov.draggableProps} className={`p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-3 ${snap.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}`}>
                                                                        <div {...prov.dragHandleProps} className="text-gray-300 cursor-grab"><GripVertical size={14} /></div>
                                                                        <input
                                                                            value={item.text}
                                                                            onChange={e => handleUpdatePortfolioItem(item.id, e.target.value)}
                                                                            className="input-field flex-1 py-1.5 text-sm"
                                                                            placeholder="Item text"
                                                                        />
                                                                        <button type="button" onClick={() => handleDeletePortfolioItem(item.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === 'onboarding' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm max-w-5xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white border rounded-lg text-blue-700"><FileText size={20} /></div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Investor Onboarding Workflow</h2>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Step-by-step journey</span>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Section Title</label>
                                            <input
                                                value={formData.onboarding?.title || ''}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    onboarding: { ...(prev.onboarding || {}), title: e.target.value }
                                                }))}
                                                className="input-field font-bold"
                                                placeholder="Investor Onboarding Workflow"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Section Subtitle</label>
                                            <textarea
                                                rows={2}
                                                value={formData.onboarding?.subtitle || ''}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    onboarding: { ...(prev.onboarding || {}), subtitle: e.target.value }
                                                }))}
                                                className="input-field"
                                                placeholder="Short description of the journey for investors."
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-xs text-gray-600">
                                        Use this section to show institutional investors exactly what happens from registration to ongoing reporting.
                                        The six default steps are based on your workflow, but you can edit titles and descriptions.
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {(formData.onboarding?.steps || defaultOnboarding.steps).map((step, idx) => (
                                            <div
                                                key={step.id}
                                                className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm flex flex-col gap-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                        Step {idx + 1}
                                                    </span>
                                                </div>
                                                <input
                                                    value={step.title}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            onboarding: {
                                                                ...(prev.onboarding || {}),
                                                                steps: (prev.onboarding?.steps || defaultOnboarding.steps).map(s =>
                                                                    s.id === step.id ? { ...s, title: value } : s
                                                                )
                                                            }
                                                        }));
                                                    }}
                                                    className="input-field text-sm font-semibold"
                                                />
                                                <textarea
                                                    rows={3}
                                                    value={step.description || ''}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            onboarding: {
                                                                ...(prev.onboarding || {}),
                                                                steps: (prev.onboarding?.steps || defaultOnboarding.steps).map(s =>
                                                                    s.id === step.id ? { ...s, description: value } : s
                                                                )
                                                            }
                                                        }));
                                                    }}
                                                    className="input-field text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Form tab: FormBuilder + FormAppearanceEditor (like ServiceContentManager) */}
            {activeTab === 'form' && (
                <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50/50 px-4 py-5 space-y-6">
                    <div className="glass-card p-6 max-w-4xl">
                        <h3 className="text-lg font-bold text-[var(--accent-primary)] mb-2">Inquiry Form Fields</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Configure the fields shown on the Investors inquiry form. Use the &quot;Nature of Interest&quot; select options for the dropdown (synced to the live page).</p>
                        <FormBuilder fields={formData.fields || []} onChange={newFields => setFormData(prev => ({ ...prev, fields: newFields }))} />
                    </div>
                    <div className="glass-card p-6 max-w-4xl">
                        <FormAppearanceEditor
                            formStyles={formData.formStyles || {}}
                            onChange={newStyles => setFormData(prev => ({ ...prev, formStyles: newStyles }))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestorsManager;
