import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const ShareFinancing = () => {
    const defaultContent = {
        title: 'SHARE FINANCING (SF)',
        subtitle: 'Liquidity solutions through strategic share-backed financing.',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'share-financing') || defaultContent;

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} />
            ))}

            {/* Form Section */}
            <StyledFormSection
                serviceId="share-financing"
                serviceName="Share Financing"
                title="Inquire About Share Financing"
            />
        </div>
    );
};

export default ShareFinancing;
