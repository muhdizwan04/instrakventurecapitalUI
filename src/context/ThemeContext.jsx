import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePageContent } from '../hooks/usePageContent';
import { DEFAULT_CLIENT_THEME_MODE } from '../theme/clientThemeDefaults';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Read admin-set default from Supabase
    const { content: themeSettings, loading } = usePageContent('theme_settings', {
        defaultTheme: DEFAULT_CLIENT_THEME_MODE,
    });

    const [theme, setTheme] = useState(() => {
        // Check localStorage first for user preference
        const saved = localStorage.getItem('instrak-theme');
        if (saved === 'dark' || saved === 'light') return saved;
        if (saved === 'night') {
            localStorage.setItem('instrak-theme', 'dark');
            return 'dark';
        }
        return DEFAULT_CLIENT_THEME_MODE;
    });

    // Once Supabase loads, if user has no localStorage preference, use admin default
    useEffect(() => {
        if (!loading && themeSettings?.defaultTheme) {
            const saved = localStorage.getItem('instrak-theme');
            if (!saved) {
                setTheme(themeSettings.defaultTheme === 'light' ? 'light' : DEFAULT_CLIENT_THEME_MODE);
            }
        }
    }, [loading, themeSettings]);

    // Apply theme to <html> element
    useEffect(() => {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('instrak-theme', next);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
    return ctx;
};

export default ThemeContext;
