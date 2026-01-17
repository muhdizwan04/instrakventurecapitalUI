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
    { label: 'Board of Directors', path: '/board-of-directors' },
    { label: 'Project Listing', path: '/project-listings' }
];

const HomeManager = () => {
    const [activeTab, setActiveTab] = useState('hero');

    // Default content structure
    const defaultFormData = {
        heroTitle: 'Your Venture\nCapital Partners',
        heroSubtitle: 'Governance • Transparency • Integrity',
        heroDescription: 'Providing foundational governance and integrity essential for scaling visionary industrial leaders across the ASEAN region.',
        buttons: [
            {
                id: 1,
                link: "/investors",
                text: "Register as Investor ",
                variant: "solid"
            },
            {
                id: 2,
                link: "/project-listings",
                text: "Potential Project Listing",
                variant: "outline"
            }
        ],
        servicesSubtitle: "Comprehensive financial solutions tailored for your growth",
        servicesTitle: "Our Portfolio",
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
        // Tab order - can be reordered via drag
        tabOrder: [ "hero", "services", "industries" ]
    };

    // Use Supabase content hook
    const { content, loading, saving, saveContent } = useContent('home', defaultFormData);
    const [formData, setFormData] = useState(defaultFormData);

    // Load content from Supabase when available
    const [isInitialized, setIsInitialized] = useState(false);

    // Load content from Supabase when available
    useEffect(() => {
        if (content && !loading && !isInitialized) {
            setFormData(prev => ({ ...prev, ...content }));
            setIsInitialized(true);
        }
    }, [content, loading, isInitialized]);

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
        services: { label: 'Services Section', icon: TrendingUp },
        industries: { label: 'Industries', icon: Building2 },
    };

    const tabOrder = formData.tabOrder || ['hero', 'services', 'industries'];

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
                    <div className="glass-card p-6 bg-[var(--bg-tertiary)] h-fit">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-6">Live Preview</h3>

                        {/* Preview Container: Focused View Only */}
                        <div className="bg-white rounded-xl shadow-lg border border-[var(--border-light)] h-[600px] overflow-y-auto no-scrollbar relative w-full select-none">

                            {/* Focused Preview: Only show the currently active section */}
                            {activeTab === 'hero' && (
                                <div key="hero" className="relative flex flex-col items-center justify-center p-8 shrink-0 text-center min-h-[500px] w-full" style={{ 
                                    background: 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 50%, #F0F4F8 100%)',
                                    paddingTop: '40px' 
                                }}>
                                    <div className="absolute inset-0 opacity-40 select-none pointer-events-none">
                                        <img src={klSkyline} className="w-full h-full object-cover" style={{ filter: 'contrast(1.1) brightness(1.05)' }} alt="bg" />
                                    </div>
                                    <div className="absolute inset-0 pointer-events-none" style={{ 
                                        background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.88) 0%, rgba(250, 251, 252, 0.75) 40%, rgba(245, 247, 250, 0.65) 100%)',
                                        zIndex: 1
                                    }} />
                                    <div className="absolute left-0 top-[20%] bottom-[20%] w-[4px] pointer-events-none hidden md:block" style={{ 
                                        background: 'linear-gradient(180deg, transparent, #B8860B 30%, #1A365D 70%, transparent)',
                                        zIndex: 2 
                                    }} />
                                    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                                        <h1 className="font-bold mb-6 leading-[1.05] text-[#1A365D]" style={{ 
                                            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                                            letterSpacing: '-1px',
                                            fontFamily: 'serif' 
                                        }}>
                                            {formData.heroTitle.split('\n').map((line, i) => (
                                                <span key={i}>
                                                    {i === 1 ? <span className="text-[#B8860B] block mt-2">{line}</span> : line}
                                                    {i === 0 && <br />}
                                                </span>
                                            ))}
                                        </h1>
                                        <p className="text-[#1A365D] uppercase mb-6 font-medium text-sm md:text-lg" style={{ letterSpacing: '3px' }}>
                                             {formData.heroSubtitle.split('•').map((part, i, arr) => (
                                                <span key={i}>
                                                    <strong className="text-[#B8860B]">{part.trim()}</strong>
                                                    {i < arr.length - 1 && ' • '}
                                                </span>
                                            ))}
                                        </p>
                                        <p className="text-[#4A5568] mb-10 max-w-xl mx-auto leading-loose text-sm md:text-base">
                                            {formData.heroDescription}
                                        </p>
                                        <div className="flex gap-4 justify-center flex-wrap">
                                            {formData.buttons.map(b => (
                                                <div key={b.id} className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all cursor-default ${b.variant === 'solid'
                                                    ? 'bg-[#1A365D] text-white hover:bg-[#08304e]' 
                                                    : 'border border-[#B8860B] text-[#B8860B] bg-transparent'
                                                    }`}
                                                    style={{ minWidth: '160px' }}
                                                >
                                                    {b.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div key="services" className="py-8 px-8 bg-[#F8FAFC] shrink-0 border-t border-gray-100 min-h-[500px]">
                                    <div className="max-w-6xl mx-auto">
                                        <h2 className="text-[#1A365D] font-bold text-center mb-4 text-3xl font-serif">{formData.servicesTitle || 'Our Services'}</h2>
                                        <p className="text-gray-500 text-center mb-12 uppercase tracking-widest text-sm font-semibold">{formData.servicesSubtitle || 'Comprehensive financial solutions'}</p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                            {['Business Finance Consulting', 'Equity Financing', 'Real Estate Financing', 'REITs'].map((name, i) => (
                                                <div key={i} className="bg-white p-6 rounded shadow-sm border border-gray-100 flex flex-col gap-4 group hover:shadow-md transition-shadow">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-[#B8860B]">
                                                        <LucideIcons.Briefcase size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-[#1A365D] mb-2 text-lg">{name}</h4>
                                                        <p className="text-sm text-gray-500 leading-relaxed">Financial strategy, forecasting, budgeting...</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-center mt-12">
                                             <span className="text-[#B8860B] font-bold border-b-2 border-[#B8860B] pb-1 uppercase tracking-wider text-xs cursor-pointer">View All Services</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'industries' && (
                                <div key="industries" className="py-8 px-8 bg-white shrink-0 border-t border-gray-100 min-h-[500px]">
                                    <div className="max-w-6xl mx-auto">
                                        <h2 className="text-[#1A365D] font-bold text-center mb-12 text-3xl font-serif">Focus Industries</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {formData.industries.slice(0, 6).map((ind) => {
                                                const Icon = LucideIcons[ind.icon] || LucideIcons.Building2;
                                                return (
                                                    <div key={ind.id} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-[var(--accent-primary)] hover:text-white transition-colors group cursor-default">
                                                        <div className="text-[var(--accent-primary)] group-hover:text-white mb-4 transition-colors">
                                                            <Icon size={32} />
                                                        </div>
                                                        <span className="font-bold text-center">{ind.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-50 uppercase tracking-widest pointer-events-none">
                                {activeTab} Preview
                            </div>
                            <p className="text-center text-xs text-[var(--text-muted)] mt-4 p-4">Preview updates live as you type</p>

                        </div>
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
