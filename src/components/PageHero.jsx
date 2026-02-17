import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PageHero.module.css';

const PageHero = ({ title, subtitle, className, style, textColor, sectionStyles = {}, buttonLabel, buttonLink }) => {
    const s = sectionStyles;
    const titleStyle = {
        color: s.titleColor || textColor || '#1A365D',
        fontWeight: s.titleFontWeight || 800,
        fontStyle: s.titleFontStyle || 'normal',
        textDecoration: s.titleTextDecoration || 'none',
        fontSize: s.titleFontSize || undefined,
        fontFamily: s.titleFontFamily || undefined,
        textAlign: s.titleAlign || s.textAlign || 'center'
    };
    const subtitleStyle = {
        color: s.subtitleColor || textColor || undefined,
        fontSize: s.subtitleFontSize || undefined,
        fontFamily: s.subtitleFontFamily || undefined,
        textAlign: s.subtitleAlign || s.textAlign || 'center',
        whiteSpace: 'pre-line'
    };
    const buttonStyle = buttonLabel ? {
        fontFamily: s.buttonFontFamily || undefined,
        fontSize: s.buttonFontSize || undefined,
        fontWeight: s.buttonFontWeight || '600',
        color: s.buttonColor || '#FFFFFF',
        background: s.buttonBgColor || '#1A365D'
    } : null;

    return (
        <section className={`${styles.pageHero} ${className || ''}`} style={style}>
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

