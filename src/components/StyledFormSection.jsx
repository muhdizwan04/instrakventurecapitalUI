import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import ProtectedFormSection from './ProtectedFormSection';
import DynamicServiceForm from './DynamicServiceForm';
import { useTheme } from '../context/ThemeContext';
import { isDarkHexColor, isLikelyLightTextColor, normalizeLegacyFormSectionTitle } from '../theme/clientThemeDefaults';

const StyledFormSection = ({ serviceId, serviceName, title, subtitle, fallbackForm, customHeader, noWrapper, maxWidth = '800px', sectionId }) => {
    const { content } = usePageContent('service_pages', { pages: [] });
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const service = content?.pages?.find(p => p.id === serviceId);
    const fs = service?.formStyles || {};

    const rawSectionBg = fs.sectionBg || '#F5F7FA';
    const sectionBg = isLight && isDarkHexColor(rawSectionBg) ? '#F1F5F9' : rawSectionBg;
    const sectionTitle = normalizeLegacyFormSectionTitle(fs.sectionTitle || title || 'Submit profile');
    const sectionSubtitle = fs.sectionSubtitle || subtitle || '';
    const rawTitleColor = fs.sectionTitleColor || '#1A365D';
    const rawSubtitleColor = fs.sectionSubtitleColor || '#4A5568';
    const titleColor =
        isLight && isLikelyLightTextColor(rawTitleColor) ? '#0F172A' : rawTitleColor;
    const subtitleColor =
        isLight && isLikelyLightTextColor(rawSubtitleColor) ? '#475569' : rawSubtitleColor;

    const contentWrapper = (
        <div className="container">
            <div style={{ maxWidth, margin: '0 auto' }}>
                {customHeader || (
                    <>
                        {sectionTitle && (
                            <h2 style={{ 
                                textAlign: 'center', 
                                marginBottom: sectionSubtitle ? '1rem' : '2.5rem', 
                                color: titleColor, 
                                fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', 
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                lineHeight: '1.2'
                            }}>
                                {sectionTitle}
                            </h2>
                        )}
                        {sectionSubtitle && (
                            <p style={{ 
                                textAlign: 'center', 
                                color: subtitleColor, 
                                marginBottom: '3rem', 
                                fontSize: 'clamp(0.95rem, 2vw, 1.125rem)', 
                                lineHeight: 1.7,
                                maxWidth: '700px',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}>
                                {sectionSubtitle}
                            </p>
                        )}
                    </>
                )}
                <ProtectedFormSection serviceName={serviceName || title}>
                    <DynamicServiceForm
                        serviceId={serviceId}
                        title=""
                        fallbackForm={fallbackForm}
                    />
                </ProtectedFormSection>
            </div>
        </div>
    );

    if (noWrapper) {
        return contentWrapper;
    }

    return (
        <section
            id={sectionId}
            className={isLight ? 'lm-band-form' : undefined}
            style={{ padding: '80px 20px', background: isLight ? 'transparent' : sectionBg }}
        >
            {contentWrapper}
        </section>
    );
};

export default StyledFormSection;
