import React, { useState } from 'react';
import baseStyles from './DynamicForm.module.css';
import { Toaster } from 'react-hot-toast';

const radiusMap = { none: '0px', sm: '6px', md: '12px', lg: '16px', xl: '24px' };
const shadowMap = {
    none: 'none',
    subtle: '0 4px 20px rgba(26, 54, 93, 0.08)',
    medium: '0 8px 30px rgba(26, 54, 93, 0.12)',
    strong: '0 12px 40px rgba(26, 54, 93, 0.18)',
};

const DynamicForm = ({ fields = [], title, onSubmit, loading, formStyles = {} }) => {
    const fs = formStyles;
    const [formData, setFormData] = useState(() => {
        const initial = {};
        fields.forEach(field => {
            if (field.type === 'checkbox') {
                initial[field.id] = false;
            } else if (field.type === 'select') {
                initial[field.id] = ''; // Empty string for select to show placeholder
            } else {
                initial[field.id] = '';
            }
        });
        return initial;
    });
    const [hovering, setHovering] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(formData);
        if (success) {
            const resetData = {};
            fields.forEach(field => { resetData[field.id] = field.type === 'checkbox' ? false : ''; });
            setFormData(resetData);
        }
    };

    if (!fields || fields.length === 0) {
        return (
            <div className={baseStyles.formContainer}>
                <p className="text-center text-gray-500">This service does not have an inquiry form configured yet.</p>
            </div>
        );
    }

    const cardRadius = radiusMap[fs.cardRadius] || '12px';
    const inputRadius = radiusMap[fs.inputRadius] || '6px';
    const btnRadius = radiusMap[fs.btnRadius] || '6px';
    const cardShadow = shadowMap[fs.cardShadow] || shadowMap.subtle;
    const inputBorder = fs.inputBorderColor || 'rgba(26, 54, 93, 0.2)';
    const inputFocus = fs.inputFocusColor || '#B8860B';

    const cardStyle = {
        background: fs.cardBg || '#FFFFFF',
        borderRadius: cardRadius,
        border: `1px solid ${fs.cardBorderColor || 'rgba(26, 54, 93, 0.1)'}`,
        boxShadow: cardShadow,
        padding: 'clamp(2rem, 4vw, 3rem)',
        position: 'relative',
        overflow: 'hidden',
    };

    // Modern input styling with better visual hierarchy
    const inputStyle = {
        width: '100%', 
        padding: '1rem 1.125rem', 
        fontSize: '1rem', 
        outline: 'none',
        border: `1.5px solid ${inputBorder}`, 
        borderRadius: inputRadius,
        color: fs.labelColor || '#1A365D',
        background: fs.inputBg || '#FFFFFF',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'inherit',
        lineHeight: '1.5',
    };

    // Enhanced label styling
    const labelStyle = {
        display: 'block', 
        fontWeight: 600, 
        fontSize: '0.875rem',
        color: fs.labelColor || '#1A365D',
        marginBottom: '0.5rem',
        letterSpacing: '0.01em',
    };

    const headingStyle = {
        fontSize: '1.25rem', 
        fontWeight: 700, 
        marginTop: '2rem', 
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        color: fs.headingColor || '#1A365D',
        borderBottom: fs.headingSeparator !== false ? `2px solid ${fs.headingColor || '#1A365D'}20` : 'none',
        letterSpacing: '-0.01em',
    };

    const btnBg = fs.btnBg || '#1A365D';
    const btnHoverBg = fs.btnHoverBg || '#152c4a';
    const btnText = fs.btnText || '#FFFFFF';
    const btnStyleType = fs.btnStyle || 'solid';

    const getButtonStyle = () => {
        const base = {
            width: '100%', 
            padding: '1.125rem 2rem', 
            fontWeight: 600, 
            fontSize: '1rem',
            cursor: 'pointer', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            marginTop: '1.5rem',
            borderRadius: btnRadius,
            letterSpacing: '0.01em',
            textTransform: 'none',
            position: 'relative',
            overflow: 'hidden',
        };
        if (btnStyleType === 'outline') {
            return { 
                ...base, 
                background: hovering ? btnBg : 'transparent', 
                color: hovering ? btnText : btnBg, 
                border: `2px solid ${btnBg}`,
                ...(hovering ? { transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${btnBg}40` } : {})
            };
        }
        if (btnStyleType === 'gradient') {
            return { 
                ...base, 
                background: `linear-gradient(135deg, ${btnBg}, ${btnHoverBg})`, 
                color: btnText, 
                border: 'none', 
                ...(hovering ? { 
                    filter: 'brightness(1.1)', 
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${btnBg}50`
                } : {}) 
            };
        }
        return { 
            ...base, 
            background: hovering ? btnHoverBg : btnBg, 
            color: btnText, 
            border: 'none', 
            ...(hovering ? { 
                transform: 'translateY(-2px)', 
                boxShadow: `0 8px 24px ${btnBg}50`
            } : {
                boxShadow: `0 4px 12px ${btnBg}30`
            }) 
        };
    };

    const placeholderColor = fs.placeholderColor || '#9CA3AF';
    
    const focusCss = `
        .df-input::placeholder { 
            color: ${placeholderColor} !important; 
            opacity: 1;
        }
        .df-input::-webkit-input-placeholder { 
            color: ${placeholderColor} !important; 
            opacity: 1;
        }
        .df-input::-moz-placeholder { 
            color: ${placeholderColor} !important; 
            opacity: 1;
        }
        .df-input:-ms-input-placeholder { 
            color: ${placeholderColor} !important; 
            opacity: 1;
        }
        .df-textarea::placeholder { 
            color: ${placeholderColor} !important; 
            opacity: 1;
        }
        .df-textarea::-webkit-input-placeholder { 
            color: ${placeholderColor} !important; 
            opacity: 1;
        }
        .df-textarea::-moz-placeholder { 
            color: ${placeholderColor} !important; 
            opacity: 1;
        }
        .df-textarea:-ms-input-placeholder { 
            color: ${placeholderColor} !important; 
            opacity: 1;
        }
        .df-input:focus { 
            border-color: ${inputFocus} !important; 
            box-shadow: 0 0 0 4px ${inputFocus}15, 0 2px 8px ${inputFocus}10 !important; 
            transform: translateY(-1px);
        }
        .df-select { 
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .df-select:focus { 
            border-color: ${inputFocus} !important; 
            box-shadow: 0 0 0 4px ${inputFocus}15, 0 2px 8px ${inputFocus}10 !important; 
            transform: translateY(-1px);
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='${encodeURIComponent(inputFocus)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
        }
        .df-select:hover:not(:focus) {
            border-color: ${inputBorder}dd;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='${encodeURIComponent(inputFocus)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
        }
        .df-select option {
            padding: 0.75rem;
            background: ${fs.inputBg || '#FFFFFF'};
        }
        .df-select option:checked {
            background: ${inputFocus}15;
            color: ${fs.labelColor || '#1A365D'};
        }
        .df-textarea:focus { 
            border-color: ${inputFocus} !important; 
            box-shadow: 0 0 0 4px ${inputFocus}15, 0 2px 8px ${inputFocus}10 !important; 
            transform: translateY(-1px);
        }
        .df-input:hover:not(:focus), .df-textarea:hover:not(:focus) {
            border-color: ${inputBorder}dd;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }
        @media (max-width: 768px) {
            .form-grid-responsive {
                grid-template-columns: 1fr !important;
            }
        }
    `;

    return (
        <div style={cardStyle}>
            <style>{focusCss}</style>
            <Toaster position="top-right" />
            {title && (
                <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    marginBottom: '2rem', 
                    color: fs.labelColor || 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.2'
                }}>
                    {title}
                </h3>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
                    gap: '1.75rem', 
                    marginBottom: '2rem'
                }}
                className="form-grid-responsive"
                >
                    {fields.map((field) => {
                        if (field.type === 'heading') {
                            return (
                                <div key={field.id} style={{ gridColumn: 'span 2' }}>
                                    <h3 style={headingStyle}>{field.label}</h3>
                                </div>
                            );
                        }
                        if (field.type === 'section') {
                            return (
                                <div key={field.id} style={{ gridColumn: 'span 2' }}>
                                    <hr style={{ 
                                        margin: '2rem 0', 
                                        border: 'none',
                                        borderTop: '1px solid rgba(0,0,0,0.08)',
                                        height: '1px'
                                    }} />
                                </div>
                            );
                        }

                        return (
                            <div 
                                key={field.id} 
                                style={{ 
                                    gridColumn: field.width === 'half' ? 'span 1' : 'span 2', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    position: 'relative'
                                }}
                            >
                                {field.type !== 'checkbox' && (
                                    <label style={labelStyle} htmlFor={field.id}>
                                        {field.label} 
                                        {field.required && <span style={{ color: inputFocus, marginLeft: '0.25rem' }}>*</span>}
                                    </label>
                                )}

                                {field.type === 'select' ? (
                                    <div style={{ position: 'relative' }}>
                                        <select 
                                            id={field.id} 
                                            name={field.id} 
                                            value={formData[field.id] || ''} 
                                            onChange={handleChange}
                                            className="df-select" 
                                            style={{
                                                ...inputStyle,
                                                appearance: 'none',
                                                WebkitAppearance: 'none',
                                                MozAppearance: 'none',
                                                paddingRight: '3rem',
                                                cursor: 'pointer',
                                                color: formData[field.id] ? (fs.labelColor || '#1A365D') : placeholderColor,
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='${encodeURIComponent(formData[field.id] ? (fs.labelColor || '#1A365D') : placeholderColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 1rem center',
                                                backgroundSize: '12px 8px',
                                            }} 
                                            required={field.required}
                                        >
                                            <option value="" style={{ color: placeholderColor }}>
                                                {field.placeholder || 'Select option...'}
                                            </option>
                                            {field.options?.map((opt, i) => (
                                                <option key={`${field.id}-opt-${i}`} value={opt} style={{ color: fs.labelColor || '#1A365D' }}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : field.type === 'textarea' ? (
                                    <textarea 
                                        id={field.id} 
                                        name={field.id} 
                                        value={formData[field.id]} 
                                        onChange={handleChange}
                                        className="df-textarea" 
                                        style={{ ...inputStyle, resize: 'vertical', minHeight: '120px', lineHeight: '1.6' }} 
                                        placeholder={field.placeholder} 
                                        required={field.required} 
                                        rows={5} 
                                    />
                                ) : field.type === 'checkbox' ? (
                                    <label style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '0.875rem', 
                                        cursor: 'pointer', 
                                        userSelect: 'none',
                                        padding: '0.75rem',
                                        borderRadius: inputRadius,
                                        transition: 'background-color 0.2s ease',
                                        marginTop: '0.5rem'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <input 
                                            type="checkbox" 
                                            id={field.id} 
                                            name={field.id} 
                                            checked={formData[field.id]} 
                                            onChange={handleChange}
                                            style={{ 
                                                width: '1.25rem', 
                                                height: '1.25rem', 
                                                accentColor: inputFocus,
                                                cursor: 'pointer'
                                            }} 
                                            required={field.required} 
                                        />
                                        <span style={labelStyle}>
                                            {field.label} 
                                            {field.required && <span style={{ color: inputFocus, marginLeft: '0.25rem' }}>*</span>}
                                        </span>
                                    </label>
                                ) : (
                                    <input 
                                        type={field.type} 
                                        id={field.id} 
                                        name={field.id} 
                                        value={formData[field.id]} 
                                        onChange={handleChange}
                                        className="df-input" 
                                        style={inputStyle} 
                                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} 
                                        required={field.required} 
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <button type="submit" disabled={loading}
                    style={{ ...getButtonStyle(), opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                    {loading ? 'Submitting...' : (fs.btnLabel || 'Submit profile')}
                </button>
            </form>
        </div>
    );
};

export default DynamicForm;
