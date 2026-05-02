import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Loader2, MapPin, Phone, Mail, Layout } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useContent } from '../hooks/useContent';
import AppearanceEditor from '../components/AppearanceEditor';

const ContactManager = () => {
    const defaultData = {
        pageHero: {
            title: 'Contact Us',
            subtitle: 'Inquiries regarding strategic capital, institutional partnerships, and industrial growth.',
            styles: {
                titleColor: '#FFFFFF',
                subtitleColor: '#e2e8f0',
                textAlign: 'center',
                bgColor: '#0b1120'
            }
        },
        styles: {
            sectionTitle: 'Get in Touch',
            sectionBgColor: 'transparent',
            sectionTitleColor: '#1A365D',
            sectionTextColor: '#64748B',
            sectionAlign: 'left',
            sectionPaddingTop: '80px',
            sectionPaddingBottom: '80px',
            sectionPaddingHorizontal: '20px',
            sectionTitleFontSize: '2rem',
            sectionTitleMarginBottom: '2rem',
            contactBlockStyle: 'solid',
            contactBlockBgColor: 'transparent',
            contactBlockPadding: '2rem',
            contactBlockBorderRadius: '16px',
            contactBlockBorderColor: 'rgba(0,0,0,0.06)',
            contactIconColor: '#fde68a',
            formCardStyle: 'solid',
            formCardBgColor: '#FFFFFF',
            formCardPadding: '2.5rem',
            formCardBorderColor: 'rgba(26, 54, 93, 0.12)',
            formCardBoxShadow: '0 4px 20px rgba(26, 54, 93, 0.08)',
            formLabelColor: '#1A365D',
            formInputBgColor: '#FFFFFF',
            formInputBorderColor: 'rgba(26, 54, 93, 0.2)',
            formInputTextColor: '#1A365D',
            formInputBorderRadius: '6px',
            formInputFontSize: '0.95rem',
            formButtonBgColor: '#1A365D',
            formButtonTextColor: '#FFFFFF',
            formButtonBorderRadius: '6px',
            formButtonPadding: '0.75rem 1.5rem',
            formButtonFontWeight: '600'
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
        },
        meetingScheduler: {
            enabled: false,
            required: false,
            dateLabel: 'Preferred Meeting Date',
            timeLabel: 'Preferred Meeting Time',
            helperText: 'Optional — pick a convenient time and our team will confirm availability.',
            minDaysAhead: 1
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

    const updateHeroStyle = (key, value) => {
        setFormData(prev => ({
            ...prev,
            pageHero: {
                ...prev.pageHero,
                styles: { ...(prev.pageHero.styles || {}), [key]: value }
            }
        }));
    };

    const updateStyle = (key, value) => {
        setFormData(prev => ({
            ...prev,
            styles: { ...(prev.styles || {}), [key]: value }
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
                    <h1 className="text-3xl font-heading text-[var(--text-primary)] mb-2">Contact Page Manager</h1>
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
                        <h3 className="font-bold text-[var(--text-primary)]">Page Header</h3>
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
                        <AppearanceEditor
                            styles={formData.pageHero.styles || {}}
                            onChange={(st) => setFormData(prev => ({ ...prev, pageHero: { ...prev.pageHero, styles: st } }))}
                            colorFields={[
                                { key: 'titleColor', label: 'Title Colour', default: '#FFFFFF' },
                                { key: 'subtitleColor', label: 'Subtitle Colour', default: '#e2e8f0' },
                                { key: 'bgColor', label: 'Background', default: '#0b1120' },
                            ]}
                            features={['alignment']}
                        />
                    </div>
                </div>

                {/* Form Labels */}
                <div className="glass-card p-6 border-l-4 border-l-green-600">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="text-[var(--accent-primary)]" />
                        <h3 className="font-bold text-[var(--text-primary)]">Form Config</h3>
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
                    <div className="mt-6 pt-5 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Meeting scheduler (date & time)</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!formData.meetingScheduler?.enabled}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                meetingScheduler: {
                                                    ...(prev.meetingScheduler || defaultData.meetingScheduler),
                                                    enabled: e.target.checked,
                                                },
                                            }))
                                        }
                                        className="w-4 h-4"
                                    />
                                    Enable date & time picker
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!formData.meetingScheduler?.required}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                meetingScheduler: {
                                                    ...(prev.meetingScheduler || defaultData.meetingScheduler),
                                                    required: e.target.checked,
                                                },
                                            }))
                                        }
                                        className="w-4 h-4"
                                        disabled={!formData.meetingScheduler?.enabled}
                                    />
                                    Required
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Date label</label>
                                    <input
                                        type="text"
                                        value={formData.meetingScheduler?.dateLabel || defaultData.meetingScheduler.dateLabel}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                meetingScheduler: {
                                                    ...(prev.meetingScheduler || defaultData.meetingScheduler),
                                                    dateLabel: e.target.value,
                                                },
                                            }))
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm"
                                        disabled={!formData.meetingScheduler?.enabled}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Time label</label>
                                    <input
                                        type="text"
                                        value={formData.meetingScheduler?.timeLabel || defaultData.meetingScheduler.timeLabel}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                meetingScheduler: {
                                                    ...(prev.meetingScheduler || defaultData.meetingScheduler),
                                                    timeLabel: e.target.value,
                                                },
                                            }))
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm"
                                        disabled={!formData.meetingScheduler?.enabled}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Helper text</label>
                                    <input
                                        type="text"
                                        value={formData.meetingScheduler?.helperText || defaultData.meetingScheduler.helperText}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                meetingScheduler: {
                                                    ...(prev.meetingScheduler || defaultData.meetingScheduler),
                                                    helperText: e.target.value,
                                                },
                                            }))
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm"
                                        disabled={!formData.meetingScheduler?.enabled}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Minimum days ahead</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={365}
                                        value={Number.isFinite(formData.meetingScheduler?.minDaysAhead) ? formData.meetingScheduler.minDaysAhead : defaultData.meetingScheduler.minDaysAhead}
                                        onChange={(e) => {
                                            const v = e.target.value === '' ? 0 : Math.max(0, Math.min(365, parseInt(e.target.value, 10) || 0));
                                            setFormData((prev) => ({
                                                ...prev,
                                                meetingScheduler: {
                                                    ...(prev.meetingScheduler || defaultData.meetingScheduler),
                                                    minDaysAhead: v,
                                                },
                                            }));
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm"
                                        disabled={!formData.meetingScheduler?.enabled}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Prevents selecting dates too soon (e.g. 1 = tomorrow onwards).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info (Full Width) */}
                <div className="glass-card p-6 lg:col-span-2 border-l-4 border-l-[#B8860B]">
                    <div className="flex items-center gap-2 mb-6">
                        <MapPin className="text-[var(--accent-primary)]" />
                        <h3 className="font-bold text-[var(--text-primary)]">Contact Information</h3>
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

                {/* Section & Form Appearance */}
                <div className="glass-card p-6 lg:col-span-2 border-l-4 border-l-purple-500">
                    <h3 className="font-bold text-[var(--text-primary)] mb-4">Section & Form Appearance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-600">Content section</h4>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Section title</label>
                                <input type="text" value={formData.styles?.sectionTitle ?? 'Get in Touch'} onChange={(e) => updateStyle('sectionTitle', e.target.value)} className="input-field text-sm w-full py-1.5" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Section bg</label>
                                    <div className="flex gap-1">
                                        <input type="color" value={(formData.styles?.sectionBgColor && formData.styles.sectionBgColor !== 'transparent') ? formData.styles.sectionBgColor : '#f8fafc'} onChange={(e) => updateStyle('sectionBgColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                        <input type="text" value={formData.styles?.sectionBgColor || ''} onChange={(e) => updateStyle('sectionBgColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" placeholder="transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Title colour</label>
                                    <div className="flex gap-1">
                                        <input type="color" value={formData.styles?.sectionTitleColor || '#1A365D'} onChange={(e) => updateStyle('sectionTitleColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                        <input type="text" value={formData.styles?.sectionTitleColor || ''} onChange={(e) => updateStyle('sectionTitleColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Text colour</label>
                                    <div className="flex gap-1">
                                        <input type="color" value={formData.styles?.sectionTextColor || '#64748B'} onChange={(e) => updateStyle('sectionTextColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                        <input type="text" value={formData.styles?.sectionTextColor || ''} onChange={(e) => updateStyle('sectionTextColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Align</label>
                                    <select value={formData.styles?.sectionAlign || 'left'} onChange={(e) => updateStyle('sectionAlign', e.target.value)} className="w-full px-1 py-1 rounded border text-xs">
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Padding top</label><input type="text" value={formData.styles?.sectionPaddingTop ?? '80px'} onChange={(e) => updateStyle('sectionPaddingTop', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="80px" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Padding bottom</label><input type="text" value={formData.styles?.sectionPaddingBottom ?? '80px'} onChange={(e) => updateStyle('sectionPaddingBottom', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="80px" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Padding horizontal</label><input type="text" value={formData.styles?.sectionPaddingHorizontal ?? '20px'} onChange={(e) => updateStyle('sectionPaddingHorizontal', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="20px" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Title font size</label><input type="text" value={formData.styles?.sectionTitleFontSize ?? '2rem'} onChange={(e) => updateStyle('sectionTitleFontSize', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="2rem" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Title margin bottom</label><input type="text" value={formData.styles?.sectionTitleMarginBottom ?? '2rem'} onChange={(e) => updateStyle('sectionTitleMarginBottom', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="2rem" /></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-600">Contact info block (left)</h4>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => updateStyle('contactBlockStyle', 'solid')} className={`flex-1 py-2 rounded border text-xs font-medium ${(formData.styles || {}).contactBlockStyle !== 'glass' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>Solid</button>
                                <button type="button" onClick={() => updateStyle('contactBlockStyle', 'glass')} className={`flex-1 py-2 rounded border text-xs font-medium ${(formData.styles || {}).contactBlockStyle === 'glass' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>Glass (transparent)</button>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 block mb-0.5">Block background colour</label>
                                <div className="flex gap-1">
                                    <input type="color" value={(formData.styles?.contactBlockBgColor && formData.styles.contactBlockBgColor !== 'transparent') ? formData.styles.contactBlockBgColor : '#ffffff'} onChange={(e) => updateStyle('contactBlockBgColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                    <input type="text" value={formData.styles?.contactBlockBgColor || ''} onChange={(e) => updateStyle('contactBlockBgColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" placeholder="transparent" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 block mb-0.5">Icon colour</label>
                                <div className="flex gap-1">
                                    <input type="color" value={formData.styles?.contactIconColor || '#fde68a'} onChange={(e) => updateStyle('contactIconColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                    <input type="text" value={formData.styles?.contactIconColor || ''} onChange={(e) => updateStyle('contactIconColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Padding</label><input type="text" value={formData.styles?.contactBlockPadding ?? '2rem'} onChange={(e) => updateStyle('contactBlockPadding', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="2rem" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Border radius</label><input type="text" value={formData.styles?.contactBlockBorderRadius ?? '16px'} onChange={(e) => updateStyle('contactBlockBorderRadius', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="16px" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Border colour</label><input type="text" value={formData.styles?.contactBlockBorderColor ?? ''} onChange={(e) => updateStyle('contactBlockBorderColor', e.target.value)} className="w-full px-1 py-1 text-[10px] font-mono rounded border" placeholder="rgba(0,0,0,0.06)" /></div>
                            </div>
                        </div>
                        <div className="space-y-3 md:col-span-2">
                            <h4 className="text-sm font-bold text-gray-600">Form card (right)</h4>
                            <div className="flex gap-2 mb-2">
                                <button type="button" onClick={() => updateStyle('formCardStyle', 'solid')} className={`py-2 px-4 rounded border text-xs font-medium ${(formData.styles || {}).formCardStyle !== 'glass' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>Solid</button>
                                <button type="button" onClick={() => updateStyle('formCardStyle', 'glass')} className={`py-2 px-4 rounded border text-xs font-medium ${(formData.styles || {}).formCardStyle === 'glass' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>Glass (transparent)</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Card background</label>
                                    <div className="flex gap-1">
                                        <input type="color" value={formData.styles?.formCardBgColor || '#FFFFFF'} onChange={(e) => updateStyle('formCardBgColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                        <input type="text" value={formData.styles?.formCardBgColor || ''} onChange={(e) => updateStyle('formCardBgColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" />
                                    </div>
                                </div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Card padding</label><input type="text" value={formData.styles?.formCardPadding ?? '2.5rem'} onChange={(e) => updateStyle('formCardPadding', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="2.5rem" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Card border colour</label><input type="text" value={formData.styles?.formCardBorderColor ?? ''} onChange={(e) => updateStyle('formCardBorderColor', e.target.value)} className="w-full px-1 py-1 text-[10px] font-mono rounded border" placeholder="rgba(26,54,93,0.12)" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Card box shadow</label><input type="text" value={formData.styles?.formCardBoxShadow ?? ''} onChange={(e) => updateStyle('formCardBoxShadow', e.target.value)} className="w-full px-1 py-1 text-[10px] font-mono rounded border" placeholder="0 4px 20px rgba(26,54,93,0.08)" /></div>
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Label colour</label>
                                    <div className="flex gap-1">
                                        <input type="color" value={formData.styles?.formLabelColor || '#1A365D'} onChange={(e) => updateStyle('formLabelColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                        <input type="text" value={formData.styles?.formLabelColor || ''} onChange={(e) => updateStyle('formLabelColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Input background</label>
                                    <div className="flex gap-1">
                                        <input type="color" value={formData.styles?.formInputBgColor || '#FFFFFF'} onChange={(e) => updateStyle('formInputBgColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                        <input type="text" value={formData.styles?.formInputBgColor || ''} onChange={(e) => updateStyle('formInputBgColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Input text colour</label>
                                    <div className="flex gap-1">
                                        <input type="color" value={formData.styles?.formInputTextColor || '#1A365D'} onChange={(e) => updateStyle('formInputTextColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                        <input type="text" value={formData.styles?.formInputTextColor || ''} onChange={(e) => updateStyle('formInputTextColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" />
                                    </div>
                                </div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Input border colour</label><input type="text" value={formData.styles?.formInputBorderColor || ''} onChange={(e) => updateStyle('formInputBorderColor', e.target.value)} className="w-full px-1 py-1 text-[10px] font-mono rounded border" placeholder="rgba(26,54,93,0.2)" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Input border radius</label><input type="text" value={formData.styles?.formInputBorderRadius ?? '6px'} onChange={(e) => updateStyle('formInputBorderRadius', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="6px" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Input font size</label><input type="text" value={formData.styles?.formInputFontSize ?? '0.95rem'} onChange={(e) => updateStyle('formInputFontSize', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="0.95rem" /></div>
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Button background</label>
                                    <div className="flex gap-1">
                                        <input type="color" value={formData.styles?.formButtonBgColor || '#1A365D'} onChange={(e) => updateStyle('formButtonBgColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                        <input type="text" value={formData.styles?.formButtonBgColor || ''} onChange={(e) => updateStyle('formButtonBgColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-0.5">Button text colour</label>
                                    <div className="flex gap-1">
                                        <input type="color" value={formData.styles?.formButtonTextColor || '#FFFFFF'} onChange={(e) => updateStyle('formButtonTextColor', e.target.value)} className="w-7 h-7 rounded border cursor-pointer" />
                                        <input type="text" value={formData.styles?.formButtonTextColor || ''} onChange={(e) => updateStyle('formButtonTextColor', e.target.value)} className="flex-1 min-w-0 px-1 py-1 text-[10px] font-mono rounded border" />
                                    </div>
                                </div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Button border radius</label><input type="text" value={formData.styles?.formButtonBorderRadius ?? '6px'} onChange={(e) => updateStyle('formButtonBorderRadius', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="6px" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Button padding</label><input type="text" value={formData.styles?.formButtonPadding ?? '0.75rem 1.5rem'} onChange={(e) => updateStyle('formButtonPadding', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="0.75rem 1.5rem" /></div>
                                <div><label className="text-[10px] text-gray-500 block mb-0.5">Button font weight</label><input type="text" value={formData.styles?.formButtonFontWeight ?? '600'} onChange={(e) => updateStyle('formButtonFontWeight', e.target.value)} className="w-full px-1 py-1 text-[10px] rounded border" placeholder="600" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactManager;
