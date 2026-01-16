import React from 'react';
import styles from './Industries.module.css';
import { Fuel, GraduationCap, Car, HardHat, Building, Truck, Factory, Cpu } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

const ICON_MAP = {
    Fuel, GraduationCap, Car, HardHat, Building, Truck, Factory, Cpu
};

const Industries = () => {
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

    const { content } = usePageContent('home', { industries: defaultIndustries });
    const industries = content.industries || defaultIndustries;

    return (
        <section id="industries" className={styles.industries}>
            <div className="container">
                <h2 className="section-title">Focus Industries</h2>
                <div className={styles.grid}>
                    {industries.map((sector, index) => {
                        const IconComponent = ICON_MAP[sector.icon] || Fuel;
                        return (
                            <div key={index} className={styles.item}>
                                <div className={styles.iconBox}>
                                    <IconComponent className={styles.icon} />
                                </div>
                                <span>{sector.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Industries;


