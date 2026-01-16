import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { Mail, MapPin, Phone, Loader2 } from 'lucide-react';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { usePageContent } from '../hooks/usePageContent';
import { Toaster } from 'react-hot-toast';

const Contact = () => {
    // Default content
    const defaultContent = {
        pageHero: {
            title: 'Contact Us',
            subtitle: 'Inquiries regarding strategic capital, institutional partnerships, and industrial growth.'
        },
        contactInfo: {
            address: {
                title: 'Our Office',
                lines: [
                    'Level 27 Penthouse,',
                    'Centrepoint North, Mid Valley City,',
                    '59200 Kuala Lumpur, Malaysia'
                ]
            },
            phones: {
                title: 'Contact Numbers',
                numbers: ['+603-2022 5208', '+6011-6364 1142']
            },
            email: {
                title: 'Email',
                address: 'admin@instrakventurecapital.com'
            }
        },
        formLabels: {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message',
            submitButton: 'Send Message'
        }
    };

    const { content, loading: contentLoading } = usePageContent('contact_page', defaultContent);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const { submitForm, loading: formLoading } = useFormSubmit('contact');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitted = await submitForm(formData);
        if (submitted) {
            setFormData({ name: '', email: '', subject: '', message: '' });
        }
    };

    // Use loaded content or defaults
    const pageHero = content?.pageHero || defaultContent.pageHero;
    const contactInfo = content?.contactInfo || defaultContent.contactInfo;
    const formLabels = content?.formLabels || defaultContent.formLabels;

    const inputStyle = { width: '100%', padding: '0.9rem', background: '#FFFFFF', border: '1px solid rgba(26, 54, 93, 0.2)', color: '#1A365D', borderRadius: '6px', fontSize: '0.95rem' };
    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#1A365D' };

    if (contentLoading) {
        return (
            <div className="page-wrapper flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={48} />
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Toaster position="top-right" />
            <PageHero 
                title={pageHero.title} 
                subtitle={pageHero.subtitle}
            />
            <div className="container" style={{ padding: '80px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Get in Touch</h2>
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <MapPin style={{ color: 'var(--accent-secondary)' }} />
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem' }}>{contactInfo.address.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        {contactInfo.address.lines.map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}<br />
                                            </React.Fragment>
                                        ))}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Phone style={{ color: 'var(--accent-secondary)' }} />
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem' }}>{contactInfo.phones.title}</h4>
                                    {contactInfo.phones.numbers.map((num, i) => (
                                        <p key={i} style={{ color: 'var(--text-secondary)' }}>{num}</p>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Mail style={{ color: 'var(--accent-secondary)' }} />
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem' }}>{contactInfo.email.title}</h4>
                                    <p style={{ color: 'var(--accent-primary)' }}>{contactInfo.email.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div 
                        className="glass-card" 
                        style={{ padding: '2.5rem', background: '#FFFFFF', border: '1px solid rgba(26, 54, 93, 0.12)', boxShadow: '0 4px 20px rgba(26, 54, 93, 0.08)' }}
                    >
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>{formLabels.name}</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={formLabels.name}
                                    style={inputStyle} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>{formLabels.email}</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={formLabels.email}
                                    style={inputStyle} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>{formLabels.subject}</label>
                                <input 
                                    type="text" 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder={formLabels.subject}
                                    style={inputStyle} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={labelStyle}>{formLabels.message}</label>
                                <textarea 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5" 
                                    placeholder={formLabels.message}
                                    style={{ ...inputStyle, resize: 'vertical' }} 
                                    required
                                ></textarea>
                            </div>
                            <button 
                                className="btn-solid" 
                                type="submit" 
                                style={{ width: '100%', opacity: formLoading ? 0.7 : 1 }}
                                disabled={formLoading}
                            >
                                {formLoading ? 'Sending...' : formLabels.submitButton}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
