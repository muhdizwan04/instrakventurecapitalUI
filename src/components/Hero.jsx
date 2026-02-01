import React, { useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { motion, useScroll, useTransform } from 'framer-motion';
import klSkyline from '../assets/kl-skyline.png';



const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Default content - used while loading and as fallback
    const defaultContent = {
        heroTitle: 'Your Venture\nCapital Partner',
        heroSubtitle: 'Governance • Transparency • Integrity',
        heroDescription: 'Providing foundational governance and integrity essential for scaling visionary industrial leaders across the ASEAN region.',
        buttons: [
            { id: 1, text: 'Register as Investor', link: '/register', variant: 'solid' },
            { id: 2, text: 'Potential Project Listing', link: '/project-listings', variant: 'outline' }
        ]
    };

    const { content } = usePageContent('home', defaultContent);
    const { content: settings } = usePageContent('global_settings');

    // Parse title to split into two lines
    const titleString = content.heroTitle !== undefined ? content.heroTitle : defaultContent.heroTitle;
    const titleParts = titleString.split('\n');
    const titleLine1 = titleParts[0];
    const titleLine2 = titleParts[1];

    // Parse subtitle to extract keywords
    const subtitleParts = (content.heroSubtitle !== undefined ? content.heroSubtitle : defaultContent.heroSubtitle).split('•').map(s => s.trim());

    const buttons = content.buttons || defaultContent.buttons;

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 30 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
        }
    };

    return (
        <section id="home" className={styles.hero} ref={ref}>


            {/* Content Layer - Positioned above 3D */}
            <motion.div 
                className={`container ${styles.container}`}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
            >

                <h1 className={styles.title}>
                    <motion.span className="block" variants={itemVariant}>
                        {titleLine1}
                    </motion.span>
                    {titleLine2 && (
                        <motion.span className="block" variants={itemVariant}>
                            <span className={styles.highlight}>{titleLine2}</span>
                        </motion.span>
                    )}
                </h1>
                
                <motion.p className={styles.subtitle} variants={itemVariant}>
                    {subtitleParts.map((part, i) => (
                        <React.Fragment key={i}>
                            <strong>{part}</strong>
                            {i < subtitleParts.length - 1 && ' • '}
                        </React.Fragment>
                    ))}
                </motion.p>
                
                <motion.p className={styles.description} variants={itemVariant}>
                    {content.heroDescription || defaultContent.heroDescription}
                </motion.p>
                
                <motion.div className={styles.cta} variants={itemVariant}>
                    {buttons.map(btn => (
                        <Link
                            key={btn.id}
                            to={btn.link}
                            className={btn.variant === 'solid' ? 'btn-solid' : 'btn-outline-gold'}
                        >
                            {btn.text}
                        </Link>
                    ))}
                </motion.div>
            </motion.div>

            {/* Background with KL Skyline */}
            <motion.div className={styles.background} style={{ y, opacity }}>
                <img src={klSkyline} alt="Kuala Lumpur Skyline" className={styles.bgImage} />
                <div className={styles.overlay}></div>
                <div className={styles.gradientOverlay}></div>
            </motion.div>
        </section>
    );
};

export default Hero;
