import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../assets/logo.png';
import { usePageContent } from '../hooks/usePageContent';

const Footer = () => {
    const defaultContent = {
        logo: '',
        companyName: 'Instrak Venture Capital Berhad',
        description: 'Disclaimer Testing for disclaimer placement',
        address: 'Level 23, Menara Exchange 106,\nTun Razak Exchange (TRX),\n55188 Kuala Lumpur, Malaysia\n\n1005 & 1006, Ontario Tower,\nBusiness Bay, Dubai,\nUnited Arab Emirates',
        phone: '',
        email: 'admin@instrakventurecapital.com',
        quickLinks: [
            { label: 'Home', url: '/' },
            { label: 'About Us', url: '/about' },
            { label: 'Services', url: '/services' },
            { label: 'News', url: '/latest-news-2' },
            { label: 'Contact Us', url: '/contact' }
        ]
    };

    const defaultGlobalSettings = {
        siteIdentity: {
            logoUrl: logo,
            siteName: 'Instrak Venture Capital Berhad'
        }
    };

    const { content } = usePageContent('footer', defaultContent);
    const { content: settings } = usePageContent('global_settings', defaultGlobalSettings);
    const addressLines = (content.address || defaultContent.address).split('\n');
    const logoSrc = settings?.siteIdentity?.logoUrl || content.logo || logo;
    const s = content?.styles || {};
    const footerBg = s.footerBgColor || '#FAFBFC';
    const descColor = s.descriptionTextColor || '#4A5568';
    const addressColor = s.addressTextColor || '#4A5568';
    const phoneColor = s.phoneTextColor || '#4A5568';
    const emailColor = s.emailTextColor || '#1A365D';
    const quickLinkColor = s.quickLinkTextColor || '#4A5568';

    return (
        <footer id="contact" className={styles.footer} style={{ backgroundColor: footerBg }}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.brand}>
                    <div className={styles.footerLogo}>
                        <img src={logoSrc} alt="Instrak Logo" className={styles.logoImg} />
                    </div>
                    <p>{settings?.siteIdentity?.siteName ?? (content.companyName || defaultContent.companyName)}</p>
                    <p className={styles.description} style={{ color: descColor }}>{content.description || defaultContent.description}</p>
                </div>

                <div className={styles.links}>
                    <h4>Quick Links</h4>
                    <ul>
                        {(content.quickLinks || defaultContent.quickLinks).map((link, i) => (
                            <li key={i}>
                                <Link to={link.url} style={{ color: quickLinkColor }}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.contact}>
                    <h4>Contact Us</h4>
                    {addressLines.map((line, i) => (
                        <p key={i} style={{ color: addressColor }}>{line}</p>
                    ))}
                    {(content.phone || defaultContent.phone) && (
                        <p style={{ color: phoneColor }}>{content.phone || defaultContent.phone}</p>
                    )}
                    <p className={styles.email} style={{ color: emailColor }}>{content.email || defaultContent.email}</p>
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

