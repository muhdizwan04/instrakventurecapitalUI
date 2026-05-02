import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// In-memory cache shared across all useContent instances
// Survives component unmounts but clears on full page reload
const contentCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const SAVE_TIMEOUT = 20000;

const isNetworkError = (error) => {
    if (!error) return false;
    const msg = (error.message || '').toLowerCase();
    const code = (error.code || '').toLowerCase();
    return (
        msg.includes('network') ||
        msg.includes('connection') ||
        msg.includes('failed to fetch') ||
        msg.includes('load failed') ||
        msg.includes('networkerror') ||
        msg.includes('timeout') ||
        msg.includes('aborted') ||
        code === 'network_error' ||
        code === 'fetch_error'
    );
};

const warmUp = async () => {
    try {
        await supabase.from('site_content').select('id').limit(1).maybeSingle();
    } catch (_) { /* ignore */ }
};

const retryWithBackoff = async (fn, { maxRetries = 4, baseDelay = 600, onRetry } = {}) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries || !isNetworkError(error)) throw error;
            const delay = baseDelay * Math.pow(2, attempt);
            console.warn(`[useContent] Retry ${attempt + 1}/${maxRetries} in ${delay}ms – ${error.message}`);
            onRetry?.(attempt + 1, maxRetries);
            await new Promise(r => setTimeout(r, delay));
            if (attempt >= 1) await warmUp();
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
    const [revisions, setRevisions] = useState([]);
    const [revisionsLoading, setRevisionsLoading] = useState(false);
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
            const result = await retryWithBackoff(async () => {
                const { data, error } = await supabase
                    .from('site_content')
                    .select('content')
                    .eq('id', contentId)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    if (isNetworkError(error)) throw error;
                    console.error('Error fetching content:', error);
                }
                return data;
            }, { maxRetries: 3, baseDelay: 500 });

            if (result?.content && isMountedRef.current) {
                setContent(result.content);
                contentCache.set(contentId, { data: result.content, timestamp: Date.now() });
            }
        } catch (err) {
            console.error('Error fetching content:', err);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    const saveContent = async (newContent = content, options = {}) => {
        const { silent = false, successToast = null } = options;
        
        if (saving) {
            return false;
        }

        setSaving(true);
        
        // Clear any previous timeout
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
        
        let retryToastId = null;
        try {
            await warmUp();

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
            }, {
                maxRetries: 4,
                baseDelay: 800,
                onRetry: (attempt, max) => {
                    if (!silent) {
                        retryToastId = toast.loading(`Connection issue — retrying (${attempt}/${max})...`, { id: retryToastId || undefined });
                    }
                }
            });

            if (retryToastId) toast.dismiss(retryToastId);
            
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
                if (!silent) toast.success(successToast ?? 'Changes saved successfully!');
            }
            return true;
        } catch (err) {
            if (!isMountedRef.current) return false;

            if (retryToastId) toast.dismiss(retryToastId);
            console.error('Error saving content:', err);
            if (!silent) {
                if (isNetworkError(err)) {
                    toast.error('Network connection lost after multiple retries. Please check your internet and try again.');
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

    const loadRevisions = async (limit = 30) => {
        if (forceDefaults) return;
        setRevisionsLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_content_revisions')
                .select('id, created_at, previous_updated_at')
                .eq('content_id', contentId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            if (isMountedRef.current) {
                setRevisions(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error loading content revisions:', err);
            if (isMountedRef.current) {
                setRevisions([]);
            }
            const msg = (err.message || '').toLowerCase();
            const missingTable =
                (msg.includes('relation') && msg.includes('does not exist')) ||
                (msg.includes('site_content_revisions') &&
                    (msg.includes('schema cache') || msg.includes('could not find')));
            if (missingTable) {
                toast.error('Revision history is not set up yet. Run scripts/site-content-revisions.sql in Supabase.');
            } else if (!isNetworkError(err)) {
                toast.error('Could not load version history.');
            }
        } finally {
            if (isMountedRef.current) {
                setRevisionsLoading(false);
            }
        }
    };

    const restoreRevision = async (revisionId) => {
        if (!revisionId || saving) return false;
        try {
            const { data: rev, error } = await supabase
                .from('site_content_revisions')
                .select('content_id, content')
                .eq('id', revisionId)
                .single();

            if (error) throw error;
            if (!rev || rev.content_id !== contentId) {
                toast.error('That version does not belong to this page.');
                return false;
            }
            return saveContent(rev.content, {
                successToast: 'Previous version restored and published.',
            });
        } catch (err) {
            console.error('Error restoring revision:', err);
            toast.error('Could not restore that version.');
            return false;
        }
    };

    return {
        content,
        setContent,
        updateContent,
        updateNestedContent,
        loading,
        saving,
        saveContent,
        refetch: fetchContent,
        revisions,
        revisionsLoading,
        loadRevisions,
        restoreRevision,
    };
};

export default useContent;
