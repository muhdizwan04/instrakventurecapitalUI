import React, { createContext, useContext, useState, useCallback } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Loading...');

    const showLoading = useCallback((msg = 'Loading...') => {
        setMessage(msg);
        setLoading(true);
    }, []);

    const hideLoading = useCallback(() => {
        setLoading(false);
    }, []);

    // Wrapper function to execute an async task with loading state
    const withLoading = useCallback(async (asyncFn, msg = 'Please wait...') => {
        showLoading(msg);
        try {
            return await asyncFn();
        } finally {
            hideLoading();
        }
    }, [showLoading, hideLoading]);

    return (
        <LoadingContext.Provider value={{ loading, showLoading, hideLoading, withLoading }}>
            {children}
            <LoadingOverlay isVisible={loading} message={message} />
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export default LoadingContext;
