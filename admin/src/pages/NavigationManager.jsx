import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Menu, ExternalLink, Loader2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const NavigationManager = () => {
    const defaultData = {
        logo: {
            url: '/logo.png',
            alt: 'Instrak Venture Capital'
        },
        items: [
            { id: 'nav-1', label: 'Home', link: '/', isDropdown: false, children: [] },
            { 
                id: 'nav-2', 
                label: 'About Us', 
                link: '/mission-vision-values', 
                isDropdown: true, 
                children: [
                    { id: 'sub-1', label: 'Mission, Vision & Values', link: '/mission-vision-values' },
                    { id: 'sub-2', label: 'Board of Directors', link: '/board-of-directors' },
                    { id: 'sub-3', label: 'Strategic Partners', link: '/strategic-partners' }
                ]
            },
            { 
                id: 'nav-3', 
                label: 'Services', 
                link: '/services', 
                isDropdown: true, 
                children: [
                    { id: 'sub-4', label: 'Strategic Financing', link: '/services' },
                    { id: 'sub-5', label: 'Institutional Investors', link: '/investors' }
                ]
            },
            { id: 'nav-4', label: 'Career', link: '/join-us', isDropdown: false, children: [] },
            { id: 'nav-5', label: 'News', link: '/latest-news-2', isDropdown: false, children: [] },
            { id: 'nav-6', label: 'Contact Us', link: '/contact', isDropdown: false, isButton: true, children: [] }
        ]
    };

    const { content, loading, saving, saveContent } = useContent('navigation', defaultData);
    const [formData, setFormData] = useState(defaultData);
    const [expandedItem, setExpandedItem] = useState(null);

    useEffect(() => {
        if (content && !loading) {
            setFormData({ ...defaultData, ...content });
        }
    }, [content, loading]);

    const handleSave = async () => {
        await saveContent(formData);
    };

    // Top-level nav item handlers
    const handleAddItem = () => {
        const newItem = {
            id: `nav-${Date.now()}`,
            label: 'New Link',
            link: '/',
            isDropdown: false,
            isButton: false,
            children: []
        };
        setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const handleUpdateItem = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const handleDeleteItem = (id) => {
        if (formData.items.length <= 1) {
            toast.error('Must have at least one navigation item');
            return;
        }
        setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
    };

    // Sub-item (dropdown) handlers
    const handleAddSubItem = (parentId) => {
        const newSubItem = { id: `sub-${Date.now()}`, label: 'New Sub-Link', link: '/' };
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => 
                item.id === parentId 
                    ? { ...item, children: [...item.children, newSubItem] }
                    : item
            )
        }));
    };

    const handleUpdateSubItem = (parentId, subId, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === parentId
                    ? { ...item, children: item.children.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub) }
                    : item
            )
        }));
    };

    const handleDeleteSubItem = (parentId, subId) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === parentId
                    ? { ...item, children: item.children.filter(sub => sub.id !== subId) }
                    : item
            )
        }));
    };

    // Drag-drop handlers
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination, type } = result;

        if (type === 'NAV_ITEMS') {
            const items = Array.from(formData.items);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setFormData(prev => ({ ...prev, items }));
        } else if (type.startsWith('SUB_ITEMS_')) {
            const parentId = type.replace('SUB_ITEMS_', '');
            setFormData(prev => ({
                ...prev,
                items: prev.items.map(item => {
                    if (item.id !== parentId) return item;
                    const children = Array.from(item.children);
                    const [reorderedItem] = children.splice(source.index, 1);
                    children.splice(destination.index, 0, reorderedItem);
                    return { ...item, children };
                })
            }));
        }
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
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Navigation Manager</h1>
                    <p className="text-[var(--text-secondary)]">Customize the site's main navigation menu and dropdowns.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleAddItem}
                        className="flex items-center gap-2 px-4 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add Nav Item</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] transition-colors shadow-md font-medium disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Save Navigation'}</span>
                    </button>
                </div>
            </div>

            {/* Logo Settings */}
            <div className="glass-card p-6 border-l-4 border-l-[var(--accent-secondary)]">
                <h3 className="font-bold text-[var(--accent-primary)] mb-4">Logo Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Logo Image URL</label>
                        <input
                            type="text"
                            value={formData.logo?.url || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, logo: { ...prev.logo, url: e.target.value } }))}
                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            placeholder="/logo.png"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Logo Alt Text</label>
                        <input
                            type="text"
                            value={formData.logo?.alt || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, logo: { ...prev.logo, alt: e.target.value } }))}
                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="glass-card p-6">
                <h3 className="font-bold text-[var(--accent-primary)] mb-4">Navigation Items</h3>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="nav-items" type="NAV_ITEMS">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                {formData.items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`border border-[var(--border-light)] rounded-lg overflow-hidden ${snapshot.isDragging ? 'shadow-lg bg-blue-50' : 'bg-white'}`}
                                            >
                                                {/* Main Item Row */}
                                                <div className="p-4 flex items-center gap-3">
                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                        <GripVertical size={20} />
                                                    </div>
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                                                        <input
                                                            type="text"
                                                            value={item.label}
                                                            onChange={(e) => handleUpdateItem(item.id, 'label', e.target.value)}
                                                            className="px-3 py-2 rounded border border-[var(--border-light)] text-sm font-medium"
                                                            placeholder="Label"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={item.link}
                                                            onChange={(e) => handleUpdateItem(item.id, 'link', e.target.value)}
                                                            className="px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                            placeholder="/path"
                                                        />
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.isDropdown}
                                                                    onChange={(e) => handleUpdateItem(item.id, 'isDropdown', e.target.checked)}
                                                                    className="w-4 h-4"
                                                                />
                                                                <span className="text-[var(--text-secondary)]">Has Dropdown</span>
                                                            </label>
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.isButton}
                                                                    onChange={(e) => handleUpdateItem(item.id, 'isButton', e.target.checked)}
                                                                    className="w-4 h-4"
                                                                />
                                                                <span className="text-[var(--text-secondary)]">Is Button</span>
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center gap-2 justify-end">
                                                            {item.isDropdown && (
                                                                <button
                                                                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                                                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-blue-50 rounded"
                                                                >
                                                                    {expandedItem === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteItem(item.id)}
                                                                className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dropdown Children */}
                                                {item.isDropdown && expandedItem === item.id && (
                                                    <div className="bg-[var(--bg-tertiary)] p-4 border-t border-[var(--border-light)]">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="text-sm font-medium text-[var(--text-secondary)]">Dropdown Items</span>
                                                            <button
                                                                onClick={() => handleAddSubItem(item.id)}
                                                                className="text-xs bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded hover:bg-[#08304e] flex items-center gap-1"
                                                            >
                                                                <Plus size={14} />
                                                                Add Sub-Item
                                                            </button>
                                                        </div>
                                                        <Droppable droppableId={`sub-${item.id}`} type={`SUB_ITEMS_${item.id}`}>
                                                            {(provided) => (
                                                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                                    {item.children.map((sub, subIndex) => (
                                                                        <Draggable key={sub.id} draggableId={sub.id} index={subIndex}>
                                                                            {(provided, snapshot) => (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    className={`flex items-center gap-3 p-3 bg-white rounded border border-[var(--border-light)] ${snapshot.isDragging ? 'shadow-md' : ''}`}
                                                                                >
                                                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                                                        <GripVertical size={16} />
                                                                                    </div>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={sub.label}
                                                                                        onChange={(e) => handleUpdateSubItem(item.id, sub.id, 'label', e.target.value)}
                                                                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                                                        placeholder="Sub-item label"
                                                                                    />
                                                                                    <input
                                                                                        type="text"
                                                                                        value={sub.link}
                                                                                        onChange={(e) => handleUpdateSubItem(item.id, sub.id, 'link', e.target.value)}
                                                                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                                                                        placeholder="/path"
                                                                                    />
                                                                                    <button
                                                                                        onClick={() => handleDeleteSubItem(item.id, sub.id)}
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
                                                        {item.children.length === 0 && (
                                                            <p className="text-sm text-[var(--text-muted)] text-center py-4">No dropdown items yet.</p>
                                                        )}
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
                </DragDropContext>
            </div>

            {/* Live Preview */}
            <div className="glass-card p-0 overflow-hidden">
                <div className="bg-gray-100 p-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Navigation Preview</div>
                <div className="bg-[#1A365D] p-4">
                    <div className="flex items-center justify-between max-w-6xl mx-auto">
                        <div className="text-white font-bold">{formData.logo?.alt || 'Logo'}</div>
                        <div className="flex items-center gap-6">
                            {formData.items.map(item => (
                                <div key={item.id} className="relative group">
                                    <span className={`text-white text-sm ${item.isButton ? 'bg-[#B8860B] px-4 py-2 rounded' : ''} cursor-pointer hover:text-[#B8860B]`}>
                                        {item.label}
                                        {item.isDropdown && <ChevronDown size={14} className="inline ml-1" />}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationManager;
