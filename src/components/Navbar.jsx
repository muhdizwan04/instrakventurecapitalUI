import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../assets/logo.png';
import { usePageContent } from '../hooks/usePageContent';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
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
                link: '/mission-vision-values',
                isDropdown: true,
                children: [
                    { id: 'sub-1', label: 'Mission, Vision & Values', link: '/mission-vision-values' },
                    { id: 'sub-2', label: 'Board of Directors', link: '/board-of-directors' },
                    { id: 'sub-3', label: 'Strategic Partners', link: '/strategic-partners' }
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

    const { content: navData, loading } = usePageContent('navigation', defaultNav);
    const { content: settings } = usePageContent('global_settings');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleDropdownClick = (itemId) => {
        setOpenDropdown(openDropdown === itemId ? null : itemId);
    };

    const closeAll = () => {
        setMenuOpen(false);
        setOpenDropdown(null);
    };

    // Use loaded data or defaults
    const items = navData?.items || defaultNav.items;

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} glass`}>
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
