import { useQuery, useQueries } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Hook for fetching page content on client-side
 * @param {string} contentId - Unique identifier for the content
 * @param {object} defaultContent - Fallback content if database fetch fails or while loading
 * @param {object} options - Options object
 * @param {boolean} options.forceDefaults - If true, skip database and use defaults
 */
export const usePageContent = (contentId, defaultContent = {}, options = {}) => {
    const { forceDefaults = false } = options;

    const { data: content, isLoading: loading, error } = useQuery({
        queryKey: ['site_content', contentId],
        queryFn: async () => {
            const { data, error: fetchError } = await supabase
                .from('site_content')
                .select('content')
                .eq('id', contentId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            return data?.content || defaultContent;
        },
        enabled: !forceDefaults,
        placeholderData: defaultContent, // Show default content immediately while background fetching
        staleTime: 0, // Disable cache for immediate updates
        refetchOnWindowFocus: true
    });

    // If forceDefaults is true, we just return the default content and not loading
    const finalContent = forceDefaults ? defaultContent : (content || defaultContent);
    const finalLoading = forceDefaults ? false : loading;

    return { content: finalContent, loading: finalLoading, error };
};

/**
 * Hook for fetching multiple content items at once
 * @param {string[]} contentIds - Array of content IDs to fetch
 * @param {object} defaults - Object with default content keyed by contentId
 */
export const useMultipleContent = (contentIds, defaults = {}) => {
    // using useQueries for parallel fetching with individual caching
    const queries = useQueries({
        queries: contentIds.map(id => ({
            queryKey: ['site_content', id],
            queryFn: async () => {
                const { data, error } = await supabase
                    .from('site_content')
                    .select('content')
                    .eq('id', id)
                    .single();
                
                if (error && error.code !== 'PGRST116') throw error;
                return { id, content: data?.content || defaults[id] };
            },
            staleTime: 0,
        }))
    });

    const isLoading = queries.some(query => query.isLoading);
    
    // Construct the result object
    const contents = { ...defaults };
    queries.forEach((query, index) => {
        const id = contentIds[index];
        if (query.data?.content) {
            contents[id] = query.data.content;
        }
    });

    return { contents, loading: isLoading };
};

export default usePageContent;
