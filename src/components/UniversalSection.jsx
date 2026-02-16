import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Image as ImageIcon, Building2, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const UniversalSection = ({ section, containerClass = "" }) => {
    const { title, subtitle, content, items = [], styles = {} } = section;
    const layoutType = styles.layoutType || 'standard';

    const [openItems, setOpenItems] = useState({});

    const toggleAccordion = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const getIcon = (iconName) => {
        if (!iconName) return null;
        const Icon = LucideIcons[iconName];
        return Icon ? <Icon size={20} /> : null;
    };

    const parseMarkdown = (text) => {
        if (!text) return '';
        return text
            .replace(/^### (.*$)/gm, '<h3 class="universal-h3">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 class="universal-h2">$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .split('\n')
            .map(line => line.trim().startsWith('<li') || line.trim().startsWith('<h') ? line : `<p>${line}</p>`)
            .join('\n');
    };

    const displayItems = items.length > 0 ? items : (content ? content.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => ({ title: line.trim().substring(1).trim() })) : []);

    // Determine section colors
    const isDarkBg = styles.bgColor === '#0A2540' || styles.bgColor === '#0A1628' || styles.bgColor === '#1A365D';
    const titleColor = styles.textColor || (isDarkBg ? '#FFFFFF' : '#0A3D62');
    const subtitleColor = isDarkBg ? 'rgba(255,255,255,0.7)' : '#64748B';
    const cardBg = isDarkBg ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)';
    const cardBorder = isDarkBg ? 'rgba(255,255,255,0.12)' : 'rgba(10, 61, 98, 0.08)';
    const itemTextColor = isDarkBg ? '#FFFFFF' : '#1A365D';
    const itemDescColor = isDarkBg ? 'rgba(255,255,255,0.65)' : '#64748B';
    const accentColor = '#C9A227';

    const renderHeader = () => (
        <div style={{
            marginBottom: '3rem',
            textAlign: styles.textAlign || 'center',
            maxWidth: '800px',
            margin: `0 auto ${displayItems.length > 0 || content ? '3rem' : '0'} auto`
        }}>
            {title && (
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        color: titleColor,
                        marginBottom: subtitle ? '1rem' : '0',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2
                    }}
                >
                    {title}
                </motion.h2>
            )}
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    style={{
                        fontSize: '1.1rem',
                        color: subtitleColor,
                        lineHeight: 1.7,
                        maxWidth: '650px',
                        margin: '0 auto'
                    }}
                >
                    {subtitle}
                </motion.p>
            )}
            {/* Gold accent line */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                    height: '3px',
                    width: '60px',
                    background: 'linear-gradient(90deg, #C9A227, #E8D48B)',
                    margin: '1.5rem auto 0',
                    borderRadius: '2px',
                    transformOrigin: 'center'
                }}
            />
        </div>
    );

    const renderLayout = () => {
        switch (layoutType) {
            case 'list':
                return (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1rem',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1.25rem 1.5rem',
                                    background: cardBg,
                                    border: `1px solid ${cardBorder}`,
                                    borderRadius: '12px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'default'
                                }}
                                whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(10, 61, 98, 0.1)' }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: isDarkBg ? 'rgba(201, 162, 39, 0.15)' : 'rgba(10, 61, 98, 0.06)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    color: accentColor
                                }}>
                                    {getIcon(item.icon) || <CheckCircle2 size={18} />}
                                </div>
                                <div>
                                    <span style={{
                                        fontWeight: 600,
                                        color: itemTextColor,
                                        fontSize: '0.95rem'
                                    }}>{item.title}</span>
                                    {item.description && (
                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: itemDescColor,
                                            marginTop: '0.25rem',
                                            lineHeight: 1.5
                                        }}>{item.description}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'grid':
                return (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6, boxShadow: '0 12px 35px rgba(10, 61, 98, 0.12)' }}
                                style={{
                                    padding: '2rem',
                                    background: cardBg,
                                    border: `1px solid ${cardBorder}`,
                                    borderRadius: '16px',
                                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Top accent bar */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #C9A227, #E8D48B)',
                                    opacity: 0.6
                                }} />
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: isDarkBg ? 'rgba(201, 162, 39, 0.15)' : 'linear-gradient(135deg, rgba(10, 61, 98, 0.08), rgba(10, 61, 98, 0.04))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.25rem',
                                    color: isDarkBg ? accentColor : '#0A3D62'
                                }}>
                                    {getIcon(item.icon) || <CheckCircle2 size={22} />}
                                </div>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    color: itemTextColor,
                                    marginBottom: '0.75rem',
                                    fontFamily: 'var(--font-heading)',
                                    letterSpacing: '-0.01em'
                                }}>{item.title}</h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: itemDescColor,
                                    lineHeight: 1.7,
                                    margin: 0
                                }}>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'cards':
                return (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(10, 61, 98, 0.15)' }}
                                style={{
                                    padding: '2.5rem',
                                    background: cardBg,
                                    border: `1px solid ${cardBorder}`,
                                    borderRadius: '20px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                                }}
                            >
                                {/* Gold gradient top line */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #C9A227, #E8D48B, #C9A227)'
                                }} />
                                {/* Corner accent */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-30px', right: '-30px',
                                    width: '100px', height: '100px',
                                    borderRadius: '50%',
                                    background: isDarkBg ? 'rgba(201, 162, 39, 0.06)' : 'rgba(10, 61, 98, 0.03)',
                                    pointerEvents: 'none'
                                }} />
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    background: isDarkBg ? 'rgba(201, 162, 39, 0.12)' : 'linear-gradient(135deg, rgba(10, 61, 98, 0.06), rgba(30, 111, 159, 0.06))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    color: isDarkBg ? accentColor : '#0A3D62',
                                    border: `1px solid ${isDarkBg ? 'rgba(201, 162, 39, 0.2)' : 'rgba(10, 61, 98, 0.08)'}`
                                }}>
                                    {getIcon(item.icon) || <CheckCircle2 size={24} />}
                                </div>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: itemTextColor,
                                    marginBottom: '0.75rem',
                                    fontFamily: 'var(--font-heading)',
                                    letterSpacing: '-0.01em'
                                }}>{item.title}</h3>
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: itemDescColor,
                                    lineHeight: 1.8,
                                    margin: 0
                                }}>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'accordion':
                return (
                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                style={{
                                    background: cardBg,
                                    border: `1px solid ${openItems[i] ? accentColor + '40' : cardBorder}`,
                                    borderRadius: '14px',
                                    overflow: 'hidden',
                                    transition: 'border-color 0.3s ease'
                                }}
                            >
                                <button
                                    onClick={() => toggleAccordion(i)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem 1.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'background 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            color: openItems[i] ? accentColor : (isDarkBg ? '#94A3B8' : '#64748B'),
                                            flexShrink: 0
                                        }}>
                                            {getIcon(item.icon) || <CheckCircle2 size={20} />}
                                        </div>
                                        <span style={{
                                            fontWeight: 600,
                                            color: itemTextColor,
                                            fontSize: '1rem'
                                        }}>{item.title}</span>
                                    </div>
                                    <div style={{
                                        color: isDarkBg ? '#94A3B8' : '#94A3B8',
                                        transition: 'transform 0.3s ease',
                                        transform: openItems[i] ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openItems[i] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{
                                                padding: '0 1.5rem 1.5rem',
                                                borderTop: `1px solid ${cardBorder}`,
                                                paddingTop: '1.25rem',
                                                color: itemDescColor,
                                                lineHeight: 1.7,
                                                fontSize: '0.95rem'
                                            }}>
                                                {item.description}
                                                {item.content && <div style={{ marginTop: '1rem' }}>{item.content}</div>}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'icon-group':
                return (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '2rem',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(10, 61, 98, 0.1)' }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    width: '140px',
                                    padding: '1.5rem 1rem',
                                    background: cardBg,
                                    border: `1px solid ${cardBorder}`,
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '50%',
                                    background: isDarkBg ? 'rgba(201, 162, 39, 0.12)' : 'linear-gradient(135deg, rgba(10, 61, 98, 0.06), rgba(30, 111, 159, 0.04))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '0.75rem',
                                    color: isDarkBg ? accentColor : '#0A3D62',
                                    border: `1px solid ${isDarkBg ? 'rgba(201, 162, 39, 0.2)' : 'rgba(10, 61, 98, 0.08)'}`
                                }}>
                                    {getIcon(item.icon) || <CheckCircle2 size={20} />}
                                </div>
                                <h4 style={{
                                    fontWeight: 700,
                                    color: itemTextColor,
                                    fontSize: '0.85rem',
                                    lineHeight: 1.3,
                                    fontFamily: 'var(--font-heading)'
                                }}>{item.title}</h4>
                                {item.description && (
                                    <p style={{
                                        fontSize: '0.7rem',
                                        color: itemDescColor,
                                        marginTop: '0.4rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>{item.description}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                );

            case 'mind-map':
                // Render as a clean hub-and-spoke card grid instead of the broken SVG connector
                return (
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        {/* Central hub */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            style={{
                                textAlign: 'center',
                                marginBottom: '2rem'
                            }}
                        >
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0A3D62, #1E6F9F)',
                                color: 'white',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                boxShadow: '0 8px 30px rgba(10, 61, 98, 0.25), 0 0 0 4px rgba(201, 162, 39, 0.2)',
                                textAlign: 'center',
                                padding: '1rem',
                                lineHeight: 1.2
                            }}>
                                {title}
                            </div>
                        </motion.div>
                        {/* Spoke cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem'
                        }}>
                            {displayItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(10, 61, 98, 0.1)' }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem 1.25rem',
                                        background: cardBg,
                                        border: `1px solid ${cardBorder}`,
                                        borderRadius: '50px',
                                        fontWeight: 600,
                                        color: itemTextColor,
                                        fontSize: '0.9rem',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                                    }}
                                >
                                    <div style={{ color: accentColor, flexShrink: 0 }}>
                                        {getIcon(item.icon) || <ArrowRight size={18} />}
                                    </div>
                                    {item.title}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );

            case 'boxed-group':
                return (
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{
                                background: 'white',
                                border: '1px solid rgba(10, 61, 98, 0.1)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 30px rgba(10, 61, 98, 0.08)'
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0A3D62, #1E6F9F)',
                                color: 'white',
                                padding: '1.25rem 2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                letterSpacing: '0.5px'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    background: 'rgba(255,255,255,0.15)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Building2 size={18} />
                                </div>
                                <span>{section.groupTitle || styles.groupTitle || 'Institutional Core'}</span>
                            </div>
                            {/* Content Grid */}
                            <div style={{
                                padding: '1.5rem',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '1rem'
                            }}>
                                {displayItems.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{
                                            padding: '1.25rem',
                                            background: '#F8FAFC',
                                            border: '1px solid rgba(10, 61, 98, 0.06)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '0.75rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{
                                            color: accentColor,
                                            flexShrink: 0,
                                            marginTop: '2px'
                                        }}>
                                            {getIcon(item.icon) || <CheckCircle2 size={18} />}
                                        </div>
                                        <div>
                                            <h4 style={{
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                                color: '#0A3D62',
                                                fontFamily: 'var(--font-heading)',
                                                marginBottom: '0.25rem'
                                            }}>{item.title}</h4>
                                            {item.description && (
                                                <p style={{
                                                    fontSize: '0.8rem',
                                                    color: '#64748B',
                                                    lineHeight: 1.5,
                                                    margin: 0
                                                }}>{item.description}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {content && (
                                <div style={{
                                    padding: '1.25rem 2rem',
                                    background: '#F8FAFC',
                                    borderTop: '1px solid rgba(10, 61, 98, 0.06)',
                                    fontSize: '0.9rem',
                                    color: '#64748B',
                                    fontStyle: 'italic',
                                    textAlign: 'center'
                                }}>
                                    {content}
                                </div>
                            )}
                        </motion.div>
                    </div>
                );

            case 'image-grid':
                return (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6, boxShadow: '0 15px 40px rgba(10, 61, 98, 0.15)' }}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(10, 61, 98, 0.06)',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                                    transition: 'all 0.4s ease'
                                }}
                            >
                                <div style={{
                                    aspectRatio: '4/3',
                                    background: '#F1F5F9',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.6s ease'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#CBD5E1'
                                        }}>
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: '#1A365D',
                                        marginBottom: '0.5rem',
                                        fontFamily: 'var(--font-heading)'
                                    }}>{item.title}</h3>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: '#64748B',
                                        lineHeight: 1.6,
                                        margin: 0
                                    }}>{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                );

            default: // standard
                return (
                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        textAlign: styles.textAlign || 'left'
                    }}>
                        {content && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                style={{
                                    padding: '2.5rem',
                                    background: cardBg,
                                    border: `1px solid ${cardBorder}`,
                                    borderRadius: '20px',
                                    boxShadow: isDarkBg ? 'none' : '0 2px 15px rgba(0,0,0,0.04)'
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '1.05rem',
                                        lineHeight: 1.9,
                                        color: isDarkBg ? 'rgba(255,255,255,0.85)' : '#4A5568'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
                                />
                            </motion.div>
                        )}
                    </div>
                );
        }
    };

    return (
        <section
            id={section.id}
            className={containerClass}
            style={{
                padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem)',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: styles.bgColor || 'transparent',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : 'none',
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Background Overlay */}
            {styles.backgroundImage && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: 'none',
                        backgroundColor: 'black',
                        opacity: styles.overlayOpacity || 0.4
                    }}
                />
            )}

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 10
            }}>
                {renderHeader()}
                {renderLayout()}
            </div>
        </section>
    );
};

export default UniversalSection;
