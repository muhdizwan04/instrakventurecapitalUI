import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import styles from './PageHero.module.css';
import { useTheme } from '../context/ThemeContext';
import { isDarkInlineBackground, isLightHexColor } from '../theme/clientThemeDefaults';
import { lightBandAt } from '../theme/lightBands';
import dubaiSkyline from '../assets/dubai-skyline-robert-bock.jpg';

const PageHero = ({ title, subtitle, className, style, textColor, sectionStyles = {}, buttonLabel, buttonLink, lightBandIndex }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const s = sectionStyles;
    const resolvedAlign = s.subtitleAlign || s.textAlign || 'center';

    const titleColorResolved = (() => {
        if (!isLight) return s.titleColor || textColor || '#F8FAFC';
        if (s.titleColor && !isLightHexColor(s.titleColor)) return s.titleColor;
        if (textColor && !isLightHexColor(textColor)) return textColor;
        return '#1A365D';
    })();
    const subtitleColorResolved = (() => {
        if (!isLight) return s.subtitleColor || textColor || '#CBD5E1';
        const sub = s.subtitleColor || textColor;
        if (sub && !isLightHexColor(sub)) return sub;
        return '#475569';
    })();

    const titleStyle = {
        color: titleColorResolved,
        fontWeight: s.titleFontWeight || 800,
        fontStyle: s.titleFontStyle || 'normal',
        textDecoration: s.titleTextDecoration || 'none',
        fontSize: s.titleFontSize || undefined,
        fontFamily: s.titleFontFamily || undefined,
        textAlign: s.titleAlign || s.textAlign || 'center'
    };
    const subtitleStyle = {
        color: subtitleColorResolved,
        fontSize: s.subtitleFontSize || undefined,
        fontFamily: s.subtitleFontFamily || undefined,
        whiteSpace: 'pre-line',
        lineHeight: 1.7
    };

    if (resolvedAlign === 'left') {
        subtitleStyle.textAlign = 'left';
        subtitleStyle.width = '100%';
        subtitleStyle.maxWidth = '100%';
        subtitleStyle.margin = '0';
    } else if (resolvedAlign === 'right') {
        subtitleStyle.textAlign = 'right';
        subtitleStyle.width = '100%';
        subtitleStyle.maxWidth = '100%';
        subtitleStyle.margin = '0';
    } else {
        // Center: text block is centered, lines start from middle, wrap and restart from middle
        subtitleStyle.textAlign = 'center';
        subtitleStyle.width = '100%';
        subtitleStyle.maxWidth = '760px';
        subtitleStyle.margin = '0 auto';
    }
    const buttonStyle = buttonLabel ? {
        fontFamily: s.buttonFontFamily || undefined,
        fontSize: s.buttonFontSize || undefined,
        fontWeight: s.buttonFontWeight || '600',
        color: s.buttonColor || '#FFFFFF',
        background: s.buttonBgColor || '#1A365D'
    } : null;

    const useLightBand =
        isLight &&
        typeof lightBandIndex === 'number' &&
        Number.isFinite(lightBandIndex);
    const lightBandClass = useLightBand ? `lm-band-${lightBandAt(lightBandIndex)}` : '';

    let heroSurfaceStyle = isLight && isDarkInlineBackground(style)
        ? { ...style, background: undefined, backgroundImage: undefined, backgroundColor: '#f8fafc' }
        : style;
    if (useLightBand) {
        heroSurfaceStyle = {
            ...heroSurfaceStyle,
            background: undefined,
            backgroundImage: undefined,
            backgroundColor: undefined
        };
    }

    return (
        <section className={`${styles.pageHero} ${className || ''} ${lightBandClass}`.trim()} style={heroSurfaceStyle}>
            <Motion.div
                className={styles.architectureBackdrop}
                style={{ backgroundImage: `url("${dubaiSkyline}")` }}
                initial={{ scale: 1.08, x: 18, opacity: 0 }}
                animate={{ scale: 1.02, x: 0, opacity: 1 }}
                transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
            />
            <Motion.div
                className={styles.architectureSlice}
                style={{ backgroundImage: `url("${dubaiSkyline}")` }}
                initial={{ x: 34, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
            />
            <div className={`container ${styles.container}`} style={{ textAlign: s.titleAlign || s.textAlign || 'center' }}>
                <Motion.h1
                    style={titleStyle}
                    initial={{ opacity: 0, y: 24, filter: 'blur(7px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >{title}</Motion.h1>
                {subtitle && (
                    <Motion.p
                        style={subtitleStyle}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >{subtitle}</Motion.p>
                )}
                {buttonLabel && (buttonLink ? (
                    <Motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                        <Link to={buttonLink} className={styles.heroButton} style={buttonStyle}>{buttonLabel}</Link>
                    </Motion.div>
                ) : (
                    <span className={styles.heroButton} style={buttonStyle}>{buttonLabel}</span>
                ))}
            </div>
            <div className={styles.overlay}></div>
        </section>
    );
};

export default PageHero;
