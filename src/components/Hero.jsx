import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import { usePageContent } from '../hooks/usePageContent';

import klSkyline from '../assets/kl-skyline.png';

const Hero = () => {
    // Default content - used while loading and as fallback
    const defaultContent = {
        heroTitle: 'We Help To Grow\nYour Business',
        heroSubtitle: 'Governance • Transparency • Integrity',
        heroDescription: 'Providing foundational governance and integrity essential for scaling visionary industrial leaders across the ASEAN region.',
        buttons: [
            { id: 1, text: 'Strategic Services', link: '/services', variant: 'solid' },
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

    return (
        <section id="home" className={styles.hero}>
            <div className={`container ${styles.container}`}>

                <h1 className={styles.title}>
                    {titleLine1}
                    {titleLine2 && <><br /><span className={styles.highlight}>{titleLine2}</span></>}
                </h1>
                <p className={styles.subtitle}>
                    {subtitleParts.map((part, i) => (
                        <React.Fragment key={i}>
                            <strong>{part}</strong>
                            {i < subtitleParts.length - 1 && ' • '}
                        </React.Fragment>
                    ))}
                </p>
                <p className={styles.description}>
                    {content.heroDescription || defaultContent.heroDescription}
                </p>
                <div className={styles.cta}>
                    {buttons.map(btn => (
                        <Link
                            key={btn.id}
                            to={btn.link}
                            className={btn.variant === 'solid' ? 'btn-solid' : 'btn-outline-gold'}
                        >
                            {btn.text}
                        </Link>
                    ))}
                </div>
            </div>

            <div className={styles.background}>
                <img src={klSkyline} alt="Kuala Lumpur Skyline" className={styles.bgImage} />
                <div className={styles.overlay}></div>
                <div className={styles.gradient1}></div>
                <div className={styles.gradient2}></div>
                <div className={styles.gradient3}></div>
            </div>
        </section>
    );
};

export default Hero;


