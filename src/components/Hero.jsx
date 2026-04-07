import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { motion, useScroll, useTransform } from 'framer-motion';
import { isLikelyLightTextColor } from '../theme/clientThemeDefaults';

// Hero background – external placeholder image for investment skyline.
// You can replace this URL with any image or a local import later.
const nightSkyline =
    'https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=1600';

const Hero = ({ showLightSectionEdge }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Default hero blocks
    const defaultBlocks = [
        {
            id: 'hb-1',
            type: 'title',
            content: 'Engineering Capital\nfor Global Growth',
            color: '#f9fafb',
            highlightColor: '#facc15'
        },
        {
            id: 'hb-2',
            type: 'subtitle',
            content: 'Governance • Transparency • AI-Driven Intelligence',
            color: '#fde68a'
        },
        {
            id: 'hb-3',
            type: 'text',
            content: 'Instrak Venture Capital (IVC) structures institutional-grade capital across Asia and the Middle East, combining disciplined governance with AI-driven investment intelligence.',
            color: '#9ca3af'
        },
        {
            id: 'hb-4',
            type: 'buttons',
            buttons: [
                { id: 1, text: 'Start AI Capital Assessment', link: '/ai-capital-assessment', variant: 'solid' },
                { id: 2, text: 'Speak With An Advisor', link: '/contact', variant: 'outline' }
            ],
            solidStyle: 'solid', // 'solid' | 'gradient'
            solidBg: '#facc15',
            solidBgTo: '#B8860B',
            solidTextColor: '#0b1120',
            outlineColor: '#fde68a',
            outlineTextColor: '#fde68a'
        }
    ];

    const defaultContent = {
        heroBlocks: defaultBlocks,
        heroBackgroundImage: '',
        heroBgOpacity: 0.85,
        heroOverlayOpacity: 0.9
    };

    const { content } = usePageContent('home', defaultContent);

    // ── Resolve blocks (new block-based or legacy flat fields) ──
    let heroBlocks;
    if (content.heroBlocks && content.heroBlocks.length > 0) {
        heroBlocks = content.heroBlocks;
    } else if (content.heroTitle !== undefined) {
        // Legacy support: convert old flat fields into blocks
        heroBlocks = [
            { id: 'legacy-title', type: 'title', content: content.heroTitle || defaultBlocks[0].content, color: content.heroTitleColor || '#f9fafb', highlightColor: content.heroHighlightColor || '#facc15' },
            { id: 'legacy-subtitle', type: 'subtitle', content: content.heroSubtitle || defaultBlocks[1].content, color: content.heroSubtitleColor || '#fde68a' },
            { id: 'legacy-text', type: 'text', content: content.heroDescription || defaultBlocks[2].content, color: content.heroDescriptionColor || '#9ca3af' },
            {
                id: 'legacy-buttons',
                type: 'buttons',
                buttons: content.buttons || defaultBlocks[3].buttons,
                solidStyle: content.heroBtnSolidStyle || defaultBlocks[3].solidStyle || 'solid',
                solidBg: content.heroBtnSolidBg || defaultBlocks[3].solidBg || '#facc15',
                solidBgTo: content.heroBtnSolidBgTo || defaultBlocks[3].solidBgTo || '#B8860B',
                solidTextColor: content.heroBtnSolidTextColor || defaultBlocks[3].solidTextColor || '#0b1120',
                outlineColor: content.heroBtnOutlineColor || defaultBlocks[3].outlineColor || '#fde68a',
                outlineTextColor: content.heroBtnOutlineTextColor || defaultBlocks[3].outlineTextColor || '#fde68a'
            }
        ];
    } else {
        heroBlocks = defaultBlocks;
    }

    // ── Background settings ──
    const bgImage = content.heroBackgroundImage || nightSkyline;
    const bgOpacity = content.heroBgOpacity ?? 0.85;
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

    // Map admin align (left / middle / right) to CSS textAlign
    const resolveAlign = (align) => {
        if (!align) return 'left';
        if (align === 'middle') return 'center';
        return align;
    };

    // ── Block Renderers ──
    const renderBlock = (block) => {
        switch (block.type) {
            case 'title': {
                const parts = (block.content || '').split('\n');
                const titleColor = block.color || '#f9fafb';
                const highlightColor = block.highlightColor || '#B8860B';
                return (
                    <h1 className={styles.title} style={{ color: titleColor }}>
                        <motion.span className="block" variants={itemVariant}>
                            {parts[0]}
                        </motion.span>
                        {parts[1] && (
                            <motion.span className="block" variants={itemVariant}>
                                <span className={styles.highlight} style={{ color: highlightColor }}>{parts[1]}</span>
                            </motion.span>
                        )}
                    </h1>
                );
            }

            case 'subtitle': {
                const subtitleParts = (block.content || '').split('•').map(s => s.trim());
                const subColor = block.color || '#fde68a';
                return (
                    <motion.p className={styles.subtitle} style={{ color: subColor }} variants={itemVariant}>
                        {subtitleParts.map((part, i) => (
                            <React.Fragment key={i}>
                                <strong style={{ color: subColor }}>{part}</strong>
                                {i < subtitleParts.length - 1 && ' • '}
                            </React.Fragment>
                        ))}
                    </motion.p>
                );
            }

            case 'text':
                {
                    const rawDesc = block.color || '#9ca3af';
                    /* Pure white / very light CMS colours wash out on bright areas of the photo */
                    const textColor = isLikelyLightTextColor(rawDesc) ? '#E2E8F0' : rawDesc;
                return (
                    <motion.p className={styles.description} style={{ color: textColor }} variants={itemVariant}>
                        {block.content}
                    </motion.p>
                );
                }

            case 'buttons': {
                const btns = block.buttons || [];
                return (
                    <motion.div className={styles.cta} variants={itemVariant}>
                        {btns.map(btn => {
                            const isSolid = btn.variant === 'solid';
                            const solidStyle = block.solidStyle || 'solid';
                            const solidBgFrom = block.solidBg || '#1A365D';
                            const solidBgTo = block.solidBgTo || '#0F2942';
                            const solidTextColor = block.solidTextColor || '#FFFFFF';
                            const outlineColor = block.outlineColor || '#B8860B';
                            const outlineTextColor = block.outlineTextColor || outlineColor;
                            return (
                                <Link
                                    key={btn.id}
                                    to={btn.link}
                                    className={isSolid ? 'btn-solid' : 'btn-outline-gold'}
                                    style={isSolid
                                        ? {
                                            background: solidStyle === 'gradient'
                                                ? `linear-gradient(135deg, ${solidBgFrom}, ${solidBgTo})`
                                                : solidBgFrom,
                                            borderColor: solidBgFrom,
                                            color: solidTextColor
                                        }
                                        : {
                                            background: 'rgba(15, 23, 42, 0.85)',
                                            borderColor: outlineColor,
                                            color: outlineTextColor
                                        }
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
                return <div style={{ height: block.height || 24 }} />;

            default:
                return null;
        }
    };

    return (
        <section
            id="home"
            className={[styles.hero, showLightSectionEdge ? 'lm-hero-edge' : ''].filter(Boolean).join(' ')}
            ref={ref}
        >

            {/* Content Layer */}
            <motion.div
                className={`container ${styles.container}`}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
            >
                {heroBlocks.map((block) => {
                    const align = resolveAlign(block.align);
                    const isButtons = block.type === 'buttons';
                    const gutter = '10%';
                    const wrapperStyle = {
                        width: '100%',
                        display: 'flex',
                        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
                        paddingLeft: align === 'left' ? gutter : '2rem',
                        paddingRight: align === 'right' ? gutter : '2rem',
                        boxSizing: 'border-box',
                        textAlign: align
                    };
                    return (
                        <motion.div key={block.id} variants={itemVariant} style={wrapperStyle}>
                            {renderBlock(block)}
                        </motion.div>
                    );
                })}
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
                        background: `linear-gradient(135deg,
                                rgba(2,6,23,${Math.min(1, overlayOpacity + 0.04)}) 0%,
                                rgba(2,6,23,${overlayOpacity * 0.92}) 38%,
                                rgba(15,23,42,${Math.max(overlayOpacity * 0.72, 0.58)}) 68%,
                                rgba(15,23,42,${Math.max(overlayOpacity * 0.38, 0.5)}) 100%)`
                    }}
                />
                <div className={styles.gradientOverlay}></div>
            </motion.div>
        </section>
    );
};

export default Hero;
