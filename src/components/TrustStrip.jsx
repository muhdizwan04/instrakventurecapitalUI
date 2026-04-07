import React from 'react';
import styles from './TrustStrip.module.css';
import { ShieldCheck, Globe, Scale, ArrowRightLeft } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { useTheme } from '../context/ThemeContext';
import { lightBandAt } from '../theme/lightBands';

const TrustStrip = ({ lightBandIndex }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const defaultSignals = [
        { id: 'sig-1', label: 'Cross-border capital structuring' },
        { id: 'sig-2', label: 'Institutional governance framework' },
        { id: 'sig-3', label: 'Global investor network' },
        { id: 'sig-4', label: 'Strategic asset management' }
    ];

    const defaultMetrics = [
        {
            id: 'met-1',
            label: 'Global Investor Network',
            description: 'Access to institutional investors, family offices, and strategic partners across multiple regions.'
        },
        {
            id: 'met-2',
            label: 'Strategic Investment Mandates',
            description: 'Tailored mandates aligned with institutional risk, governance, and return expectations.'
        },
        {
            id: 'met-3',
            label: 'Cross-Border Transactions Facilitated',
            description: 'Structured capital flows and transactions executed across ASEAN and global markets.'
        }
    ];

    const defaultStyles = {
        backgroundColor: '',
        textColor: '',
        boxColor: '',
        titleFontSize: 32,
        subtitleFontSize: 16,
        signalFontSize: 13,
        metricLabelFontSize: 15,
        metricDescFontSize: 13,
        textAlign: 'left'
    };

    const { content } = usePageContent('home', {
        trustTitle: 'Trust & Credibility',
        trustSubtitle: 'Institutional-grade structuring, governance and investor alignment for cross-border capital.',
        trustSignals: defaultSignals,
        trustMetrics: defaultMetrics,
        trustSectionStyles: defaultStyles
    });

    const title = content.trustTitle || 'Trust & Credibility';
    const subtitle = content.trustSubtitle || 'Institutional-grade structuring, governance and investor alignment for cross-border capital.';
    const signals = Array.isArray(content.trustSignals) && content.trustSignals.length > 0 ? content.trustSignals : defaultSignals;
    const metrics = Array.isArray(content.trustMetrics) && content.trustMetrics.length > 0 ? content.trustMetrics : defaultMetrics;
    const sectionStyles = content.trustSectionStyles || defaultStyles;

    const useLightBand = isLight && typeof lightBandIndex === 'number' && Number.isFinite(lightBandIndex);
    const lightBandClass = useLightBand ? `lm-band-${lightBandAt(lightBandIndex)}` : '';

    const sectionStyle = {};
    if (isLight) {
        if (!useLightBand) sectionStyle.background = '#f1f5f9';
        sectionStyle.color = '#0f172a';
    } else if (sectionStyles.backgroundColor) {
        const v = (sectionStyles.backgroundColor || '').trim();
        if (v.startsWith('linear-gradient') || v.startsWith('radial-gradient')) {
            sectionStyle.background = v;
        } else {
            sectionStyle.backgroundColor = v || '#020617';
        }
    }
    if (!isLight && sectionStyles.textColor) {
        sectionStyle.color = sectionStyles.textColor;
    }
    const boxBg = isLight
        ? 'rgba(255, 255, 255, 0.95)'
        : (sectionStyles.boxColor || 'rgba(15, 23, 42, 0.9)');
    const titleFontSizePx = sectionStyles.titleFontSize ?? 32;
    const subtitleFontSizePx = sectionStyles.subtitleFontSize ?? 16;
    const signalFontSizePx = sectionStyles.signalFontSize ?? 13;
    const metricLabelFontSizePx = sectionStyles.metricLabelFontSize ?? 15;
    const metricDescFontSizePx = sectionStyles.metricDescFontSize ?? 13;
    const textAlign = sectionStyles.textAlign || 'left';

    const signalsJustify =
        textAlign === 'right' ? 'flex-end' :
            textAlign === 'center' ? 'center' :
                'flex-start';

    const getMetricIcon = (index) => {
        if (index === 0) return Globe;
        if (index === 1) return Scale;
        if (index === 2) return ArrowRightLeft;
        return ShieldCheck;
    };

    return (
        <section className={`${styles.trustStrip} ${lightBandClass}`.trim()} style={sectionStyle}>
            <div className="container">
                <div className={styles.inner}>
                    <div className={styles.headerRow}>
                        <div className={styles.heading} style={{ textAlign }}>
                            <h2
                                className="section-title"
                                style={{ fontSize: `${titleFontSizePx}px`, marginBottom: '0.4rem' }}
                            >
                                {title}
                            </h2>
                            {subtitle && (
                                <p
                                    className={styles.subtitle}
                                    style={{ fontSize: `${subtitleFontSizePx}px` }}
                                >
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        <div className={styles.signals} style={{ justifyContent: signalsJustify }}>
                            {signals.map((signal) => (
                                <div
                                    key={signal.id || signal.label}
                                    className={styles.signalPill}
                                    style={{ background: boxBg, fontSize: `${signalFontSizePx}px` }}
                                >
                                    <ShieldCheck size={16} className={styles.signalIcon} />
                                    <span>{signal.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {metrics.length > 0 && (
                        <div className={styles.metricsRow}>
                            {metrics.map((metric, index) => {
                                const Icon = getMetricIcon(index);
                                return (
                                    <div key={metric.id || metric.label} className={styles.metricCard} style={{ background: boxBg }}>
                                        <div className={styles.metricIconWrap}>
                                            <Icon size={20} className={styles.metricIcon} />
                                        </div>
                                        <div className={styles.metricContent}>
                                            <div className={styles.metricLabel} style={{ fontSize: `${metricLabelFontSizePx}px` }}>{metric.label}</div>
                                            {metric.description && (
                                                <div className={styles.metricDescription} style={{ fontSize: `${metricDescFontSizePx}px` }}>{metric.description}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TrustStrip;

