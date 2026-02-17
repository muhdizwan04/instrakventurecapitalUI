import React, { useState, useEffect } from 'react';
import { Save, Loader2, Layout } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const DEFAULT_PAGE = {
    heroTitle: 'Strategic Financial Services',
    heroSubtitle: 'Comprehensive financial pathways tailored for institutional growth, industrial expansion, and global capital access.',
    heroBackground: 'linear-gradient(135deg, #1A365D 0%, #0F2942 100%)',
    heroTextColor: '#FFFFFF',
    heroTextAlign: 'center',
    heroFontFamily: 'var(--font-heading)',
    heroTitleFontSize: '3.5rem',
    heroSubtitleFontSize: '1.25rem',
    heroFontWeight: '700',
    ctaPrimaryText: 'Speak to an Advisor',
    ctaPrimaryLink: '/contact',
    ctaSecondaryText: 'Explore Solutions',
    sectionSolutionsTitle: 'Our Specialized Solutions',
    sectionIndustriesTitle: 'Sector Expertise',
    sectionTitleFontFamily: 'var(--font-heading)',
    sectionTitleFontSize: '2.5rem',
    sectionTitleColor: '#1A365D',
    sectionTitleAlign: 'center',
    sectionTitleFontWeight: '700',
    leadMagnetTitle: 'Unsure which solution fits your needs?',
    leadMagnetDescription: 'Our analysts can assess your current financial position and recommend the optimal funding or restructuring strategy.',
    leadMagnetButtonText: 'Get a Free Assessment',
    leadMagnetButtonLink: '/contact',
    leadMagnetTextAlign: 'center',
    leadMagnetFontFamily: 'var(--font-heading)',
    leadMagnetTitleFontSize: '2rem',
    leadMagnetDescFontSize: '1.1rem',
    leadMagnetTitleColor: '#1A365D',
    leadMagnetDescColor: '#4A5568'
};

const ServicesPageManager = () => {
    const { content, loading, saving, saveContent } = useContent('services_page', DEFAULT_PAGE);
    const [formData, setFormData] = useState(DEFAULT_PAGE);

    useEffect(() => {
        if (content && Object.keys(content).length > 0 && !loading) {
            setFormData(prev => ({ ...DEFAULT_PAGE, ...prev, ...content }));
        }
    }, [content, loading]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await saveContent(formData);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Services Page</h1>
                    <p className="text-[var(--text-secondary)]">Customise the main Services page (/services): hero, section titles, and CTA. Service cards are managed in <strong>Services Manager</strong>.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-save">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Hero */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2">
                        <Layout size={20} /> Hero
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">Hero title</label>
                            <input value={formData.heroTitle || ''} onChange={(e) => handleChange('heroTitle', e.target.value)} className="input-field" placeholder="Strategic Financial Services" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Hero subtitle</label>
                            <textarea value={formData.heroSubtitle || ''} onChange={(e) => handleChange('heroSubtitle', e.target.value)} className="input-field" rows={2} placeholder="Comprehensive financial pathways..." />
                        </div>
                        <div>
                            <label className="label">Hero background (hex or gradient)</label>
                            <input value={formData.heroBackground || ''} onChange={(e) => handleChange('heroBackground', e.target.value)} className="input-field text-sm" placeholder="linear-gradient(135deg, #1A365D, #0F2942)" />
                        </div>
                        <div>
                            <label className="label">Hero text colour</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={formData.heroTextColor || '#FFFFFF'} onChange={(e) => handleChange('heroTextColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                <input type="text" value={formData.heroTextColor || ''} onChange={(e) => handleChange('heroTextColor', e.target.value)} className="input-field flex-1" placeholder="#FFFFFF" />
                            </div>
                        </div>
                        <div>
                            <label className="label">Hero text alignment</label>
                            <select value={formData.heroTextAlign || 'center'} onChange={(e) => handleChange('heroTextAlign', e.target.value)} className="input-field">
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Hero font family (CSS value)</label>
                            <input value={formData.heroFontFamily || ''} onChange={(e) => handleChange('heroFontFamily', e.target.value)} className="input-field text-sm" placeholder="var(--font-heading)" />
                        </div>
                        <div>
                            <label className="label">Hero title font size</label>
                            <input value={formData.heroTitleFontSize || ''} onChange={(e) => handleChange('heroTitleFontSize', e.target.value)} className="input-field" placeholder="3.5rem" />
                        </div>
                        <div>
                            <label className="label">Hero subtitle font size</label>
                            <input value={formData.heroSubtitleFontSize || ''} onChange={(e) => handleChange('heroSubtitleFontSize', e.target.value)} className="input-field" placeholder="1.25rem" />
                        </div>
                        <div>
                            <label className="label">Hero font weight</label>
                            <select value={formData.heroFontWeight || '700'} onChange={(e) => handleChange('heroFontWeight', e.target.value)} className="input-field">
                                <option value="400">Normal (400)</option>
                                <option value="600">Semi-bold (600)</option>
                                <option value="700">Bold (700)</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Primary CTA text</label>
                            <input value={formData.ctaPrimaryText || ''} onChange={(e) => handleChange('ctaPrimaryText', e.target.value)} className="input-field" placeholder="Speak to an Advisor" />
                        </div>
                        <div>
                            <label className="label">Primary CTA link</label>
                            <input value={formData.ctaPrimaryLink || ''} onChange={(e) => handleChange('ctaPrimaryLink', e.target.value)} className="input-field" placeholder="/contact" />
                        </div>
                        <div>
                            <label className="label">Secondary CTA text</label>
                            <input value={formData.ctaSecondaryText || ''} onChange={(e) => handleChange('ctaSecondaryText', e.target.value)} className="input-field" placeholder="Explore Solutions" />
                        </div>
                    </div>
                </div>

                {/* Section titles */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4">Section titles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Solutions section title</label>
                            <input value={formData.sectionSolutionsTitle || ''} onChange={(e) => handleChange('sectionSolutionsTitle', e.target.value)} className="input-field" placeholder="Our Specialized Solutions" />
                        </div>
                        <div>
                            <label className="label">Industries / sector section title</label>
                            <input value={formData.sectionIndustriesTitle || ''} onChange={(e) => handleChange('sectionIndustriesTitle', e.target.value)} className="input-field" placeholder="Sector Expertise" />
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Section title font & alignment</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Text alignment</label>
                                <select value={formData.sectionTitleAlign || 'center'} onChange={(e) => handleChange('sectionTitleAlign', e.target.value)} className="input-field">
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Font family (CSS value)</label>
                                <input value={formData.sectionTitleFontFamily || ''} onChange={(e) => handleChange('sectionTitleFontFamily', e.target.value)} className="input-field text-sm" placeholder="var(--font-heading)" />
                            </div>
                            <div>
                                <label className="label">Font size</label>
                                <input value={formData.sectionTitleFontSize || ''} onChange={(e) => handleChange('sectionTitleFontSize', e.target.value)} className="input-field" placeholder="2.5rem" />
                            </div>
                            <div>
                                <label className="label">Font weight</label>
                                <select value={formData.sectionTitleFontWeight || '700'} onChange={(e) => handleChange('sectionTitleFontWeight', e.target.value)} className="input-field">
                                    <option value="400">Normal (400)</option>
                                    <option value="600">Semi-bold (600)</option>
                                    <option value="700">Bold (700)</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Colour</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={formData.sectionTitleColor || '#1A365D'} onChange={(e) => handleChange('sectionTitleColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                    <input type="text" value={formData.sectionTitleColor || ''} onChange={(e) => handleChange('sectionTitleColor', e.target.value)} className="input-field flex-1" placeholder="#1A365D" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lead magnet (interstitial) */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-[var(--accent-primary)] mb-4">Lead magnet block</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Title</label>
                            <input value={formData.leadMagnetTitle || ''} onChange={(e) => handleChange('leadMagnetTitle', e.target.value)} className="input-field" placeholder="Unsure which solution fits your needs?" />
                        </div>
                        <div>
                            <label className="label">Description</label>
                            <textarea value={formData.leadMagnetDescription || ''} onChange={(e) => handleChange('leadMagnetDescription', e.target.value)} className="input-field" rows={2} placeholder="Our analysts can assess..." />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Button text</label>
                                <input value={formData.leadMagnetButtonText || ''} onChange={(e) => handleChange('leadMagnetButtonText', e.target.value)} className="input-field" placeholder="Get a Free Assessment" />
                            </div>
                            <div>
                                <label className="label">Button link</label>
                                <input value={formData.leadMagnetButtonLink || ''} onChange={(e) => handleChange('leadMagnetButtonLink', e.target.value)} className="input-field" placeholder="/contact" />
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">Lead magnet font & alignment</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Text alignment</label>
                                    <select value={formData.leadMagnetTextAlign || 'center'} onChange={(e) => handleChange('leadMagnetTextAlign', e.target.value)} className="input-field">
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Font family (CSS value)</label>
                                    <input value={formData.leadMagnetFontFamily || ''} onChange={(e) => handleChange('leadMagnetFontFamily', e.target.value)} className="input-field text-sm" placeholder="var(--font-heading)" />
                                </div>
                                <div>
                                    <label className="label">Title font size</label>
                                    <input value={formData.leadMagnetTitleFontSize || ''} onChange={(e) => handleChange('leadMagnetTitleFontSize', e.target.value)} className="input-field" placeholder="2rem" />
                                </div>
                                <div>
                                    <label className="label">Description font size</label>
                                    <input value={formData.leadMagnetDescFontSize || ''} onChange={(e) => handleChange('leadMagnetDescFontSize', e.target.value)} className="input-field" placeholder="1.1rem" />
                                </div>
                                <div>
                                    <label className="label">Title colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={formData.leadMagnetTitleColor || '#1A365D'} onChange={(e) => handleChange('leadMagnetTitleColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                        <input type="text" value={formData.leadMagnetTitleColor || ''} onChange={(e) => handleChange('leadMagnetTitleColor', e.target.value)} className="input-field flex-1" placeholder="#1A365D" />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Description colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={formData.leadMagnetDescColor || '#4A5568'} onChange={(e) => handleChange('leadMagnetDescColor', e.target.value)} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                                        <input type="text" value={formData.leadMagnetDescColor || ''} onChange={(e) => handleChange('leadMagnetDescColor', e.target.value)} className="input-field flex-1" placeholder="#4A5568" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ServicesPageManager;
