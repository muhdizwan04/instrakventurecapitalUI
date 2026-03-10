import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { user, logout } = useAuth();

    // Default navigation structure
    const defaultNav = {
        logo: { url: '/logo.png', alt: 'Instrak Venture Capital' },
        items: [
            { id: 'nav-1', label: 'Home', link: '/', isDropdown: false, children: [] },
            {
                id: 'nav-2',
                label: 'About Us',
                link: '/about',
                isDropdown: true,
                children: [
                    { id: 'sub-1', label: 'Mission, Vision & Values', link: '/about#mission' },
                    { id: 'sub-2', label: 'Board of Directors', link: '/about#board' },
                    { id: 'sub-3', label: 'Strategic Partners', link: '/about#partners' }
                ]
            },
            {
                id: 'nav-3',
                label: 'Services',
                link: '/services',
                isDropdown: true,
                children: [
                    { id: 'sub-4', label: 'Strategic Financing', link: '/services' },
                    { id: 'sub-5', label: 'Institutional Investors', link: '/investors' }
                ]
            },
            { id: 'nav-4', label: 'Career', link: '/join-us', isDropdown: false, children: [] },
            { id: 'nav-5', label: 'News', link: '/latest-news-2', isDropdown: false, children: [] },
            { id: 'nav-6', label: 'Contact Us', link: '/contact', isDropdown: false, isButton: true, children: [] }
        ]
    };

    const defaultGlobalSettings = {
        siteIdentity: {
            logoUrl: '/logo.png',
            siteName: 'Instrak Venture Capital',
            tagline: ''
        }
    };

    const { content: navData } = usePageContent('navigation', defaultNav);
    const { content: settings } = usePageContent('global_settings', defaultGlobalSettings);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const closeAll = () => {
        setMenuOpen(false);
        setOpenDropdown(null);
    };

    // Use loaded data or defaults
    const rawItems = navData?.items || defaultNav.items;

    // Navigation styles from admin. Gradient (custom or default) vs solid: when solid, use backgroundColor; when gradient, use custom gradient from admin or fall back to CSS default.
    const navStylesConfig = navData?.navStyles || {};
    const navStyleVars = {};
    if (navStylesConfig.textColor) {
        navStyleVars['--nav-link-color'] = navStylesConfig.textColor;
    }
    if (navStylesConfig.backgroundType === 'solid' && navStylesConfig.backgroundColor) {
        navStyleVars.background = navStylesConfig.backgroundColor;
    } else if (navStylesConfig.backgroundType !== 'solid' && navStylesConfig.gradientStart != null && navStylesConfig.gradientEnd != null) {
        const dir = navStylesConfig.gradientDirection || '90deg';
        navStyleVars.background = `linear-gradient(${dir}, ${navStylesConfig.gradientStart}, ${navStylesConfig.gradientEnd})`;
    }

    // FORCE UPDATE: Ensure About Us links point to the consolidated page
    const items = rawItems.map(item => {
        if (item.label === 'About Us' || item.id === 'nav-2') {
            return {
                ...item,
                link: '/about',
                children: [
                    { id: 'sub-1', label: 'Mission, Vision & Values', link: '/about#mission' },
                    { id: 'sub-2', label: 'Board of Directors', link: '/about#board' },
                    { id: 'sub-3', label: 'Strategic Partners', link: '/about#partners' }
                ]
            };
        }
        return item;
    });

    return (
        <nav className={styles.nav} style={navStyleVars}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo} onClick={closeAll}>
                    {settings?.siteIdentity?.logoUrl ? (
                        <img
                            src={settings.siteIdentity.logoUrl}
                            alt={settings.siteIdentity.siteName || 'Logo'}
                            className={styles.logoImg}
                        />
                    ) : (
                        <div className={styles.logoText}>
                            <motion.span
                                className={styles.brand}
                                initial={{ opacity: 0, letterSpacing: '-0.02em', y: 5 }}
                                animate={{ opacity: 1, letterSpacing: '0.02em', y: 0 }}
                                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1.0] }}
                            >
                                {settings?.siteIdentity?.siteName || 'Instrak Venture Capital'}
                            </motion.span>
                            {settings?.siteIdentity?.tagline && (
                                <motion.span
                                    className={styles.tagline}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    {settings.siteIdentity.tagline}
                                </motion.span>
                            )}
                        </div>
                    )}
                </Link>

                <ul className={`${styles.links} ${menuOpen ? styles.active : ''}`}>
                    {items.map(item => (
                        <li key={item.id} className={item.isDropdown ? styles.hasDropdown : ''}>
                            {item.isDropdown ? (
                                <>
                                    <Link
                                        to={item.link}
                                        className={styles.parentLink}
                                        onClick={closeAll}
                                    >
                                        {item.label}
                                    </Link>
                                    <ul className={styles.dropdown}>
                                        {item.children?.map(sub => (
                                            <li key={sub.id}>
                                                <Link to={sub.link} onClick={closeAll}>
                                                    {sub.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <Link
                                    to={item.link}
                                    className={item.isButton ? 'btn-primary' : ''}
                                    onClick={closeAll}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}

                    {/* Profile Menu - Only visible when logged in */}
                    {user && (
                        <li className={styles.hasDropdown}>
                            <div className={styles.parentLink} style={{ cursor: 'pointer', gap: '0.5rem' }}>
                                <div className={styles.avatar}>
                                    <User size={18} />
                                </div>
                                <span>Account</span>
                            </div>
                            <ul className={`${styles.dropdown} ${styles.profileDropdown}`}>
                                <li className={styles.userInfo}>
                                    <span className={styles.userLabel}>Signed in as</span>
                                    <span className={styles.userEmail} title={user.email}>{user.email}</span>
                                </li>
                                <li>
                                    <button
                                        onClick={async () => {
                                            console.log('Logout button clicked');
                                            try {
                                                closeAll();
                                                await logout();
                                                console.log('Logout successful');
                                                window.location.href = '/'; // Force redirect to landing page to refresh state
                                            } catch (error) {
                                                console.error('Logout failed:', error);
                                            }
                                        }}
                                        className={styles.logoutBtn}
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </li>
                    )}
                </ul>

                <div className={styles.mobileMenu} onClick={toggleMenu}>
                    <div className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
