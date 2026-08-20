import React from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';

const ScrollReveal = ({ children, width = "100%", delay = 0, staggerIndex = 0 }) => {
    const reduceMotion = useReducedMotion();
    return (
        <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: reduceMotion ? 0.15 : 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + (staggerIndex * 0.1)
            }}
            variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : 38, filter: reduceMotion ? 'none' : 'blur(7px)', scale: reduceMotion ? 1 : 0.985 },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
            }}
            style={{ width }}
        >
            {children}
        </Motion.div>
    );
};

export default ScrollReveal;
