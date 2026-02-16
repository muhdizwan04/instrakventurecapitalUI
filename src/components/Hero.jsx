import React, { useRef } from 'react';
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

    // Default hero blocks
    const defaultBlocks = [
        { id: 'hb-1', type: 'title', content: 'Your Venture\nCapital Partner', color: '#1A365D', highlightColor: '#B8860B' },
        { id: 'hb-2', type: 'subtitle', content: 'Governance • Transparency • Integrity', color: '#B8860B' },
        { id: 'hb-3', type: 'text', content: 'Providing foundational governance and integrity essential for scaling visionary industrial leaders across the ASEAN region.', color: '#4A5568' },
        {
            id: 'hb-4', type: 'buttons', buttons: [
                { id: 1, text: 'Register as Investor', link: '/investors', variant: 'solid' },
                { id: 2, text: 'Potential Project Listing', link: '/project-listings', variant: 'outline' }
            ], solidBg: '#1A365D', outlineColor: '#B8860B'
        }
    ];

    const defaultContent = {
        heroBlocks: defaultBlocks,
        heroBackgroundImage: '',
        heroBgOpacity: 0.25,
        heroOverlayOpacity: 0.92
    };

    const { content } = usePageContent('home', defaultContent);

    // ── Resolve blocks (new block-based or legacy flat fields) ──
    let heroBlocks;
    if (content.heroBlocks && content.heroBlocks.length > 0) {
        heroBlocks = content.heroBlocks;
    } else if (content.heroTitle !== undefined) {
        // Legacy support: convert old flat fields into blocks
        heroBlocks = [
            { id: 'legacy-title', type: 'title', content: content.heroTitle || defaultBlocks[0].content, color: content.heroTitleColor || '#1A365D', highlightColor: content.heroHighlightColor || '#B8860B' },
            { id: 'legacy-subtitle', type: 'subtitle', content: content.heroSubtitle || defaultBlocks[1].content, color: content.heroSubtitleColor || '#B8860B' },
            { id: 'legacy-text', type: 'text', content: content.heroDescription || defaultBlocks[2].content, color: content.heroDescriptionColor || '#4A5568' },
            { id: 'legacy-buttons', type: 'buttons', buttons: content.buttons || defaultBlocks[3].buttons, solidBg: content.heroBtnSolidBg || '#1A365D', outlineColor: content.heroBtnOutlineColor || '#B8860B' }
        ];
    } else {
        heroBlocks = defaultBlocks;
    }

    // ── Background settings ──
    const bgImage = content.heroBackgroundImage || klSkyline;
    const bgOpacity = content.heroBgOpacity ?? 0.25;
    const overlayOpacity = content.heroOverlayOpacity ?? 0.92;

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

    // ── Block Renderers ──
    const renderBlock = (block) => {
        switch (block.type) {
            case 'title': {
                const parts = (block.content || '').split('\n');
                return (
                    <h1 key={block.id} className={styles.title} style={{ color: block.color || '#1A365D' }}>
                        <motion.span className="block" variants={itemVariant}>
                            {parts[0]}
                        </motion.span>
                        {parts[1] && (
                            <motion.span className="block" variants={itemVariant}>
                                <span className={styles.highlight} style={{ color: block.highlightColor || '#B8860B' }}>{parts[1]}</span>
                            </motion.span>
                        )}
                    </h1>
                );
            }

            case 'subtitle': {
                const subtitleParts = (block.content || '').split('•').map(s => s.trim());
                return (
                    <motion.p key={block.id} className={styles.subtitle} style={{ color: block.color || '#B8860B' }} variants={itemVariant}>
                        {subtitleParts.map((part, i) => (
                            <React.Fragment key={i}>
                                <strong style={{ color: block.color || '#B8860B' }}>{part}</strong>
                                {i < subtitleParts.length - 1 && ' • '}
                            </React.Fragment>
                        ))}
                    </motion.p>
                );
            }

            case 'text':
                return (
                    <motion.p key={block.id} className={styles.description} style={{ color: block.color || '#4A5568' }} variants={itemVariant}>
                        {block.content}
                    </motion.p>
                );

            case 'buttons': {
                const btns = block.buttons || [];
                return (
                    <motion.div key={block.id} className={styles.cta} variants={itemVariant}>
                        {btns.map(btn => {
                            const isSolid = btn.variant === 'solid';
                            return (
                                <Link
                                    key={btn.id}
                                    to={btn.link}
                                    className={isSolid ? 'btn-solid' : 'btn-outline-gold'}
                                    style={isSolid
                                        ? { backgroundColor: block.solidBg || '#1A365D', borderColor: block.solidBg || '#1A365D' }
                                        : { borderColor: block.outlineColor || '#B8860B', color: block.outlineColor || '#B8860B' }
                                    }
                                >
                                    {btn.text}
                                </Link>
                            );
                        })}
                    </motion.div>
                );
            }

            case 'spacer':
                return <div key={block.id} style={{ height: block.height || 24 }} />;

            default:
                return null;
        }
    };

    return (
        <section id="home" className={styles.hero} ref={ref}>

            {/* Content Layer */}
            <motion.div
                className={`container ${styles.container}`}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
            >
                {heroBlocks.map(renderBlock)}
            </motion.div>

            {/* Background with KL Skyline */}
            <motion.div className={styles.background} style={{ y, opacity }}>
                <img
                    src={bgImage}
                    alt="Hero Background"
                    className={styles.bgImage}
                    style={{ opacity: bgOpacity }}
                />
                <div
                    className={styles.overlay}
                    style={{
                        background: `linear-gradient(135deg, rgba(255,255,255,${overlayOpacity}) 0%, rgba(255,255,255,${overlayOpacity * 0.92}) 40%, rgba(255,255,255,${overlayOpacity * 0.65}) 70%, rgba(255,255,255,${overlayOpacity * 0.33}) 100%)`
                    }}
                />
                <div className={styles.gradientOverlay}></div>
            </motion.div>
        </section>
    );
};

export default Hero;
