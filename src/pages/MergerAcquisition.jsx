import React from 'react';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

const MergerAcquisition = () => {
    return (
        <div className="page-wrapper">
            <PageHero
                title="Merger & Acquisition (M&A)"
                subtitle="Expert guidance through complex M&A transactions, negotiations, and strategic integrations."
            />

            <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #1A365D 0%, #B8860B 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <Users size={40} color="#FFFFFF" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1A365D' }}>Coming Soon</h2>
                        <p style={{ fontSize: '1.1rem', color: '#4A5568', lineHeight: '1.8', marginBottom: '2rem' }}>
                            Service details available upon request. Contact our team to learn more about our Merger & Acquisition (M&A) advisory services.
                        </p>
                        <Link to="/contact" className="btn-solid" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            Contact Us <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MergerAcquisition;
