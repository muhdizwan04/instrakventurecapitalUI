import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

/**
 * Hook for managing page content in admin panel
 * @param {string} contentId - Unique identifier for the content (e.g., 'home_hero', 'footer')
 * @param {object} defaultContent - Default content to use if none exists in database
 * @param {object} options - Options object
 * @param {boolean} options.forceDefaults - If true, skip database fetch and use defaults
 */
export const useContent = (contentId, defaultContent = {}, options = {}) => {
    const { forceDefaults = false } = options;
    const [content, setContent] = useState(defaultContent);
    const [loading, setLoading] = useState(!forceDefaults);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!forceDefaults) {
            fetchContent();
        }
    }, [contentId, forceDefaults]);

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('content')
                .eq('id', contentId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching content:', error);
            }

            if (data?.content) {
                setContent(data.content);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveContent = async (newContent = content) => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('site_content')
                .upsert({
                    id: contentId,
                    content: newContent,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            setContent(newContent);
            toast.success('Changes saved successfully!');
            return true;
        } catch (err) {
            console.error('Error saving content:', err);
            toast.error('Failed to save changes');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const updateContent = (updates) => {
        setContent(prev => ({ ...prev, ...updates }));
    };

    const updateNestedContent = (key, value) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    return {
        content,
        setContent,
        updateContent,
        updateNestedContent,
        loading,
        saving,
        saveContent,
        refetch: fetchContent
    };
};

export default useContent;
