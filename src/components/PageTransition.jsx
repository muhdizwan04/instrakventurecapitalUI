import React, { useEffect } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';

const PageTransition = ({ children }) => {
    const reduceMotion = useReducedMotion();
    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {!reduceMotion && (
                <Motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    exit={{ scaleX: 1 }}
                    transition={{ duration: 0.78, ease: [0.76, 0, 0.24, 1] }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1400,
                        pointerEvents: 'none',
                        transformOrigin: 'right center',
                        background: 'linear-gradient(105deg, #020617 0%, #071426 72%, #b8860b 100%)'
                    }}
                    aria-hidden="true"
                />
            )}
            <Motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.15 : 0.68, delay: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
            >
                {children}
            </Motion.div>
        </>
    );
};

export default PageTransition;
