import React from 'react';
import styles from './PageHero.module.css';

const PageHero = ({ title, subtitle, className, style, textColor, sectionStyles = {} }) => {
    return (
        <section className={`${styles.pageHero} ${className || ''}`} style={style}>
            <div className={`container ${styles.container}`} style={{ textAlign: sectionStyles.textAlign || 'center' }}>
                <h1 style={{
                    color: textColor,
                    fontWeight: sectionStyles.titleFontWeight || 800,
                    fontStyle: sectionStyles.titleFontStyle || 'normal',
                    textDecoration: sectionStyles.titleTextDecoration || 'none',
                    fontSize: sectionStyles.titleFontSize ? `${sectionStyles.titleFontSize}px` : undefined
                }}>{title}</h1>
                {subtitle && <p style={{
                    color: textColor || undefined,
                    fontSize: sectionStyles.subtitleFontSize ? `${sectionStyles.subtitleFontSize}px` : undefined,
                    textAlign: sectionStyles.subtitleAlign || undefined,
                    whiteSpace: 'pre-line'
                }}>{subtitle}</p>}
            </div>
            <div className={styles.overlay}></div>
        </section>
    );
};

export default PageHero;

