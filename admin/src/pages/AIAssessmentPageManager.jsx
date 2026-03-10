import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, LayoutTemplate, FileText, Loader2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import AppearanceEditor from '../components/AppearanceEditor';

const parseOptions = (value) =>
    value
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

const DEFAULT_ASSESSMENT = {
    title: 'AI Capital Assessment',
    subtitle: 'Manage the questions and steps used by the AI Capital Assessment wizard on the public site.',
    steps: [
        {
            id: 'company-profile',
            title: 'Company Profile',
            description: 'Basic information about the company.',
            questions: [
                { id: 'industry', label: 'Industry sector', type: 'select', options: ['Manufacturing', 'Real Estate', 'Technology', 'Energy', 'Logistics', 'Financial Services', 'Other'], required: true },
                { id: 'country', label: 'Country of operation', type: 'text', required: true },
                { id: 'stage', label: 'Business stage', type: 'select', options: ['Startup', 'Growth', 'Mature', 'Pre-IPO'], required: true }
            ]
        },
        {
            id: 'financial-profile',
            title: 'Financial Profile',
            description: 'High-level financial snapshot.',
            questions: [
                { id: 'revenueRange', label: 'Annual revenue range (USD)', type: 'select', options: ['< 1M', '1M – 5M', '5M – 20M', '20M – 100M', '> 100M'], required: true },
                { id: 'assetValue', label: 'Estimated asset value (USD)', type: 'select', options: ['< 5M', '5M – 25M', '25M – 100M', '> 100M'], required: false },
                { id: 'ebitdaMargin', label: 'EBITDA margin', type: 'select', options: ['Negative', '0 – 10%', '10 – 20%', '> 20%'], required: true }
            ]
        },
        {
            id: 'capital-requirements',
            title: 'Capital Requirements',
            description: 'What capital is required and for what purpose.',
            questions: [
                { id: 'capitalAmount', label: 'Amount of capital required (USD)', type: 'select', options: ['< 3M', '3M – 10M', '10M – 50M', '> 50M'], required: true },
                { id: 'capitalUse', label: 'Intended use of funds', type: 'multi-select', options: ['Expansion', 'Acquisition', 'Real estate development', 'Refinancing'], required: true }
            ]
        },
        {
            id: 'governance',
            title: 'Governance & Compliance',
            description: 'Basic governance readiness checks.',
            questions: [
                { id: 'auditedFS', label: 'Do you have audited financial statements for the last 2–3 years?', type: 'select', options: ['Yes', 'In progress', 'No'], required: true },
                { id: 'governance', label: 'Corporate governance structure', type: 'select', options: ['Board + independent directors', 'Board only', 'Founder-led / informal'], required: true }
            ]
        },
        {
            id: 'strategy',
            title: 'Strategic Direction',
            description: 'Longer-term capital and exit plans.',
            questions: [
                { id: 'ipoPlans', label: 'Are you considering an IPO within the next 3–5 years?', type: 'select', options: ['Yes', 'Maybe', 'No'], required: false },
                { id: 'equityOpenness', label: 'Openness to equity participation from institutional investors', type: 'select', options: ['High', 'Medium', 'Low'], required: true }
            ]
        }
    ]
};

const defaultHero = {
    title: 'AI Capital Assessment',
    subtitle: 'A guided, institutional-grade assessment of your capital readiness and the IVC services that fit best.',
    tagline: 'Capital Readiness • Governance • Strategic Fit',
    styles: {
        titleColor: '#FFFFFF',
        subtitleColor: '#E2E8F0',
        textColor: '#E2E8F0',
        bgColor: '#0A2540',
        bgGradient: '#1A365D',
        textAlign: 'center',
        subtitleAlign: 'center',
    },
};

const defaultSections = [
    {
        id: 'how-it-works',
        title: 'How this assessment works',
        subtitle: 'Five short steps, less than 5 minutes',
        content:
            'Answer a focused set of questions on your company profile, financials, governance and capital needs. Our model then calculates a Capital Readiness Score and maps you to the most relevant IVC services.',
        position: 'before',
        styles: {
            bgColor: '#FFFFFF',
            titleColor: '#1A365D',
            subtitleColor: '#64748B',
            textColor: '#4A5568',
            contentAlign: 'left',
        },
    },
    {
        id: 'what-you-get',
        title: 'What you will receive',
        subtitle: '',
        content:
            'A Capital Readiness Score, a simple banding (Early / Developing / Institutional Ready), and a clear view of which IVC services are most relevant to your situation.',
        position: 'before',
        styles: {
            bgColor: '#F7FAFC',
            titleColor: '#1A365D',
            subtitleColor: '#64748B',
            textColor: '#4A5568',
            contentAlign: 'left',
        },
    },
];

const HERO_COLOR_FIELDS = [
    { key: 'bgColor', label: 'Background', default: '#0A2540', gradient: true },
    { key: 'titleColor', label: 'Title', default: '#FFFFFF' },
    { key: 'subtitleColor', label: 'Subtitle', default: '#E2E8F0' },
    { key: 'textColor', label: 'Body Text', default: '#E2E8F0' },
];

const HERO_FEATURES = ['alignment', 'titleStyle', 'titleSize', 'subtitleSize', 'contentSize'];

const SECTION_COLOR_FIELDS = [
    { key: 'bgColor', label: 'Background', default: '#FFFFFF' },
    { key: 'titleColor', label: 'Title', default: '#1A365D' },
    { key: 'subtitleColor', label: 'Subtitle', default: '#64748B' },
    { key: 'textColor', label: 'Body Text', default: '#4A5568' },
];

const SECTION_FEATURES = ['alignment', 'titleSize', 'subtitleSize', 'contentSize'];

const WIZARD_COLOR_FIELDS = [
    { key: 'bgColor', label: 'Wizard Background', default: '#020617', gradient: true },
    { key: 'cardBgColor', label: 'Card Background', default: '#020617' },
    { key: 'cardBorderColor', label: 'Card Border', default: 'rgba(148,163,184,0.45)' },
    { key: 'titleColor', label: 'Step Title', default: '#F9FAFB' },
    { key: 'textColor', label: 'Body Text', default: '#E2E8F0' },
];

const WIZARD_FEATURES = ['contentSize'];

const defaultWizardStyles = {
    bgColor: '#020617',
    bgGradient: '#020617',
    cardBgColor: 'rgba(15,23,42,0.96)',
    cardBorderColor: 'rgba(148,163,184,0.45)',
    titleColor: '#F9FAFB',
    textColor: '#E2E8F0',
    contentFontSize: 14,
};

const defaultResults = {
    title: 'AI Capital Assessment Result',
    intro: 'Based on your responses, here is a high-level view of your capital readiness and which IVC services may be most relevant.',
    scoreLabel: 'Capital Readiness Score',
    summaryTitle: 'Summary',
    summaryBody:
        'This score is not a credit rating. It is a directional indicator of how prepared your company is for institutional capital. Higher scores generally reflect stronger governance, financial visibility, and clarity of capital use.',
    recommendationsTitle: 'Recommended IVC Services',
    recommendationsEmpty:
        'We were not able to determine a clear service fit from your answers. Please contact our advisory team for a direct discussion.',
    risksTitle: 'Key Considerations',
    risksEmpty:
        'No major governance or financial red flags were identified from your answers. Our team can help you structure the most appropriate capital pathway.',
    nextStepsTitle: 'Next Steps',
    nextStepsBody:
        'Share these results with our advisory team to discuss a tailored capital roadmap for your company.',
    primaryCtaLabel: 'Speak With An Advisor',
    primaryCtaHref: '/contact',
    secondaryCtaLabel: 'Start Over',
};

const defaultContent = {
    pageHero: defaultHero,
    sections: defaultSections,
    wizardStyles: defaultWizardStyles,
    results: defaultResults,
};

const AIAssessmentPageManager = () => {
    const { content, loading, saving, saveContent } = useContent('ai_assessment_page', defaultContent);
    const {
        content: assessmentContent,
        loading: assessmentLoading,
        saving: assessmentSaving,
        saveContent: saveAssessment,
    } = useContent('ai_capital_assessment', DEFAULT_ASSESSMENT);

    const [formData, setFormData] = useState(defaultContent);
    const [assessmentData, setAssessmentData] = useState(DEFAULT_ASSESSMENT);
    const [activeTab, setActiveTab] = useState('layout');
    const [expandedSteps, setExpandedSteps] = useState(() =>
        (DEFAULT_ASSESSMENT.steps || [])[0] ? { [(DEFAULT_ASSESSMENT.steps || [])[0].id]: true } : {}
    );

    useEffect(() => {
        if (content && !loading) {
            const merged = {
                ...defaultContent,
                ...content,
                pageHero: {
                    ...defaultHero,
                    ...content.pageHero,
                    styles: { ...defaultHero.styles, ...(content.pageHero?.styles || {}) },
                },
                sections: Array.isArray(content.sections) && content.sections.length ? content.sections : defaultSections,
                wizardStyles: { ...defaultWizardStyles, ...(content.wizardStyles || {}) },
                results: { ...defaultResults, ...(content.results || {}) },
            };
            setFormData(merged);
        }
    }, [content, loading]);

    useEffect(() => {
        if (assessmentContent && !assessmentLoading) {
            const steps =
                assessmentContent.steps &&
                Array.isArray(assessmentContent.steps) &&
                assessmentContent.steps.length > 0
                    ? assessmentContent.steps
                    : DEFAULT_ASSESSMENT.steps;
            setAssessmentData({
                ...DEFAULT_ASSESSMENT,
                ...assessmentContent,
                steps,
            });
            setExpandedSteps(prev => {
                const firstId = steps[0]?.id;
                if (!firstId) return prev;
                if (!prev[firstId] && Object.keys(prev).length === 0) return { [firstId]: true };
                return prev;
            });
        }
    }, [assessmentContent, assessmentLoading]);

    const updateHero = (patch) => {
        setFormData((prev) => ({
            ...prev,
            pageHero: { ...prev.pageHero, ...patch },
        }));
    };

    const updateHeroStyles = (styles) => {
        setFormData((prev) => ({
            ...prev,
            pageHero: {
                ...prev.pageHero,
                styles,
            },
        }));
    };

    const addSection = () => {
        const id = `section-${Date.now()}`;
        setFormData((prev) => ({
            ...prev,
            sections: [
                ...prev.sections,
                {
                    id,
                    title: 'New section',
                    subtitle: '',
                    content: '',
                    position: 'before',
                    styles: {
                        bgColor: '#FFFFFF',
                        titleColor: '#1A365D',
                        subtitleColor: '#64748B',
                        textColor: '#4A5568',
                        contentAlign: 'left',
                    },
                },
            ],
        }));
    };

    const updateSection = (id, patch) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === id ? { ...section, ...patch } : section
            ),
        }));
    };

    const updateSectionStyles = (id, styles) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.id === id ? { ...section, styles } : section
            ),
        }));
    };

    const removeSection = (id) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.filter((section) => section.id !== id),
        }));
    };

    const handleSave = async () => {
        try {
            await saveContent(formData);
            toast.success('AI Capital Assessment page updated.');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save page content.');
        }
    };

    const updateQuestion = (stepId, qId, field, value) => {
        setAssessmentData(prev => ({
            ...prev,
            steps: prev.steps.map(step => {
                if (step.id !== stepId) return step;
                return {
                    ...step,
                    questions: (step.questions || []).map(q => (q.id === qId ? { ...q, [field]: value } : q)),
                };
            }),
        }));
    };

    const updateStep = (stepId, patch) => {
        setAssessmentData(prev => ({
            ...prev,
            steps: prev.steps.map(s => (s.id === stepId ? { ...s, ...patch } : s)),
        }));
    };

    const addQuestion = (stepId) => {
        const qId = `q-${Date.now()}`;
        setAssessmentData(prev => ({
            ...prev,
            steps: prev.steps.map(step =>
                step.id === stepId
                    ? { ...step, questions: [...(step.questions || []), { id: qId, label: 'New question', type: 'text', required: false }] }
                    : step
            ),
        }));
    };

    const removeQuestion = (stepId, qId) => {
        if (!window.confirm('Remove this question? This cannot be undone.')) return;
        setAssessmentData(prev => ({
            ...prev,
            steps: prev.steps.map(step =>
                step.id === stepId ? { ...step, questions: (step.questions || []).filter(q => q.id !== qId) } : step
            ),
        }));
    };

    const addStep = () => {
        const stepId = `step-${Date.now()}`;
        setAssessmentData(prev => ({
            ...prev,
            steps: [...prev.steps, { id: stepId, title: 'New step', description: '', questions: [] }],
        }));
        setExpandedSteps(prev => ({ ...prev, [stepId]: true }));
    };

    const removeStep = (stepId) => {
        if (!window.confirm('Remove this step and all its questions? This cannot be undone.')) return;
        setAssessmentData(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== stepId) }));
    };

    const toggleStepExpanded = (stepId) => {
        setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
    };

    const onAssessmentDragEnd = (result) => {
        if (!result.destination) return;
        if (result.source.droppableId === 'steps') {
            const steps = [...assessmentData.steps];
            const [removed] = steps.splice(result.source.index, 1);
            steps.splice(result.destination.index, 0, removed);
            setAssessmentData(prev => ({ ...prev, steps }));
            return;
        }
        if (result.source.droppableId.startsWith('questions-')) {
            const stepId = result.source.droppableId.replace('questions-', '');
            const step = assessmentData.steps.find(s => s.id === stepId);
            if (!step) return;
            const questions = [...(step.questions || [])];
            const [removed] = questions.splice(result.source.index, 1);
            questions.splice(result.destination.index, 0, removed);
            setAssessmentData(prev => ({
                ...prev,
                steps: prev.steps.map(s => (s.id === stepId ? { ...s, questions } : s)),
            }));
        }
    };

    const handleSaveAssessment = async () => {
        try {
            await saveAssessment(assessmentData);
            toast.success('AI Capital Assessment questions updated.');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save assessment questions.');
        }
    };

    if ((loading && !content) || (assessmentLoading && !assessmentContent)) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={40} />
            </div>
        );
    }

    const { pageHero, sections, wizardStyles, results } = formData;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-heading text-[var(--accent-primary)] flex items-center gap-2">
                        <LayoutTemplate size={22} /> AI Capital Assessment
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage both the page layout/appearance and the underlying assessment questions used on the
                        public AI Capital Assessment page.
                    </p>
                </div>
                {activeTab === 'layout' && (
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-medium shadow-sm hover:bg-[var(--accent-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        <span>{saving ? 'Saving...' : 'Save Layout'}</span>
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 mb-4 border-b border-gray-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('layout')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                        activeTab === 'layout'
                            ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Layout & Appearance
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('questions')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                        activeTab === 'questions'
                            ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Questions & Steps
                </button>
            </div>

            {activeTab === 'layout' && (
                <>
            {/* Hero section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <LayoutTemplate size={18} className="text-[var(--accent-primary)]" />
                    <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Page Hero
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Hero title</label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={pageHero.title || ''}
                                onChange={(e) => updateHero({ title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Subheadline</label>
                            <textarea
                                className="input-field text-sm min-h-[72px]"
                                value={pageHero.subtitle || ''}
                                onChange={(e) => updateHero({ subtitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Tagline (small text)</label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={pageHero.tagline || ''}
                                onChange={(e) => updateHero({ tagline: e.target.value })}
                            />
                        </div>
                    </div>

                    <AppearanceEditor
                        styles={pageHero.styles || {}}
                        onChange={updateHeroStyles}
                        colorFields={HERO_COLOR_FIELDS}
                        features={HERO_FEATURES}
                    />
                </div>

                <div className="mt-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50">
                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Frontend preview (conceptual)
                    </div>
                    <div
                        className="rounded-xl px-6 py-5"
                        style={{
                            background: pageHero.styles?.bgGradient
                                ? `linear-gradient(135deg, ${pageHero.styles.bgColor || '#0A2540'}, ${pageHero.styles.bgGradient})`
                                : pageHero.styles?.bgColor || '#0A2540',
                            color: pageHero.styles?.textColor || '#E2E8F0',
                            textAlign: pageHero.styles?.textAlign || 'center',
                        }}
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] mb-1 opacity-80">
                            {pageHero.tagline || 'AI CAPITAL DIAGNOSTIC'}
                        </div>
                        <div
                            className="text-2xl font-heading mb-2"
                            style={{
                                color: pageHero.styles?.titleColor || '#FFFFFF',
                                fontSize: pageHero.styles?.titleFontSize || 30,
                                fontWeight: pageHero.styles?.titleFontWeight || '600',
                            }}
                        >
                            {pageHero.title}
                        </div>
                        <div
                            className="text-sm max-w-2xl mx-auto"
                            style={{
                                color: pageHero.styles?.subtitleColor || pageHero.styles?.textColor || '#E2E8F0',
                                fontSize: pageHero.styles?.subtitleFontSize || 16,
                            }}
                        >
                            {pageHero.subtitle}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
                <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                        <FileText size={18} className="text-[var(--accent-primary)]" />
                        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                            Supporting Sections
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={addSection}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-[var(--accent-primary)] text-[var(--accent-primary)] text-xs font-medium hover:bg-[var(--accent-primary)]/5"
                    >
                        <Plus size={14} />
                        <span>Add section</span>
                    </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                    These sections can appear above or below the question wizard on the public page. Use them to explain
                    the methodology, set expectations and encourage completion.
                </p>

                {sections.length === 0 && (
                    <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500">
                        No sections yet. Click "Add section" to create your first explanatory block.
                    </div>
                )}

                <div className="space-y-4">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="border border-gray-100 rounded-2xl bg-gray-50/60 p-4 md:p-5 space-y-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                                        Section
                                    </div>
                                    <div className="text-sm font-semibold text-gray-800">
                                        {section.title || 'Untitled section'}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSection(section.id)}
                                    className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                                >
                                    <Trash2 size={14} />
                                    <span>Remove</span>
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                            Section title
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field text-sm"
                                            value={section.title || ''}
                                            onChange={(e) =>
                                                updateSection(section.id, { title: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                            Position on page
                                        </label>
                                        <select
                                            className="input-field text-xs"
                                            value={section.position || 'before'}
                                            onChange={(e) =>
                                                updateSection(section.id, { position: e.target.value })
                                            }
                                        >
                                            <option value="before">Above wizard</option>
                                            <option value="after">Below wizard</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                            Subtitle (optional)
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field text-sm"
                                            value={section.subtitle || ''}
                                            onChange={(e) =>
                                                updateSection(section.id, { subtitle: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                            Body content
                                        </label>
                                        <textarea
                                            className="input-field text-sm min-h-[96px]"
                                            value={section.content || ''}
                                            onChange={(e) =>
                                                updateSection(section.id, { content: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <AppearanceEditor
                                    styles={section.styles || {}}
                                    onChange={(styles) => updateSectionStyles(section.id, styles)}
                                    colorFields={SECTION_COLOR_FIELDS}
                                    features={SECTION_FEATURES}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Wizard appearance */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <LayoutTemplate size={18} className="text-[var(--accent-primary)]" />
                    <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Wizard Appearance
                    </h2>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                    Controls the dark background, card colour and text styling for the multi-step question wizard.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <AppearanceEditor
                        styles={wizardStyles}
                        onChange={(styles) =>
                            setFormData(prev => ({
                                ...prev,
                                wizardStyles: styles,
                            }))
                        }
                        colorFields={WIZARD_COLOR_FIELDS}
                        features={WIZARD_FEATURES}
                    />

                    <div className="space-y-3">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Preview
                        </div>
                        <div
                            className="rounded-xl p-4"
                            style={{
                                background: wizardStyles.bgGradient
                                    ? `linear-gradient(135deg, ${wizardStyles.bgColor || '#020617'}, ${wizardStyles.bgGradient})`
                                    : wizardStyles.bgColor || '#020617',
                            }}
                        >
                            <div
                                className="rounded-xl border glass-card p-4"
                                style={{
                                    backgroundColor: wizardStyles.cardBgColor || 'rgba(15,23,42,0.96)',
                                    borderColor: wizardStyles.cardBorderColor || 'rgba(148,163,184,0.45)',
                                }}
                            >
                                <div className="text-[11px] text-gray-400 mb-1">
                                    Step 2 of 5
                                </div>
                                <div
                                    className="text-sm font-semibold mb-1"
                                    style={{ color: wizardStyles.titleColor || '#F9FAFB' }}
                                >
                                    Financial Profile
                                </div>
                                <p
                                    className="text-[11px] mb-2"
                                    style={{ color: wizardStyles.textColor || '#E2E8F0' }}
                                >
                                    High-level financial snapshot.
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <div className="px-3 py-1.5 rounded-md text-[11px] bg-gray-700/50 text-gray-100 border border-gray-500/60">
                                        Back
                                    </div>
                                    <div className="px-3 py-1.5 rounded-md text-[11px] bg-amber-400 text-black font-semibold">
                                        Next
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result copy */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <FileText size={18} className="text-[var(--accent-primary)]" />
                    <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Result Page Copy
                    </h2>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                    Control the headings, helper text and CTAs shown after a user completes the assessment.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Result page title
                            </label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={results.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, title: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Intro paragraph
                            </label>
                            <textarea
                                className="input-field text-sm min-h-[72px]"
                                value={results.intro}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, intro: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Score label
                            </label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={results.scoreLabel}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, scoreLabel: e.target.value },
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Summary title
                            </label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={results.summaryTitle}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, summaryTitle: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Summary body
                            </label>
                            <textarea
                                className="input-field text-sm min-h-[72px]"
                                value={results.summaryBody}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, summaryBody: e.target.value },
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-2 border-t border-dashed border-gray-200">
                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Recommendations section title
                            </label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={results.recommendationsTitle}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, recommendationsTitle: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                When no services are recommended
                            </label>
                            <textarea
                                className="input-field text-sm min-h-[72px]"
                                value={results.recommendationsEmpty}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, recommendationsEmpty: e.target.value },
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Risks section title
                            </label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={results.risksTitle}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, risksTitle: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                When no major risks are found
                            </label>
                            <textarea
                                className="input-field text-sm min-h-[72px]"
                                value={results.risksEmpty}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, risksEmpty: e.target.value },
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-2 border-t border-dashed border-gray-200">
                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Next steps title
                            </label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={results.nextStepsTitle}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, nextStepsTitle: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Next steps body
                            </label>
                            <textarea
                                className="input-field text-sm min-h-[72px]"
                                value={results.nextStepsBody}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, nextStepsBody: e.target.value },
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Primary CTA label
                            </label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={results.primaryCtaLabel}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, primaryCtaLabel: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Primary CTA link (URL)
                            </label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={results.primaryCtaHref}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, primaryCtaHref: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Secondary CTA label
                            </label>
                            <input
                                type="text"
                                className="input-field text-sm"
                                value={results.secondaryCtaLabel}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        results: { ...prev.results, secondaryCtaLabel: e.target.value },
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            </>
            )}

            {activeTab === 'questions' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                                Assessment Questions
                            </h2>
                            <p className="text-xs text-gray-500 max-w-xl">
                                Edit steps and questions for the wizard. Reorder by dragging. Scoring logic stays in code.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveAssessment}
                            disabled={assessmentSaving}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-medium shadow-sm hover:bg-[var(--accent-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {assessmentSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            <span>{assessmentSaving ? 'Saving...' : 'Save Questions'}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Wizard title</label>
                            <input
                                type="text"
                                className="input-field text-sm w-full"
                                value={assessmentData.title || ''}
                                onChange={e => setAssessmentData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. AI Capital Assessment"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Wizard subtitle</label>
                            <input
                                type="text"
                                className="input-field text-sm w-full"
                                value={assessmentData.subtitle || ''}
                                onChange={e => setAssessmentData(prev => ({ ...prev, subtitle: e.target.value }))}
                                placeholder="Shown above the steps on the public page"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-gray-500">Steps (drag to reorder)</span>
                        <button
                            type="button"
                            onClick={addStep}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[var(--accent-primary)] text-[var(--accent-primary)] text-xs font-medium hover:bg-[var(--accent-primary)]/5"
                        >
                            <Plus size={14} />
                            Add step
                        </button>
                    </div>

                    <DragDropContext onDragEnd={onAssessmentDragEnd}>
                        <Droppable droppableId="steps">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                                    {(assessmentData.steps || []).map((step, stepIndex) => (
                                        <Draggable key={step.id} draggableId={step.id} index={stepIndex}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                                                >
                                                    <div
                                                        className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-100 cursor-pointer"
                                                        onClick={() => toggleStepExpanded(step.id)}
                                                    >
                                                        <span {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600">
                                                            <GripVertical size={18} />
                                                        </span>
                                                        {expandedSteps[step.id] ? (
                                                            <ChevronDown size={18} className="text-gray-500 shrink-0" />
                                                        ) : (
                                                            <ChevronRight size={18} className="text-gray-500 shrink-0" />
                                                        )}
                                                        <span className="font-semibold text-[var(--accent-primary)] flex-1">
                                                            Step {stepIndex + 1}: {step.title || 'Untitled step'}
                                                        </span>
                                                        <span className="text-[11px] text-gray-400">
                                                            {(step.questions || []).length} question(s)
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeStep(step.id);
                                                            }}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                                            title="Remove step"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                    {expandedSteps[step.id] && (
                                                        <div className="p-4 space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Step title</label>
                                                                    <input
                                                                        type="text"
                                                                        className="input-field text-sm w-full"
                                                                        value={step.title || ''}
                                                                        onChange={e => updateStep(step.id, { title: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Step description</label>
                                                                    <input
                                                                        type="text"
                                                                        className="input-field text-sm w-full"
                                                                        value={step.description || ''}
                                                                        onChange={e => updateStep(step.id, { description: e.target.value })}
                                                                        placeholder="Shown under the step title"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[11px] font-bold text-gray-500 uppercase">Questions (drag to reorder)</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addQuestion(step.id)}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded border border-dashed border-gray-400 text-gray-600 text-[11px] font-medium hover:bg-gray-50"
                                                                >
                                                                    <Plus size={12} /> Add question
                                                                </button>
                                                            </div>

                                                            <Droppable droppableId={`questions-${step.id}`}>
                                                                    {(qProvided) => (
                                                                        <div ref={qProvided.innerRef} {...qProvided.droppableProps} className="space-y-3">
                                                                            {(step.questions || []).map((q, qIndex) => (
                                                                                <Draggable key={q.id} draggableId={q.id} index={qIndex}>
                                                                                    {(qProvided) => (
                                                                                        <div
                                                                                            ref={qProvided.innerRef}
                                                                                            {...qProvided.draggableProps}
                                                                                            className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3"
                                                                                        >
                                                                                            <div className="flex items-center justify-between gap-2">
                                                                                                <span {...qProvided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                                                                    <GripVertical size={16} />
                                                                                                </span>
                                                                                                <span className="text-[11px] font-mono text-gray-400">{q.id}</span>
                                                                                                <span className="text-[10px] uppercase font-bold text-gray-400">
                                                                                                    {q.type === 'multi-select' ? 'Multi-select' : q.type || 'text'}
                                                                                                </span>
                                                                                                <label className="flex items-center gap-1.5 text-[11px] text-gray-600">
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        checked={!!q.required}
                                                                                                        onChange={e => updateQuestion(step.id, q.id, 'required', e.target.checked)}
                                                                                                    />
                                                                                                    Required
                                                                                                </label>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => removeQuestion(step.id, q.id)}
                                                                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                                                                    title="Remove question"
                                                                                                >
                                                                                                    <Trash2 size={12} />
                                                                                                </button>
                                                                                            </div>
                                                                                            <div>
                                                                                                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Question label</label>
                                                                                                <input
                                                                                                    value={q.label || ''}
                                                                                                    onChange={e => updateQuestion(step.id, q.id, 'label', e.target.value)}
                                                                                                    className="input-field text-sm w-full"
                                                                                                />
                                                                                            </div>
                                                                                            {(q.type === 'select' || q.type === 'multi-select') && (
                                                                                                <div>
                                                                                                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                                                                                                        Options (one per line or comma-separated)
                                                                                                    </label>
                                                                                                    <textarea
                                                                                                        value={(q.options || []).join('\n')}
                                                                                                        onChange={e =>
                                                                                                            updateQuestion(step.id, q.id, 'options', parseOptions(e.target.value))
                                                                                                        }
                                                                                                        className="input-field text-xs w-full min-h-[80px] font-mono"
                                                                                                        placeholder="One per line or comma-separated"
                                                                                                    />
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </Draggable>
                                                                            ))}
                                                                            {qProvided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </Droppable>
                                                        </div>
                                                    )}
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
            )}
        </div>
    );
};

export default AIAssessmentPageManager;

