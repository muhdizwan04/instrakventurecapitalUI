import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import StyledFormSection from '../components/StyledFormSection';
import UniversalSection from '../components/UniversalSection';

const PrivateWealthInvestment = () => {
    const defaultContent = {
        title: 'PRIVATE WEALTH INVESTMENT (PWI)',
        subtitle: 'Elite wealth management and bespoke investment solutions.',
        sections: []
    };

    const { content: servicePages } = usePageContent('service_pages', { pages: [] });
    const pageContent = servicePages.pages?.find(p => p.id === 'private-wealth') || defaultContent;

    return (
        <div className="page-wrapper">
            {/* All Sections (including hero) */}
            {(pageContent.sections || []).map((section, idx) => (
                <UniversalSection key={section.id || idx} section={section} lightBandIndex={idx} />
            ))}

            {/* Form Section */}
            <StyledFormSection
                serviceId="private-wealth"
                serviceName="Private Wealth Investment"
                title="Inquire About Private Wealth"
            />
        </div>
    );
};

export default PrivateWealthInvestment;
