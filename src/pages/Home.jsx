import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Industries from '../components/Industries';
import { usePageContent } from '../hooks/usePageContent';

// Map section IDs to components
const SECTION_COMPONENTS = {
    hero: Hero,
    services: Services,
    industries: Industries,
};

const Home = () => {
    // Fetch home content including section order
    const { content } = usePageContent('home', {
        tabOrder: ['hero', 'services', 'industries']
    });

    // Get section order from database or use default
    const sectionOrder = content.tabOrder || ['hero', 'services', 'industries'];

    return (
        <>
            {sectionOrder.map((sectionId, index) => {
                // Check for custom section
                if (sectionId.startsWith('custom-')) {
                    const section = content.customSections?.find(s => s.id === sectionId);
                    if (section) {
                        // If it's the first section, add padding-top to account for fixed navbar
                        // If it's the first section, add padding-top to account for fixed navbar
                        const isFirst = index === 0;
                        const bgImage = section.backgroundImage;

                        const sectionStyle = {
                            backgroundColor: section.bgColor || '#FFFFFF',
                            paddingTop: isFirst ? '120px' : '64px', // 120px = 80px nav + 40px spacing
                            paddingBottom: '64px',
                            color: section.textColor || '#1A365D',
                            textAlign: section.textAlign || 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        };

                        return (
                            <section key={sectionId} style={sectionStyle}>
                                {/* Background Image & Overlay */}
                                {bgImage && (
                                    <>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundImage: `url(${bgImage})`,
                                                backgroundSize: section.backgroundSize || 'cover',
                                                backgroundPosition: 'center',
                                                zIndex: 0
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: `rgba(0,0,0,${section.overlayOpacity !== undefined ? section.overlayOpacity : 0.4})`,
                                                zIndex: 1
                                            }}
                                        />
                                    </>
                                )}

                                <div className="container mx-auto px-4 relative z-10">
                                    <h2 className="text-3xl font-heading mb-8" style={{ color: 'inherit' }}>{section.title}</h2>

                                    {section.subtitle && (
                                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto" style={{ color: 'inherit' }}>{section.subtitle}</p>
                                    )}

                                    <div className="max-w-4xl mx-auto">
                                        {(section.blocks?.length > 0) ? (
                                            <div className="space-y-6">
                                                {section.blocks.map(block => {
                                                    if (block.type === 'image') {
                                                        return (
                                                            <div key={block.id} style={{ textAlign: block.align || 'center' }}>
                                                                {block.url && (
                                                                    <img
                                                                        src={block.url}
                                                                        alt={block.alt || 'section image'}
                                                                        style={{
                                                                            width: block.width || '100%',
                                                                            maxWidth: '100%',
                                                                            display: 'inline-block',
                                                                            borderRadius: '0.5rem'
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    if (block.type === 'button') {
                                                        return (
                                                            <div key={block.id} style={{ textAlign: block.align || 'center' }}>
                                                                <a
                                                                    href={block.link || '#'}
                                                                    className={`px-8 py-3 rounded text-sm uppercase tracking-wider font-bold transition-all inline-block hover:opacity-90 ${block.variant === 'solid'
                                                                        ? 'bg-[#1A365D] text-white'
                                                                        : 'border-2 border-[#1A365D] text-[#1A365D] bg-transparent'
                                                                        }`}
                                                                    style={{
                                                                        // Dynamic overrides for custom text colors
                                                                        ...(section.textColor && section.textColor !== '#1A365D' ? {
                                                                            borderColor: section.textColor,
                                                                            color: block.variant === 'solid' ? (section.bgColor === '#FFFFFF' ? '#fff' : section.bgColor) : section.textColor,
                                                                            backgroundColor: block.variant === 'solid' ? section.textColor : 'transparent'
                                                                        } : {})
                                                                    }}
                                                                >
                                                                    {block.content || 'Button'}
                                                                </a>
                                                            </div>
                                                        )
                                                    }
                                                    // Text block
                                                    return (
                                                        <div key={block.id} className="prose prose-lg max-w-none" style={{
                                                            textAlign: block.align || 'left',
                                                            color: block.color || 'inherit'
                                                        }}>
                                                            <div className="whitespace-pre-wrap" style={{ color: 'inherit' }}>{block.content}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            // Legacy Fallback
                                            <div className="prose prose-lg whitespace-pre-wrap" style={{
                                                color: 'inherit',
                                                marginLeft: 'auto',
                                                marginRight: 'auto'
                                            }}>
                                                <div style={{ color: 'inherit' }}>{section.content}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        );
                    }
                    return null;
                }

                const SectionComponent = SECTION_COMPONENTS[sectionId];
                if (!SectionComponent) return null;
                // Hero component handles its own top padding via CSS
                return <SectionComponent key={sectionId} />;
            })}
        </>
    );
};

export default Home;
