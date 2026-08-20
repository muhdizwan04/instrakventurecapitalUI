import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import { usePageContent } from '../hooks/usePageContent';
import {
    motion as Motion,
    useScroll,
    useTransform
} from 'framer-motion';
import { isLikelyLightTextColor } from '../theme/clientThemeDefaults';
import dubaiBlueHour from '../assets/dubai-blue-hour-hero-v2.webp';

const nightSkyline = dubaiBlueHour;

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
        heroUseCustomBackground: false,
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
    const usesCustomBackground = Boolean(content.heroUseCustomBackground && content.heroBackgroundImage);
    const bgImage = usesCustomBackground ? content.heroBackgroundImage : nightSkyline;
    const bgOpacity = usesCustomBackground ? (content.heroBgOpacity ?? 0.85) : 1;
    const overlayOpacity = usesCustomBackground ? (content.heroOverlayOpacity ?? 0.92) : 0.66;

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
                const titleColor = block.color || '#f9fafb';
                const highlightColor = block.highlightColor || '#B8860B';
                return (
                    <h1 className={styles.title} style={{ color: titleColor }}>
                        <Motion.span className="block" variants={itemVariant}>
                            {parts[0]}
                        </Motion.span>
                        {parts[1] && (
                            <Motion.span className="block" variants={itemVariant}>
                                <span className={styles.highlight} style={{ color: highlightColor }}>{parts[1]}</span>
                            </Motion.span>
                        )}
                    </h1>
                );
            }

            case 'subtitle': {
                const subtitleParts = (block.content || '').split('•').map(s => s.trim());
                const subColor = block.color || '#fde68a';
                return (
                    <Motion.p className={styles.subtitle} style={{ color: subColor }} variants={itemVariant}>
                        {subtitleParts.map((part, i) => (
                            <React.Fragment key={i}>
                                <strong style={{ color: subColor }}>{part}</strong>
                                {i < subtitleParts.length - 1 && ' • '}
                            </React.Fragment>
                        ))}
                    </Motion.p>
                );
            }

            case 'text':
                {
                    const rawDesc = block.color || '#9ca3af';
                    /* Pure white / very light CMS colours wash out on bright areas of the photo */
                    const textColor = isLikelyLightTextColor(rawDesc) ? '#E2E8F0' : rawDesc;
                return (
                    <Motion.p className={styles.description} style={{ color: textColor }} variants={itemVariant}>
                        {block.content}
                    </Motion.p>
                );
                }

            case 'buttons': {
                const btns = block.buttons || [];
                return (
                    <Motion.div className={styles.cta} variants={itemVariant}>
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
                    </Motion.div>
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
            <Motion.div
                className={`container ${styles.container}`}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
            >
                {heroBlocks.map((block) => {
                    // The approved redesign fixes the hero composition to the left.
                    // CMS order/content remains intact; per-block alignment is retained in data for other editors.
                    const align = 'left';
                    const gutter = '5.75%';
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
                        <Motion.div key={block.id} variants={itemVariant} style={wrapperStyle}>
                            {renderBlock(block)}
                        </Motion.div>
                    );
                })}
            </Motion.div>

            {/* Dubai architecture interaction layer */}
            <Motion.div className={styles.background} style={{ y, opacity }} aria-hidden="true">
                <div className={styles.imageStage}>
                    <img
                        src={bgImage}
                        alt=""
                        className={styles.bgImage}
                        style={{ opacity: bgOpacity }}
                    />
                    <div
                        className={`${styles.imageSlice} ${styles.sliceOne}`}
                        style={{ backgroundImage: `url("${bgImage}")` }}
                    />
                    <div
                        className={`${styles.imageSlice} ${styles.sliceTwo}`}
                        style={{ backgroundImage: `url("${bgImage}")` }}
                    />
                    <div
                        className={`${styles.imageSlice} ${styles.sliceThree}`}
                        style={{ backgroundImage: `url("${bgImage}")` }}
                    />
                </div>
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
            </Motion.div>

            <div className={styles.locationMark} aria-hidden="true">
                <span>Dubai, UAE</span>
                <span className={styles.locationPin}>◇</span>
                <span className={styles.locationLine} />
            </div>

            <div className={styles.chapterRail} aria-hidden="true">
                <span className={styles.activeChapter}>01</span>
                <span className={styles.chapterLine}><i /></span>
                <span>02</span>
                <span>03</span>
            </div>

            <div className={styles.scrollCue} aria-hidden="true">
                <span>Scroll to explore</span>
                <span className={styles.scrollTrack}><span /></span>
            </div>
        </section>
    );
};

export default Hero;
