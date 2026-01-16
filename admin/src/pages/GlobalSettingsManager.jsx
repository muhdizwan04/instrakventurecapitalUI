import React, { useState, useEffect } from 'react';
import { Save, Palette, Globe, Image as ImageIcon, Settings, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const GlobalSettingsManager = () => {
    const defaultData = {
        siteIdentity: {
            siteName: 'Instrak Venture Capital Berhad',
            tagline: 'Strategic Capital for Industrial Excellence',
            logoUrl: '/logo.png',
            faviconUrl: '/favicon.ico',
            showHeroBadge: true
        },
        themeColors: {
            primary: '#1A365D',
            secondary: '#B8860B',
            accent: '#0A74DA',
            textPrimary: '#1A365D',
            textSecondary: '#4A5568',
            background: '#F5F7FA'
        },
        seoDefaults: {
            metaTitleTemplate: '%s | Instrak Venture Capital',
            metaDescription: 'Instrak Venture Capital Berhad - Strategic financing solutions for industrial growth in ASEAN.',
            ogImage: '/og-image.jpg',
            keywords: 'venture capital, financing, Malaysia, ASEAN, industrial, equity, contract financing'
        },
    };

    const { content, loading, saving, saveContent } = useContent('global_settings', defaultData);
    const [formData, setFormData] = useState(defaultData);
    const [activeTab, setActiveTab] = useState('identity');

    useEffect(() => {
        if (content && !loading) {
            setFormData({ ...defaultData, ...content });
        }
    }, [content, loading]);

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleSave = async () => {
        await saveContent(formData);
    };

    const tabs = [
        { id: 'identity', label: 'Site Identity', icon: Globe },
        { id: 'theme', label: 'Theme Colors', icon: Palette },
        { id: 'seo', label: 'SEO Defaults', icon: Settings },
    ];

    const ColorInput = ({ label, value, onChange }) => (
        <div className="flex items-center gap-3">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-12 rounded-lg border border-[var(--border-light)] cursor-pointer"
            />
            <div className="flex-1">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">{label}</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-[var(--border-light)] text-sm font-mono"
                />
            </div>
        </div>
    );

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
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Global Settings</h1>
                    <p className="text-[var(--text-secondary)]">Manage site-wide identity, theme, and SEO settings.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] transition-colors shadow-md font-medium disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-light)]">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                            activeTab === tab.id
                                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Site Identity Tab */}
            {activeTab === 'identity' && (
                <div className="glass-card p-8 animate-in fade-in duration-300">
                    <h3 className="font-bold text-[var(--accent-primary)] mb-6 text-lg">Site Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Site Name</label>
                            <input
                                type="text"
                                value={formData.siteIdentity.siteName}
                                onChange={(e) => handleChange('siteIdentity', 'siteName', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Tagline</label>
                            <input
                                type="text"
                                value={formData.siteIdentity.tagline}
                                onChange={(e) => handleChange('siteIdentity', 'tagline', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Logo URL</label>
                            <input
                                type="text"
                                value={formData.siteIdentity.logoUrl}
                                onChange={(e) => handleChange('siteIdentity', 'logoUrl', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                placeholder="/logo.png or https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Favicon URL</label>
                            <input
                                type="text"
                                value={formData.siteIdentity.faviconUrl}
                                onChange={(e) => handleChange('siteIdentity', 'faviconUrl', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                placeholder="/favicon.ico"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                            <input
                                type="checkbox"
                                id="showHeroBadge"
                                checked={formData.siteIdentity.showHeroBadge !== false}
                                onChange={(e) => handleChange('siteIdentity', 'showHeroBadge', e.target.checked)}
                                className="w-5 h-5 rounded border-[var(--border-light)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer"
                            />
                            <label htmlFor="showHeroBadge" className="text-sm font-medium text-[var(--accent-primary)] cursor-pointer">
                                Show Site Name Badge in Hero section
                            </label>
                            <p className="text-xs text-[var(--text-muted)] ml-auto">
                                If unchecked, the "box" above the main title will be hidden.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Theme Colors Tab */}
            {activeTab === 'theme' && (
                <div className="glass-card p-8 animate-in fade-in duration-300">
                    <h3 className="font-bold text-[var(--accent-primary)] mb-6 text-lg">Theme Colors</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-6">Changes will apply site-wide after saving and refreshing.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ColorInput
                            label="Primary Color"
                            value={formData.themeColors.primary}
                            onChange={(val) => handleChange('themeColors', 'primary', val)}
                        />
                        <ColorInput
                            label="Secondary/Gold Color"
                            value={formData.themeColors.secondary}
                            onChange={(val) => handleChange('themeColors', 'secondary', val)}
                        />
                        <ColorInput
                            label="Accent Blue"
                            value={formData.themeColors.accent}
                            onChange={(val) => handleChange('themeColors', 'accent', val)}
                        />
                        <ColorInput
                            label="Text Primary"
                            value={formData.themeColors.textPrimary}
                            onChange={(val) => handleChange('themeColors', 'textPrimary', val)}
                        />
                        <ColorInput
                            label="Text Secondary"
                            value={formData.themeColors.textSecondary}
                            onChange={(val) => handleChange('themeColors', 'textSecondary', val)}
                        />
                        <ColorInput
                            label="Background"
                            value={formData.themeColors.background}
                            onChange={(val) => handleChange('themeColors', 'background', val)}
                        />
                    </div>
                </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
                <div className="glass-card p-8 animate-in fade-in duration-300">
                    <h3 className="font-bold text-[var(--accent-primary)] mb-6 text-lg">SEO Defaults</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Meta Title Template</label>
                            <input
                                type="text"
                                value={formData.seoDefaults.metaTitleTemplate}
                                onChange={(e) => handleChange('seoDefaults', 'metaTitleTemplate', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                placeholder="%s | Your Site Name"
                            />
                            <p className="text-xs text-[var(--text-muted)] mt-1">Use %s as placeholder for page title</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Default Meta Description</label>
                            <textarea
                                rows={3}
                                value={formData.seoDefaults.metaDescription}
                                onChange={(e) => handleChange('seoDefaults', 'metaDescription', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Keywords</label>
                            <input
                                type="text"
                                value={formData.seoDefaults.keywords}
                                onChange={(e) => handleChange('seoDefaults', 'keywords', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                placeholder="keyword1, keyword2, keyword3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Open Graph Image URL</label>
                            <input
                                type="text"
                                value={formData.seoDefaults.ogImage}
                                onChange={(e) => handleChange('seoDefaults', 'ogImage', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                placeholder="/og-image.jpg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSettingsManager;
