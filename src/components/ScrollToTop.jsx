import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    // Use layoutEffect for synchronous scroll before paint
    useLayoutEffect(() => {
        // Immediately scroll to top
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    // Also handle any delayed scroll needs
    useEffect(() => {
        // Force scroll again after a tiny delay to handle edge cases
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0 });
        }, 10);
        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
