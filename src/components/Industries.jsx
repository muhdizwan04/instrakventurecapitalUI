import React from 'react';
import styles from './Industries.module.css';
import { Fuel, GraduationCap, Car, HardHat, Building, Truck, Factory, Cpu } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { useTheme } from '../context/ThemeContext';
import { lightBandAt } from '../theme/lightBands';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const ICON_MAP = {
    Fuel, GraduationCap, Car, HardHat, Building, Truck, Factory, Cpu
};

const Industries = ({ lightBandIndex }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const defaultIndustries = [
        { id: 'ind-1', name: 'Oil and Gas', icon: 'Fuel' },
        { id: 'ind-2', name: 'Education', icon: 'GraduationCap' },
        { id: 'ind-3', name: 'Automotive', icon: 'Car' },
        { id: 'ind-4', name: 'Construction', icon: 'HardHat' },
        { id: 'ind-5', name: 'Property Dev', icon: 'Building' },
        { id: 'ind-6', name: 'Logistics', icon: 'Truck' },
        { id: 'ind-7', name: 'Manufacturing', icon: 'Factory' },
        { id: 'ind-8', name: 'Digital Tech', icon: 'Cpu' }
    ];

    const { content } = usePageContent('home', { industries: defaultIndustries, industriesSectionStyles: {} });
    const industries = content.industries || defaultIndustries;
    const sectionStyles = content.industriesSectionStyles || {};
    const useLightBand = isLight && typeof lightBandIndex === 'number' && Number.isFinite(lightBandIndex);
    const lightBandClass = useLightBand ? `lm-band-${lightBandAt(lightBandIndex)}` : '';

    const sectionStyle = {};
    if (isLight) {
        sectionStyle['--industries-bg'] = useLightBand ? 'transparent' : '#f8fafc';
        sectionStyle['--industries-text'] = '#0f172a';
        sectionStyle['--industries-box-bg'] = '#ffffff';
        sectionStyle.color = '#0f172a';
    } else if (sectionStyles.backgroundColor) {
        const v = sectionStyles.backgroundColor.trim();
        if (v.startsWith('linear-gradient') || v.startsWith('radial-gradient')) {
            sectionStyle.background = v;
        } else {
            sectionStyle.backgroundColor = v;
            sectionStyle['--industries-bg'] = v;
        }
    } else {
        sectionStyle['--industries-bg'] = '#0b1120';
    }
    if (!isLight && sectionStyles.textColor) {
        sectionStyle.color = sectionStyles.textColor;
        sectionStyle['--industries-text'] = sectionStyles.textColor;
    }
    if (!isLight && sectionStyles.boxColor) sectionStyle['--industries-box-bg'] = sectionStyles.boxColor;

    return (
        <section id="industries" className={`${styles.industries} ${lightBandClass}`.trim()} style={sectionStyle}>
            <div className="container">
                <ScrollReveal>
                    <h2 className="section-title">Focus Industries</h2>
                </ScrollReveal>
                <div className={styles.grid}>
                    {industries.map((sector, index) => {
                        const IconComponent = ICON_MAP[sector.icon] || Fuel;
                        return (
                            <ScrollReveal key={index} staggerIndex={index} width="100%">
                                <motion.div 
                                    className={styles.item}
                                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                                >
                                    <div className={styles.iconBox}>
                                        <IconComponent className={styles.icon} />
                                    </div>
                                    <span>{sector.name}</span>
                                </motion.div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Industries;


