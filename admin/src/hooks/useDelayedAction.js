import { useState, useRef, useCallback } from 'react';

/**
 * Hook to manage async actions with a delayed loading state.
 * @param {number} delay - Delay in ms before showing the loading indicator (default 500ms)
 */
export const useDelayedAction = (delay = 1000) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLongLoading, setIsLongLoading] = useState(false);
    const timeoutRef = useRef(null);

    const execute = useCallback(async (action) => {
        setIsLoading(true);
        
        // Start the timer to show the loading screen if it takes too long
        timeoutRef.current = setTimeout(() => {
            setIsLongLoading(true);
        }, delay);

        try {
            const result = await action();
            return result;
        } finally {
            // Clear timer and reset states
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            setIsLoading(false);
            setIsLongLoading(false);
        }
    }, [delay]);

    return { execute, isLoading, isLongLoading };
};
