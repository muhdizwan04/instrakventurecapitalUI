import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Save, Loader2, Layout, Palette, Layers, GripVertical, Trash2, Plus, ChevronRight, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import LayoutPicker from '../components/LayoutPicker';
import IconPicker from '../components/IconPicker';

const PAGE_SECTION_IDS = ['solutions', 'leadMagnet'];
const PAGE_SECTION_LABELS = { solutions: 'Solutions (service cards)', leadMagnet: 'Lead magnet block' };

const getSectionLabel = (id, formData) => {
    if (id === 'hero') return 'Hero';
    if (PAGE_SECTION_LABELS[id]) return PAGE_SECTION_LABELS[id];
    const custom = formData.customSections?.find(s => s.id === id);
    return custom?.title || id;
};

// Parse hero background: return { type: 'solid'|'gradient', solid: '#hex', start: '#hex', end: '#hex' }
const parseHeroBg = (bg) => {
    if (!bg || typeof bg !== 'string') return { type: 'gradient', solid: '#1A365D', start: '#1A365D', end: '#0F2942' };
    const hex = /#([0-9A-Fa-f]{6})/g;
    const match = bg.match(hex);
    if (match && match.length >= 2) return { type: 'gradient', solid: match[0], start: match[0], end: match[1] };
    if (match && match.length === 1) return { type: 'solid', solid: match[0], start: match[0], end: match[0] };
    return { type: 'gradient', solid: '#1A365D', start: '#1A365D', end: '#0F2942' };
};

// Parse rem/px string to number for slider (e.g. '3.5rem' -> 3.5; '24px' -> 1.5)
const remToNum = (s) => {
    if (!s) return 2.5;
    const str = String(s);
    const num = parseFloat(str.replace(/rem|px/gi, '')) || 2.5;
    if (str.includes('px') && num > 10) return num / 16; // px to rem
    return num;
};
const numToRem = (n) => `${Number(n)}rem`;

const DEFAULT_PAGE = {
    heroTitle: 'Strategic Financial Services',
    heroSubtitle: 'Comprehensive financial pathways tailored for institutional growth, industrial expansion, and global capital access.',
    heroBackground: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)',
    heroBackgroundType: 'gradient',
    heroBackgroundSolid: '#1A365D',
    heroBackgroundStart: '#1A365D',
    heroBackgroundEnd: '#0F2942',
    heroTextColor: '#FFFFFF',
    heroTextAlign: 'center',
    heroSubtitleAlign: 'center',
    heroFontFamily: 'var(--font-heading)',
    heroTitleFontSize: '3.5rem',
    heroSubtitleFontSize: '1.25rem',
    heroFontWeight: '700',
    heroShowPrimaryCta: true,
    heroShowSecondaryCta: true,
    ctaPrimaryText: 'Speak to an Advisor',
    ctaPrimaryLink: '/contact',
    ctaSecondaryText: 'Explore Solutions',
    ctaSecondaryLink: '#services-list',
    sectionSolutionsTitle: 'Integrated Capital & Investment Solutions',
    sectionSolutionsSubtitle: 'IVC provides a comprehensive range of institutional financial services designed to support capital formation, asset growth, and cross-border investment opportunities.',
    sectionTitleFontFamily: 'var(--font-heading)',
    sectionTitleFontSize: '2.5rem',
    sectionTitleColor: '#1A365D',
    sectionTitleAlign: 'center',
    sectionTitleFontWeight: '700',
    solutionsCardStyle: 'glass',
    tileTitleFontFamily: 'var(--font-heading)',
    tileTitleFontSize: '1.4rem',
    tileTitleColor: '#1A365D',
    tileDescFontSize: '0.95rem',
    tileDescColor: '#4A5568',
    tileButtonShow: true,
    tileButtonText: 'Learn More',
    tileButtonLink: '',
    tileButtonColor: '#B8860B',
    tileButtonFontSize: '0.95rem',
    tileIconColor: '#1A365D',
    tileCardBg: '#FFFFFF',
    leadMagnetTitle: 'Unsure which solution fits your needs?',
    leadMagnetDescription: 'Our analysts can assess your current financial position and recommend the optimal funding or restructuring strategy.',
    leadMagnetButtonText: 'Get a Free Assessment',
    leadMagnetButtonLink: '/contact',
    leadMagnetTextAlign: 'center',
    leadMagnetFontFamily: 'var(--font-heading)',
    leadMagnetTitleFontSize: '2rem',
    leadMagnetDescFontSize: '1.1rem',
    leadMagnetTitleColor: '#1A365D',
    leadMagnetDescColor: '#4A5568',
    pageContentOrder: ['solutions', 'leadMagnet'],
    customSections: []
};

const ServicesPageManager = () => {
    const { content, loading, saving, saveContent } = useContent('services_page', DEFAULT_PAGE);
    const [formData, setFormData] = useState(DEFAULT_PAGE);
    const [selectedSection, setSelectedSection] = useState('hero');

    useEffect(() => {
        if (content && Object.keys(content).length > 0 && !loading) {
            const merged = { ...DEFAULT_PAGE, ...content, customSections: content.customSections || [] };
            const bg = parseHeroBg(merged.heroBackground);
            setFormData(prev => ({
                ...DEFAULT_PAGE,
                ...prev,
                ...merged,
                customSections: merged.customSections || [],
                heroBackgroundType: merged.heroBackgroundType || bg.type,
                heroBackgroundSolid: merged.heroBackgroundSolid || bg.solid,
                heroBackgroundStart: merged.heroBackgroundStart || bg.start,
                heroBackgroundEnd: merged.heroBackgroundEnd || bg.end
            }));
        }
    }, [content, loading]);

    const handleChange = (field, value) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value };
            if (field === 'heroBackgroundType' || field === 'heroBackgroundSolid' || field === 'heroBackgroundStart' || field === 'heroBackgroundEnd') {
                const t = field === 'heroBackgroundType' ? value : prev.heroBackgroundType;
                next.heroBackground = t === 'solid'
                    ? (next.heroBackgroundSolid || prev.heroBackgroundSolid)
                    : `linear-gradient(135deg, ${next.heroBackgroundStart || prev.heroBackgroundStart} 0%, ${next.heroBackgroundEnd || prev.heroBackgroundEnd} 100%)`;
            }
            return next;
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await saveContent(formData);
    };

    // Enter = newline + same leading whitespace (gap); Tab = insert tab at cursor
    const handleTextareaEnter = (e, value, setValue) => {
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = value ?? '';
        if (e.key === 'Tab') {
            e.preventDefault();
            const newText = text.slice(0, start) + '\t' + text.slice(end);
            setValue(newText);
            requestAnimationFrame(() => { textarea.setSelectionRange(start + 1, start + 1); });
            return;
        }
        if (e.key !== 'Enter') return;
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const gap = (text.slice(lineStart, start).match(/^\s*/) || [''])[0];
        const newText = text.slice(0, start) + '\n' + gap + text.slice(end);
        setValue(newText);
        e.preventDefault();
        requestAnimationFrame(() => { textarea.setSelectionRange(start + 1 + gap.length, start + 1 + gap.length); });
    };

    const customIds = (formData.customSections || []).map(s => s.id);
    const pageOrder = Array.isArray(formData.pageContentOrder) && formData.pageContentOrder.length
        ? formData.pageContentOrder.filter(id => PAGE_SECTION_IDS.includes(id) || customIds.includes(id))
        : [...PAGE_SECTION_IDS];
    const availableToAdd = PAGE_SECTION_IDS.filter(id => !pageOrder.includes(id));

    const handlePageOrderDragEnd = (result) => {
        if (!result.destination) return;
        const next = Array.from(pageOrder);
        const [removed] = next.splice(result.source.index, 1);
        next.splice(result.destination.index, 0, removed);
        handleChange('pageContentOrder', next);
    };

    const handleRemoveSection = (id) => {
        const newOrder = pageOrder.filter(sid => sid !== id);
        handleChange('pageContentOrder', newOrder);
        if (customIds.includes(id)) {
            setFormData(prev => ({
                ...prev,
                customSections: (prev.customSections || []).filter(s => s.id !== id)
            }));
            if (selectedSection === id) setSelectedSection('hero');
        }
    };

    const handleAddSection = (id) => {
        handleChange('pageContentOrder', [...pageOrder, id]);
    };

    const handleAddCustomSection = () => {
        const id = `custom-${Date.now()}`;
        const newSection = {
            id,
            title: 'New Section',
            subtitle: '',
            content: '',
            items: [],
            styles: { layoutType: 'standard', bgColor: '#F8FAFC', textColor: '#1A365D', titleColor: '#1A365D', textAlign: 'center' }
        };
        setFormData(prev => ({
            ...prev,
            customSections: [...(prev.customSections || []), newSection],
            pageContentOrder: [...pageOrder, id]
        }));
        setSelectedSection(id);
        toast.success('Custom section added. Edit below.');
    };

    const updateCustomSection = (id, patch) => {
        setFormData(prev => ({
            ...prev,
            customSections: (prev.customSections || []).map(s => s.id === id ? { ...s, ...patch } : s)
        }));
    };

    const updateCustomSectionStyles = (id, stylePatch) => {
        setFormData(prev => ({
            ...prev,
            customSections: (prev.customSections || []).map(s => {
                if (s.id !== id) return s;
                return { ...s, styles: { ...(s.styles || {}), ...stylePatch } };
            })
        }));
    };

    const addCustomItem = (sectionId) => {
        updateCustomSection(sectionId, {
            items: [...(formData.customSections?.find(s => s.id === sectionId)?.items || []), { id: `item-${Date.now()}`, title: 'New Item', description: '', icon: 'CheckCircle2' }]
        });
    };

    const updateCustomItem = (sectionId, itemIdx, field, value) => {
        const sec = formData.customSections?.find(s => s.id === sectionId);
        if (!sec) return;
        const items = (sec.items || []).map((it, i) => i === itemIdx ? { ...it, [field]: value } : it);
        updateCustomSection(sectionId, { items });
    };

    const removeCustomItem = (sectionId, itemIdx) => {
        const sec = formData.customSections?.find(s => s.id === sectionId);
        if (!sec) return;
        updateCustomSection(sectionId, { items: (sec.items || []).filter((_, i) => i !== itemIdx) });
    };

    const activeCustomSection = formData.customSections?.find(s => s.id === selectedSection);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Services Page</h1>
                    <p className="text-[var(--text-secondary)]">Full custom: hero, sections order, and each block. Same style as service detail pages. Service cards are in <strong>Services Manager</strong>.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-save">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-6">
                {/* Left: Section list (like service detail) */}
                <div className="lg:w-72 shrink-0 space-y-2">
                    <div className="glass-card p-4">
                        <h3 className="text-sm font-bold text-[var(--accent-primary)] uppercase tracking-wider mb-3">Sections</h3>
                        <button
                            type="button"
                            onClick={() => setSelectedSection('hero')}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${selectedSection === 'hero' ? 'border-[var(--accent-primary)] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                            <Layout size={18} className="text-[var(--accent-primary)]" />
                            <span className="font-medium flex-1">Hero</span>
                            {selectedSection === 'hero' && <ChevronRight size={16} />}
                        </button>
                        <DragDropContext onDragEnd={handlePageOrderDragEnd}>
                            <Droppable droppableId="page-content-order">
                                {(provided) => (
                                    <ul ref={provided.innerRef} {...provided.droppableProps} className="mt-2 space-y-1">
                                        {pageOrder.map((id, index) => (
                                            <Draggable key={id} draggableId={id} index={index}>
                                                {(provided, snapshot) => (
                                                    <li
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`flex items-center gap-2 rounded-lg border ${selectedSection === id ? 'border-[var(--accent-primary)] bg-blue-50' : 'border-gray-200'} ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                                    >
                                                        <span {...provided.dragHandleProps} className="p-2 cursor-grab text-gray-400 hover:text-[var(--accent-primary)]">
                                                            <GripVertical size={16} />
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedSection(id)}
                                                            className="flex-1 min-w-0 flex items-center gap-2 p-2 text-left"
                                                        >
                                                            <span className="text-sm font-medium truncate">{getSectionLabel(id, formData)}</span>
                                                            {selectedSection === id && <ChevronRight size={14} />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSection(id)}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                                            title="Remove from page"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                        {availableToAdd.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200 flex flex-wrap gap-1">
                                {availableToAdd.map(id => (
                                    <button key={id} type="button" onClick={() => { handleAddSection(id); setSelectedSection(id); }} className="text-xs px-2 py-1.5 bg-gray-100 hover:bg-[var(--accent-primary)] hover:text-white rounded">
                                        + {PAGE_SECTION_LABELS[id]}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button type="button" onClick={handleAddCustomSection} className="mt-3 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]">
                            <Plus size={16} /> Add custom section
                        </button>
                    </div>
                </div>

                {/* Right: Editor for selected section */}
                <div className="flex-1 min-w-0 space-y-6">
                {selectedSection === 'hero' && (
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2">
                        <Layout size={20} /> Hero
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">Hero title</label>
                            <input value={formData.heroTitle || ''} onChange={(e) => handleChange('heroTitle', e.target.value)} className="input-field" placeholder="Strategic Financial Services" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Hero subtitle</label>
                            <textarea value={formData.heroSubtitle || ''} onChange={(e) => handleChange('heroSubtitle', e.target.value)} onKeyDown={(e) => handleTextareaEnter(e, formData.heroSubtitle || '', (v) => handleChange('heroSubtitle', v))} className="input-field" rows={2} placeholder="Comprehensive financial pathways..." />
                        </div>
                        <div>
                            <label className="label">Subtitle alignment</label>
                            <select value={formData.heroSubtitleAlign || 'center'} onChange={(e) => handleChange('heroSubtitleAlign', e.target.value)} className="input-field">
                                <option value="left">Left</option>
                                <option value="center">Centre</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        {/* Background: type + colour pickers */}
                        <div className="md:col-span-2 flex items-center gap-2">
                            <Palette size={18} className="text-[var(--accent-primary)]" />
                            <span className="label mb-0">Hero background</span>
                        </div>
                        <div>
                            <label className="text-sm text-[var(--text-secondary)]">Type</label>
                            <select value={formData.heroBackgroundType || 'gradient'} onChange={(e) => handleChange('heroBackgroundType', e.target.value)} className="input-field mt-0.5">
                                <option value="solid">Solid colour</option>
                                <option value="gradient">Gradient (two colours)</option>
                            </select>
                        </div>
                        {(formData.heroBackgroundType || 'gradient') === 'solid' ? (
                            <div>
                                <label className="label">Colour</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={formData.heroBackgroundSolid || '#1A365D'} onChange={(e) => handleChange('heroBackgroundSolid', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                    <span className="text-sm text-[var(--text-secondary)]">{formData.heroBackgroundSolid || '#1A365D'}</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="label">Start colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={formData.heroBackgroundStart || '#1A365D'} onChange={(e) => handleChange('heroBackgroundStart', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                        <span className="text-sm text-[var(--text-secondary)]">{formData.heroBackgroundStart || '#1A365D'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="label">End colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={formData.heroBackgroundEnd || '#0F2942'} onChange={(e) => handleChange('heroBackgroundEnd', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                        <span className="text-sm text-[var(--text-secondary)]">{formData.heroBackgroundEnd || '#0F2942'}</span>
                                    </div>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="label">Hero text colour</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={formData.heroTextColor || '#FFFFFF'} onChange={(e) => handleChange('heroTextColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                <span className="text-sm text-[var(--text-secondary)]">{formData.heroTextColor || '#FFFFFF'}</span>
                            </div>
                        </div>
                        <div>
                            <label className="label">Text alignment</label>
                            <select value={formData.heroTextAlign || 'center'} onChange={(e) => handleChange('heroTextAlign', e.target.value)} className="input-field">
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Font family (CSS)</label>
                            <input value={formData.heroFontFamily || ''} onChange={(e) => handleChange('heroFontFamily', e.target.value)} className="input-field text-sm" placeholder="var(--font-heading)" />
                        </div>
                        <div>
                            <label className="label">Font weight</label>
                            <select value={formData.heroFontWeight || '700'} onChange={(e) => handleChange('heroFontWeight', e.target.value)} className="input-field">
                                <option value="400">Normal (400)</option>
                                <option value="600">Semi-bold (600)</option>
                                <option value="700">Bold (700)</option>
                            </select>
                        </div>
                        {/* Font size sliders */}
                        <div className="md:col-span-2">
                            <label className="label">Title font size — {formData.heroTitleFontSize || '3.5rem'}</label>
                            <input type="range" min={1.5} max={4.5} step={0.25} value={remToNum(formData.heroTitleFontSize)} onChange={(e) => handleChange('heroTitleFontSize', numToRem(parseFloat(e.target.value)))} className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-[var(--accent-primary)]" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Subtitle font size — {formData.heroSubtitleFontSize || '1.25rem'}</label>
                            <input type="range" min={0.85} max={1.75} step={0.05} value={remToNum(formData.heroSubtitleFontSize)} onChange={(e) => handleChange('heroSubtitleFontSize', numToRem(parseFloat(e.target.value)))} className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-[var(--accent-primary)]" />
                        </div>
                        {/* Buttons: show or not + navigate */}
                        <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">Hero buttons</h4>
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.heroShowPrimaryCta !== false} onChange={(e) => handleChange('heroShowPrimaryCta', e.target.checked)} className="rounded border-gray-300" />
                                        <span className="label mb-0">Show primary button</span>
                                    </label>
                                    {formData.heroShowPrimaryCta !== false && (
                                        <>
                                            <input value={formData.ctaPrimaryText || ''} onChange={(e) => handleChange('ctaPrimaryText', e.target.value)} className="input-field flex-1 min-w-[140px]" placeholder="Button text" />
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[var(--text-secondary)]">Navigate to</span>
                                                <input value={formData.ctaPrimaryLink || ''} onChange={(e) => handleChange('ctaPrimaryLink', e.target.value)} className="input-field w-48" placeholder="/contact" title="Existing link is shown here" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.heroShowSecondaryCta !== false} onChange={(e) => handleChange('heroShowSecondaryCta', e.target.checked)} className="rounded border-gray-300" />
                                        <span className="label mb-0">Show secondary button</span>
                                    </label>
                                    {formData.heroShowSecondaryCta !== false && (
                                        <>
                                            <input value={formData.ctaSecondaryText || ''} onChange={(e) => handleChange('ctaSecondaryText', e.target.value)} className="input-field flex-1 min-w-[140px]" placeholder="Button text" />
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[var(--text-secondary)]">Navigate to</span>
                                                <input value={formData.ctaSecondaryLink ?? '#services-list'} onChange={(e) => handleChange('ctaSecondaryLink', e.target.value)} className="input-field w-48" placeholder="#services-list or /path" title="Existing link is shown here" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {selectedSection === 'solutions' && (
                <>
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2"><Layers size={20} /> Solutions section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Solutions section title</label>
                            <input value={formData.sectionSolutionsTitle || ''} onChange={(e) => handleChange('sectionSolutionsTitle', e.target.value)} className="input-field" placeholder="Integrated Capital & Investment Solutions" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Solutions section subtitle</label>
                            <textarea
                                value={formData.sectionSolutionsSubtitle || ''}
                                onChange={(e) => handleChange('sectionSolutionsSubtitle', e.target.value)}
                                className="input-field"
                                rows={3}
                                placeholder="IVC provides a comprehensive range of institutional financial services designed to support capital formation, asset growth, and cross-border investment opportunities."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Solutions card style</label>
                            <select value={formData.solutionsCardStyle || 'glass'} onChange={(e) => handleChange('solutionsCardStyle', e.target.value)} className="input-field">
                                <option value="glass">See-through (glass) — modern, background shows through</option>
                                <option value="solid">Solid — opaque white/gradient cards</option>
                            </select>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Applies to the solution cards on this page.</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Section title font & alignment</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Text alignment</label>
                                <select value={formData.sectionTitleAlign || 'center'} onChange={(e) => handleChange('sectionTitleAlign', e.target.value)} className="input-field">
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Font family (CSS value)</label>
                                <input value={formData.sectionTitleFontFamily || ''} onChange={(e) => handleChange('sectionTitleFontFamily', e.target.value)} className="input-field text-sm" placeholder="var(--font-heading)" />
                            </div>
                            <div>
                                <label className="label">Font size</label>
                                <input value={formData.sectionTitleFontSize || ''} onChange={(e) => handleChange('sectionTitleFontSize', e.target.value)} className="input-field" placeholder="2.5rem" />
                            </div>
                            <div>
                                <label className="label">Font weight</label>
                                <select value={formData.sectionTitleFontWeight || '700'} onChange={(e) => handleChange('sectionTitleFontWeight', e.target.value)} className="input-field">
                                    <option value="400">Normal (400)</option>
                                    <option value="600">Semi-bold (600)</option>
                                    <option value="700">Bold (700)</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Colour</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={formData.sectionTitleColor || '#1A365D'} onChange={(e) => handleChange('sectionTitleColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                    <span className="text-sm text-[var(--text-secondary)]">{formData.sectionTitleColor || '#1A365D'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4">Section tiles (solution cards)</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">Style the title, description, button and icon on each solution card.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Tile title</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="label">Font (CSS)</label>
                                    <input value={formData.tileTitleFontFamily || ''} onChange={(e) => handleChange('tileTitleFontFamily', e.target.value)} className="input-field text-sm" placeholder="var(--font-heading)" />
                                </div>
                                <div>
                                    <label className="label">Size — {formData.tileTitleFontSize || '1.4rem'}</label>
                                    <input type="range" min={0.9} max={2.2} step={0.1} value={remToNum(formData.tileTitleFontSize)} onChange={(e) => handleChange('tileTitleFontSize', numToRem(parseFloat(e.target.value)))} className="w-full h-2 rounded-lg bg-gray-200 accent-[var(--accent-primary)]" />
                                </div>
                                <div>
                                    <label className="label">Colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={formData.tileTitleColor || '#1A365D'} onChange={(e) => handleChange('tileTitleColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                        <span className="text-sm text-[var(--text-secondary)]">{formData.tileTitleColor || '#1A365D'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Tile description</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="label">Font size — {formData.tileDescFontSize || '0.95rem'}</label>
                                    <input type="range" min={0.75} max={1.35} step={0.05} value={remToNum(formData.tileDescFontSize)} onChange={(e) => handleChange('tileDescFontSize', numToRem(parseFloat(e.target.value)))} className="w-full h-2 rounded-lg bg-gray-200 accent-[var(--accent-primary)]" />
                                </div>
                                <div>
                                    <label className="label">Colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={formData.tileDescColor || '#4A5568'} onChange={(e) => handleChange('tileDescColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                        <span className="text-sm text-[var(--text-secondary)]">{formData.tileDescColor || '#4A5568'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Tile button</h4>
                            <div className="p-3 rounded-lg bg-gray-50 space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.tileButtonShow !== false} onChange={(e) => handleChange('tileButtonShow', e.target.checked)} className="rounded border-gray-300" />
                                    <span className="label mb-0">Show button on each card</span>
                                </label>
                                {formData.tileButtonShow !== false && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="label">Button text</label>
                                            <input value={formData.tileButtonText || 'Learn More'} onChange={(e) => handleChange('tileButtonText', e.target.value)} className="input-field" placeholder="Learn More" />
                                        </div>
                                        <div>
                                            <label className="label">Navigate to (link)</label>
                                            <input value={formData.tileButtonLink || ''} onChange={(e) => handleChange('tileButtonLink', e.target.value)} className="input-field" placeholder="Leave empty to use each card’s link" title="If each card has its own link, it is used. This is the default or override." />
                                            <p className="text-xs text-[var(--text-secondary)] mt-1">Per-card links are set in Services Manager. This field is for a default; existing link is shown here if set.</p>
                                        </div>
                                        <div>
                                            <label className="label">Button colour</label>
                                            <div className="flex items-center gap-2">
                                                <input type="color" value={formData.tileButtonColor || '#B8860B'} onChange={(e) => handleChange('tileButtonColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                                <span className="text-sm text-[var(--text-secondary)]">{formData.tileButtonColor || '#B8860B'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="label">Button font size — {formData.tileButtonFontSize || '0.95rem'}</label>
                                            <input type="range" min={0.75} max={1.35} step={0.05} value={remToNum(formData.tileButtonFontSize)} onChange={(e) => handleChange('tileButtonFontSize', numToRem(parseFloat(e.target.value)))} className="w-full h-2 rounded-lg bg-gray-200 accent-[var(--accent-primary)]" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Tile icon</h4>
                            <label className="label">Icon colour</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={formData.tileIconColor || '#1A365D'} onChange={(e) => handleChange('tileIconColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                <span className="text-sm text-[var(--text-secondary)]">{formData.tileIconColor || '#1A365D'}</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Tile card</h4>
                            <label className="label">Card background colour</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={formData.tileCardBg || '#FFFFFF'} onChange={(e) => handleChange('tileCardBg', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                <span className="text-sm text-[var(--text-secondary)]">{formData.tileCardBg || '#FFFFFF'}</span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Solid cards use this colour; glass cards use it as a tint.</p>
                        </div>
                    </div>
                </div>
                </>
                )}

                {selectedSection === 'leadMagnet' && (
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4">Lead magnet block</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Title</label>
                            <input value={formData.leadMagnetTitle || ''} onChange={(e) => handleChange('leadMagnetTitle', e.target.value)} className="input-field" placeholder="Unsure which solution fits your needs?" />
                        </div>
                        <div>
                            <label className="label">Description</label>
                            <textarea value={formData.leadMagnetDescription || ''} onChange={(e) => handleChange('leadMagnetDescription', e.target.value)} className="input-field" rows={2} placeholder="Our analysts can assess..." />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Button text</label>
                                <input value={formData.leadMagnetButtonText || ''} onChange={(e) => handleChange('leadMagnetButtonText', e.target.value)} className="input-field" placeholder="Get a Free Assessment" />
                            </div>
                            <div>
                                <label className="label">Button link</label>
                                <input value={formData.leadMagnetButtonLink || ''} onChange={(e) => handleChange('leadMagnetButtonLink', e.target.value)} className="input-field" placeholder="/contact" />
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">Lead magnet font & alignment</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Text alignment</label>
                                    <select value={formData.leadMagnetTextAlign || 'center'} onChange={(e) => handleChange('leadMagnetTextAlign', e.target.value)} className="input-field">
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Font family (CSS value)</label>
                                    <input value={formData.leadMagnetFontFamily || ''} onChange={(e) => handleChange('leadMagnetFontFamily', e.target.value)} className="input-field text-sm" placeholder="var(--font-heading)" />
                                </div>
                                <div>
                                    <label className="label">Title font size</label>
                                    <input value={formData.leadMagnetTitleFontSize || ''} onChange={(e) => handleChange('leadMagnetTitleFontSize', e.target.value)} className="input-field" placeholder="2rem" />
                                </div>
                                <div>
                                    <label className="label">Description font size</label>
                                    <input value={formData.leadMagnetDescFontSize || ''} onChange={(e) => handleChange('leadMagnetDescFontSize', e.target.value)} className="input-field" placeholder="1.1rem" />
                                </div>
                                <div>
                                    <label className="label">Title colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={formData.leadMagnetTitleColor || '#1A365D'} onChange={(e) => handleChange('leadMagnetTitleColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                        <input type="text" value={formData.leadMagnetTitleColor || ''} onChange={(e) => handleChange('leadMagnetTitleColor', e.target.value)} className="input-field flex-1" placeholder="#1A365D" />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Description colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={formData.leadMagnetDescColor || '#4A5568'} onChange={(e) => handleChange('leadMagnetDescColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                        <input type="text" value={formData.leadMagnetDescColor || ''} onChange={(e) => handleChange('leadMagnetDescColor', e.target.value)} className="input-field flex-1" placeholder="#4A5568" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {activeCustomSection && (
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2"><FileText size={20} /> Custom section</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Title</label>
                                <input value={activeCustomSection.title || ''} onChange={e => updateCustomSection(selectedSection, { title: e.target.value })} className="input-field" placeholder="Section title" />
                            </div>
                            <div>
                                <label className="label">Subtitle</label>
                                <input value={activeCustomSection.subtitle || ''} onChange={e => updateCustomSection(selectedSection, { subtitle: e.target.value })} className="input-field" placeholder="Optional subtitle" />
                            </div>
                        </div>
                        <LayoutPicker value={activeCustomSection.styles?.layoutType || 'standard'} onChange={v => updateCustomSectionStyles(selectedSection, { layoutType: v })} />
                        <div>
                            <label className="label">Content / text</label>
                            <textarea rows={4} value={activeCustomSection.content || ''} onChange={e => updateCustomSection(selectedSection, { content: e.target.value })} className="input-field" placeholder="Main body text..." />
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="label mb-0">Items (list / cards)</label>
                                <button type="button" onClick={() => addCustomItem(selectedSection)} className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold">
                                    <Plus size={12} /> Add item
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(activeCustomSection.items || []).map((item, i) => (
                                    <div key={item.id || i} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="w-8 shrink-0"><IconPicker value={item.icon} onChange={v => updateCustomItem(selectedSection, i, 'icon', v)} /></div>
                                        <input value={item.title || ''} onChange={e => updateCustomItem(selectedSection, i, 'title', e.target.value)} className="input-field flex-1 text-sm" placeholder="Item title" />
                                        <textarea value={item.description || ''} onChange={e => updateCustomItem(selectedSection, i, 'description', e.target.value)} className="input-field flex-1 text-sm min-h-[60px]" placeholder="Description" />
                                        <button type="button" onClick={() => removeCustomItem(selectedSection, i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded shrink-0"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">Section appearance</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Background</label>
                                    <input type="color" value={activeCustomSection.styles?.bgColor || '#F8FAFC'} onChange={e => updateCustomSectionStyles(selectedSection, { bgColor: e.target.value })} className="h-10 w-full rounded border" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Title color</label>
                                    <input type="color" value={activeCustomSection.styles?.titleColor || '#1A365D'} onChange={e => updateCustomSectionStyles(selectedSection, { titleColor: e.target.value })} className="h-10 w-full rounded border" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Text color</label>
                                    <input type="color" value={activeCustomSection.styles?.textColor || '#1A365D'} onChange={e => updateCustomSectionStyles(selectedSection, { textColor: e.target.value })} className="h-10 w-full rounded border" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Icon color</label>
                                    <input type="color" value={activeCustomSection.styles?.iconColor || '#C9A227'} onChange={e => updateCustomSectionStyles(selectedSection, { iconColor: e.target.value })} className="h-10 w-full rounded border" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {selectedSection !== 'hero' && selectedSection !== 'solutions' && selectedSection !== 'leadMagnet' && !activeCustomSection && (
                    <div className="glass-card p-8 text-center text-[var(--text-secondary)]">
                        Select a section from the list to edit.
                    </div>
                )}
                </div>
            </form>
        </div>
    );
};

export default ServicesPageManager;
