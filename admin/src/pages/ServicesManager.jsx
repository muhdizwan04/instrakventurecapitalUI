import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Briefcase, ArrowLeft, Save, Wallet, TrendingUp, Building2, Shield, Landmark, BarChart, FileText, Globe, Loader2, GripVertical, Coins, Gem, Users, ShieldCheck, PieChart, BarChart3, Settings } from 'lucide-react';
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

const ServicesManager = () => {
    const [view, setView] = useState('list');
    const [editingService, setEditingService] = useState(null);

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
        }
    }, [content, loading]);

    const handleEdit = (service) => {
        setEditingService({ ...service });
        setView('edit');
    };

    const handleCreate = () => {
        setEditingService({ id: Date.now(), title: '', summary: '', icon: 'Briefcase', link: '', linkText: 'Learn More', fields: [] });
        setView('edit');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            const updated = services.filter(s => s.id !== id);
            setServices(updated);
            saveContent({ items: updated });
        }
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (editingService) {
            let updatedServices;
            const existing = services.find(s => s.id === editingService.id);
            if (existing) {
                updatedServices = services.map(s => s.id === editingService.id ? editingService : s);
            } else {
                updatedServices = [...services, editingService];
            }
            setServices(updatedServices);
            await saveContent({ items: updatedServices });
            setView('list');
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(services);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setServices(items);
        saveContent({ items: items });
    };

    const renderIcon = (iconName) => {
        const Icon = ICON_MAP[iconName] || Briefcase;
        return <Icon size={24} />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Services Manager</h1>
                    <p className="text-[var(--text-secondary)]">Manage your service offerings and details.</p>
                </div>
                {view === 'list' && (
                    <div className="flex gap-3">
                        <button onClick={() => saveContent({ items: services })} disabled={saving} className="btn-save">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                        </button>
                        <button onClick={handleCreate} className="btn-add">
                            <Plus size={18} />
                            <span>Add New Service</span>
                        </button>
                    </div>
                )}
            </div>

            {view === 'list' ? (
                <div className="glass-card p-0 overflow-hidden">
                    <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)] bg-opacity-30 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input
                                type="text"
                                placeholder="Search services..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-light)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-[var(--border-light)]">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="services">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {services.map((service, index) => (
                                            <Draggable key={service.id} draggableId={service.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`p-6 flex items-center justify-between transition-colors group ${snapshot.isDragging ? 'bg-blue-50 shadow-lg z-10' : 'hover:bg-[var(--bg-secondary)]'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab p-1">
                                                                <GripVertical size={20} />
                                                            </div>
                                                            <div className="w-12 h-12 bg-blue-50 text-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                                                                {renderIcon(service.icon)}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-[var(--text-primary)] text-lg">{service.title}</h3>
                                                                <p className="text-[var(--text-secondary)] text-sm line-clamp-1">{service.summary}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEdit(service)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-blue-50 rounded-lg">
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button onClick={() => handleDelete(service.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
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
            ) : (
                <div className="max-w-5xl mx-auto glass-card p-0 animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 bg-opacity-50">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setView('list')} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-200">
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                    {editingService.id && services.find(s => s.id === editingService.id) ? 'Edit Service' : 'New Service'}
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)]">{editingService.title || 'Service Details'}</p>
                            </div>
                        </div>
                        <button onClick={handleSave} className="btn-save shadow-md flex items-center gap-2">
                            <Save size={18} /> <span>Save Changes</span>
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Title</label>
                                    <input
                                        type="text"
                                        value={editingService.title}
                                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Summary Description</label>
                                    <textarea
                                        value={editingService.summary}
                                        onChange={(e) => setEditingService({ ...editingService, summary: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Icon Name (Lucide)</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {Object.keys(ICON_MAP).map((iconName) => {
                                            const Icon = ICON_MAP[iconName];
                                            const isSelected = editingService.icon === iconName;
                                            return (
                                                <button
                                                    key={iconName}
                                                    type="button"
                                                    onClick={() => setEditingService({ ...editingService, icon: iconName })}
                                                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${isSelected ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                >
                                                    <Icon size={18} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        <strong>Note:</strong> This section only manages the service card shown on the homepage and navigation.
                                        To edit the full page content or inquiry form, use the 
                                        <span className="text-[var(--accent-primary)] font-semibold mx-1">Service Pages Manager</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesManager;
