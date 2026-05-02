import React, { useState, useEffect, useRef } from 'react';
import { Save, Eye, RefreshCw, Info, Plus, Trash2, Layout, Target, Zap, Building2, TrendingUp, Wallet, ShieldCheck, Scale, GripVertical, HelpCircle, Loader2, FileText, RotateCcw, ChevronDown, ChevronUp, Type, AlignLeft, MousePointer, Minus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import IconPicker from '../components/IconPicker';
import ImageUpload from '../components/ImageUpload';
import * as LucideIcons from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useRegisterContentUndo } from '../hooks/useRegisterContentUndo';

const AVAILABLE_ROUTES = [
    { label: 'Strategic Services', path: '/services' },
    { label: 'Mission & Vision', path: '/mission-vision-values' },
    { label: 'Investors', path: '/investors' },
    { label: 'Latest News', path: '/latest-news-2' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Join Us', path: '/join-us' },
    { label: 'Board of Directors', path: '/board-of-directors' },
    { label: 'Project Listing', path: '/project-listings' },
    { label: 'AI Capital Assessment', path: '/ai-capital-assessment' }
];

const GRADIENT_DIRECTIONS = [
    { label: 'To bottom', value: 'to bottom' },
    { label: 'To right', value: 'to right' },
    { label: 'To top', value: 'to top' },
    { label: 'To top right', value: '135deg' },
    { label: 'To bottom right', value: '45deg' }
];

function parseGradient(str) {
    if (!str || typeof str !== 'string' || !str.includes('linear-gradient')) return null;
    const m = str.match(/linear-gradient\s*\(\s*([^)]+)\s*\)/);
    if (!m) return null;
    const parts = m[1].split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 3) return { direction: parts[0], start: parts[1], end: parts[2] };
    if (parts.length === 2) return { direction: 'to bottom', start: parts[0], end: parts[1] };
    return null;
}

function safeHex(val, fallback) {
    if (!val || typeof val !== 'string') return fallback;
    return val.match(/^#[0-9A-Fa-f]{6}$/) ? val : fallback;
}

function buildGradient(direction, start, end) {
    return `linear-gradient(${direction}, ${start}, ${end})`;
}

function ensureTrustTabOrder(order) {
    if (!Array.isArray(order) || order.length === 0) {
        return ['hero', 'services', 'trust', 'industries'];
    }
    if (order.includes('trust')) {
        return order;
    }
    const withoutTrust = order.filter(id => id !== 'trust');
    const industriesIndex = withoutTrust.indexOf('industries');
    if (industriesIndex === -1) {
        return [...withoutTrust, 'trust'];
    }
    const next = [...withoutTrust];
    next.splice(industriesIndex, 0, 'trust');
    return next;
}

const HomeManager = () => {
    const [activeTab, setActiveTab] = useState('hero');

    // Default content structure
    const defaultFormData = {
        // Hero blocks – ordered content elements
        heroBlocks: [
            {
                id: 'hb-1',
                type: 'title',
                content: 'Engineering Capital\nfor Global Growth',
                color: '#1A365D',
                highlightColor: '#B8860B'
            },
            {
                id: 'hb-2',
                type: 'subtitle',
                content: 'Governance • Transparency • AI-Driven Intelligence',
                color: '#B8860B'
            },
            {
                id: 'hb-3',
                type: 'text',
                content: 'Instrak Venture Capital (IVC) structures institutional-grade capital across Asia and the Middle East, combining disciplined governance with AI-driven investment intelligence.',
                color: '#4A5568'
            },
            {
                id: 'hb-4',
                type: 'buttons',
                buttons: [
                    { id: 1, text: 'Start AI Capital Assessment', link: '/ai-capital-assessment', variant: 'solid' },
                    { id: 2, text: 'Speak With An Advisor', link: '/contact', variant: 'outline' }
                ],
                solidStyle: 'solid', // 'solid' | 'gradient'
                solidBg: '#1A365D',
                solidBgTo: '#0F2942',
                solidTextColor: '#FFFFFF',
                outlineColor: '#B8860B',
                outlineTextColor: '#B8860B'
            }
        ],
        // Hero background settings
        heroBackgroundImage: '',
        heroBgOpacity: 0.25,
        heroOverlayOpacity: 0.92,
        servicesSubtitle: "Comprehensive financial solutions tailored for your growth",
        servicesTitle: "Our Portfolio",
        servicesSectionStyles: {
            backgroundColor: '',
            textColor: '',
            boxColor: '',
            cardStyle: 'glass'
        },
        industriesSectionStyles: {
            backgroundColor: '',
            textColor: '',
            boxColor: ''
        },
        industries: [
            { id: "ind-1", icon: "Fuel", name: "Oil and Gas" },
            { id: "ind-2", icon: "GraduationCap", name: "Education" },
            { id: "ind-3", icon: "Car", name: "Automotive" },
            { id: "ind-4", icon: "HardHat", name: "Construction" },
            { id: "ind-5", icon: "Building", name: "Property Dev" },
            { id: "ind-6", icon: "Truck", name: "Logistics" },
            { id: "ind-7", icon: "Factory", name: "Manufacturing" },
            { id: "ind-8", icon: "Cpu", name: "Digital Tech" }
        ],
        // Trust & Credibility strip
        trustTitle: 'Trust & Credibility',
        trustSubtitle: 'Institutional-grade structuring, governance and investor alignment for cross-border capital.',
        trustSignals: [
            { id: 'sig-1', label: 'Cross-border capital structuring' },
            { id: 'sig-2', label: 'Institutional governance framework' },
            { id: 'sig-3', label: 'Global investor network' },
            { id: 'sig-4', label: 'Strategic asset management' }
        ],
        trustMetrics: [
            {
                id: 'met-1',
                label: 'Global Investor Network',
                description: 'Access to institutional investors, family offices, and strategic partners across multiple regions.'
            },
            {
                id: 'met-2',
                label: 'Strategic Investment Mandates',
                description: 'Customised mandates aligned with institutional risk, governance, and return expectations.'
            },
            {
                id: 'met-3',
                label: 'Cross-Border Transactions Facilitated',
                description: 'Structured capital flows and transactions executed across ASEAN and global markets.'
            }
        ],
        trustSectionStyles: {
            backgroundColor: '',
            textColor: '',
            boxColor: '',
            titleFontSize: 32,
            subtitleFontSize: 16,
            signalFontSize: 13,
            metricLabelFontSize: 15,
            metricDescFontSize: 13,
            textAlign: 'left'
        },
        customSections: [],
        // Tab order - can be reordered via drag
        tabOrder: ["hero", "services", "trust", "industries"]
    };

    // Use Supabase content hook
    const {
        content,
        loading,
        saving,
        saveContent,
        revisions,
        revisionsLoading,
        loadRevisions,
        restoreRevision,
    } = useContent('home', defaultFormData);
    const [formData, setFormData] = useState(defaultFormData);

    // Load content from Supabase when available
    const [isInitialized, setIsInitialized] = useState(false);
    const revisionsPrimed = useRef(false);

    // Load content from Supabase when available
    useEffect(() => {
        if (content && !loading && !isInitialized) {
            setFormData(prev => ({ ...prev, ...content }));
            setIsInitialized(true);
        }
    }, [content, loading, isInitialized]);

    useEffect(() => {
        if (!loading && !revisionsPrimed.current) {
            revisionsPrimed.current = true;
            loadRevisions();
        }
    }, [loading]);

    useRegisterContentUndo({
        shouldOffer: revisions.length > 0,
        busy: saving || revisionsLoading,
        executeUndo: async () => {
            const latest = revisions[0];
            if (!latest) return;
            const ok = await restoreRevision(latest.id);
            if (ok) {
                await loadRevisions();
                setIsInitialized(false);
            }
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ── Hero Block Logic ──
    const heroBlocks = formData.heroBlocks || defaultFormData.heroBlocks;

    const updateHeroBlocks = (newBlocks) => {
        setFormData(prev => ({ ...prev, heroBlocks: newBlocks }));
    };

    const addHeroBlock = (type) => {
        const id = `hb-${Date.now()}`;
        let newBlock;
        switch (type) {
            case 'title':
                newBlock = { id, type: 'title', content: 'New Title', color: '#1A365D', highlightColor: '#B8860B', align: 'left' };
                break;
            case 'subtitle':
                newBlock = { id, type: 'subtitle', content: 'New Subtitle', color: '#B8860B', align: 'left' };
                break;
            case 'text':
                newBlock = { id, type: 'text', content: 'Enter your text here...', color: '#4A5568', align: 'left' };
                break;
            case 'buttons':
                newBlock = {
                    id,
                    type: 'buttons',
                    buttons: [{ id: Date.now(), text: 'New Button', link: '/contact', variant: 'solid' }],
                    solidStyle: 'solid',
                    solidBg: '#1A365D',
                    solidBgTo: '#0F2942',
                    solidTextColor: '#FFFFFF',
                    outlineColor: '#B8860B',
                    outlineTextColor: '#B8860B',
                    align: 'left'
                };
                break;
            case 'spacer':
                newBlock = { id, type: 'spacer', height: 24 };
                break;
            default: return;
        }
        updateHeroBlocks([...heroBlocks, newBlock]);
    };

    const updateHeroBlock = (blockId, updates) => {
        updateHeroBlocks(heroBlocks.map(b => b.id === blockId ? { ...b, ...updates } : b));
    };

    const removeHeroBlock = (blockId) => {
        updateHeroBlocks(heroBlocks.filter(b => b.id !== blockId));
    };

    // Button management within a buttons block
    const addButtonToBlock = (blockId) => {
        const block = heroBlocks.find(b => b.id === blockId);
        if (!block || (block.buttons || []).length >= 4) return toast.error('Max 4 buttons per block');
        updateHeroBlock(blockId, { buttons: [...(block.buttons || []), { id: Date.now(), text: 'New Button', link: '/contact', variant: 'solid' }] });
    };

    const updateButtonInBlock = (blockId, btnId, field, value) => {
        const block = heroBlocks.find(b => b.id === blockId);
        if (!block) return;
        updateHeroBlock(blockId, { buttons: block.buttons.map(btn => btn.id === btnId ? { ...btn, [field]: value } : btn) });
    };

    const removeButtonFromBlock = (blockId, btnId) => {
        const block = heroBlocks.find(b => b.id === blockId);
        if (!block) return;
        updateHeroBlock(blockId, { buttons: block.buttons.filter(btn => btn.id !== btnId) });
    };

    // Services Section Logic - title/subtitle only; individual services managed via Services Manager

    // Industries Logic
    const handleIndustryChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            industries: prev.industries.map(ind => ind.id === id ? { ...ind, [field]: value } : ind)
        }));
    };

    const handleAddIndustry = () => {
        const newIndustry = { id: `ind-${Date.now()}`, name: 'New Industry', icon: 'Building2' };
        setFormData(prev => ({ ...prev, industries: [...prev.industries, newIndustry] }));
    };

    const handleDeleteIndustry = (id) => {
        setFormData(prev => ({ ...prev, industries: prev.industries.filter(ind => ind.id !== id) }));
    };

    const handleIndustryDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(formData.industries);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFormData(prev => ({ ...prev, industries: items }));
    };

    // Custom Sections Logic
    const handleAddSection = () => {
        const newId = `custom-${Date.now()}`;
        // Default style settings included
        const newSection = {
            id: newId,
            title: 'New Custom Section',
            content: 'Add your content here...',
            textAlign: 'center',
            textColor: '#1A365D',
            bgColor: '#FFFFFF'
        };

        setFormData(prev => ({
            ...prev,
            customSections: [...(prev.customSections || []), newSection],
            tabOrder: [...prev.tabOrder, newId]
        }));
        setActiveTab(newId);
    };

    const handleDeleteSection = (id) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            setFormData(prev => ({
                ...prev,
                customSections: prev.customSections.filter(s => s.id !== id),
                tabOrder: prev.tabOrder.filter(tid => tid !== id)
            }));
            if (activeTab === id) setActiveTab('hero');
        }
    };

    const handleCustomSectionChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const ok = await saveContent(formData);
        if (ok) await loadRevisions();
    };

    // Tab configuration
    const staticTabs = {
        hero: { label: 'Hero Section', icon: Layout },
        services: { label: 'Services Section', icon: TrendingUp },
        trust: { label: 'Trust & Credibility Strip', icon: ShieldCheck },
        industries: { label: 'Industries', icon: Building2 },
    };

    const tabOrder = ensureTrustTabOrder(formData.tabOrder || ['hero', 'services', 'industries']);

    // Combined drag handler for both tabs and industries
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === 'tabs') {
            const items = Array.from(tabOrder);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setFormData(prev => ({ ...prev, tabOrder: items }));
        } else if (source.droppableId === 'industries') {
            const items = Array.from(formData.industries);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setFormData(prev => ({ ...prev, industries: items }));
        } else if (source.droppableId === 'heroBlocks') {
            const items = Array.from(heroBlocks);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            updateHeroBlocks(items);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--text-primary)] mb-2">Home Page Manager</h1>
                    <p className="text-[var(--text-secondary)]">Manage content for the main landing page. Drag tabs to reorder sections.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleAddSection} className="btn-add">
                        <Plus size={18} />
                        <span>Add Section</span>
                    </button>
                    {loading ? (
                        <div className="flex items-center gap-2 px-6 py-2.5 bg-gray-300 text-gray-500 rounded-lg">
                            <Loader2 size={18} className="animate-spin" />
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <button onClick={handleSave} disabled={saving} className="btn-save">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Single DragDropContext for all draggables */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tabs" direction="horizontal">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex gap-2 overflow-x-auto pb-4 border-b border-[var(--border-light)] mb-6 no-scrollbar"
                        >
                            {tabOrder.map((tabId, index) => {
                                let label, Icon;
                                if (staticTabs[tabId]) {
                                    label = staticTabs[tabId].label;
                                    Icon = staticTabs[tabId].icon;
                                } else {
                                    // Custom Section
                                    const section = formData.customSections?.find(s => s.id === tabId);
                                    if (!section) return null; // Filter out unknown/orphaned sections
                                    label = section.title;
                                    Icon = FileText;
                                }

                                return (
                                    <Draggable key={tabId} draggableId={tabId} index={index}>
                                        {(provided, snapshot) => (
                                            <button
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => setActiveTab(tabId)}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400 z-50' : ''} ${activeTab === tabId
                                                    ? 'bg-[var(--accent-primary)] text-white'
                                                    : 'bg-white border border-gray-200 text-[var(--text-secondary)] hover:bg-gray-50'
                                                    }`}
                                            >
                                                <GripVertical size={14} className="opacity-40" />
                                                <Icon size={16} />
                                                {label}
                                            </button>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                <div className="grid grid-cols-1 gap-8">
                    {/* Editor Area */}
                    <div className="space-y-6">
                        {/* HERO TAB */}
                        {activeTab === 'hero' && (
                            <div className="glass-card p-6 space-y-6">
                                {/* ── Content Blocks (drag-and-drop) ── */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold">Content Blocks</h3>
                                        <div className="flex gap-2">
                                            {[{ type: 'title', icon: Type, label: 'Title' }, { type: 'subtitle', icon: AlignLeft, label: 'Subtitle' }, { type: 'text', icon: FileText, label: 'Text' }, { type: 'buttons', icon: MousePointer, label: 'Buttons' }, { type: 'spacer', icon: Minus, label: 'Spacer' }].map(({ type, icon: Icon, label }) => (
                                                <button key={type} onClick={() => addHeroBlock(type)} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                                    <Icon size={12} /> {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Droppable droppableId="heroBlocks">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                                                {heroBlocks.length === 0 && (
                                                    <div className="text-center py-10 bg-gray-50 rounded border-2 border-dashed border-gray-300 text-gray-400 text-sm">No blocks yet. Add one above to start building your hero section.</div>
                                                )}
                                                {heroBlocks.map((block, idx) => (
                                                    <Draggable key={block.id} draggableId={block.id} index={idx}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`bg-white p-4 rounded-lg border border-gray-200 group ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-400 z-50' : ''}`}
                                                            >
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-[var(--accent-primary)] cursor-grab">
                                                                        <GripVertical size={18} />
                                                                    </div>
                                                                    <span className="uppercase text-[10px] font-bold text-gray-400 tracking-wider bg-gray-100 px-2 py-0.5 rounded">{block.type}</span>
                                                                    <button onClick={() => removeHeroBlock(block.id)} className="ml-auto text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                                </div>

                                                                {/* ── Title Block ── */}
                                                                {block.type === 'title' && (
                                                                    <div className="space-y-3">
                                                                        <textarea value={block.content} onChange={(e) => updateHeroBlock(block.id, { content: e.target.value })} rows={2} className="input-field" placeholder="Title text (use Enter for second line highlight)" />
                                                                        <div className="flex flex-wrap gap-4 items-center">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Align</span>
                                                                                <select value={block.align || 'left'} onChange={(e) => updateHeroBlock(block.id, { align: e.target.value })} className="input-field text-sm w-28">
                                                                                    <option value="left">Left</option>
                                                                                    <option value="middle">Middle</option>
                                                                                    <option value="right">Right</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Color</span>
                                                                                <input type="color" value={block.color || '#1A365D'} onChange={(e) => updateHeroBlock(block.id, { color: e.target.value })} className="h-8 w-10 p-0.5 rounded border border-gray-200 cursor-pointer" />
                                                                                <span className="text-[10px] text-gray-400 font-mono">{block.color || '#1A365D'}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Highlight</span>
                                                                                <input type="color" value={block.highlightColor || '#B8860B'} onChange={(e) => updateHeroBlock(block.id, { highlightColor: e.target.value })} className="h-8 w-10 p-0.5 rounded border border-gray-200 cursor-pointer" />
                                                                                <span className="text-[10px] text-gray-400 font-mono">{block.highlightColor || '#B8860B'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* ── Subtitle Block ── */}
                                                                {block.type === 'subtitle' && (
                                                                    <div className="space-y-3">
                                                                        <input value={block.content} onChange={(e) => updateHeroBlock(block.id, { content: e.target.value })} className="input-field" placeholder="Subtitle text" />
                                                                        <div className="flex flex-wrap gap-4 items-center">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Align</span>
                                                                                <select value={block.align || 'left'} onChange={(e) => updateHeroBlock(block.id, { align: e.target.value })} className="input-field text-sm w-28">
                                                                                    <option value="left">Left</option>
                                                                                    <option value="middle">Middle</option>
                                                                                    <option value="right">Right</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Color</span>
                                                                                <input type="color" value={block.color || '#B8860B'} onChange={(e) => updateHeroBlock(block.id, { color: e.target.value })} className="h-8 w-10 p-0.5 rounded border border-gray-200 cursor-pointer" />
                                                                                <span className="text-[10px] text-gray-400 font-mono">{block.color || '#B8860B'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* ── Text Block ── */}
                                                                {block.type === 'text' && (
                                                                    <div className="space-y-3">
                                                                        <textarea value={block.content} onChange={(e) => updateHeroBlock(block.id, { content: e.target.value })} rows={3} className="input-field" placeholder="Description text" />
                                                                        <div className="flex flex-wrap gap-4 items-center">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Align</span>
                                                                                <select value={block.align || 'left'} onChange={(e) => updateHeroBlock(block.id, { align: e.target.value })} className="input-field text-sm w-28">
                                                                                    <option value="left">Left</option>
                                                                                    <option value="middle">Middle</option>
                                                                                    <option value="right">Right</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Color</span>
                                                                                <input type="color" value={block.color || '#4A5568'} onChange={(e) => updateHeroBlock(block.id, { color: e.target.value })} className="h-8 w-10 p-0.5 rounded border border-gray-200 cursor-pointer" />
                                                                                <span className="text-[10px] text-gray-400 font-mono">{block.color || '#4A5568'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* ── Buttons Block ── */}
                                                                {block.type === 'buttons' && (
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-gray-500">Align</span>
                                                                            <select value={block.align || 'left'} onChange={(e) => updateHeroBlock(block.id, { align: e.target.value })} className="input-field text-sm w-28">
                                                                                <option value="left">Left</option>
                                                                                <option value="middle">Middle</option>
                                                                                <option value="right">Right</option>
                                                                            </select>
                                                                        </div>
                                                                        {(block.buttons || []).map(btn => (
                                                                            <div key={btn.id} className="p-3 bg-gray-50 rounded-lg flex flex-wrap gap-2 items-center border border-gray-200">
                                                                                <div className="flex-1 min-w-[120px] flex flex-col gap-1">
                                                                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Button label</span>
                                                                                    <input
                                                                                        value={btn.text ?? ''}
                                                                                        onChange={(e) => updateButtonInBlock(block.id, btn.id, 'text', e.target.value)}
                                                                                        className="input-field text-xs flex-1 bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                                                                                        placeholder="e.g. Contact Us"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex-1 min-w-[120px] flex flex-col gap-1">
                                                                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Link</span>
                                                                                    <select value={btn.link ?? ''} onChange={(e) => updateButtonInBlock(block.id, btn.id, 'link', e.target.value)} className="input-field text-xs flex-1 bg-white text-gray-900 border-gray-300">
                                                                                        {AVAILABLE_ROUTES.map(r => <option key={r.path} value={r.path}>{r.label}</option>)}
                                                                                    </select>
                                                                                </div>
                                                                                <div className="flex flex-col gap-1">
                                                                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Style</span>
                                                                                    <select value={btn.variant ?? 'solid'} onChange={(e) => updateButtonInBlock(block.id, btn.id, 'variant', e.target.value)} className="input-field text-xs w-24 bg-white text-gray-900 border-gray-300">
                                                                                        <option value="solid">Solid</option>
                                                                                        <option value="outline">Outline</option>
                                                                                    </select>
                                                                                </div>
                                                                                <button type="button" onClick={() => removeButtonFromBlock(block.id, btn.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title="Remove button"><Trash2 size={14} /></button>
                                                                            </div>
                                                                        ))}
                                                                        <div className="flex items-center gap-4">
                                                                            <button onClick={() => addButtonToBlock(block.id)} className="text-xs text-[var(--accent-primary)] font-bold flex items-center gap-1 hover:underline"><Plus size={14} /> Add Button</button>
                                                                            <div className="flex items-center gap-2 ml-auto">
                                                                                <span className="text-xs text-gray-500">Solid/Gradient</span>
                                                                                <select
                                                                                    value={block.solidStyle || 'solid'}
                                                                                    onChange={(e) => updateHeroBlock(block.id, { solidStyle: e.target.value })}
                                                                                    className="input-field text-xs w-28 bg-white text-gray-900 border-gray-300"
                                                                                >
                                                                                    <option value="solid">Solid</option>
                                                                                    <option value="gradient">Gradient</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">BG From</span>
                                                                                <input type="color" value={block.solidBg || '#1A365D'} onChange={(e) => updateHeroBlock(block.id, { solidBg: e.target.value })} className="h-7 w-9 p-0.5 rounded border border-gray-200 cursor-pointer" />
                                                                            </div>
                                                                            {(block.solidStyle || 'solid') === 'gradient' && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs text-gray-500">BG To</span>
                                                                                    <input type="color" value={block.solidBgTo || '#0F2942'} onChange={(e) => updateHeroBlock(block.id, { solidBgTo: e.target.value })} className="h-7 w-9 p-0.5 rounded border border-gray-200 cursor-pointer" />
                                                                                </div>
                                                                            )}
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Text</span>
                                                                                <input type="color" value={block.solidTextColor || '#FFFFFF'} onChange={(e) => updateHeroBlock(block.id, { solidTextColor: e.target.value })} className="h-7 w-9 p-0.5 rounded border border-gray-200 cursor-pointer" />
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Outline</span>
                                                                                <input type="color" value={block.outlineColor || '#B8860B'} onChange={(e) => updateHeroBlock(block.id, { outlineColor: e.target.value })} className="h-7 w-9 p-0.5 rounded border border-gray-200 cursor-pointer" />
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500">Outline Text</span>
                                                                                <input type="color" value={block.outlineTextColor || block.outlineColor || '#B8860B'} onChange={(e) => updateHeroBlock(block.id, { outlineTextColor: e.target.value })} className="h-7 w-9 p-0.5 rounded border border-gray-200 cursor-pointer" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* ── Spacer Block ── */}
                                                                {block.type === 'spacer' && (
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-xs text-gray-500">Height (px)</span>
                                                                        <input type="range" min="8" max="80" step="4" value={block.height || 24} onChange={(e) => updateHeroBlock(block.id, { height: parseInt(e.target.value) })} className="flex-1" />
                                                                        <span className="text-sm font-mono w-10 text-right">{block.height || 24}</span>
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
                                </div>

                                {/* ── Background Settings ── */}
                                <div className="pt-6 border-t border-[var(--border-light)] space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold">Background Settings</h3>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                heroBackgroundImage: '',
                                                heroBgOpacity: 0.25,
                                                heroOverlayOpacity: 0.92,
                                                heroBlocks: defaultFormData.heroBlocks
                                            }))}
                                            className="text-xs text-gray-500 hover:text-[var(--accent-primary)] flex items-center gap-1"
                                        >
                                            <RotateCcw size={14} /> Reset All to Defaults
                                        </button>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                                        <label className="label font-bold">Background Image</label>
                                        <p className="text-xs text-gray-400 -mt-2">Upload a custom hero background. Leave empty to use the default KL Skyline.</p>
                                        <div className="max-w-xs">
                                            <ImageUpload
                                                value={formData.heroBackgroundImage || ''}
                                                onChange={(val) => setFormData(prev => ({ ...prev, heroBackgroundImage: val }))}
                                                aspectRatio="16/9"
                                                maxSizeMB={2}
                                                maxWidth={1600}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <label className="label font-bold">Background Image Opacity</label>
                                            <div className="flex items-center gap-3">
                                                <input type="range" min="0" max="1" step="0.05" value={formData.heroBgOpacity ?? 0.25} onChange={(e) => setFormData(prev => ({ ...prev, heroBgOpacity: parseFloat(e.target.value) }))} className="flex-1" />
                                                <span className="text-sm font-mono w-10 text-right">{formData.heroBgOpacity ?? 0.25}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <label className="label font-bold">White Overlay Opacity</label>
                                            <div className="flex items-center gap-3">
                                                <input type="range" min="0" max="1" step="0.05" value={formData.heroOverlayOpacity ?? 0.92} onChange={(e) => setFormData(prev => ({ ...prev, heroOverlayOpacity: parseFloat(e.target.value) }))} className="flex-1" />
                                                <span className="text-sm font-mono w-10 text-right">{formData.heroOverlayOpacity ?? 0.92}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TRUST & CREDIBILITY STRIP TAB */}
                        {activeTab === 'trust' && (
                            <div className="glass-card p-6 space-y-6">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <ShieldCheck size={18} className="text-[var(--accent-primary)]" />
                                            <span>Trust &amp; Credibility Strip</span>
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                                            Configure the institutional trust strip shown above the Focus Industries section on the public home page.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="label">Section Title</label>
                                        <input
                                            name="trustTitle"
                                            value={formData.trustTitle || defaultFormData.trustTitle}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Trust &amp; Credibility"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Section Subtitle</label>
                                        <input
                                            name="trustSubtitle"
                                            value={formData.trustSubtitle || defaultFormData.trustSubtitle}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Institutional-grade structuring, governance and investor alignment..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                            Text alignment
                                        </label>
                                        <select
                                            value={formData.trustSectionStyles?.textAlign || 'left'}
                                            onChange={(e) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    trustSectionStyles: {
                                                        ...(prev.trustSectionStyles || {}),
                                                        textAlign: e.target.value
                                                    }
                                                }))
                                            }
                                            className="input-field text-sm w-full"
                                        >
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                        </select>
                                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                                            Controls how the subtitle and institutional signals align.
                                        </p>
                                    </div>
                                </div>

                                {/* Institutional Signals */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                            <ShieldCheck size={16} />
                                            <span>Institutional Signals</span>
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextId = `sig-${Date.now()}`;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    trustSignals: [
                                                        ...(prev.trustSignals || defaultFormData.trustSignals),
                                                        { id: nextId, label: 'New signal' }
                                                    ]
                                                }));
                                            }}
                                            className="text-xs bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded hover:bg-[#08304e] flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Add Signal
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {(formData.trustSignals || defaultFormData.trustSignals).map((sig) => (
                                            <div key={sig.id} className="flex items-center gap-2 p-2.5 border border-[var(--border-light)] rounded bg-white">
                                                <ShieldCheck size={16} className="text-[var(--accent-primary)] shrink-0" />
                                                <input
                                                    value={sig.label}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            trustSignals: (prev.trustSignals || defaultFormData.trustSignals).map(s =>
                                                                s.id === sig.id ? { ...s, label: value } : s
                                                            )
                                                        }));
                                                    }}
                                                    className="flex-1 text-sm outline-none border-b border-transparent focus:border-[var(--accent-primary)]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            trustSignals: (prev.trustSignals || defaultFormData.trustSignals).filter(s => s.id !== sig.id)
                                                        }));
                                                    }}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="space-y-3 border-t border-[var(--border-light)] pt-5 mt-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                            <Scale size={16} />
                                            <span>Institutional Metrics</span>
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextId = `met-${Date.now()}`;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    trustMetrics: [
                                                        ...(prev.trustMetrics || defaultFormData.trustMetrics),
                                                        { id: nextId, label: 'New metric', description: '' }
                                                    ]
                                                }));
                                            }}
                                            className="text-xs bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded hover:bg-[#08304e] flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Add Metric
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {(formData.trustMetrics || defaultFormData.trustMetrics).map((met) => (
                                            <div key={met.id} className="p-3 border border-[var(--border-light)] rounded-lg bg-white space-y-2">
                                                <input
                                                    value={met.label}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            trustMetrics: (prev.trustMetrics || defaultFormData.trustMetrics).map(m =>
                                                                m.id === met.id ? { ...m, label: value } : m
                                                            )
                                                        }));
                                                    }}
                                                    className="w-full text-sm font-semibold outline-none border-b border-transparent focus:border-[var(--accent-primary)]"
                                                    placeholder="Metric label"
                                                />
                                                <textarea
                                                    value={met.description || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            trustMetrics: (prev.trustMetrics || defaultFormData.trustMetrics).map(m =>
                                                                m.id === met.id ? { ...m, description: value } : m
                                                            )
                                                        }));
                                                    }}
                                                    rows={3}
                                                    className="w-full text-xs text-[var(--text-secondary)] border border-[var(--border-light)] rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                                    placeholder="Short description (optional)"
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                trustMetrics: (prev.trustMetrics || defaultFormData.trustMetrics).filter(m => m.id !== met.id)
                                                            }));
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1"
                                                    >
                                                        <Trash2 size={12} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Trust Section Colours & Fonts */}
                                <div className="border-t border-[var(--border-light)] pt-6 mt-6">
                                    <h4 className="font-bold text-[var(--text-primary)] mb-3">Section Colours</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mb-4">Solid or gradient. Same pattern as Industries.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Background</label>
                                            {(() => {
                                                const bgVal = formData.trustSectionStyles?.backgroundColor || '';
                                                const isBgGrad = bgVal.includes('linear-gradient');
                                                const parsedBg = parseGradient(bgVal) || { direction: 'to bottom', start: '#020617', end: '#0f172a' };
                                                return (
                                                    <>
                                                        <div className="flex gap-2 mb-2">
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), backgroundColor: '#020617' } }))} className={`px-2 py-1 text-xs rounded ${!isBgGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Solid</button>
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, parsedBg.start, parsedBg.end) } }))} className={`px-2 py-1 text-xs rounded ${isBgGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Gradient</button>
                                                        </div>
                                                        {!isBgGrad ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-lg border-2 border-[var(--border-light)] shrink-0" style={{ background: bgVal || '#020617' }} />
                                                                <input type="color" value={(bgVal || '#020617').match(/^#[0-9A-Fa-f]{6}$/) ? (bgVal || '#020617') : '#020617'} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), backgroundColor: e.target.value } }))} className="h-10 w-12 rounded border border-[var(--border-light)] cursor-pointer" />
                                                                <input type="text" value={bgVal} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), backgroundColor: e.target.value } }))} className="input-field text-sm flex-1" placeholder="#020617" />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div className="w-full h-10 rounded-lg border-2 border-[var(--border-light)]" style={{ background: bgVal }} />
                                                                <select value={parsedBg.direction} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), backgroundColor: buildGradient(e.target.value, parsedBg.start, parsedBg.end) } }))} className="input-field text-sm w-full">
                                                                    {GRADIENT_DIRECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                                                </select>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBg.start, '#020617')} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, e.target.value, parsedBg.end) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBg.start} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, e.target.value, parsedBg.end) } }))} className="input-field text-xs flex-1" placeholder="Start" />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBg.end, '#0f172a')} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, parsedBg.start, e.target.value) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBg.end} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, parsedBg.start, e.target.value) } }))} className="input-field text-xs flex-1" placeholder="End" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Text colour</label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg border-2 border-[var(--border-light)] shrink-0 flex items-center justify-center text-xs font-medium" style={{ background: formData.trustSectionStyles?.textColor || '#e5e7eb', color: ['#fff', '#ffffff', '#e5e7eb', '#f9fafb', '#f3f4f6', '#e0e0e0'].includes((formData.trustSectionStyles?.textColor || '').toLowerCase()) ? '#333' : '#fff' }}>Aa</div>
                                                <input type="color" value={formData.trustSectionStyles?.textColor || '#e5e7eb'} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), textColor: e.target.value } }))} className="h-10 w-12 rounded border border-[var(--border-light)] cursor-pointer" />
                                                <input type="text" value={formData.trustSectionStyles?.textColor || ''} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), textColor: e.target.value } }))} className="input-field text-sm flex-1" placeholder="#e5e7eb" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Card / pill colour</label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg border-2 border-[var(--border-light)] shrink-0" style={{ background: formData.trustSectionStyles?.boxColor || '#0f172a' }} />
                                                <input type="color" value={(formData.trustSectionStyles?.boxColor || '#0f172a').match(/^#[0-9A-Fa-f]{6}$/) ? (formData.trustSectionStyles?.boxColor || '#0f172a') : '#0f172a'} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), boxColor: e.target.value } }))} className="h-10 w-12 rounded border border-[var(--border-light)] cursor-pointer" />
                                                <input type="text" value={formData.trustSectionStyles?.boxColor || ''} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), boxColor: e.target.value } }))} className="input-field text-sm flex-1" placeholder="#0f172a" />
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-[var(--text-primary)] mt-6 mb-3">Font sizes (px)</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mb-4">Customise title, subtitle, signal pills and metric text.</p>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Title</label>
                                            <input type="number" min="18" max="48" value={formData.trustSectionStyles?.titleFontSize ?? 32} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), titleFontSize: parseInt(e.target.value) || 32 } }))} className="input-field text-sm w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Subtitle</label>
                                            <input type="number" min="12" max="24" value={formData.trustSectionStyles?.subtitleFontSize ?? 16} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), subtitleFontSize: parseInt(e.target.value) || 16 } }))} className="input-field text-sm w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Signal pills</label>
                                            <input type="number" min="10" max="20" value={formData.trustSectionStyles?.signalFontSize ?? 13} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), signalFontSize: parseInt(e.target.value) || 13 } }))} className="input-field text-sm w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Metric label</label>
                                            <input type="number" min="12" max="22" value={formData.trustSectionStyles?.metricLabelFontSize ?? 15} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), metricLabelFontSize: parseInt(e.target.value) || 15 } }))} className="input-field text-sm w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Metric description</label>
                                            <input type="number" min="11" max="18" value={formData.trustSectionStyles?.metricDescFontSize ?? 13} onChange={(e) => setFormData(prev => ({ ...prev, trustSectionStyles: { ...(prev.trustSectionStyles || {}), metricDescFontSize: parseInt(e.target.value) || 13 } }))} className="input-field text-sm w-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SERVICES SECTION TAB */}
                        {activeTab === 'services' && (
                            <div className="glass-card p-6 space-y-6">
                                <h3 className="text-xl font-bold mb-4">Services Section</h3>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> The services displayed in this section are managed via the <strong>Services Manager</strong> page.
                                        Here you can only edit the section title and subtitle.
                                    </p>
                                </div>
                                <div>
                                    <label className="label">Section Title</label>
                                    <input
                                        name="servicesTitle"
                                        value={formData.servicesTitle || 'Our Services'}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Our Services"
                                    />
                                </div>
                                <div>
                                    <label className="label">Section Subtitle</label>
                                    <input
                                        name="servicesSubtitle"
                                        value={formData.servicesSubtitle || ''}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Comprehensive financial solutions..."
                                    />
                                </div>

                                <div className="border-t border-[var(--border-light)] pt-6 mt-6">
                                    <h4 className="font-bold text-[var(--text-primary)] mb-3">Section Colours</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mb-4">Solid colour or gradient. Use picker or enter hex/gradient in the field.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Background */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Background</label>
                                            {(() => {
                                                const bgVal = formData.servicesSectionStyles?.backgroundColor || '';
                                                const isBgGrad = bgVal.includes('linear-gradient');
                                                const parsedBg = parseGradient(bgVal) || { direction: 'to bottom', start: '#0b1120', end: '#1e293b' };
                                                return (
                                                    <>
                                                        <div className="flex gap-2 mb-2">
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), backgroundColor: '#0b1120' } }))} className={`px-2 py-1 text-xs rounded ${!isBgGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Solid</button>
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, parsedBg.start, parsedBg.end) } }))} className={`px-2 py-1 text-xs rounded ${isBgGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Gradient</button>
                                                        </div>
                                                        {!isBgGrad ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-lg border-2 border-[var(--border-light)] shrink-0" style={{ background: bgVal || '#0b1120' }} />
                                                                <input type="color" value={(bgVal || '#0b1120').match(/^#[0-9A-Fa-f]{6}$/) ? (bgVal || '#0b1120') : '#0b1120'} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), backgroundColor: e.target.value } }))} className="h-10 w-12 rounded border border-[var(--border-light)] cursor-pointer" />
                                                                <input type="text" value={bgVal} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), backgroundColor: e.target.value } }))} className="input-field text-sm flex-1" placeholder="#0b1120" />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div className="w-full h-10 rounded-lg border-2 border-[var(--border-light)]" style={{ background: bgVal }} />
                                                                <select value={parsedBg.direction} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), backgroundColor: buildGradient(e.target.value, parsedBg.start, parsedBg.end) } }))} className="input-field text-sm w-full">
                                                                    {GRADIENT_DIRECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                                                </select>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBg.start, '#0b1120')} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, e.target.value, parsedBg.end) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBg.start} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, e.target.value, parsedBg.end) } }))} className="input-field text-xs flex-1" placeholder="Start" />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBg.end, '#1e293b')} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, parsedBg.start, e.target.value) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBg.end} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, parsedBg.start, e.target.value) } }))} className="input-field text-xs flex-1" placeholder="End" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        {/* Text colour */}
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Text colour</label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg border-2 border-[var(--border-light)] shrink-0 flex items-center justify-center text-xs font-medium" style={{ background: formData.servicesSectionStyles?.textColor || '#e5e7eb', color: ['#fff', '#ffffff', '#e5e7eb', '#f9fafb', '#f3f4f6', '#e0e0e0'].includes((formData.servicesSectionStyles?.textColor || '').toLowerCase()) ? '#333' : '#fff' }}>Aa</div>
                                                <input type="color" value={formData.servicesSectionStyles?.textColor || '#e5e7eb'} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), textColor: e.target.value } }))} className="h-10 w-12 rounded border border-[var(--border-light)] cursor-pointer" />
                                                <input type="text" value={formData.servicesSectionStyles?.textColor || ''} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), textColor: e.target.value } }))} className="input-field text-sm flex-1" placeholder="#e5e7eb" />
                                            </div>
                                        </div>
                                        {/* Card style: solid vs see-through (glass) */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Card style</label>
                                            <select
                                                value={formData.servicesSectionStyles?.cardStyle || 'glass'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), cardStyle: e.target.value } }))}
                                                className="input-field text-sm w-full"
                                            >
                                                <option value="glass">See-through (glass) — modern, background shows through</option>
                                                <option value="solid">Solid — opaque card using box colour below</option>
                                            </select>
                                            <p className="text-xs text-[var(--text-secondary)]">See-through gives a modern glass effect; solid uses the card/box colour.</p>
                                        </div>
                                        {/* Box colour */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Card / box colour</label>
                                            <p className="text-xs text-[var(--text-secondary)] mb-1">Used only when Card style is Solid.</p>
                                            {(() => {
                                                const boxVal = formData.servicesSectionStyles?.boxColor || '';
                                                const isBoxGrad = boxVal.includes('linear-gradient');
                                                const parsedBox = parseGradient(boxVal) || { direction: 'to bottom', start: '#111827', end: '#1e293b' };
                                                return (
                                                    <>
                                                        <div className="flex gap-2 mb-2">
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), boxColor: '#111827' } }))} className={`px-2 py-1 text-xs rounded ${!isBoxGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Solid</button>
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, parsedBox.start, parsedBox.end) } }))} className={`px-2 py-1 text-xs rounded ${isBoxGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Gradient</button>
                                                        </div>
                                                        {!isBoxGrad ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-lg border-2 border-[var(--border-light)] shrink-0" style={{ background: boxVal || '#111827' }} />
                                                                <input type="color" value={(boxVal || '#111827').match(/^#[0-9A-Fa-f]{6}$/) ? (boxVal || '#111827') : '#111827'} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), boxColor: e.target.value } }))} className="h-10 w-12 rounded border border-[var(--border-light)] cursor-pointer" />
                                                                <input type="text" value={boxVal} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), boxColor: e.target.value } }))} className="input-field text-sm flex-1" placeholder="#111827" />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div className="w-full h-10 rounded-lg border-2 border-[var(--border-light)]" style={{ background: boxVal }} />
                                                                <select value={parsedBox.direction} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), boxColor: buildGradient(e.target.value, parsedBox.start, parsedBox.end) } }))} className="input-field text-sm w-full">
                                                                    {GRADIENT_DIRECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                                                </select>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBox.start, '#111827')} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, e.target.value, parsedBox.end) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBox.start} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, e.target.value, parsedBox.end) } }))} className="input-field text-xs flex-1" placeholder="Start" />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBox.end, '#1e293b')} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, parsedBox.start, e.target.value) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBox.end} onChange={(e) => setFormData(prev => ({ ...prev, servicesSectionStyles: { ...(prev.servicesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, parsedBox.start, e.target.value) } }))} className="input-field text-xs flex-1" placeholder="End" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* INDUSTRIES TAB */}
                        {activeTab === 'industries' && (
                            <div className="glass-card p-6 space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold">Focus Industries</h3>
                                    <button onClick={handleAddIndustry} className="text-xs bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded hover:bg-[#08304e] flex items-center gap-1">
                                        <Plus size={14} /> Add Industry
                                    </button>
                                </div>

                                <Droppable droppableId="industries">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        >
                                            {formData.industries.map((ind, index) => (
                                                <Draggable key={ind.id} draggableId={ind.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`p-3 border border-[var(--border-light)] rounded bg-white flex items-center gap-3 group ${snapshot.isDragging ? 'shadow-xl ring-2 ring-[var(--accent-primary)] z-50' : ''}`}
                                                        >
                                                            <div {...provided.dragHandleProps} className="text-gray-400 hover:text-[var(--accent-primary)] cursor-grab">
                                                                <GripVertical size={18} />
                                                            </div>
                                                            <div className="w-10 shrink-0">
                                                                <IconPicker value={ind.icon} onChange={(val) => handleIndustryChange(ind.id, 'icon', val)} compact={true} />
                                                            </div>
                                                            <input
                                                                value={ind.name}
                                                                onChange={(e) => handleIndustryChange(ind.id, 'name', e.target.value)}
                                                                className="w-full text-sm font-medium outline-none border-b border-transparent focus:border-[var(--accent-primary)] transition-colors"
                                                            />
                                                            <button
                                                                onClick={() => handleDeleteIndustry(ind.id)}
                                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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

                                <div className="border-t border-[var(--border-light)] pt-6 mt-6">
                                    <h4 className="font-bold text-[var(--text-primary)] mb-3">Section Colours</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mb-4">Solid or gradient. Pick colours or enter hex/gradient.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Background */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Background</label>
                                            {(() => {
                                                const bgVal = formData.industriesSectionStyles?.backgroundColor || '';
                                                const isBgGrad = bgVal.includes('linear-gradient');
                                                const parsedBg = parseGradient(bgVal) || { direction: 'to bottom', start: '#0b1120', end: '#1e293b' };
                                                return (
                                                    <>
                                                        <div className="flex gap-2 mb-2">
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), backgroundColor: '#0b1120' } }))} className={`px-2 py-1 text-xs rounded ${!isBgGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Solid</button>
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, parsedBg.start, parsedBg.end) } }))} className={`px-2 py-1 text-xs rounded ${isBgGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Gradient</button>
                                                        </div>
                                                        {!isBgGrad ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-lg border-2 border-[var(--border-light)] shrink-0" style={{ background: bgVal || '#0b1120' }} />
                                                                <input type="color" value={(bgVal || '#0b1120').match(/^#[0-9A-Fa-f]{6}$/) ? (bgVal || '#0b1120') : '#0b1120'} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), backgroundColor: e.target.value } }))} className="h-10 w-12 rounded border border-[var(--border-light)] cursor-pointer" />
                                                                <input type="text" value={bgVal} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), backgroundColor: e.target.value } }))} className="input-field text-sm flex-1" placeholder="#0b1120" />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div className="w-full h-10 rounded-lg border-2 border-[var(--border-light)]" style={{ background: bgVal }} />
                                                                <select value={parsedBg.direction} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), backgroundColor: buildGradient(e.target.value, parsedBg.start, parsedBg.end) } }))} className="input-field text-sm w-full">
                                                                    {GRADIENT_DIRECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                                                </select>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBg.start, '#0b1120')} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, e.target.value, parsedBg.end) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBg.start} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, e.target.value, parsedBg.end) } }))} className="input-field text-xs flex-1" placeholder="Start" />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBg.end, '#1e293b')} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, parsedBg.start, e.target.value) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBg.end} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), backgroundColor: buildGradient(parsedBg.direction, parsedBg.start, e.target.value) } }))} className="input-field text-xs flex-1" placeholder="End" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        {/* Text colour */}
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Text colour</label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg border-2 border-[var(--border-light)] shrink-0 flex items-center justify-center text-xs font-medium" style={{ background: formData.industriesSectionStyles?.textColor || '#e5e7eb', color: ['#fff', '#ffffff', '#e5e7eb', '#f9fafb', '#f3f4f6', '#e0e0e0'].includes((formData.industriesSectionStyles?.textColor || '').toLowerCase()) ? '#333' : '#fff' }}>Aa</div>
                                                <input type="color" value={formData.industriesSectionStyles?.textColor || '#e5e7eb'} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), textColor: e.target.value } }))} className="h-10 w-12 rounded border border-[var(--border-light)] cursor-pointer" />
                                                <input type="text" value={formData.industriesSectionStyles?.textColor || ''} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), textColor: e.target.value } }))} className="input-field text-sm flex-1" placeholder="#e5e7eb" />
                                            </div>
                                        </div>
                                        {/* Box colour */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Box / card colour</label>
                                            {(() => {
                                                const boxVal = formData.industriesSectionStyles?.boxColor || '';
                                                const isBoxGrad = boxVal.includes('linear-gradient');
                                                const parsedBox = parseGradient(boxVal) || { direction: 'to bottom', start: '#111827', end: '#1e293b' };
                                                return (
                                                    <>
                                                        <div className="flex gap-2 mb-2">
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), boxColor: '#111827' } }))} className={`px-2 py-1 text-xs rounded ${!isBoxGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Solid</button>
                                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, parsedBox.start, parsedBox.end) } }))} className={`px-2 py-1 text-xs rounded ${isBoxGrad ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>Gradient</button>
                                                        </div>
                                                        {!isBoxGrad ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-lg border-2 border-[var(--border-light)] shrink-0" style={{ background: boxVal || '#111827' }} />
                                                                <input type="color" value={(boxVal || '#111827').match(/^#[0-9A-Fa-f]{6}$/) ? (boxVal || '#111827') : '#111827'} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), boxColor: e.target.value } }))} className="h-10 w-12 rounded border border-[var(--border-light)] cursor-pointer" />
                                                                <input type="text" value={boxVal} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), boxColor: e.target.value } }))} className="input-field text-sm flex-1" placeholder="#111827" />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div className="w-full h-10 rounded-lg border-2 border-[var(--border-light)]" style={{ background: boxVal }} />
                                                                <select value={parsedBox.direction} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), boxColor: buildGradient(e.target.value, parsedBox.start, parsedBox.end) } }))} className="input-field text-sm w-full">
                                                                    {GRADIENT_DIRECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                                                </select>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBox.start, '#111827')} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, e.target.value, parsedBox.end) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBox.start} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, e.target.value, parsedBox.end) } }))} className="input-field text-xs flex-1" placeholder="Start" />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="color" value={safeHex(parsedBox.end, '#1e293b')} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, parsedBox.start, e.target.value) } }))} className="h-9 w-10 rounded border cursor-pointer" />
                                                                    <input type="text" value={parsedBox.end} onChange={(e) => setFormData(prev => ({ ...prev, industriesSectionStyles: { ...(prev.industriesSectionStyles || {}), boxColor: buildGradient(parsedBox.direction, parsedBox.start, e.target.value) } }))} className="input-field text-xs flex-1" placeholder="End" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CUSTOM SECTIONS TAB */}
                        {activeTab.startsWith('custom-') && (
                            <div className="glass-card p-6 space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold">Custom Section</h3>
                                    <button
                                        onClick={() => handleDeleteSection(activeTab)}
                                        className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete Section
                                    </button>
                                </div>

                                {(() => {
                                    const section = formData.customSections?.find(s => s.id === activeTab);
                                    if (!section) return <div>Section not found</div>;

                                    // Helper for block management
                                    const updateSection = (updates) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            customSections: prev.customSections.map(s => s.id === section.id ? { ...s, ...updates } : s)
                                        }));
                                    };

                                    const addBlock = (type) => {
                                        const newBlock = {
                                            id: Date.now(),
                                            type, // 'text', 'image', 'button'
                                            content: type === 'text' ? 'New text block...' : (type === 'button' ? 'Click Me' : ''),
                                            url: '',
                                            alt: '',
                                            link: type === 'button' ? '/contact' : '', // for button
                                            variant: 'solid', // for button: solid, outline
                                            align: 'center', // left, center, right
                                            width: '100%', // for images
                                            color: '#1A365D' // for text
                                        };
                                        const currentBlocks = section.blocks || [];
                                        updateSection({ blocks: [...currentBlocks, newBlock] });
                                    };

                                    const updateBlock = (blockId, field, value) => {
                                        const currentBlocks = section.blocks || [];
                                        updateSection({
                                            blocks: currentBlocks.map(b => b.id === blockId ? { ...b, [field]: value } : b)
                                        });
                                    };

                                    const removeBlock = (blockId) => {
                                        const currentBlocks = section.blocks || [];
                                        updateSection({
                                            blocks: currentBlocks.filter(b => b.id !== blockId)
                                        });
                                    };

                                    const moveBlock = (index, direction) => {
                                        const currentBlocks = [...(section.blocks || [])];
                                        if (direction === 'up' && index > 0) {
                                            [currentBlocks[index], currentBlocks[index - 1]] = [currentBlocks[index - 1], currentBlocks[index]];
                                        } else if (direction === 'down' && index < currentBlocks.length - 1) {
                                            [currentBlocks[index], currentBlocks[index + 1]] = [currentBlocks[index + 1], currentBlocks[index]];
                                        }
                                        updateSection({ blocks: currentBlocks });
                                    };

                                    return (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="label">Section Title</label>
                                                    <input
                                                        value={section.title}
                                                        onChange={(e) => updateSection({ title: e.target.value })}
                                                        className="input-field"
                                                        placeholder="Enter section title"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="label">Container Alignment</label>
                                                    <select
                                                        value={section.textAlign || 'center'}
                                                        onChange={(e) => updateSection({ textAlign: e.target.value })}
                                                        className="input-field"
                                                    >
                                                        <option value="left">Left</option>
                                                        <option value="center">Center</option>
                                                        <option value="right">Right</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label className="label">Section Subtitle (Optional)</label>
                                                <input
                                                    value={section.subtitle || ''}
                                                    onChange={(e) => updateSection({ subtitle: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Enter subtitle"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 my-2">
                                                <div>
                                                    <label className="label">Text Color (Default)</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="color"
                                                            value={section.textColor || '#1A365D'}
                                                            onChange={(e) => updateSection({ textColor: e.target.value })}
                                                            className="h-10 w-16 p-1 rounded border border-gray-200 cursor-pointer"
                                                        />
                                                        <span className="text-xs text-gray-500 font-mono">{section.textColor || '#1A365D'}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="label">Background Color</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="color"
                                                            value={section.bgColor || '#FFFFFF'}
                                                            onChange={(e) => updateSection({ bgColor: e.target.value })}
                                                            className="h-10 w-16 p-1 rounded border border-gray-200 cursor-pointer"
                                                        />
                                                        <span className="text-xs text-gray-500 font-mono">{section.bgColor || '#FFFFFF'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                                                <label className="label font-bold mb-2">Background Image Settings</label>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs text-gray-500 block mb-1">Image URL</label>
                                                        <input
                                                            value={section.backgroundImage || ''}
                                                            onChange={(e) => updateSection({ backgroundImage: e.target.value })}
                                                            className="input-field"
                                                            placeholder="https://example.com/image.jpg"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-xs text-gray-500 block mb-1">Overlay Opacity ({section.overlayOpacity === undefined ? 0.4 : section.overlayOpacity})</label>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="1"
                                                                step="0.1"
                                                                value={section.overlayOpacity === undefined ? 0.4 : section.overlayOpacity}
                                                                onChange={(e) => updateSection({ overlayOpacity: parseFloat(e.target.value) })}
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-500 block mb-1">Image Size</label>
                                                            <select
                                                                value={section.backgroundSize || 'cover'}
                                                                onChange={(e) => updateSection({ backgroundSize: e.target.value })}
                                                                className="input-field py-1"
                                                            >
                                                                <option value="cover">Cover (Fill)</option>
                                                                <option value="contain">Contain (Fit)</option>
                                                                <option value="auto">Auto (Original)</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-lg">Content Blocks</h4>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => addBlock('text')} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                                            <Plus size={14} /> Text
                                                        </button>
                                                        <button onClick={() => addBlock('image')} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                                            <Plus size={14} /> Image
                                                        </button>
                                                        <button onClick={() => addBlock('button')} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                                            <Plus size={14} /> Button
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    {(section.blocks || []).length === 0 && (
                                                        <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-400 text-sm">
                                                            No content blocks yet. Add one above.
                                                            {/* Backward compatibility: Show legacy content if blocks are empty but content exists */}
                                                            {section.content && (
                                                                <div className="mt-2 text-orange-500 text-xs bg-orange-50 p-2 inline-block rounded">
                                                                    Legacy content detected. Add a text block and copy it over to migrate.
                                                                    <div className="mt-1 font-mono text-left max-w-xs mx-auto overflow-hidden text-ellipsis whitespace-nowrap opacity-50">{section.content}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {(section.blocks || []).map((block, idx) => (
                                                        <div key={block.id} className="bg-gray-50 p-4 rounded border border-gray-200 relative group">
                                                            <div className="absolute right-2 top-2 flex gap-1 opacity-100">
                                                                <button onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><LucideIcons.ArrowUp size={14} /></button>
                                                                <button onClick={() => moveBlock(idx, 'down')} disabled={idx === (section.blocks || []).length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><LucideIcons.ArrowDown size={14} /></button>
                                                                <button onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red-100 text-red-500 rounded ml-2"><Trash2 size={14} /></button>
                                                            </div>

                                                            <div className="mb-2 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                                                                {block.type} Block
                                                            </div>

                                                            {block.type === 'text' && (
                                                                <div className="space-y-2">
                                                                    <textarea
                                                                        value={block.content}
                                                                        onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                                                        className="input-field min-h-[100px]"
                                                                        placeholder="Type your text content..."
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <select value={block.align || 'left'} onChange={(e) => updateBlock(block.id, 'align', e.target.value)} className="input-field py-1 text-xs w-24">
                                                                            <option value="left">Left</option>
                                                                            <option value="center">Center</option>
                                                                            <option value="justify">Justify</option>
                                                                            <option value="right">Right</option>
                                                                        </select>
                                                                        <div className="flex items-center gap-1 border border-gray-200 rounded px-2 bg-white">
                                                                            <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: block.color || section.textColor || '#1A365D' }}></div>
                                                                            <input type="color" value={block.color || section.textColor || '#1A365D'} onChange={(e) => updateBlock(block.id, 'color', e.target.value)} className="opacity-0 w-8 absolute cursor-pointer" />
                                                                            <span className="text-xs text-gray-500 ml-6">Color</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {block.type === 'image' && (
                                                                <div className="space-y-2">
                                                                    <input
                                                                        value={block.url}
                                                                        onChange={(e) => updateBlock(block.id, 'url', e.target.value)}
                                                                        className="input-field"
                                                                        placeholder="Image URL (https://...)"
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <input
                                                                            value={block.width || '100%'}
                                                                            onChange={(e) => updateBlock(block.id, 'width', e.target.value)}
                                                                            className="input-field py-1 text-xs w-24"
                                                                            placeholder="Width (e.g. 100%)"
                                                                        />
                                                                        <select value={block.align || 'center'} onChange={(e) => updateBlock(block.id, 'align', e.target.value)} className="input-field py-1 text-xs w-24">
                                                                            <option value="left">Left</option>
                                                                            <option value="center">Center</option>
                                                                            <option value="right">Right</option>
                                                                        </select>
                                                                    </div>
                                                                    {block.url && <img src={block.url} alt="preview" className="h-20 object-contain mx-auto bg-white border border-gray-200 rounded p-1" />}
                                                                </div>
                                                            )}

                                                            {block.type === 'button' && (
                                                                <div className="space-y-2">
                                                                    <div className="flex gap-2">
                                                                        <input
                                                                            value={block.content}
                                                                            onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                                                            className="input-field flex-1"
                                                                            placeholder="Button Label"
                                                                        />
                                                                        <select value={block.variant || 'solid'} onChange={(e) => updateBlock(block.id, 'variant', e.target.value)} className="input-field py-1 text-xs w-24">
                                                                            <option value="solid">Solid</option>
                                                                            <option value="outline">Outline</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <input
                                                                            value={block.link}
                                                                            onChange={(e) => updateBlock(block.id, 'link', e.target.value)}
                                                                            className="input-field flex-1"
                                                                            placeholder="Link URL (/page or https://)"
                                                                        />
                                                                        <select value={block.align || 'center'} onChange={(e) => updateBlock(block.id, 'align', e.target.value)} className="input-field py-1 text-xs w-24">
                                                                            <option value="left">Left</option>
                                                                            <option value="center">Center</option>
                                                                            <option value="right">Right</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="text-center p-2 bg-gray-100 rounded">
                                                                        <button className={`px-4 py-2 text-sm uppercase tracking-wider font-bold transition-all ${block.variant === 'solid'
                                                                            ? 'bg-[#1A365D] text-white'
                                                                            : 'border border-[var(--accent-primary)] text-[var(--accent-primary)] dark:text-white dark:border-white/40 bg-transparent'
                                                                            }`}>
                                                                            {block.content || 'Button'}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            </DragDropContext>

            <style>{`
                .label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.5rem; }
                .input-field { width: 100%; padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid var(--border-light); outline: none; transition: all 0.2s; }
                .input-field:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 2px rgba(26, 54, 93, 0.1); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default HomeManager;
