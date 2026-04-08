import React, { useState, useEffect } from 'react';
import { Save, Palette, Globe, Image as ImageIcon, Settings, Loader2, Monitor, Sun, Moon, RotateCcw, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import ImageUpload from '../components/ImageUpload';
import {
    CANONICAL_GLOBAL_THEME_COLORS,
    CLIENT_BRAND_ACCENTS_BY_MODE,
    DEFAULT_CLIENT_THEME_MODE,
} from '../theme/clientThemeDefaults';

const GlobalSettingsManager = () => {
    const defaultData = {
        siteIdentity: {
            siteName: 'Instrak Venture Capital Berhad',
            tagline: 'Strategic Capital for Industrial Excellence',
            logoUrl: '/logo.png',
            faviconUrl: '/favicon.ico',
            showHeroBadge: true
        },
        themeColors: { ...CANONICAL_GLOBAL_THEME_COLORS },
        seoDefaults: {
            metaTitleTemplate: '%s | Instrak Venture Capital',
            metaDescription: 'Instrak Venture Capital Berhad - Strategic financing solutions for industrial growth in ASEAN.',
            ogImage: '/og-image.jpg',
            keywords: 'venture capital, financing, Malaysia, ASEAN, industrial, equity'
        },
    };

    const { content, loading, saving, saveContent } = useContent('global_settings', defaultData);
    const { content: themeContent, loading: themeLoading, saving: themeSaving, saveContent: saveThemeContent } = useContent('theme_settings', {
        defaultTheme: DEFAULT_CLIENT_THEME_MODE,
        accentFallbacksByMode: CLIENT_BRAND_ACCENTS_BY_MODE,
        canonicalThemeColors: CANONICAL_GLOBAL_THEME_COLORS,
    });
    const [formData, setFormData] = useState(defaultData);
    const [clientTheme, setClientTheme] = useState(DEFAULT_CLIENT_THEME_MODE);
    const [activeTab, setActiveTab] = useState('identity');

    useEffect(() => {
        if (content && !loading) {
            setFormData({ ...defaultData, ...content });
        }
    }, [content, loading]);

    useEffect(() => {
        if (themeContent && !themeLoading) {
            const v = themeContent.defaultTheme === 'light' ? 'light' : DEFAULT_CLIENT_THEME_MODE;
            setClientTheme(v);
        }
    }, [themeContent, themeLoading]);

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleSave = async () => {
        await saveContent(formData);
    };

    const handleSaveTheme = async (themeValue) => {
        const nextTheme = themeValue === 'light' ? 'light' : DEFAULT_CLIENT_THEME_MODE;
        setClientTheme(nextTheme);
        await saveThemeContent({
            ...(themeContent && typeof themeContent === 'object' ? themeContent : {}),
            defaultTheme: nextTheme,
            accentFallbacksByMode: CLIENT_BRAND_ACCENTS_BY_MODE,
            canonicalThemeColors: CANONICAL_GLOBAL_THEME_COLORS,
        });
    };

    const handleResetTheme = async () => {
        setClientTheme(DEFAULT_CLIENT_THEME_MODE);
        await saveThemeContent({
            ...(themeContent && typeof themeContent === 'object' ? themeContent : {}),
            defaultTheme: DEFAULT_CLIENT_THEME_MODE,
            accentFallbacksByMode: CLIENT_BRAND_ACCENTS_BY_MODE,
            canonicalThemeColors: CANONICAL_GLOBAL_THEME_COLORS,
        });
        toast.success('Client default set to Dark mode (default)');
    };

    const handleRestoreBrandColors = async () => {
        setFormData((prev) => ({
            ...prev,
            themeColors: { ...CANONICAL_GLOBAL_THEME_COLORS },
        }));
        await saveContent({
            ...formData,
            themeColors: { ...CANONICAL_GLOBAL_THEME_COLORS },
        });
        toast.success('Brand colours restored to built-in defaults (also saved)');
    };

    const tabs = [
        { id: 'identity', label: 'Site Identity', icon: Globe },
        { id: 'theme', label: 'Theme Colors', icon: Palette },
        { id: 'seo', label: 'SEO Defaults', icon: Settings },
        { id: 'clientTheme', label: 'Dark / Light (client)', icon: Monitor },
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
                    className="btn-save"
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
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === tab.id
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

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Site Logo</label>
                            <ImageUpload
                                value={formData.siteIdentity.logoUrl}
                                onChange={(val) => handleChange('siteIdentity', 'logoUrl', val)}
                                aspectRatio="16/9"
                                className="w-full"
                            />
                            <p className="text-[10px] text-[var(--text-muted)]">Upload a transparent PNG for best results.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Favicon (32x32)</label>
                            <ImageUpload
                                value={formData.siteIdentity.faviconUrl}
                                onChange={(val) => handleChange('siteIdentity', 'faviconUrl', val)}
                                aspectRatio="1/1"
                                className="w-32"
                            />
                            <p className="text-[10px] text-[var(--text-muted)]">Appears in browser tabs.</p>
                        </div>

                    </div>
                </div>
            )}

            {/* Theme Colors Tab */}
            {activeTab === 'theme' && (
                <div className="glass-card p-8 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                            <h3 className="font-bold text-[var(--accent-primary)] mb-1 text-lg">Theme Colours</h3>
                            <p className="text-sm text-[var(--text-muted)]">Applies to the public site. Missing values fall back to built-in Day/Night palettes (see code: <code className="text-xs">src/theme/clientThemeDefaults.js</code>).</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRestoreBrandColors}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-light)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] shrink-0"
                        >
                            <Sparkles size={16} />
                            Restore default brand colours
                        </button>
                    </div>
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

            {/* Client Theme Mode Tab */}
            {activeTab === 'clientTheme' && (
                <div className="glass-card p-8 animate-in fade-in duration-300">
                    <h3 className="font-bold text-[var(--accent-primary)] mb-2 text-lg">Client Dark / Light mode</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-8">Visitors can switch between <strong>Dark</strong> (default) and <strong>Light</strong>. Choose the default for first-time visitors. Built-in colour fallbacks are re-published to settings whenever you save a mode here.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Dark Mode Option (default) */}
                        <button
                            onClick={() => handleSaveTheme('dark')}
                            disabled={themeSaving}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                                clientTheme === 'dark'
                                    ? 'border-[var(--accent-secondary)] bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            {clientTheme === 'dark' && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--accent-secondary)] flex items-center justify-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                            )}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                                clientTheme === 'dark' ? 'bg-indigo-900/50' : 'bg-gray-100'
                            }`}>
                                <Moon size={24} className={clientTheme === 'dark' ? 'text-yellow-400' : 'text-gray-500'} />
                            </div>
                            <h4 className={`text-lg font-bold mb-1 ${clientTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Default (Dark Mode)
                            </h4>
                            <p className={`text-sm ${clientTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                The standard dark theme used across the site. Custom colours from Global Settings apply.
                            </p>
                            <div className={`mt-4 flex gap-2`}>
                                <div className="w-6 h-6 rounded-full border border-gray-600" style={{ background: '#040711' }} title="Background" />
                                <div className="w-6 h-6 rounded-full border border-gray-600" style={{ background: '#fbbf24' }} title="Accent Gold" />
                                <div className="w-6 h-6 rounded-full border border-gray-600" style={{ background: '#e5e7eb' }} title="Text" />
                                <div className="w-6 h-6 rounded-full border border-gray-600" style={{ background: '#0b1120' }} title="Secondary" />
                            </div>
                        </button>

                        {/* Light Mode Option */}
                        <button
                            onClick={() => handleSaveTheme('light')}
                            disabled={themeSaving}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                                clientTheme === 'light'
                                    ? 'border-[var(--accent-primary)] bg-white shadow-lg'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            {clientTheme === 'light' && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                            )}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                                clientTheme === 'light' ? 'bg-amber-50' : 'bg-gray-100'
                            }`}>
                                <Sun size={24} className={clientTheme === 'light' ? 'text-amber-500' : 'text-gray-500'} />
                            </div>
                            <h4 className="text-lg font-bold mb-1 text-gray-900">
                                Light Mode
                            </h4>
                            <p className="text-sm text-gray-500">
                                Clean, bright design with a refined light palette and strong readability.
                            </p>
                            <div className={`mt-4 flex gap-2`}>
                                <div className="w-6 h-6 rounded-full border border-gray-200" style={{ background: '#FFFFFF' }} title="Background" />
                                <div className="w-6 h-6 rounded-full border border-gray-200" style={{ background: '#B8860B' }} title="Accent Gold" />
                                <div className="w-6 h-6 rounded-full border border-gray-200" style={{ background: '#1E293B' }} title="Text" />
                                <div className="w-6 h-6 rounded-full border border-gray-200" style={{ background: '#F8FAFC' }} title="Secondary" />
                            </div>
                        </button>
                    </div>

                    {/* Reset to Default Button */}
                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-[var(--text-primary)] text-sm">Reset to Default</h4>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Restore the client website default to Dark mode.</p>
                            </div>
                            <button
                                onClick={handleResetTheme}
                                disabled={themeSaving || clientTheme === DEFAULT_CLIENT_THEME_MODE}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RotateCcw size={16} />
                                Reset to Default
                            </button>
                        </div>
                    </div>

                    {themeSaving && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--accent-primary)]">
                            <Loader2 size={16} className="animate-spin" />
                            Saving theme setting...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSettingsManager;
