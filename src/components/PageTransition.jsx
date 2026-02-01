import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] // Gentle cubic-bezier
            }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
