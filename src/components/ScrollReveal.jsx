import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({ children, width = "100%", delay = 0, staggerIndex = 0 }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1.0], // "Calm/Expensive" easing (similar to easeOutSine but smoother)
                delay: delay + (staggerIndex * 0.1)
            }}
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
            }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
