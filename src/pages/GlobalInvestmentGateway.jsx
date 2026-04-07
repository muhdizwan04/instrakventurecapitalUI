import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const GlobalInvestmentGateway = () => {
    const defaultContent = {
        title: 'GLOBAL INVESTMENT GATEWAY (GIG)',
        subtitle: 'Your structured entry point to global capital markets and strategic partners.',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'gig') || defaultContent;

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} lightBandIndex={idx} />
            ))}

            {/* Form Section */}
            <StyledFormSection
                serviceId="gig"
                serviceName="Global Investment Gateway"
                title="Inquire About GIG"
            />
        </div>
    );
};

export default GlobalInvestmentGateway;
