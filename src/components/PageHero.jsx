import React from 'react';
import styles from './PageHero.module.css';

const PageHero = ({ title, subtitle, className, style }) => {
    return (
        <section className={`${styles.pageHero} ${className || ''}`} style={style}>
            <div className={`container ${styles.container}`}>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            <div className={styles.overlay}></div>
        </section>
    );
};

export default PageHero;

