import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const REITs = () => {
    const defaultContent = {
        title: 'REAL ESTATE INVESTMENT TRUST (REITs)',
        subtitle: 'Strategic real estate investment opportunities through structured trusts.',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'reits') || defaultContent;

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} />
            ))}

            {/* Form Section */}
            <StyledFormSection
                serviceId="reits"
                serviceName="REITs"
                title="Inquire About REITs"
            />
        </div>
    );
};

export default REITs;
