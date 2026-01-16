import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Loader2, Eye } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const InvestorsManager = () => {
    const defaultData = {
        pageHero: {
            title: 'For Investors',
            subtitle: 'Exclusive opportunities for institutional growth and wealth preservation through strategic capital.'
        },
        mainContent: {
            headline: 'The Institutional Advantage',
            description: 'Instrak Venture Capital Berhad offers qualified investors access to a curated portfolio of high-growth industrial assets in the ASEAN region. Our approach is defined by rigorous due diligence and institutional-grade governance.'
        },
        portfolioSection: {
            title: 'Institutional Portfolio',
            items: [
                { id: 'port-1', text: 'Energy & Infrastructure' },
                { id: 'port-2', text: 'Advanced Manufacturing' },
                { id: 'port-3', text: 'Logistics & Distribution' }
            ]
        },
        formSettings: {
            title: 'Investment Inquiry',
            submitButtonText: 'Submit Inquiry',
            interestOptions: ['Investment', 'Loan', 'Partnership', 'Others']
        }
    };

    const { content, loading, saving, saveContent } = useContent('investors', defaultData);
    const [formData, setFormData] = useState(defaultData);
    const [activeTab, setActiveTab] = useState('content');

    useEffect(() => {
        if (content && !loading) {
            setFormData({ ...defaultData, ...content });
        }
    }, [content, loading]);

    const handleSave = async () => {
        await saveContent(formData);
    };

    // Portfolio item handlers
    const handleAddPortfolioItem = () => {
        const newItem = { id: `port-${Date.now()}`, text: 'New Portfolio Item' };
        setFormData(prev => ({
            ...prev,
            portfolioSection: {
                ...prev.portfolioSection,
                items: [...prev.portfolioSection.items, newItem]
            }
        }));
    };

    const handleUpdatePortfolioItem = (id, value) => {
        setFormData(prev => ({
            ...prev,
            portfolioSection: {
                ...prev.portfolioSection,
                items: prev.portfolioSection.items.map(item =>
                    item.id === id ? { ...item, text: value } : item
                )
            }
        }));
    };

    const handleDeletePortfolioItem = (id) => {
        setFormData(prev => ({
            ...prev,
            portfolioSection: {
                ...prev.portfolioSection,
                items: prev.portfolioSection.items.filter(item => item.id !== id)
            }
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(formData.portfolioSection.items);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFormData(prev => ({
            ...prev,
            portfolioSection: { ...prev.portfolioSection, items }
        }));
    };

    // Interest options handlers
    const handleAddInterestOption = () => {
        setFormData(prev => ({
            ...prev,
            formSettings: {
                ...prev.formSettings,
                interestOptions: [...prev.formSettings.interestOptions, 'New Option']
            }
        }));
    };

    const handleUpdateInterestOption = (index, value) => {
        const options = [...formData.formSettings.interestOptions];
        options[index] = value;
        setFormData(prev => ({
            ...prev,
            formSettings: { ...prev.formSettings, interestOptions: options }
        }));
    };

    const handleDeleteInterestOption = (index) => {
        setFormData(prev => ({
            ...prev,
            formSettings: {
                ...prev.formSettings,
                interestOptions: prev.formSettings.interestOptions.filter((_, i) => i !== index)
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Investors Page Manager</h1>
                    <p className="text-[var(--text-secondary)]">Manage the "For Investors" page content and form settings.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] transition-colors shadow-md font-medium disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-light)]">
                {[
                    { id: 'content', label: 'Page Content' },
                    { id: 'form', label: 'Form Settings' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                            activeTab === tab.id
                                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Editor */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'content' && (
                        <>
                            {/* Page Hero */}
                            <div className="glass-card p-6 border-l-4 border-l-blue-600">
                                <h3 className="font-bold text-[var(--accent-primary)] mb-4">Page Hero</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={formData.pageHero.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, pageHero: { ...prev.pageHero, title: e.target.value } }))}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Subtitle</label>
                                        <textarea
                                            rows={2}
                                            value={formData.pageHero.subtitle}
                                            onChange={(e) => setFormData(prev => ({ ...prev, pageHero: { ...prev.pageHero, subtitle: e.target.value } }))}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="glass-card p-6 border-l-4 border-l-green-600">
                                <h3 className="font-bold text-[var(--accent-primary)] mb-4">Main Content</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Headline</label>
                                        <input
                                            type="text"
                                            value={formData.mainContent.headline}
                                            onChange={(e) => setFormData(prev => ({ ...prev, mainContent: { ...prev.mainContent, headline: e.target.value } }))}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                                        <textarea
                                            rows={4}
                                            value={formData.mainContent.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, mainContent: { ...prev.mainContent, description: e.target.value } }))}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Portfolio Items */}
                            <div className="glass-card p-6 border-l-4 border-l-[#B8860B]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-[var(--accent-primary)]">Portfolio Items</h3>
                                    <button
                                        onClick={handleAddPortfolioItem}
                                        className="text-xs bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded hover:bg-[#08304e] flex items-center gap-1"
                                    >
                                        <Plus size={14} />
                                        Add Item
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Section Title</label>
                                    <input
                                        type="text"
                                        value={formData.portfolioSection.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, portfolioSection: { ...prev.portfolioSection, title: e.target.value } }))}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                    />
                                </div>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="portfolio-items">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                {formData.portfolioSection.items.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                                            >
                                                                <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                                    <GripVertical size={16} />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={item.text}
                                                                    onChange={(e) => handleUpdatePortfolioItem(item.id, e.target.value)}
                                                                    className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                                />
                                                                <button
                                                                    onClick={() => handleDeletePortfolioItem(item.id)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-500"
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
                                </DragDropContext>
                            </div>
                        </>
                    )}

                    {activeTab === 'form' && (
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-[var(--accent-primary)] mb-4">Form Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Form Title</label>
                                    <input
                                        type="text"
                                        value={formData.formSettings.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, formSettings: { ...prev.formSettings, title: e.target.value } }))}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Submit Button Text</label>
                                    <input
                                        type="text"
                                        value={formData.formSettings.submitButtonText}
                                        onChange={(e) => setFormData(prev => ({ ...prev, formSettings: { ...prev.formSettings, submitButtonText: e.target.value } }))}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-[var(--text-secondary)]">Interest Options (Dropdown)</label>
                                        <button
                                            onClick={handleAddInterestOption}
                                            className="text-xs bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded hover:bg-[#08304e] flex items-center gap-1"
                                        >
                                            <Plus size={14} />
                                            Add
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.formSettings.interestOptions.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleUpdateInterestOption(index, e.target.value)}
                                                    className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                />
                                                <button
                                                    onClick={() => handleDeleteInterestOption(index)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Preview */}
                <div className="glass-card p-0 overflow-hidden sticky top-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="bg-gray-100 p-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                        <Eye size={14} />
                        Live Preview
                    </div>
                    <div className="bg-[#F5F7FA] p-6 border-b-4 border-[#B8860B] text-center">
                        <h2 className="text-xl font-bold text-[#1A365D] mb-2">{formData.pageHero.title}</h2>
                        <p className="text-sm text-gray-600">{formData.pageHero.subtitle}</p>
                    </div>
                    <div className="p-6 bg-white">
                        <h3 className="text-lg font-bold text-[#1A365D] mb-3">{formData.mainContent.headline}</h3>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{formData.mainContent.description.substring(0, 120)}...</p>
                        <div className="bg-[#F5F7FA] p-4 rounded-lg">
                            <h4 className="text-sm font-bold text-[#B8860B] mb-2">{formData.portfolioSection.title}</h4>
                            <ul className="space-y-2">
                                {formData.portfolioSection.items.slice(0, 5).map(item => (
                                    <li key={item.id} className="flex items-center gap-2 text-xs text-gray-600">
                                        <div className="w-2 h-2 bg-[#1A365D] rounded-full"></div>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorsManager;
