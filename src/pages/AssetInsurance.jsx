import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const AssetInsurance = () => {
    const defaultContent = {
        title: 'ASSET INSURANCE (AI)',
        subtitle: 'Comprehensive asset protection and insurance solutions for institutional clients.',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'asset-insurance') || defaultContent;

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} lightBandIndex={idx} />
            ))}

            {/* Form Section */}
            <StyledFormSection
                serviceId="asset-insurance"
                serviceName="Asset Insurance"
                title="Inquire About Asset Insurance"
            />
        </div>
    );
};

export default AssetInsurance;
