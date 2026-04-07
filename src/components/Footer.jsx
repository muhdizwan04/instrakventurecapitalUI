import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../assets/logo.png';
import { usePageContent } from '../hooks/usePageContent';
import { useTheme } from '../context/ThemeContext';
import { isDarkHexColor, isLightHexColor } from '../theme/clientThemeDefaults';

const Footer = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
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
    let footerBg = s.footerBackgroundType === 'gradient' && s.footerGradientStart != null && s.footerGradientEnd != null
        ? `linear-gradient(${s.footerGradientDirection || '90deg'}, ${s.footerGradientStart}, ${s.footerGradientEnd})`
        : (s.footerBgColor || '#FAFBFC');
    if (isLight) {
        if (s.footerBackgroundType === 'gradient' && s.footerGradientStart != null && s.footerGradientEnd != null) {
            if (isDarkHexColor(s.footerGradientStart) || isDarkHexColor(s.footerGradientEnd)) {
                footerBg = `linear-gradient(${s.footerGradientDirection || '90deg'}, #ffffff, #f1f5f9)`;
            }
        } else if (isDarkHexColor(s.footerBgColor || '#FAFBFC')) {
            footerBg = '#F8FAFC';
        }
    }
    const descColor = s.descriptionTextColor || '#4A5568';
    const addressColor = s.addressTextColor || '#4A5568';
    const phoneColor = s.phoneTextColor || '#4A5568';
    const emailColor = s.emailTextColor || '#1A365D';
    const quickLinkColor = s.quickLinkTextColor || '#4A5568';
    const quickLinksHeadingColor = s.quickLinksHeadingColor || '#1A365D';
    const contactUsHeadingColor = s.contactUsHeadingColor || '#1A365D';

    const safeText = (c, fallback) => (isLight && isLightHexColor(c) ? fallback : c);
    const descColorSafe = safeText(descColor, '#475569');
    const addressColorSafe = safeText(addressColor, '#475569');
    const phoneColorSafe = safeText(phoneColor, '#475569');
    const emailColorSafe = safeText(emailColor, '#0A3D62');
    const quickLinkColorSafe = safeText(quickLinkColor, '#475569');
    const quickLinksHeadingSafe = safeText(quickLinksHeadingColor, '#1E293B');
    const contactUsHeadingSafe = safeText(contactUsHeadingColor, '#1E293B');
    const headingFontStyle = {
        ...(s.sectionHeadingFontFamily ? { fontFamily: s.sectionHeadingFontFamily } : {}),
        ...(s.sectionHeadingFontSize ? { fontSize: s.sectionHeadingFontSize } : {}),
        ...(s.sectionHeadingFontWeight ? { fontWeight: s.sectionHeadingFontWeight } : {}),
    };

    return (
        <footer id="contact" className={styles.footer} style={s.footerBackgroundType === 'gradient' ? { background: footerBg } : { backgroundColor: footerBg }}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.brand}>
                    <div className={styles.footerLogo}>
                        <img src={logoSrc} alt="Instrak Logo" className={styles.logoImg} />
                    </div>
                    <p>{settings?.siteIdentity?.siteName ?? (content.companyName || defaultContent.companyName)}</p>
                    <p className={styles.description} style={{ color: descColorSafe }}>{content.description || defaultContent.description}</p>
                </div>

                <div className={styles.links}>
                    <h4 style={{ color: quickLinksHeadingSafe, ...headingFontStyle }}>{content.quickLinksTitle ?? 'Quick Links'}</h4>
                    <ul>
                        {(content.quickLinks || defaultContent.quickLinks).map((link, i) => (
                            <li key={i}>
                                <Link to={link.url} style={{ color: quickLinkColorSafe }}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.contact}>
                    <h4 style={{ color: contactUsHeadingSafe, ...headingFontStyle }}>{content.contactUsTitle ?? 'Contact Us'}</h4>
                    {addressLines.map((line, i) => (
                        <p key={i} style={{ color: addressColorSafe }}>{line}</p>
                    ))}
                    {(content.phone || defaultContent.phone) && (
                        <p style={{ color: phoneColorSafe }}>{content.phone || defaultContent.phone}</p>
                    )}
                    <p className={styles.email} style={{ color: emailColorSafe }}>{content.email || defaultContent.email}</p>
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

