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
        },
        meetingScheduler: {
            enabled: false,
            required: false,
            dateLabel: 'Preferred Meeting Date',
            timeLabel: 'Preferred Meeting Time',
            helperText: 'Optional — pick a convenient time and our team will confirm availability.',
            minDaysAhead: 1
        }
    };

    const { content, loading: contentLoading } = usePageContent('contact_page', defaultContent);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        meetingDate: '',
        meetingTime: ''
    });
    const { submitForm, loading: formLoading } = useFormSubmit('contact');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const meetingScheduler = { ...defaultContent.meetingScheduler, ...(content?.meetingScheduler || {}) };
        if (meetingScheduler.enabled && meetingScheduler.required) {
            if (!formData.meetingDate || !formData.meetingTime) return;
        }
        const submitted = await submitForm(formData);
        if (submitted) {
            setFormData({ name: '', email: '', subject: '', message: '', meetingDate: '', meetingTime: '' });
        }
    };

    const pageHero = content?.pageHero || defaultContent.pageHero;
    const contactInfo = content?.contactInfo || defaultContent.contactInfo;
    const formLabels = content?.formLabels || defaultContent.formLabels;
    const meetingScheduler = { ...defaultContent.meetingScheduler, ...(content?.meetingScheduler || {}) };
    const styles = content?.styles || {};

    const sectionTitle = styles.sectionTitle ?? 'Get in Touch';
    const sectionBgColor = styles.sectionBgColor || 'transparent';
    const sectionTitleColor = styles.sectionTitleColor || '#1A365D';
    const sectionTextColor = styles.sectionTextColor || '#64748B';
    const sectionAlign = styles.sectionAlign || 'left';

    const contactBlockStyle = styles.contactBlockStyle || 'solid';
    const contactBlockBgColor = styles.contactBlockBgColor || 'transparent';
    const isContactGlass = contactBlockStyle === 'glass';
    const contactHex = (contactBlockBgColor !== 'transparent' ? contactBlockBgColor : '#FFFFFF').replace(/^#/, '');
    const hexToRgba = (hex, a) => { if (hex.length === 6) { const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16); return `rgba(${r},${g},${b},${a})`; } return `rgba(255,255,255,${a})`; };
    const contactBlockBg = isContactGlass ? hexToRgba(contactHex.length === 6 ? contactHex : 'ffffff', 0.42) : (contactBlockBgColor !== 'transparent' ? contactBlockBgColor : 'transparent');
    const contactGlassStyle = isContactGlass ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } : {};
    const contactIconColor = styles.contactIconColor || 'var(--accent-secondary)';

    const formCardStyle = styles.formCardStyle || 'solid';
    const formCardBgColor = styles.formCardBgColor || '#FFFFFF';
    const isFormGlass = formCardStyle === 'glass';
    const formHex = (formCardBgColor || '#FFFFFF').replace(/^#/, '');
    const formCardBg = isFormGlass ? hexToRgba(formHex.length === 6 ? formHex : 'ffffff', 0.42) : (formCardBgColor || '#FFFFFF');
    const formGlassStyle = isFormGlass ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } : {};

    const inputStyle = {
        width: '100%',
        padding: '0.9rem',
        background: styles.formInputBgColor || '#FFFFFF',
        border: `1px solid ${styles.formInputBorderColor || 'rgba(26, 54, 93, 0.2)'}`,
        color: styles.formInputTextColor || '#1A365D',
        borderRadius: styles.formInputBorderRadius ?? '6px',
        fontSize: styles.formInputFontSize ?? '0.95rem'
    };
    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: styles.formLabelColor || '#1A365D' };

    const toDateInputValue = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    const minMeetingDate = (() => {
        const days = Number.isFinite(meetingScheduler.minDaysAhead) ? meetingScheduler.minDaysAhead : 0;
        const dt = new Date();
        dt.setHours(0, 0, 0, 0);
        dt.setDate(dt.getDate() + Math.max(0, days));
        return toDateInputValue(dt);
    })();

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
                style={{ backgroundColor: pageHero.styles?.bgColor }}
                sectionStyles={{
                    titleColor: pageHero.styles?.titleColor,
                    subtitleColor: pageHero.styles?.subtitleColor,
                    titleAlign: pageHero.styles?.textAlign,
                    textAlign: pageHero.styles?.textAlign
                }}
                textColor={pageHero.styles?.titleColor}
            />
            <div
                className="container"
                style={{
                    padding: `${styles.sectionPaddingTop ?? '80px'} ${styles.sectionPaddingHorizontal ?? '20px'} ${styles.sectionPaddingBottom ?? '80px'}`,
                    backgroundColor: sectionBgColor !== 'transparent' ? sectionBgColor : undefined
                }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem' }}>
                    <div style={{ textAlign: sectionAlign }}>
                        <h2 style={{ fontSize: styles.sectionTitleFontSize ?? '2rem', marginBottom: styles.sectionTitleMarginBottom ?? '2rem', color: sectionTitleColor }}>{sectionTitle}</h2>
                        <div style={{
                            display: 'grid',
                            gap: '2rem',
                            background: contactBlockBg !== 'transparent' ? contactBlockBg : undefined,
                            ...(contactBlockBg !== 'transparent' ? {
                                padding: styles.contactBlockPadding ?? '2rem',
                                borderRadius: styles.contactBlockBorderRadius ?? '16px',
                                border: styles.contactBlockBorderColor ? `1px solid ${styles.contactBlockBorderColor}` : '1px solid rgba(0,0,0,0.06)',
                                ...contactGlassStyle
                            } : {})
                        }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <MapPin style={{ color: contactIconColor, flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem', color: sectionTitleColor }}>{contactInfo.address.title}</h4>
                                    <p style={{ color: sectionTextColor }}>
                                        {contactInfo.address.lines.map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}<br />
                                            </React.Fragment>
                                        ))}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Phone style={{ color: contactIconColor, flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem', color: sectionTitleColor }}>{contactInfo.phones.title}</h4>
                                    {contactInfo.phones.numbers.map((num, i) => (
                                        <p key={i} style={{ color: sectionTextColor }}>{num}</p>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Mail style={{ color: contactIconColor, flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem', color: sectionTitleColor }}>{contactInfo.email.title}</h4>
                                    <p style={{ color: contactIconColor }}>{contactInfo.email.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="glass-card"
                        style={{
                            padding: styles.formCardPadding ?? '2.5rem',
                            background: formCardBg,
                            border: styles.formCardBorderColor ? `1px solid ${styles.formCardBorderColor}` : '1px solid rgba(26, 54, 93, 0.12)',
                            boxShadow: styles.formCardBoxShadow || '0 4px 20px rgba(26, 54, 93, 0.08)',
                            ...formGlassStyle
                        }}
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
                            {meetingScheduler.enabled && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>{meetingScheduler.dateLabel}</label>
                                            <input
                                                type="date"
                                                name="meetingDate"
                                                value={formData.meetingDate}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                min={minMeetingDate}
                                                required={!!meetingScheduler.required}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>{meetingScheduler.timeLabel}</label>
                                            <input
                                                type="time"
                                                name="meetingTime"
                                                value={formData.meetingTime}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                step={900}
                                                required={!!meetingScheduler.required}
                                            />
                                        </div>
                                    </div>
                                    {meetingScheduler.helperText && (
                                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: sectionTextColor }}>
                                            {meetingScheduler.helperText}
                                        </p>
                                    )}
                                </div>
                            )}
                            <button
                                className="btn-solid"
                                type="submit"
                                style={{
                                    width: '100%',
                                    opacity: formLoading ? 0.7 : 1,
                                    backgroundColor: styles.formButtonBgColor || '#1A365D',
                                    color: styles.formButtonTextColor || '#FFFFFF',
                                    border: 'none',
                                    padding: styles.formButtonPadding ?? '0.75rem 1.5rem',
                                    borderRadius: styles.formButtonBorderRadius ?? '6px',
                                    fontWeight: styles.formButtonFontWeight ?? 600
                                }}
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
