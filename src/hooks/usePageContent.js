import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

function isEmptyContent(value) {
    if (value == null) return true;
    if (typeof value !== 'object') return false;
    return Object.keys(value).length === 0;
}

const forceFallbackOnly = import.meta.env.VITE_FORCE_CONTENT_FALLBACK === 'true' || import.meta.env.VITE_FORCE_CONTENT_FALLBACK === '1';

const ALL_CONTENT_KEY = ['site_content_all'];

async function fetchAllContent() {
    const t0 = performance.now();
    console.log('[Content] 🔄 fetchAllContent START');

    const { data, error } = await supabase
        .from('site_content')
        .select('id, content');

    const elapsed = Math.round(performance.now() - t0);

    if (error) {
        console.error(`[Content] ❌ fetchAllContent FAILED after ${elapsed}ms:`, error.message);
        throw error;
    }

    const map = {};
    for (const row of data || []) {
        if (row.id && !isEmptyContent(row.content)) {
            map[row.id] = row.content;
        }
    }
    console.log(`[Content] ✅ fetchAllContent OK in ${elapsed}ms — ${Object.keys(map).length} rows`);
    return map;
}

function useAllContent() {
    return useQuery({
        queryKey: ALL_CONTENT_KEY,
        queryFn: fetchAllContent,
        enabled: !forceFallbackOnly,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 60 * 24,
        refetchOnMount: false,
        refetchOnWindowFocus: true,
        retry: 2,
    });
}

/**
 * Call once near the app root to kick off the bulk fetch as early as possible
 * and keep the Supabase connection warm to avoid free-tier cold starts (~12s).
 */
export const useContentPrefetch = () => {
    const queryClient = useQueryClient();
    const started = useRef(false);
    useEffect(() => {
        if (started.current || forceFallbackOnly) return;
        started.current = true;

        queryClient.prefetchQuery({
            queryKey: ALL_CONTENT_KEY,
            queryFn: fetchAllContent,
        });

        // Keep Supabase warm: lightweight ping every 4 minutes prevents cold start
        const keepAlive = setInterval(() => {
            supabase.from('site_content').select('id', { count: 'exact', head: true }).then(() => {});
        }, 4 * 60 * 1000);

        return () => clearInterval(keepAlive);
    }, [queryClient]);
};

/**
 * Hook for fetching page content on client-side.
 * Reads from the single shared bulk query — zero individual network requests.
 */
export const usePageContent = (contentId, defaultContent = {}, options = {}) => {
    const { forceDefaults = false } = options;
    const skipDb = forceDefaults || forceFallbackOnly;

    const { data: allContent, isLoading, error } = useAllContent();

    if (skipDb) {
        return { content: defaultContent, loading: false, error: null };
    }

    const dbContent = allContent?.[contentId];
    const content = isEmptyContent(dbContent) ? defaultContent : dbContent;
    const loading = isLoading && !allContent;

    return { content, loading, error };
};

/**
 * Hook for fetching multiple content items at once.
 * Also reads from the single shared bulk query.
 */
export const useMultipleContent = (contentIds, defaults = {}) => {
    const { data: allContent, isLoading } = useAllContent();

    const contents = { ...defaults };
    if (!forceFallbackOnly && allContent) {
        for (const id of contentIds) {
            if (allContent[id] && !isEmptyContent(allContent[id])) {
                contents[id] = allContent[id];
            }
        }
    }

    return { contents, loading: !forceFallbackOnly && isLoading && !allContent };
};

export default usePageContent;
