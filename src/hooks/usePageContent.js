import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook for fetching page content on client-side
 * @param {string} contentId - Unique identifier for the content
 * @param {object} defaultContent - Fallback content if database fetch fails
 * @param {object} options - Options object
 * @param {boolean} options.forceDefaults - If true, skip database and use defaults
 */
export const usePageContent = (contentId, defaultContent = {}, options = {}) => {
    const { forceDefaults = false } = options;
    const [content, setContent] = useState(defaultContent);
    const [loading, setLoading] = useState(!forceDefaults);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Skip database fetch if forceDefaults is true
        if (forceDefaults) {
            setLoading(false);
            return;
        }

        const fetchContent = async () => {
            try {
                const { data, error: fetchError } = await supabase
                    .from('site_content')
                    .select('content')
                    .eq('id', contentId)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') {
                    throw fetchError;
                }

                if (data?.content) {
                    setContent(data.content);
                }
            } catch (err) {
                console.error('Error fetching content:', err);
                setError(err);
                // Keep using default content on error
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [contentId, forceDefaults]);

    return { content, loading, error };
};

/**
 * Hook for fetching multiple content items at once
 * @param {string[]} contentIds - Array of content IDs to fetch
 * @param {object} defaults - Object with default content keyed by contentId
 */
export const useMultipleContent = (contentIds, defaults = {}) => {
    const [contents, setContents] = useState(defaults);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllContent = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_content')
                    .select('id, content')
                    .in('id', contentIds);

                if (error) throw error;

                if (data) {
                    const contentMap = { ...defaults };
                    data.forEach(item => {
                        contentMap[item.id] = item.content;
                    });
                    setContents(contentMap);
                }
            } catch (err) {
                console.error('Error fetching contents:', err);
            } finally {
                setLoading(false);
            }
        };

        if (contentIds.length > 0) {
            fetchAllContent();
        }
    }, [contentIds.join(',')]);

    return { contents, loading };
};

export default usePageContent;
