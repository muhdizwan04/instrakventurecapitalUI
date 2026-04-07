import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PageHero.module.css';
import { useTheme } from '../context/ThemeContext';
import { isDarkInlineBackground, isLightHexColor } from '../theme/clientThemeDefaults';
import { lightBandAt } from '../theme/lightBands';

const PageHero = ({ title, subtitle, className, style, textColor, sectionStyles = {}, buttonLabel, buttonLink, lightBandIndex }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const s = sectionStyles;
    const resolvedAlign = s.subtitleAlign || s.textAlign || 'center';

    const titleColorResolved = (() => {
        if (!isLight) return s.titleColor || textColor || '#1A365D';
        if (s.titleColor && !isLightHexColor(s.titleColor)) return s.titleColor;
        if (textColor && !isLightHexColor(textColor)) return textColor;
        return '#1A365D';
    })();
    const subtitleColorResolved = (() => {
        if (!isLight) return s.subtitleColor || textColor || undefined;
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
            <div className={`container ${styles.container}`} style={{ textAlign: s.titleAlign || s.textAlign || 'center' }}>
                <h1 style={titleStyle}>{title}</h1>
                {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
                {buttonLabel && (buttonLink ? (
                    <Link to={buttonLink} className={styles.heroButton} style={buttonStyle}>{buttonLabel}</Link>
                ) : (
                    <span className={styles.heroButton} style={buttonStyle}>{buttonLabel}</span>
                ))}
            </div>
            <div className={styles.overlay}></div>
        </section>
    );
};

export default PageHero;

