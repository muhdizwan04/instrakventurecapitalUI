import React, { useState, useEffect } from 'react';
import { Save, Loader2, FileText, Plus, Trash2, Edit2 } from 'lucide-react'; // Added icons
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const NewsManager = () => {
    const defaultData = {
        hero: {
            title: 'Latest News',
            subtitle: 'Stay updated with the latest insights and announcements from Instrak Venture Capital.'
        },
        sections: [
            {
                id: 'news-feed',
                type: 'custom',
                title: 'News Feed',
                content: 'Coming Soon...'
            }
        ]
    };

    const { content, loading, saving, saveContent } = useContent('latest_news', defaultData);

    const [hero, setHero] = useState(defaultData.hero);
    const [sections, setSections] = useState(defaultData.sections);

    useEffect(() => {
        if (content && !loading) {
            if (content.hero) setHero(content.hero);
            if (content.sections) setSections(content.sections);
        }
    }, [content, loading]);

    const handleSave = async () => {
        await saveContent({ hero, sections });
        toast.success('News page updated!');
    };

    const updateSection = (index, updates) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], ...updates };
        setSections(newSections);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">News Manager</h1>
                    <p className="text-[var(--text-secondary)]">Manage the content of the Latest News page.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-save">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {/* Hero Section Editor */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <FileText size={18} className="text-[var(--accent-primary)]" />
                    Hero Section
                </h3>
                <div className="grid gap-4">
                    <div>
                        <label className="label">Page Title</label>
                        <input
                            value={hero.title}
                            onChange={(e) => setHero({ ...hero, title: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="label">Subtitle</label>
                        <input
                            value={hero.subtitle}
                            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            {/* Sections Editor */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-[var(--accent-primary)]">Page Sections</h3>
                {sections.map((section, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <h4 className="font-bold text-gray-700 capitalize">Section {index + 1}: {section.title || section.id}</h4>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="label">Section Title</label>
                                <input
                                    value={section.title || ''}
                                    onChange={(e) => updateSection(index, { title: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            {section.type === 'custom' && (
                                <div>
                                    <label className="label">Content (Markdown supported)</label>
                                    <textarea
                                        rows={8}
                                        value={section.content || ''}
                                        onChange={(e) => updateSection(index, { content: e.target.value })}
                                        className="input-field font-mono text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                    <p>More complex news article management features can be added here in the future.</p>
                </div>
            </div>
        </div>
    );
};

export default NewsManager;
