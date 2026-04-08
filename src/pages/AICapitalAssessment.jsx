import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageContent } from '../hooks/usePageContent';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { useAuth } from '../context/AuthContext';
import PageHero from '../components/PageHero';
import UniversalSection from '../components/UniversalSection';
import { useTheme } from '../context/ThemeContext';
import { Loader2, CheckCircle2, AlertTriangle, Lock, LogIn, UserPlus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const DEFAULT_CONFIG = {
  title: 'AI Capital Assessment',
  subtitle:
    'Answer a few questions to understand your capital readiness and which IVC services are most relevant.',
  steps: [
    {
      id: 'company-profile',
      title: 'Company Profile',
      description: 'Tell us who you are.',
      questions: [
        {
          id: 'industry',
          label: 'Industry sector',
          type: 'select',
          options: [
            'Manufacturing',
            'Real Estate',
            'Technology',
            'Energy',
            'Logistics',
            'Financial Services',
            'Other',
          ],
          required: true,
        },
        { id: 'country', label: 'Country of operation', type: 'text', required: true },
        {
          id: 'stage',
          label: 'Business stage',
          type: 'select',
          options: ['Startup', 'Growth', 'Mature', 'Pre-IPO'],
          required: true,
        },
      ],
    },
    {
      id: 'financial-profile',
      title: 'Financial Profile',
      description: 'High-level financial snapshot.',
      questions: [
        {
          id: 'revenueRange',
          label: 'Annual revenue range (USD)',
          type: 'select',
          options: ['< 1M', '1M – 5M', '5M – 20M', '20M – 100M', '> 100M'],
          required: true,
        },
        {
          id: 'assetValue',
          label: 'Estimated asset value (USD)',
          type: 'select',
          options: ['< 5M', '5M – 25M', '25M – 100M', '> 100M'],
          required: false,
        },
        {
          id: 'ebitdaMargin',
          label: 'EBITDA margin',
          type: 'select',
          options: ['Negative', '0 – 10%', '10 – 20%', '> 20%'],
          required: true,
        },
      ],
    },
    {
      id: 'capital-requirements',
      title: 'Capital Requirements',
      description: 'What capital are you seeking?',
      questions: [
        {
          id: 'capitalAmount',
          label: 'Amount of capital required (USD)',
          type: 'select',
          options: ['< 3M', '3M – 10M', '10M – 50M', '> 50M'],
          required: true,
        },
        {
          id: 'capitalUse',
          label: 'Intended use of funds',
          type: 'multi-select',
          options: ['Expansion', 'Acquisition', 'Real estate development', 'Refinancing'],
          required: true,
        },
      ],
    },
    {
      id: 'governance',
      title: 'Governance & Compliance',
      description: 'Governance readiness.',
      questions: [
        {
          id: 'auditedFS',
          label: 'Do you have audited financial statements for the last 2–3 years?',
          type: 'select',
          options: ['Yes', 'In progress', 'No'],
          required: true,
        },
        {
          id: 'governance',
          label: 'Corporate governance structure',
          type: 'select',
          options: ['Board + independent directors', 'Board only', 'Founder-led / informal'],
          required: true,
        },
      ],
    },
    {
      id: 'strategy',
      title: 'Strategic Direction',
      description: 'Longer-term capital plans.',
      questions: [
        {
          id: 'ipoPlans',
          label: 'Are you considering an IPO within the next 3–5 years?',
          type: 'select',
          options: ['Yes', 'Maybe', 'No'],
          required: false,
        },
        {
          id: 'equityOpenness',
          label: 'Openness to equity participation from institutional investors',
          type: 'select',
          options: ['High', 'Medium', 'Low'],
          required: true,
        },
      ],
    },
  ],
};

const DEFAULT_LAYOUT_SECTIONS = [
  {
    id: 'how-it-works',
    title: 'How this assessment works',
    subtitle: 'Five short steps, less than 5 minutes',
    content:
      'Answer a focused set of questions on your company profile, financials, governance and capital needs. Our model then calculates a Capital Readiness Score and maps you to the most relevant IVC services.',
    position: 'before',
    styles: {
      bgColor: '#FFFFFF',
      titleColor: '#1A365D',
      subtitleColor: '#64748B',
      textColor: '#4A5568',
      contentAlign: 'left',
    },
  },
  {
    id: 'what-you-get',
    title: 'What you will receive',
    subtitle: '',
    content:
      'A Capital Readiness Score, a simple banding (Early / Developing / Institutional Ready), and a clear view of which IVC services are most relevant to your situation.',
    position: 'before',
    styles: {
      bgColor: '#F7FAFC',
      titleColor: '#1A365D',
      subtitleColor: '#64748B',
      textColor: '#4A5568',
      contentAlign: 'left',
    },
  },
];

const DEFAULT_LAYOUT = {
  pageHero: {
    title: 'AI Capital Assessment',
    subtitle:
      'A guided, institutional-grade assessment of your capital readiness and the IVC services that fit best for your situation.',
    styles: {
      titleColor: '#FFFFFF',
      subtitleColor: '#E2E8F0',
      textColor: '#E2E8F0',
      bgColor: '#0A2540',
      bgGradient: '#1A365D',
      textAlign: 'center',
      subtitleAlign: 'center',
    },
  },
  sections: DEFAULT_LAYOUT_SECTIONS,
  wizardStyles: {
    bgColor: '#020617',
    bgGradient: '#020617',
    cardBgColor: 'rgba(15,23,42,0.96)',
    cardBorderColor: 'rgba(148,163,184,0.45)',
    titleColor: '#F9FAFB',
    textColor: '#E2E8F0',
  },
  results: {
    title: 'AI Capital Assessment Result',
    intro:
      'Based on your responses, here is a high-level view of your capital readiness and which IVC services may be most relevant.',
    scoreLabel: 'Capital Readiness Score',
    summaryTitle: 'Summary',
    summaryBody:
      'This score is not a credit rating. It is a directional indicator of how prepared your company is for institutional capital.',
    recommendationsTitle: 'Recommended IVC Services',
    recommendationsEmpty:
      'We were not able to determine a clear service fit from your answers. Please contact our advisory team for a direct discussion.',
    risksTitle: 'Key Considerations',
    risksEmpty:
      'No major governance or financial red flags were identified from your answers. Our team can help you structure the most appropriate capital pathway.',
    nextStepsTitle: 'Next Steps',
    nextStepsBody:
      'Share these results with our advisory team to discuss a tailored capital roadmap for your company.',
    primaryCtaLabel: 'Speak With An Advisor',
    primaryCtaHref: '/contact',
    secondaryCtaLabel: 'Start Over',
  },
};

const AICapitalAssessment = () => {
  const { content, loading } = usePageContent('ai_capital_assessment', DEFAULT_CONFIG);
  const {
    content: layoutContent,
    loading: layoutLoading,
  } = usePageContent('ai_assessment_page', DEFAULT_LAYOUT);
  const { user, loading: authLoading } = useAuth();
  const { submitForm } = useFormSubmit('ai-capital-assessment');
  const saveStartedRef = useRef(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Persist assessment result to inquiries when user reaches results screen (once per session)
  useEffect(() => {
    if (!submitted || !result) return;
    if (saveStartedRef.current) return;
    saveStartedRef.current = true;
    submitForm(
      {
        name: 'AI Assessment',
        email: 'assessment@instrak.internal',
        message: 'Capital Readiness Assessment completed.',
      },
      {
        assessmentScore: result.score,
        assessmentBand: result.band,
        recommendedServices: result.recommendedServices || [],
        risks: result.risks || [],
        answers: { ...answers },
      }
    );
  }, [submitted, result, answers, submitForm]);

  const cfg = content && content.steps?.length ? content : DEFAULT_CONFIG;
  const steps = cfg.steps || [];
  const step = steps[stepIndex];

  const layout = layoutContent || DEFAULT_LAYOUT;
  const pageHero = layout.pageHero || DEFAULT_LAYOUT.pageHero;
  const sections =
    Array.isArray(layout.sections) && layout.sections.length > 0
      ? layout.sections
      : DEFAULT_LAYOUT_SECTIONS;
  const wizardStyles = layout.wizardStyles || DEFAULT_LAYOUT.wizardStyles;
  const resultsConfig = layout.results || DEFAULT_LAYOUT.results;

  const sectionsBefore = sections.filter((s) => !s.position || s.position === 'before');
  const sectionsAfter = sections.filter((s) => s.position === 'after');

  const phSt = pageHero.styles || {};
  const ws = wizardStyles;
  const aiHeroStyle = isLight
    ? phSt.bgGradient
      ? { background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }
      : { background: '#f8fafc' }
    : phSt.bgGradient
      ? { background: `linear-gradient(135deg, ${phSt.bgColor || '#0A2540'}, ${phSt.bgGradient})` }
      : { background: phSt.bgColor };
  const aiHeroSectionStyles = isLight
    ? { ...phSt, titleColor: '#1A365D', subtitleColor: '#475569', textColor: '#475569' }
    : phSt;
  const aiWizardShellStyle = isLight
    ? { background: '#eef2f7' }
    : ws.bgGradient
      ? { background: `linear-gradient(135deg, ${ws.bgColor || '#020617'}, ${ws.bgGradient})` }
      : { background: ws.bgColor || 'transparent' };
  const aiWizardCardStyle = isLight
    ? {
        backgroundColor: '#ffffff',
        borderColor: 'rgba(15, 23, 42, 0.12)',
        color: '#0f172a',
      }
    : {
        backgroundColor: ws.cardBgColor,
        borderColor: ws.cardBorderColor,
        color: ws.textColor,
      };

  if ((loading && !steps.length) || layoutLoading || authLoading) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[var(--accent-primary)]" size={40} />
      </div>
    );
  }

  // Not logged in: show hero + sections, then login gate instead of wizard
  if (!user) {
    return (
      <div className="page-wrapper">
        <Toaster position="top-right" />
        <PageHero
          title={pageHero.title}
          subtitle={pageHero.subtitle}
          lightBandIndex={0}
          sectionStyles={aiHeroSectionStyles}
          style={aiHeroStyle}
        />
        {sectionsBefore.map((section, idx) => (
          <UniversalSection key={section.id || section.title} section={section} lightBandIndex={idx + 1} />
        ))}
        <div
          className="ai-assessment-wizard"
          style={aiWizardShellStyle}
        >
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-10 md:py-12 pb-16 md:pb-20">
            <header className="wizard-intro">
              <h1 className="wizard-intro-title text-2xl md:text-3xl font-heading mb-2">
                {cfg.title}
              </h1>
              <p className="wizard-intro-subtitle text-sm md:text-base max-w-2xl">
                {cfg.subtitle}
              </p>
            </header>
            <div
              className="glass-card wizard-card"
              style={{
                ...aiWizardCardStyle,
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: isLight ? 'rgba(184, 134, 11, 0.15)' : 'rgba(201, 162, 39, 0.2)',
                  color: '#c9a227',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Lock size={28} />
                </div>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: isLight ? '#0f172a' : '#f8fafc', marginBottom: '0.5rem' }}>
                Register Now
              </h2>
              <p style={{ color: isLight ? 'rgba(51, 65, 85, 0.95)' : 'rgba(226, 232, 240, 0.9)', fontSize: '0.9375rem', marginBottom: '1.5rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
                Sign in or create an account to take the Capital Readiness Assessment and receive your score and recommendations.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                <Link
                  to="/login"
                  state={{ from: { pathname: '/ai-capital-assessment' } }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.25rem',
                    background: 'linear-gradient(135deg, #c9a227 0%, #b8860b 100%)',
                    color: '#020617',
                    fontWeight: 600,
                    borderRadius: 10,
                    fontSize: '0.9375rem',
                    textDecoration: 'none',
                  }}
                >
                  <LogIn size={18} /> Sign in
                </Link>
                <Link
                  to="/register"
                  state={{ from: { pathname: '/ai-capital-assessment' } }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.25rem',
                    background: 'transparent',
                    color: isLight ? '#334155' : '#e2e8f0',
                    border: isLight ? '1px solid rgba(15, 23, 42, 0.2)' : '1px solid rgba(148, 163, 184, 0.5)',
                    fontWeight: 500,
                    borderRadius: 10,
                    fontSize: '0.9375rem',
                    textDecoration: 'none',
                  }}
                >
                  <UserPlus size={18} /> Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
        {sectionsAfter.map((section, idx) => (
          <UniversalSection key={section.id || section.title} section={section} lightBandIndex={sectionsBefore.length + 1 + idx} />
        ))}
      </div>
    );
  }

  const handleChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleMultiChange = (question, option) => {
    const existing = answers[question.id] || [];
    const set = new Set(existing);
    if (set.has(option)) set.delete(option);
    else set.add(option);
    setAnswers((prev) => ({ ...prev, [question.id]: Array.from(set) }));
  };

  const validateStep = () => {
    if (!step) return false;
    for (const q of step.questions || []) {
      if (!q.required) continue;
      const val = answers[q.id];
      if (q.type === 'multi-select') {
        if (!Array.isArray(val) || val.length === 0) return false;
      } else if (!val || String(val).trim() === '') {
        return false;
      }
    }
    return true;
  };

  const computeScoreAndRecommendations = () => {
    let score = 50;
    const recs = new Set();
    const risks = [];

    const stage = answers.stage;
    if (stage === 'Pre-IPO') score += 20;
    else if (stage === 'Growth' || stage === 'Mature') score += 15;
    else if (stage === 'Startup') score += 5;

    const ebitda = answers.ebitdaMargin;
    if (ebitda === 'Negative') {
      score -= 15;
      risks.push('Negative EBITDA');
    } else if (ebitda === '0 – 10%') score += 5;
    else if (ebitda === '10 – 20%') score += 10;
    else if (ebitda === '> 20%') score += 15;

    if (answers.auditedFS === 'Yes') score += 15;
    else if (answers.auditedFS === 'In progress') score += 5;
    else {
      score -= 15;
      risks.push('No audited financial statements');
    }

    if (answers.governance === 'Board + independent directors') score += 10;
    else if (answers.governance === 'Board only') score += 5;
    else {
      score -= 10;
      risks.push('Informal governance structure');
    }

    const uses = answers.capitalUse || [];
    if (uses.includes('Expansion') || uses.includes('Acquisition')) {
      recs.add('equity-financing');
      recs.add('virtual-cfo');
      recs.add('merger-acquisition');
    }
    if (uses.includes('Real estate development')) {
      recs.add('real-estate-financing');
      recs.add('reits');
    }
    if (uses.includes('Refinancing')) {
      recs.add('share-financing');
      recs.add('asset-insurance');
    }

    if (stage === 'Startup') {
      recs.add('virtual-cfo');
    }

    if (score < 0) score = 0;
    if (score > 100) score = 100;

    let band = 'Moderate';
    if (score < 40) band = 'Early / Foundational';
    else if (score >= 40 && score < 70) band = 'Developing';
    else band = 'Institutional Ready';

    return {
      score,
      band,
      recommendedServices: Array.from(recs),
      risks,
    };
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (stepIndex < steps.length - 1) {
      setStepIndex((s) => s + 1);
    } else {
      const res = computeScoreAndRecommendations();
      setResult(res);
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    setStepIndex((s) => (s > 0 ? s - 1 : 0));
  };

  if (submitted && result) {
    const serviceLabels = {
      'virtual-cfo': 'Business Finance Consulting – Virtual CFO',
      'equity-financing': 'Equity Financing (EF)',
      'real-estate-financing': 'Real Estate Financing (REF)',
      reits: 'Real Estate Investment Trusts (REITs)',
      'share-financing': 'Share Financing (SF)',
      'merger-acquisition': 'Merger & Acquisition (M&A)',
      tokenization: 'Tokenization (Tz)',
      'asset-insurance': 'Asset Insurance (AI)',
      gig: 'Global Investment Gateway (GIG)',
      aum: 'Asset Under Management (AUM)',
      'private-wealth': 'Private Wealth Investment – The Luxury Dubai',
    };

    const serviceLinks = {
      'virtual-cfo': '/services/virtual-cfo',
      'equity-financing': '/services/equity-financing',
      'real-estate-financing': '/services/real-estate-financing',
      reits: '/services/reits',
      'share-financing': '/services/share-financing',
      'merger-acquisition': '/services/merger-acquisition',
      tokenization: '/services/tokenization',
      'asset-insurance': '/services/asset-insurance',
      gig: '/services/gig',
      aum: '/services/aum',
      'private-wealth': '/services/private-wealth',
    };

    return (
      <div className="page-wrapper">
        <Toaster position="top-right" />
        <PageHero
          title={pageHero.title}
          subtitle={pageHero.subtitle}
          lightBandIndex={0}
          sectionStyles={aiHeroSectionStyles}
          style={aiHeroStyle}
        />
        {sectionsBefore.map((section, idx) => (
          <UniversalSection key={section.id || section.title} section={section} lightBandIndex={idx + 1} />
        ))}

        <div style={aiWizardShellStyle}>
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-heading text-[var(--accent-primary)] mb-4">
              {resultsConfig.title}
            </h1>
            <p className="text-[var(--text-secondary)] mb-8">{resultsConfig.intro}</p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div
                className="glass-card p-6 md:col-span-1 flex flex-col items-center justify-center"
                style={aiWizardCardStyle}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  {resultsConfig.scoreLabel}
                </div>
                <div className="text-5xl font-heading text-[var(--accent-primary)] mb-2">
                  {result.score}
                </div>
                <div className="text-sm font-semibold text-[var(--accent-secondary)]">
                  {result.band}
                </div>
              </div>

              <div
                className="glass-card p-6 md:col-span-2"
                style={aiWizardCardStyle}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="text-green-500" size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {resultsConfig.summaryTitle}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {resultsConfig.summaryBody}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div
                className="glass-card p-6"
                style={aiWizardCardStyle}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="text-[var(--accent-primary)]" size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {resultsConfig.recommendationsTitle}
                  </span>
                </div>
                {result.recommendedServices.length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)]">
                    {resultsConfig.recommendationsEmpty}
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {result.recommendedServices.map((id) => (
                      <li key={id} className="flex items-center justify-between gap-2">
                        <span>{serviceLabels[id] || id}</span>
                        {serviceLinks[id] && (
                          <a
                            href={serviceLinks[id]}
                            className="text-xs text-[var(--accent-secondary)] hover:underline"
                          >
                            View service
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div
                className="glass-card p-6"
                style={aiWizardCardStyle}
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="text-amber-500" size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {resultsConfig.risksTitle}
                  </span>
                </div>
                {result.risks.length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)]">
                    {resultsConfig.risksEmpty}
                  </p>
                ) : (
                  <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                    {result.risks.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div
              className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4"
              style={aiWizardCardStyle}
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {resultsConfig.nextStepsTitle}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {resultsConfig.nextStepsBody}
                </p>
              </div>
              <div className="flex gap-3">
                {resultsConfig.primaryCtaHref && (
                  <a href={resultsConfig.primaryCtaHref} className="btn-solid text-sm px-5">
                    {resultsConfig.primaryCtaLabel}
                  </a>
                )}
                <button
                  className="btn-outline text-sm px-5"
                  onClick={() => {
                    setSubmitted(false);
                    setResult(null);
                    setStepIndex(0);
                  }}
                >
                  {resultsConfig.secondaryCtaLabel || 'Start Over'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {sectionsAfter.map((section, idx) => (
          <UniversalSection key={section.id || section.title} section={section} lightBandIndex={sectionsBefore.length + 1 + idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Toaster position="top-right" />
      <PageHero
        title={pageHero.title}
        subtitle={pageHero.subtitle}
        lightBandIndex={0}
        sectionStyles={aiHeroSectionStyles}
        style={aiHeroStyle}
      />
      {sectionsBefore.map((section, idx) => (
        <UniversalSection key={section.id || section.title} section={section} lightBandIndex={idx + 1} />
      ))}

      <div
        className="ai-assessment-wizard"
        style={aiWizardShellStyle}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-10 md:py-12 pb-16 md:pb-20">
          <header className="wizard-intro">
            <h1 className="wizard-intro-title text-2xl md:text-3xl font-heading mb-2">
              {cfg.title}
            </h1>
            <p className="wizard-intro-subtitle text-sm md:text-base max-w-2xl">
              {cfg.subtitle}
            </p>
          </header>

          {authLoading ? (
            <div
              className="glass-card wizard-card flex items-center justify-center"
              style={aiWizardCardStyle}
            >
              <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
          ) : !user ? (
            <div
              className="glass-card wizard-card"
              style={aiWizardCardStyle}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isLight ? 'bg-amber-100' : 'bg-slate-800'
                      }`}
                    >
                      <Lock className="text-amber-400" size={18} />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isLight ? 'text-slate-600' : 'text-slate-300'
                        }`}
                      >
                        Sign in required
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          isLight ? 'text-slate-800' : 'text-slate-200'
                        }`}
                      >
                        Log in to start your AI Capital Assessment
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm leading-relaxed max-w-md ${
                      isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    You can review how the assessment works on this page, but you need an account
                    to answer the questions and save your Capital Readiness Score.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/register"
                    state={{ from: { pathname: '/ai-capital-assessment' } }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 transition-colors"
                  >
                    <UserPlus size={14} />
                    Create account
                  </Link>
                  <Link
                    to="/login"
                    state={{ from: { pathname: '/ai-capital-assessment' } }}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      isLight
                        ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                        : 'border-slate-500 text-slate-100 hover:bg-slate-800'
                    }`}
                  >
                    <LogIn size={14} />
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="glass-card wizard-card"
              style={aiWizardCardStyle}
            >
              <div className="wizard-step-header">
                <div className="wizard-step-meta text-xs font-bold uppercase tracking-wider mb-2">
                  Step {stepIndex + 1} of {steps.length}
                </div>
                <h2 className="wizard-step-title font-semibold mb-1">
                  {step.title}
                </h2>
                <p className="wizard-step-desc">{step.description}</p>
              </div>

              <div className="wizard-fields">
                {(step.questions || []).map((q) => (
                  <div key={q.id} className="wizard-field">
                    <label className="block text-sm font-medium">
                      {q.label}
                      {q.required && <span className="text-amber-400 ml-1">*</span>}
                    </label>

                    {q.type === 'select' && (
                      <select
                        value={answers[q.id] || ''}
                        onChange={(e) => handleChange(q, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {(q.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {q.type === 'multi-select' && (
                      <div className="wizard-chips-wrap">
                        {(q.options || []).map((opt) => {
                          const selected = (answers[q.id] || []).includes(opt);
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => handleMultiChange(q, opt)}
                              className={`wizard-chip ${selected ? 'selected' : ''}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {(!q.type || q.type === 'text') && (
                      <input
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleChange(q, e.target.value)}
                        placeholder={q.placeholder || ''}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="wizard-actions">
                <button
                  type="button"
                  className="wizard-btn-back"
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="wizard-btn-next"
                  onClick={handleNext}
                  disabled={!validateStep()}
                >
                  {stepIndex === steps.length - 1 ? 'View Results' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {sectionsAfter.map((section, idx) => (
        <UniversalSection key={section.id || section.title} section={section} lightBandIndex={sectionsBefore.length + 1 + idx} />
      ))}
    </div>
  );
};

export default AICapitalAssessment;

