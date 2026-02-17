import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// In-memory cache shared across all useContent instances
// Survives component unmounts but clears on full page reload
const contentCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for managing page content in admin panel
 * @param {string} contentId - Unique identifier for the content (e.g., 'home_hero', 'footer')
 * @param {object} defaultContent - Default content to use if none exists in database
 * @param {object} options - Options object
 * @param {boolean} options.forceDefaults - If true, skip database fetch and use defaults
 */
export const useContent = (contentId, defaultContent = {}, options = {}) => {
    const { forceDefaults = false } = options;

    // Check cache first for instant load
    const cached = contentCache.get(contentId);
    const hasFreshCache = cached && (Date.now() - cached.timestamp < CACHE_TTL);

    const [content, setContent] = useState(hasFreshCache ? cached.data : defaultContent);
    const [loading, setLoading] = useState(!forceDefaults && !hasFreshCache);
    const [saving, setSaving] = useState(false);
    const fetchedRef = useRef(false);

    useEffect(() => {
        fetchedRef.current = false;
    }, [contentId]);

    useEffect(() => {
        if (forceDefaults || fetchedRef.current) return;
        fetchedRef.current = true;

        // If we have fresh cache, skip the network call entirely
        if (hasFreshCache) {
            setContent(cached.data);
            setLoading(false);
            return;
        }

        fetchContent();
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
                // Update cache
                contentCache.set(contentId, { data: data.content, timestamp: Date.now() });
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveContent = async (newContent = content, options = {}) => {
        const { silent = false } = options;
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
            // Update cache immediately after save
            contentCache.set(contentId, { data: newContent, timestamp: Date.now() });
            if (!silent) toast.success('Changes saved successfully!');
            return true;
        } catch (err) {
            console.error('Error saving content:', err);
            if (!silent) toast.error('Failed to save changes');
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
