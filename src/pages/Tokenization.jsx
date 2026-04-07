import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const Tokenization = () => {
    const defaultContent = {
        title: 'TOKENIZATION',
        subtitle: 'Digital asset tokenization solutions for modern investment structures.',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'tokenization') || defaultContent;

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} lightBandIndex={idx} />
            ))}

            {/* Form Section */}
            <StyledFormSection
                serviceId="tokenization"
                serviceName="Tokenization"
                title="Inquire About Tokenization Solutions"
            />
        </div>
    );
};

export default Tokenization;
