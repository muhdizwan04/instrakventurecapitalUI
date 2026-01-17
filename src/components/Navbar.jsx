import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { usePageContent } from '../hooks/usePageContent';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

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

    const { content: navData } = usePageContent('navigation', defaultNav);
    const { content: settings } = usePageContent('global_settings');

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const closeAll = () => {
        setMenuOpen(false);
        setOpenDropdown(null);
    };

    // Use loaded data or defaults
    const rawItems = navData?.items || defaultNav.items;
    
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
        <nav className={`${styles.nav} glass`}>
            <div className={`container ${styles.container}`}>
                <Link to="/" className={styles.logo} onClick={closeAll}>
                    {settings?.siteIdentity?.logoUrl ? (
                        <img 
                            src={settings.siteIdentity.logoUrl} 
                            alt={settings.siteIdentity.siteName || 'Logo'} 
                            className={styles.logoImg} 
                        />
                    ) : (
                        <div className={styles.logoText}>
                            <span className={styles.brand}>
                                {settings?.siteIdentity?.siteName || 'Instrak Venture Capital'}
                            </span>
                            {settings?.siteIdentity?.tagline && (
                                <span className={styles.tagline}>{settings.siteIdentity.tagline}</span>
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
                </ul>

                <div className={styles.mobileMenu} onClick={toggleMenu}>
                    <div className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
