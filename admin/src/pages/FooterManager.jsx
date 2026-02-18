import React, { useState, useEffect } from 'react';
import { Save, Link as LinkIcon, Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail, Loader2, Image, Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import ImageUpload from '../components/ImageUpload';

const FooterManager = () => {
    const defaultData = {
        logo: '',
        companyName: 'Instrak Venture Capital Berhad (1411516-U)',
        description: 'Providing strategic funding and governance for the next generation of industry leaders through institutional excellence.',
        address: 'Level 27 Penthouse, Centrepoint North\nMid Valley City\n59200 Kuala Lumpur, Malaysia',
        phone: '',
        email: 'admin@instrakventurecapital.com',
        socials: { facebook: '', linkedin: '', twitter: '', instagram: '' },
        quickLinks: [
            { id: 'ql-1', label: 'Home', url: '/' },
            { id: 'ql-2', label: 'About Us', url: '/mission-vision-values' },
            { id: 'ql-3', label: 'Services', url: '/services' },
            { id: 'ql-4', label: 'News', url: '/latest-news-2' },
            { id: 'ql-5', label: 'Contact Us', url: '/contact' }
        ],
        styles: {
            footerBgColor: '#FAFBFC',
            descriptionTextColor: '#4A5568',
            addressTextColor: '#4A5568',
            phoneTextColor: '#4A5568',
            emailTextColor: '#1A365D',
            quickLinkTextColor: '#4A5568'
        }
    };

    const { content, loading, saving, saveContent } = useContent('footer', defaultData);
    const [footerData, setFooterData] = useState(defaultData);

    useEffect(() => {
        if (content && !loading) {
            // Ensure quickLinks have IDs
            const updatedContent = { ...content };
            if (updatedContent.quickLinks) {
                updatedContent.quickLinks = updatedContent.quickLinks.map((link, i) => ({
                    ...link,
                    id: link.id || `ql-${Date.now()}-${i}`
                }));
            }
            setFooterData(prev => ({ ...prev, ...updatedContent }));
        }
    }, [content, loading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFooterData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (key, value) => {
        setFooterData(prev => ({
            ...prev,
            socials: { ...prev.socials, [key]: value }
        }));
    };

    // Quick Links CRUD
    const handleAddLink = () => {
        const newLink = { id: `ql-${Date.now()}`, label: 'New Link', url: '/' };
        setFooterData(prev => ({ ...prev, quickLinks: [...prev.quickLinks, newLink] }));
    };

    const handleUpdateLink = (id, field, value) => {
        setFooterData(prev => ({
            ...prev,
            quickLinks: prev.quickLinks.map(link => link.id === id ? { ...link, [field]: value } : link)
        }));
    };

    const handleDeleteLink = (id) => {
        setFooterData(prev => ({
            ...prev,
            quickLinks: prev.quickLinks.filter(link => link.id !== id)
        }));
    };

    // Drag and Drop
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(footerData.quickLinks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFooterData(prev => ({ ...prev, quickLinks: items }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await saveContent(footerData);
    };

    const updateStyle = (key, value) => {
        setFooterData(prev => ({
            ...prev,
            styles: { ...(prev.styles || {}), [key]: value }
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Footer Manager</h1>
                    <p className="text-[var(--text-secondary)]">Customize the site footer, contact info, and social links.</p>
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
                        className="btn-save"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Publish Changes'}</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Company Info */}
                <div className="glass-card p-6 space-y-6">
                    <h3 className="text-lg font-bold border-b border-[var(--border-light)] pb-2 mb-4">Company Information</h3>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2"><Image size={14} className="inline mr-1" /> Company Logo</label>
                        <div className="w-48">
                            <ImageUpload
                                value={footerData.logo}
                                onChange={(url) => setFooterData({ ...footerData, logo: url })}
                                folder="footer"
                                aspectRatio="16/9"
                            />
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Upload your company logo (recommended: PNG with transparent background)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Company Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={footerData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2"><MapPin size={14} className="inline mr-1" /> Official Address</label>
                        <textarea
                            name="address"
                            rows={2}
                            value={footerData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        />
                    </div>

                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2"><Phone size={14} className="inline mr-1" /> Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={footerData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2"><Mail size={14} className="inline mr-1" /> Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={footerData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                            />
                        </div>
                    </div>

                    {/* Footer appearance – text and background colours */}
                    <div className="border-t border-[var(--border-light)] pt-6 mt-6">
                        <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-3">Footer appearance</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Footer background colour</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={footerData.styles?.footerBgColor || '#FAFBFC'}
                                        onChange={(e) => updateStyle('footerBgColor', e.target.value)}
                                        className="w-10 h-10 rounded border border-[var(--border-light)] cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={footerData.styles?.footerBgColor || ''}
                                        onChange={(e) => updateStyle('footerBgColor', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm font-mono"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Company description text colour</label>
                                <div className="flex gap-2">
                                    <input type="color" value={footerData.styles?.descriptionTextColor || '#4A5568'} onChange={(e) => updateStyle('descriptionTextColor', e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                                    <input type="text" value={footerData.styles?.descriptionTextColor || ''} onChange={(e) => updateStyle('descriptionTextColor', e.target.value)} className="flex-1 px-3 py-2 rounded border text-sm font-mono" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Official office address text colour</label>
                                <div className="flex gap-2">
                                    <input type="color" value={footerData.styles?.addressTextColor || '#4A5568'} onChange={(e) => updateStyle('addressTextColor', e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                                    <input type="text" value={footerData.styles?.addressTextColor || ''} onChange={(e) => updateStyle('addressTextColor', e.target.value)} className="flex-1 px-3 py-2 rounded border text-sm font-mono" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Phone number text colour</label>
                                <div className="flex gap-2">
                                    <input type="color" value={footerData.styles?.phoneTextColor || '#4A5568'} onChange={(e) => updateStyle('phoneTextColor', e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                                    <input type="text" value={footerData.styles?.phoneTextColor || ''} onChange={(e) => updateStyle('phoneTextColor', e.target.value)} className="flex-1 px-3 py-2 rounded border text-sm font-mono" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Email address text colour</label>
                                <div className="flex gap-2">
                                    <input type="color" value={footerData.styles?.emailTextColor || '#1A365D'} onChange={(e) => updateStyle('emailTextColor', e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                                    <input type="text" value={footerData.styles?.emailTextColor || ''} onChange={(e) => updateStyle('emailTextColor', e.target.value)} className="flex-1 px-3 py-2 rounded border text-sm font-mono" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Quick links text colour</label>
                                <div className="flex gap-2">
                                    <input type="color" value={footerData.styles?.quickLinkTextColor || '#4A5568'} onChange={(e) => updateStyle('quickLinkTextColor', e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                                    <input type="text" value={footerData.styles?.quickLinkTextColor || ''} onChange={(e) => updateStyle('quickLinkTextColor', e.target.value)} className="flex-1 px-3 py-2 rounded border text-sm font-mono" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Quick Links with CRUD & Drag-Drop */}
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-2 mb-4">
                            <h3 className="text-lg font-bold">Quick Links</h3>
                            <button
                                onClick={handleAddLink}
                                className="btn-add px-3 py-1.5 text-sm"
                            >
                                <Plus size={14} /> Add Link
                            </button>
                        </div>

                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="quickLinks">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {footerData.quickLinks.map((link, index) => (
                                            <Draggable key={link.id} draggableId={link.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`flex items-center gap-2 p-3 rounded-lg border ${snapshot.isDragging ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-[var(--border-light)]'}`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={link.label}
                                                            onChange={(e) => handleUpdateLink(link.id, 'label', e.target.value)}
                                                            placeholder="Label"
                                                            className="flex-1 px-3 py-1.5 text-sm rounded border border-[var(--border-light)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={link.url}
                                                            onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                                                            placeholder="URL"
                                                            className="flex-1 px-3 py-1.5 text-sm rounded border border-[var(--border-light)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                                        />
                                                        <button
                                                            onClick={() => handleDeleteLink(link.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
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

                    {/* Social Links */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold border-b border-[var(--border-light)] pb-2 mb-4">Social Media Links</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Linkedin className="text-blue-700" size={24} />
                                <input type="text" placeholder="LinkedIn URL" value={footerData.socials.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-[var(--border-light)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-sm" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Facebook className="text-blue-600" size={24} />
                                <input type="text" placeholder="Facebook URL" value={footerData.socials.facebook} onChange={(e) => handleSocialChange('facebook', e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-[var(--border-light)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-sm" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Twitter className="text-blue-400" size={24} />
                                <input type="text" placeholder="Twitter (X) URL" value={footerData.socials.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-[var(--border-light)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-sm" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Instagram className="text-pink-600" size={24} />
                                <input type="text" placeholder="Instagram URL" value={footerData.socials.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-[var(--border-light)] outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-sm" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FooterManager;
