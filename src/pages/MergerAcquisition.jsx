import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const MergerAcquisition = () => {
    const defaultContent = {
        title: 'MERGER & ACQUISITION (M&A)',
        subtitle: 'Expert guidance through complex M&A transactions, negotiations, and strategic integrations.',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'merger-acquisition') || defaultContent;

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} />
            ))}

            {/* Form Section */}
            <StyledFormSection
                serviceId="merger-acquisition"
                serviceName="Merger & Acquisition"
                title="Inquire About M&A Advisory"
            />
        </div>
    );
};

export default MergerAcquisition;
