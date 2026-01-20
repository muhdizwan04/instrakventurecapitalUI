import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';
import { TrendingUp, Wallet, ShieldCheck, PieChart, Briefcase, Building2, Landmark, Globe, Shield, Coins, Gem, Users, BarChart3, ArrowRight } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

const ICON_MAP = { TrendingUp, Wallet, ShieldCheck, PieChart, Briefcase, Building2, Landmark, Globe, Shield, Coins, Gem, Users, BarChart3 };

const Services = () => {
    const defaultServices = [
        { id: 1, title: 'Business Finance Consulting (Virtual CFO)', summary: 'Financial strategy & forecasting, budgeting & cash flow management, profitability analysis & cost control.', icon: 'Briefcase', link: '/services/virtual-cfo' },
        { id: 1, title: 'Business Finance Consulting (Virtual CFO)', summary: 'Financial strategy & forecasting, budgeting & cash flow management, profitability analysis & cost control.', icon: 'Briefcase', link: '/services/virtual-cfo' },
        { id: 3, title: 'Equity Financing (EF)', summary: 'Strategic capital injection through equity investment for high-growth companies.', icon: 'TrendingUp', link: '/services/equity-financing' },
        { id: 4, title: 'Real Estate Financing (REF)', summary: 'Funding for high-yield property developments and real estate acquisitions.', icon: 'Building2', link: '/services/real-estate-financing' },
        { id: 5, title: 'Real Estate Investment Trust (REITs)', summary: 'Institutional-grade real estate investment opportunities.', icon: 'Landmark', link: '/services/reits' },
        { id: 6, title: 'Share Financing (SF)', summary: 'Strategic share financing solutions for shareholders.', icon: 'BarChart3', link: '/services/share-financing' },
        { id: 7, title: 'Merger & Acquisition (M&A)', summary: 'Expert guidance through complex M&A transactions.', icon: 'Users', link: '/services/merger-acquisition' },
        { id: 8, title: 'Tokenization', summary: 'Digital asset tokenization solutions for modern investments.', icon: 'Coins', link: '/services/tokenization' },
        { id: 9, title: 'Asset Insurance (AI)', summary: 'Comprehensive asset protection and insurance solutions.', icon: 'Shield', link: '/services/asset-insurance' },
        { id: 10, title: 'Private Placement Life Insurance (PPLI)', summary: 'Wealth preservation and estate planning solutions.', icon: 'ShieldCheck', link: '/services/ppli' },
        { id: 11, title: 'Global Investment Gateway (GIG)', summary: 'Exclusive access to global investors and strategic partners.', icon: 'Globe', link: '/services/gig' },
        { id: 12, title: 'Private Wealth Investment', summary: 'The Luxury Dubai - Premium real estate opportunities.', icon: 'Gem', link: '/services/private-wealth' },
        { id: 13, title: 'Asset Under Management (AUM)', summary: 'Mandate-driven portfolio management for institutions.', icon: 'PieChart', link: '/services/aum' }
    ];

    // Fetch services list
    const { content: servicesContent } = usePageContent('services', { items: defaultServices });
    const services = servicesContent.items || defaultServices;

    // Fetch section title/subtitle from home settings
    const { content: homeContent } = usePageContent('home', {
        servicesTitle: 'Our Services',
        servicesSubtitle: 'Comprehensive financial solutions tailored for your growth'
    });
    const title = homeContent.servicesTitle || 'Our Services';
    const subtitle = homeContent.servicesSubtitle || 'Comprehensive financial solutions tailored for your growth';

    return (
        <section id="services" className={styles.services}>
            <div className="container">
                <h2 className="section-title">{title}</h2>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

                <div className={styles.servicesGrid}>
                    {services.map((service, index) => {
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
