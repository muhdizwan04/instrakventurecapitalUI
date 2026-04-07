import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget/ChatWidget";
import { usePageContent } from '../hooks/usePageContent';
import { useTheme } from '../context/ThemeContext';
import { resolveClientAccentCssVars } from '../theme/clientThemeDefaults';
import SEO from './SEO';
import { Helmet } from 'react-helmet-async';

const Layout = ({ children }) => {
  const { content: settings } = usePageContent('global_settings');
  const { theme } = useTheme();
  // Admin brand colours apply to Dark mode; Light mode uses a fixed palette for consistency.
  const accents = resolveClientAccentCssVars(theme, theme === 'dark' ? settings?.themeColors : {});
  const themeStyles = `
    html[data-theme="${theme}"] {
      --accent-primary: ${accents.primary};
      --accent-secondary: ${accents.secondary};
      --accent-tertiary: ${accents.tertiary};
    }
  `;

  return (
    <div className="layout">
      <Helmet>
        <style>{themeStyles}</style>
      </Helmet>
      <SEO />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Layout;
