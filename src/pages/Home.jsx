import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Industries from '../components/Industries';
import { usePageContent } from '../hooks/usePageContent';

// Map section IDs to components
const SECTION_COMPONENTS = {
    hero: Hero,
    services: Services,
    industries: Industries,
};

const Home = () => {
    // Fetch home content including section order
    const { content } = usePageContent('home', { 
        tabOrder: ['hero', 'services', 'industries'] 
    });

    // Get section order from database or use default
    const sectionOrder = content.tabOrder || ['hero', 'services', 'industries'];

    return (
        <>
            {sectionOrder.map((sectionId) => {
                const SectionComponent = SECTION_COMPONENTS[sectionId];
                if (!SectionComponent) return null;
                return <SectionComponent key={sectionId} />;
            })}
        </>
    );
};

export default Home;
