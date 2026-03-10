import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';
import { TrendingUp, Wallet, ShieldCheck, PieChart, Briefcase, Building2, Landmark, Globe, Shield, Coins, Gem, Users, BarChart3, ArrowRight } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

const ICON_MAP = { TrendingUp, Wallet, ShieldCheck, PieChart, Briefcase, Building2, Landmark, Globe, Shield, Coins, Gem, Users, BarChart3 };

const Services = () => {
    const defaultServices = [
        {
            id: 1,
            title: 'Business Finance Consulting (Virtual CFO)',
            summary: 'Strategic financial expertise without a full-time CFO. Planning, reporting, and investor relations.',
            icon: 'Briefcase',
            link: '/services/virtual-cfo',
            category: 'Financial Structuring'
        },
        {
            id: 3,
            title: 'Equity Financing (EF)',
            summary: 'Strategic equity investment for growth-stage and established companies across global markets.',
            icon: 'TrendingUp',
            link: '/services/equity-financing',
            category: 'Financial Structuring'
        },
        {
            id: 4,
            title: 'Real Estate Financing (REF)',
            summary: 'Global property financing for developers, asset owners, and institutional investors.',
            icon: 'Building2',
            link: '/services/real-estate-financing',
            category: 'Real Estate & Asset Platforms'
        },
        {
            id: 5,
            title: 'Real Estate Investment Trust (REITs)',
            summary: 'Institutional-grade REITs for diversified exposure to income-generating real estate.',
            icon: 'Landmark',
            link: '/services/reits',
            category: 'Real Estate & Asset Platforms'
        },
        {
            id: 6,
            title: 'Share Financing (SF)',
            summary: 'Unlock liquidity using listed shares as collateral. Non-dilutive financing for companies and shareholders.',
            icon: 'BarChart3',
            link: '/services/share-financing',
            category: 'Financial Structuring'
        },
        {
            id: 7,
            title: 'Merger & Acquisition (M&A)',
            summary: 'Strategic advisory for mergers, acquisitions, and corporate restructuring.',
            icon: 'Users',
            link: '/services/merger-acquisition',
            category: 'Strategic Transactions'
        },
        {
            id: 8,
            title: 'Tokenization',
            summary: 'Tokenize real-world assets for fractional ownership and global investor access.',
            icon: 'Coins',
            link: '/services/tokenization',
            category: 'Digital & Financial Innovation'
        },
        {
            id: 9,
            title: 'Asset Insurance (AI)',
            summary: 'Structured protection for high-value assets, investment portfolios, and strategic holdings.',
            icon: 'Shield',
            link: '/services/asset-insurance',
            category: 'Digital & Financial Innovation'
        },
        {
            id: 10,
            title: 'Private Placement Life Insurance (PPLI)',
            summary: 'Wealth preservation and estate planning through life insurance and tax-efficient structures.',
            icon: 'ShieldCheck',
            link: '/services/ppli',
            category: 'Financial Structuring'
        },
        {
            id: 11,
            title: 'Global Investment Gateway (GIG)',
            summary: 'Curated access to global investors and strategic partners for qualified companies.',
            icon: 'Globe',
            link: '/services/gig',
            category: 'Global Investment Ecosystem'
        },
        {
            id: 12,
            title: 'Private Wealth Investment (The Luxury Dubai)',
            summary: 'Exclusive investment and lifestyle platform for ultra-high-net-worth individuals.',
            icon: 'Gem',
            link: '/services/private-wealth',
            category: 'Global Investment Ecosystem'
        },
        {
            id: 13,
            title: 'Asset Under Management (AUM)',
            summary: 'Discretionary and advisory asset management for institutions, family offices, and high-net-worth clients.',
            icon: 'PieChart',
            link: '/services/aum',
            category: 'Global Investment Ecosystem'
        }
    ];

    // Fetch services list
    const { content: servicesContent } = usePageContent('services', { items: defaultServices });
    const services = servicesContent.items || defaultServices;

    // Group services by parent category for clearer hierarchy
    const grouped = services.reduce((acc, svc) => {
        const key = svc.category || 'Other';
        if (!acc[key]) acc[key] = [];
        acc[key].push(svc);
        return acc;
    }, {});
    const orderedCategories = [
        'Financial Structuring',
        'Real Estate & Asset Platforms',
        'Strategic Transactions',
        'Digital & Financial Innovation',
        'Global Investment Ecosystem',
        'Other'
    ].filter(cat => grouped[cat] && grouped[cat].length > 0);

    // Fetch section title/subtitle and styles from home settings
    const { content: homeContent } = usePageContent('home', {
        servicesTitle: 'Our Portfolio',
        servicesSubtitle: 'Comprehensive financial solutions tailored for your growth',
        servicesSectionStyles: {}
    });
    const title = homeContent.servicesTitle || 'Our Portfolio';
    const subtitle = homeContent.servicesSubtitle || 'Comprehensive financial solutions tailored for your growth';
    const sectionStyles = homeContent.servicesSectionStyles || {};
    const sectionStyle = {};
    if (sectionStyles.backgroundColor) {
        const v = sectionStyles.backgroundColor.trim();
        if (v.startsWith('linear-gradient') || v.startsWith('radial-gradient')) {
            sectionStyle.background = v;
        } else {
            sectionStyle.backgroundColor = v;
            sectionStyle['--services-bg'] = v;
        }
    } else {
        sectionStyle['--services-bg'] = '#0b1120';
    }
    if (sectionStyles.textColor) {
        sectionStyle.color = sectionStyles.textColor;
        sectionStyle['--services-text'] = sectionStyles.textColor;
    }
    if (sectionStyles.boxColor && sectionStyles.cardStyle === 'solid') sectionStyle['--services-box-bg'] = sectionStyles.boxColor;
    const cardStyleGlass = sectionStyles.cardStyle !== 'solid';

    return (
        <section id="services" className={`${styles.services} ${cardStyleGlass ? styles.cardStyleGlass : ''}`} style={sectionStyle}>
            <div className="container">
                <h2 className="section-title">{title}</h2>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

                <div className={styles.groupedServices}>
                    {orderedCategories.map((category) => (
                        <div key={category} className={styles.categoryBlock}>
                            <h3 className={styles.categoryHeading}>{category}</h3>
                            <div className={styles.servicesGrid}>
                                {grouped[category].map((service, index) => {
                                    const IconComponent = ICON_MAP[service.icon] || Briefcase;
                                    return (
                                        <Link to={service.link} key={service.id || index} className={styles.serviceItem}>
                                            <div className={styles.serviceIcon}>
                                                <IconComponent size={24} />
                                            </div>
                                            <div className={styles.serviceInfo}>
                                                <h4>{service.title}</h4>
                                                <p>{service.summary}</p>
                                            </div>
                                            <ArrowRight size={18} className={styles.arrow} />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.viewAllWrapper}>
                    <Link to="/services" className={styles.viewAllLink}>
                        View All Services <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Services;
