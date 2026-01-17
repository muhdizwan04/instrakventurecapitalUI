import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import { Layout, Building2, MapPin, Calendar, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import projectPlaceholder from '../assets/project-placeholder.png';

const ProjectListing = () => {
    const defaultContent = {
        title: 'Strategic Project Listings',
        subtitle: 'Exclusive access to high-potential industrial and infrastructure developments across the ASEAN region.',
        projects: [
            {
                id: 1,
                title: 'Sustainable Energy Hub Alpha',
                location: 'Kuala Lumpur, Malaysia',
                category: 'Renewable Energy',
                description: 'A cutting-edge renewable energy facility integrating solar-hydrogen production and smart grid management. This project aims to provide sustainable power to the regional industrial corridor.',
                imageUrl: projectPlaceholder,
                valuation: 'RM 1.2 Billion',
                status: 'Expansion Phase'
            },
            {
                id: 2,
                title: 'ASEAN Logistics Gateway',
                location: 'Selangor, Malaysia',
                category: 'Infrastructure',
                description: 'A state-of-the-art automated logistics and distribution center designed to optimize cross-border trade and supply chain efficiency in the ASEAN region.',
                imageUrl: projectPlaceholder,
                valuation: 'RM 850 Million',
                status: 'Initial Development'
            }
        ]
    };

    const { content, loading } = usePageContent('project_listing', defaultContent);

    const title = content.title || defaultContent.title;
    const subtitle = content.subtitle || defaultContent.subtitle;
    const projects = Array.isArray(content.projects) ? content.projects : defaultContent.projects;

    return (
        <div className="page-wrapper">
            {/* Hero Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #0F2942 0%, #1A365D 100%)', 
                padding: '120px 20px 80px', 
                color: '#FFFFFF', 
                textAlign: 'center' 
            }}>
                <div className="container">
                    <h1 style={{ 
                        fontFamily: 'var(--font-heading)', 
                        fontSize: '3.5rem', 
                        fontWeight: '700', 
                        marginBottom: '1.5rem',
                        color: '#FFFFFF'
                    }}>
                        {title}
                    </h1>
                    <p style={{ 
                        fontSize: '1.25rem', 
                        maxWidth: '800px', 
                        margin: '0 auto', 
                        lineHeight: '1.6', 
                        color: 'rgba(255,255,255,0.9)' 
                    }}>
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Project List */}
            <section style={{ padding: '80px 20px', background: '#F8FAFC' }}>
                <div className="container">
                    <div style={{ display: 'grid', gap: '3rem' }}>
                        {projects.map((project, i) => (
                            <div key={i} className="glass-card" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                                gap: '0', 
                                overflow: 'hidden', 
                                borderRadius: '20px',
                                border: '1px solid rgba(26, 54, 93, 0.1)',
                                background: '#FFFFFF',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                            }}>
                                {/* Project Image */}
                                <div style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                                    <img 
                                        src={project.imageUrl || '/assets/project-placeholder.png'} 
                                        alt={project.title} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '20px', 
                                        left: '20px', 
                                        padding: '0.5rem 1rem', 
                                        background: '#B8860B', 
                                        color: '#FFFFFF', 
                                        borderRadius: '30px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: '600',
                                        textTransform: 'uppercase'
                                    }}>
                                        {project.category}
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div style={{ padding: '3rem' }}>
                                    <h3 style={{ fontSize: '2rem', color: '#1A365D', marginBottom: '1rem' }}>{project.title}</h3>
                                    
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                                            <MapPin size={18} /> <span>{project.location}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B8860B', fontWeight: '600' }}>
                                            <TrendingUp size={18} /> <span>Valuation: {project.valuation}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1A365D', fontWeight: '500' }}>
                                            <ShieldCheck size={18} /> <span>{project.status}</span>
                                        </div>
                                    </div>

                                    <p style={{ color: '#4A5568', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '2rem' }}>
                                        {project.description}
                                    </p>

                                    <Link to="/contact" className="btn-solid" style={{ 
                                        background: '#1A365D', 
                                        color: '#FFFFFF', 
                                        padding: '1rem 2rem', 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        gap: '0.5rem' 
                                    }}>
                                        Inquire About Project <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section style={{ padding: '80px 20px', background: '#FFFFFF', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', color: '#1A365D', marginBottom: '1.5rem' }}>Partner with Instrak</h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem', color: '#4A5568', fontSize: '1.1rem' }}>
                        If you have a high-impact project that requires strategic funding and institutional governance, connect with our capital management team.
                    </p>
                    <Link to="/contact" className="btn-outline-gold" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                        Submit Project for Consideration
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ProjectListing;
