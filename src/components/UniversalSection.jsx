import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const UniversalSection = ({ section, containerClass = "" }) => {
    const { title, subtitle, content, items = [], styles = {} } = section;
    const layoutType = styles.layoutType || 'standard';

    // Internal state for accordions
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
        return Icon ? <Icon size={20} className="text-[var(--accent-primary)]" /> : null;
    };

    // Helper to parse basic markdown to HTML with Luxury Styling
    const parseMarkdown = (text) => {
        if (!text) return '';
        return text
            .replace(/^### (.*$)/gm, '<h3 class="luxury-h3">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 class="luxury-h2">$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^\* (.*$)/gm, '<li class="luxury-li">$1</li>')
            .replace(/^- (.*$)/gm, '<li class="luxury-li">$1</li>')
            .split('\n')
            .map(line => line.trim().startsWith('<li') || line.trim().startsWith('<h') ? line : `<p class="luxury-p">${line}</p>`)
            .join('\n');
    };

    // Helper to parse legacy content if structured items aren't present
    const displayItems = items.length > 0 ? items : (content ? content.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => ({ title: line.trim().substring(1).trim() })) : []);

    const renderHeader = () => (
        <div className={`mb-12 ${styles.textAlign === 'center' ? 'text-center' : ''}`}>
            {title && (
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-heading font-bold mb-4"
                    style={{ color: styles.textColor || '#1A365D' }}
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
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );

    const renderLayout = () => {
        switch (layoutType) {
            case 'list':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-5 luxury-glass rounded-xl luxury-border-gold transition-all hover:scale-[1.02] duration-300"
                            >
                                <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
                                    <CheckCircle2 size={18} className="text-[var(--accent-primary)] shrink-0" />
                                </div>
                                <span className="text-gray-700 font-bold tracking-tight">{item.title}</span>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'grid':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 luxury-glass luxury-border-gold transition-all duration-300 hover:-translate-y-2 rounded-2xl group"
                            >
                                <div className="mb-4 w-12 h-12 bg-[var(--accent-primary)]/10 rounded-xl flex items-center justify-center group-hover:bg-[var(--accent-primary)]/20 transition-colors">
                                    {getIcon(item.icon)}
                                </div>
                                <h3 className="font-bold text-[#1A365D] mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'cards':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8 }}
                                className="luxury-glass p-8 rounded-2xl relative overflow-hidden group luxury-border-gold"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--gradient-gold)]" />
                                <div className="mb-6 w-14 h-14 bg-[var(--accent-primary)]/5 rounded-2xl flex items-center justify-center group-hover:bg-[var(--accent-primary)]/10 transition-colors border border-[var(--accent-primary)]/10">
                                    {getIcon(item.icon) || <CheckCircle2 className="text-[var(--accent-primary)]" />}
                                </div>
                                <h3 className="text-xl font-bold text-[#1A365D] mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'accordion':
                return (
                    <div className="max-w-4xl mx-auto space-y-4">
                        {displayItems.map((item, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                <button
                                    onClick={() => toggleAccordion(i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        {getIcon(item.icon)}
                                        <span className="font-bold text-[#1A365D]">{item.title}</span>
                                    </div>
                                    {openItems[i] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                <AnimatePresence>
                                    {openItems[i] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
                                                {item.description}
                                                {item.content && <div className="mt-4">{item.content}</div>}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                );

            case 'icon-group':
                return (
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center max-w-[150px] group"
                            >
                                <div className="w-16 h-16 bg-[var(--accent-primary)]/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-[var(--accent-primary)]/10 transition-colors border border-[var(--accent-primary)]/10">
                                    {getIcon(item.icon) || <CheckCircle2 className="text-[var(--accent-primary)]" />}
                                </div>
                                <h4 className="font-bold text-[#1A365D] text-sm md:text-base leading-tight">{item.title}</h4>
                                {item.description && <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{item.description}</p>}
                            </motion.div>
                        ))}
                    </div>
                );

            case 'mind-map':
                return (
                    <div className="relative min-h-[400px] flex items-center justify-center p-8 md:p-20 overflow-hidden">
                        {/* Connecting Lines SVG */}
                        <svg className="connector-svg hidden md:block">
                            {displayItems.map((_, i) => {
                                const angle = (i / displayItems.length) * 2 * Math.PI;
                                const x2 = 50 + 35 * Math.cos(angle);
                                const y2 = 50 + 35 * Math.sin(angle);
                                return (
                                    <line
                                        key={i}
                                        x1="50%" y1="50%"
                                        x2={`${x2}%`} y2={`${y2}%`}
                                        className="connector-path"
                                    />
                                );
                            })}
                        </svg>

                        {/* Central Hub */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="luxury-node-hub"
                        >
                            <span className="leading-tight">{title}</span>
                        </motion.div>

                        {/* Satellite Nodes */}
                        <div className="absolute inset-0 hidden md:block">
                            {displayItems.map((item, i) => {
                                const angle = (i / displayItems.length) * 2 * Math.PI;
                                const x = 50 + 35 * Math.cos(angle);
                                const y = 50 + 35 * Math.sin(angle);
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 0, y: 0 }}
                                        whileInView={{ opacity: 1, x: `${(x - 50) * 10}%`, y: `${(y - 50) * 10}%` }}
                                        viewport={{ once: true }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    >
                                        <div className="luxury-node-detail flex items-center gap-2">
                                            {getIcon(item.icon)}
                                            {item.title}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Mobile Fallback - Structured List */}
                        <div className="md:hidden w-full space-y-4">
                            {displayItems.map((item, i) => (
                                <div key={i} className="luxury-node-detail flex items-center gap-3">
                                    {getIcon(item.icon)}
                                    {item.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'boxed-group':
                return (
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="command-box"
                        >
                            <div className="command-box-header">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                    <Building2 size={20} />
                                </div>
                                <span>{section.groupTitle || 'Institutional Core'}</span>
                            </div>
                            <div className="command-box-content">
                                {displayItems.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="command-item luxury-border-gold rounded-lg"
                                    >
                                        <div className="shrink-0">{getIcon(item.icon) || <CheckCircle2 className="text-[var(--accent-primary)]" size={18} />}</div>
                                        <div>
                                            <h4 className="font-bold text-sm text-[var(--accent-primary)]">{item.title}</h4>
                                            {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {content && (
                                <div className="p-8 bg-gray-50 border-t border-gray-100 italic text-sm text-gray-600 text-center">
                                    {content}
                                </div>
                            )}
                        </motion.div>
                    </div>
                );

            case 'image-grid':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-md group hover:shadow-xl transition-all duration-500"
                            >
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                    {item.tags && (
                                        <div className="absolute bottom-3 left-3 flex gap-2">
                                            {item.tags.split(',').map((tag, ti) => (
                                                <span key={ti} className="text-[10px] font-bold uppercase tracking-wider bg-white/90 px-2 py-1 rounded shadow-sm text-[var(--accent-primary)]">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-[#1A365D] text-lg mb-2 uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                );

            default: // standard
                return (
                    <div
                        className="luxury-prose max-w-4xl mx-auto"
                        style={{ textAlign: styles.textAlign || 'left' }}
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
                    />
                );
        }
    };

    return (
        <section
            id={section.id}
            className={`py-20 px-6 relative overflow-hidden ${containerClass}`}
            style={{
                backgroundColor: styles.bgColor || 'transparent',
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : 'none',
                backgroundSize: styles.backgroundSize || 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Background Overlay */}
            {styles.backgroundImage && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ backgroundColor: 'black', opacity: styles.overlayOpacity || 0.4 }}
                />
            )}

            <div className="container relative z-10 mx-auto">
                {renderHeader()}
                {renderLayout()}
            </div>
        </section>
    );
};

export default UniversalSection;
