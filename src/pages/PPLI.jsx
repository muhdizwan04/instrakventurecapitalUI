import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const PPLI = () => {
    const defaultContent = {
        title: 'PRIVATE PLACEMENT LIFE INSURANCE (PPLI)',
        subtitle: 'Sophisticated life insurance solutions for wealth preservation and estate planning.',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'ppli') || defaultContent;

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} />
            ))}

            {/* Form Section */}
            <StyledFormSection
                serviceId="ppli"
                serviceName="PPLI"
                title="Inquire About PPLI Solutions"
            />
        </div>
    );
};

export default PPLI;
