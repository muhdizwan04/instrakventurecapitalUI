import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useContent } from '../hooks/useContent';

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

const AICapitalAssessmentManager = () => {
    const { content, loading, saving, saveContent } = useContent('ai_capital_assessment', DEFAULT_ASSESSMENT);
    const [localContent, setLocalContent] = useState(DEFAULT_ASSESSMENT);

    useEffect(() => {
        if (content && !loading) {
            // merge to keep new fields if we add in future
            setLocalContent({
                ...DEFAULT_ASSESSMENT,
                ...content,
                steps: content.steps && Array.isArray(content.steps) && content.steps.length > 0 ? content.steps : DEFAULT_ASSESSMENT.steps
            });
        }
    }, [content, loading]);

    const updateQuestion = (stepId, qId, field, value) => {
        setLocalContent(prev => ({
            ...prev,
            steps: prev.steps.map(step => {
                if (step.id !== stepId) return step;
                return {
                    ...step,
                    questions: (step.questions || []).map(q => (q.id === qId ? { ...q, [field]: value } : q))
                };
            })
        }));
    };

    const handleSave = async () => {
        await saveContent(localContent);
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="flex items-center justify-center py-16 text-gray-500">
                    <Loader2 size={24} className="animate-spin mr-3" />
                    Loading AI Capital Assessment configuration...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">AI Capital Assessment</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl">
                        Manage the steps and questions for the AI Capital Assessment wizard used on the public site.
                        Text and options are editable here; scoring logic stays consistent in code.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-save"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {localContent.steps.map(step => (
                <div key={step.id} className="glass-card p-6 border-l-4 border-l-[var(--accent-primary)] space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--accent-primary)] mb-1">{step.title}</h2>
                        <p className="text-sm text-[var(--text-secondary)]">{step.description}</p>
                    </div>

                    <div className="space-y-4">
                        {(step.questions || []).map(q => (
                            <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-mono text-gray-400">{q.id}</span>
                                    <span className="text-[10px] uppercase font-bold text-gray-400">
                                        {q.type === 'multi-select' ? 'Multi-select' : q.type || 'text'}{q.required ? ' • Required' : ''}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Question label</label>
                                    <input
                                        value={q.label || ''}
                                        onChange={e => updateQuestion(step.id, q.id, 'label', e.target.value)}
                                        className="input-field text-sm"
                                    />
                                </div>
                                {(q.type === 'select' || q.type === 'multi-select') && (
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Options (comma-separated)</label>
                                        <input
                                            value={(q.options || []).join(', ')}
                                            onChange={e =>
                                                updateQuestion(
                                                    step.id,
                                                    q.id,
                                                    'options',
                                                    e.target.value
                                                        .split(',')
                                                        .map(s => s.trim())
                                                        .filter(Boolean)
                                                )
                                            }
                                            className="input-field text-xs"
                                            placeholder="Option 1, Option 2, Option 3"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AICapitalAssessmentManager;

