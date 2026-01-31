import React from 'react';
import styles from './PageHero.module.css';

const PageHero = ({ title, subtitle, className, style, textColor }) => {
    return (
        <section className={`${styles.pageHero} ${className || ''}`} style={style}>
            <div className={`container ${styles.container}`}>
                <h1 style={{ color: textColor }}>{title}</h1>
                {subtitle && <p style={{ color: textColor ? textColor : undefined }}>{subtitle}</p>}
            </div>
            <div className={styles.overlay}></div>
        </section>
    );
};

export default PageHero;

