import React from 'react';
import styles from './About.module.css';
import { ShieldCheck, Eye, Scale } from 'lucide-react';

const About = () => {
    return (
        <section id="about" className={styles.about}>
            <div className="container">
                <h2 className="section-title">Our Foundation</h2>

                <div className={styles.content}>
                    <div className={styles.mission}>
                        <h3>Our Mission</h3>
                        <p>To be the catalyst for sustainable growth in the ASEAN region, bridging the gap between visionary entrepreneurs and strategic capital through disciplined governance and ethical excellence.</p>
                    </div>
                </div>

                <div className={styles.values}>
                    {[
                        { icon: ShieldCheck, title: 'Governance', text: 'We adhere to the highest standards of corporate governance to ensure long-term stability.' },
                        { icon: Eye, title: 'Transparency', text: 'Open communication and clear reporting are at the heart of everything we do.' },
                        { icon: Scale, title: 'Integrity', text: 'Honesty and moral principles guide our investment decisions and partnerships.' }
                    ].map((val, i) => (
                        <div key={i} className={styles.valueCard}>
                            <val.icon size={32} className={styles.valueIcon} />
                            <h4>{val.title}</h4>
                            <p>{val.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;

