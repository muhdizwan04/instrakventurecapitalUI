import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ isVisible, message = "Loading..." }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200">
                <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
                <p className="text-sm font-medium text-gray-700">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
