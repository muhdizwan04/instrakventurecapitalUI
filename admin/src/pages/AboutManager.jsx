import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, Eye, Scale, Plus, Trash2, Loader2, GripVertical, Target, Heart, Users, Award, Lightbulb, Star } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import IconPicker from '../components/IconPicker';
import * as LucideIcons from 'lucide-react';

const AboutManager = () => {
    const defaultData = {
        heroTitle: 'Mission, Vision & Values',
        heroSubtitle: 'The foundational pillars of Instrak Venture Capital Berhad.',
        missionTitle: 'Our Mission',
        missionText: 'To be the catalyst for sustainable growth in the ASEAN region, bridging the gap between visionary entrepreneurs and strategic capital through disciplined governance and ethical excellence.',
        visionTitle: 'Our Vision',
        visionText: 'To set the benchmark for venture capital integrity, becoming the trusted partner of choice for institutional investors and high-growth industrial leaders worldwide.',
        values: [
            { id: 'val-1', title: 'Governance', text: 'We adhere to the highest standards of corporate governance to ensure long-term stability and stakeholder value.', icon: 'ShieldCheck' },
            { id: 'val-2', title: 'Transparency', text: 'Open communication and clear, disciplined reporting are at the heart of our institutional operations.', icon: 'Eye' },
            { id: 'val-3', title: 'Integrity', text: 'Honesty and unwavering moral principles guide our investment decisions and sustainable partnerships.', icon: 'Scale' }
        ]
    };

    const { content, loading, saving, saveContent } = useContent('about', defaultData);
    const [aboutData, setAboutData] = useState(defaultData);

    useEffect(() => {
        if (content && !loading) {
            // Ensure values have IDs
            const updatedContent = { ...content };
            if (updatedContent.values) {
                updatedContent.values = updatedContent.values.map((v, i) => ({
                    ...v,
                    id: v.id || `val-${Date.now()}-${i}`
                }));
            }
            setAboutData(prev => ({ ...prev, ...updatedContent }));
        }
    }, [content, loading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutData(prev => ({ ...prev, [name]: value }));
    };

    const handleValueChange = (id, field, value) => {
        setAboutData(prev => ({
            ...prev,
            values: prev.values.map(v => v.id === id ? { ...v, [field]: value } : v)
        }));
    };

    // Add Value
    const handleAddValue = () => {
        const newValue = { id: `val-${Date.now()}`, title: 'New Value', text: 'Description of this core value...', icon: 'Star' };
        setAboutData(prev => ({ ...prev, values: [...prev.values, newValue] }));
    };

    // Delete Value
    const handleDeleteValue = (id) => {
        if (aboutData.values.length <= 1) {
            toast.error('Must have at least one value');
            return;
        }
        setAboutData(prev => ({
            ...prev,
            values: prev.values.filter(v => v.id !== id)
        }));
    };

    // Drag and Drop
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(aboutData.values);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setAboutData(prev => ({ ...prev, values: items }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await saveContent(aboutData);
    };

    // Get icon component
    const getIconComponent = (iconName) => {
        const Icon = LucideIcons[iconName] || LucideIcons.Star;
        return <Icon size={20} />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">About Us Manager</h1>
                    <p className="text-[var(--text-secondary)]">Manage Mission, Vision, and Core Values content.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Column */}
                <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 no-scrollbar">
                    {/* Hero Section */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-lg font-bold border-b border-[var(--border-light)] pb-2 mb-4">Page Header</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Page Title</label>
                                <input type="text" name="heroTitle" value={aboutData.heroTitle} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Subtitle</label>
                                <input type="text" name="heroSubtitle" value={aboutData.heroSubtitle} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                            </div>
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="glass-card p-6 space-y-6">
                        <h3 className="text-lg font-bold border-b border-[var(--border-light)] pb-2 mb-4">Mission & Vision</h3>
                        <div>
                            <label className="block text-sm font-bold text-[var(--accent-primary)] mb-2 uppercase tracking-wider">Mission Statement</label>
                            <textarea rows={3} name="missionText" value={aboutData.missionText} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--accent-primary)] mb-2 uppercase tracking-wider">Vision Statement</label>
                            <textarea rows={3} name="visionText" value={aboutData.visionText} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                        </div>
                    </div>

                    {/* Core Values with CRUD & Drag-Drop */}
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-2 mb-4">
                            <h3 className="text-lg font-bold">Core Values</h3>
                            <button
                                onClick={handleAddValue}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] transition-colors"
                            >
                                <Plus size={14} /> Add Value
                            </button>
                        </div>
                        
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="values">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {aboutData.values.map((v, index) => (
                                            <Draggable key={v.id} draggableId={v.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`p-4 rounded-lg space-y-3 ${snapshot.isDragging ? 'bg-blue-50 border-2 border-blue-300' : 'bg-[var(--bg-tertiary)] border border-[var(--border-light)]'}`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
                                                                    <GripVertical size={16} />
                                                                </div>
                                                                <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm text-[var(--accent-primary)]">Value #{index + 1}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteValue(v.id)}
                                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Title</label>
                                                                <input type="text" value={v.title} onChange={(e) => handleValueChange(v.id, 'title', e.target.value)} className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Icon</label>
                                                                <IconPicker value={v.icon} onChange={(icon) => handleValueChange(v.id, 'icon', icon)} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Description</label>
                                                            <textarea rows={2} value={v.text} onChange={(e) => handleValueChange(v.id, 'text', e.target.value)} className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm" />
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

                {/* Live Preview Column */}
                <div className="space-y-6 sticky top-8">
                    <div className="glass-card p-6 bg-[var(--bg-tertiary)]">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Live Preview</h3>

                        <div className="bg-white rounded-xl shadow-lg border border-[var(--border-light)] overflow-hidden">
                            {/* Hero Preview */}
                            <div className="bg-[#F5F7FA] text-[#1A365D] p-8 text-center border-b-4 border-[#B8860B]">
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-heading font-bold mb-2">{aboutData.heroTitle}</h2>
                                    <p className="text-sm text-gray-600">{aboutData.heroSubtitle}</p>
                                </div>
                            </div>

                            {/* Content Preview */}
                            <div className="p-6 space-y-6">
                                {/* Mission & Vision */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-[#C9A227] font-bold text-base mb-2 italic">{aboutData.missionTitle}</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">{aboutData.missionText}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[#C9A227] font-bold text-base mb-2 italic">{aboutData.visionTitle}</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">{aboutData.visionText}</p>
                                    </div>
                                </div>

                                {/* Values - Dynamic grid */}
                                <div className={`grid gap-3 pt-4 border-t border-gray-100 ${aboutData.values.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                    {aboutData.values.map(v => (
                                        <div key={v.id} className="p-3 bg-gray-50 rounded border border-gray-100">
                                            <div className="text-[#0A1A2F] mb-2">
                                                {getIconComponent(v.icon)}
                                            </div>
                                            <h5 className="font-bold text-xs text-[#0A1A2F] mb-1">{v.title}</h5>
                                            <p className="text-[10px] text-gray-500 leading-normal">{v.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
};

export default AboutManager;
