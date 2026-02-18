import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Save, Loader2, Layout, Palette, Layers, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const PAGE_SECTION_IDS = ['solutions', 'leadMagnet'];
const PAGE_SECTION_LABELS = { solutions: 'Solutions (service cards)', leadMagnet: 'Lead magnet block' };

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
    sectionSolutionsTitle: 'Our Specialized Solutions',
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
    pageContentOrder: ['solutions', 'leadMagnet']
};

const ServicesPageManager = () => {
    const { content, loading, saving, saveContent } = useContent('services_page', DEFAULT_PAGE);
    const [formData, setFormData] = useState(DEFAULT_PAGE);

    useEffect(() => {
        if (content && Object.keys(content).length > 0 && !loading) {
            const merged = { ...DEFAULT_PAGE, ...content };
            const bg = parseHeroBg(merged.heroBackground);
            setFormData(prev => ({
                ...DEFAULT_PAGE,
                ...prev,
                ...merged,
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

    const pageOrder = Array.isArray(formData.pageContentOrder) && formData.pageContentOrder.length
        ? formData.pageContentOrder.filter(id => PAGE_SECTION_IDS.includes(id))
        : [...PAGE_SECTION_IDS];
    const orderedIds = [...new Set([...pageOrder, ...PAGE_SECTION_IDS])];

    const handlePageOrderDragEnd = (result) => {
        if (!result.destination) return;
        const next = Array.from(orderedIds);
        const [removed] = next.splice(result.source.index, 1);
        next.splice(result.destination.index, 0, removed);
        handleChange('pageContentOrder', next);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Services Page</h1>
                    <p className="text-[var(--text-secondary)]">Customise the main Services page (/services): hero, section titles, and CTA. Service cards are managed in <strong>Services Manager</strong>.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-save">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Page content order – drag to reorder */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-2">Page content order</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">Drag to change the order of sections on the Services page. Hero is always first.</p>
                    <DragDropContext onDragEnd={handlePageOrderDragEnd}>
                        <Droppable droppableId="page-content-order">
                            {(provided) => (
                                <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                                    {orderedIds.map((id, index) => (
                                        <Draggable key={id} draggableId={id} index={index}>
                                            {(provided, snapshot) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border bg-white ${snapshot.isDragging ? 'shadow-lg border-[var(--accent-primary)]' : 'border-gray-200'}`}
                                                >
                                                    <span {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-[var(--accent-primary)]">
                                                        <GripVertical size={20} />
                                                    </span>
                                                    <span className="font-medium text-gray-800">{PAGE_SECTION_LABELS[id] || id}</span>
                                                    <span className="text-xs text-gray-400">#{ index + 1 }</span>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {/* Hero */}
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
                            <textarea value={formData.heroSubtitle || ''} onChange={(e) => handleChange('heroSubtitle', e.target.value)} className="input-field" rows={2} placeholder="Comprehensive financial pathways..." />
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

                {/* Section titles */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4">Section titles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Solutions section title</label>
                            <input value={formData.sectionSolutionsTitle || ''} onChange={(e) => handleChange('sectionSolutionsTitle', e.target.value)} className="input-field" placeholder="Our Specialized Solutions" />
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

                {/* Section tiles (solution cards) */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2">
                        <Layers size={20} /> Section tiles (solution cards)
                    </h3>
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

                {/* Lead magnet (interstitial) */}
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

            </form>
        </div>
    );
};

export default ServicesPageManager;
