import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Briefcase, Save, Wallet, TrendingUp, Building2, Shield, Landmark, BarChart, FileText, Globe, Loader2, GripVertical, Coins, Gem, Users, ShieldCheck, PieChart, BarChart3, X, ChevronRight, Settings } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

// Icon Map for dynamic rendering
const ICON_MAP = {
    'Briefcase': Briefcase,
    'Wallet': Wallet,
    'TrendingUp': TrendingUp,
    'Building2': Building2,
    'Shield': Shield,
    'Landmark': Landmark,
    'BarChart': BarChart,
    'BarChart3': BarChart3,
    'FileText': FileText,
    'Globe': Globe,
    'Coins': Coins,
    'Gem': Gem,
    'Users': Users,
    'ShieldCheck': ShieldCheck,
    'PieChart': PieChart
};

const ServicesManager = ({ embedded = false } = {}) => {
    const [selectedService, setSelectedService] = useState(null);

    const defaultServices = [
        { id: 1, title: 'Business Finance Consulting (Virtual CFO)', summary: 'Financial strategy & forecasting, budgeting & cash flow management, profitability analysis & cost control, investment readiness & capital structuring, financial risk assessment & mitigation, KPI setting & performance monitoring, and board/investor reporting & stakeholder communication.', icon: 'Briefcase', link: '/services/virtual-cfo', linkText: 'Learn More', fields: [] },
        { id: 2, title: 'Equity Financing (EF)', summary: 'Strategic capital injection through equity investment for high-growth companies seeking expansion and market leadership.', icon: 'TrendingUp', link: '/services/equity-financing', linkText: 'Learn More', fields: [] },
        { id: 3, title: 'Real Estate Financing (REF)', summary: 'Funding for high-yield property developments and real estate acquisitions.', icon: 'Building2', link: '/services/real-estate-financing', linkText: 'Learn More', fields: [] },
        { id: 4, title: 'Real Estate Investment Trust (REITs)', summary: 'Service details available upon request.', icon: 'Landmark', link: '/services/reits', linkText: 'Learn More', fields: [] },
        { id: 5, title: 'Share Financing (SF)', summary: 'Service details available upon request.', icon: 'BarChart3', link: '/services/share-financing', linkText: 'Learn More', fields: [] },
        { id: 6, title: 'Merger & Acquisition (M&A)', summary: 'Service details available upon request.', icon: 'Users', link: '/services/merger-acquisition', linkText: 'Learn More', fields: [] },
        { id: 7, title: 'Tokenization', summary: 'Service details available upon request.', icon: 'Coins', link: '/services/tokenization', linkText: 'Learn More', fields: [] },
        { id: 8, title: 'Asset Insurance (AI)', summary: 'Service details available upon request.', icon: 'Shield', link: '/services/asset-insurance', linkText: 'Learn More', fields: [] },
        { id: 9, title: 'Private Placement Life Insurance (PPLI)', summary: 'Service details available upon request.', icon: 'ShieldCheck', link: '/services/ppli', linkText: 'Learn More', fields: [] },
        { id: 10, title: 'Global Investment Gateway (GIG)', summary: 'An exclusive, subscription-based gateway for qualified companies to gain structured access to global investors and strategic partners through IVC\'s international network.', icon: 'Globe', link: '/services/gig', linkText: 'Learn More', fields: [] },
        { id: 11, title: 'Private Wealth Investment (The Luxury Dubai)', summary: 'Service details available upon request.', icon: 'Gem', link: '/services/private-wealth', linkText: 'Learn More', fields: [] },
        { id: 12, title: 'Asset Under Management (AUM)', summary: 'Exclusive AUM mandates for corporations, institutional investors, family offices, and ultra-high-net-worth principals—mandate-driven, disciplined, and globally informed, with transparency and governance at the core.', icon: 'PieChart', link: '/services/aum', linkText: 'Learn More', fields: [] }
    ];

    const { content, loading, saving, saveContent } = useContent('services', { items: defaultServices });
    const [services, setServices] = useState(defaultServices);

    useEffect(() => {
        if (content?.items && !loading) {
            setServices(content.items);
            if (!selectedService && content.items.length > 0) {
                setSelectedService(content.items[0]);
            }
        }
    }, [content, loading]);

    const handleCreate = () => {
        const newService = { id: Date.now(), title: 'New Service', summary: '', icon: 'Briefcase', link: '', linkText: 'Learn More', fields: [] };
        const updated = [...services, newService];
        setServices(updated);
        setSelectedService(newService);
        toast.success('New service created');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            const updated = services.filter(s => s.id !== id);
            setServices(updated);
            if (selectedService?.id === id) {
                setSelectedService(updated[0] || null);
            }
            saveContent({ items: updated });
            toast.success('Service deleted');
        }
    };

    const handleSave = async () => {
        await saveContent({ items: services });
        toast.success('Services saved!');
    };

    const handleUpdateService = (id, field, value) => {
        setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
        if (selectedService?.id === id) {
            setSelectedService(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(services);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setServices(items);
    };

    const renderIcon = (iconName, size = 20) => {
        const Icon = ICON_MAP[iconName] || Briefcase;
        return <Icon size={size} />;
    };

    return (
        <div className={`${embedded ? 'h-full' : 'h-[calc(100vh-80px)]'} flex flex-col`}>
            {/* Compact Header */}
            <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-[var(--accent-primary)]">
                        <Settings size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-heading text-[var(--accent-primary)] font-bold">Services Manager</h1>
                        <p className="text-xs text-gray-400">{services.length} services</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleCreate} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold border border-blue-100">
                        <Plus size={16} /> Add Service
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#0f294d] transition-colors shadow-md text-xs font-bold disabled:opacity-50">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Main Content: Split Panel */}
            <div className="flex-1 flex min-h-0">
                {/* Left Panel: Service List */}
                <div className="w-80 shrink-0 border-r border-gray-200 bg-gray-50/50 flex flex-col">
                    <div className="p-3 border-b border-gray-100 bg-white">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drag to Reorder</p>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="services-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="p-2 space-y-1">
                                        {services.map((service, index) => (
                                            <Draggable key={service.id} draggableId={service.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        onClick={() => setSelectedService(service)}
                                                        className={`p-3 rounded-lg cursor-pointer transition-all group flex items-center gap-3 ${
                                                            selectedService?.id === service.id 
                                                                ? 'bg-white shadow-md border border-blue-200 ring-1 ring-blue-100' 
                                                                : snapshot.isDragging 
                                                                    ? 'bg-white shadow-lg' 
                                                                    : 'hover:bg-white border border-transparent hover:border-gray-200'
                                                        }`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                                            selectedService?.id === service.id 
                                                                ? 'bg-[var(--accent-primary)] text-white' 
                                                                : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                            {renderIcon(service.icon, 18)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`font-bold text-sm truncate ${
                                                                selectedService?.id === service.id ? 'text-[var(--accent-primary)]' : 'text-gray-700'
                                                            }`}>
                                                                {service.title}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 truncate">{service.summary || 'No description'}</p>
                                                        </div>
                                                        <ChevronRight size={14} className={`text-gray-300 shrink-0 ${selectedService?.id === service.id ? 'text-blue-400' : ''}`} />
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

                {/* Right Panel: Editor */}
                <div className="flex-1 flex flex-col bg-white min-w-0">
                    {selectedService ? (
                        <>
                            {/* Editor Header */}
                            <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-[var(--accent-primary)] text-white rounded-lg">
                                        {renderIcon(selectedService.icon, 20)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <input
                                            value={selectedService.title}
                                            onChange={(e) => handleUpdateService(selectedService.id, 'title', e.target.value)}
                                            className="text-lg font-heading text-gray-800 font-bold bg-transparent border-0 focus:ring-0 focus:outline-none w-full hover:bg-white focus:bg-white px-2 py-1 rounded-lg transition-colors -ml-2"
                                            placeholder="Service Title"
                                        />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pl-2">Service Card</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(selectedService.id)} 
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Service"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Editor Content */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                <div className="max-w-3xl space-y-6">
                                    {/* Summary */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Summary Description</label>
                                        <textarea
                                            value={selectedService.summary}
                                            onChange={(e) => handleUpdateService(selectedService.id, 'summary', e.target.value)}
                                            rows={4}
                                            className="input-field text-sm"
                                            placeholder="Brief description of this service..."
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">This appears on the homepage service cards.</p>
                                    </div>

                                    {/* Icon Picker */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Icon</label>
                                        <div className="grid grid-cols-8 gap-2">
                                            {Object.keys(ICON_MAP).map((iconName) => {
                                                const Icon = ICON_MAP[iconName];
                                                const isSelected = selectedService.icon === iconName;
                                                return (
                                                    <button
                                                        key={iconName}
                                                        type="button"
                                                        onClick={() => handleUpdateService(selectedService.id, 'icon', iconName)}
                                                        className={`p-3 rounded-lg flex items-center justify-center transition-all ${isSelected ? 'bg-[var(--accent-primary)] text-white shadow-md ring-2 ring-offset-2 ring-[var(--accent-primary)]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'}`}
                                                        title={iconName}
                                                    >
                                                        <Icon size={20} />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Link Settings */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Page URL Slug</label>
                                            <input
                                                value={selectedService.link || ''}
                                                onChange={(e) => handleUpdateService(selectedService.id, 'link', e.target.value)}
                                                className="input-field text-sm font-mono"
                                                placeholder="/services/your-service"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Button Text</label>
                                            <input
                                                value={selectedService.linkText || 'Learn More'}
                                                onChange={(e) => handleUpdateService(selectedService.id, 'linkText', e.target.value)}
                                                className="input-field text-sm"
                                                placeholder="Learn More"
                                            />
                                        </div>
                                    </div>

                                    {/* Info Note */}
                                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                                        <FileText size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-amber-700 font-medium">Note</p>
                                            <p className="text-xs text-amber-600">
                                                This section manages the service card displayed on the homepage and navigation. 
                                                To edit the full page content or inquiry form, use the <strong>Service Pages Manager</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Briefcase size={20} />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Select a service from the list to edit</p>
                            <p className="text-xs text-gray-400 mt-1">Or click "Add Service" to create a new one</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServicesManager;
