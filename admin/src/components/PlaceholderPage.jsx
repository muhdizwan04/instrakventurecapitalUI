import React from 'react';
import { Hammer } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6 text-[var(--accent-secondary)]">
                <Hammer size={32} />
            </div>
            <h2 className="text-2xl font-bold font-heading mb-2">{title}</h2>
            <p className="text-[var(--text-secondary)]">This content management module is under construction.</p>
        </div>
    );
};

export default PlaceholderPage;
