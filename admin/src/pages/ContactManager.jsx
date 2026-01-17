import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Loader2, MapPin, Phone, Mail, Layout } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useContent } from '../hooks/useContent';

const ContactManager = () => {
    const defaultData = {
        pageHero: {
            title: 'Contact Us',
            subtitle: 'Inquiries regarding strategic capital, institutional partnerships, and industrial growth.'
        },
        contactInfo: {
            address: {
                title: 'Our Office',
                lines: [
                    'Level 27 Penthouse,',
                    'Centrepoint North, Mid Valley City,',
                    '59200 Kuala Lumpur, Malaysia'
                ]
            },
            phones: {
                title: 'Contact Numbers',
                numbers: ['+603-2022 5208', '+6011-6364 1142']
            },
            email: {
                title: 'Email',
                address: 'admin@instrakventurecapital.com'
            }
        },
        formLabels: {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message',
            submitButton: 'Send Message'
        }
    };

    const { content, loading, saving, saveContent } = useContent('contact_page', defaultData);
    const [formData, setFormData] = useState(defaultData);

    useEffect(() => {
        if (content && !loading) {
            setFormData({ ...defaultData, ...content });
        }
    }, [content, loading]);

    const handleSave = async () => {
        await saveContent(formData);
    };

    // Address Lines
    const handleAddAddressLine = () => {
        setFormData(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                address: {
                    ...prev.contactInfo.address,
                    lines: [...prev.contactInfo.address.lines, 'New Address Line']
                }
            }
        }));
    };

    const handleUpdateAddressLine = (index, value) => {
        const lines = [...formData.contactInfo.address.lines];
        lines[index] = value;
        setFormData(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                address: { ...prev.contactInfo.address, lines }
            }
        }));
    };

    const handleDeleteAddressLine = (index) => {
        setFormData(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                address: {
                    ...prev.contactInfo.address,
                    lines: prev.contactInfo.address.lines.filter((_, i) => i !== index)
                }
            }
        }));
    };

    // Phone Numbers
    const handleAddPhone = () => {
        setFormData(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                phones: {
                    ...prev.contactInfo.phones,
                    numbers: [...prev.contactInfo.phones.numbers, '+60...']
                }
            }
        }));
    };

    const handleUpdatePhone = (index, value) => {
        const numbers = [...formData.contactInfo.phones.numbers];
        numbers[index] = value;
        setFormData(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                phones: { ...prev.contactInfo.phones, numbers }
            }
        }));
    };

    const handleDeletePhone = (index) => {
        setFormData(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                phones: {
                    ...prev.contactInfo.phones,
                    numbers: prev.contactInfo.phones.numbers.filter((_, i) => i !== index)
                }
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
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Contact Page Manager</h1>
                    <p className="text-[var(--text-secondary)]">Manage contact details, address, and form labels.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-save"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Page Hero */}
                <div className="glass-card p-6 border-l-4 border-l-blue-600">
                    <div className="flex items-center gap-2 mb-4">
                        <Layout className="text-[var(--accent-primary)]" />
                        <h3 className="font-bold text-[var(--accent-primary)]">Page Header</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Page Title</label>
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
                                rows={3}
                                value={formData.pageHero.subtitle}
                                onChange={(e) => setFormData(prev => ({ ...prev, pageHero: { ...prev.pageHero, subtitle: e.target.value } }))}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Labels */}
                <div className="glass-card p-6 border-l-4 border-l-green-600">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="text-[var(--accent-primary)]" />
                        <h3 className="font-bold text-[var(--accent-primary)]">Form Config</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Name Label</label>
                            <input
                                type="text"
                                value={formData.formLabels.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, formLabels: { ...prev.formLabels, name: e.target.value } }))}
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email Label</label>
                            <input
                                type="text"
                                value={formData.formLabels.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, formLabels: { ...prev.formLabels, email: e.target.value } }))}
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Subject Label</label>
                            <input
                                type="text"
                                value={formData.formLabels.subject}
                                onChange={(e) => setFormData(prev => ({ ...prev, formLabels: { ...prev.formLabels, subject: e.target.value } }))}
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Message Label</label>
                            <input
                                type="text"
                                value={formData.formLabels.message}
                                onChange={(e) => setFormData(prev => ({ ...prev, formLabels: { ...prev.formLabels, message: e.target.value } }))}
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Submit Button Text</label>
                            <input
                                type="text"
                                value={formData.formLabels.submitButton}
                                onChange={(e) => setFormData(prev => ({ ...prev, formLabels: { ...prev.formLabels, submitButton: e.target.value } }))}
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info (Full Width) */}
                <div className="glass-card p-6 lg:col-span-2 border-l-4 border-l-[#B8860B]">
                    <div className="flex items-center gap-2 mb-6">
                        <MapPin className="text-[var(--accent-primary)]" />
                        <h3 className="font-bold text-[var(--accent-primary)]">Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Address */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-medium text-[var(--text-primary)]">Address</label>
                                <button
                                    onClick={handleAddAddressLine}
                                    className="btn-add px-2 py-1 text-xs"
                                >
                                    + Line
                                </button>
                            </div>
                            <input
                                type="text"
                                value={formData.contactInfo.address.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, address: { ...prev.contactInfo.address, title: e.target.value } } }))}
                                className="w-full px-3 py-2 mb-3 rounded border border-[var(--border-light)] font-bold text-sm"
                                placeholder="Section Title"
                            />
                            <div className="space-y-2">
                                {formData.contactInfo.address.lines.map((line, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={line}
                                            onChange={(e) => handleUpdateAddressLine(index, e.target.value)}
                                            className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                        />
                                        <button
                                            onClick={() => handleDeleteAddressLine(index)}
                                            className="p-1.5 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Phones */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-medium text-[var(--text-primary)]">Phones</label>
                                <button
                                    onClick={handleAddPhone}
                                    className="btn-add px-2 py-1 text-xs"
                                >
                                    + Phone
                                </button>
                            </div>
                            <input
                                type="text"
                                value={formData.contactInfo.phones.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, phones: { ...prev.contactInfo.phones, title: e.target.value } } }))}
                                className="w-full px-3 py-2 mb-3 rounded border border-[var(--border-light)] font-bold text-sm"
                                placeholder="Section Title"
                            />
                            <div className="space-y-2">
                                {formData.contactInfo.phones.numbers.map((line, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={line}
                                            onChange={(e) => handleUpdatePhone(index, e.target.value)}
                                            className="flex-1 px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                                        />
                                        <button
                                            onClick={() => handleDeletePhone(index)}
                                            className="p-1.5 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="font-medium text-[var(--text-primary)] block mb-2">Email</label>
                            <input
                                type="text"
                                value={formData.contactInfo.email.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, email: { ...prev.contactInfo.email, title: e.target.value } } }))}
                                className="w-full px-3 py-2 mb-3 rounded border border-[var(--border-light)] font-bold text-sm"
                                placeholder="Section Title"
                            />
                            <input
                                type="text"
                                value={formData.contactInfo.email.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, email: { ...prev.contactInfo.email, address: e.target.value } } }))}
                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactManager;
