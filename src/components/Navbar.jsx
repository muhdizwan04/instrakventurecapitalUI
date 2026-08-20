import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isLightHexColor } from '../theme/clientThemeDefaults';
import { User, LogOut, Sun, Moon } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navRef = useRef(null);
    const leaveTimerRef = useRef(null);
    const location = useLocation();

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
                    { id: 'sub-1', label: 'Mission, Vision & Philosophy', link: '/about#mission' },
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
        if (leaveTimerRef.current) {
            clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
        }
    };

    const handleDropdownEnter = (id) => {
        if (leaveTimerRef.current) {
            clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
        }
        setOpenDropdown(id);
    };

    const handleDropdownLeave = () => {
        if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = setTimeout(() => setOpenDropdown(null), 120);
    };

    const handleDropdownToggle = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };

    // Close on click outside, Esc key, or scroll
    useEffect(() => {
        const onPointerDown = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setOpenDropdown(null);
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('touchstart', onPointerDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('touchstart', onPointerDown);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    useEffect(() => () => {
        if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    }, []);

    useEffect(() => {
        const updateScrolledState = () => setIsScrolled(window.scrollY > 28);
        updateScrolledState();
        window.addEventListener('scroll', updateScrolledState, { passive: true });
        return () => window.removeEventListener('scroll', updateScrolledState);
    }, []);

    // Use loaded data or defaults
    const rawItems = navData?.items || defaultNav.items;

    // Navigation styles from admin. Gradient (custom or default) vs solid: when solid, use backgroundColor; when gradient, use custom gradient from admin or fall back to CSS default.
    const navStylesConfig = navData?.navStyles || {};
    const navStyleVars = {};
    // Light mode: keep CSS module light navbar (no inline background). Only apply link color if it reads on white.
    if (theme === 'light') {
        if (navStylesConfig.textColor && !isLightHexColor(navStylesConfig.textColor)) {
            navStyleVars['--nav-link-color'] = navStylesConfig.textColor;
        }
    } else {
        if (navStylesConfig.textColor) {
            navStyleVars['--nav-link-color'] = navStylesConfig.textColor;
        }
        if ((isScrolled || location.pathname !== '/') && navStylesConfig.backgroundType === 'solid' && navStylesConfig.backgroundColor) {
            navStyleVars.background = navStylesConfig.backgroundColor;
        } else if ((isScrolled || location.pathname !== '/') && navStylesConfig.backgroundType !== 'solid' && navStylesConfig.gradientStart != null && navStylesConfig.gradientEnd != null) {
            const dir = navStylesConfig.gradientDirection || '90deg';
            navStyleVars.background = `linear-gradient(${dir}, ${navStylesConfig.gradientStart}, ${navStylesConfig.gradientEnd})`;
        }
    }

    // Keep admin-provided labels; only normalize About Us links if needed.
    const items = rawItems.map((item) => {
        if (item.id !== 'nav-2' && item.label !== 'About Us') return item;

        const children = Array.isArray(item.children) ? item.children : [];
        const normalizedChildren = children.map((sub) => {
            const l = String(sub.link || '');
            // If admin already points to /about, keep it. Otherwise, if it targets legacy /about, normalize to /about.
            if (l.startsWith('/about')) return sub;
            return sub;
        });

        return {
            ...item,
            link: item.link?.startsWith('/about') ? item.link : '/about',
            children: normalizedChildren
        };
    });

    return (
        <nav
            ref={navRef}
            className={`${styles.nav} ${isScrolled || location.pathname !== '/' ? styles.scrolled : styles.atTop}`}
            style={navStyleVars}
        >
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
                            <Motion.span
                                className={styles.brand}
                                initial={{ opacity: 0, letterSpacing: '-0.02em', y: 5 }}
                                animate={{ opacity: 1, letterSpacing: '0.02em', y: 0 }}
                                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1.0] }}
                            >
                                {settings?.siteIdentity?.siteName || 'Instrak Venture Capital'}
                            </Motion.span>
                            {settings?.siteIdentity?.tagline && (
                                <Motion.span
                                    className={styles.tagline}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    {settings.siteIdentity.tagline}
                                </Motion.span>
                            )}
                        </div>
                    )}
                </Link>

                <ul className={`${styles.links} ${menuOpen ? styles.active : ''}`}>
                    {items.map(item => (
                        <li
                            key={item.id}
                            className={item.isDropdown
                                ? `${styles.hasDropdown}${openDropdown === item.id ? ` ${styles.open}` : ''}`
                                : ''}
                            onMouseEnter={item.isDropdown ? () => handleDropdownEnter(item.id) : undefined}
                            onMouseLeave={item.isDropdown ? handleDropdownLeave : undefined}
                        >
                            {item.isDropdown ? (
                                <>
                                    <Link
                                        to={item.link}
                                        className={styles.parentLink}
                                        aria-haspopup="true"
                                        aria-expanded={openDropdown === item.id}
                                        onClick={(e) => {
                                            // On touch devices, first tap toggles the menu instead of navigating.
                                            const hasRealHover = typeof window !== 'undefined'
                                                && window.matchMedia
                                                && window.matchMedia('(hover: hover)').matches;
                                            if (!hasRealHover && openDropdown !== item.id) {
                                                e.preventDefault();
                                                handleDropdownToggle(item.id);
                                                return;
                                            }
                                            closeAll();
                                        }}
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

                    {/* Theme Toggle */}
                    <li className={styles.themeToggle}>
                        <button
                            onClick={toggleTheme}
                            className={styles.themeBtn}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </li>

                    {/* Profile Menu - Only visible when logged in */}
                    {user && (
                        <li
                            className={`${styles.hasDropdown}${openDropdown === 'account' ? ` ${styles.open}` : ''}`}
                            onMouseEnter={() => handleDropdownEnter('account')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <div
                                className={styles.parentLink}
                                style={{ cursor: 'pointer', gap: '0.5rem' }}
                                role="button"
                                tabIndex={0}
                                aria-haspopup="true"
                                aria-expanded={openDropdown === 'account'}
                                onClick={() => handleDropdownToggle('account')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleDropdownToggle('account');
                                    }
                                }}
                            >
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

                <button
                    type="button"
                    className={styles.mobileMenu}
                    onClick={toggleMenu}
                    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={menuOpen}
                >
                    <div className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}></div>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
