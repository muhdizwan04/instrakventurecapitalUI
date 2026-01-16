import React, { useState, useEffect } from 'react';
import { Save, Eye, RefreshCw, Info, Plus, Trash2, Layout, Target, Zap, Building2, TrendingUp, Wallet, ShieldCheck, Scale, GripVertical, HelpCircle, Loader2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import IconPicker from '../components/IconPicker';
import * as LucideIcons from 'lucide-react';
import { useContent } from '../hooks/useContent';
import klSkyline from '../assets/kl-skyline.png';

const AVAILABLE_ROUTES = [
    { label: 'Strategic Services', path: '/services' },
    { label: 'Mission & Vision', path: '/mission-vision-values' },
    { label: 'Investors', path: '/investors' },
    { label: 'Latest News', path: '/latest-news-2' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Join Us', path: '/join-us' },
    { label: 'Board of Directors', path: '/board-of-directors' }
];

const HomeManager = () => {
    const [activeTab, setActiveTab] = useState('hero');

    // Default content structure
    const defaultFormData = {
        heroTitle: 'We Help To Grow\nYour Business',
        heroSubtitle: 'Governance • Transparency • Integrity',
        heroDescription: 'Providing foundational governance and integrity essential for scaling visionary industrial leaders across the ASEAN region.',
        buttons: [
            { id: 1, text: 'Strategic Services', link: '/services', variant: 'solid' },
            { id: 2, text: 'Our Foundation →', link: '/mission-vision-values', variant: 'outline' }
        ],
        missionTitle: 'Our Mission',
        missionText: 'To be the catalyst for sustainable growth in the ASEAN region, bridging the gap between visionary entrepreneurs and strategic capital through disciplined governance and ethical excellence.',
        foundationValues: [
            { id: 1, title: 'Governance', text: 'We adhere to the highest standards of corporate governance to ensure long-term stability.', icon: 'ShieldCheck' },
            { id: 2, title: 'Transparency', text: 'Open communication and clear reporting are at the heart of everything we do.', icon: 'Eye' },
            { id: 3, title: 'Integrity', text: 'Honesty and moral principles guide our investment decisions and partnerships.', icon: 'Scale' }
        ],
        // Note: Services are managed via separate 'home_services' content ID
        servicesTitle: 'Our Services',
        servicesSubtitle: 'Comprehensive financial solutions tailored for your growth',
        industries: [
            { id: 'ind-1', name: 'Oil and Gas', icon: 'Fuel' },
            { id: 'ind-2', name: 'Education', icon: 'GraduationCap' },
            { id: 'ind-3', name: 'Automotive', icon: 'Car' },
            { id: 'ind-4', name: 'Construction', icon: 'HardHat' },
            { id: 'ind-5', name: 'Property Dev', icon: 'Building' },
            { id: 'ind-6', name: 'Logistics', icon: 'Truck' },
            { id: 'ind-7', name: 'Manufacturing', icon: 'Factory' },
            { id: 'ind-8', name: 'Digital Tech', icon: 'Cpu' }
        ],
        // Tab order - can be reordered via drag
        tabOrder: ['hero', 'foundation', 'services', 'industries']
    };

    // Use Supabase content hook
    const { content, loading, saving, saveContent } = useContent('home', defaultFormData);
    const [formData, setFormData] = useState(defaultFormData);

    // Load content from Supabase when available
    useEffect(() => {
        if (content && !loading) {
            setFormData(prev => ({ ...prev, ...content }));
        }
    }, [content, loading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Button Logic
    const handleAddButton = () => {
        if (formData.buttons.length >= 4) return toast.error('Max 4 buttons allowed');
        setFormData(prev => ({ ...prev, buttons: [...prev.buttons, { id: Date.now(), text: 'New Button', link: '/contact', variant: 'solid' }] }));
    };
    const handleRemoveButton = (id) => setFormData(prev => ({ ...prev, buttons: prev.buttons.filter(b => b.id !== id) }));
    const handleButtonChange = (id, field, value) => {
        setFormData(prev => ({ ...prev, buttons: prev.buttons.map(b => b.id === id ? { ...b, [field]: value } : b) }));
    };

    // Value Logic
    const handleValueChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            foundationValues: prev.foundationValues.map(v => v.id === id ? { ...v, [field]: value } : v)
        }));
    };

    const handleAddValue = () => {
        const newValue = { id: Date.now(), title: 'New Value', text: 'Description of this value...', icon: 'Star' };
        setFormData(prev => ({ ...prev, foundationValues: [...prev.foundationValues, newValue] }));
    };

    const handleDeleteValue = (id) => {
        if (formData.foundationValues.length <= 1) {
            toast.error('Must have at least one value');
            return;
        }
        setFormData(prev => ({ ...prev, foundationValues: prev.foundationValues.filter(v => v.id !== id) }));
    };

    const handleValueDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(formData.foundationValues);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFormData(prev => ({ ...prev, foundationValues: items }));
    };

    // Services Section Logic - title/subtitle only; individual services managed via Services Manager

    const handleButtonDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(formData.buttons);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFormData(prev => ({ ...prev, buttons: items }));
    };

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

    const handleSave = async (e) => {
        e.preventDefault();
        await saveContent(formData);
    };

    // Tab configuration
    const tabConfig = {
        hero: { label: 'Hero Section', icon: Layout },
        foundation: { label: 'Our Foundation', icon: Target },
        services: { label: 'Services Section', icon: TrendingUp },
        industries: { label: 'Industries', icon: Building2 },
    };

    const tabOrder = formData.tabOrder || ['hero', 'foundation', 'services', 'industries'];

    // Combined drag handler for both tabs and industries
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, droppableId } = result;

        if (droppableId === 'tabs') {
            const items = Array.from(tabOrder);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setFormData(prev => ({ ...prev, tabOrder: items }));
        } else if (droppableId === 'industries') {
            const items = Array.from(formData.industries);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setFormData(prev => ({ ...prev, industries: items }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Home Page Manager</h1>
                    <p className="text-[var(--text-secondary)]">Manage content for the main landing page.</p>
                </div>
                {loading ? (
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-gray-300 text-gray-500 rounded-lg">
                        <Loader2 size={18} className="animate-spin" />
                        <span>Loading...</span>
                    </div>
                ) : (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] transition-colors shadow-md font-medium disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                )}
            </div>

            {/* Single DragDropContext for all draggables */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tabs" direction="horizontal">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex gap-2 overflow-x-auto pb-2 border-b border-[var(--border-light)] mb-6"
                        >
                            {tabOrder.map((tabId, index) => {
                                const tab = tabConfig[tabId];
                                if (!tab) return null;
                                return (
                                    <Draggable key={tabId} draggableId={tabId} index={index}>
                                        {(provided, snapshot) => (
                                            <button
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => setActiveTab(tabId)}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''} ${activeTab === tabId
                                                    ? 'bg-[var(--accent-primary)] text-white'
                                                    : 'bg-white border border-gray-200 text-[var(--text-secondary)] hover:bg-gray-50'
                                                    }`}
                                            >
                                                <GripVertical size={14} className="opacity-40" />
                                                <tab.icon size={16} />
                                                {tab.label}
                                            </button>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Editor Area */}
                    <div className="space-y-6">
                        {/* HERO TAB */}
                        {activeTab === 'hero' && (
                            <div className="glass-card p-6 space-y-6">
                                <h3 className="text-xl font-bold mb-4">Hero Content</h3>
                                <div>
                                    <label className="label">Hero Title</label>
                                    <textarea name="heroTitle" value={formData.heroTitle} onChange={handleChange} rows={2} className="input-field" />
                                </div>
                                <div>
                                    <label className="label">Hero Subtitle</label>
                                    <input name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="label">Description</label>
                                    <textarea name="heroDescription" value={formData.heroDescription} onChange={handleChange} rows={3} className="input-field" />
                                </div>

                                <div className="pt-4 border-t border-[var(--border-light)]">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="font-bold text-sm">Action Buttons</label>
                                        <button onClick={handleAddButton} className="text-xs text-[var(--accent-primary)] font-bold flex items-center gap-1 hover:underline"><Plus size={14} /> Add Button</button>
                                    </div>
                                    {formData.buttons.map(btn => (
                                        <div key={btn.id} className="p-3 bg-[var(--bg-tertiary)] rounded mb-3 flex gap-3 items-center">
                                            <input value={btn.text} onChange={(e) => handleButtonChange(btn.id, 'text', e.target.value)} className="input-field text-xs flex-1" placeholder="Label" />
                                            <select value={btn.link} onChange={(e) => handleButtonChange(btn.id, 'link', e.target.value)} className="input-field text-xs flex-1">
                                                {AVAILABLE_ROUTES.map(r => <option key={r.path} value={r.path}>{r.label}</option>)}
                                            </select>
                                            <button onClick={() => handleRemoveButton(btn.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FOUNDATION TAB */}
                        {activeTab === 'foundation' && (
                            <div className="glass-card p-6 space-y-6">
                                <h3 className="text-xl font-bold mb-4">Mission & Values</h3>
                                <div>
                                    <label className="label">Mission Statement</label>
                                    <textarea name="missionText" value={formData.missionText} onChange={handleChange} rows={4} className="input-field" />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-[var(--border-light)]">
                                    <h4 className="font-bold text-sm">Core Values</h4>
                                    {formData.foundationValues.map((val, i) => (
                                        <div key={val.id} className="p-4 bg-[var(--bg-tertiary)] rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold uppercase text-[var(--accent-primary)] opacity-70">Value {i + 1}</span>
                                            </div>
                                            <input value={val.title} onChange={(e) => handleValueChange(val.id, 'title', e.target.value)} className="input-field mb-2 font-bold" />
                                            <textarea value={val.text} onChange={(e) => handleValueChange(val.id, 'text', e.target.value)} rows={2} className="input-field text-sm" />
                                        </div>
                                    ))}
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
                            </div>
                        )}
                    </div>

                    {/* Live Preview Pane */}
                    <div className="glass-card p-6 bg-[var(--bg-tertiary)] h-fit sticky top-24">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Live Preview</h3>

                        {/* Preview Container: Scrollable mock viewport */}
                        <div className="bg-white rounded-xl shadow-lg border border-[var(--border-light)] h-[600px] overflow-y-auto no-scrollbar relative w-full select-none">

                            {tabOrder.map((sectionId) => {
                                if (sectionId === 'hero') {
                                    return (
                                        <div key="hero" className="h-[350px] relative flex flex-col items-center justify-center p-8 shrink-0 text-center" style={{ background: 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 50%, #F0F4F8 100%)' }}>
                                            {/* Background image with overlay - like client */}
                                            <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${klSkyline})` }} />
                                            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.88) 0%, rgba(250,251,252,0.75) 40%, rgba(245,247,250,0.65) 100%)' }} />
                                            {/* Left accent bar */}
                                            <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px]" style={{ background: 'linear-gradient(180deg, transparent, #B8860B 30%, #1A365D 70%, transparent)' }} />

                                            <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
                                                {/* Company Badge */}
                                                <div className="inline-block px-3 py-1.5 mb-4 text-[8px] font-semibold tracking-[2px] uppercase text-[#1A365D] border border-[#1A365D]/20 rounded bg-[#1A365D]/5">
                                                    Instrak Venture Capital Berhad
                                                </div>
                                                {/* Title */}
                                                <h1 className="text-3xl font-bold mb-2 leading-tight text-[#1A365D]" style={{ fontFamily: 'var(--font-heading)' }}>
                                                    {formData.heroTitle.split('\n').map((line, i) => (
                                                        <span key={i}>
                                                            {i === 1 ? <span className="text-[#B8860B] block">{line}</span> : line}
                                                            {i === 0 && <br />}
                                                        </span>
                                                    ))}
                                                </h1>
                                                {/* Subtitle */}
                                                <p className="text-[10px] tracking-[3px] uppercase mb-3 text-[#1A365D]">
                                                    <span className="text-[#B8860B]">Governance</span> • <span className="text-[#B8860B]">Transparency</span> • <span className="text-[#B8860B]">Integrity</span>
                                                </p>
                                                {/* Description */}
                                                <p className="text-[10px] text-[#4A5568] mb-5 max-w-md mx-auto leading-relaxed">{formData.heroDescription}</p>
                                                {/* Buttons */}
                                                <div className="flex gap-3 justify-center">
                                                    {formData.buttons.map(b => (
                                                        <div key={b.id} className={`px-4 py-2 text-[10px] font-bold rounded transition-all ${b.variant === 'solid'
                                                            ? 'bg-[#B8860B] text-white shadow-md'
                                                            : 'border-2 border-[#B8860B] text-[#B8860B] bg-white'
                                                            }`}>
                                                            {b.text}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                if (sectionId === 'foundation') {
                                    return (
                                        <div key="foundation" className="p-8 bg-white shrink-0">
                                            <h4 className="text-[#1A365D] font-bold text-center mb-6">Our Foundation</h4>
                                            <div className="grid grid-cols-1 gap-4 text-center">
                                                {formData.foundationValues.map((v) => (
                                                    <div key={v.id} className="p-4 bg-gray-50 rounded">
                                                        <h5 className="font-bold text-[#1A365D] text-sm mb-1">{v.title}</h5>
                                                        <p className="text-[10px] text-gray-600">{v.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }

                                if (sectionId === 'services') {
                                    return (
                                        <div key="services" className="p-8 bg-[#FAFBFC] shrink-0 border-t border-gray-100">
                                            <h4 className="text-[#1A365D] font-bold text-center mb-2">{formData.servicesTitle || 'Our Services'}</h4>
                                            <p className="text-[9px] text-gray-500 text-center mb-4">{formData.servicesSubtitle || 'Comprehensive financial solutions'}</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Virtual CFO', 'Equity Financing', 'Real Estate', 'REITs', 'M&A', 'AUM'].map((name, i) => (
                                                    <div key={i} className="p-2 bg-white shadow-sm border border-gray-100 rounded flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-gradient-to-br from-[#1A365D]/10 to-[#B8860B]/10 rounded flex items-center justify-center">
                                                            <LucideIcons.Briefcase size={10} className="text-[#B8860B]" />
                                                        </div>
                                                        <span className="text-[8px] font-medium">{name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[8px] text-center text-gray-400 mt-2">+ 6 more services</p>
                                        </div>
                                    );
                                }

                                if (sectionId === 'industries') {
                                    return (
                                        <div key="industries" className="p-8 bg-white shrink-0 border-t border-gray-100">
                                            <h4 className="text-[#1A365D] font-bold text-center mb-6">Focus Industries</h4>
                                            <div className="grid grid-cols-4 gap-2">
                                                {formData.industries.map((ind) => {
                                                    const Icon = LucideIcons[ind.icon] || LucideIcons.Building2;
                                                    return (
                                                        <div key={ind.id} className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded">
                                                            <div className="text-[#1A365D] mb-1 scale-75">
                                                                <Icon size={16} />
                                                            </div>
                                                            <span className="text-[8px] font-bold text-center">{ind.name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}

                        </div>
                        <p className="text-center text-xs text-[var(--text-muted)] mt-2">Scroll inside preview to see all sections</p>
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
