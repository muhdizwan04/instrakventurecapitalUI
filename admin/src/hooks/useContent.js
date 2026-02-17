import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// In-memory cache shared across all useContent instances
// Survives component unmounts but clears on full page reload
const contentCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Save operation timeout (15 seconds)
const SAVE_TIMEOUT = 15000;

// Helper to check if error is a network error
const isNetworkError = (error) => {
    if (!error) return false;
    const message = error.message?.toLowerCase() || '';
    const code = error.code?.toLowerCase() || '';
    return (
        message.includes('network') ||
        message.includes('connection') ||
        message.includes('failed to fetch') ||
        message.includes('load failed') ||
        code === 'network_error' ||
        code === 'fetch_error'
    );
};

// Retry helper with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 500) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isLastAttempt = attempt === maxRetries;
            const isNetwork = isNetworkError(error);
            
            // Only retry network errors
            if (!isNetwork || isLastAttempt) {
                throw error;
            }
            
            // Exponential backoff: 500ms, 1000ms, 2000ms
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`[Content] Network error, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

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
    const isMountedRef = useRef(true);
    const timeoutIdRef = useRef(null);

    // Track mount status and reset state on unmount or contentId change
    useEffect(() => {
        isMountedRef.current = true;
        setSaving(false);
        
        return () => {
            isMountedRef.current = false;
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }
            setSaving(false);
        };
    }, [contentId]);

    useEffect(() => {
        fetchedRef.current = false;
    }, [contentId]);

    useEffect(() => {
        if (forceDefaults || fetchedRef.current) return;
        fetchedRef.current = true;

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

            if (data?.content && isMountedRef.current) {
                setContent(data.content);
                contentCache.set(contentId, { data: data.content, timestamp: Date.now() });
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    const saveContent = async (newContent = content, options = {}) => {
        const { silent = false } = options;
        
        if (saving) {
            return false;
        }

        setSaving(true);
        
        // Clear any previous timeout
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
        
        try {
            // DO NOT call supabase.auth.getSession() here!
            // It causes a deadlock when onAuthStateChange is processing checkAdminStatus.
            // The Supabase client automatically includes auth headers in every request.

            // Wrap save operation with retry logic for network errors
            const result = await retryWithBackoff(async () => {
                const savePromise = supabase
                    .from('site_content')
                    .upsert({
                        id: contentId,
                        content: newContent,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'id'
                    })
                    .select();

                const timeoutPromise = new Promise((_, reject) => {
                    timeoutIdRef.current = setTimeout(() => {
                        reject(new Error('Save operation timed out'));
                    }, SAVE_TIMEOUT);
                });

                return await Promise.race([savePromise, timeoutPromise]);
            });
            
            // Clear timeout on success
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }

            if (!isMountedRef.current) return false;

            const { data, error } = result;

            if (error) throw error;

            if (isMountedRef.current) {
                setContent(newContent);
                contentCache.set(contentId, { data: newContent, timestamp: Date.now() });
                if (!silent) toast.success('Changes saved successfully!');
            }
            return true;
        } catch (err) {
            if (!isMountedRef.current) return false;

            console.error('Error saving content:', err);
            if (!silent) {
                if (isNetworkError(err)) {
                    toast.error('Network connection lost. Please check your internet and try again.');
                } else if (err.message?.includes('timed out')) {
                    toast.error('Save timed out. Please check your connection and try again.');
                } else {
                    toast.error('Failed to save changes. Please try again.');
                }
            }
            return false;
        } finally {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }
            if (isMountedRef.current) {
                setSaving(false);
            }
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
