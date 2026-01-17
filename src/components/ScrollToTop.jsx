import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // Determine scroll behavior based on hash presence
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Fallback if element not found immediately (e.g. async content)
                const timer = setTimeout(() => {
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                return () => clearTimeout(timer);
            }
        } else {
            // No hash, standard scroll to top
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
