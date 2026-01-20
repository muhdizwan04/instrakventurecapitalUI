import React from 'react';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';
import { Coins, ArrowRight } from 'lucide-react';

const Tokenization = () => {
    return (
        <div className="page-wrapper">
            <PageHero
                title="TOKENIZATION"
                subtitle=""
            />

            {/* Introduction */}
            <section style={{ padding: '80px 20px 40px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                         <p style={{ fontSize: '1.15rem', color: '#4A5568', lineHeight: '1.9' }}>
                            Digital asset tokenization solutions for modern investment structures.
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '40px 20px 80px', background: '#FFFFFF' }}>
                <div className="container">
                    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #1A365D 0%, #B8860B 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <Coins size={40} color="#FFFFFF" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1A365D' }}>Coming Soon</h2>
                        <p style={{ fontSize: '1.1rem', color: '#4A5568', lineHeight: '1.8', marginBottom: '2rem' }}>
                            Service details available upon request. Contact our team to learn more about our Tokenization services.
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

export default Tokenization;
