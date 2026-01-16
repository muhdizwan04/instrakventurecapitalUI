import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../assets/logo.png';
import { usePageContent } from '../hooks/usePageContent';

const Footer = () => {
    const defaultContent = {
        logo: '',
        companyName: 'Instrak Venture Capital Berhad (1411516-U)',
        description: 'Providing strategic funding and governance for the next generation of industry leaders through institutional excellence.',
        address: 'Level 27 Penthouse, Centrepoint North\nMid Valley City\n59200 Kuala Lumpur, Malaysia',
        email: 'admin@instrakventurecapital.com',
        quickLinks: [
            { label: 'Home', url: '/' },
            { label: 'About Us', url: '/mission-vision-values' },
            { label: 'Services', url: '/services' },
            { label: 'News', url: '/latest-news-2' },
            { label: 'Contact Us', url: '/contact' }
        ]
    };

    const { content } = usePageContent('footer', defaultContent);
    const { content: settings } = usePageContent('global_settings');
    const addressLines = (content.address || defaultContent.address).split('\n');
    const logoSrc = content.logo || logo; // Use admin logo if available, else default

    return (
        <footer id="contact" className={styles.footer}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.brand}>
                    <div className={styles.footerLogo}>
                        <img src={logoSrc} alt="Instrak Logo" className={styles.logoImg} />
                    </div>
                    <p>{settings?.siteIdentity?.siteName ?? (content.companyName || defaultContent.companyName)}</p>
                    <p className={styles.description}>{content.description || defaultContent.description}</p>
                </div>

                <div className={styles.links}>
                    <h4>Quick Links</h4>
                    <ul>
                        {(content.quickLinks || defaultContent.quickLinks).map((link, i) => (
                            <li key={i}><Link to={link.url}>{link.label}</Link></li>
                        ))}
                    </ul>
                </div>

                <div className={styles.contact}>
                    <h4>Contact Us</h4>
                    {addressLines.map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                    <p className={styles.email}>{content.email || defaultContent.email}</p>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} {settings?.siteIdentity?.siteName ?? 'Instrak Venture Capital'}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

