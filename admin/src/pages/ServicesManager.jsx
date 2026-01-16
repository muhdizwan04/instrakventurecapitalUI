import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Briefcase, ArrowLeft, Save, Wallet, TrendingUp, Building2, Shield, Landmark, BarChart, FileText, Globe, Loader2, GripVertical, Coins, Gem, Users, ShieldCheck, PieChart, BarChart3 } from 'lucide-react';
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
        { id: 1, title: 'Business Finance Consulting (Virtual CFO)', summary: 'Financial strategy & forecasting, budgeting & cash flow management, profitability analysis & cost control, investment readiness & capital structuring, financial risk assessment & mitigation, KPI setting & performance monitoring, and board/investor reporting & stakeholder communication.', icon: 'Briefcase', link: '/services/virtual-cfo', linkText: 'Learn More' },
        { id: 2, title: 'Equity Financing (EF)', summary: 'Strategic capital injection through equity investment for high-growth companies seeking expansion and market leadership.', icon: 'TrendingUp', link: '/services/equity-financing', linkText: 'Learn More' },
        { id: 3, title: 'Real Estate Financing (REF)', summary: 'Funding for high-yield property developments and real estate acquisitions.', icon: 'Building2', link: '/services/real-estate-financing', linkText: 'Learn More' },
        { id: 4, title: 'Real Estate Investment Trust (REITs)', summary: 'Service details available upon request.', icon: 'Landmark', link: '/services/reits', linkText: 'Learn More' },
        { id: 5, title: 'Share Financing (SF)', summary: 'Service details available upon request.', icon: 'BarChart3', link: '/services/share-financing', linkText: 'Learn More' },
        { id: 6, title: 'Merger & Acquisition (M&A)', summary: 'Service details available upon request.', icon: 'Users', link: '/services/merger-acquisition', linkText: 'Learn More' },
        { id: 7, title: 'Tokenization', summary: 'Service details available upon request.', icon: 'Coins', link: '/services/tokenization', linkText: 'Learn More' },
        { id: 8, title: 'Asset Insurance (AI)', summary: 'Service details available upon request.', icon: 'Shield', link: '/services/asset-insurance', linkText: 'Learn More' },
        { id: 9, title: 'Private Placement Life Insurance (PPLI)', summary: 'Service details available upon request.', icon: 'ShieldCheck', link: '/services/ppli', linkText: 'Learn More' },
        { id: 10, title: 'Global Investment Gateway (GIG)', summary: 'An exclusive, subscription-based gateway for qualified companies to gain structured access to global investors and strategic partners through IVC\'s international network.', icon: 'Globe', link: '/services/gig', linkText: 'Learn More' },
        { id: 11, title: 'Private Wealth Investment (The Luxury Dubai)', summary: 'Service details available upon request.', icon: 'Gem', link: '/services/private-wealth', linkText: 'Learn More' },
        { id: 12, title: 'Asset Under Management (AUM)', summary: 'Exclusive AUM mandates for corporations, institutional investors, family offices, and ultra-high-net-worth principals—mandate-driven, disciplined, and globally informed, with transparency and governance at the core.', icon: 'PieChart', link: '/services/aum', linkText: 'Learn More' }
    ];

    const { content, loading, saving, saveContent } = useContent('services', { items: defaultServices });
    const [services, setServices] = useState(defaultServices);

    useEffect(() => {
        if (content?.items && !loading) {
            setServices(content.items);
        }
    }, [content, loading]);

    const handleEdit = (service) => {
        setEditingService(service);
        setView('edit');
    };

    const handleCreate = () => {
        setEditingService({ id: Date.now(), title: '', summary: '', icon: 'Briefcase', link: '', linkText: 'Learn More' });
        setView('edit');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setServices(prev => prev.filter(s => s.id !== id));
            toast.success('Service deleted.');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
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

    // Helper to render icon
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
                        <button
                            onClick={() => saveContent({ items: services })}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                        </button>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] transition-colors shadow-md"
                        >
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
                <div className="max-w-3xl mx-auto glass-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button onClick={() => setView('list')} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] mb-6">
                        <ArrowLeft size={18} /> <span>Back to List</span>
                    </button>

                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Edit2 size={24} className="text-[var(--accent-secondary)]" />
                        {editingService.id && services.find(s => s.id === editingService.id) ? 'Edit Service' : 'New Service'}
                    </h2>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Service Title</label>
                            <input
                                type="text"
                                value={editingService.title}
                                onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Icon Symbol</label>
                            <div className="grid grid-cols-5 md:grid-cols-9 gap-2">
                                {Object.keys(ICON_MAP).map((iconName) => {
                                    const Icon = ICON_MAP[iconName];
                                    const isSelected = editingService.icon === iconName;
                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => setEditingService({ ...editingService, icon: iconName })}
                                            className={`p-3 rounded-lg flex items-center justify-center transition-all ${isSelected ? 'bg-[var(--accent-primary)] text-white shadow-md scale-105' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-gray-200'}`}
                                            title={iconName}
                                        >
                                            <Icon size={20} />
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mt-2">Select an icon that best represents this service.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Summary</label>
                            <textarea
                                value={editingService.summary}
                                onChange={e => setEditingService({ ...editingService, summary: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Page Link (URL)</label>
                                <input
                                    type="text"
                                    value={editingService.link || ''}
                                    onChange={e => setEditingService({ ...editingService, link: e.target.value })}
                                    placeholder="/service-page-url"
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                />
                                <p className="text-xs text-[var(--text-muted)] mt-1">e.g. /business-finance-consulting</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Button Text</label>
                                <input
                                    type="text"
                                    value={editingService.linkText || 'Learn More'}
                                    onChange={e => setEditingService({ ...editingService, linkText: e.target.value })}
                                    placeholder="Learn More"
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button type="submit" className="px-6 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] shadow-md flex items-center gap-2">
                                <Save size={18} /> Save Service
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ServicesManager;
